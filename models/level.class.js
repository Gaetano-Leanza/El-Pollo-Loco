/**
 * Represents a game level containing all objects and entities within a specific area.
 * Acts as a container for enemies, environmental elements, collectibles, and level boundaries.
 * Defines the playable space and all interactive elements within it.
 */
class Level {
  /**
   * Array of enemy objects (chickens, small chickens, endboss) present in this level.
   * @type {MovableObject[]}
   */
  enemies;

  /**
   * Array of cloud objects providing atmospheric background elements.
   * @type {Cloud[]}
   */
  clouds;

  /**
   * Array of background layer objects for parallax scrolling effects.
   * @type {BackgroundObject[]}
   */
  backgroundObjects;

  /**
   * Array of collectible coin objects scattered throughout the level.
   * @type {Coin[]}
   */
  coins;

  /**
   * Array of collectible bottle objects that can be picked up and thrown.
   * @type {CollectibleItem[]}
   */
  bottles;

  /**
   * X-coordinate marking the end boundary of the level.
   * Used for level completion detection and boundary constraints.
   * @type {number}
   * @default 5200
   */
  level_end_x = 5200;

  /**
   * Creates a new Level instance with all specified game objects.
   * @param {MovableObject[]} enemies - Array of enemy objects for this level
   * @param {Cloud[]} clouds - Array of cloud objects for atmospheric effects
   * @param {BackgroundObject[]} backgroundObjects - Array of background layers for parallax
   * @param {Coin[]} coins - Array of collectible coin objects
   * @param {CollectibleItem[]} bottles - Array of collectible bottle objects
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}