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
  }

  /**
   * Updates the blinking animation phase.
   * Should be called every frame to animate the coin.
   * @returns {void}
   */
  update() {
    this.blinkPhase += this.blinkSpeed;
  }

  /**
   * Draws the coin on the given canvas context with blinking opacity.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @returns {void}
   */
  draw(ctx) {
    const opacity = 0.7 + 0.3 * Math.sin(this.blinkPhase);
    ctx.save();
    ctx.globalAlpha = opacity;
    super.draw(ctx);
    ctx.restore();
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
   * Plays a sound when the coin is collected.
   * Optional: Can be extended to hide or remove the coin from the game world.
   * @returns {void}
   */
  collect() {
    this.collectSound.play();
    // Optional: Münze verstecken, entfernen oder als eingesammelt markieren
  }
}
