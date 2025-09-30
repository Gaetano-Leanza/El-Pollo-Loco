/**
 * Represents a throwable bottle projectile that can be launched by the character.
 * Features realistic physics with gravity, horizontal movement, and impact animations.
 * Changes animation from spinning bottle to splash effect upon hitting enemies.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /**
   * Array of image paths for bottle rotation animation during flight.
   * @type {string[]}
   * @static
   */
  IMAGES_THROWING = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Array of image paths for splash animation when bottle hits target.
   * @type {string[]}
   * @static
   */
  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Collision detection offset values for hit box calculations.
   * Horizontal offsets create smaller hitbox for more precise collision detection.
   * @type {Object}
   * @property {number} top - Top offset in pixels
   * @property {number} left - Left offset in pixels
   * @property {number} right - Right offset in pixels
   * @property {number} bottom - Bottom offset in pixels
   */
  offset = {
    top: 0,
    left: 30,
    right: 30,
    bottom: 0,
  };

  /**
   * Flag indicating if the bottle has hit an enemy target.
   * Triggers splash animation and stops horizontal movement.
   * @type {boolean}
   * @default false
   */
  hitEnemy = false;

  /**
   * Reference to the game world object.
   * @type {World}
   */
  world;

  /**
   * Creates a new ThrowableObject at the specified position and launches it.
   * Direction is determined by character's facing direction at time of throw.
   * @param {number} x - Initial x-coordinate position
   * @param {number} y - Initial y-coordinate position
   */
  constructor(x, y) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.loadImages(this.IMAGES_THROWING);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.throw();
    this.animate();
    this.applyGravity(); 
    this.direction = otherDirectionCharacter ? -1 : 1; 
  }

  /**
   * Initiates the throwing motion with upward velocity and horizontal movement.
   * Sets up continuous horizontal movement until impact occurs.
   */
  throw() {
    this.speedY = 25;
    this.hitbox = this.getHitBox();
   
    setStoppableInterval(() => {
      if (this.hitEnemy == false ) {
        this.x += 7 * this.direction;
        this.hitbox = this.getHitBox();
      } else {
        this.speedY = 0;
      }
    }, 1000 / 60);
  }

  /**
   * Manages bottle animation states based on impact status.
   * Shows spinning animation during flight, splash animation after impact.
   * Uses fractional counter to control splash animation duration.
   */
  animate() {
    let i = 0;
    setStoppableInterval(() => {
      if (this.hitEnemy == false && i == 0) {
        this.playAnimation(this.IMAGES_THROWING);
      } else if (this.hitEnemy == true && i < 1) {
        this.playAnimation(this.IMAGES_SPLASH);
        i += 0.17;
      }
    }, 80);
  }

  /**
   * Overrides parent method to ensure bottle always behaves as airborne.
   * This keeps the bottle subject to gravity throughout its flight.
   * @returns {boolean} Always returns true to maintain gravity effect
   */
  isAboveGround() {
    return true;
  }

  /**
   * Applies gravity physics to the thrown bottle.
   * Uses faster interval (40fps) for smoother physics simulation.
   * Continuously reduces vertical speed and lowers position until impact.
   */
  applyGravity() {
    setStoppableInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }
}