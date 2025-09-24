/**
 * Represents a bottle object in the game that can be placed on the ground
 * and interacted with as a movable object.
 * 
 * @extends MovableObject
 */
class Bottle extends MovableObject {
  /**
   * Offset values used to adjust the hitbox relative to the bottle image.
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 0,
    left: 10,
    right: 10,
    bottom: 0,
  };

  /**
   * List of available bottle images used for rendering.
   * @type {string[]}
   */
  IMAGES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates a new Bottle instance.
   * 
   * @param {number} index - The index of the image to load from the IMAGES array.
   * @param {number} x - The x-coordinate where the bottle will be placed.
   */
  constructor(index, x) {
    super();
    this.loadImage(this.IMAGES[index]);
    this.x = x;
    this.y = 365;
    this.width = 40;
    this.height = 60;
    this.hitbox = this.getHitBox();
  }
}
