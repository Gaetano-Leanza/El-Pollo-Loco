class Endboss extends MovableObject {
  height = 400;
  width = 250;
  speed = 0.2;
  y = 62;
  x = 3800;

  IMAGES_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

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

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  health = 100;
  isHurt = false;
  isDead = false;
  isWalking = false;
  isAlerted = false;
  animationInterval;
  movementAnimationId;

  hurtFrameIndex = 0;
  hurtAnimationPlaying = false;
  currentFrameIndex = 0;

  constructor() {
    super();
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 4000;
    this.animate();
    this.startMovement();
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (this.isDead) {
        this.playDeathAnimation();
      } else if (this.isHurt) {
        this.playHurtAnimation();
      } else if (this.isAlerted) {
        this.playAlertAnimation();
      } else if (this.isWalking) {
        this.playWalkAnimation();
      } else {
        this.playAlertAnimation();
      }
    }, 200);
  }

  startMovement() {
    const move = () => {
      if (this.isDead) {
        cancelAnimationFrame(this.movementAnimationId);
        return;
      }

      if (window.character) {
        const distance = Math.abs(this.x - character.x);

        if (distance < 400) {
          this.isWalking = true;
          this.moveTowardsCharacter();
        } else {
          this.isWalking = false;
        }
      }

      this.movementAnimationId = requestAnimationFrame(move);
    };
    move();
  }

  moveTowardsCharacter() {
    if (!window.character || this.isDead) return;

    const distanceX = character.x - this.x;

    if (distanceX > 0) {
      this.x += this.speed;
      this.otherDirection = false;
      console.log(`Endboss bewegt sich: x = ${this.x}, Richtung = rechts`);
    } else if (distanceX < 0) {
      this.x -= this.speed;
      this.otherDirection = true;
      console.log(`Endboss bewegt sich: x = ${this.x}, Richtung = links`);
    }
  }

  playAlertAnimation() {
    this.playAnimation(this.IMAGES_ALERT);
  }

  playWalkAnimation() {
    this.playAnimation(this.IMAGES_WALK);
  }

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

  playDeathAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      clearInterval(this.animationInterval);
      cancelAnimationFrame(this.movementAnimationId);
      this.shouldBeRemoved = true;
    }, this.IMAGES_DEAD.length * 200);
  }

  takeDamage() {
    if (this.isDead) return;
    this.health -= 10;

    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      this.playDeathAnimation();
    } else {
      this.isHurt = true;
      this.hurtAnimationPlaying = false;
      this.isWalking = false;
    }
  }

  playAnimation(images) {
    if (this.currentFrameIndex >= images.length) {
      this.currentFrameIndex = 0;
    }

    this.loadImage(images[this.currentFrameIndex]);
    this.currentFrameIndex++;
  }

  getHitbox() {
    return {
      x: this.x + 50,
      y: this.y + 120,
      width: this.width - 80,
      height: this.height - 150,
    };
  }
}
