/**
 * Represents a collectible coin item that the player can pick up for points or progress.
 * Coins have a simple two-frame animation and can be placed at any position in the level.
 * @extends MovableObject
 */
class Coin extends MovableObject {
  /**
   * Collision detection offset values for hit box calculations.
   * Uniform 8-pixel offset on all sides for more precise collision detection.
   * @type {Object}
   * @property {number} top - Top offset in pixels
   * @property {number} left - Left offset in pixels
   * @property {number} right - Right offset in pixels
   * @property {number} bottom - Bottom offset in pixels
   */
  offset = {
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
  };

  /**
   * Array of image paths for coin animation frames.
   * Simple two-frame animation to create a shimmering effect.
   * @type {string[]}
   * @static
   */
  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Creates a new Coin instance at the specified position.
   * @param {number} x - The x-coordinate where the coin should be placed
   * @param {number} y - The y-coordinate where the coin should be placed
   */
  constructor(x, y) {
    super();
    this.loadImage(this.IMAGES_COIN[0]);
    this.loadImages(this.IMAGES_COIN);
    this.x = x; 
    this.y = y; 
    this.width = 55;
    this.height = 55;
    this.animate();
  }

  /**
   * Starts the coin animation loop with hitbox updates.
   * Continuously cycles through the two coin images and updates collision detection.
   * Animation runs at 5fps (200ms intervals) for a gentle shimmering effect.
   */
  animate() {
    setStoppableInterval(() => {
      this.hitbox = this.getHitBox();
      this.playAnimation(this.IMAGES_COIN);
    }, 200);
  }
}