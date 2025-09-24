/**
 * Represents the main character (Pepe) in the game.
 * Handles movement, animations, collisions, and interactions with the game world.
 * @extends MovableObject
 */
class Character extends MovableObject {
  /**
   * Height of the character in pixels.
   * @type {number}
   * @default 240
   */
  height = 240;

  /**
   * Width of the character in pixels.
   * @type {number}
   * @default 120
   */
  width = 120;

  /**
   * Movement speed in pixels per frame.
   * @type {number}
   * @default 10
   */
  speed = 10;

  /**
   * Initial vertical position of the character.
   * @type {number}
   * @default 80
   */
  y = 80;

  /**
   * Character’s health/energy level (0-100).
   * @type {number}
   * @default 100
   */
  energy = 100;

  /**
   * Ensures the death animation only plays once.
   * @type {boolean}
   * @default false
   */
  hasPlayedDeadAnimation = false;

  /**
   * Y-coordinate representing the ground level for the character.
   * @type {number}
   * @default 190
   */
  onGroundY = 190;

  /**
   * Collision offsets for hitbox calculation.
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 120,
    left: 40,
    right: 40,
    bottom: 20,
  };

  /**
   * Animation frames for walking.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  /**
   * Animation frames for jumping.
   * @type {string[]}
   */
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  /**
   * Animation frames for dying.
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  /**
   * Animation frames for being hurt.
   * @type {string[]}
   */
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  /**
   * Animation frames for idle state.
   * @type {string[]}
   */
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /**
   * Animation frames for sleeping (long idle).
   * @type {string[]}
   */
  IMAGES_SLEEPING = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /**
   * Reference to the game world object.
   * @type {World}
   */
  world;

  /**
   * Initializes character with images, physics, and animations.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_SLEEPING);
    this.loadImages(this.IMAGES_IDLE);
    this.applyGravity();
    this.animate();
  }

  /**
   * Starts animation loops:
   * - Movement (60fps)
   * - Animation switching (~11fps)
   */
  animate() {
    setStoppableInterval(() => this.characterMoves(), 1000 / 60);
    setStoppableInterval(() => this.CharacterAnimation(), 90);
  }

  /**
   * State machine for choosing which animation to play:
   * Dead > Hurt > Jumping > Walking > Sleeping > Idle.
   */
  CharacterAnimation() {
    if (this.isDead()) {
      this.handleDeath();
    } else if (this.isHurt()) {
      this.handleHurt();
    } else if (this.isAboveGround()) {
      this.handleJumping();
    } else if (this.canPlayWalkingAnimation()) {
      this.handleWalking();
    } else if (this.isAsleep()) {
      this.handleSleeping();
    } else if (this.idle()) {
      this.handleIdle();
    }
  }

  /**
   * Plays death animation and ends the game.
   */
  handleDeath() {
    if (!this.hasPlayedDeadAnimation) {
      this.playAnimation(this.IMAGES_DEAD);
      this.hasPlayedDeadAnimation = true;
      stopGame();
      showGameoverScreen();
    }
  }

  /**
   * Plays hurt animation.
   */
  handleHurt() {
    this.playAnimation(this.IMAGES_HURT);
    this.resetLastAction();
  }

  /**
   * Plays jumping animation.
   */
  handleJumping() {
    this.playAnimation(this.IMAGES_JUMPING);
    this.resetLastAction();
  }

  /**
   * Plays walking animation.
   */
  handleWalking() {
    this.playAnimation(this.IMAGES_WALKING);
    this.resetLastAction();
  }

  /**
   * Plays sleeping animation (long idle).
   */
  handleSleeping() {
    this.playAnimation(this.IMAGES_SLEEPING);
  }

  /**
   * Plays idle animation and snoring sound.
   */
  handleIdle() {
    this.playAnimation(this.IMAGES_IDLE);
    SoundManager.instance.play("snoring");
  }

  /**
   * Checks if walking animation should play (based on left/right input).
   * @returns {boolean}
   */
  canPlayWalkingAnimation() {
    return (
      this.world.keyboard.RIGHT ||
      this.world.keyboard.rightButtonPressed ||
      this.world.keyboard.LEFT ||
      this.world.keyboard.leftButtonPressed
    );
  }

  /**
   * Checks if moving right is possible (input + within level bounds).
   * @returns {boolean}
   */
  canMoveRight() {
    return (
      (this.world.keyboard.RIGHT || this.world.keyboard.rightButtonPressed) &&
      this.x <= this.world.level.level_end_x
    );
  }

  /**
   * Checks if jumping is possible.
   * Only SPACE or mobile jump button can trigger it.
   * @returns {boolean}
   */
  canJump() {
    return (
      (this.world.keyboard.SPACE || this.world.keyboard.jumpButtonPressed) &&
      !this.isAboveGround()
    );
  }

  /**
   * Checks if moving left is possible (input + within level bounds).
   * @returns {boolean}
   */
  canMoveLeft() {
    return (
      (this.world.keyboard.LEFT || this.world.keyboard.leftButtonPressed) &&
      this.x >= 0
    );
  }

  /**
   * Handles main movement logic:
   * left/right walking, jumping, camera updates, thought bubble animation.
   */
  characterMoves() {
    this.hitbox = this.getHitBox();
    if (!this.hasPlayedDeadAnimation) {
      SoundManager.instance.pause("running");
      if (this.canMoveLeft()) {
        this.movesLeft();
      }
      if (this.canMoveRight()) {
        this.movesRight();
      }
      if (this.canJump()) {
        this.jumps();
      }
      this.world.camera_x = -this.x + 200;
      this.thoughtBubbleAnimation();
    }
  }

  /**
   * Moves character right, scrolls background, and plays sound.
   */
  movesRight() {
    this.otherDirection = false;
    otherDirectionCharacter = false;
    this.moveRight();
    this.backgroundMovesRight();
    SoundManager.instance.play("running");
  }

  /**
   * Moves character left, scrolls background, and plays sound.
   */
  movesLeft() {
    this.otherDirection = true;
    otherDirectionCharacter = true; // used for throwing objects
    this.moveLeft();
    this.backgroundMovesLeft();
    SoundManager.instance.play("running");
  }

  /**
   * Scrolls background when moving right.
   */
  backgroundMovesRight() {
    this.world.level.backgroundObjects.forEach((bg) => bg.moveLeft());
    this.world.level.clouds.forEach((cloud) => cloud.moveRightWithCamera());
  }

  /**
   * Scrolls background when moving left.
   */
  backgroundMovesLeft() {
    this.world.level.backgroundObjects.forEach((bg) => bg.moveRight());
    this.world.level.clouds.forEach((cloud) => cloud.moveLeftWithCamera());
  }

  /**
   * Updates thought bubble if visible.
   */
  thoughtBubbleAnimation() {
    if (this.thoughtBubbleVisible()) {
      this.thoughtBubbleMoves();
    }
  }

  /**
   * Checks if a thought bubble exists.
   * @returns {boolean}
   */
  thoughtBubbleVisible() {
    return this.world.thoughtBubble.length != undefined;
  }

  /**
   * Positions thought bubble relative to the character.
   */
  thoughtBubbleMoves() {
    this.world.thoughtBubble.forEach((bubble) => {
      bubble.x = this.x - 80;
      bubble.y = this.y;
    });
  }

  /**
   * Executes jump, updates camera, and resets mobile jump button.
   */
  jumps() {
    this.jump();
    this.world.camera_x = -this.x + 200;
    this.world.keyboard.jumpButtonPressed = false;
  }
}
