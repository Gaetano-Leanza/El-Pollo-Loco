/**
 * Represents a regular-sized chicken enemy in the game.
 * Inherits from the BaseChicken class and initializes its position, size, and animations.
 */
class Chicken extends BaseChicken {
  /**
   * Creates a new Chicken instance.
   * @param {number} xOffset - The horizontal position offset for the chicken's initial spawn.
   */
  constructor(xOffset) {
    super(
      xOffset,         // X-position offset
      80,              // Y-position
      60,              // Width
      360,             // Height
      [                // Array of image paths for walking animation
        "../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "../img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "../img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
      ],
      "../img/3_enemies_chicken/chicken_normal/2_dead/dead.png" // Image path for dead state
    );
  }
}
