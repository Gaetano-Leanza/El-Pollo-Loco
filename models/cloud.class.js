/**
 * Represents a cloud object that provides atmospheric background elements with parallax scrolling.
 * Clouds move independently and respond to camera movement to create depth in the game world.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  /**
   * Y-coordinate position of the cloud (high in the sky).
   * @type {number}
   * @default 20
   */
  y = 20;

  /**
   * Height of the cloud in pixels.
   * @type {number}
   * @default 300
   */
  height = 300;

  /**
   * Width of the cloud in pixels.
   * @type {number}
   * @default 500
   */
  width = 500;

  /**
   * Speed at which clouds move when following camera movement.
   * Used for parallax scrolling effects.
   * @type {number}
   * @default 9
   */
  cameraSpeed = 9;

  /**
   * Creates a new Cloud instance with randomized position and movement speed.
   * @param {string} path - The filename (without extension) of the cloud image to load from the clouds directory
   */
  constructor(path) {
    super().loadImage("img/5_background/layers/4_clouds/" + path + ".png");
    this.x = Math.random() * 2000;
    this.speed = Math.random() * 0.17;
    this.animate();
  }

  /**
   * Starts the animation loop for continuous cloud movement.
   * Sets up interval for automatic leftward drift at 60fps.
   */
  animate() {
    setStoppableInterval(() => this.moveLeft(), 1000 / 60);
  }

  /**
   * Moves cloud leftward when camera moves left, creating parallax effect.
   * Used to simulate camera movement by moving background elements.
   */
  moveLeftWithCamera() {
    this.x -= this.cameraSpeed;
  }

  /**
   * Moves cloud rightward when camera moves right, creating parallax effect.
   * Used to simulate camera movement by moving background elements.
   */
  moveRightWithCamera() {
    this.x += this.cameraSpeed;
  }
}