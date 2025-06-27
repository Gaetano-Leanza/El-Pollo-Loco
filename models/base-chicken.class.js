/**
 * Basisklasse für Hühner, erbt von MovableObject.
 * Unterstützt Bewegung, Animation und einen loopenden Clucking-Sound.
 * @extends MovableObject
 */
class BaseChicken extends MovableObject {
  /**
   * Status, ob das Huhn tot ist.
   * @type {boolean}
   */
  isDead = false;

  /**
   * Status, ob das Huhn entfernt werden soll.
   * @type {boolean}
   */
  shouldBeRemoved = false;

  /**
   * Erstellt ein neues BaseChicken-Objekt.
   * @param {number} xOffset - Startposition horizontal.
   * @param {number} width - Breite des Huhns.
   * @param {number} height - Höhe des Huhns.
   * @param {number} y - Vertikale Position.
   * @param {string[]} walkingImages - Array mit Pfaden zu Geh-Animationsbildern.
   * @param {string} deadImage - Pfad zum Bild des toten Huhns.
   */
  constructor(xOffset, width, height, y, walkingImages, deadImage) {
    super();
    this.x = xOffset + Math.random() * 100;
    this.speed = 0.15 + Math.random() * 0.25;
    this.width = width;
    this.height = height;
    this.y = y;
    this.IMAGES_WALKING = walkingImages;
    this.IMAGES_DEAD = [deadImage];
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  /**
   * Startet die Bewegung, Animation und das Sound-Handling.
   */
  animate() {
    this.moveInterval = setInterval(() => this.moveLeft(), 1000 / 60);

    this.walkInterval = setInterval(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  /**
   * Stoppt Bewegung, Animation und Sound.
   */
  stopAnimation() {
    clearInterval(this.moveInterval);
    clearInterval(this.walkInterval);
    clearInterval(this.soundInterval);
  }

  /**
   * Gibt die Kollisionsbox des Huhns zurück.
   * @returns {{x: number, y: number, width: number, height: number}} Hitbox-Objekt.
   */
  getHitbox() {
    return {
      x: this.x + 5,
      y: this.y + 10,
      width: this.width - 10,
      height: this.height - 15,
    };
  }

  /**
   * Verarbeitet Schaden am Huhn, setzt Zustand auf tot, stoppt Animation und Sound.
   * Entfernt Huhn nach 1 Sekunde.
   */
  hit() {
    this.isDead = true;
    this.stopAnimation();
    this.img.src = this.IMAGES_DEAD[0];

    if (this.cluckingSound) {
      this.cluckingSound.pause();
      this.cluckingSound.currentTime = 0;
    }

    setTimeout(() => {
      this.shouldBeRemoved = true;
    }, 1000);
  }
}
