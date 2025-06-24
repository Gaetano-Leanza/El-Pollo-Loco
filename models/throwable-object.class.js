/**
 * Represents a throwable bottle object that can be thrown, rotate, and splash upon impact.
 * Extends MovableObject with specific bottle-related animations and behavior.
 */
class ThrowableObject extends MovableObject {
  /** @type {string[]} Image paths for the bottle rotation animation */
  BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /** @type {string[]} Image paths for the bottle splash animation */
  BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /** @type {boolean} Whether the bottle is currently splashing */
  isSplashing = false;

  /** @type {boolean} Whether the bottle has hit an enemy */
  hasHitEnemy = false;

  /** @type {number} Initial horizontal speed of the thrown bottle */
  initialSpeedX = 10;

  /** @type {number} Speed (ms) of rotation animation intervals */
  rotationSpeed = 100;

  splashSound = new Audio("audio/bottle-splash.mp4"); // Audio-Objekt als Property

  /**
   * Creates a new ThrowableObject instance (bottle) at specified coordinates.
   * @param {number} x - The initial x-coordinate.
   * @param {number} y - The initial y-coordinate.
   * @param {boolean} [otherDirection=false] - Whether the bottle is thrown in the opposite direction.
   */
  constructor(x, y, otherDirection = false) {
    super();
    this.loadImages(this.BOTTLE_ROTATION);
    this.loadImages(this.BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 60;
    this.groundLevel = 440;
    this.gravity = 2.5;
    this.speedY = -10;
    this.otherDirection = otherDirection;
    this.throw();
  }

  /**
   * Initiates the throwing action, setting up gravity and movement intervals.
   * Loads rotation images and sets initial image.
   */
  async throw() {
    await this.loadImages(this.BOTTLE_ROTATION);
    this.img = this.imageCache[this.BOTTLE_ROTATION[0]];
    this.isThrown = true;

    this.gravityInterval = setInterval(() => this.applyGravity(), 40);

    const direction = this.otherDirection ? -1 : 1;
    this.moveInterval = setInterval(() => {
      this.x += this.initialSpeedX * direction;
    }, 40);

    this.animateRotation();
  }

  /**
   * Animates the bottle rotation by cycling through rotation images.
   * Runs continuously unless the bottle is splashing.
   */
  animateRotation() {
    this.rotationInterval = setInterval(() => {
      if (!this.isSplashing) {
        this.currentImage =
          (this.currentImage + 1) % this.BOTTLE_ROTATION.length;
        this.img = this.imageCache[this.BOTTLE_ROTATION[this.currentImage]];
      }
    }, this.rotationSpeed);
  }

  /**
   * Applies gravity to the bottle, updating vertical position and speed.
   * Detects ground collision to trigger splash.
   */
  applyGravity() {
    if (this.isSplashing) return;

    this.y += this.speedY;
    this.speedY += this.gravity;

    if (this.y + this.height >= this.groundLevel) {
      this.y = this.groundLevel - this.height;
      this.splash("ground");
    }
  }

  /**
   * Checks collision with another MovableObject.
   * Uses a specialized collision check for the Endboss.
   * @param {MovableObject} mo - Another movable object.
   * @returns {boolean} True if colliding, false otherwise.
   */
  isColliding(mo) {
    if (mo instanceof Endboss) {
      return this.isCollidingWithEndboss(mo);
    }

    return super.isColliding(mo);
  }

  /**
   * Checks collision with the Endboss using the bottle's center point.
   * @param {Endboss} endboss - The endboss object.
   * @returns {boolean} True if the bottle's center is inside the endboss's hitbox.
   */
  isCollidingWithEndboss(endboss) {
    const bottleBox = this.getHitbox();
    const bossBox = endboss.getHitbox();

    const bottleCenterX = bottleBox.x + bottleBox.width / 2;
    const bottleCenterY = bottleBox.y + bottleBox.height / 2;

    return (
      bottleCenterX > bossBox.x &&
      bottleCenterX < bossBox.x + bossBox.width &&
      bottleCenterY > bossBox.y &&
      bottleCenterY < bossBox.y + bossBox.height
    );
  }

  splash(cause = "unknown") {
    if (this.isSplashing) return;

    this.isSplashing = true;
    this.stopIntervals();
    
    // Sound abspielen, wenn Splash startet
    this.splashSound.currentTime = 0; // Zur Sicherheit zum Anfang springen
    this.splashSound.play();

    this.playSplashAnimation();

    if (cause === "endboss" || cause === "enemy") {
      this.hasHitEnemy = true;
    }
  }

  /**
   * Plays the splash animation by cycling through splash images.
   * When finished, marks the object to be removed.
   */
  playSplashAnimation() {
    this.currentImage = 0;
    const splashInterval = setInterval(() => {
      if (this.currentImage < this.BOTTLE_SPLASH.length) {
        this.img = this.imageCache[this.BOTTLE_SPLASH[this.currentImage]];
        this.currentImage++;
      } else {
        clearInterval(splashInterval);
        this.shouldBeRemoved = true;
      }
    }, 80);
  }

  /**
   * Stops all active intervals related to gravity, movement, and rotation.
   */
  stopIntervals() {
    clearInterval(this.gravityInterval);
    clearInterval(this.moveInterval);
    clearInterval(this.rotationInterval);
  }

  /**
   * Returns a reduced hitbox rectangle for more precise collision detection.
   * @returns {{x: number, y: number, width: number, height: number}} The hitbox dimensions.
   */
  getHitbox() {
    return {
      x: this.x + 10,
      y: this.y + 10,
      width: this.width - 20,
      height: this.height - 20,
    };
  }
}
