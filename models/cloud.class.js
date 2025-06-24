/**
 * Represents a cloud object in the game background.
 * Inherits movement capabilities from MovableObject.
 */
class Cloud extends MovableObject {
  /** @type {number} Vertical position of the cloud */
  y = 20;

  /** @type {number} Height of the cloud image */
  height = 250;

  /** @type {number} Width of the cloud image */
  width = 500;

  /**
   * Creates a new Cloud instance.
   * @param {number|null} [xPosition=null] - Optional X-position of the cloud. 
   *   If null, a random X-position is assigned.
   */
  constructor(xPosition = null) {
    super().loadImage("../img/5_background/layers/4_clouds/1.png");

    /**
     * @type {number} Horizontal position of the cloud.
     */
    this.x = xPosition !== null ? xPosition : Math.random() * 500;

    this.animate();
  }

  /**
   * Starts the cloud movement animation by moving it left continuously.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60); // ~60 FPS
  }
}
