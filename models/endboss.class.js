class Endboss extends MovableObject {
  height = 400;
  width = 250;
  speed = 0.2;
  y = 62;
  x = 3800;

  IMAGES_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  health = 100;
  isHurt = false;
  isDead = false;
  isWalking = false;
  isAlerted = false;
  isAttacking = false;
  animationInterval;
  movementAnimationId;
  hurtFrameIndex = 0;
  hurtAnimationPlaying = false;
  currentFrameIndex = 0;
  isJumping = false;
  jumpStartY = 0;
  jumpStartX = 0;
  jumpTargetX = 0;
  jumpSpeed = 8;
  jumpHeight = 150;
  jumpProgress = 0;

  victoryImage = null;
  showVictoryScreen = false;

  constructor() {
    super();
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 4000;
    this.loadVictoryImage();
    this.animate();
    this.startMovement();
  }

  loadVictoryImage() {
    this.victoryImage = new Image();
    this.victoryImage.src = "img/You won, you lost/You won A.png";
    this.victoryImage.onload = () => {
      console.log("Victory Image erfolgreich geladen!");
    };
    this.victoryImage.onerror = () => {
      console.error("Fehler beim Laden des Victory Images!");
    };
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (this.isDead) {
        this.playDeathAnimation();
      } else if (this.isHurt) {
        this.playHurtAnimation();
      } else if (this.isAttacking) {
        this.playAttackAnimation();
      } else if (this.isAlerted) {
        this.playAlertAnimation();
      } else if (this.isWalking) {
        this.playWalkAnimation();
      } else {
        this.playAlertAnimation();
      }
    }, 200);
  }

  startMovement() {
    const move = () => {
      if (this.isDead) {
        cancelAnimationFrame(this.movementAnimationId);
        return;
      }

      if (window.character) {
        const distance = Math.abs(this.x - character.x);

        if (!this.isJumping) {
          if (character.x > this.x) {
            this.otherDirection = true;
          } else {
            this.otherDirection = false;
          }
        }

        if (distance < 100) {
          if (!this.isAttacking && !this.isJumping) {
            this.startJumpAttack();
          }
          this.isWalking = false;
          this.isAttacking = true;
          this.isAlerted = false;
        } else if (distance < 400) {
          if (!this.isHurt && !this.isAlerted && !this.isJumping) {
            this.isWalking = true;
            this.isAttacking = false;
          }
          this.moveTowardsCharacter();
        } else {
          this.isWalking = false;
          this.isAttacking = false;
          if (!this.isHurt && !this.isJumping) {
            this.isAlerted = true;
          }
        }

        if (this.isJumping) {
          this.updateJumpAttack();
        }
      }

      this.movementAnimationId = requestAnimationFrame(move);
    };
    move();
  }

  moveTowardsCharacter() {
    if (!window.character || this.isDead) return;

    if (!this.isWalking) return;

    const distanceX = character.x - this.x;
    const speed = 3;

    if (character.x > this.x) {
      this.otherDirection = true;
    } else {
      this.otherDirection = false;
    }

    if (Math.abs(distanceX) > 20) {
      if (distanceX > 0) {
        this.x += speed;
        console.log(`Endboss bewegt sich: x = ${this.x}, Richtung = rechts`);
      } else {
        this.x -= speed;
        console.log(`Endboss bewegt sich: x = ${this.x}, Richtung = links`);
      }
    }
  }

  playAlertAnimation() {
    this.playAnimation(this.IMAGES_ALERT);
  }

  playWalkAnimation() {
    this.playAnimation(this.IMAGES_WALK);
  }

  playHurtAnimation() {
    if (!this.hurtAnimationPlaying) {
      this.hurtAnimationPlaying = true;
      this.hurtFrameIndex = 0;
    }

    this.loadImage(this.IMAGES_HURT[this.hurtFrameIndex]);

    if (this.hurtFrameIndex < this.IMAGES_HURT.length - 1) {
      this.hurtFrameIndex++;
    } else {
      this.isHurt = false;
      this.hurtAnimationPlaying = false;
      this.isAlerted = true;

      setTimeout(() => {
        this.isAlerted = false;
        this.isWalking = true;
      }, 1000);
    }
  }

  startJumpAttack() {
    if (this.isJumping || !window.character) return;

    this.isJumping = true;
    this.jumpStartY = this.y;
    this.jumpStartX = this.x;
    this.jumpTargetX = character.x;
    this.jumpProgress = 0;

    if (character.x > this.x) {
      this.otherDirection = true;
    } else {
      this.otherDirection = false;
    }

    console.log("Endboss startet Sprung-Angriff!");
  }

  updateJumpAttack() {
    if (!this.isJumping) return;

    this.jumpProgress += 0.05;

    if (this.jumpProgress >= 1) {
      this.isJumping = false;
      this.y = this.jumpStartY;
      this.jumpProgress = 0;

      setTimeout(() => {
        this.isAttacking = false;
      }, 500);

      console.log("Endboss Sprung-Angriff beendet!");
      return;
    }

    const progress = this.jumpProgress;
    const targetDistance = this.jumpTargetX - this.jumpStartX;
    this.x = this.jumpStartX + targetDistance * progress;

    const jumpHeight = this.jumpHeight;
    const verticalOffset = jumpHeight * Math.sin(progress * Math.PI);
    this.y = this.jumpStartY - verticalOffset;
  }

  playAttackAnimation() {
    this.playAnimation(this.IMAGES_ATTACK);
  }

  playDeathAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      clearInterval(this.animationInterval);
      cancelAnimationFrame(this.movementAnimationId);
      this.shouldBeRemoved = true;
      this.showVictoryScreen = true;
      this.displayVictoryScreen();
    }, this.IMAGES_DEAD.length * 200);
  }

  displayVictoryScreen() {
    let ctx = this.findCanvasContext();

    if (!this.victoryImage || !ctx) {
      console.error("Victory Image oder Canvas Context nicht verfügbar!");
      console.error("ctx:", ctx);
      console.error("this.victoryImage:", this.victoryImage);
      return;
    }

    console.log("Canvas Context gefunden!", ctx);

    // Canvas-Dimensionen ermitteln
    const canvas = ctx.canvas;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Victory Image mittig auf dem Canvas positionieren
    const imgWidth = this.victoryImage.width;
    const imgHeight = this.victoryImage.height;

    // Skalierung berechnen (falls das Bild zu groß ist)
    const maxWidth = canvasWidth * 0.8; // 80% der Canvas-Breite
    const maxHeight = canvasHeight * 0.8; // 80% der Canvas-Höhe
    let scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);

    const finalWidth = imgWidth * scale;
    const finalHeight = imgHeight * scale;

    const x = (canvasWidth - finalWidth) / 2;
    const y = (canvasHeight - finalHeight) / 2;

    // Victory Screen zeichnen
    const drawVictoryScreen = () => {
      // Halbtransparenter Hintergrund
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Victory Image zeichnen
      ctx.drawImage(this.victoryImage, x, y, finalWidth, finalHeight);
    };

    // Victory Screen kontinuierlich zeichnen
    const victoryLoop = () => {
      if (this.showVictoryScreen) {
        drawVictoryScreen();
        requestAnimationFrame(victoryLoop);
      }
    };

    console.log("Victory Screen wird angezeigt!");
    victoryLoop();
  }

  takeDamage() {
    if (this.isDead) return;
    this.health -= 10;

    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      this.playDeathAnimation();
    } else {
      this.isHurt = true;
      this.hurtAnimationPlaying = false;
      this.isWalking = false;
    }
  }

  playAnimation(images) {
    if (this.currentFrameIndex >= images.length) {
      this.currentFrameIndex = 0;
    }

    this.loadImage(images[this.currentFrameIndex]);
    this.currentFrameIndex++;
  }

  findCanvasContext() {
    let ctx = null;

    if (typeof world !== "undefined" && world.ctx) {
      ctx = world.ctx;
      console.log("Context gefunden über: world.ctx");
    }
    else if (window.canvas && window.canvas.getContext) {
      ctx = window.canvas.getContext("2d");
      console.log("Context gefunden über: window.canvas");
    }
    else if (document.querySelector("canvas")) {
      ctx = document.querySelector("canvas").getContext("2d");
      console.log("Context gefunden über: document.querySelector('canvas')");
    }
    else if (window.ctx) {
      ctx = window.ctx;
      console.log("Context gefunden über: window.ctx");
    }

    if (!ctx) {
      console.error("Kein Canvas Context gefunden!");
      console.log("Verfügbare globale Variablen:");
      console.log(
        "- world.ctx:",
        typeof world !== "undefined" && world.ctx ? world.ctx : "undefined"
      );
      console.log("- window.canvas:", window.canvas);
      console.log("- Canvas im DOM:", document.querySelector("canvas"));
    }

    return ctx;
  }

  getHitbox() {
    return {
      x: this.x + 50,
      y: this.y + 120,
      width: this.width - 80,
      height: this.height - 150,
    };
  }
}
