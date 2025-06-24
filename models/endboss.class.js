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
  health = 100;
  hitCounter = 0;
  lastHitTime = 0;
  hitCooldown = 500;
  maxHits = 5;

  constructor() {
    super();
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.isDead = false;
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.victorySound = new Audio("audio/winner.mp4"); 
    this.victorySound.volume = 0.1; 

    this.x = 4000;
    this.loadVictoryImage();
    this.animate();
    this.startMovement();
    setTimeout(() => {
      if (world) this.worldReference = world;
    }, 100);
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
        if (!this.deathSoundPlayed) {
          // Verhindert mehrfaches Abspielen
          this.playDeathSound(); // Sound abspielen
          this.deathSoundPlayed = true;
        }
        this.playDeathAnimation(); // Animation abspielen
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

  // Neue Methode für den Victory-Sound
  playDeathSound() {
    const victorySound = new Audio("audio/winner.mp4");
    victorySound
      .play()
      .catch((e) => console.error("Sound konnte nicht abgespielt werden:", e));
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
          this.otherDirection = character.x > this.x;
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
    if (!window.character || this.isDead || !this.isWalking) return;

    const distanceX = character.x - this.x;
    const speed = 3;

    this.otherDirection = character.x > this.x;

    if (Math.abs(distanceX) > 20) {
      this.x += distanceX > 0 ? speed : -speed;
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

    this.otherDirection = character.x > this.x;

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

    const verticalOffset = this.jumpHeight * Math.sin(progress * Math.PI);
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
    if (!this.victoryImage || !ctx) return;

    const canvas = ctx.canvas;
    const maxWidth = canvas.width * 0.8;
    const maxHeight = canvas.height * 0.8;
    let scale = Math.min(
      maxWidth / this.victoryImage.width,
      maxHeight / this.victoryImage.height,
      1
    );

    const finalWidth = this.victoryImage.width * scale;
    const finalHeight = this.victoryImage.height * scale;
    const x = (canvas.width - finalWidth) / 2;
    const y = (canvas.height - finalHeight) / 2;

    const drawVictoryScreen = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this.victoryImage, x, y, finalWidth, finalHeight);
    };

    const victoryLoop = () => {
      if (this.showVictoryScreen) {
        drawVictoryScreen();
        requestAnimationFrame(victoryLoop);
      }
    };

    victoryLoop();

    setTimeout(() => {
      this.showVictoryScreen = false;
      this.reloadPage();
    }, 2000);
  }

  reloadPage() {
    window.location.reload();
  }

  returnToStartScreen() {
    if (this.animationInterval) clearInterval(this.animationInterval);
    if (this.movementAnimationId)
      cancelAnimationFrame(this.movementAnimationId);

    if (typeof world !== "undefined" && world?.clearAllIntervals) {
      world.clearAllIntervals();
      world = null;
    }

    const ctx = this.findCanvasContext();
    if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.resetToOriginalStartScreen();
  }

  resetToOriginalStartScreen() {
    const startButton = document.getElementById("startButton");
    const controlsImage = document.getElementById("controlsImage");

    if (startButton) startButton.style.display = "block";
    if (controlsImage) controlsImage.style.display = "none";

    if (typeof showStartScreen === "function") showStartScreen();
  }

  hit() {
    if (this.isDead) return;

    const currentTime = Date.now();
    if (currentTime - this.lastHitTime < this.hitCooldown) return;

    this.lastHitTime = currentTime;
    this.hitCounter++;

    this.energy = Math.max(0, 100 - this.hitCounter * 20);

    if (this.worldReference?.registerEndbossHit) {
      this.worldReference.registerEndbossHit(this.energy);
    }

    const hurtSound = new Audio("audio/hurt-endboss.mp4");
    hurtSound.volume = 0.6;
    hurtSound.currentTime = 0;
    hurtSound
      .play()
      .catch((e) =>
        console.warn("Endboss-Hurt-Sound konnte nicht abgespielt werden:", e)
      );

    if (this.hitCounter >= this.maxHits) {
      this.energy = 0;
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
    if (typeof world !== "undefined" && world?.ctx) return world.ctx;
    if (window.canvas?.getContext) return window.canvas.getContext("2d");
    if (document.querySelector("canvas"))
      return document.querySelector("canvas").getContext("2d");
    if (window.ctx) return window.ctx;

    console.error("Kein Canvas Context gefunden!");
    return null;
  }

  getHitbox() {
    return {
      x: this.x + 50,
      y: this.y + 120,
      width: this.width - 80,
      height: this.height - 150,
    };
  }

  restartGame() {
    if (this.animationInterval) clearInterval(this.animationInterval);
    if (this.movementAnimationId)
      cancelAnimationFrame(this.movementAnimationId);

    if (typeof world !== "undefined" && world) world.clearAllIntervals();

    this.showStartScreen();

    const startButton = document.getElementById("startButton");
    const controlsImage = document.getElementById("controlsImage");

    if (startButton) startButton.style.display = "block";
    if (controlsImage) controlsImage.style.display = "none";
  }

  showStartScreen() {
    let ctx = this.findCanvasContext();
    if (!ctx) return;

    let startImage = new Image();
    startImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";

    startImage.onload = () => {
      const canvas = ctx.canvas;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
    };
  }
}
