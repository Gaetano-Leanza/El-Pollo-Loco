/**
 * Base class for all drawable objects in the game.
 * Provides basic image loading, drawing, and collision detection.
 */
class DrawableObject {
  /** @type {HTMLImageElement} Current image displayed */
  img;

  /** @type {Object.<string, HTMLImageElement>} Cache of preloaded images */
  imageCache = {};

  /** @type {number} Index of the current image in an animation sequence */
  currentImage = 0;

  /** @type {number} Horizontal position on the canvas */
  x = 120;

  /** @type {number} Vertical position on the canvas */
  y = 280;

  /** @type {number} Height of the drawable object */
  height = 150;

  /** @type {number} Width of the drawable object */
  width = 100;

  /**
   * Loads a single image from the specified path.
   * @param {string} path - The URL/path to the image.
   * @returns {void}
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the current image on the given canvas context at the object's position and size.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @returns {void}
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a red bounding box (hitbox) around the object for debugging purposes.
   * Only applies for instances of Character, Chicken, ChickenSmall, or Endboss.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @returns {void}
   */
  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof ChickenSmall ||
      this instanceof Endboss
    ) {
      const hb = this.getHitbox();
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "red";
      ctx.rect(hb.x, hb.y, hb.width, hb.height);
      ctx.stroke();
    }
  }

  /**
   * Preloads multiple images from an array of paths and stores them in the image cache.
   * @param {string[]} arr - Array of image URLs/paths.
   * @returns {void}
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Checks for collision between this object and another drawable object.
   * Uses hitboxes if available; otherwise, uses default bounding boxes.
   * @param {DrawableObject} obj - The other object to check collision against.
   * @returns {boolean} True if objects collide, false otherwise.
   */
  isColliding(obj) {
    const thisHitbox = this.getHitbox
      ? this.getHitbox()
      : this.getDefaultHitbox();
    const objHitbox = obj.getHitbox ? obj.getHitbox() : obj.getDefaultHitbox();

    return (
      thisHitbox.x < objHitbox.x + objHitbox.width &&
      thisHitbox.x + thisHitbox.width > objHitbox.x &&
      thisHitbox.y < objHitbox.y + objHitbox.height &&
      thisHitbox.y + thisHitbox.height > objHitbox.y
    );
  }

  /**
   * Returns the default hitbox, which is the object's full bounding rectangle.
   * Can be overridden by subclasses for more precise hitboxes.
   * @returns {{x: number, y: number, width: number, height: number}} Default bounding box.
   */
  getDefaultHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
