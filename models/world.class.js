/**
 * Main game world class that manages all game objects, collision detection, rendering, and game state.
 * Acts as the central controller coordinating interactions between character, enemies, collectibles, and UI elements.
 * Handles the game loop, camera system, and win/lose conditions.
 */
class World {
  /**
   * The main character instance controlled by the player.
   * @type {Character}
   */
  character = new Character();

  /**
   * Current level containing all enemies, collectibles, and background elements.
   * @type {Level}
   */
  level = level1;

  /**
   * Required number of coins to win the game.
   * @type {number}
   * @default 10
   */
  coinAmount = 10;

  /**
   * HTML5 Canvas element for rendering the game.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * 2D rendering context for drawing on the canvas.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * Keyboard input handler object.
   * @type {Keyboard}
   */
  keyboard;

  /**
   * Camera x-offset for side-scrolling effect.
   * @type {number}
   * @default 0
   */
  camera_x = 0;

  /**
   * Array of UI button objects.
   * @type {Array}
   */
  buttons = [];

  /**
   * Health status bar UI element.
   * @type {Statusbar}
   */
  statusbar_health = new Statusbar("health");

  /**
   * Coin collection status bar UI element.
   * @type {Statusbar}
   */
  statusbar_coin = new Statusbar("coin");

  /**
   * Bottle/salsa status bar UI element.
   * @type {Statusbar}
   */
  statusbar_bottle = new Statusbar("bottle");

  /**
   * Endboss health status bar UI element.
   * @type {Statusbar}
   */
  statusbar_endboss = new Statusbar("endboss");

  /**
   * Array of throwable bottle objects currently in flight.
   * @type {ThrowableObject[]}
   */
  throwableObject = [];

  /**
   * Array of thought bubble UI elements.
   * @type {ThoughtBubble[]}
   */
  thoughtBubble = [];

  /**
   * Flag to prevent multiple thought bubbles from appearing simultaneously.
   * @type {boolean}
   * @default false
   */
  thoughtBubbleActive = false;

  /** @type {boolean} Flag indicating if the player has won the game. */
  hasWon = false;

  /**
   * Game over end screen instance.
   * @type {Endscreen}
   */
  endscreen = new Endscreen(0);

  /**
   * Victory end screen instance.
   * @type {Endscreen}
   */
  endscreen_win = new Endscreen(1);

  /**
   * Creates a new World instance and initializes the game systems.
   * @param {HTMLCanvasElement} canvas - The canvas element to render the game on
   * @param {Keyboard} keyboard - The keyboard input handler
   */
  constructor(canvas, keyboard) {
    this.intervalIds = [];
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.soundManager = SoundManager.instance;
    this.draw();
    this.setWorld();
    this.run();
    this.playSoundsOfEnemies();
  }

  /**
   * Sets up world references for all game objects that need access to the world instance.
   * Establishes bidirectional communication between world and game objects.
   */
  setWorld() {
    this.character.world = this;
    this.soundManager.world = this;
    this.statusbar_endboss.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  /**
   * Starts the main game loop with collision detection and input handling.
   * Sets up two intervals: one at 60fps for core game logic and one at ~6.7fps for throwing.
   */
  run() {
    this.intervalIds.push(
      setStoppableInterval(() => {
        this.checkCollisions();
        this.checkCollectCoin();
        this.checkCollectBottle();
        this.checkThrowObjectsCollision();
        this.checkSoundsOfEnemies();
      }, 1000 / 60)
    );

    this.intervalIds.push(
      setStoppableInterval(() => {
        this.checkThrowObjects();
      }, 150)
    );
  }

  /**
   * Checks if any normal-sized chicken enemies remain in the level.
   * @returns {boolean} True if at least one Chicken enemy exists
   */
  hasChickenEnemiesLeft() {
    return this.level.enemies.some((enemy) => enemy instanceof Chicken);
  }

  /**
   * Checks if any small chicken enemies remain in the level.
   * @returns {boolean} True if at least one ChickenSmall enemy exists
   */
  hasChickenSmallEnemiesLeft() {
    return this.level.enemies.some((enemy) => enemy instanceof ChickenSmall);
  }

  /**
   * Manages enemy sound effects based on remaining enemy types.
   * Stops sounds when no enemies of that type remain.
   */
  checkSoundsOfEnemies() {
    if (!this.hasChickenEnemiesLeft()) {
      this.soundManager.pause("chicken");
    }
    if (!this.hasChickenSmallEnemiesLeft()) {
      this.soundManager.pause("chicken_small");
    }
  }

  /**
   * Starts playing ambient sounds for existing enemy types.
   */
  playSoundsOfEnemies() {
    if (this.hasChickenEnemiesLeft()) {
      this.soundManager.play("chicken");
    }
    if (this.hasChickenSmallEnemiesLeft()) {
      this.soundManager.play("chicken_small");
    }
  }

  /**
   * Handles player input for throwing objects.
   * Checks for throw key/button press and character's bottle inventory.
   */
  checkThrowObjects() {
    if (this.keyboard.D || this.keyboard.throwButtonPressed) {
      if (this.character.salsa != 0) {
        this.throwObject();
      }
      this.keyboard.throwButtonPressed = false;
    }
  }

  /**
   * Creates and launches a throwable bottle object.
   * Updates character's bottle inventory and status bar.
   */
  throwObject() {
    let bottle = new ThrowableObject(
      this.character.x + 10,
      this.character.y + 100
    );
    bottle.world = this;
    this.throwableObject.push(bottle);
    this.soundManager.play("throw");
    this.character.salsa -= 10;
    this.statusbar_bottle.setPercentage(this.character.salsa);
  }

  /**
   * Checks collisions between throwable objects and enemies.
   * Handles bottle impacts and ground collisions with cleanup.
   */
  checkThrowObjectsCollision() {
    const throwableObjectsSnapshot = [...this.throwableObject];
    const enemiesSnapshot = [...this.level.enemies];

    throwableObjectsSnapshot.forEach((bottle) => {
      let bottleRemoved = false;
      enemiesSnapshot.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !bottle.hitEnemy) {
          this.bottleHitsEnemy(enemy, bottle);
          bottleRemoved = true;
        }
      });
      if (!bottleRemoved && bottle.y >= 400) {
        this.removeBottle(bottle);
      }
    });
  }

  /**
   * Handles bottle-enemy collision effects including damage, sounds, and cleanup.
   * @param {MovableObject} enemy - The enemy that was hit by the bottle
   * @param {ThrowableObject} bottle - The bottle that hit the enemy
   */
  bottleHitsEnemy(enemy, bottle) {
    this.soundManager.play("bottle_break");
    bottle.hitEnemy = true;
    enemy.takeDamage();
    this.updateEndbossHealth(enemy);

    if (enemy instanceof Endboss) {
      SoundManager.instance.play("endboss_hit");
    }

    if (enemy.isDead()) {
      this.removeEnemy(enemy);
    }
    this.removeBottle(bottle);
  }

  /**
   * Removes a bottle from the game world after a delay for visual effects.
   * @param {ThrowableObject} bottle - The bottle to remove
   */
  removeBottle(bottle) {
    setTimeout(() => {
      const bottleIndex = this.throwableObject.indexOf(bottle);
      if (bottleIndex !== -1) {
        this.throwableObject.splice(bottleIndex, 1);
      }
    }, 300);
  }

  /**
   * Removes an enemy from the level after death with delay for death animation.
   * Also checks win conditions after enemy removal.
   * @param {MovableObject} enemy - The enemy to remove
   */
  removeEnemy(enemy) {
    this.soundManager.play("damage");
    setTimeout(() => {
      const originalIndex = this.level.enemies.indexOf(enemy);
      if (originalIndex !== -1) {
        this.level.enemies.splice(originalIndex, 1);
        this.checkIfYouWon();
      }
    }, 500);
  }

  /**
   * Updates the endboss health status bar when endboss takes damage.
   * @param {MovableObject} enemy - The enemy that took damage
   */
  updateEndbossHealth(enemy) {
    if (enemy instanceof Endboss) {
      this.statusbar_endboss.setPercentage(enemy.energy);
    }
  }

  /**
   * Handles collisions between character and enemies.
   * Supports both jumping-on-enemy attacks and taking damage from enemies.
   */
  checkCollisions() {
    const enemiesSnapshot = [...this.level.enemies];

    enemiesSnapshot.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        if (this.character.isJumpingOn(enemy)) {
          enemy.takeDamage();
          this.updateEndbossHealth(enemy);
          if (enemy.isDead()) {
            this.removeEnemy(enemy);
          }
          this.character.bounceUp();
        } else {
          this.character.hit();
          this.statusbar_health.setPercentage(this.character.energy);
          if (this.character.isDead()) {
            this.gameOver();
          }
        }
      }
    });
  }

  /**
   * Handles coin collection when character touches coins.
   * Updates wealth status bar and checks win conditions.
   */
  checkCollectCoin() {
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      const item = this.level.coins[i];
      if (this.character.isColliding(item)) {
        this.character.collectCoin();
        this.level.coins.splice(i, 1);
        this.statusbar_coin.setPercentage(this.character.wealth);
        this.checkIfYouWon();
      }
    }
  }

  /**
   * Handles bottle collection when character touches bottles.
   * Updates salsa/bottle status bar inventory.
   */
  checkCollectBottle() {
    for (let i = this.level.bottles.length - 1; i >= 0; i--) {
      const item = this.level.bottles[i];
      if (this.character.isColliding(item)) {
        this.character.collectBottle();
        this.level.bottles.splice(i, 1);
        this.statusbar_bottle.setPercentage(this.character.salsa);
      }
    }
  }

  /**
   * Checks win conditions and displays appropriate feedback.
   * If the Endboss is defeated, the game is won immediately.
   * Shows thought bubbles for partial completion in other cases.
   */
  checkIfYouWon() {
    const endbossAlive = this.level.enemies.some((e) => e instanceof Endboss);

    if (!endbossAlive) {
      this.stopGame();
      this.showWinningScreen();
    } else if (
      this.level.enemies.length == 0 &&
      this.level.coins.length != 0 &&
      !this.thoughtBubbleActive
    ) {
      this.thoughtBubble.push(
        new ThoughtBubble(1, this.character.x + 10, this.character.y + 100)
      );
      this.deleteThoughtBubble();
      this.thoughtBubbleActive = true;
    } else if (
      this.level.enemies.length != 0 &&
      this.level.coins.length == 0 &&
      !this.thoughtBubbleActive
    ) {
      this.thoughtBubble.push(
        new ThoughtBubble(0, this.character.x + 10, this.character.y + 100)
      );
      this.deleteThoughtBubble();
      this.thoughtBubbleActive = true;
    }
  }

  /**
   * Removes thought bubble after 3 seconds and resets the active flag.
   */
  deleteThoughtBubble() {
    setTimeout(() => {
      this.thoughtBubble.splice(0, 1);
      this.thoughtBubbleActive = false;
    }, 3000);
  }

  /**
   * Adds multiple objects to the rendering map.
   * @param {DrawableObject[]} objects - Array of objects to render
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single object to the rendering map with direction-based image flipping.
   * @param {DrawableObject} mO - The movable object to render
   */
  addToMap(mO) {
    if (mO.otherDirection) {
      this.flipImage(mO);
    }

    mO.draw(this.ctx);

    if (mO.otherDirection) {
      this.flipImageBack(mO);
    }
  }

  /**
   * Flips object image horizontally for left-facing direction.
   * @param {DrawableObject} mO - The object to flip
   */
  flipImage(mO) {
    this.ctx.save();
    this.ctx.translate(mO.width, 0);
    this.ctx.scale(-1, 1);
    mO.x = mO.x * -1;
  }

  /**
   * Restores object image to normal orientation after flipping.
   * @param {DrawableObject} mO - The object to restore
   */
  flipImageBack(mO) {
    mO.x = mO.x * -1;
    this.ctx.restore();
  }

  /**
   * Main rendering method that draws all game elements in correct layering order.
   * Handles camera translation for parallax scrolling and UI overlay positioning.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);

    this.ctx.translate(-this.camera_x, 0);
    this.addObjectsToMap(this.buttons);
    this.addToMap(this.statusbar_health);
    this.addToMap(this.statusbar_coin);
    this.addToMap(this.statusbar_bottle);
    this.addToMap(this.statusbar_endboss);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);

    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObject);
    this.addObjectsToMap(this.thoughtBubble);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    this.animationFrame = requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Stops the game by clearing all intervals and canceling animation frames.
   */
  stopGame() {
    this.intervalIds.forEach(clearInterval);
    cancelAnimationFrame(this.animationFrame);
  }

  /** Displays the "You have won" animation or screen. */
  showWinAnimation() {
    this.endscreen_win.show();
  }

  /**
   * Displays the victory screen when player wins.
   * Placeholder for winning screen logic.
   */
  showWinningScreen() {
    stopGame();
    showWinningScreen();
  }

  /**
   * Handles game over scenario when character dies.
   * Stops the game and shows game over screen.
   */
  gameOver() {
    this.stopGame();
    // Add your game over logic here
  }
}
