/**
 * Represents a background object that extends MovableObject with parallax scrolling capabilities.
 * This class handles background layers with different movement speeds to create depth effects.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  /**
   * Array of image paths for different background layers.
   * Index 0: Air layer (static)
   * Index 1: Third layer (slowest moving)
   * Index 2: Second layer (medium speed)
   * Index 3: First layer (static foreground)
   * @type {string[]}
   * @static
   */
  IMAGES = [
    "img/5_background/layers/air.png",
    "img/5_background/layers/3_third_layer/full.png",
    "img/5_background/layers/2_second_layer/full.png",
    "img/5_background/layers/1_first_layer/full.png",
  ];

  /**
   * Array of movement speeds corresponding to each background layer.
   * Higher values create faster parallax movement.
   * Index 0: 0 (static air layer)
   * Index 1: 9 (fastest moving layer)
   * Index 2: 7 (medium speed layer)
   * Index 3: 0 (static foreground layer)
   * @type {number[]}
   * @static
   */
  speeds = [
    0,
    9,
    7,
    0, 
  ];

  /**
   * The current movement speed of this background object instance.
   * @type {number}
   */
  speed;

  /**
   * Index variable (purpose unclear from current implementation).
   * @type {number}
   */
  i; 

  /**
   * Height of the background object in pixels.
   * @type {number}
   * @default 480
   */
  height = 480;

  /**
   * Width of the background object in pixels.
   * @type {number}
   * @default 1440
   */
  width = 1440;

  /**
   * Creates a new BackgroundObject instance.
   * @param {number} index - Index to determine which image and speed to use (0-3)
   * @param {number} x - Initial x-position of the background object
   */
  constructor(index, x) {
    super();
    this.x = x;
    this.loadImage(this.IMAGES[index]);
    this.y = 480 - this.height;
    this.speed = this.speeds[index];
  }

  /**
   * Moves the background object to the left by adding the speed value to x-position.
   * Used for parallax scrolling when camera/player moves right.
   */
  moveLeft() {
    this.x += this.speed;
  }

  /**
   * Moves the background object to the right by subtracting the speed value from x-position.
   * Used for parallax scrolling when camera/player moves left.
   */
  moveRight() {
    this.x -= this.speed;
  }
}