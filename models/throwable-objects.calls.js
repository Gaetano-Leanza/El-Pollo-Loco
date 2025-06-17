class ThrowableObject extends MovableObject {
  BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  constructor(x, y) {
    super();
    this.loadImages(this.BOTTLE_ROTATION);
    this.image = this.imageCache[this.BOTTLE_ROTATION[0]];
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 60;
    this.groundLevel = 440;
    this.gravity = 2.5;
    this.speedY = -10;
    this.throw();
  }

  async throw() {
    await this.loadImages(this.BOTTLE_ROTATION);
    this.img = this.imageCache[this.BOTTLE_ROTATION[0]];
    this.isThrown = true;

    this.gravityInterval = setInterval(() => this.applyGravity(), 40);
    this.moveInterval = setInterval(() => (this.x += 10), 40);
    this.animateRotation();
  }

  animateRotation() {
    this.rotationInterval = setInterval(() => {
      this.currentImage = (this.currentImage + 1) % this.BOTTLE_ROTATION.length;
      this.img = this.imageCache[this.BOTTLE_ROTATION[this.currentImage]];
    }, 100);
  }

  applyGravity() {
    this.y += this.speedY;
    this.speedY += this.gravity;

    if (this.y + this.height >= this.groundLevel) {
      this.y = this.groundLevel - this.height;
      this.stopIntervals();
    }
  }

  stopIntervals() {
    clearInterval(this.gravityInterval);
    clearInterval(this.moveInterval);
    clearInterval(this.rotationInterval);
  }
}
