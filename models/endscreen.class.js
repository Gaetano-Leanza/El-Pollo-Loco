/**
 * Represents the end screen displayed when the game concludes.
 * Shows either a game over screen or victory screen based on the game outcome.
 * Covers the entire canvas with a full-screen overlay.
 * @extends DrawableObject
 */
class Endscreen extends DrawableObject {
  /**
   * Array of image paths for different end screen types.
   * Index 0: Game over screen
   * Index 1: Victory/win screen
   * @type {string[]}
   * @static
   */
  IMAGES = [
    "img/9_intro_outro_screens/game_over/game-over-1.png", //game over
    "img/9_intro_outro_screens/win/win-1.png", // you win
  ];

  /**
   * Creates a new Endscreen instance with the specified screen type.
   * Automatically sizes to fill the entire canvas (720x480).
   * @param {number} index - Screen type index (0 for game over, 1 for victory)
   */
  constructor(index) {
    super();

    this.loadImage(this.IMAGES[index]);
    this.x = 0;
    this.y = 0;
    this.width = 720;
    this.height = 480;
  }
}