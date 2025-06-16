class Level {
  enemies;
  clouds;
  backgroundObjects;
  level_end_x = 4300;

  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins || []; 
    this.bottles = bottles || []; 
  }
}