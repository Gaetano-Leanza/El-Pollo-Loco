/**
 * Erstellt ein Array von Hintergrundobjekten mit abwechselnden Ebenenbildern.
 * Die Ebenen wiederholen sich alle 719 Pixel, beginnend bei -719.
 * @returns {BackgroundObject[]} Array mit Hintergrundobjekten.
 */
function createBackgroundObjects() {
  const objects = [];
  const width = 719;
  const segments = 7;

  for (let i = -1; i < segments; i++) {
    const x = i * width;
    const suffix = i % 2 === 0 ? "1" : "2";

    objects.push(new BackgroundObject("../img/5_background/layers/air.png", x));
    objects.push(new BackgroundObject(`../img/5_background/layers/3_third_layer/${suffix}.png`, x));
    objects.push(new BackgroundObject(`../img/5_background/layers/2_second_layer/${suffix}.png`, x));
    objects.push(new BackgroundObject(`../img/5_background/layers/1_first_layer/${suffix}.png`, x));
  }

  return objects;
}

/**
 * Erstellt ein Array aus normalen und kleinen Hühnern sowie einem Endboss.
 * Hühner erscheinen gruppiert im Abstand zueinander.
 * @returns {MovableObject[]} Array mit Gegnerobjekten.
 */
function createEnemies() {
  const enemies = [];
  const chickensPerGroup = 3;
  const groupSpacing = 1300;
  const chickenSpacing = 100;
  const startX = 500;

  for (let i = 0; i < 9; i++) {
    const group = Math.floor(i / chickensPerGroup);
    const positionInGroup = i % chickensPerGroup;
    const x = startX + group * groupSpacing + positionInGroup * chickenSpacing;

    enemies.push(new Chicken(x)); // Normales Huhn
    enemies.push(new ChickenSmall(x + 500)); // Kleines Huhn (versetzt)
  }

  enemies.push(new Endboss()); // Am Ende kommt der Endgegner
  return enemies;
}

/**
 * Erstellt ein Array aus Wolkenobjekten mit gleichmäßigem Abstand.
 * @returns {Cloud[]} Array von Cloud-Objekten.
 */
function createClouds() {
  const clouds = [];
  const startX = 100;
  const spacing = 500;
  const numberOfClouds = 20;

  for (let i = 0; i < numberOfClouds; i++) {
    clouds.push(new Cloud(startX + i * spacing));
  }

  return clouds;
}

/**
 * Erstellt ein Array aus zufällig verteilten Münzen im erlaubten Bereich.
 * @param {number} count - Anzahl der zu erzeugenden Münzen.
 * @param {number} [endBossZone=800] - Bereich am Levelende, in dem keine Münzen erscheinen sollen.
 * @returns {Coin[]} Array mit zufällig platzierten Münzen.
 */
function createCoins(count, endBossZone = 800) {
  const coins = [];
  const minY = 100;
  const maxY = 280;
  const maxX = 5000 - endBossZone;

  for (let i = 0; i < count; i++) {
    const y = minY + Math.random() * (maxY - minY);
    const x = Math.random() * maxX;
    coins.push(new Coin(x, y));
  }

  return coins;
}

// === Level-Zusammenstellung ===

const chickens = createEnemies();
const clouds = createClouds();
const backgroundObjects = createBackgroundObjects();
const coins = createCoins(20); // 20 Münzen erzeugen

/**
 * Das erste Level des Spiels mit Gegnern, Hintergrund, Wolken und Münzen.
 * @type {Level}
 */
const level1 = new Level(chickens, clouds, backgroundObjects, coins, []);
