/**
 * Handles character health, damage, and death logic
 */
class CharacterHealth {
  /**
   * @param {Character} character - Reference to the main character object
   */
  constructor(character) {
    this.character = character;
  }

  /**
   * Sets the character's health/energy value
   * @param {number} health - New health value to set
   */
  setHealth(health) {
    this.character.energy = Math.max(0, Math.min(100, health));
    this.checkForDeath();
  }

  /**
   * Handles character taking damage
   */
  hit() {
    if (this.character.isDying) return;

    const currentTime = new Date().getTime();

    // Check if enough time has passed since last hit (invincibility frames)
    if (currentTime - this.character.lastHit > this.character.timeToRecover) {
      // Reduce energy by 20 points
      this.character.energy -= 20;
      this.character.lastHit = currentTime;

      // Make sure energy doesn't go below 0
      this.character.energy = Math.max(0, this.character.energy);

      // Update status bar if it exists
      if (this.character.world && this.character.world.statusBar) {
        this.character.world.statusBar.setPercentage(this.character.energy);
      }
      if (this.character.world && this.character.world.statusBarHealth) {
        this.character.world.statusBarHealth.setPercentage(
          this.character.energy
        );
      }
    }

    this.checkForDeath();
  }

  /**
   * Checks if character should die based on various health indicators
   */
  checkForDeath() {
    if (this.character.isDying) return;

    const isDead =
      (this.character.energy !== undefined && this.character.energy <= 0) ||
      (this.character.health !== undefined && this.character.health <= 0) ||
      this.isDeadByStatusBar();

    if (isDead) {
      this.triggerDeath();
    }
  }

  /**
   * Checks if character is dead based on status bar indicators
   * @returns {boolean} True if dead by status bar
   */
  isDeadByStatusBar() {
    const statusBar = this.character.world?.statusBar;
    const healthBar = this.character.world?.statusBarHealth;

    return (
      statusBar?.percentage <= 0 ||
      statusBar?.statusBarIndex <= 0 ||
      statusBar?.currentImageIndex <= 0 ||
      healthBar?.percentage <= 0
    );
  }

  /**
   * Initiates the character death sequence
   */
  triggerDeath() {
    if (this.character.isDying) return;

    this.character.isDying = true;
    this.character.deathAnimationStarted = false;
    this.character.energy = 0;

    if (this.character.health !== undefined) {
      this.character.health = 0;
    }

    // Stop movement and sounds
    this.character.movement.stopMovement();
  }

  /**
   * Heals the character by a specified amount
   * @param {number} amount - Amount to heal
   */
  heal(amount) {
    if (this.character.isDying) return;

    this.character.energy = Math.min(this.character.energy + amount, 100);

    // Update status bars
    if (this.character.world && this.character.world.statusBar) {
      this.character.world.statusBar.setPercentage(this.character.energy);
    }
    if (this.character.world && this.character.world.statusBarHealth) {
      this.character.world.statusBarHealth.setPercentage(this.character.energy);
    }

    playSound("heal.mp4");
  }

  /**
   * Gets the current health percentage
   * @returns {number} Health as percentage (0-100)
   */
  getHealthPercentage() {
    return Math.max(0, this.character.energy);
  }

  /**
   * Checks if character is at full health
   * @returns {boolean} True if at maximum health
   */
  isFullHealth() {
    return this.character.energy >= 100;
  }

  /**
   * Checks if character is in critical health
   * @returns {boolean} True if health is critically low
   */
  isCriticalHealth() {
    return this.character.energy <= 20;
  }

  /**
   * Forces damage to character (bypasses invincibility frames)
   * @param {number} damage - Amount of damage to deal
   */
  forceDamage(damage) {
    if (this.character.isDying) return;

    this.character.energy -= damage;
    this.character.energy = Math.max(0, this.character.energy);
    this.character.lastHit = new Date().getTime();

    // Update status bars
    if (this.character.world && this.character.world.statusBar) {
      this.character.world.statusBar.setPercentage(this.character.energy);
    }
    if (this.character.world && this.character.world.statusBarHealth) {
      this.character.world.statusBarHealth.setPercentage(this.character.energy);
    }
    this.checkForDeath();
  }
}
