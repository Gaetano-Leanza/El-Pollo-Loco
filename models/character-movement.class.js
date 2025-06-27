
// ================================
// FILE 2: CharacterMovement.js
// ================================

/**
 * Handles all character movement logic including walking, jumping, and camera updates
 */
class CharacterMovement {
  /**
   * @param {Character} character - Reference to the main character object
   */
  constructor(character) {
    this.character = character;
  }

  /**
   * Handles horizontal movement based on keyboard input
   * @returns {boolean} True if character moved, false otherwise
   */
  handleMovement() {
    if (this.character.isDying) return false;

    let isMoving = false;
    const keyboard = this.character.world.keyboard;

    if (keyboard.RIGHT && this.character.x < this.character.world.level.level_end_x) {
      this.character.moveRight();
      this.character.otherDirection = false;
      isMoving = true;
    }

    if (keyboard.LEFT && this.character.x > 0) {
      this.character.moveLeft();
      this.character.otherDirection = true;
      isMoving = true;
    }

    return isMoving;
  }

  /**
   * Handles jumping behavior based on keyboard input and ground state
   * @param {boolean} isMoving - Whether character is currently moving horizontally
   * @returns {boolean} True if character is jumping or moving
   */
  handleJumping(isMoving) {
    if (this.character.isDying) return isMoving;

    if (this.character.world.keyboard.SPACE && !this.character.isAboveGround()) {
      this.character.jump();
      playSound("jump.mp4");
      return true;
    }
    return isMoving;
  }

  /**
   * Updates the camera position to follow the character
   */
  updateCamera() {
    if (!this.character.isDying) {
      this.character.world.camera_x = -this.character.x + 100;
    }
  }

  /**
   * Updates movement timing for idle detection
   * @param {boolean} isMoving - Whether the character is currently moving
   */
  updateLastMoveTime(isMoving) {
    if (isMoving && !this.character.isDying) {
      this.character.lastMoveTime = Date.now();
    }
  }

  /**
   * Checks if character can move (not dead/dying)
   * @returns {boolean} True if movement is allowed
   */
  canMove() {
    return !this.character.isDying && !this.character.isDead();
  }

  /**
   * Stops all character movement
   */
  stopMovement() {
    this.character.speed = 0;
    this.character.acceleration = 0;
    if (this.character.walking_sound) {
      this.character.walking_sound.pause();
    }
  }
}