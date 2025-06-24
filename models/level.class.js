/**
 * Represents a game level containing enemies, clouds, background objects, coins, and bottles.
 */
class Level {
  /** @type {Array} Array of enemy objects present in the level */
  enemies;

  /** @type {Array} Array of cloud objects for background decoration */
  clouds;

  /** @type {Array} Array of background objects */
  backgroundObjects;

  /** @type {Array} Array of coin objects collectible in the level */
  coins;

  /** @type {Array} Array of bottle objects collectible in the level */
  bottles;

  /** @type {number} The x-coordinate representing the end of the level */
  level_end_x = 4300;

  /**
   * Creates a new Level instance.
   * @param {Array} enemies - The enemies in the level.
   * @param {Array} clouds - The clouds in the level.
   * @param {Array} backgroundObjects - The background objects in the level.
   * @param {Array} [coins=[]] - The coins in the level (optional).
   */
  constructor(enemies, clouds, backgroundObjects, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins || [];
    this.bottles = this.generateBottles();
  }

  /**
   * Generates an array of bottle objects placed randomly in the level.
   * @returns {Array} Array of generated Bottle instances.
   */
  generateBottles() {
    const bottles = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 2500;
      const y = 400;
      bottles.push(new Bottle(x, y));
    }
    return bottles;
  }
}
