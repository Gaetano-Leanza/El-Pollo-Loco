/**
 * Repräsentiert ein statisches Hintergrundobjekt im Spiel, das sich mit der Kamera mitbewegt.
 * Erbt von MovableObject.
 */
class BackgroundObject extends MovableObject {
  /** @type {number} Breite des Hintergrundbildes in Pixel. */
  width = 720;

  /** @type {number} Höhe des Hintergrundbildes in Pixel. */
  height = 480;

  /**
   * Erzeugt ein neues Hintergrundobjekt an einer bestimmten x-Position.
   * @param {string} imagePath - Pfad zur Hintergrundgrafik.
   * @param {number} x - Horizontale Position des Objekts in der Spielwelt.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height; // Positioniert das Bild am unteren Rand des Canvas
  }
}
