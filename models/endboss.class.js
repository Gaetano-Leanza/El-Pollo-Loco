/**
 * Represents the final boss enemy - a large chicken with complex AI behavior patterns.
 * Features multiple states including intro sequence, alert state, attack patterns, and pursuit behavior.
 * Changes music dynamically and provides the main challenge at the end of the level.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  /** Y-coordinate position of the endboss. */
  y = 20;

  /** Width of the endboss in pixels. */
  width = 350;

  /** Height of the endboss in pixels. */
  height = 450;

  /** Health/energy points of the endboss. */
  energy = 50;

  /** Flag indicating if the endboss has been hurt, triggers pursuit behavior. */
  gotHurt = false;

  /** Movement speed of the endboss. */
  speed = 2;

  /** Flag tracking if the character has encountered the endboss for the first time. */
  characterMetEndboss = false;

  /** Y-coordinate representing the ground level. */
  onGroundY = 20;

  /** Flag preventing background music from playing multiple times. */
  musicAlreadyPlayed = false;

  /** Counter for intro sequence and animation state management. */
  i = 0;

  /** Reference to the game world object. */
  world;

  /** Collision detection offset values for hit box calculations. */
  offset = { top: 120, left: 70, right: 50, bottom: 90 };

  /** Image paths for walking animation frames. */
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /** Image paths for alert animation frames. */
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

  /** Image paths for death animation frames. */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /** Image paths for hurt animation frames. */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /** Image paths for attack animation frames. */
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

  /**
   * Creates a new Endboss instance at a fixed position near the end of the level.
   * Initializes all animation frames and starts the AI behavior system.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_WALKING);
    this.soundManager = SoundManager.instance;
    this.x = 3500;
    this.applyGravity();
    this.hitbox = this.getHitBox();
    this.animate();
  }

  /** Starts the animation loops for sprite animation and AI movement. */
  animate() {
    setStoppableInterval(() => this.endbossAnimation(), 200);
    setStoppableInterval(() => this.endbossMoves(), 1000 / 60);
  }

  /** Handles first encounter logic, including suspense music. */
  meetsCharacterMovement() {
    this.i = 0;
    this.speed = 5;
    this.characterMetEndboss = true;
    this.playSuspenseMusic();
  }

  /** Switches from background to suspense music during boss fight. */
  playSuspenseMusic() {
    SoundManager.instance.pause("background");
    SoundManager.instance.play("suspense");
  }

  /** Restores background music after endboss is defeated. */
  playBackgroundMusic() {
    if (!this.musicAlreadyPlayed) {
      setTimeout(() => {
        SoundManager.instance.playBackground("background");
        SoundManager.instance.pause("suspense");
        this.musicAlreadyPlayed = true;
      }, 1000);
    }
  }

  /** Moves endboss left and updates hitbox. */
  movingLeft() {
    this.moveLeft();
    this.hitbox = this.getHitBox();
  }

  /** Moves endboss right and updates hitbox. */
  movingRight() {
    this.moveRight();
    this.hitbox = this.getHitBox();
  }

  /** Determines if intro movement sequence should continue. */
  canIntroMoving() {
    return this.i < 10;
  }

  /** Checks if the character is close enough to trigger first encounter. */
  meetsCharacter() {
    if (!this.world) return false; // Safety check to prevent undefined errors
    return this.world.character.x > 2800 && !this.characterMetEndboss;
  }

  /** Determines if endboss can perform a jump attack. */
  canJump() {
    return !this.isAboveGround() && this.attacks();
  }

  /** Checks if endboss should move left during pursuit phase. */
  canMoveLeft() {
    if (!this.world) return false;
    return this.gotHurt && this.world.character.x <= this.x;
  }

  /** Checks if endboss should move right during pursuit phase. */
  canMoveRight() {
    if (!this.world) return false;
    return this.gotHurt && this.world.character.x > this.x;
  }

  /** Makes endboss perform a high-speed jump attack. */
  jump() {
    this.speedY = 40;
  }

  /** Handles endboss animation state machine. */
  endbossAnimation() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      this.playBackgroundMusic();

      // Trigger game win when endboss dies
      if (this.world) {
        this.world.checkIfYouWon();
      }
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.gotHurt = true;
    } else if (this.i < 10) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (this.characterMetEndboss && !this.gotHurt) {
      this.playAnimation(this.IMAGES_ALERT);
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_ATTACK);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
    this.i++;
  }

  /** Main AI movement handler. */
  endbossMoves() {
    if (this.meetsCharacter()) {
      this.meetsCharacterMovement();
    }
    if (this.canIntroMoving()) {
      this.movingLeft();
    } else if (this.canJump()) {
      this.jump();
      this.hitbox = this.getHitBox();
    } else if (this.isHurt()) {
      // Hurt state - no movement
    } else if (this.canMoveLeft()) {
      this.otherDirection = false;
      this.speed = 2;
      this.movingLeft();
    } else if (this.canMoveRight()) {
      this.otherDirection = true;
      this.movingRight();
    }
  }
}
