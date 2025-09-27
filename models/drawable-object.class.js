/**
 * Base class for all drawable game objects that can be rendered to the canvas.
 * Provides common functionality for image loading, drawing, and debug frame rendering.
 * This is the foundation class for all visual game elements.
 */
class DrawableObject {
  /**
   * X-coordinate position of the object on the canvas.
   * @type {number}
   * @default 120
   */
  x = 120;

  /**
   * Y-coordinate position of the object on the canvas.
   * @type {number}
   * @default 190
   */
  y = 190;

  /**
   * Height of the object in pixels.
   * @type {number}
   */
  height;

  /**
   * Width of the object in pixels.
   * @type {number}
   */
  width;

  /**
   * HTML Image element for the current object sprite.
   * @type {HTMLImageElement}
   */
  img;

  /**
   * Cache object storing preloaded images by their file path.
   * Used for animation frames and performance optimization.
   * @type {Object.<string, HTMLImageElement>}
   */
  imageCache = {};

  /**
   * Index of the current image being displayed in animation sequences.
   * @type {number}
   * @default 0
   */
  currentImage = 0;

  /**
   * Loads a single image from the specified path and assigns it to the object.
   * @param {string} path - File path to the image resource
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object to the canvas at its current position and size.
   * Includes error handling for missing or corrupted images.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas
   */
  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (e) {
      console.warn("Error loading image", e);
      console.log("Could not load image,", this.img);
    }
  }

  /**
   * Draws debug collision frames around objects based on their type.
   * Uses different colors for different object categories for visual debugging.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas
   */
  drawFrame(ctx) {
    if (this instanceof Chicken ||this instanceof Endboss ||this instanceof ChickenSmall) {
      this.drawFrameOfEnemies(ctx);
    } else if (
      this instanceof Coin ||this instanceof Bottle ||this instanceof ThrowableObject) {
        this.drawFrameOfObjects(ctx);
     
    } else if (this instanceof Character) {
      this.drawFrameOfCharacter(ctx);
    }
  }

  /**
   * Draws blue collision frame for enemy objects (Chicken, Endboss, ChickenSmall).
   * Frame respects the object's collision offset values.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas
   */
  drawFrameOfEnemies(ctx){
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "blue";
    ctx.rect(this.x + this.offset.left,
      this.y + this.offset.top,
      this.width - this.offset.left - this.offset.right,
      this.height - this.offset.top - this.offset.bottom);
    ctx.stroke();
  }

  /**
   * Draws yellow collision frame for collectible and throwable objects.
   * Frame respects the object's collision offset values.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas
   */
  drawFrameOfObjects(ctx){
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "yellow";
    ctx.rect(this.x + this.offset.left,
      this.y + this.offset.top,
      this.width - this.offset.left - this.offset.right,
      this.height - this.offset.top - this.offset.bottom);
    ctx.stroke();
  }

  /**
   * Draws green collision frame for the main character.
   * Frame respects the object's collision offset values.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas
   */
  drawFrameOfCharacter(ctx){
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "green";
    ctx.rect(this.x + this.offset.left,
      this.y + this.offset.top,
      this.width - this.offset.left - this.offset.right,
      this.height - this.offset.top - this.offset.bottom);
    ctx.stroke();
  }

  /**
   * Preloads multiple images into the image cache for animation purposes.
   * Improves performance by loading all animation frames upfront.
   * @param {string[]} arr - Array of file paths to image resources
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}