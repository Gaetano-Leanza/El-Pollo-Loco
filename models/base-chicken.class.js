/**
 * Globaler Sound-Manager für das Spiel, steuert, ob Sounds abgespielt werden dürfen.
 */
class SoundManager {
  /**
   * Gibt an, ob Sounds aktiviert sind.
   * @type {boolean}
   */
  static enabled = false;

  /**
   * Aktiviert die Sounds (z.B. nach Nutzerinteraktion).
   */
  static enable() {
    this.enabled = true;
  }
}

// Event-Listener, die bei Nutzerinteraktion die Sounds freischalten.
// Soll nur einmal im Spiel (z.B. in game.js) hinzugefügt werden.
document.addEventListener('click', () => SoundManager.enable());
document.addEventListener('keydown', () => SoundManager.enable());

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
   * Audio-Element für den Clucking-Sound.
   * @type {HTMLAudioElement}
   */
  cluckingSound;

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

    // Sound vorbereiten, aber nicht sofort abspielen (Autoplay Policy)
    this.cluckingSound = new Audio('audio/chicken-cluking.mp4');
    this.cluckingSound.loop = true;
    this.cluckingSound.volume = 0.1;

    this.animate();
  }

  /**
   * Versucht den Clucking-Sound abzuspielen, wenn Sounds aktiviert und Huhn lebendig ist.
   */
  playSound() {
    if (
      !SoundManager.enabled ||       // Sounds nicht aktiviert
      this.isDead ||                 // Huhn ist tot
      this.cluckingSound.paused === false // Sound läuft schon
    ) return;

    this.cluckingSound.play().catch(e => {
      console.warn("Chicken-Sound konnte nicht gestartet werden:", e.name);
    });
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

    // Überprüft alle 500ms, ob Sound abgespielt werden soll
    this.soundInterval = setInterval(() => {
      this.playSound();
    }, 500);
  }

  /**
   * Stoppt Bewegung, Animation und Sound.
   */
  stopAnimation() {
    clearInterval(this.moveInterval);
    clearInterval(this.walkInterval);
    clearInterval(this.soundInterval);

    if (this.cluckingSound) {
      this.cluckingSound.pause();
      this.cluckingSound.currentTime = 0;
    }
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
