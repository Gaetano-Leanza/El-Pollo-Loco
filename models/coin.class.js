/**
 * Represents a collectible coin object in the game.
 * Inherits drawing capabilities from DrawableObject.
 */
class Coin extends DrawableObject {
  /**
   * Creates a new Coin instance at the specified position.
   * @param {number} x - The horizontal position of the coin.
   * @param {number} y - The vertical position of the coin.
   */
  constructor(x, y) {
    super();
    /** @type {number} Horizontal position */
    this.x = x;
    /** @type {number} Vertical position */
    this.y = y;
    /** @type {number} Width of the coin */
    this.width = 120;
    /** @type {number} Height of the coin */
    this.height = 120;
    this.loadImage("img/8_coin/coin_1.png");

    /**
     * Current phase used to create blinking opacity effect (radians).
     * @type {number}
     */
    this.blinkPhase = Math.random() * 2 * Math.PI;

    /**
     * Speed of blinking animation (radians per update).
     * @type {number}
     */
    this.blinkSpeed = 0.05;

    /**
     * Whether this coin has been collected.
     * @type {boolean}
     */
    this.isCollected = false;
  }

  /**
   * Updates the blinking animation phase.
   * Should be called every frame to animate the coin.
   * @returns {void}
   */
  update() {
    if (!this.isCollected) {
      this.blinkPhase += this.blinkSpeed;
    }
  }

  /**
   * Draws the coin on the given canvas context with blinking opacity.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @returns {void}
   */
  draw(ctx) {
    if (!this.isCollected) {
      const opacity = 0.7 + 0.3 * Math.sin(this.blinkPhase);
      ctx.save();
      ctx.globalAlpha = opacity;
      super.draw(ctx);
      ctx.restore();
    }
  }

  /**
   * Returns the hitbox rectangle for collision detection.
   * The hitbox is smaller than the full image to better fit the visible coin area.
   * @returns {{x: number, y: number, width: number, height: number}} Hitbox dimensions.
   */
  getHitbox() {
    return {
      x: this.x + 30,
      y: this.y + 30,
      width: this.width - 60,
      height: this.height - 60,
    };
  }

  /**
   * Collects the coin and marks as collected.
   * Note: Sound is handled by the World's checkPickups method.
   * @returns {void}
   */
  collect() {
    if (!this.isCollected) {
      this.isCollected = true;
    }
  }

  /**
   * Draws the coin counter at the top center of the canvas.
   * This should be called in your main game loop after drawing all other objects.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {number} canvasWidth - Width of the canvas for centering.
   * @param {number} collectedCoins - Number of coins collected by the character.
   * @returns {void}
   */
  static drawCounter(ctx, canvasWidth, collectedCoins) {
    ctx.save();

    // Counter-Hintergrund (optional)
    const counterWidth = 120;
    const counterHeight = 40;
    const counterX = (canvasWidth - counterWidth) / 2;
    const counterY = 20;

    // Hintergrund mit abgerundeten Ecken
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.beginPath();
    ctx.roundRect(counterX, counterY, counterWidth, counterHeight, 10);
    ctx.fill();

    // Goldener Rand
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text-Styling
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Coin-Symbol (optional)
    const coinSymbol = "🪙";
    ctx.font = "20px Arial";
    ctx.fillText(coinSymbol, counterX + 25, counterY + counterHeight / 2);

    // Counter-Text
    ctx.font = "bold 20px Arial";
    ctx.fillText(
      collectedCoins.toString(),
      counterX + counterWidth - 25,
      counterY + counterHeight / 2
    );

    ctx.restore();
  }

  /**
   * Gets the current number of collected coins from the character.
   * @param {Character} character - The character object.
   * @returns {number} Number of collected coins.
   */
  static getCollectedCoins(character) {
    return character.collectedCoins;
  }
}
