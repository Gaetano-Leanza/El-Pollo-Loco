class World {
  character = new Character();
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar("health", 10, 0);
  bottleBar = new StatusBar("bottle", 10, 60);
  coinBar = new StatusBar("coin", 10, 120);
  throwableObjects = [];
  lastBottleThrow = 0;
  DEBUG_MODE = false;
  endboss;
  endbossActivated = false;
  currentState = "alert";
  endbossMovementInterval;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character = new Character();
    window.character = this.character;
    this.level = level1;
    this.character.world = this;
    this.bottleBar.setPercentage(0);
    this.endboss = this.level.endboss;
    this.setWorld();
    this.run();
    this.draw();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  run() {
    setInterval(() => {
      this.checkEnemyCollisions();
    }, 1000 / 144);

    setInterval(() => {
      this.checkThrowObjects();
      this.checkItemPickups();
      this.checkProjectileCollisions();
      this.removeDeadEnemies();
    }, 100);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.endboss && this.character.x > 3000 && !this.endbossActivated) {
      this.endbossActivated = true;
      this.startEndbossBattle();
    }

    this.camera_x = this.endbossActivated
      ? -this.endboss.x + 400
      : -this.character.x + 100;

    this.level.coins.forEach((coin) => coin.update());

    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);

    this.addToMap(this.character);

    if (this.endboss) {
      this.addToMap(this.endboss);
    }

    this.addObjectsToMap(this.throwableObjects);

    this.ctx.restore();

    this.statusBar.draw(this.ctx);
    this.bottleBar.draw(this.ctx);
    this.coinBar.draw(this.ctx);

    requestAnimationFrame(() => this.draw());
  }

  startEndbossBattle() {
    this.currentState = "alert";

    this.endbossMovementInterval = setInterval(() => {
      if (this.endboss && !this.endboss.isDead()) {
        this.moveEndbossTowardCharacter();
      } else {
        clearInterval(this.endbossMovementInterval);
      }
    }, 1000 / 60);

    this.cycleEndbossAnimation();
  }

  cycleEndbossAnimation() {
    if (!this.endboss || this.endboss.isDead()) return;

    if (this.currentState === "alert") {
      this.endboss.playCustomAnimation(this.endboss.IMAGES_ALERT, 150, () => {
        this.currentState = "walking";
        this.cycleEndbossAnimation();
      });
    } else if (this.currentState === "walking") {
    } else if (this.currentState === "hurt") {
      this.endboss.playCustomAnimation(this.endboss.IMAGES_HURT, 100, () => {
        this.currentState = "alert";
        this.cycleEndbossAnimation();
      });
    }
  }

  moveEndbossTowardCharacter() {
    if (!this.endboss || !this.character || this.currentState !== "walking")
      return;

    const distance = this.character.x - this.endboss.x;
    const speed = 3;

    if (Math.abs(distance) > 20) {
      if (distance > 0) {
        this.endboss.x += speed;
        this.endboss.otherDirection = false;
      } else {
        this.endboss.x -= speed;
        this.endboss.otherDirection = true;
      }

      if (!this.endboss.isPlayingCustomAnimation) {
        this.endboss.playAnimation(this.endboss.IMAGES_WALK);
      }
    }
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!enemy.isDead && this.character.isColliding(enemy)) {
        this.handleCharacterEnemyCollision(enemy);
      }
    });
  }

  handleCharacterEnemyCollision(enemy) {
    const charBox = this.character.getHitbox();
    const enemyBox = enemy.getHitbox();
    const characterBottom = charBox.y + charBox.height;
    const enemyTop = enemyBox.y;
    const verticalDistance = characterBottom - enemyTop;
    const fallingSpeed = this.character.speedY;
    const maxTolerance = 30;
    const isAbove = charBox.y < enemyBox.y;
    const isFalling = fallingSpeed < 0;
    const isSmallOverlap =
      verticalDistance < maxTolerance && verticalDistance > 0;

    if (isAbove && isFalling && isSmallOverlap) {
      enemy.takeDamage();
      this.character.speedY = 20;
      this.character.x += this.character.x < enemy.x ? -15 : 15;
    } else {
      if (!this.character.isHurt()) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    }
  }

  removeDeadEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (enemy) => !enemy.shouldBeRemoved
    );
    if (this.endboss && this.endboss.isDead()) {
      this.endboss = null;
    }
  }

  checkThrowObjects() {
    const now = Date.now();
    const throwCooldown = 500;

    if (
      this.keyboard.D &&
      this.character.collectedBottles > 0 &&
      now - this.lastBottleThrow > throwCooldown
    ) {
      let bottle = new ThrowableObject(
        this.character.x + (this.character.otherDirection ? -20 : 100),
        this.character.y + 100,
        this.character.otherDirection
      );
      this.throwableObjects.push(bottle);
      this.character.collectedBottles--;
      this.lastBottleThrow = now;

      const bottlePercent = Math.min(
        100,
        (this.character.collectedBottles / this.character.maxBottles) * 100
      );
      this.bottleBar.setPercentage(bottlePercent);
    }
  }

  checkProjectileCollisions() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead && bottle.isColliding(enemy) && !bottle.isSplashing) {
          bottle.splash("enemy");
          enemy.takeDamage();
        }
      });

      if (this.endboss && !this.endboss.isDead() && !bottle.isSplashing) {
        if (bottle.isColliding(this.endboss)) {
          bottle.splash("endboss");
          this.endboss.takeDamage();
          if (this.DEBUG_MODE) {
            console.log("Endboss getroffen! Energie:", this.endboss.health);
          }

          if (!this.endboss.isPlayingCustomAnimation) {
            this.currentState = "hurt";
            this.cycleEndbossAnimation();
          }
        }
      }
    });

    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.shouldBeRemoved
    );
  }

  checkItemPickups() {
    for (let i = this.level.bottles.length - 1; i >= 0; i--) {
      const bottle = this.level.bottles[i];
      if (this.character.isColliding(bottle)) {
        this.character.collectedBottles = Math.min(
          this.character.collectedBottles + 1,
          this.character.maxBottles
        );
        this.level.bottles.splice(i, 1);
        this.bottleBar.setPercentage(
          (this.character.collectedBottles / this.character.maxBottles) * 100
        );
      }
    }

    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      const coin = this.level.coins[i];
      if (this.character.isColliding(coin)) {
        this.character.collectedCoins = Math.min(
          this.character.collectedCoins + 1,
          this.character.maxCoins
        );
        this.level.coins.splice(i, 1);
        this.coinBar.setPercentage(
          (this.character.collectedCoins / this.character.maxCoins) * 100
        );
      }
    }
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(mo) {
    this.ctx.save();

    if (mo.otherDirection) {
      if (mo.constructor.name === "Endboss" || mo === this.endboss) {
        this.ctx.translate(mo.x + mo.width / 2, 0);
        this.ctx.scale(1, 1);
        this.ctx.translate(-(mo.x + mo.width / 2), 0);
      } else {
        this.ctx.translate(mo.x + mo.width / 2, 0);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-(mo.x + mo.width / 2), 0);
      }
    }

    mo.draw(this.ctx);

    if (this.DEBUG_MODE) {
      mo.drawFrame(this.ctx);
    }

    this.ctx.restore();
  }

  flipImage(mo) {
    this.ctx.save();
    const screenX = mo.x + this.camera_x;
    this.ctx.translate(screenX + mo.width / 2, 0);
    this.ctx.scale(-1, 1);
    this.ctx.translate(-(screenX + mo.width / 2), 0);
  }

  flipImageBack() {
    this.ctx.restore();
  }
}
