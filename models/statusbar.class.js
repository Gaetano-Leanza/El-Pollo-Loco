/**
 * Represents a status bar UI element that displays various game metrics with visual progress indicators.
 * Supports different types: health, coin collection, bottle inventory, and endboss health.
 * Each type has color-coded imagery and appropriate positioning on screen.
 * @extends DrawableObject
 */
class Statusbar extends DrawableObject {
  /**
   * Array of image paths for health status bar with color-coded progression.
   * Colors change from orange (low) to blue (medium) to green (high).
   * @type {string[]}
   * @static
   */
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /**
   * Array of image paths for coin collection status bar in blue theme.
   * @type {string[]}
   * @static
   */
  IMAGES_COIN = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  /**
   * Array of image paths for bottle/salsa inventory status bar in blue theme.
   * @type {string[]}
   * @static
   */
  IMAGES_BOTTLE = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  /**
   * Array of image paths for endboss health status bar in orange theme.
   * @type {string[]}
   * @static
   */
  IMAGES_ENDBOSS = [
    "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
  ];

  /**
   * Current image array being used by this status bar instance.
   * Set during construction based on status bar type.
   * @type {string[]}
   */
  images = [];

  /**
   * Current percentage value (0-100) determining which image to display.
   * @type {number}
   */
  percentage;

  /**
   * Movement speed for animated status bars (specifically endboss).
   * @type {number}
   * @default 3
   */
  speed = 3;

  /**
   * Reference to the game world object.
   * @type {World}
   */
  world;

  /**
   * Creates a new Statusbar instance of the specified type.
   * @param {string} images - Status bar type ("health", "coin", "bottle", or "endboss")
   */
  constructor(images) {
    super();
    this.assignImages(images);
    this.loadImages(this.images);
    this.width = 150;
    this.height = 40;
    this.setPercentage(this.percentageStartValue());
  }

  /**
   * Determines the initial percentage value based on status bar type.
   * Health and endboss bars start full (100%), collection bars start empty (0%).
   * @returns {number} Initial percentage value (0 or 100)
   */
  percentageStartValue() {
    if (this.images === this.IMAGES || this.images === this.IMAGES_ENDBOSS) {
      return 100;
    } else {
      return 0;
    }
  }

  /**
   * Assigns the appropriate image array and screen position based on status bar type.
   * Sets up type-specific positioning and special behaviors (endboss animation).
   * @param {string} images - Status bar type identifier
   */
  assignImages(images) {
    if (images === "health") {
      this.images = this.IMAGES;
      this.x = 10;
      this.y = 80;
    } else if (images === "coin") {
      this.images = this.IMAGES_COIN;
      this.x = 10;
      this.y = 40;
    } else if (images === "bottle") {
      this.images = this.IMAGES_BOTTLE;
      this.x = 10;
      this.y = 0;
    } else {
      this.images = this.IMAGES_ENDBOSS;
      this.x = 770;
      this.y = 46;
      this.animateEndbossStatusbar();
    }
  }

  /**
   * Updates the status bar display based on the given percentage value.
   * Selects appropriate image from the current image array and updates display.
   * @param {number} percentage - New percentage value (0-100)
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Converts percentage value to appropriate image array index.
   * Uses threshold-based mapping: >80%→5, >60%→4, >40%→3, >20%→2, >0%→1, 0%→0.
   * @returns {number} Image array index (0-5)
   */
  resolveImageIndex() {
    if (this.percentage > 80) {
      return 5;
    } else if (this.percentage > 60) {
      return 4;
    } else if (this.percentage > 40) {
      return 3;
    } else if (this.percentage > 20) {
      return 2;
    } else if (this.percentage > 0) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Initiates the endboss status bar entrance animation.
   * Sets up continuous movement checking at 60fps.
   */
  animateEndbossStatusbar() {
    setStoppableInterval(() => this.moveToPosition(), 1000 / 60);
  }

  /**
   * Controls the endboss status bar sliding animation from off-screen to visible position.
   * Triggers when character encounters endboss, slides from right edge to center-right position.
   */
  moveToPosition() {
    if(this.x >= 550){
      if (this.world.level.enemies[0].characterMetEndboss) {
        this.moveLeft();
        if (this.x >= 550) {
          this.moveLeft();
        }
      }
    }
   
  }

  /**
   * Moves the status bar leftward during entrance animation.
   */
  moveLeft() {
    this.x -= this.speed;
  }
}