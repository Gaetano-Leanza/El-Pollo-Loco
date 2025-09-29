/**
 * Base class for all objects that can move and interact in the game world.
 * Provides physics simulation, collision detection, animation, state management, and common behaviors.
 * Extends DrawableObject to add movement capabilities, health systems, and game mechanics.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /**
   * Horizontal movement speed in pixels per frame.
   * @type {number}
   * @default 0.15
   */
  speed = 0.15;

  /**
   * Direction flag for horizontal facing (false = right, true = left).
   * Used for image flipping and movement direction.
   * @type {boolean}
   * @default false
   */
  otherDirection = false;

  /**
   * Vertical velocity for jumping and falling physics.
   * Positive values move upward, negative values move downward.
   * @type {number}
   * @default 0
   */
  speedY = 0;

  /**
   * Gravity acceleration that reduces speedY over time.
   * @type {number}
   * @default 2.5
   */
  acceleration = 2.5;

  /**
   * Health/energy points of the object (0-100).
   * @type {number}
   */
  energy;

  /**
   * Coin collection progress (0-100).
   * @type {number}
   * @default 0
   */
  wealth = 0;

  /**
   * Bottle/salsa inventory count (0-100).
   * @type {number}
   * @default 0
   */
  salsa = 0;

  /**
   * Timestamp of the last hit received (for hurt state timing).
   * @type {number}
   * @default 0
   */
  lastHit = 0;

  /**
   * Timestamp of the last player activity (for sleep detection).
   * @type {number}
   */
  lastActive = Date.now();

  /**
   * Duration in milliseconds before object enters sleep state.
   * @type {number}
   * @default 15000
   */
  sleepTime = 15000;

  /**
   * Flag indicating if object is currently in sleep state.
   * @type {boolean}
   * @default false
   */
  isSleeping = false;

  /**
   * Counter for bounce-back animation frames when hit.
   * @type {number}
   * @default 0
   */
  countForBounce = 0;

  /**
   * Y-coordinate representing the ground level for this object.
   * @type {number}
   */
  onGroundY;

  /**
   * Left boundary of the playable area.
   * @type {number}
   * @default 10
   */
  xStart = 10;

  /**
   * Right boundary of the playable area.
   * @type {number}
   * @default 4000
   */
  xEnd = 4000;

  /**
   * Collision detection offset values for precise hit box calculations.
   * Allows fine-tuning of collision boundaries independent of sprite dimensions.
   * @type {Object}
   * @property {number} top - Top offset in pixels
   * @property {number} left - Left offset in pixels
   * @property {number} right - Right offset in pixels
   * @property {number} bottom - Bottom offset in pixels
   */
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Current collision boundaries calculated from position, dimensions, and offsets.
   * @type {Object}
   */
  hitbox = {};

  /**
   * Creates a new MovableObject and initializes sound manager and collision box.
   */
  constructor() {
    super();
    this.soundManager = SoundManager.instance;
    this.hitbox = this.getHitBox();
  }

  /**
   * Applies gravity physics simulation to the object.
   * Continuously reduces vertical velocity and updates position at 25fps.
   * Prevents falling below ground level.
   */
  applyGravity() {
    setStoppableInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.y = Math.min(this.y, this.onGroundY);
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is currently airborne (above ground level).
   * @returns {boolean} True if object is above its ground level
   */
  isAboveGround() {
    return this.y < this.onGroundY;
  }

  /**
   * Plays animation by cycling through provided image array.
   * Automatically loops back to first image when reaching the end.
   * @param {string[]} images - Array of image paths for animation frames
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Resets activity timer and wakes object from sleep state.
   * Stops snoring sound if playing.
   */
  resetLastAction() {
    this.lastActive = Date.now();
    this.isSleeping = false; // Character wakes up
    SoundManager.instance.pause("snoring");
  }

  /**
   * Moves the object rightward by its current speed.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object leftward by its current speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump with upward velocity and plays jump sound.
   */
  jump() {
    this.speedY = 30;
    this.soundManager.play("jump");
  }

  /**
   * Calculates and returns the current collision boundaries.
   * Uses object position, dimensions, and offset values for precise collision detection.
   * @returns {Object} Hit box with x, y, width, height, left, top, right, bottom properties
   */
  getHitBox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.bottom - this.offset.top,
      left: this.x + this.offset.left,
      top: this.y + this.offset.top,
      right: this.x + this.width - this.offset.right,
      bottom: this.height - this.offset.bottom + this.y,
    };
  }

  /**
   * Checks if this object is colliding with another movable object.
   * Uses AABB (Axis-Aligned Bounding Box) collision detection.
   * @param {MovableObject} mo - The other movable object to check collision with
   * @returns {boolean} True if the objects are colliding
   */
  isColliding(mo) {
    return (
      this.hitbox.right > mo.hitbox.left &&
      this.hitbox.left < mo.hitbox.right &&
      this.hitbox.top < mo.hitbox.bottom &&
      this.hitbox.bottom > mo.hitbox.top
    );
  }

  /**
   * Checks if this object is jumping on top of another object (for enemy stomping).
   * Requires being airborne and landing more horizontally than vertically on target.
   * @param {MovableObject} mo - The object being jumped on
   * @returns {boolean} True if this is a valid jumping-on collision
   */
  isJumpingOn(mo) {
    return (
      this.hitbox.right - mo.hitbox.left > this.hitbox.bottom - mo.hitbox.top &&
      this.isAboveGround()
    );
  }

  /**
   * Gives the object upward velocity after successfully jumping on an enemy.
   */
  bounceUp() {
    this.speedY = 25;
  }

  /**
   * Handles taking damage from enemy collision.
   * Reduces energy, plays hit sound, triggers bounce-back effect.
   */
  hit() {
    this.soundManager.play("hit");
    this.energy -= 10;
    this.bounceBack();
    this.countForBounce = 0;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Creates a knockback effect when hit by moving object in opposite direction.
   * Runs for 10 frames at 30ms intervals.
   */
  bounceBack() {
    setStoppableInterval(() => {
      if (this.countForBounce <= 10) {
        this.otherDirection ? this.moveRight() : this.moveLeft();
        this.countForBounce += 1;
      }
    }, 30);
  }

  /**
   * Checks if the object is currently in hurt state (recently took damage).
   * @returns {boolean} True if object was hit within the last 1 second
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit; // difference in ms
    timePassed = timePassed / 1000; // difference in s
    return timePassed < 1; // animation is shown for 1 sec if character gets hurt
  }

  /**
   * Checks if the object is in attack state (for endboss behavior).
   * Attack window occurs 1-2 seconds after being hurt.
   * @returns {boolean} True if object is in attack timing window
   */
  attacks() {
    let timePassed = new Date().getTime() - this.lastHit; // difference in ms
    timePassed = timePassed / 1000; // difference in s
    return timePassed > 1 && timePassed <= 2; // animation is shown for 1 sec if endboss gets hurt
  }

  /**
   * Checks if the object has died (energy depleted).
   * @returns {boolean} True if energy has reached zero
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Checks if the object should enter sleep state due to inactivity.
   * @returns {boolean} True if no activity for sleepTime duration (15 seconds)
   */
  isAsleep() {
    let timePassed = new Date().getTime() - this.lastActive;
    if (timePassed >= this.sleepTime) {
      this.isSleeping = true; // Set isSleeping to true when 15 seconds have passed
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if the object is in idle state (awake but not sleeping).
   * @returns {boolean} True if object is not currently sleeping
   */
  idle() {
    return !this.isSleeping;
  }

  /**
   * Handles coin collection with sound effect and wealth increase.
   * Caps wealth at 100 and increments by 10 per coin.
   */
  collectCoin() {
    if (this.wealth < 100) {
      this.wealth += 10;
    }
    SoundManager.instance.play("coin");
  }

  /**
   * Handles bottle collection with sound effect and salsa inventory increase.
   * Caps salsa inventory at 100 and increments by 10 per bottle.
   */
  collectBottle() {
    if (this.salsa < 100) {
      this.salsa += 10;
    }
    SoundManager.instance.play("bottle");
  }

  /**
   * Handles taking damage when hit by projectiles or other damage sources.
   * Reduces energy by 10 points and updates hit timestamp if still alive.
   */
  takeDamage() {
    if (!this.isDead()) {
      this.energy -= 10;
      if (this.energy < 0) {
        this.energy = 0;
      } else {
        this.lastHit = new Date().getTime();
      }
    }
  }
}