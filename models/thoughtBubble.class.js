/**
 * Represents a thought bubble UI element that provides visual feedback to the player.
 * Displays hints about remaining objectives (enemies or coins) when partial game completion is achieved.
 * Appears temporarily above the character to guide player actions.
 * @extends MovableObject
 */
class ThoughtBubble extends MovableObject {
  /**
   * Height of the thought bubble in pixels.
   * @type {number}
   * @default 120
   */
  height = 120;

  /**
   * Width of the thought bubble in pixels.
   * @type {number}
   * @default 120
   */
  width = 120;

  /**
   * Array of image paths for different thought bubble messages.
   * Index 0: Reminder about remaining enemies
   * Index 1: Reminder about remaining coins
   * @type {string[]}
   * @static
   */
  IMAGES = ["img/thoughtBubble-enemies.png", "img/thoughtBubble-coins.png"];

  /**
   * Creates a new ThoughtBubble at the specified position with the given message type.
   * @param {number} index - Message type index (0 for enemies reminder, 1 for coins reminder)
   * @param {number} x - X-coordinate position for the thought bubble
   * @param {number} y - Y-coordinate position for the thought bubble
   */
  constructor(index, x, y) {
    super().loadImage(this.IMAGES[index]);
    this.x = x;
    this.y = y;
  }
}