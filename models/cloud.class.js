class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;

  constructor(xPosition = null) {
    super().loadImage("../img/5_background/layers/4_clouds/1.png");

    this.x = xPosition !== null ? xPosition : Math.random() * 500;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60); 
  }
}
