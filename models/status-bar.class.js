class StatusBar extends DrawableObject {
  percentage = 100;
  imagesLoaded = false;
  lastPercentage = -1;

  constructor(type, x, y) {
    super();
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 60;
    this.IMAGES = this.getImagesForType(type);
    this.loadAllImages();
    
    console.log(`[StatusBar] Created: ${type} at (${x},${y})`);
  }

  loadAllImages() {
    let loaded = 0;
    this.IMAGES.forEach(path => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === this.IMAGES.length) {
          this.imagesLoaded = true;
          this.setPercentage(this.percentage);
          console.log(`[StatusBar] All images loaded for: ${this.type}`);
        }
      };
      img.onerror = () => console.error(`[StatusBar] Error loading: ${path}`);
      img.src = path;
      this.imageCache[path] = img;
    });
  }

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

  setPercentage(percentage) {
    if (percentage === this.lastPercentage) return;
    
    this.percentage = Math.max(0, Math.min(100, percentage));
    this.lastPercentage = this.percentage;
    const index = this.resolveImageIndex();
    const path = this.IMAGES[index];
    
    console.log(`[StatusBar] Set ${this.type}: ${percentage}% -> index ${index}, image: ${path}`);
    
    if (this.imageCache[path]) {
      this.img = this.imageCache[path];
    } else {
      console.warn(`[StatusBar] Image not cached: ${path}`);
    }
  }

  setHits(hits, maxHits) {
    const percentage = Math.max(0, 100 - (hits / maxHits) * 100);
    console.log(`[StatusBar] Set hits: ${hits}/${maxHits} -> ${percentage}%`);
    this.setPercentage(percentage);
  }

  resolveImageIndex() {
    if (this.percentage === 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }

  draw(ctx) {
    if (!this.imagesLoaded) {
      console.warn(`[StatusBar] Drawing before images loaded: ${this.type}`);
      this.drawPlaceholder(ctx);
      return;
    }

    try {
      if (this.img && this.img.complete) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      } else {
        console.error(`[StatusBar] Image not ready: ${this.type} - ${this.img?.src}`);
        this.drawPlaceholder(ctx);
      }
    } catch (error) {
      console.error(`[StatusBar] Drawing error: ${error.message}`);
      this.drawPlaceholder(ctx);
    }
  }

  drawPlaceholder(ctx) {
    ctx.fillStyle = this.type === "endboss" ? "rgba(0,0,255,0.5)" : "rgba(255,0,0,0.5)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`${this.type}: ${this.percentage}%`, this.x + 10, this.y + 30);
    
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}