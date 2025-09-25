/**
 * Represents a small chicken enemy that moves around the level with jumping and walking patterns.
 * This enemy has a cyclic movement behavior alternating between jumping and walking phases.
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject {
  /**
   * Y-coordinate position of the small chicken (ground level).
   * @type {number}
   * @default 370
   */
  y = 370;

  /**
   * Width of the small chicken in pixels.
   * @type {number}
   * @default 60
   */
  width = 60;

  /**
   * Height of the small chicken in pixels.
   * @type {number}
   * @default 60
   */
  height = 60;

  /**
   * Health/energy points of the small chicken.
   * @type {number}
   * @default 10
   */
  energy = 10;

  /**
   * Counter for movement cycle phases (jumping vs walking behavior).
   * Controls the alternating movement pattern.
   * @type {number}
   * @default 0
   */
  i = 0;

  /**
   * Y-coordinate representing the ground level for this chicken.
   * @type {number}
   * @default 370
   */
  onGroundY = 370;

  /**
   * Reference to the game world object.
   * @type {World}
   */
  world;

  /**
   * Collision detection offset values for hit box calculations.
   * @type {Object}
   * @property {number} top - Top offset in pixels
   * @property {number} left - Left offset in pixels  
   * @property {number} right - Right offset in pixels
   * @property {number} bottom - Bottom offset in pixels
   */
  offset = {
    top: 0,
    left: 5,
    right: 5,
    bottom: 10,
  };

  /**
   * Array of image paths for walking animation frames.
   * @type {string[]}
   * @static
   */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * Array of image paths for dead state (single frame).
   * @type {string[]}
   * @static
   */
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * Creates a new ChickenSmall instance with randomized position, speed, and initial direction.
   * Automatically starts animation and movement cycles.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 400 + Math.random() * 5100;
    this.hitbox = this.getHitBox();
    this.speed = 0.15 + Math.random() * 0.4;
    this.applyGravity();
    this.animate();
    this.i = 1 + Math.random() * 10;
    this.movingDirection();
  }

  /**
   * Randomly sets the initial moving direction of the chicken.
   * 50% chance to start moving in either direction.
   */
  movingDirection() {
    if (Math.random() < 0.5) {
      this.otherDirection = true;
    }
  }

  /**
   * Starts the animation loops for chicken movement and sprite animation.
   * Sets up two intervals: one for movement at 60fps and one for animation at 5fps.
   */
  animate() {
    setStoppableInterval(() => this.chickenSmallMoves(), 1000 / 60);
    setStoppableInterval(() => this.chickenAnimation(), 200);
  }

  /**
   * Handles chicken sprite animation based on current state.
   * Plays death animation if dead, otherwise plays walking animation.
   */
  chickenAnimation() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Main movement handler that processes direction changes and movement patterns.
   * Handles boundary collision detection and calls walking/jumping logic.
   */
  chickenSmallMoves() {
    // change directions when it gets to level bounderies
    this.changeDirections();
    this.walkAndJumpAnimation();
  }

  /**
   * Controls the alternating movement pattern between jumping and walking phases.
   * Uses counter 'i' to determine current behavior: 0-2 jumping, 2-80 walking, then reset.
   */
  walkAndJumpAnimation() {
    if (!this.isAboveGround() && this.i < 2) {
      this.jump();
      this.updateHitbox();
      this.i++;
    } else if (!this.isAboveGround() && this.i >= 2 && this.isMovingLeft()) {
      this.handleMovingLeft();
    } else if (!this.isAboveGround() && this.i >= 2 && this.isMovingRigt()) {
      this.handleMovingRight();
    } else if (this.isMovingLeft()) {       
      this.leftJump();
    } else {
      this.rightJump();
    }
    this.beginNewCircle();
  }

  /**
   * Moves chicken to the right while in air (jumping phase).
   */
  rightJump(){
    this.moveRight();
    this.updateHitbox();
  }

  /**
   * Moves chicken to the left while in air (jumping phase).
   */
  leftJump(){
    this.moveLeft();
    this.updateHitbox();
  }

  /**
   * Resets the movement cycle counter when it reaches maximum value.
   * Allows the chicken to start a new jumping cycle after walking phase.
   */
  beginNewCircle(){
    if (this.i > 80) {
      this.i = 0; // begins jumping again
    }
  }

  /**
   * Handles rightward ground movement during walking phase.
   * Increments the movement counter and updates hitbox.
   */
  handleMovingRight(){
    this.moveRight();
    this.updateHitbox();
    this.i++;
  }

  /**
   * Handles leftward ground movement during walking phase.
   * Increments the movement counter and updates hitbox.
   */
  handleMovingLeft(){
    this.moveLeft();
    this.updateHitbox();
    this.i++;
  }

  /**
   * Reverses chicken direction when it reaches level boundaries.
   * Prevents the chicken from moving outside the playable area.
   */
  changeDirections() {
    if (this.atLevelStartPoint()) {
      this.otherDirection = true;
    } else if (this.atLevelEndPoint()) {
      this.otherDirection = false;
    }
  }

  /**
   * Updates the collision hitbox based on current position.
   */
  updateHitbox(){
    this.hitbox = this.getHitBox();
  }

  /**
   * Checks if chicken has reached the starting boundary of the level.
   * @returns {boolean} True if chicken is at or past the level start point
   */
  atLevelStartPoint() {
    return this.x <= this.xStart;
  }

  /**
   * Checks if chicken has reached the ending boundary of the level.
   * @returns {boolean} True if chicken is at or past the level end point
   */
  atLevelEndPoint() {
    return this.x >= this.xEnd;
  }

  /**
   * Checks if chicken is currently moving in the right direction.
   * Note: Method name has typo "Rigt" instead of "Right".
   * @returns {boolean} True if chicken should move right
   */
  isMovingRigt() {
    return this.otherDirection == true;
  }

  /**
   * Checks if chicken is currently moving in the left direction.
   * @returns {boolean} True if chicken should move left
   */
  isMovingLeft() {
    return this.otherDirection == false;
  }

  /**
   * Makes the chicken jump by setting vertical velocity.
   * Only jumps if the chicken is not dead.
   */
  jump() {
    if (!this.isDead()) {
      this.speedY = 20;
    }
  }
}