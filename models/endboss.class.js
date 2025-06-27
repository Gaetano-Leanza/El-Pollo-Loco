/**
 * Represents the final boss enemy in the game.
 * Inherits from MovableObject and contains logic for various states
 * like walking, alert, attacking, being hurt, and dying.
 */
class Endboss extends MovableObject {
  /** @type {number} Height of the endboss in pixels */
  height = 400;

  /** @type {number} Width of the endboss in pixels */
  width = 250;

  /** @type {number} Movement speed of the endboss */
  speed = 0.2;

  /** @type {number} Vertical position of the endboss */
  y = 62;

  /** @type {number} Horizontal position of the endboss */
  x = 3800;

  /** @type {string[]} Array of image paths for walking animation */
  IMAGES_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /** @type {string[]} Array of image paths for alert animation */
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /** @type {string[]} Array of image paths for attack animation */
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /** @type {string[]} Array of image paths for hurt animation */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /** @type {string[]} Array of image paths for death animation */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /** @type {boolean} Flag indicating if endboss is hurt */
  isHurt = false;

  /** @type {boolean} Flag indicating if endboss is dead */
  isDead = false;

  /** @type {boolean} Flag indicating if endboss is walking */
  isWalking = false;

  /** @type {boolean} Flag indicating if endboss is alerted */
  isAlerted = false;

  /** @type {boolean} Flag indicating if endboss is attacking */
  isAttacking = false;

  /** @type {number|undefined} Interval ID for animation loop */
  animationInterval;

  /** @type {number|undefined} Animation frame ID for movement */
  movementAnimationId;

  /** @type {number} Current frame index for hurt animation */
  hurtFrameIndex = 0;

  /** @type {boolean} Flag indicating if hurt animation is playing */
  hurtAnimationPlaying = false;

  /** @type {number} Current frame index for general animation */
  currentFrameIndex = 0;

  /** @type {boolean} Flag indicating if endboss is jumping */
  isJumping = false;

  /** @type {number} Y-coordinate where jump started */
  jumpStartY = 0;

  /** @type {number} X-coordinate where jump started */
  jumpStartX = 0;

  /** @type {number} X-coordinate where jump will end */
  jumpTargetX = 0;

  /** @type {number} Speed of the jump */
  jumpSpeed = 8;

  /** @type {number} Maximum height of the jump */
  jumpHeight = 150;

  /** @type {number} Current progress of jump (0-1) */
  jumpProgress = 0;

  /** @type {HTMLImageElement|null} Image to show on victory */
  victoryImage = null;

  /** @type {boolean} Flag indicating if victory screen should be shown */
  showVictoryScreen = false;

  /** @type {number} Current health of endboss */
  health = 100;

  /** @type {number} Number of hits taken */
  hitCounter = 0;

  /** @type {number} Timestamp of last hit */
  lastHitTime = 0;

  /** @type {number} Cooldown time between hits in ms */
  hitCooldown = 500;

  /** @type {number} Maximum number of hits before death */
  maxHits = 5;

  /**
   * Creates a new Endboss instance
   * @constructor
   */
  constructor() {
    super();
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.isDead = false;
    if (this.endboss) {
      this.endboss.worldReference = this;
    }
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 4000;
    this.loadVictoryImage();
    this.animate();
    this.startMovement();

    setTimeout(() => {
      if (world) this.worldReference = world;
    }, 100);
  }

  /**
   * Loads the victory image that will be displayed when boss is defeated
   */
  loadVictoryImage() {
    this.victoryImage = new Image();
    this.victoryImage.src = "img/You won, you lost/You won A.png";
  }

  /**
   * Starts the animation loop for the endboss
   * Determines which animation to play based on current state
   */
  animate() {
    this.animationInterval = setInterval(() => {
      if (this.isDead) {
        this.playDeathAnimation();
      } else if (this.isHurt) {
        this.playHurtAnimation();
      } else if (this.isAttacking) {
        this.playAttackAnimation();
      } else if (this.isAlerted) {
        this.playAlertAnimation();
      } else if (this.isWalking) {
        this.playWalkAnimation();
      } else {
        this.playAlertAnimation();
      }
    }, 200);
  }

  /**
   * Starts the movement logic for the endboss
   * Handles direction updates and distance evaluation
   */
  startMovement() {
    const move = () => {
      if (this.isDead) {
        cancelAnimationFrame(this.movementAnimationId);
        return;
      }

      if (window.character) {
        this.updateDirection();
        this.evaluateCharacterDistance();
        if (this.isJumping) this.updateJumpAttack();
      }

      this.movementAnimationId = requestAnimationFrame(move);
    };
    move();
  }

  /**
   * Updates the facing direction of the endboss based on character position
   */
  updateDirection() {
    if (!this.isJumping) {
      this.otherDirection = character.x > this.x;
    }
  }

  /**
   * Evaluates distance to character and triggers appropriate behavior
   */
  evaluateCharacterDistance() {
    const distance = Math.abs(this.x - character.x);

    if (distance < 100) {
      this.handleCloseRange();
    } else if (distance < 400) {
      this.handleMidRange();
    } else {
      this.handleFarRange();
    }
  }

  /**
   * Handles behavior when character is in close range (<100px)
   */
  handleCloseRange() {
    if (!this.isAttacking && !this.isJumping) {
      this.startJumpAttack();
    }
    this.isWalking = false;
    this.isAttacking = true;
    this.isAlerted = false;
  }

  /**
   * Handles behavior when character is in mid range (100-399px)
   */
  handleMidRange() {
    if (!this.isHurt && !this.isAlerted && !this.isJumping) {
      this.isWalking = true;
      this.isAttacking = false;
    }
    this.moveTowardsCharacter();
  }

  /**
   * Handles behavior when character is in far range (>=400px)
   */
  handleFarRange() {
    this.isWalking = false;
    this.isAttacking = false;
    if (!this.isHurt && !this.isJumping) {
      this.isAlerted = true;
    }
  }

  /**
   * Moves the endboss towards the character
   */
  moveTowardsCharacter() {
    if (!window.character || this.isDead || !this.isWalking) return;

    const distanceX = character.x - this.x;
    const speed = 3;

    this.otherDirection = character.x > this.x;

    if (Math.abs(distanceX) > 20) {
      this.x += distanceX > 0 ? speed : -speed;
    }
  }

  /**
   * Plays the alert animation
   */
  playAlertAnimation() {
    this.playAnimation(this.IMAGES_ALERT);
  }

  /**
   * Plays the walking animation
   */
  playWalkAnimation() {
    this.playAnimation(this.IMAGES_WALK);
  }

  /**
   * Plays the hurt animation
   */
  playHurtAnimation() {
    if (!this.hurtAnimationPlaying) {
      this.hurtAnimationPlaying = true;
      this.hurtFrameIndex = 0;
    }

    this.loadImage(this.IMAGES_HURT[this.hurtFrameIndex]);

    if (this.hurtFrameIndex < this.IMAGES_HURT.length - 1) {
      this.hurtFrameIndex++;
    } else {
      this.isHurt = false;
      this.hurtAnimationPlaying = false;
      this.isAlerted = true;
      setTimeout(() => {
        this.isAlerted = false;
        this.isWalking = true;
      }, 1000);
    }
  }

  /**
   * Starts a jump attack towards the character
   */
  startJumpAttack() {
    if (this.isJumping || !window.character) return;

    this.isJumping = true;
    this.jumpStartY = this.y;
    this.jumpStartX = this.x;
    this.jumpTargetX = character.x;
    this.jumpProgress = 0;
    this.otherDirection = character.x > this.x;
  }

  /**
   * Updates the jump attack progress
   */
  updateJumpAttack() {
    if (!this.isJumping) return;

    this.advanceJumpProgress();

    if (this.isJumpComplete()) {
      this.finishJump();
      return;
    }

    this.updateJumpPosition();
  }

  /**
   * Advances the jump progress
   */
  advanceJumpProgress() {
    this.jumpProgress += 0.05;
  }

  /**
   * Checks if jump is complete
   * @returns {boolean} True if jump is complete
   */
  isJumpComplete() {
    return this.jumpProgress >= 1;
  }

  /**
   * Finishes the jump attack and resets state
   */
  finishJump() {
    this.isJumping = false;
    this.y = this.jumpStartY;
    this.jumpProgress = 0;

    setTimeout(() => {
      this.isAttacking = false;
    }, 500);
  }

  /**
   * Updates the position during a jump attack
   */
  updateJumpPosition() {
    const progress = this.jumpProgress;
    const targetDistance = this.jumpTargetX - this.jumpStartX;

    this.x = this.jumpStartX + targetDistance * progress;

    const verticalOffset = this.jumpHeight * Math.sin(progress * Math.PI);
    this.y = this.jumpStartY - verticalOffset;
  }

  /**
   * Plays the attack animation
   */
  playAttackAnimation() {
    this.playAnimation(this.IMAGES_ATTACK);
  }

  /**
   * Plays the death animation and handles victory sequence
   */
  playDeathAnimation() {
    this.victorySound
      .play()
      .catch((e) =>
        console.warn("Sieges-Sound konnte nicht abgespielt werden:", e)
      );

    this.playAnimation(this.IMAGES_DEAD);

    setTimeout(() => {
      clearInterval(this.animationInterval);
      cancelAnimationFrame(this.movementAnimationId);
      this.shouldBeRemoved = true;
      this.showVictoryScreen = true;
      this.displayVictoryScreen();
    }, this.IMAGES_DEAD.length * 200);
  }

  /**
   * Displays the victory screen
   */
  displayVictoryScreen() {
    const ctx = this.findCanvasContext();
    if (!this.victoryImage || !ctx) return;

    const canvas = ctx.canvas;
    const { x, y, width, height } = this.calculateCenteredImageBounds(canvas);

    const draw = () =>
      this.drawVictoryOverlay(ctx, canvas, x, y, width, height);

    const loop = () => {
      if (this.showVictoryScreen) {
        draw();
        requestAnimationFrame(loop);
      }
    };

    loop();

    this.scheduleVictoryScreenEnd();
  }

  /**
   * Calculates the bounds for centering the victory image
   * @param {HTMLCanvasElement} canvas The game canvas
   * @returns {Object} Position and dimensions for centered image
   */
  calculateCenteredImageBounds(canvas) {
    const maxWidth = canvas.width * 0.8;
    const maxHeight = canvas.height * 0.8;

    const scale = Math.min(
      maxWidth / this.victoryImage.width,
      maxHeight / this.victoryImage.height,
      1
    );

    const width = this.victoryImage.width * scale;
    const height = this.victoryImage.height * scale;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;

    return { x, y, width, height };
  }

  /**
   * Draws the victory overlay on canvas
   * @param {CanvasRenderingContext2D} ctx Canvas context
   * @param {HTMLCanvasElement} canvas Game canvas
   * @param {number} x X position
   * @param {number} y Y position
   * @param {number} width Image width
   * @param {number} height Image height
   */
  drawVictoryOverlay(ctx, canvas, x, y, width, height) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.victoryImage, x, y, width, height);
  }

  /**
   * Schedules the end of victory screen display
   */
  scheduleVictoryScreenEnd() {
    setTimeout(() => {
      this.showVictoryScreen = false;
      this.reloadPage();
    }, 2000);
  }

  /**
   * Reloads the game page
   */
  reloadPage() {
    window.location.reload();
  }

  /**
   * Handles hit detection and damage calculation
   */
  hit() {
    if (this.isDead || !this.canBeHit()) return;

    this.registerHit();
    this.updateEnergy();
    this.notifyWorld();
    this.playHurtSound();
    this.evaluateDeathOrHurt();

    if (this.worldReference?.statusBarEndboss) {
      this.worldReference.statusBarEndboss.setPercentage(this.energy);
    }
  }

  /**
   * Checks if endboss can be hit (cooldown period)
   * @returns {boolean} True if endboss can be hit
   */
  canBeHit() {
    const currentTime = Date.now();
    return currentTime - this.lastHitTime >= this.hitCooldown;
  }

  /**
   * Registers a hit and updates counters
   */
  registerHit() {
    this.lastHitTime = Date.now();
    this.hitCounter++;
  }

  /**
   * Updates energy level based on hits taken
   */
  updateEnergy() {
    this.energy = Math.max(0, 100 - this.hitCounter * 20);
  }

  /**
   * Notifies game world about hit
   */
  notifyWorld() {
    if (this.worldReference?.registerEndbossHit) {
      this.worldReference.registerEndbossHit(this.energy);
    }
  }

  /**
   * Plays hurt sound effect
   */
 playHurtSound() {
  playSound("hurt-endboss.mp4", 0.6);
}


  /**
   * Evaluates if endboss should die or just be hurt
   */
  evaluateDeathOrHurt() {
    if (this.hitCounter >= this.maxHits) {
      this.energy = 0;
      this.isDead = true;
      this.playDeathAnimation();
    } else {
      this.isHurt = true;
      this.hurtAnimationPlaying = false;
      this.isWalking = false;
    }
  }

  /**
   * Plays an animation sequence
   * @param {string[]} images Array of image paths for animation
   */
  playAnimation(images) {
    if (this.currentFrameIndex >= images.length) {
      this.currentFrameIndex = 0;
    }

    this.loadImage(images[this.currentFrameIndex]);
    this.currentFrameIndex++;
  }

  /**
   * Finds and returns the canvas context
   * @returns {CanvasRenderingContext2D|null} Canvas context or null if not found
   */
  findCanvasContext() {
    if (typeof world !== "undefined" && world?.ctx) return world.ctx;
    if (window.canvas?.getContext) return window.canvas.getContext("2d");
    if (document.querySelector("canvas"))
      return document.querySelector("canvas").getContext("2d");
    if (window.ctx) return window.ctx;

    console.error("Kein Canvas Context gefunden!");
    return null;
  }

  /**
   * Gets the hitbox dimensions for collision detection
   * @returns {Object} Hitbox coordinates and dimensions
   */
  getHitbox() {
    return {
      x: this.x + 50,
      y: this.y + 120,
      width: this.width - 80,
      height: this.height - 150,
    };
  }
}