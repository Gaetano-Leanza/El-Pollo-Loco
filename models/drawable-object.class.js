class DrawableObject {
  img;
  imageCache = [];
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof ChickenSmall ||
      this instanceof Endboss
    ) {
      const hb = this.getHitbox();
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "red";
      ctx.rect(hb.x, hb.y, hb.width, hb.height);
      ctx.stroke();
    }
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  isColliding(obj) {
    const thisHitbox = this.getHitbox
      ? this.getHitbox()
      : this.getDefaultHitbox();
    const objHitbox = obj.getHitbox ? obj.getHitbox() : obj.getDefaultHitbox();

    return (
      thisHitbox.x < objHitbox.x + objHitbox.width &&
      thisHitbox.x + thisHitbox.width > objHitbox.x &&
      thisHitbox.y < objHitbox.y + objHitbox.height &&
      thisHitbox.y + thisHitbox.height > objHitbox.y
    );
  }

  getDefaultHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
