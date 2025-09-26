/**
 * Represents a generic collectible item that can be either a coin or a bottle.
 * This factory-pattern class creates different types of collectible items based on the type parameter.
 * Items are randomly positioned within specified bounds and have type-specific animations.
 * @extends MovableObject
 */
class CollectibleItem extends MovableObject {
  /**
   * Array to store the current item's animation images based on type.
   * Populated during construction based on the item type.
   * @type {string[]}
   */
  images = [];

  /**
   * Array of image paths for coin animation frames.
   * Used when creating coin-type collectible items.
   * @type {string[]}
   * @static
   */
  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Array of image paths for bottle collectible (single frame).
   * Used when creating bottle-type collectible items.
   * @type {string[]}
   * @static
   */
  IMAGES_BOTTLE = ["img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"];

  /**
   * Creates a new CollectibleItem of the specified type with random positioning.
   * @param {string} type - The type of collectible to create ("coin" or "bottle")
   */
  constructor(type) {
    super();
    if (type === "coin") {
      this.images = this.IMAGES_COIN;
    } else if (type === "bottle") {
      this.images = this.IMAGES_BOTTLE;
    }
    this.loadImage(this.images[0]);
    this.loadImages(this.images);
    this.x = 200 + Math.random() * 1800; // Random x position between 200-2000px
    this.y = 320 + Math.random() * -200; // Random y position between 120-320px (negative range moves upward)
    this.width = 70;
    this.height = 70;
    this.animate();
  }

  /**
   * Starts the animation loop for the collectible item.
   * Cycles through the item's images at 5fps (200ms intervals).
   * Coins will animate between two frames, bottles will show single frame.
   */
  animate() {
    setStoppableInterval(() => {
      this.playAnimation(this.images);
    }, 200);
  }
}