class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 62;

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
  animationInterval;
  hurtAnimationTimeout;

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
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (this.isDead) {
        this.playDeathAnimation();
      } else if (this.isHurt) {
        this.playHurtAnimation();
      } else {
        this.playAlertAnimation();
      }
    }, 200);
  }

  playAlertAnimation() {
    this.playAnimation(this.IMAGES_ALERT);
  }

  playHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    if (this.hurtAnimationTimeout) {
      clearTimeout(this.hurtAnimationTimeout);
    }
    this.hurtAnimationTimeout = setTimeout(() => {
      this.isHurt = false;
    }, this.IMAGES_HURT.length * 200);
  }

  playDeathAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      clearInterval(this.animationInterval);
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
    }
  }

  isDead() {
    return this.health <= 0;
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
