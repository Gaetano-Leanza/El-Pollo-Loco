/**
 * StatusBar-Klasse zur Darstellung verschiedener Statusleisten (z.B. Gesundheit, Münzen).
 * Erweitert DrawableObject und lädt Bilder je nach Typ vor.
 */
class StatusBar extends DrawableObject {
  /** @type {number} Aktueller Prozentsatz der Statusleiste (0-100) */
  percentage = 100;
  /** @type {boolean} Gibt an, ob alle Bilder geladen wurden */
  imagesLoaded = false;
  /** @type {number} Letzter gesetzter Prozentsatz, um unnötige Updates zu vermeiden */
  lastPercentage = -1;
  /** @type {Object.<string, HTMLImageElement>} Zwischenspeicher für geladene Bilder */
  imageCache = {};

  /**
   * Erzeugt eine neue StatusBar-Instanz.
   * @param {string} type - Typ der StatusBar (z.B. "health", "bottle", "coin", "endboss").
   * @param {number} x - X-Position auf dem Canvas.
   * @param {number} y - Y-Position auf dem Canvas.
   */
  constructor(type, x, y) {
    super();
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 60;
    this.IMAGES = this.getImagesForType(type);
    this.loadAllImages();
  }

  /**
   * Lädt alle Bilder der StatusBar und speichert sie im Cache.
   * Setzt imagesLoaded auf true, wenn alle Bilder fertig geladen sind.
   * @private
   */
  loadAllImages() {
    let loaded = 0;
    this.IMAGES.forEach(path => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === this.IMAGES.length) {
          this.imagesLoaded = true;
          this.setPercentage(this.percentage);
        }
      };
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Liefert die Bildpfade passend zum StatusBar-Typ zurück.
   * @param {string} type - Typ der StatusBar.
   * @returns {string[]} Array von Bildpfaden.
   */
  getImagesForType(type) {
    const paths = {
      health: [
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png",
      ],
      bottle: [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
      ],
      coin: [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png",
      ],
      endboss: [
        "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
      ]
    };
    return paths[type] || [];
  }

  /**
   * Setzt den aktuellen Prozentsatz der StatusBar und aktualisiert das Bild.
   * Verhindert unnötige Updates, wenn sich der Wert nicht ändert.
   * @param {number} percentage - Neuer Prozentsatz (0-100).
   */
  setPercentage(percentage) {
    if (percentage === this.lastPercentage) return;

    this.percentage = Math.max(0, Math.min(100, percentage));
    this.lastPercentage = this.percentage;

    const index = this.resolveImageIndex();
    const path = this.IMAGES[index];

    if (this.imageCache[path]) {
      this.img = this.imageCache[path];
    }
  }

  /**
   * Setzt den Status basierend auf Treffern und maximaler Trefferzahl.
   * @param {number} hits - Aktuelle Trefferzahl.
   * @param {number} maxHits - Maximale Trefferzahl.
   */
  setHits(hits, maxHits) {
    const percentage = Math.max(0, 100 - (hits / maxHits) * 100);
    this.setPercentage(percentage);
  }

  /**
   * Ermittelt den Index des Bildes basierend auf dem aktuellen Prozentsatz.
   * @returns {number} Index des Bildes im Array.
   * @private
   */
  resolveImageIndex() {
    if (this.percentage === 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }

  /**
   * Zeichnet die StatusBar auf das übergebene Canvas-Kontext-Objekt.
   * Zeichnet nur, wenn Bilder geladen und bereit sind.
   * @param {CanvasRenderingContext2D} ctx - Canvas-Zeichenkontext.
   */
  draw(ctx) {
    if (!this.imagesLoaded) {
      return; // Keine Zeichnung, solange Bilder nicht geladen sind
    }

    try {
      if (this.img && this.img.complete) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    } catch {
      // Fehler ignorieren oder optional Fehlerbehandlung hinzufügen
    }
  }
}
