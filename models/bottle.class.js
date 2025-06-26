/**
 * Repräsentiert eine werfbare Salsa-Flasche auf dem Boden.
 * Erbt von DrawableObject.
 * @extends DrawableObject
 */
class Bottle extends DrawableObject {
  /**
   * Erstellt eine neue Flaschen-Instanz, positioniert auf dem Boden.
   * @param {number} x - Die x-Koordinate (multipliziert mit 2) zur Platzierung der Flasche.
   * @param {number} y - Die y-Koordinate, leicht zufällig vertikal versetzt.
   */
  constructor(x, y) {
    super();
    this.x = x * 2;
    this.y = y - 40 + (Math.random() * 30 - 15); // Zufällige vertikale Verschiebung (-15 bis +15)
    this.width = 60;
    this.height = 80;
    this.image = new Image();
    this.image.src = "img/6_salsa_bottle/1_salsa_bottle_on_ground.png";
  }

  /**
   * Array mit Bildern der Splash-Animation, die gezeigt wird, wenn die Flasche zerbricht.
   * @type {string[]}
   */
  BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Zeichnet die Flasche auf das Canvas.
   * @param {CanvasRenderingContext2D} ctx - Der Canvas Rendering Context.
   */
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  /**
   * Platzhalter-Methode zum Zeichnen eines spezifischen Animationsframes.
   * In dieser Klasse nicht implementiert.
   * @param {CanvasRenderingContext2D} ctx - Der Canvas Rendering Context.
   */
  drawFrame(ctx) {
  }

  /**
   * Liefert die Kollisionsbox für die Flasche zurück.
   * Die Box ist kleiner als das Bild, um die Kollision genauer zu treffen.
   * @returns {{x: number, y: number, width: number, height: number}} Hitbox-Rechteck.
   */
  getHitbox() {
    return {
      x: this.x + 10,
      y: this.y + 10,
      width: this.width - 20,
      height: this.height - 20,
    };
  }
}
