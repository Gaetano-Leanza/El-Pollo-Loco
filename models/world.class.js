/**
 * Represents the game world containing all game objects, characters, and game logic.
 * @class
 */
class World {
  /** @type {Level} The current game level */
  level;
  /** @type {HTMLCanvasElement} The game canvas element */
  canvas;
  /** @type {CanvasRenderingContext2D} The 2D rendering context for the canvas */
  ctx;
  /** @type {Keyboard} The keyboard input handler */
  keyboard;
  /** @type {number} The camera's x-coordinate offset */
  camera_x = 0;
  /** @type {StatusBar} The health status bar for the character */
  statusBar = new StatusBar("health", 10, 0);
  /** @type {StatusBar} The bottle status bar showing collected bottles */
  bottleBar = new StatusBar("bottle", 10, 60);
  /** @type {StatusBar} The coin status bar showing collected coins */
  coinBar = new StatusBar("coin", 10, 120);
  /** @type {StatusBar} The status bar for the endboss */
  endbossStatusBar;
  /** @type {ThrowableObject[]} Array of currently thrown bottles */
  throwableObjects = [];
  /** @type {number} Timestamp of the last bottle throw */
  lastBottleThrow = 0;
  /** @type {boolean} Flag for debug mode (shows hitboxes) */
  DEBUG_MODE = false;
  /** @type {Endboss} Reference to the endboss enemy */
  endboss;
  /** @type {boolean} Flag indicating if the endboss is activated */
  endbossActivated = false;
  /** @type {number} Count of hits on the endboss */
  endbossHitCount = 0;
  /** @type {boolean} Flag indicating if the game is over */
  isGameOver = false;
  /** @type {Object} Collection of game interval IDs */
  intervals = {};
  /** @type {Character} The player character */
  character = new Character();
  /** @type {boolean} Flag indicating if character has landed at least once */
  hasLandedOnce = false;

  /**
   * Creates a new World instance.
   * @constructor
   * @param {HTMLCanvasElement} canvas - The game canvas element
   * @param {Keyboard} keyboard - The keyboard input handler
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    window.character = this.character;
    this.level = level1;
    this.setWorld();
    this.bottleBar.setPercentage(0);

    this.endboss = this.level.enemies.find(
      (enemy) => enemy.constructor.name === "Endboss"
    );

    this.createEndbossStatusBar();
    this.setupEndbossReference();

    this.draw();
    this.run();
  }

  /**
   * Sets the world reference for the character and starts character animation.
   */
  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  /**
   * Starts the main game loops for collision detection and game logic.
   */
  run() {
    this.intervals.checkEnemyCollisions = setInterval(() => {
      this.checkEnemyCollisions();
    }, 1000 / 200);

    this.intervals.gameLogic = setInterval(() => {
      this.checkThrowObjects();
      this.checkItemPickups();
      this.checkProjectileCollisions();
      this.removeDeadEnemies();
    }, 100);
  }

  /**
   * Creates the status bar for the endboss.
   */
  createEndbossStatusBar() {
    this.endbossStatusBar = new StatusBar(
      "endboss",
      this.canvas.width - 220,
      10
    );
    this.endbossStatusBar.setPercentage(100);
  }

  /**
   * Registers a hit on the endboss and updates its status bar.
   * @param {number} energy - The current energy level of the endboss
   */
  registerEndbossHit(energy) {
    if (this.endbossStatusBar && this.endbossActivated) {
      this.endbossStatusBar.setPercentage(energy);
    }
    this.endbossHitCount++;
  }

  /**
   * Main draw function that renders the game world.
   */
  draw() {
    if (this.isGameOver) return;

    this.clearCanvas();
    this.updateEndbossActivation();
    this.updateCamera();
    this.updateGameObjects();
    this.renderWorld();
    this.renderUI();
    this.scheduleNextFrame();
    Coin.drawCounter(
      this.ctx,
      this.canvas.width,
      this.character.collectedCoins
    );
  }

  /**
   * Clears the canvas for the next frame.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Activates the endboss when the character reaches a certain position.
   */
  updateEndbossActivation() {
    if (this.endboss && this.character.x > 3000 && !this.endbossActivated) {
      this.endbossActivated = true;

      if (!this.endboss.worldReference) {
        this.endboss.worldReference = this;
      }
    }
  }

  /**
   * Updates the camera position based on character position.
   */
  updateCamera() {
    this.camera_x = -this.character.x + 100;
  }

  /**
   * Updates all game objects that need per-frame updates.
   */
  updateGameObjects() {
    this.level.coins.forEach((coin) => coin.update());
  }

  /**
   * Renders all world objects with camera offset.
   */
  renderWorld() {
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);

    this.addToMap(this.character);
    if (this.endboss) this.addToMap(this.endboss);

    this.addObjectsToMap(this.throwableObjects);

    this.ctx.restore();
  }

  /**
   * Renders all UI elements (status bars).
   */
  renderUI() {
    this.statusBar.draw(this.ctx);
    this.bottleBar.draw(this.ctx);
    this.coinBar.draw(this.ctx);
    this.endbossStatusBar.draw(this.ctx);
  }

  /**
   * Schedules the next animation frame.
   */
  scheduleNextFrame() {
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Checks for collisions between the character and enemies.
   */
  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!enemy.isDead && this.character.isColliding(enemy)) {
        this.handleCharacterEnemyCollision(enemy);
      }
    });
  }

  /**
   * Handles the collision between character and enemy.
   * @param {Enemy} enemy - The enemy that collided with the character
   */
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

      if (this.hasLandedOnce) {
        playSound("jump-on-chicken.mp4");
      } else {
        this.hasLandedOnce = true;
      }
    } else if (!this.character.isHurt()) {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
    }
  }

  /**
   * Removes dead enemies from the game.
   */
  removeDeadEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (enemy) => !enemy.shouldBeRemoved
    );
    if (this.endboss && this.endboss.isDead) {
      this.endboss = null;
    }
  }

  /**
   * Checks if a bottle can be thrown based on cooldown and available bottles.
   * @returns {boolean} True if a bottle can be thrown
   */
  canThrowBottle() {
    const now = Date.now();
    const throwCooldown = 500;
    return (
      this.keyboard.D &&
      this.character.collectedBottles > 0 &&
      now - this.lastBottleThrow > throwCooldown
    );
  }

  /**
   * Throws a new bottle projectile.
   */
  throwBottle() {
    let bottle = new ThrowableObject(
      this.character.x + (this.character.otherDirection ? -20 : 100),
      this.character.y + 100,
      this.character.otherDirection
    );
    this.throwableObjects.push(bottle);
    this.character.collectedBottles--;
    this.lastBottleThrow = Date.now();
    this.bottleBar.setPercentage(
      Math.min(
        100,
        (this.character.collectedBottles / this.character.maxBottles) * 100
      )
    );
  }

  /**
   * Checks if a bottle should be thrown based on input.
   */
  checkThrowObjects() {
    if (this.canThrowBottle()) this.throwBottle();
  }

  /**
   * Checks for projectile collisions with enemies and endboss.
   */
  checkProjectileCollisions() {
    this.checkCollisionsWithEnemies();
    this.checkCollisionsWithEndboss();
    this.removeUsedProjectiles();
  }

  /**
   * Checks for collisions between thrown bottles and enemies.
   */
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

  /**
   * Checks for collisions between thrown bottles and the endboss.
   */
  checkCollisionsWithEndboss() {
    if (!this.endboss || this.endboss.isDead) return;

    this.throwableObjects.forEach((bottle) => {
      if (!bottle.isSplashing && bottle.isColliding(this.endboss)) {
        bottle.splash("endboss");
        this.endboss.energy -= 20;
        this.registerEndbossHit(this.endboss.energy);
        if (this.endboss.energy <= 0) {
          this.endboss.isDead = true;
        }
      }
    });
  }

  /**
   * Removes used projectiles from the game.
   */
  removeUsedProjectiles() {
    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.shouldBeRemoved
    );
  }

  /**
   * Checks for item pickups (bottles and coins).
   */
  checkItemPickups() {
    this.checkBottlePickups();
    this.checkCoinPickups();
  }

  /**
   * Checks for bottle pickups by the character.
   */
  checkBottlePickups() {
    this.checkPickups(
      this.level.bottles,
      "collectedBottles",
      "maxBottles",
      this.bottleBar
    );
  }

  /**
   * Checks for coin pickups by the character.
   */
  checkCoinPickups() {
    this.checkPickups(
      this.level.coins,
      "collectedCoins",
      "maxCoins",
      this.coinBar,
      "collectcoin.mp4"
    );
  }

  /**
   * Generic method for handling item pickups.
   * @param {Array} items - Array of items to check
   * @param {string} collectedProp - Property name for collected count
   * @param {string} maxProp - Property name for maximum count
   * @param {StatusBar} statusBar - Status bar to update
   * @param {string} [sound] - Optional sound to play on pickup
   */
  checkPickups(items, collectedProp, maxProp, statusBar, sound) {
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (this.character.isColliding(item)) {
        if (item instanceof Coin) {
          item.collect();
        }

        this.character[collectedProp] = Math.min(
          this.character[collectedProp] + 1,
          this.character[maxProp]
        );
        items.splice(i, 1);
        statusBar.setPercentage(
          (this.character[collectedProp] / this.character[maxProp]) * 100
        );

        if (sound) playSound(sound);
      }
    }
  }

  /**
   * Adds multiple game objects to the map.
   * @param {Array} objects - Array of game objects to add
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Adds a game object to the map with proper transformation.
   * @param {MovableObject} mo - The movable object to add
   */
  addToMap(mo) {
    this.ctx.save();

    if (mo.otherDirection) {
      const flipX =
        mo.constructor.name === "Endboss" || mo === this.endboss ? 1 : -1;
      this.ctx.translate(mo.x + mo.width / 2, 0);
      this.ctx.scale(flipX, 1);
      this.ctx.translate(-(mo.x + mo.width / 2), 0);
    }

    mo.draw(this.ctx);
    if (this.DEBUG_MODE) mo.drawFrame(this.ctx);

    this.ctx.restore();
  }

  /**
   * Sets up the world reference for the endboss.
   */
  setupEndbossReference() {
    if (this.endboss) {
      this.endboss.worldReference = this;
    }
  }
}