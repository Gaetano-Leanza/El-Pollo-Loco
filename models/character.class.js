/**
 * Character class representing the main player character in the game.
 * Extends MovableObject to inherit movement and physics capabilities.
 * Handles character animations, movement, death sequences, and user interactions.
 * 
 * @extends MovableObject
 * @class Character
 */
class Character extends MovableObject {
  /** @static {number} Time in milliseconds before short idle animation starts */
  static IDLE_TIME_SHORT = 2000;
  
  /** @static {number} Time in milliseconds before long idle animation starts */
  static IDLE_TIME_LONG = 4000;
  
  /** @static {number} Interval in milliseconds for animation frame updates */
  static ANIMATION_INTERVAL = 100;
  
  /** @static {number} Duration in milliseconds for each death animation frame */
  static DEATH_ANIMATION_FRAME_DURATION = 150;
  
  /** @static {number} Time in milliseconds to display game over screen */
  static GAME_OVER_DISPLAY_TIME = 3000;
  
  /** @static {number} Scale factor for canvas overlay images */
  static CANVAS_SCALE = 0.8;

  /** @type {number} Character sprite height in pixels */
  height = 280;
  
  /** @type {number} Character y-position on canvas */
  y = 80;
  
  /** @type {number} Character movement speed in pixels per frame */
  speed = 10;
  
  /** @type {number} Horizontal offset for hitbox positioning */
  hitboxOffsetX = 25;
  
  /** @type {number} Vertical offset for hitbox positioning */
  hitboxOffsetY = 130;
  
  /** @type {number} Reduction in hitbox width from sprite width */
  hitboxWidthReduction = 50;
  
  /** @type {number} Reduction in hitbox height from sprite height */
  hitboxHeightReduction = 160;
  
  /** @type {number} Number of coins currently collected by character */
  collectedCoins = 0;
  
  /** @type {number} Maximum number of coins that can be collected */
  maxCoins = 20;
  
  /** @type {number} Number of bottles currently collected by character */
  collectedBottles = 0;
  
  /** @type {number} Maximum number of bottles that can be collected */
  maxBottles = 20;
  
  /** @type {number} Timestamp of last movement for idle animation timing */
  lastMoveTime = Date.now();
  
  /** @type {number|undefined} Interval ID for idle animation timer */
  idleInterval;
  
  /** @type {boolean} Flag indicating if character is currently throwing a bottle */
  isThrowingBottle = false;
  
  /** @type {boolean} Flag indicating if character is in dying state */
  isDying = false;
  
  /** @type {boolean} Flag indicating if death animation has started */
  deathAnimationStarted = false;
  
  /** @type {boolean} Flag indicating if game over overlay should be shown */
  showGameOverOverlay = false;
  
  /** @type {boolean} Flag to prevent multiple hurt sound plays */
  hurt_sound_played = false;
  
  /** @type {Object} Reference to the game world object */
  world;
  
  /** @type {CanvasRenderingContext2D} Reference to canvas 2D context */
  ctx;
  
  /** @type {HTMLCanvasElement} Reference to HTML canvas element */
  canvas;

  /**
   * Lazy-loaded hurt sound audio object.
   * Creates and caches audio instance on first access.
   * @returns {Audio} The hurt sound audio object
   */
  get hurt_sound() {
    if (!this._hurt_sound) {
      this._hurt_sound = new Audio("audio/hurt-character.mp4");
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
      this._jump_sound = new Audio("audio/jump.mp4");
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
      this._death_sound = new Audio("audio/death.mp4");
    }
    return this._death_sound;
  }

  /** @type {string[]} Array of walking animation image paths */
  IMAGES_WALKING = [
    "../img/2_character_pepe/2_walk/W-21.png",
    "../img/2_character_pepe/2_walk/W-22.png",
    "../img/2_character_pepe/2_walk/W-23.png",
    "../img/2_character_pepe/2_walk/W-24.png",
    "../img/2_character_pepe/2_walk/W-25.png",
    "../img/2_character_pepe/2_walk/W-26.png",
  ];

  /** @type {string[]} Array of jumping animation image paths */
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

  /** @type {string[]} Array of death animation image paths */
  IMAGES_DEAD = [
    "../img/2_character_pepe/5_dead/D-51.png",
    "../img/2_character_pepe/5_dead/D-52.png",
    "../img/2_character_pepe/5_dead/D-53.png",
    "../img/2_character_pepe/5_dead/D-54.png",
    "../img/2_character_pepe/5_dead/D-55.png",
    "../img/2_character_pepe/5_dead/D-56.png",
    "../img/2_character_pepe/5_dead/D-57.png",
  ];

  /** @type {string[]} Array of hurt animation image paths */
  IMAGES_HURT = [
    "../img/2_character_pepe/4_hurt/H-41.png",
    "../img/2_character_pepe/4_hurt/H-42.png",
    "../img/2_character_pepe/4_hurt/H-43.png",
  ];

  /** @type {string[]} Array of short idle animation image paths */
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

  /** @type {string[]} Array of long idle animation image paths */
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
    this.initializeImages();
    this.applyGravity();
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
      this.IMAGES_LONG_IDLE
    ];
    
    imageArrays.forEach(images => this.loadImages(images));
    this.loadGameOverImage();
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
      this.jump_sound.play().catch(err => console.warn('Jump sound failed:', err));
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
      if (this.handleDeathAnimation() || 
          this.handleHurtAnimation(() => wasHurt = true) || 
          this.handleJumpingAnimation() || 
          this.handleWalkingAnimation() || 
          this.isThrowingBottle) {
        if (!this.handleHurtAnimation(() => wasHurt = true)) {
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
        this.hurt_sound.play().catch(err => console.warn('Hurt sound failed:', err));
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
   * Switches between short and long idle animations.
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

    const isDead = this.isDeadByEnergy() || this.isDeadByHealth() || this.isDeadByStatusBar();
    
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
    
    return (statusBar?.percentage <= 15) ||
           (statusBar?.statusBarIndex <= 1) ||
           (statusBar?.currentImageIndex <= 1) ||
           (healthBar?.percentage <= 15);
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
    this.animateScreen(() => this.showVictoryScreen, () => 
      this.drawOverlay(ctx, canvas, this.victoryImage, bounds.x, bounds.y, bounds.width, bounds.height)
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
   * Plays the death animation sequence with sound effects.
   * Cycles through death images and shows game over screen when complete.
   */
  playDeathAnimation() {
    const deathAudio = new Audio("audio/death-scream.mp4");
    deathAudio.play().catch(error => 
      console.warn("Death sound playback failed:", error)
    );

    let currentFrame = 0;
    const animationInterval = setInterval(() => {
      if (currentFrame < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[currentFrame]];
        currentFrame++;
      } else {
        clearInterval(animationInterval);
        this.onDeathAnimationComplete();
        this.showGameOverScreen();
      }
    }, Character.DEATH_ANIMATION_FRAME_DURATION);
  }

  /**
   * Called when death animation sequence is completed.
   * Hook for additional death-related cleanup or events.
   */
  onDeathAnimationComplete() {
    console.log("Death animation completed");
  }

  /**
   * Displays the game over screen with overlay and automatic page reload.
   * Loads game over image if not already loaded and handles display timing.
   */
  showGameOverScreen() {
    if (!this.gameOverImage) {
      this.loadGameOverImage();
    }

    const displayGameOver = () => {
      const ctx = this.findCanvasContext();
      if (!ctx || !this.gameOverImage) {
        console.error("Canvas context or Game Over image not available");
        return;
      }

      const canvas = ctx.canvas;
      const bounds = this.calculateCenteredImageBounds(canvas, this.gameOverImage);
      
      this.showGameOverOverlay = true;
      
      this.animateScreen(() => this.showGameOverOverlay, () =>
        this.drawOverlay(ctx, canvas, this.gameOverImage, bounds.x, bounds.y, bounds.width, bounds.height)
      );

      setTimeout(() => location.reload(), Character.GAME_OVER_DISPLAY_TIME);
    };

    if (this.gameOverImage?.complete) {
      displayGameOver();
    } else if (this.gameOverImage) {
      this.gameOverImage.onload = displayGameOver;
    }
  }

  /**
   * Animates a screen overlay using requestAnimationFrame.
   * Continues animation while condition function returns true.
   * @param {Function} conditionFn - Function that returns true to continue animation
   * @param {Function} drawFn - Function to draw the screen content
   */
  animateScreen(conditionFn, drawFn) {
    const draw = () => {
      if (conditionFn()) {
        drawFn();
        requestAnimationFrame(draw);
      }
    };
    draw();
  }

  /**
   * Loads the game over image with error handling.
   * Sets up error callback for load failures.
   */
  loadGameOverImage() {
    this.gameOverImage = new Image();
    this.gameOverImage.src = "img/You won, you lost/Game Over.png";
    this.gameOverImage.onerror = error => 
      console.error("Failed to load Game Over image:", error);
  }

  /**
   * Finds and returns available canvas 2D rendering context.
   * Searches through multiple possible sources for the context.
   * @returns {CanvasRenderingContext2D|null} The 2D rendering context or null if not found
   */
  findCanvasContext() {
    if (this.ctx) return this.ctx;
    if (this.world?.ctx) return this.world.ctx;
    if (this.world?.canvas) return this.world.canvas.getContext('2d');
    
    const canvas = document.querySelector('canvas');
    return canvas?.getContext('2d') || null;
  }
}