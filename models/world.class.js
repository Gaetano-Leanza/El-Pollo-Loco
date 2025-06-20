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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character = new Character();
    this.level = level1;
    this.character.world = this;
    this.bottleBar = new StatusBar("bottle", 10, 60);
    this.bottleBar.setPercentage(0);
    this.endboss = this.level.endboss;
    this.draw();
    this.setWorld();
    this.run();
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

    if (this.DEBUG_MODE) {
      console.log(
        `Vertical distance: ${verticalDistance}, Falling: ${isFalling}`
      );
    }

    if (isAbove && isFalling && isSmallOverlap) {
      enemy.takeDamage();
      this.character.speedY = 20;
      if (this.character.x < enemy.x) {
        this.character.x -= 15;
      } else {
        this.character.x += 15;
      }

      if (this.DEBUG_MODE) {
        console.log("Chicken killed by jump!");
      }
    } else {
      if (!this.character.isHurt()) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);

        if (this.DEBUG_MODE) {
          console.log("Character hurt by chicken!");
        }
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
      bottle.otherDirection = this.character.otherDirection;
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
        }
      }
    });

    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.shouldBeRemoved
    );
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.endboss && this.character.x > 3000) {
      this.camera_x = -this.endboss.x + 400;
    } else {
      this.camera_x = -this.character.x + 100;
    }

    this.level.coins.forEach((coin) => {
      coin.update();
    });

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

    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.statusBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);

    requestAnimationFrame(() => this.draw());
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
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (this.DEBUG_MODE) {
      mo.drawFrame(this.ctx);
    }

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
