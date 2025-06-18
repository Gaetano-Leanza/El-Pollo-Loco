class BaseChicken extends MovableObject {
  isDead = false;
  shouldBeRemoved = false;

  constructor(xOffset, width, height, y, walkingImages, deadImage) {
    super();
    this.x = xOffset + Math.random() * 100;
    this.speed = 0.15 + Math.random() * 0.25;
    this.width = width;
    this.height = height;
    this.y = y;

    this.IMAGES_WALKING = walkingImages;
    this.IMAGES_DEAD = [deadImage];

    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);

    this.animate();
  }

  animate() {
    this.moveInterval = setInterval(() => this.moveLeft(), 1000 / 60);
    this.walkInterval = setInterval(() => this.playAnimation(this.IMAGES_WALKING), 200);
  }

  stopAnimation() {
    clearInterval(this.moveInterval);
    clearInterval(this.walkInterval);
  }

  getHitbox() {
    return {
      x: this.x + 5,
      y: this.y + 10,
      width: this.width - 10,
      height: this.height - 15,
    };
  }

  takeDamage() {
    this.isDead = true;
    this.stopAnimation();
    this.img.src = this.IMAGES_DEAD[0];

    setTimeout(() => {
      this.shouldBeRemoved = true;
    }, 1000);
  }
}
