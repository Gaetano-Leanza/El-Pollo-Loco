// ================================
// FILE 1: CharacterAnimations.js
// ================================

/**
 * Handles all character animations separately from main Character class
 * Manages animation states, timing, and visual effects
 */
class CharacterAnimations {
  /**
   * @param {Character} character - Reference to the main character object
   */
  constructor(character) {
    this.character = character;
    this.idleInterval = null;
  }

  /**
   * Starts the animation watcher interval that manages character animations
   * Handles death, hurt, jumping, walking, and idle animations with priority system
   */
  startAnimationWatcher() {
    this.idleInterval = setInterval(() => {
      // Priority-based animation handling
      if (this.handleDeathAnimation()) return;
      if (this.handleHurtAnimation()) return;
      if (this.handleJumpingAnimation()) return;
      if (this.handleWalkingAnimation()) return;
      if (this.character.isThrowingBottle) return;

      // Handle idle animations if no other animation is active
      const idleTime = Date.now() - this.character.lastMoveTime;
      this.handleIdleAnimations(idleTime);
    }, this.character.constructor.ANIMATION_INTERVAL);
  }

  /**
   * Handles death animation sequence
   * @returns {boolean} True if death animation is active
   */
  handleDeathAnimation() {
    if (this.character.isDead() || this.character.isDying) {
      if (!this.character.deathAnimationStarted) {
        this.character.deathAnimationStarted = true;
        this.playDeathAnimation();
      }
      return true;
    }
    return false;
  }

  /**
   * Handles hurt animation and sound effects
   * @returns {boolean} True if hurt animation is playing
   */
  handleHurtAnimation() {
    if (this.character.isDying) return false;
    
    if (this.character.isHurt()) {
      this.character.playAnimation(this.character.IMAGES_HURT);
      if (!this.character.hurtSoundPlayed) {
        playSound("hurt-character.mp4");
        this.character.hurtSoundPlayed = true;
      }
      return true;
    } else {
      this.character.hurtSoundPlayed = false;
      return false;
    }
  }

  /**
   * Handles jumping animation when character is airborne
   * @returns {boolean} True if jumping animation is playing
   */
  handleJumpingAnimation() {
    if (this.character.isDying) return false;
    
    if (this.character.isAboveGround()) {
      this.character.playAnimation(this.character.IMAGES_JUMPING);
      return true;
    }
    return false;
  }

  /**
   * Handles walking animation based on keyboard input
   * @returns {boolean} True if walking animation is playing
   */
  handleWalkingAnimation() {
    if (this.character.isDying) return false;
    
    const keyboard = this.character.world.keyboard;
    if (keyboard.RIGHT || keyboard.LEFT || keyboard.D) {
      this.character.playAnimation(this.character.IMAGES_WALKING);
      return true;
    }
    return false;
  }

  /**
   * Handles idle animations based on time since last movement
   * @param {number} idleTime - Time in milliseconds since last movement
   */
  handleIdleAnimations(idleTime) {
    if (this.character.isDying) return;
    
    const { IDLE_TIME_LONG, IDLE_TIME_SHORT } = this.character.constructor;
    
    if (idleTime > IDLE_TIME_LONG) {
      this.character.playAnimation(this.character.IMAGES_LONG_IDLE);
    } else if (idleTime > IDLE_TIME_SHORT) {
      this.character.playAnimation(this.character.IMAGES_IDLE);
    }
  }

  /**
   * Plays the death animation sequence and handles game over screen
   */
  playDeathAnimation() {
    playSound("death-scream.mp4");
    
    let currentFrame = 0;
    const animationInterval = setInterval(() => {
      if (currentFrame < this.character.IMAGES_DEAD.length) {
        this.character.img = this.character.imageCache[this.character.IMAGES_DEAD[currentFrame]];
        currentFrame++;
      } else {
        clearInterval(animationInterval);
        this.showGameOverScreen();
      }
    }, this.character.constructor.DEATH_ANIMATION_FRAME_DURATION);
  }

  /**
   * Triggers the game over screen display
   */
  showGameOverScreen() {
    this.character.gameOverHandler.world = this.character.world;
    this.character.gameOverHandler.ctx = this.character.ctx || this.character.findCanvasContext();
    this.character.gameOverHandler.canvas = this.character.canvas;
    this.character.gameOverHandler.showGameOverScreen();
  }

  /**
   * Stops the animation watcher interval
   */
  stopAnimationWatcher() {
    if (this.idleInterval) {
      clearInterval(this.idleInterval);
      this.idleInterval = null;
    }
  }
}