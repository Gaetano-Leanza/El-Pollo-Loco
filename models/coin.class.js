class Coin extends DrawableObject {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 120;
    this.height = 120;
    this.loadImage("img/8_coin/coin_1.png");
    this.blinkPhase = Math.random() * 2 * Math.PI; 
    this.blinkSpeed = 0.05; 
  }

  update() {
    this.blinkPhase += this.blinkSpeed;
  }

  draw(ctx) {
    const opacity = 0.7 + 0.3 * Math.sin(this.blinkPhase);
    ctx.save();
    ctx.globalAlpha = opacity;
    super.draw(ctx);
    ctx.restore();
  }

  getHitbox() {
    return {
      x: this.x + 30,
      y: this.y + 30,
      width: this.width - 60,
      height: this.height - 60,
    };
  }
}
