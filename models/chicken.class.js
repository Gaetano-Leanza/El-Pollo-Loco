/**
 * Represents a normal-sized chicken enemy that moves horizontally across the level.
 * This enemy has simple left-right movement pattern with boundary detection.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  /**
   * Y-coordinate position of the chicken (ground level).
   * @type {number}
   * @default 340
   */
  y = 340;

  /**
   * Width of the chicken in pixels.
   * @type {number}
   * @default 80
   */
  width = 80;

  /**
   * Height of the chicken in pixels.
   * @type {number}
   * @default 90
   */
  height = 90;

  /**
   * Health/energy points of the chicken.
   * @type {number}
   * @default 10
   */
  energy = 10;

  /**
   * Collision detection offset values for hit box calculations.
   * @type {Object}
   * @property {number} top - Top offset in pixels
   * @property {number} left - Left offset in pixels
   * @property {number} right - Right offset in pixels
   * @property {number} bottom - Bottom offset in pixels
   */
  offset = {
    top: 20,
    left: 15,
    right: 15,
    bottom: 20,
  };

  /**
   * Array of image paths for walking animation frames.
   * @type {string[]}
   * @static
   */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Array of image paths for dead state (single frame).
   * @type {string[]}
   * @static
   */
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Creates a new Chicken instance with randomized position, speed, and initial direction.
   * Automatically starts animation and movement cycles.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.soundManager = SoundManager.instance;
    this.x = 400 + Math.random() * 4800;
    this.hitbox = this.getHitBox();
    this.speed = 0.15 + Math.random() * 0.3;
    this.animate();
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
   * Sets up two intervals: one for movement at 60fps and one for animation at ~12.5fps.
   */
  animate() {
    setStoppableInterval(() => this.chickenMoves(), 1000 / 60);
    setStoppableInterval(() => this.chickenAnimation(), 80);
  }

  /**
   * Handles horizontal movement of the chicken based on current direction.
   * Updates hitbox after each movement and handles boundary collisions.
   */
  chickenMoves() {
    this.setDirection();
    if (this.otherDirection) {
      this.moveRight();
      this.hitbox = this.getHitBox();
    } else {
      this.moveLeft();
      this.hitbox = this.getHitBox();
    }
  }

  /**
   * Handles direction changes when the chicken reaches level boundaries.
   * Automatically reverses direction to keep chicken within playable area.
   */
  setDirection(){
    if (this.atLevelStart()) {
      this.otherDirection = true;
    } else if (this.atLevelEnd()) {
      this.otherDirection = false;
    }
  }

  /**
   * Checks if the chicken has reached the starting boundary of the level.
   * @returns {boolean} True if chicken is at or past the level start point
   */
  atLevelStart() {
    return this.x <= this.xStart;
  }

  /**
   * Checks if the chicken has reached the ending boundary of the level.
   * @returns {boolean} True if chicken is at or past the level end point
   */
  atLevelEnd() {
    return this.x >= this.xEnd;
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
}