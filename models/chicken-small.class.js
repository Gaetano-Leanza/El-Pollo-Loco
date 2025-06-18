class ChickenSmall extends Chicken {
  constructor(xOffset) {
    super(xOffset);
    this.loadImages(this.CHICKEN_SMALL_IMAGES_WALKING);
    this.img.src = this.CHICKEN_SMALL_IMAGES_WALKING[0];
    this.width = 50;
    this.height = 40;
    this.y = 380;
  }

  get IMAGES_WALKING() {
    return this.CHICKEN_SMALL_IMAGES_WALKING;
  }

  get IMAGES_DEAD() {
    return this.CHICKEN_SMALL_IMAGES_DEAD;
  }

  CHICKEN_SMALL_IMAGES_WALKING = [
    "../img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "../img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "../img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  CHICKEN_SMALL_IMAGES_DEAD = [
    "../img/3_enemies_chicken/chicken_small/2_dead/dead.png",
  ];
}
