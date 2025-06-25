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
  endbossStatusBar;
  throwableObjects = [];
  lastBottleThrow = 0;
  DEBUG_MODE = false;
  endboss;
  endbossActivated = false;
  endbossHitCount = 0;
  currentState = "alert";
  isGameOver = false;
  intervals = {};

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.jumpOnChickenSound = new Audio("audio/jump-on-chicken.mp4");
    this.character = new Character();
    window.character = this.character;
    this.level = level1;
    this.character.world = this;
    this.bottleBar.setPercentage(0);
    this.endboss = this.level.endboss;
    this.createEndbossStatusBar();
    this.setWorld();

    if (this.endboss) {
      this.endboss.worldReference = this;
    }
    this.isGameOver = false;
    this.gameOverImage = null;
    this.draw();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  run() {
    this.intervals.checkEnemyCollisions = setInterval(() => {
      this.checkEnemyCollisions();
    }, 1000 / 144);

    this.intervals.gameLogic = setInterval(() => {
      this.checkThrowObjects();
      this.checkItemPickups();
      this.checkProjectileCollisions();
      this.removeDeadEnemies();
    }, 100);
  }

  createEndbossStatusBar() {
    const x = this.canvas.width - 220;
    const y = 10;
    this.endbossStatusBar = new StatusBar("endboss", x, y);
    this.endbossStatusBar.setPercentage(100);
  }

  registerEndbossHit(energy) {
    if (this.endbossStatusBar) {
      this.endbossStatusBar.setPercentage(energy);
    }
    this.endbossHitCount++;
  }

  draw() {
    if (this.isGameOver) return;

    this.clearCanvas();
    this.updateEndbossActivation();
    this.updateCamera();
    this.updateGameObjects();
    this.renderWorld();
    this.renderUI();
    this.scheduleNextFrame();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateEndbossActivation() {
    if (this.endboss && this.character.x > 3000 && !this.endbossActivated) {
      this.endbossActivated = true;
    }
  }

  updateCamera() {
    this.camera_x = this.endbossActivated
      ? -this.endboss.x + 400
      : -this.character.x + 100;
  }

  updateGameObjects() {
    this.level.coins.forEach((coin) => coin.update());
  }

  renderWorld() {
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);

    this.renderGameObjects();
    this.renderCharacters();
    this.renderProjectiles();

    this.ctx.restore();
  }

  renderGameObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
  }

  renderCharacters() {
    this.addToMap(this.character);

    if (this.endboss) {
      this.addToMap(this.endboss);
    }
  }

  renderProjectiles() {
    this.addObjectsToMap(this.throwableObjects);
  }

  renderUI() {
    this.statusBar.draw(this.ctx);
    this.bottleBar.draw(this.ctx);
    this.coinBar.draw(this.ctx);
    this.endbossStatusBar.draw(this.ctx);
  }

  scheduleNextFrame() {
    requestAnimationFrame(() => this.draw());
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
      enemy.hit();
      this.character.speedY = 20;
      this.character.x += this.character.x < enemy.x ? -15 : 15;

      this.jumpOnChickenSound.currentTime = 0;
      this.jumpOnChickenSound.play();
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
    if (this.endboss && this.endboss.isDead) {
      this.endboss = null;
    }
  }

  canThrowBottle() {
    const now = Date.now();
    const throwCooldown = 500;

    return (
      this.keyboard.D &&
      this.character.collectedBottles > 0 &&
      now - this.lastBottleThrow > throwCooldown
    );
  }

  throwBottle() {
    let bottle = new ThrowableObject(
      this.character.x + (this.character.otherDirection ? -20 : 100),
      this.character.y + 100,
      this.character.otherDirection
    );

    this.throwableObjects.push(bottle);
    this.character.collectedBottles--;
    this.lastBottleThrow = Date.now();

    const bottlePercent = Math.min(
      100,
      (this.character.collectedBottles / this.character.maxBottles) * 100
    );
    this.bottleBar.setPercentage(bottlePercent);
  }

  checkThrowObjects() {
    if (this.canThrowBottle()) {
      this.throwBottle();
    }
  }

  checkProjectileCollisions() {
    this.checkCollisionsWithEnemies();
    this.checkCollisionsWithEndboss();
    this.removeUsedProjectiles();
  }

  checkCollisionsWithEnemies() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead && bottle.isColliding(enemy) && !bottle.isSplashing) {
          bottle.splash("enemy");
          enemy.hit();
        }
      });
    });
  }

  checkCollisionsWithEndboss() {
    if (!this.endboss || this.endboss.isDead) return;

    this.throwableObjects.forEach((bottle) => {
      if (!bottle.isSplashing && bottle.isColliding(this.endboss)) {
        bottle.splash("endboss");
        this.endboss.hit();

        console.log("Endboss getroffen!");
      }
    });
  }

  removeUsedProjectiles() {
    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.shouldBeRemoved
    );
  }

  checkItemPickups() {
    this.checkBottlePickups();
    this.checkCoinPickups();
  }

  checkBottlePickups() {
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
  }

  checkCoinPickups() {
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

        const coinSound = new Audio("audio/collectcoin.mp4");
        coinSound.play();
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
}
