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
  ctx;
  canvas;

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

  setCanvasContext(ctx) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
  }

  calculateCenteredImageBounds(canvas, image) {
    const maxWidth = canvas.width * 0.8;
    const maxHeight = canvas.height * 0.8;

    const scale = Math.min(
      maxWidth / image.width,
      maxHeight / image.height,
      1
    );

    const width = image.width * scale;
    const height = image.height * scale;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;

    return { x, y, width, height };
  }

  drawGameOverOverlay(ctx, canvas, x, y, width, height) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.gameOverImage, x, y, width, height);
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
      this.updateLastMoveTime(isMoving);
      this.updateCamera();
    }, 1000 / 60);

    this.startAnimationWatcher();
  }

  throwBottle() {
    if (this.isDying || !this.canThrowBottle()) return;

    const bottle = this.createThrowableBottle();
    this.addBottleToWorld(bottle);
    this.collectedBottles--; 
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
    this.triggerDeath();
  }
}

displayVictoryScreen() {
  const ctx = this.findCanvasContext();
  if (!this.victoryImage || !ctx) return;

  const canvas = ctx.canvas;
  const { x, y, width, height } = this.calculateCenteredImageBounds(canvas, this.victoryImage);

  const draw = () => this.drawVictoryOverlay(ctx, canvas, x, y, width, height);

  const loop = () => {
    if (this.showVictoryScreen) {
      draw();
      requestAnimationFrame(loop);
    }
  };

  loop();
  this.scheduleVictoryScreenEnd();
}

drawVictoryOverlay(ctx, canvas, x, y, width, height) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(this.victoryImage, x, y, width, height);
}

drawGameOverOverlay(ctx, canvas, x, y, width, height) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.width);
  ctx.drawImage(this.gameOverImage, x, y, width, height);
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
      
      this.showGameOverScreen();
    }
  }, 150);
}

onDeathAnimationComplete() {
  console.log("Death animation completed");
}

showGameOverScreen() {
  if (!this.gameOverImage) {
    this.loadGameOverImage();
  }

  const displayGameOver = () => {
    const ctx = this.findCanvasContext();
    if (!ctx || !this.gameOverImage) {
      console.error("⚠️ Canvas Context oder Game Over Image nicht verfügbar");
      return;
    }

    const canvas = ctx.canvas;
    const { x, y, width, height } = this.calculateCenteredImageBounds(canvas, this.gameOverImage);
    
    this.showGameOverOverlay = true;
    
    const draw = () => {
      if (this.showGameOverOverlay) {
        this.drawGameOverOverlay(ctx, canvas, x, y, width, height);
        requestAnimationFrame(draw);
      }
    };
    
    draw();

    setTimeout(() => {
      location.reload();
    }, 3000);
  };

  if (this.gameOverImage && this.gameOverImage.complete) {
    displayGameOver();
  } else if (this.gameOverImage) {
    this.gameOverImage.onload = displayGameOver;
  }
}

loadGameOverImage() {
  this.gameOverImage = new Image();
  this.gameOverImage.src = "img/You won, you lost/Game Over.png";
  
  this.gameOverImage.onerror = (error) => {
    console.error("⚠️ Fehler beim Laden des Game Over Bildes:", error);
  };
}

findCanvasContext() {
  if (this.ctx) return this.ctx;
  
  if (this.world?.ctx) return this.world.ctx;
  if (this.world?.canvas) return this.world.canvas.getContext('2d');
  
  const canvas = document.querySelector('canvas');
  return canvas ? canvas.getContext('2d') : null;
}

calculateCenteredImageBounds(canvas, image) {
  const canvasRatio = canvas.width / canvas.height;
  const imageRatio = image.width / image.height;
  
  let width, height, x, y;
  
  if (imageRatio > canvasRatio) {
    width = canvas.width * 0.8; 
    height = width / imageRatio;
  } else {
    height = canvas.height * 0.8; 
    width = height * imageRatio;
  }
  
  x = (canvas.width - width) / 2;
  y = (canvas.height - height) / 2;
  
  return { x, y, width, height };
}
}