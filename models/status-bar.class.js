class StatusBar extends DrawableObject {
  percentage = 100;

  constructor(type, x, y) {
    super();
    this.type = type; 
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 60;
    this.IMAGES = this.getImagesForType(type);
    this.imagesLoaded = false; 
    
    console.log(`StatusBar erstellt: Type=${type}, Position=(${x},${y})`);
    console.log(`Bilder für ${type}:`, this.IMAGES);
    
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.onload = () => {
        console.log(`Bild geladen: ${path}`);
        this.checkAllImagesLoaded();
      };
      img.onerror = (error) => {
        console.error(`Fehler beim Laden von ${path}:`, error);
      };
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  checkAllImagesLoaded() {
    const allLoaded = this.IMAGES.every(path => 
      this.imageCache[path] && this.imageCache[path].complete
    );
    
    if (allLoaded && !this.imagesLoaded) {
      this.imagesLoaded = true;
      console.log(`Alle Bilder für ${this.type} StatusBar geladen!`);
      this.setPercentage(this.percentage);
    }
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
    } else if (type === "endboss") {
      return [
        "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
      ];
    }
    return [];
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    
    console.log(`StatusBar (${this.type}) Percentage gesetzt: ${percentage}%, Bild-Index: ${this.resolveImageIndex()}, Pfad: ${path}`);
    
    if (this.imageCache[path] && this.imageCache[path].complete) {
      this.img = this.imageCache[path];
      console.log(`Bild erfolgreich gesetzt für ${this.type} StatusBar`);
    } else {
      console.warn(`Bild noch nicht geladen für ${this.type} StatusBar: ${path}`);
      setTimeout(() => {
        if (this.imageCache[path] && this.imageCache[path].complete) {
          this.img = this.imageCache[path];
          console.log(`Bild nachträglich gesetzt für ${this.type} StatusBar`);
        }
      }, 100);
    }
  }

  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    else if (this.percentage >= 80) return 4;
    else if (this.percentage >= 60) return 3;
    else if (this.percentage >= 40) return 2;
    else if (this.percentage >= 20) return 1;
    else return 0;
  }

  draw(ctx) {
    console.log(`Zeichne StatusBar: Type=${this.type}, Position=(${this.x},${this.y}), Percentage=${this.percentage}%`);
    
    if (this.img && this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      console.log(`StatusBar ${this.type} erfolgreich gezeichnet!`);
    } else {
      console.error(`StatusBar ${this.type} Bild nicht verfügbar!`, {
        hasImg: !!this.img,
        complete: this.img ? this.img.complete : false,
        src: this.img ? this.img.src : 'undefined'
      });
      
      ctx.strokeStyle = this.type === "endboss" ? "blue" : "red";
      ctx.lineWidth = 3;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = this.type === "endboss" ? "rgba(0, 0, 255, 0.3)" : "rgba(255, 0, 0, 0.3)";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(`${this.type}: ${this.percentage}%`, this.x + 10, this.y + 30);
    }
  }
}