class ThrowableObject extends MovableObject {
  BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  isSplashing = false;
  hasHitEnemy = false;
  initialSpeedX = 10;
  rotationSpeed = 100;

  constructor(x, y, otherDirection = false) {
    super();
    this.loadImages(this.BOTTLE_ROTATION);
    this.loadImages(this.BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 60;
    this.groundLevel = 440;
    this.gravity = 2.5;
    this.speedY = -10;
    this.otherDirection = otherDirection;
    this.throw();
  }

  async throw() {
    await this.loadImages(this.BOTTLE_ROTATION);
    this.img = this.imageCache[this.BOTTLE_ROTATION[0]];
    this.isThrown = true;

    this.gravityInterval = setInterval(() => this.applyGravity(), 40);

    const direction = this.otherDirection ? -1 : 1;
    this.moveInterval = setInterval(() => {
      this.x += this.initialSpeedX * direction;
    }, 40);

    this.animateRotation();
  }

  animateRotation() {
    this.rotationInterval = setInterval(() => {
      if (!this.isSplashing) {
        this.currentImage =
          (this.currentImage + 1) % this.BOTTLE_ROTATION.length;
        this.img = this.imageCache[this.BOTTLE_ROTATION[this.currentImage]];
      }
    }, this.rotationSpeed);
  }

  applyGravity() {
    if (this.isSplashing) return;

    this.y += this.speedY;
    this.speedY += this.gravity;

    if (this.y + this.height >= this.groundLevel) {
      this.y = this.groundLevel - this.height;
      this.splash("ground");
    }
  }

  isColliding(mo) {
    if (mo instanceof Endboss) {
      return this.isCollidingWithEndboss(mo);
    }

    return super.isColliding(mo);
  }

  isCollidingWithEndboss(endboss) {
    const bottleBox = this.getHitbox();
    const bossBox = endboss.getHitbox();

    const bottleCenterX = bottleBox.x + bottleBox.width / 2;
    const bottleCenterY = bottleBox.y + bottleBox.height / 2;

    return (
      bottleCenterX > bossBox.x &&
      bottleCenterX < bossBox.x + bossBox.width &&
      bottleCenterY > bossBox.y &&
      bottleCenterY < bossBox.y + bossBox.height
    );
  }

  splash(cause = "unknown") {
    if (this.isSplashing) return;

    this.isSplashing = true;
    this.stopIntervals();
    this.playSplashAnimation();

    if (cause === "endboss" || cause === "enemy") {
      this.hasHitEnemy = true;
    }
  }

  playSplashAnimation() {
    this.currentImage = 0;
    const splashInterval = setInterval(() => {
      if (this.currentImage < this.BOTTLE_SPLASH.length) {
        this.img = this.imageCache[this.BOTTLE_SPLASH[this.currentImage]];
        this.currentImage++;
      } else {
        clearInterval(splashInterval);
        this.shouldBeRemoved = true;
      }
    }, 80);
  }

  stopIntervals() {
    clearInterval(this.gravityInterval);
    clearInterval(this.moveInterval);
    clearInterval(this.rotationInterval);
  }

  getHitbox() {
    return {
      x: this.x + 10,
      y: this.y + 10,
      width: this.width - 20,
      height: this.height - 20,
    };
  }
}
