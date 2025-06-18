class Chicken extends BaseChicken {
  constructor(xOffset) {
    super(
      xOffset,
      80,
      60, 
      360, 
      [
        "../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "../img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "../img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
      ],
      "../img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
    );
  }
}
