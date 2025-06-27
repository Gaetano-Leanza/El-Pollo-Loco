
// ================================
// FILE 3: CharacterActions.js
// ================================

/**
 * Handles character actions like throwing bottles, collecting items
 */
class CharacterActions {
  /**
   * @param {Character} character - Reference to the main character object
   */
  constructor(character) {
    this.character = character;
  }

  /**
   * Initiates bottle throwing sequence if conditions are met
   */
  throwBottle() {
    if (!this.canThrowBottle()) return;

    const bottle = this.createThrowableBottle();
    this.addBottleToWorld(bottle);
    this.character.collectedBottles--;
    this.character.resetIdleTimer();
    this.markAsThrowingTemporarily();
  }

  /**
   * Checks if character can throw a bottle
   * @returns {boolean} True if bottle can be thrown
   */
  canThrowBottle() {
    return this.character.collectedBottles > 0 && !this.character.isDying;
  }

  /**
   * Creates a new throwable bottle object at character position
   * @returns {ThrowableObject} New throwable bottle instance
   */
  createThrowableBottle() {
    return new ThrowableObject(
      this.character.x + this.character.width / 2, 
      this.character.y
    );
  }

  /**
   * Adds a bottle to the world's throwable objects array
   * @param {ThrowableObject} bottle - The bottle to add to the world
   */
  addBottleToWorld(bottle) {
    this.character.world.throwableObjects.push(bottle);
  }

  /**
   * Temporarily marks character as throwing to prevent animation conflicts
   */
  markAsThrowingTemporarily() {
    this.character.isThrowingBottle = true;
    setTimeout(() => {
      this.character.isThrowingBottle = false;
    }, 100);
  }

  /**
   * Increases the character's collected coin counter by one
   */
  collectCoin() {
    this.character.collectedCoins++;
    this.character.resetIdleTimer();
    playSound("coin.mp4"); // Play coin collection sound
  }

  /**
   * Increases the character's collected bottle counter by one
   */
  collectBottle() {
    if (this.character.collectedBottles < this.character.maxBottles) {
      this.character.collectedBottles++;
      this.character.resetIdleTimer();
      playSound("bottle.mp4"); // Play bottle collection sound
    }
  }

  /**
   * Checks if character can collect more coins
   * @returns {boolean} True if more coins can be collected
   */
  canCollectMoreCoins() {
    return this.character.collectedCoins < this.character.maxCoins;
  }

  /**
   * Checks if character can collect more bottles
   * @returns {boolean} True if more bottles can be collected
   */
  canCollectMoreBottles() {
    return this.character.collectedBottles < this.character.maxBottles;
  }

  /**
   * Gets the current collection status
   * @returns {Object} Object with coin and bottle collection info
   */
  getCollectionStatus() {
    return {
      coins: {
        collected: this.character.collectedCoins,
        max: this.character.maxCoins,
        canCollectMore: this.canCollectMoreCoins()
      },
      bottles: {
        collected: this.character.collectedBottles,
        max: this.character.maxBottles,
        canCollectMore: this.canCollectMoreBottles()
      }
    };
  }
}
