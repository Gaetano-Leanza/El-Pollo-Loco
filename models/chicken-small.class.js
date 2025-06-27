/**
 * Represents a small chicken enemy in the game.
 * Inherits properties and behaviors from the BaseChicken class.
 */
class ChickenSmall extends BaseChicken {
  /**
   * Creates a new ChickenSmall instance.
   * @param {number} xOffset - The horizontal position offset for the chicken's initial spawn.
   */
  constructor(xOffset) {
    super(
      xOffset,
      80, // Höherer y-Wert, aber...
      50, // Breite
      367, // Höhe hal
      [
        // Array of image paths for walking animation
        "../img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "../img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "../img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
      ],
      "../img/3_enemies_chicken/chicken_small/2_dead/dead.png" // Image path for dead state
    );
  }
}
