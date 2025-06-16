class Bottle extends DrawableObject {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y - 40;
    this.width = 60;
    this.height = 80;
    this.image = new Image();
    this.image.src = "img/6_salsa_bottle/1_salsa_bottle_on_ground.png";
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {}

  getHitbox() {
    return {
      x: this.x + 10,
      y: this.y + 10,
      width: this.width - 20,
      height: this.height - 20,
    };
  }
}
