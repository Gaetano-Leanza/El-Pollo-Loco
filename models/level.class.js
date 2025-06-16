class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  level_end_x = 4300;

  constructor(enemies, clouds, backgroundObjects, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins || [];
    this.bottles = this.generateBottles();
  }

  generateBottles() {
    const bottles = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 2500;
      const y = 400;
      bottles.push(new Bottle(x, y));
    }
    return bottles;
  }
}
