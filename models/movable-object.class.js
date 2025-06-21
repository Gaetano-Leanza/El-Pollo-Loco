class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  currentImage = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 160;
    }
  }

  isColliding(mo) {
    let thisHitbox = this.getHitbox();
    let moHitbox = mo.getHitbox();

    return (
      thisHitbox.x + thisHitbox.width > moHitbox.x &&
      thisHitbox.y + thisHitbox.height > moHitbox.y &&
      thisHitbox.x < moHitbox.x + moHitbox.width &&
      thisHitbox.y < moHitbox.y + moHitbox.height
    );
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isDead() {
    return this.energy == 0;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    if (!images || images.length === 0) return;
    this.currentImage = this.currentImage % images.length;
    let path = images[this.currentImage];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() {
    this.speedY = 30;
  }

  drawFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "red";
    const box = this.getHitbox ? this.getHitbox() : this;
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.stroke();
  }
}
