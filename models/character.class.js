class Character extends MovableObject {
  height = 280;
  y = 80;
  speed = 10;  
  hitboxOffsetX = 0;
  hitboxOffsetY = 0;
  hitboxWidthReduction = 0;
  hitboxHeightReduction = 0;
  collectedCoins = 0;
  maxCoins = 20;
  collectedBottles = 0;
  maxBottles = 20;

  IMAGES_WALKING = [
    "../img/2_character_pepe/2_walk/W-21.png",
    "../img/2_character_pepe/2_walk/W-22.png",
    "../img/2_character_pepe/2_walk/W-23.png",
    "../img/2_character_pepe/2_walk/W-24.png",
    "../img/2_character_pepe/2_walk/W-25.png",
    "../img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "../img/2_character_pepe/3_jump/J-31.png",
    "../img/2_character_pepe/3_jump/J-32.png",
    "../img/2_character_pepe/3_jump/J-33.png",
    "../img/2_character_pepe/3_jump/J-34.png",
    "../img/2_character_pepe/3_jump/J-35.png",
    "../img/2_character_pepe/3_jump/J-36.png",
    "../img/2_character_pepe/3_jump/J-37.png",
    "../img/2_character_pepe/3_jump/J-38.png",
    "../img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "../img/2_character_pepe/5_dead/D-51.png",
    "../img/2_character_pepe/5_dead/D-52.png",
    "../img/2_character_pepe/5_dead/D-53.png",
    "../img/2_character_pepe/5_dead/D-54.png",
    "../img/2_character_pepe/5_dead/D-55.png",
    "../img/2_character_pepe/5_dead/D-56.png",
    "../img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "../img/2_character_pepe/4_hurt/H-41.png",
    "../img/2_character_pepe/4_hurt/H-42.png",
    "../img/2_character_pepe/4_hurt/H-43.png",
  ];

  world;
  walking_sound = new Audio("");

  constructor() {
    super();
    this.loadImage("../img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.hitboxOffsetX = 25;
    this.hitboxOffsetY = 130;
    this.hitboxWidthReduction = 50;
    this.hitboxHeightReduction = 160;
    this.applyGravity();
    this.collectedCoins = 0;
    this.maxCoins = 20;
  }

  getHitbox() {
    return {
      x: this.x + this.hitboxOffsetX,
      y: this.y + this.hitboxOffsetY,
      width: this.width - this.hitboxWidthReduction,
      height: this.height - this.hitboxHeightReduction,
    };
  }

  animate() {
    setInterval(() => {
      if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
        this.walking_sound.pause();
      }

      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();  
        this.otherDirection = false;
      }

      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();  
        this.otherDirection = true;
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }

      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    this.playCharacterAnimation();
  }

  playCharacterAnimation() {
    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        return;
      }

      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        return;
      }

      if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
        return;
      }

      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
        return;
      }

    }, 50);
  }

  throwBottle() {
    if (this.collectedBottles > 0) {
      const bottle = new ThrowableObject(this.x + this.width / 2, this.y);
      this.world.throwableObjects.push(bottle);
      this.collectedBottles--;
    } else {
      console.log("Keine Flaschen mehr zum Werfen!");
    }
  }
}
