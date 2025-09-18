/**
 * Simplified Character class - delegates complex logic to handler classes
 * Represents the main player character in the game with movement, health, and animation capabilities
 * @extends MovableObject
 */
class Character extends MovableObject {
  /**
   * Time threshold for short idle state in milliseconds
   * @type {number}
   * @static
   */
  static IDLE_TIME_SHORT = 500;

  /**
   * Time threshold for long idle state in milliseconds
   * @type {number}
   * @static
   */
  static IDLE_TIME_LONG = 3000;

  /**
   * Animation frame update interval in milliseconds
   * @type {number}
   * @static
   */
  static ANIMATION_INTERVAL = 100;

  /**
   * Duration for each frame of death animation in milliseconds
   * @type {number}
   * @static
   */
  static DEATH_ANIMATION_FRAME_DURATION = 150;

  /**
   * Character height in pixels
   * @type {number}
   */
  height = 280;

  /**
   * Initial Y position of character
   * @type {number}
   */
  y = 80;

  /**
   * Movement speed in pixels per frame
   * @type {number}
   */
  speed = 10;

  /**
   * Horizontal offset for collision hitbox
   * @type {number}
   */
  hitboxOffsetX = 25;

  /**
   * Vertical offset for collision hitbox
   * @type {number}
   */
  hitboxOffsetY = 130;

  /**
   * Width reduction for collision hitbox
   * @type {number}
   */
  hitboxWidthReduction = 50;

  /**
   * Height reduction for collision hitbox
   * @type {number}
   */
  hitboxHeightReduction = 160;
  
  /**
   * Number of coins collected by the character
   * @type {number}
   */
  collectedCoins = 0;

  /**
   * Maximum number of coins that can be collected
   * @type {number}
   */
  maxCoins = 20;

  /**
   * Number of bottles collected by the character
   * @type {number}
   */
  collectedBottles = 0;

  /**
   * Maximum number of bottles that can be collected
   * @type {number}
   */
  maxBottles = 20;

  /**
   * Timestamp of the last movement action
   * @type {number}
   */
  lastMoveTime = Date.now();
  
  /**
   * Current health/energy level of the character (0-100)
   * @type {number}
   */
  energy = 100;

  /**
   * Timestamp of the last hit received
   * @type {number}
   */
  lastHit = 0;

  /**
   * Recovery time after taking damage (invincibility frames) in milliseconds
   * @type {number}
   */
  timeToRecover = 1500;
  
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
   * Flag indicating if hurt sound has been played
   * @type {boolean}
   */
  hurtSoundPlayed = false;

  /**
   * Reference to the game world instance
   * @type {World|null}
   */
  world;

  /**
   * Reference to the canvas 2D rendering context
   * @type {CanvasRenderingContext2D|null}
   */
  ctx;

  /**
   * Reference to the HTML canvas element
   * @type {HTMLCanvasElement|null}
   */
  canvas;

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
    "../img/2_character_pepe/2_walk/W-26.png"
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
    "../img/2_character_pepe/3_jump/J-39.png"
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
    "../img/2_character_pepe/5_dead/D-57.png"
  ];

  /**
   * Array of hurt animation image paths
   * @type {string[]}
   */
  IMAGES_HURT = [
    "../img/2_character_pepe/4_hurt/H-41.png",
    "../img/2_character_pepe/4_hurt/H-42.png",
    "../img/2_character_pepe/4_hurt/H-43.png"
  ];

  /**
   * Array of idle animation image paths
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
    "../img/2_character_pepe/1_idle/idle/I-10.png"
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
    "../img/2_character_pepe/1_idle/long_idle/I-20.png"
  ];

  /**
   * Creates a new Character instance
   * Initializes all handler classes and sets up basic game state
   * @constructor
   */
  constructor() {
    super();
    
    /**
     * Handler for game over logic
     * @type {GameOver}
     */
    this.gameOverHandler = new GameOver();
    
    /**
     * Handler for character animations
     * @type {CharacterAnimations}
     */
    this.animations = new CharacterAnimations(this);

    /**
     * Handler for character movement
     * @type {CharacterMovement}
     */
    this.movement = new CharacterMovement(this);

    /**
     * Handler for character actions (throwing, collecting)
     * @type {CharacterActions}
     */
    this.actions = new CharacterActions(this);

    /**
     * Handler for character health and damage
     * @type {CharacterHealth}
     */
    this.health = new CharacterHealth(this);
    
    this.initializeImages();
    this.applyGravity();
    this.gameOverHandler.loadGameOverImage();
  }

  /**
   * Initializes all character images and loads them into cache
   * Preloads walking, jumping, death, hurt, idle, and long idle animations
   * @returns {void}
   */
  initializeImages() {
    this.loadImage("../img/2_character_pepe/2_walk/W-21.png");
    const imageArrays = [
      this.IMAGES_WALKING, this.IMAGES_JUMPING, this.IMAGES_DEAD,
      this.IMAGES_HURT, this.IMAGES_IDLE, this.IMAGES_LONG_IDLE
    ];
    imageArrays.forEach(images => this.loadImages(images));
  }

  /**
   * Sets the canvas rendering context for character and game over screen
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
   * @returns {void}
   */
  setCanvasContext(ctx) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.gameOverHandler.ctx = ctx;
    this.gameOverHandler.canvas = ctx.canvas;
  }

  /**
   * Calculates and returns the character's collision hitbox
   * Applies offsets and size reductions for more precise collision detection
   * @returns {Object} Hitbox object with x, y, width, height properties
   */
  getHitbox() {
    return {
      x: this.x + this.hitboxOffsetX,
      y: this.y + this.hitboxOffsetY,
      width: this.width - this.hitboxWidthReduction,
      height: this.height - this.hitboxHeightReduction
    };
  }

  /**
   * Resets the idle timer to current time
   * Used to track character activity for idle animations
   * @returns {void}
   */
  resetIdleTimer() {
    this.lastMoveTime = Date.now();
  }

  /**
   * Main animation loop that runs at 60 FPS
   * Handles death animation, movement, jumping, and camera updates
   * @returns {void}
   */
  animate() {
    setInterval(() => {
      this.health.checkForDeath();
      if (this.isDying) {
        this.animations.handleDeathAnimation();
        return;
      }

      const isMoving = this.movement.handleMovement();
      this.movement.handleJumping(isMoving);
      this.movement.updateLastMoveTime(isMoving);
      this.movement.updateCamera();
    }, 1000 / 60);

    this.animations.startAnimationWatcher();
  }

  /**
   * Finds the canvas context as fallback if not directly set
   * Searches through multiple possible sources for the canvas context
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
   * Main hit method - delegates to health handler
   * This should be called by collision detection system
   * @returns {void}
   */
  hit() {
    this.health.hit();
  }

  /**
   * Alternative hit method for damage dealing
   * Applies a specific amount of damage to the character
   * @param {number} [damage=20] - Amount of damage to apply
   * @returns {void}
   */
  takeDamage(damage = 20) {
    this.health.forceDamage(damage);
  }

  /**
   * Another hit method variant for collision systems
   * @returns {void}
   */
  getHit() {
    this.health.hit();
  }

  /**
   * Manual damage method for testing purposes
   * Directly reduces energy and updates status bar
   * @returns {void}
   */
  testDamage() {
    this.energy -= 20;
    if (this.world && this.world.statusBar) {
      this.world.statusBar.setPercentage(this.energy);
    }
  }

  /**
   * Delegates bottle throwing to actions handler
   * @returns {void}
   */
  throwBottle() { 
    this.actions.throwBottle(); 
  }

  /**
   * Delegates coin collection to actions handler
   * @returns {void}
   */
  collectCoin() { 
    this.actions.collectCoin(); 
  }

  /**
   * Delegates bottle collection to actions handler
   * @returns {void}
   */
  collectBottle() { 
    this.actions.collectBottle(); 
  }

  /**
   * Delegates health setting to health handler
   * @param {number} health - New health value to set
   * @returns {void}
   */
  setHealth(health) { 
    this.health.setHealth(health); 
  }

  /**
   * Delegates healing to health handler
   * @param {number} amount - Amount of health to restore
   * @returns {void}
   */
  heal(amount) { 
    this.health.heal(amount); 
  }

  /**
   * Cleanup method to stop all running animations and intervals
   * Should be called when character is removed from game
   * @returns {void}
   */
  destroy() {
    this.animations.stopAnimationWatcher();
  }
}