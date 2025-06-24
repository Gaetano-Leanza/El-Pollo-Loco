/**
 * Represents an object that can move and interact within the game world.
 * Extends the DrawableObject class with movement, collision, and physics functionality.
 */
class MovableObject extends DrawableObject {
  /** @type {number} Horizontal movement speed */
  speed = 0.15;

  /** @type {boolean} Indicates if the object is facing or moving in the opposite direction */
  otherDirection = false;

  /** @type {number} Vertical speed (used for jumping/falling) */
  speedY = 0;

  /** @type {number} Acceleration due to gravity */
  acceleration = 2.5;

  /** @type {number} Current energy (health) of the object */
  energy = 100;

  /** @type {number} Timestamp (in ms) of the last hit taken */
  lastHit = 0;

  /** @type {number} Index of the current animation image */
  currentImage = 0;

  /**
   * Applies gravity effect to the object by modifying vertical position and speed.
   * Runs approximately 25 times per second.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Determines if the object is currently above the ground.
   * Throwable objects are always considered above ground.
   * @returns {boolean} True if above ground, otherwise false.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 160;
    }
  }

  /**
   * Checks if this object is colliding with another MovableObject.
   * Uses hitboxes for collision detection.
   * @param {MovableObject} mo - The other movable object to check collision against.
   * @returns {boolean} True if colliding, false otherwise.
   */
  isColliding(mo) {
    let thisHitbox = this.getHitbox();
    let moHitbox = mo.getHitbox();

    return (
      thisHitbox.x + thisHitbox.width > moHitbox.x &&
      thisHitbox.y + thisHitbox.height > moHitbox.y &&
      thisHitbox.x < moHitbox.x + moHitbox.width &&
      thisHitbox.y < moHitbox.y + moHitbox.height
    );
  }

  /**
   * Returns the hitbox rectangle used for collision detection.
   * By default, this is the full rectangle of the object.
   * @returns {{x: number, y: number, width: number, height: number}} The hitbox.
   */
  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Reduces energy by 5 when the object is hit.
   * Sets energy to zero if it drops below zero.
   * Updates the lastHit timestamp.
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object is dead (energy is zero).
   * @returns {boolean} True if dead, otherwise false.
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * Checks if the object was hurt within the last second.
   * @returns {boolean} True if hurt recently, otherwise false.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000; // convert ms to seconds
    return timepassed < 1;
  }

  /**
   * Moves the object to the right by increasing its x-position.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by decreasing its x-position.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Plays an animation by cycling through an array of image paths.
   * Updates the current image displayed.
   * @param {string[]} images - Array of image paths for the animation.
   */
  playAnimation(images) {
    if (!images || images.length === 0) return;
    this.currentImage = this.currentImage % images.length;
    let path = images[this.currentImage];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Initiates a jump by setting the vertical speed upwards.
   */
  jump() {
    this.speedY = 30;
  }

  /**
   * Draws a red rectangle around the object’s hitbox on the canvas context.
   * Useful for debugging collision boundaries.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "red";
    const box = this.getHitbox ? this.getHitbox() : this;
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.stroke();
  }
}
