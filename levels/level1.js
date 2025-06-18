let chickens = [];
let chickensPerGroup = 3;
let groupSpacing = 1300;
let chickenSpacing = 100;
let startX = 500;

for (let i = 0; i < 9; i++) {
  let group = Math.floor(i / chickensPerGroup);
  let positionInGroup = i % chickensPerGroup;

  let x = startX + group * groupSpacing + positionInGroup * chickenSpacing;

  chickens.push(new Chicken(x)); // normale Chicken
  chickens.push(new ChickenSmall(x + 500)); // kleine Chicken 500px weiter rechts
}

chickens.push(new Endboss());

const clouds = (() => {
  let clouds = [];
  let startX = 100;
  let spacing = 500;
  let numberOfClouds = 20;

  for (let i = 0; i < numberOfClouds; i++) {
    clouds.push(new Cloud(startX + i * spacing));
  }
  return clouds;
})();

const backgroundObjects = [
  new BackgroundObject("../img/5_background/layers/air.png", -719),
  new BackgroundObject("../img/5_background/layers/3_third_layer/2.png", -719),
  new BackgroundObject("../img/5_background/layers/2_second_layer/2.png", -719),
  new BackgroundObject("../img/5_background/layers/1_first_layer/2.png", -719),
  new BackgroundObject("../img/5_background/layers/air.png", 0),
  new BackgroundObject("../img/5_background/layers/3_third_layer/1.png", 0),
  new BackgroundObject("../img/5_background/layers/2_second_layer/1.png", 0),
  new BackgroundObject("../img/5_background/layers/1_first_layer/1.png", 0),
  new BackgroundObject("../img/5_background/layers/air.png", 719),
  new BackgroundObject("../img/5_background/layers/3_third_layer/2.png", 719),
  new BackgroundObject("../img/5_background/layers/2_second_layer/2.png", 719),
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
];

const coinCount = 20;
const coins = [];
const endBossZone = 800;

for (let i = 0; i < coinCount; i++) {
  const minY = 100;
  const maxY = 280;
  const maxX = 5000 - endBossZone;

  const validMaxY = Math.max(minY, maxY);

  coins.push(
    new Coin(Math.random() * maxX, minY + Math.random() * (validMaxY - minY))
  );
}

const level1 = new Level(chickens, clouds, backgroundObjects, coins, []);
