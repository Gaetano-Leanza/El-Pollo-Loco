class GameOver {
  static GAME_OVER_DISPLAY_TIME = 3000; // 3 seconds

  constructor() {
    this.gameOverImage = null;
    this.showGameOverOverlay = false;
    this.world = null; // Can be set later if needed
    this.ctx = null; // Can be set later if needed
    this.loadGameOverImage(); // Bild direkt beim Erstellen laden
  }

  /**
   * Displays the game over screen with overlay and automatic page reload.
   * Loads game over image if not already loaded and handles display timing.
   */
  showGameOverScreen() {
    if (!this.gameOverImage) {
      this.loadGameOverImage();
    }

    const displayGameOver = () => {
      const ctx = this.ctx || this.findCanvasContext();
      if (!ctx || !this.gameOverImage) {
        console.error("Canvas context or Game Over image not available");
        return;
      }

      const canvas = ctx.canvas || this.canvas;
      const bounds = this.calculateCenteredImageBounds(
        canvas,
        this.gameOverImage
      );

      this.showGameOverOverlay = true;


      
      this.animateScreen(
        () => this.showGameOverOverlay,
        () =>
          this.drawOverlay(
            ctx,
            canvas,
            this.gameOverImage,
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height
          )
      );

      setTimeout(() => location.reload(), GameOver.GAME_OVER_DISPLAY_TIME);
    };

    if (this.gameOverImage?.complete) {
      displayGameOver();
    } else if (this.gameOverImage) {
      this.gameOverImage.onload = displayGameOver;
    }
  }

  /**
   * Animates a screen overlay using requestAnimationFrame.
   * Continues animation while condition function returns true.
   * @param {Function} conditionFn - Function that returns true to continue animation
   * @param {Function} drawFn - Function to draw the screen content
   */
  animateScreen(conditionFn, drawFn) {
    const draw = () => {
      if (conditionFn()) {
        drawFn();
        requestAnimationFrame(draw);
      }
    };
    draw();
  }

  /**
   * Loads the game over image with error handling.
   * Sets up error callback for load failures.
   */
  loadGameOverImage() {
    this.gameOverImage = new Image();
    this.gameOverImage.src = "img/You won, you lost/Game Over.png";
    this.gameOverImage.onerror = (error) =>
      console.error("Failed to load Game Over image:", error);
  }

  /**
   * Finds and returns available canvas 2D rendering context.
   * Searches through multiple possible sources for the context.
   * @returns {CanvasRenderingContext2D|null} The 2D rendering context or null if not found
   */
  findCanvasContext() {
    if (this.ctx) return this.ctx;
    if (this.world?.ctx) return this.world.ctx;
    if (this.world?.canvas) return this.world.canvas.getContext("2d");

    const canvas = document.querySelector("canvas");
    return canvas?.getContext("2d") || null;
  }

  /**
   * Calculates bounds to center an image on canvas
   * @param {HTMLCanvasElement} canvas
   * @param {HTMLImageElement} image
   * @returns {Object} Contains x, y, width, height for centered image
   */
  calculateCenteredImageBounds(canvas, image) {
    const ratio =
      Math.min(canvas.width / image.width, canvas.height / image.height) * 0.75; // Scale to 75% of max possible size
    const width = image.width * ratio;
    const height = image.height * ratio;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;
    return { x, y, width, height };
  }

  /**
   * Draws the game over overlay
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {HTMLImageElement} image
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  drawOverlay(ctx, canvas, image, x, y, width, height) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, x, y, width, height);
  }
}