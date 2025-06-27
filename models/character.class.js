/**
 * Simplified Character class - delegates complex logic to handler classes
 * @extends MovableObject
 */
class Character extends MovableObject {
  // Constants
  static IDLE_TIME_SHORT = 500;
  static IDLE_TIME_LONG = 3000;
  static ANIMATION_INTERVAL = 100;
  static DEATH_ANIMATION_FRAME_DURATION = 150;

  // Basic properties
  height = 280;
  y = 80;
  speed = 10;
  hitboxOffsetX = 25;
  hitboxOffsetY = 130;
  hitboxWidthReduction = 50;
  hitboxHeightReduction = 160;
  
  // Game state
  collectedCoins = 0;
  maxCoins = 20;
  collectedBottles = 0;
  maxBottles = 20;
  lastMoveTime = Date.now();
  
  // Health properties - WICHTIG: Diese müssen initialisiert werden!
  energy = 100;
  lastHit = 0;
  timeToRecover = 1500; // 1.5 Sekunden Invincibility frames (längere Pause zwischen Schäden)
  
  // Flags
  isThrowingBottle = false;
  isDying = false;
  deathAnimationStarted = false;
  hurtSoundPlayed = false;

  // References
  world;
  ctx;
  canvas;

  // Image arrays (gekürzt für Übersichtlichkeit)
  IMAGES_WALKING = [
    "../img/2_character_pepe/2_walk/W-21.png",
    "../img/2_character_pepe/2_walk/W-22.png",
    "../img/2_character_pepe/2_walk/W-23.png",
    "../img/2_character_pepe/2_walk/W-24.png",
    "../img/2_character_pepe/2_walk/W-25.png",
    "../img/2_character_pepe/2_walk/W-26.png"
  ];

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

  IMAGES_DEAD = [
    "../img/2_character_pepe/5_dead/D-51.png",
    "../img/2_character_pepe/5_dead/D-52.png",
    "../img/2_character_pepe/5_dead/D-53.png",
    "../img/2_character_pepe/5_dead/D-54.png",
    "../img/2_character_pepe/5_dead/D-55.png",
    "../img/2_character_pepe/5_dead/D-56.png",
    "../img/2_character_pepe/5_dead/D-57.png"
  ];

  IMAGES_HURT = [
    "../img/2_character_pepe/4_hurt/H-41.png",
    "../img/2_character_pepe/4_hurt/H-42.png",
    "../img/2_character_pepe/4_hurt/H-43.png"
  ];

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
   */
  constructor() {
    super();
    
    console.log("Character constructor called - Energy:", this.energy); // Debug
    
    this.gameOverHandler = new GameOver();
    
    // Initialize handler classes
    this.animations = new CharacterAnimations(this);
    this.movement = new CharacterMovement(this);
    this.actions = new CharacterActions(this);
    this.health = new CharacterHealth(this);
    
    this.initializeImages();
    this.applyGravity();
    this.gameOverHandler.loadGameOverImage();
  }

  /**
   * Initializes all character images and loads them into cache
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
   * Sets the canvas rendering context
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
   */
  setCanvasContext(ctx) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.gameOverHandler.ctx = ctx;
    this.gameOverHandler.canvas = ctx.canvas;
  }

  /**
   * Calculates and returns the character's collision hitbox
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
   */
  resetIdleTimer() {
    this.lastMoveTime = Date.now();
  }

  /**
   * Main animation loop that runs at 60 FPS
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
   * @returns {CanvasRenderingContext2D|null} The canvas context or null
   */
  findCanvasContext() {
    if (this.ctx) return this.ctx;
    if (this.world?.ctx) return this.world.ctx;
    if (this.world?.canvas) return this.world.canvas.getContext("2d");
    const canvas = document.querySelector("canvas");
    return canvas?.getContext("2d") || null;
  }

  // WICHTIG: Alle möglichen Varianten der hit() Methode für Debugging
  
  /**
   * Main hit method - delegates to health handler
   * This should be called by collision detection
   */
  hit() {
    console.log("Character.hit() called!"); // Debug
    this.health.hit();
  }

  /**
   * Alternative hit method name (falls dein System das verwendet)
   */
  takeDamage(damage = 20) {
    console.log("Character.takeDamage() called with damage:", damage); // Debug
    this.health.forceDamage(damage);
  }

  /**
   * Another possible hit method name
   */
  getHit() {
    console.log("Character.getHit() called!"); // Debug
    this.health.hit();
  }

  /**
   * Manual damage for testing
   */
  testDamage() {
    console.log("TEST: Applying damage manually");
    this.energy -= 20;
    console.log("Energy after test damage:", this.energy);
    if (this.world && this.world.statusBar) {
      this.world.statusBar.setPercentage(this.energy);
    }
  }

  // Delegate methods to handlers
  throwBottle() { this.actions.throwBottle(); }
  collectCoin() { this.actions.collectCoin(); }
  collectBottle() { this.actions.collectBottle(); }
  setHealth(health) { this.health.setHealth(health); }
  heal(amount) { this.health.heal(amount); }

  // Cleanup method
  destroy() {
    this.animations.stopAnimationWatcher();
  }
}