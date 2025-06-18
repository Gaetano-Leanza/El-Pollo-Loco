class Chicken extends MovableObject {
  y = 360;
  height = 60;
  width = 80;

  IMAGES_WALKING = [
    "../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "../img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "../img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["../img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  CHICKEN_SMALL_IMAGES_WALKING = [
    "../img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "../img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "../img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  CHICKEN_SMALL_IMAGES_DEAD = [
    "../img/3_enemies_chicken/chicken_small/2_dead/dead.png",
  ];

  constructor(xOffset, isSmall = false) {
    super();
    this.x = xOffset + Math.random() * 100;
    this.speed = 0.15 + Math.random() * 0.25;

    if (isSmall) {
      this.loadImage(this.CHICKEN_SMALL_IMAGES_WALKING[0]);
      this.loadImages(this.CHICKEN_SMALL_IMAGES_WALKING);
      this.IMAGES_WALKING = this.CHICKEN_SMALL_IMAGES_WALKING;
      this.IMAGES_DEAD = this.CHICKEN_SMALL_IMAGES_DEAD;
      this.height = 40;
      this.width = 60;
      this.y = 380;
    } else {
      this.loadImage(this.IMAGES_WALKING[0]);
      this.loadImages(this.IMAGES_WALKING);
    }

    this.animate();
  }

  animate() {
    setInterval(() => this.moveLeft(), 1000 / 60);
    setInterval(() => this.playAnimation(this.IMAGES_WALKING), 200);
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
    this.health--;
    if (this.health <= 0) {
      this.die();
    }
  }
}
