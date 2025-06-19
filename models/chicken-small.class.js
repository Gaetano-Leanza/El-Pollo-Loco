class ChickenSmall extends BaseChicken {
  constructor(xOffset) {
    super(
      xOffset,
      50, 
      40, 
      380, 
      [
        "../img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "../img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "../img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
      ],
      "../img/3_enemies_chicken/chicken_small/2_dead/dead.png"
    );
  }
}
