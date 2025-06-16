let chickens = [];
let chickensPerGroup = 3;
let groupSpacing = 1300;
let chickenSpacing = 100;
let startX = 500;

for (let i = 0; i < 9; i++) {
  let group = Math.floor(i / chickensPerGroup);
  let positionInGroup = i % chickensPerGroup;

  let x = startX + group * groupSpacing + positionInGroup * chickenSpacing;
  chickens.push(new Chicken(x));
}

chickens.push(new Endboss());

const level1 = new Level(
  chickens,

  (() => {
    let clouds = [];
    let startX = 100;
    let spacing = 500;
    let numberOfClouds = 20; 

    for (let i = 0; i < numberOfClouds; i++) {
      clouds.push(new Cloud(startX + i * spacing));
    }

    return clouds;
  })(),

  [
    new BackgroundObject("../img/5_background/layers/air.png", -719),
    new BackgroundObject(
      "../img/5_background/layers/3_third_layer/2.png",
      -719
    ),
    new BackgroundObject(
      "../img/5_background/layers/2_second_layer/2.png",
      -719
    ),
    new BackgroundObject(
      "../img/5_background/layers/1_first_layer/2.png",
      -719
    ),
    new BackgroundObject("../img/5_background/layers/air.png", 0),
    new BackgroundObject("../img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("../img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("../img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject("../img/5_background/layers/air.png", 719),
    new BackgroundObject("../img/5_background/layers/3_third_layer/2.png", 719),
    new BackgroundObject(
      "../img/5_background/layers/2_second_layer/2.png",
      719
    ),
    new BackgroundObject("../img/5_background/layers/1_first_layer/2.png", 719),
    new BackgroundObject("../img/5_background/layers/air.png", 719 * 2),
    new BackgroundObject(
      "../img/5_background/layers/3_third_layer/1.png",
      719 * 2
    ),
    new BackgroundObject(
      "../img/5_background/layers/2_second_layer/1.png",
      719 * 2
    ),
    new BackgroundObject(
      "../img/5_background/layers/1_first_layer/1.png",
      719 * 2
    ),
    new BackgroundObject("../img/5_background/layers/air.png", 719 * 3),
    new BackgroundObject(
      "../img/5_background/layers/3_third_layer/2.png",
      719 * 3
    ),
    new BackgroundObject(
      "../img/5_background/layers/2_second_layer/2.png",
      719 * 3
    ),
    new BackgroundObject(
      "../img/5_background/layers/1_first_layer/2.png",
      719 * 3
    ),
    new BackgroundObject("../img/5_background/layers/air.png", 719 * 4),
    new BackgroundObject(
      "../img/5_background/layers/3_third_layer/1.png",
      719 * 4
    ),
    new BackgroundObject(
      "../img/5_background/layers/2_second_layer/1.png",
      719 * 4
    ),
    new BackgroundObject(
      "../img/5_background/layers/1_first_layer/1.png",
      719 * 4
    ),
    new BackgroundObject("../img/5_background/layers/air.png", 719 * 5),
    new BackgroundObject(
      "../img/5_background/layers/3_third_layer/2.png",
      719 * 5
    ),
    new BackgroundObject(
      "../img/5_background/layers/2_second_layer/2.png",
      719 * 5
    ),
    new BackgroundObject(
      "../img/5_background/layers/1_first_layer/2.png",
      719 * 5
    ),
    new BackgroundObject("../img/5_background/layers/air.png", 719 * 6),
    new BackgroundObject(
      "../img/5_background/layers/3_third_layer/1.png",
      719 * 6
    ),
    new BackgroundObject(
      "../img/5_background/layers/2_second_layer/1.png",
      719 * 6
    ),
    new BackgroundObject(
      "../img/5_background/layers/1_first_layer/1.png",
      719 * 6
    ),
  ]
);
