/**
 * Character class representing the main player character in the game.
 * Extends MovableObject to inherit movement and physics capabilities.
 * Handles character animations, movement, death sequences, and user interactions.
 *
 * @extends MovableObject
 * @class Character
 */
class Character extends MovableObject {
  /**
   * Time in milliseconds before short idle animation starts
   * @static {number}
   */
  static IDLE_TIME_SHORT = 500;

  /**
   * Time in milliseconds before long idle animation starts
   * @static {number}
   */
  static IDLE_TIME_LONG = 3000;

  /**
   * Interval in milliseconds for animation frame updates
   * @static {number}
   */
  static ANIMATION_INTERVAL = 100;

  /**
   * Duration in milliseconds for each death animation frame
   * @static {number}
   */
  static DEATH_ANIMATION_FRAME_DURATION = 150;

  /**
   * Time in milliseconds to display game over screen
   * @static {number}
   */
  static GAME_OVER_DISPLAY_TIME = 3000;

  /**
   * Scale factor for canvas overlay images (0.8 = 80% of canvas size)
   * @static {number}
   */
  static CANVAS_SCALE = 0.8;

  /**
   * Character sprite height in pixels
   * @type {number}
   */
  height = 280;

  /**
   * Character y-position on canvas
   * @type {number}
   */
  y = 80;

  /**
   * Character movement speed in pixels per frame
   * @type {number}
   */
  speed = 10;

  /**
   * Horizontal offset for hitbox positioning from sprite left edge
   * @type {number}
   */
  hitboxOffsetX = 25;

  /**
   * Vertical offset for hitbox positioning from sprite top edge
   * @type {number}
   */
  hitboxOffsetY = 130;

  /**
   * Reduction in hitbox width from sprite width
   * @type {number}
   */
  hitboxWidthReduction = 50;

  /**
   * Reduction in hitbox height from sprite height
   * @type {number}
   */
  hitboxHeightReduction = 160;

  /**
   * Number of coins currently collected by character
   * @type {number}
   */
  collectedCoins = 0;

  /**
   * Maximum number of coins that can be collected
   * @type {number}
   */
  maxCoins = 20;

  /**
   * Number of bottles currently collected by character
   * @type {number}
   */
  collectedBottles = 0;

  /**
   * Maximum number of bottles that can be collected
   * @type {number}
   */
  maxBottles = 20;

  /**
   * Timestamp of last movement for idle animation timing
   * @type {number}
   */
  lastMoveTime = Date.now();

  /**
   * Interval ID for idle animation timer
   * @type {number|undefined}
   */
  idleInterval;

  /**
   * Flag indicating if character is currently throwing a bottle
   * @type {boolean}
   */
  isThrowingBottle = false;

  /**
   * Flag indicating if character is in dying state
   * @type {boolean}
   */
  isDying = false;

  /**
   * Flag indicating if death animation has started
   * @type {boolean}
   */
  deathAnimationStarted = false;

  /**
   * Flag indicating if game over overlay should be shown
   * @type {boolean}
   */
  showGameOverOverlay = false;

  /**
   * Flag to prevent multiple hurt sound plays
   * @type {boolean}
   */
  hurt_sound_played = false;

  /**
   * Reference to the game world object
   * @type {Object}
   */
  world;

  /**
   * Reference to canvas 2D context
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * Reference to HTML canvas element
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * Lazy-loaded hurt sound audio object.
   * Creates and caches audio instance on first access.
   * @returns {Audio} The hurt sound audio object
   */
  get hurt_sound() {
    if (!this._hurt_sound) {
      this._hurt_sound = playSound("hurt-character.mp4");
    }
    return this._hurt_sound;
  }

  /**
   * Lazy-loaded jump sound audio object.
   * Creates and caches audio instance on first access.
   * @returns {Audio} The jump sound audio object
   */
  get jump_sound() {
    if (!this._jump_sound) {
      this._jump_sound = playSound("jump.mp4");
    }
    return this._jump_sound;
  }

  /**
   * Lazy-loaded death sound audio object.
   * Creates and caches audio instance on first access.
   * @returns {Audio} The death sound audio object
   */
  get death_sound() {
    if (!this._death_sound) {
      this._death_sound = playSound("death.mp4");
    }
    return this._death_sound;
  }

  /**
   * Array of walking animation image paths
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "../img/2_character_pepe/2_walk/W-21.png",
    "../img/2_character_pepe/2_walk/W-22.png",
    "../img/2_character_pepe/2_walk/W-23.png",
    "../img/2_character_pepe/2_walk/W-24.png",
    "../img/2_character_pepe/2_walk/W-25.png",
    "../img/2_character_pepe/2_walk/W-26.png",
  ];

  /**
   * Array of jumping animation image paths
   * @type {string[]}
   */
  IMAGES_JUMPING = [
    "../img/2_character_pepe/3_jump/J-31.png",
    "../img/2_character_pepe/3_jump/J-32.png",
    "../img/2_character_pepe/3_jump/J-33.png",
    "../img/2_character_pepe/3_jump/J-34.png",
    "../img/2_character_pepe/3_jump/J-35.png",
    "../img/2_character_pepe/3_jump/J-36.png",
    "../img/2_character_pepe/3_jump/J-37.png",
    "../img/2_character_pepe/3_jump/J-38.png",
    "../img/2_character_pepe/3_jump/J-39.png",
  ];

  /**
   * Array of death animation image paths
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "../img/2_character_pepe/5_dead/D-51.png",
    "../img/2_character_pepe/5_dead/D-52.png",
    "../img/2_character_pepe/5_dead/D-53.png",
    "../img/2_character_pepe/5_dead/D-54.png",
    "../img/2_character_pepe/5_dead/D-55.png",
    "../img/2_character_pepe/5_dead/D-56.png",
    "../img/2_character_pepe/5_dead/D-57.png",
  ];

  /**
   * Array of hurt animation image paths
   * @type {string[]}
   */
  IMAGES_HURT = [
    "../img/2_character_pepe/4_hurt/H-41.png",
    "../img/2_character_pepe/4_hurt/H-42.png",
    "../img/2_character_pepe/4_hurt/H-43.png",
  ];

  /**
   * Array of short idle animation image paths
   * @type {string[]}
   */
  IMAGES_IDLE = [
    "../img/2_character_pepe/1_idle/idle/I-1.png",
    "../img/2_character_pepe/1_idle/idle/I-2.png",
    "../img/2_character_pepe/1_idle/idle/I-3.png",
    "../img/2_character_pepe/1_idle/idle/I-4.png",
    "../img/2_character_pepe/1_idle/idle/I-5.png",
    "../img/2_character_pepe/1_idle/idle/I-6.png",
    "../img/2_character_pepe/1_idle/idle/I-7.png",
    "../img/2_character_pepe/1_idle/idle/I-8.png",
    "../img/2_character_pepe/1_idle/idle/I-9.png",
    "../img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /**
   * Array of long idle animation image paths
   * @type {string[]}
   */
  IMAGES_LONG_IDLE = [
    "../img/2_character_pepe/1_idle/long_idle/I-11.png",
    "../img/2_character_pepe/1_idle/long_idle/I-12.png",
    "../img/2_character_pepe/1_idle/long_idle/I-13.png",
    "../img/2_character_pepe/1_idle/long_idle/I-14.png",
    "../img/2_character_pepe/1_idle/long_idle/I-15.png",
    "../img/2_character_pepe/1_idle/long_idle/I-16.png",
    "../img/2_character_pepe/1_idle/long_idle/I-17.png",
    "../img/2_character_pepe/1_idle/long_idle/I-18.png",
    "../img/2_character_pepe/1_idle/long_idle/I-19.png",
    "../img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /**
   * Creates a new Character instance.
   * Initializes the character with default images and applies gravity.
   * @constructor
   */
  constructor() {
    super();
    this.gameOverHandler = new GameOver();
    this.initializeImages();
    this.applyGravity();
    this.gameOverHandler.loadGameOverImage();
  }

  /**
   * Initializes all character images and loads them into cache.
   * Loads the default walking image and all animation sequences.
   * @private
   */
  initializeImages() {
    this.loadImage("../img/2_character_pepe/2_walk/W-21.png");
    const imageArrays = [
      this.IMAGES_WALKING,
      this.IMAGES_JUMPING,
      this.IMAGES_DEAD,
      this.IMAGES_HURT,
      this.IMAGES_IDLE,
      this.IMAGES_LONG_IDLE,
    ];

    imageArrays.forEach((images) => this.loadImages(images));
  }

  /**
   * Sets the canvas rendering context for the character.
   * Stores references to both context and canvas for rendering operations.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
   */
  setCanvasContext(ctx) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
  }

  /**
   * Calculates centered positioning and scaling for overlay images.
   * Maintains aspect ratio while fitting image within canvas bounds.
   * @param {HTMLCanvasElement} canvas - The target canvas element
   * @param {HTMLImageElement} image - The image to be centered
   * @returns {Object} Object containing x, y, width, height properties for positioning
   */
  calculateCenteredImageBounds(canvas, image) {
    const canvasRatio = canvas.width / canvas.height;
    const imageRatio = image.width / image.height;

    let width, height;

    if (imageRatio > canvasRatio) {
      width = canvas.width * Character.CANVAS_SCALE;
      height = width / imageRatio;
    } else {
      height = canvas.height * Character.CANVAS_SCALE;
      width = height * imageRatio;
    }

    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;

    return { x, y, width, height };
  }

  /**
   * Draws an overlay with semi-transparent background and centered image.
   * Used for game over screens and victory displays.
   * @param {CanvasRenderingContext2D} ctx - The rendering context
   * @param {HTMLCanvasElement} canvas - The canvas element
   * @param {HTMLImageElement} image - The overlay image
   * @param {number} x - X position for image
   * @param {number} y - Y position for image
   * @param {number} width - Width for image
   * @param {number} height - Height for image
   */
  drawOverlay(ctx, canvas, image, x, y, width, height) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, x, y, width, height);
  }

  /**
   * Calculates and returns the character's collision hitbox.
   * Adjusts the hitbox based on offsets and size reductions.
   * @returns {Object} Hitbox object with x, y, width, height properties
   */
  getHitbox() {
    return {
      x: this.x + this.hitboxOffsetX,
      y: this.y + this.hitboxOffsetY,
      width: this.width - this.hitboxWidthReduction,
      height: this.height - this.hitboxHeightReduction,
    };
  }

  /**
   * Handles horizontal movement based on keyboard input.
   * Prevents movement when character is dying and checks level boundaries.
   * @returns {boolean} True if character moved, false otherwise
   */
  handleMovement() {
    if (this.isDying) return false;

    let isMoving = false;
    const keyboard = this.world.keyboard;

    if (keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      isMoving = true;
    }

    if (keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      isMoving = true;
    }

    return isMoving;
  }

  /**
   * Handles jumping behavior based on keyboard input and ground state.
   * Plays jump sound when jump is executed.
   * @param {boolean} isMoving - Whether character is currently moving horizontally
   * @returns {boolean} True if character is jumping or moving, false otherwise
   */
  handleJumping(isMoving) {
    if (this.isDying) return isMoving;

    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
         playSound('jump.mp4');

      return true;
    }
    return isMoving;
  }

  /**
   * Updates the timestamp of last movement for idle animation timing.
   * Only updates if character is moving and not dying.
   * @param {boolean} isMoving - Whether the character is currently moving
   */
  updateLastMoveTime(isMoving) {
    if (isMoving && !this.isDying) {
      this.lastMoveTime = Date.now();
    }
  }

  /**
   * Updates the camera position to follow the character.
   * Camera only follows when character is not dying.
   */
  updateCamera() {
    if (!this.isDying) {
      this.world.camera_x = -this.x + 100;
    }
  }

  /**
   * Starts the animation watcher interval that manages character animations.
   * Handles death, hurt, jumping, walking, and idle animations with priority system.
   */
  startAnimationWatcher() {
    let wasHurt = false;

    this.idleInterval = setInterval(() => {
      if (
        this.handleDeathAnimation() ||
        this.handleHurtAnimation(() => (wasHurt = true)) ||
        this.handleJumpingAnimation() ||
        this.handleWalkingAnimation() ||
        this.isThrowingBottle
      ) {
        if (!this.handleHurtAnimation(() => (wasHurt = true))) {
          wasHurt = false;
        }
        return;
      }

      const idleTime = Date.now() - this.lastMoveTime;
      this.handleIdleAnimations(idleTime);
    }, Character.ANIMATION_INTERVAL);
  }

  /**
   * Handles hurt animation and sound effects.
   * Prevents animation during death state and manages sound playback.
   * @param {Function} setHurtCallback - Callback function to set hurt state
   * @returns {boolean} True if hurt animation is playing, false otherwise
   */
 handleHurtAnimation(setHurtCallback) {
    if (this.isDying) return false;

    if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        setHurtCallback();
        if (!this.hurt_sound_played) {
            playSound('hurt-character.mp4');
            this.hurt_sound_played = true;
        }
        return true;
    } else {
        this.hurt_sound_played = false;
    }
    return false;
}

  /**
   * Handles jumping animation when character is airborne.
   * @returns {boolean} True if jumping animation is playing, false otherwise
   */
  handleJumpingAnimation() {
    if (this.isDying) return false;

    if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
      return true;
    }
    return false;
  }

  /**
   * Handles walking animation based on keyboard input.
   * Checks for right, left, or D key presses.
   * @returns {boolean} True if walking animation is playing, false otherwise
   */
  handleWalkingAnimation() {
    if (this.isDying) return false;

    const keyboard = this.world.keyboard;
    if (keyboard.RIGHT || keyboard.LEFT || keyboard.D) {
      this.playAnimation(this.IMAGES_WALKING);
      return true;
    }
    return false;
  }

  /**
   * Handles idle animations based on time since last movement.
   * Switches between short and long idle animations when appropriate.
   * Short idle starts after 500ms, long idle after 3000ms of inactivity.
   * @param {number} idleTime - Time in milliseconds since last movement
   */
  handleIdleAnimations(idleTime) {
    if (this.isDying) return;

    if (idleTime > Character.IDLE_TIME_LONG) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else if (idleTime > Character.IDLE_TIME_SHORT) {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Resets the idle timer to current time.
   * Used to restart idle animation timing after actions.
   */
  resetIdleTimer() {
    this.lastMoveTime = Date.now();
  }

  /**
   * Main animation loop that runs at 60 FPS.
   * Handles movement, jumping, camera updates, and starts animation watcher.
   */
  animate() {
    setInterval(() => {
      this.checkForDeath();
      if (this.isDying) {
        this.handleDeathAnimation();
        return;
      }

      const isMoving = this.handleMovement();
      this.handleJumping(isMoving);
      this.updateLastMoveTime(isMoving);
      this.updateCamera();
    }, 1000 / 60);

    this.startAnimationWatcher();
  }

  /**
   * Initiates bottle throwing sequence if conditions are met.
   * Creates throwable bottle, adds to world, decrements inventory.
   */
  throwBottle() {
    if (!this.canThrowBottle()) return;

    const bottle = this.createThrowableBottle();
    this.addBottleToWorld(bottle);
    this.collectedBottles--;
    this.resetIdleTimer();
    this.markAsThrowingTemporarily();
  }

  /**
   * Checks if character can throw a bottle.
   * Requires bottles in inventory and character must not be dying.
   * @returns {boolean} True if bottle can be thrown, false otherwise
   */
  canThrowBottle() {
    return this.collectedBottles > 0 && !this.isDying;
  }

  /**
   * Creates a new throwable bottle object at character position.
   * @returns {ThrowableObject} New throwable bottle instance
   */
  createThrowableBottle() {
    return new ThrowableObject(this.x + this.width / 2, this.y);
  }

  /**
   * Adds a bottle to the world's throwable objects array.
   * @param {ThrowableObject} bottle - The bottle to add to the world
   */
  addBottleToWorld(bottle) {
    this.world.throwableObjects.push(bottle);
  }

  /**
   * Temporarily marks character as throwing to prevent animation conflicts.
   * Flag is automatically cleared after 100ms.
   */
  markAsThrowingTemporarily() {
    this.isThrowingBottle = true;
    setTimeout(() => {
      this.isThrowingBottle = false;
    }, 100);
  }

  /**
   * Increases the character's collected coin counter by one.
   * Optionally resets the idle timer to prevent idle behavior after collecting a coin.
   *
   * @returns {void}
   */
  collectCoin() {
    this.collectedCoins++;
    this.resetIdleTimer();
  }

  /**
   * Sets the character's health/energy value.
   * Triggers death check after health change.
   * @param {number} health - New health value to set
   */
  setHealth(health) {
    this.energy = health;
    this.checkForDeath();
  }

  /**
   * Handles character taking damage.
   * Calls parent hit method and checks for death condition.
   */
  hit() {
    if (this.isDying) return;
    super.hit();
    this.checkForDeath();
  }

  /**
   * Initiates the character death sequence.
   * Sets death flags, stops movement, and begins death animation.
   */
  triggerDeath() {
    if (this.isDying) return;

    this.isDying = true;
    this.deathAnimationStarted = false;
    this.energy = Math.min(this.energy, 15);
    if (this.health !== undefined) this.health = Math.min(this.health, 15);

    if (this.walking_sound) this.walking_sound.pause();
    this.speed = 0;
    this.acceleration = 0;
    this.handleDeathAnimation();
  }

  /**
   * Checks various death conditions and triggers death if any are met.
   * Checks energy, health, and status bar values.
   */
  checkForDeath() {
    if (this.isDying) return;

    const isDead =
      this.isDeadByEnergy() ||
      this.isDeadByHealth() ||
      this.isDeadByStatusBar();

    if (isDead) {
      this.triggerDeath();
    }
  }

  /**
   * Checks if character is dead based on energy level.
   * @returns {boolean} True if dead by energy, false otherwise
   */
  isDeadByEnergy() {
    return this.energy !== undefined && this.energy <= 15;
  }

  /**
   * Checks if character is dead based on health level.
   * @returns {boolean} True if dead by health, false otherwise
   */
  isDeadByHealth() {
    return this.health !== undefined && this.health <= 15;
  }

  /**
   * Checks if character is dead based on status bar indicators.
   * @returns {boolean} True if dead by status bar, false otherwise
   */
  isDeadByStatusBar() {
    const statusBar = this.world?.statusBar;
    const healthBar = this.world?.statusBarHealth;

    return (
      statusBar?.percentage <= 15 ||
      statusBar?.statusBarIndex <= 1 ||
      statusBar?.currentImageIndex <= 1 ||
      healthBar?.percentage <= 15
    );
  }

  /**
   * Displays the victory screen overlay with centered image.
   * Schedules automatic screen dismissal after display time.
   */
  displayVictoryScreen() {
    const ctx = this.findCanvasContext();
    if (!this.victoryImage || !ctx) return;

    const canvas = ctx.canvas;
    const bounds = this.calculateCenteredImageBounds(canvas, this.victoryImage);

    this.showVictoryScreen = true;
    this.animateScreen(
      () => this.showVictoryScreen,
      () =>
        this.drawOverlay(
          ctx,
          canvas,
          this.victoryImage,
          bounds.x,
          bounds.y,
          bounds.width,
          bounds.height
        )
    );
    this.scheduleVictoryScreenEnd();
  }

  /**
   * Handles the death animation sequence.
   * Starts animation if not already started and character is dead.
   * @returns {boolean} True if death animation is active, false otherwise
   */
  handleDeathAnimation() {
    if (this.isDead() || this.isDying) {
      if (!this.deathAnimationStarted) {
        this.deathAnimationStarted = true;
        this.playDeathAnimation();
      }
      return true;
    }
    return false;
  }

/**
 * Spielt die Todesanimation ab und verwendet die globale playSound Funktion
 */
playDeathAnimation() {
    // Verwende die globale playSound Funktion statt direktem Audio-Objekt
    playSound("death-scream.mp4");

    let currentFrame = 0;
    const animationInterval = setInterval(() => {
        if (currentFrame < this.IMAGES_DEAD.length) {
            this.img = this.imageCache[this.IMAGES_DEAD[currentFrame]];
            currentFrame++;
        } else {
            clearInterval(animationInterval);
            this.gameOverHandler.world = this.world;
            this.gameOverHandler.ctx = this.ctx || this.findCanvasContext();
            this.gameOverHandler.canvas = this.canvas;
            this.gameOverHandler.showGameOverScreen();
        }
    }, Character.DEATH_ANIMATION_FRAME_DURATION);
}

  /**
   * Finds the canvas context as fallback if not directly set
   * @returns {CanvasRenderingContext2D|null} The canvas context or null if not found
   */
  findCanvasContext() {
    if (this.ctx) return this.ctx;
    if (this.world?.ctx) return this.world.ctx;
    if (this.world?.canvas) return this.world.canvas.getContext("2d");
    const canvas = document.querySelector("canvas");
    return canvas?.getContext("2d") || null;
  }

  /**
   * Sets the canvas context and passes it to game over handler
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
   */
  setCanvasContext(ctx) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.gameOverHandler.ctx = ctx;
    this.gameOverHandler.canvas = ctx.canvas;
  }
}
