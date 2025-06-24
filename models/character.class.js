class Character extends MovableObject {
  height = 280;
  y = 80;
  speed = 10;
  hitboxOffsetX = 25;
  hitboxOffsetY = 130;
  hitboxWidthReduction = 50;
  hitboxHeightReduction = 160;
  collectedCoins = 0;
  maxCoins = 20;
  collectedBottles = 0;
  maxBottles = 20;
  lastMoveTime = Date.now();
  idleInterval;
  isThrowingBottle = false;
  isDying = false;
  deathAnimationStarted = false;
  world;
  walking_sound = new Audio("");
  hurt_sound = new Audio("audio/hurt-character.mp4");
  jump_sound = new Audio("audio/jump.mp4");
  death_sound = new Audio("audio/death.mp4");

  IMAGES_WALKING = [
    "../img/2_character_pepe/2_walk/W-21.png",
    "../img/2_character_pepe/2_walk/W-22.png",
    "../img/2_character_pepe/2_walk/W-23.png",
    "../img/2_character_pepe/2_walk/W-24.png",
    "../img/2_character_pepe/2_walk/W-25.png",
    "../img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "../img/2_character_pepe/3_jump/J-31.png",
    "../img/2_character_pepe/3_jump/J-32.png",
    "../img/2_character_pepe/3_jump/J-33.png",
    "../img/2_character_pepe/3_jump/J-34.png",
    "../img/2_character_pepe/3_jump/J-35.png",
    "../img/2_character_pepe/3_jump/J-36.png",
    "../img/2_character_pepe/3_jump/J-37.png",
    "../img/2_character_pepe/3_jump/J-38.png",
    "../img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "../img/2_character_pepe/5_dead/D-51.png",
    "../img/2_character_pepe/5_dead/D-52.png",
    "../img/2_character_pepe/5_dead/D-53.png",
    "../img/2_character_pepe/5_dead/D-54.png",
    "../img/2_character_pepe/5_dead/D-55.png",
    "../img/2_character_pepe/5_dead/D-56.png",
    "../img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "../img/2_character_pepe/4_hurt/H-41.png",
    "../img/2_character_pepe/4_hurt/H-42.png",
    "../img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_IDLE = [
    "../img/2_character_pepe/1_idle/idle/I-1.png",
    "../img/2_character_pepe/1_idle/idle/I-2.png",
    "../img/2_character_pepe/1_idle/idle/I-3.png",
    "../img/2_character_pepe/1_idle/idle/I-4.png",
    "../img/2_character_pepe/1_idle/idle/I-5.png",
    "../img/2_character_pepe/1_idle/idle/I-6.png",
    "../img/2_character_pepe/1_idle/idle/I-7.png",
    "../img/2_character_pepe/1_idle/idle/I-8.png",
    "../img/2_character_pepe/1_idle/idle/I-9.png",
    "../img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "../img/2_character_pepe/1_idle/long_idle/I-11.png",
    "../img/2_character_pepe/1_idle/long_idle/I-12.png",
    "../img/2_character_pepe/1_idle/long_idle/I-13.png",
    "../img/2_character_pepe/1_idle/long_idle/I-14.png",
    "../img/2_character_pepe/1_idle/long_idle/I-15.png",
    "../img/2_character_pepe/1_idle/long_idle/I-16.png",
    "../img/2_character_pepe/1_idle/long_idle/I-17.png",
    "../img/2_character_pepe/1_idle/long_idle/I-18.png",
    "../img/2_character_pepe/1_idle/long_idle/I-19.png",
    "../img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  constructor() {
    super();
    this.loadImage("../img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadGameOverImage();
    this.applyGravity();
  }

  getHitbox() {
    return {
      x: this.x + this.hitboxOffsetX,
      y: this.y + this.hitboxOffsetY,
      width: this.width - this.hitboxWidthReduction,
      height: this.height - this.hitboxHeightReduction,
    };
  }

  handleMovement() {
    if (this.isDying) return false;

    let isMoving = false;

    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      isMoving = true;
    }

    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      isMoving = true;
    }

    return isMoving;
  }

  handleJumping(isMoving) {
    if (this.isDying) return false;

    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.jump_sound.play();
      return true;
    }
    return isMoving;
  }

  handleWalkingSound(isMoving) {
    if (!isMoving || this.isDying) {
      this.walking_sound.pause();
    }
  }

  updateLastMoveTime(isMoving) {
    if (isMoving && !this.isDying) {
      this.lastMoveTime = Date.now();
    }
  }

  updateCamera() {
    if (!this.isDying) {
      this.world.camera_x = -this.x + 100;
    }
  }

  startAnimationWatcher() {
    let wasHurt = false;

    this.idleInterval = setInterval(() => {
      const idleTime = Date.now() - this.lastMoveTime;

      if (this.handleDeathAnimation()) return;

      if (this.handleHurtAnimation(() => (wasHurt = true))) {
        wasHurt = true;
        return;
      } else {
        wasHurt = false;
      }

      if (this.handleJumpingAnimation()) return;
      if (this.handleWalkingAnimation()) return;
      if (this.isThrowingBottle) return;

      this.handleIdleAnimations(idleTime);
    }, 100);
  }

  handleHurtAnimation(setHurtCallback) {
    if (this.isDying) return false;

    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      setHurtCallback();
      if (!this.hurt_sound_played) {
        this.hurt_sound.play();
        this.hurt_sound_played = true;
      }
      return true;
    } else {
      this.hurt_sound_played = false;
    }
    return false;
  }

  handleJumpingAnimation() {
    if (this.isDying) return false;

    if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
      return true;
    }
    return false;
  }

  handleWalkingAnimation() {
    if (this.isDying) return false;

    if (
      this.world.keyboard.RIGHT ||
      this.world.keyboard.LEFT ||
      this.world.keyboard.D
    ) {
      this.playAnimation(this.IMAGES_WALKING);
      return true;
    }
    return false;
  }

  handleIdleAnimations(idleTime) {
    if (this.isDying) return;

    if (idleTime > 4000) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else if (idleTime > 2000) {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  resetIdleTimer() {
    this.lastMoveTime = Date.now();
  }

  animate() {
    setInterval(() => {
      this.checkForDeath();
      if (this.isDying) {
        this.handleDeathAnimation();
        return;
      }

      let isMoving = this.handleMovement();
      this.handleJumping(isMoving);
      this.handleWalkingSound(isMoving);
      this.updateLastMoveTime(isMoving);
      this.updateCamera();
    }, 1000 / 60);

    this.startAnimationWatcher();
  }

  throwBottle() {
    if (this.isDying || !this.canThrowBottle()) return;

    const bottle = this.createThrowableBottle();
    this.addBottleToWorld(bottle);
    this.collectedBottles--; // Direkt hier statt eigene Methode
    this.resetIdleTimer();
    this.markAsThrowingTemporarily();
  }

  canThrowBottle() {
    return this.collectedBottles > 0 && !this.isDying;
  }

  createThrowableBottle() {
    return new ThrowableObject(this.x + this.width / 2, this.y);
  }

  addBottleToWorld(bottle) {
    this.world.throwableObjects.push(bottle);
  }

  markAsThrowingTemporarily() {
    this.isThrowingBottle = true;
    setTimeout(() => {
      this.isThrowingBottle = false;
    }, 100);
  }

  setHealth(health) {
    this.energy = health;
    this.checkForDeath();
  }

  hit() {
    if (this.isDying) return;
    super.hit();
    this.checkForDeath();
  }

  triggerDeath() {
    if (!this.isDying) {
      this.isDying = true;
      this.deathAnimationStarted = false;
      this.energy = Math.min(this.energy, 15);
      if (this.health !== undefined) this.health = Math.min(this.health, 15);

      this.walking_sound.pause();

      this.speed = 0;
      this.acceleration = 0;
      this.handleDeathAnimation();
    }
  }

  checkForDeath() {
    if (this.isDying) return;

    const energyDead = this.energy !== undefined && this.energy <= 15;
    const healthDead = this.health !== undefined && this.health <= 15;
    const statusBarDead =
      this.world?.statusBar?.percentage <= 15 ||
      this.world?.statusBar?.statusBarIndex <= 1 ||
      this.world?.statusBar?.currentImageIndex <= 1 ||
      this.world?.statusBarHealth?.percentage <= 15;

    if (energyDead || healthDead || statusBarDead) {
      console.log("💀 Death detected at 15% health:", {
        energy: this.energy,
        health: this.health,
        statusBar: statusBarDead,
      });
      this.triggerDeath();
    }
  }

  handleDeathAnimation() {
    if (this.isDead() || this.isDying) {
      if (!this.deathAnimationStarted) {
        this.deathAnimationStarted = true;
        this.playDeathAnimation();
      }
      return true;
    }
    return false;
  }

 playDeathAnimation() {
  const deathAudio = new Audio("audio/death-scream.mp4");
  deathAudio.play().catch((error) => {
    console.error("⚠️ Fehler beim Abspielen des Death-Sounds:", error);
  });

  let currentFrame = 0;
  const animationInterval = setInterval(() => {
    if (currentFrame < this.IMAGES_DEAD.length) {
      this.img = this.imageCache[this.IMAGES_DEAD[currentFrame]];
      currentFrame++;
    } else {
      clearInterval(animationInterval);
      this.onDeathAnimationComplete();

      // Game Over Bild vorbereiten und anzeigen
      this.gameOverImage = new Image();
      this.gameOverImage.src = "img/You won, you lost/Game Over.png";
      this.gameOverImage.onload = () => {
        // Sobald Bild geladen ist, zeichnen
        this.ctx.drawImage(this.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
      };

      // Nach 2 Sekunden Seite neu laden
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  }, 150);
}


  onDeathAnimationComplete() {
    setTimeout(() => {
      this.showGameOverScreen();
    }, 500);
  }

  cleanup() {
  // Stop character intervals
  if (this.idleInterval) {
    clearInterval(this.idleInterval);
    this.idleInterval = null;
  }

  // Stop world intervals
  if (this.world?.gameOverInterval) {
    clearInterval(this.world.gameOverInterval);
    this.world.gameOverInterval = null;
  }

  if (this.world?.drawInterval) {
    clearInterval(this.world.drawInterval);
    this.world.drawInterval = null;
  }

  // Stop audio
  this.walking_sound.pause();
  this.hurt_sound.pause();
  this.jump_sound.pause();
  this.death_sound.pause();

  // Remove event listeners
  if (this.gameOverControlsRegistered) {
    // Store the handler to remove it specifically
    document.removeEventListener("keydown", this.handleRestart);
    this.gameOverControlsRegistered = false;
  }
}

  loadGameOverImage() {
    this.gameOverImage = new Image();
    this.gameOverImage.src = "img/You won, you lost/Game Over.png";
  }

  


cleanup() {
  // Stop character intervals
  if (this.idleInterval) {
    clearInterval(this.idleInterval);
    this.idleInterval = null;
  }

  // Stop world intervals
  if (this.world?.gameOverInterval) {
    clearInterval(this.world.gameOverInterval);
    this.world.gameOverInterval = null;
  }

  if (this.world?.drawInterval) {
    clearInterval(this.world.drawInterval);
    this.world.drawInterval = null;
  }

  // Stop audio
  this.walking_sound.pause();
  this.hurt_sound.pause();
  this.jump_sound.pause();
  this.death_sound.pause();

  // Remove event listeners
  if (this.gameOverControlsRegistered) {
    // Store the handler to remove it specifically
    document.removeEventListener("keydown", this.handleRestart);
    this.gameOverControlsRegistered = false;
  }
}




}
