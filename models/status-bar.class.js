class StatusBar extends DrawableObject {
  percentage = 100;

  constructor(type, x, y) {
    super();
    this.type = type; // z.B. 'health', 'bottle', 'coin'
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 60;
    this.IMAGES = this.getImagesForType(type);
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }

  getImagesForType(type) {
    if (type === "health") {
      return [
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png",
      ];
    } else if (type === "bottle") {
      return [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
      ];
    } else if (type === "coin") {
      return [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png",
      ];
    }
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.type === "coin") {
      if (this.percentage >= 100) return 5;
      else if (this.percentage >= 80) return 4;
      else if (this.percentage >= 60) return 3;
      else if (this.percentage >= 40) return 2;
      else if (this.percentage >= 20) return 1;
      else return 0;
    } else {
      if (this.percentage >= 100) return 5;
      else if (this.percentage > 80) return 4;
      else if (this.percentage > 60) return 3;
      else if (this.percentage > 40) return 2;
      else if (this.percentage > 20) return 1;
      else return 0;
    }
  }
}
