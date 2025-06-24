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
  isDying = false; // Neuer Flag für Todeszustand
  deathAnimationStarted = false; // Verhindert mehrfaches Abspielen

  world;

  // 🎵 Audio-Ressourcen
  walking_sound = new Audio("");
  hurt_sound = new Audio("audio/hurt-character.mp4");
  jump_sound = new Audio("audio/jump.mp4");
  death_sound = new Audio("audio/death.mp4"); // Optional: Todessound

  // 🎞️ Bild-Ressourcen
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

  // ======================================
  // ⚙️ Konstruktor
  // ======================================
  constructor() {
    super();
    this.loadImage("../img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    
    // 💀 Game Over Bild vorladen
    this.loadGameOverImage();
    
    this.applyGravity();
  }

  // ======================================
  // 💀 Game Over Bild laden
  // ======================================
  // 💀 Game Over Bild laden (bereits vorhanden)
  loadGameOverImage() {
    this.gameOverImage = new Image();
    this.gameOverImage.src = "img/You won, you lost/Game Over.png";
  }
  // ======================================
  // 🔳 Hitbox
  // ======================================
  getHitbox() {
    return {
      x: this.x + this.hitboxOffsetX,
      y: this.y + this.hitboxOffsetY,
      width: this.width - this.hitboxWidthReduction,
      height: this.height - this.hitboxHeightReduction,
    };
  }

  // ======================================
  // 💀 Tod-Logik erweitert
  // ======================================
  isDead() {
    // Sofortige Todeslogik - prüfe mehrere Quellen (bei 15% statt 0%)
    const energyDead = this.energy !== undefined && this.energy <= 15;
    const healthDead = this.health !== undefined && this.health <= 15;
    const statusBarDead = this.checkStatusBarDeath();
    
    const shouldBeDead = energyDead || healthDead || statusBarDead;
    
    // Triggere Tod sofort wenn erkannt
    if (shouldBeDead && !this.isDying) {
      this.triggerDeath();
    }
    
    return shouldBeDead || this.isDying;
  }

  checkStatusBarDeath() {
    // Prüfe verschiedene Statusbar-Eigenschaften (bei 15% statt 0%)
    if (this.world && this.world.statusBar) {
      return this.world.statusBar.percentage <= 15 || 
             this.world.statusBar.statusBarIndex <= 1 || // Index 1 entspricht oft ~15%
             (this.world.statusBar.images && this.world.statusBar.currentImageIndex <= 1);
    }
    
    // Prüfe auch direkt die Statusbar-Energie falls verfügbar
    if (this.world && this.world.statusBarHealth) {
      return this.world.statusBarHealth.percentage <= 15;
    }
    
    return false;
  }

  triggerDeath() {
    if (!this.isDying) {
      console.log("🔥 DEATH TRIGGERED at 15% - Energy:", this.energy, "Health:", this.health);
      
      this.isDying = true;
      this.deathAnimationStarted = false;
      
      // Setze Gesundheit auf kritischen Wert (nicht 0, da Tod bei 15% einsetzt)
      this.energy = Math.min(this.energy, 15);
      if (this.health !== undefined) this.health = Math.min(this.health, 15);
      
      // Stoppe alle Sounds
      this.walking_sound.pause();
      
      // Optional: Spiele Todessound ab
      if (this.death_sound) {
        this.death_sound.play();
      }
      
      // Stoppe Bewegung
      this.speed = 0;
      
      // Stoppe Schwerkraft oder andere Physik-Effekte
      this.acceleration = 0;
      
      // Sofort Todesanimation starten
      this.handleDeathAnimation();
    }
  }

  // ======================================
  // 🎮 Animation & Bewegung
  // ======================================
  animate() {
    setInterval(() => {
      // Kontinuierliche Todesüberwachung - ERSTE PRIORITÄT
      this.checkForDeath();
      
      // Wenn tot, nur noch Todesanimation
      if (this.isDying) {
        this.handleDeathAnimation();
        return;
      }

      let isMoving = this.handleMovement(); // ➤ Bewegung links/rechts
      this.handleJumping(isMoving); // ➤ Springen
      this.handleWalkingSound(isMoving); // ➤ Sound an/aus
      this.updateLastMoveTime(isMoving); // ➤ Zeit merken
      this.updateCamera(); // ➤ Kamera verschieben
    }, 1000 / 60);

    this.startAnimationWatcher(); // ➤ Animationen beobachten
  }

  // Neue Methode für kontinuierliche Todesüberwachung
  checkForDeath() {
    if (this.isDying) return; // Bereits tot
    
    const energyCheck = this.energy !== undefined && this.energy <= 15;
    const healthCheck = this.health !== undefined && this.health <= 15;
    const statusBarCheck = this.checkStatusBarDeath();
    
    if (energyCheck || healthCheck || statusBarCheck) {
      console.log("💀 Death detected at 15% health:", { 
        energy: this.energy, 
        health: this.health, 
        statusBar: statusBarCheck 
      });
      this.triggerDeath();
    }
  }

  // =========================
  // 🧭 Bewegung behandeln
  // =========================
  handleMovement() {
    // Keine Bewegung wenn tot
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

  // =========================
  // 🦘 Springen behandeln
  // =========================
  handleJumping(isMoving) {
    // Kein Springen wenn tot
    if (this.isDying) return false;
    
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.jump_sound.play();
      return true;
    }
    return isMoving;
  }

  // =========================
  // 🔊 Soundlogik
  // =========================
  handleWalkingSound(isMoving) {
    if (!isMoving || this.isDying) {
      this.walking_sound.pause();
    }
  }

  // =========================
  // 🕓 Bewegung-Zeit speichern
  // =========================
  updateLastMoveTime(isMoving) {
    if (isMoving && !this.isDying) {
      this.lastMoveTime = Date.now();
    }
  }

  // =========================
  // 🎥 Kamera anpassen
  // =========================
  updateCamera() {
    if (!this.isDying) {
      this.world.camera_x = -this.x + 100;
    }
  }

  startAnimationWatcher() {
    let wasHurt = false;

    this.idleInterval = setInterval(() => {
      const idleTime = Date.now() - this.lastMoveTime;

      // Tod hat höchste Priorität
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

  // ==============================
  // 💀 Tod prüfen - erweitert
  // ==============================
  handleDeathAnimation() {
    if (this.isDead() || this.isDying) {
      if (!this.deathAnimationStarted) {
        this.deathAnimationStarted = true;
        // Starte Todesanimation nur einmal
        this.playDeathAnimation();
      }
      return true;
    }
    return false;
  }

  playDeathAnimation() {
    let currentFrame = 0;
    const animationInterval = setInterval(() => {
      if (currentFrame < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[currentFrame]];
        currentFrame++;
      } else {
        // Animation beendet - bleibe beim letzten Frame
        clearInterval(animationInterval);
        this.onDeathAnimationComplete();
      }
    }, 150); // Langsamere Animation für dramatischen Effekt
  }

  onDeathAnimationComplete() {
    console.log("💀 Character ist gestorben! Zeige Game Over Screen...");
    
    // 🎯 Game Over Screen nach kurzer Verzögerung anzeigen
    setTimeout(() => {
      this.showGameOverScreen();
    }, 500); // 500ms Pause nach Todesanimation
  }

  // ======================================
  // 💀 Game Over Screen anzeigen
  // ======================================
  // 💀 Game Over Screen anzeigen
  displayGameOverScreen() {
    let ctx = this.world.ctx;
    if (!ctx) return;
    
    const canvas = ctx.canvas;
    
    // Berechne Skalierung
    const maxWidth = canvas.width * 0.8;
    const maxHeight = canvas.height * 0.8;
    const scale = Math.min(
      maxWidth / this.gameOverImage.width,
      maxHeight / this.gameOverImage.height
    );
    
    const width = this.gameOverImage.width * scale;
    const height = this.gameOverImage.height * scale;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 3; // Höher positioniert

    // Zeichenfunktion
    const drawGameOver = () => {
      // Dunkler Hintergrund
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Game Over Bild
      ctx.drawImage(this.gameOverImage, x, y, width, height);
    };

    // Sofort zeichnen
    drawGameOver();
    
    // 🔄 Halte Anzeige aktiv
    this.gameOverInterval = setInterval(drawGameOver, 1000/25);
    
    // 🎮 Steuerung hinzufügen
    this.setupGameOverControls();
  }

  // 💀 Nach Todesanimation
  onDeathAnimationComplete() {
    console.log("💀 Character ist gestorben! Zeige Game Over Screen...");
    
    // Weltzustand aktualisieren
    this.world.isGameOver = true;
    
    // Game Over nach kurzer Verzögerung anzeigen
    setTimeout(() => {
      this.displayGameOverScreen();
    }, 500);
  }

  
  
  
  showGameOverScreen() {
  if (!this.world || !this.world.ctx) {
    console.error("❌ Kein World-Context verfügbar");
    return;
  }

  const ctx = this.world.ctx;
  const canvas = ctx.canvas;

  // 🔒 Stoppe Welt-Rendering
  if (this.world.drawInterval) {
    clearInterval(this.world.drawInterval);
    this.world.drawInterval = null;
  }

  const drawGameOver = () => {
    // 🔒 Sperre Eingaben
    this.world.keyboard = {};
    
    // 🌫️ Dunkler Hintergrund
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (this.gameOverImage.complete && this.gameOverImage.naturalWidth > 0) {
      const scale = Math.min(
        canvas.width / this.gameOverImage.width * 0.8,
        canvas.height / this.gameOverImage.height * 0.6
      );
      
      const width = this.gameOverImage.width * scale;
      const height = this.gameOverImage.height * scale;
      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 3; // Höhere Position
      
      ctx.drawImage(this.gameOverImage, x, y, width, height);
    } else {
      this.drawGameOverText(ctx, canvas);
    }
  };

  // Sofort zeichnen
  drawGameOver();

  // 🔄 Halte Anzeige aktiv
  if (this.world.gameOverInterval) clearInterval(this.world.gameOverInterval);
  this.world.gameOverInterval = setInterval(drawGameOver, 1000/25); // 25 FPS

  // 🎮 Steuerung hinzufügen
  this.setupGameOverControls();
}

  // ======================================
  // 📝 Fallback: Game Over Text
  // ======================================
  drawGameOverText(ctx, canvas) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Drücke R zum Neustarten', canvas.width / 2, canvas.height / 2 + 60);
    
    console.log("📝 Game Over text displayed (fallback)");
  }

  // ======================================
  // 🎮 Game Over Steuerung
  // ======================================
  setupGameOverControls() {
    const handleRestart = (event) => {
      if (event.key === 'r' || event.key === 'R' || event.key === 'Enter') {
        console.log("🔄 Game restart triggered");
        
        // Cleanup
        if (this.world.gameOverInterval) {
          clearInterval(this.world.gameOverInterval);
        }
        
        // Event Listener entfernen
        document.removeEventListener('keydown', handleRestart);
        
        // Spiel neustarten
        this.restartGame();
      }
    };

    document.addEventListener('keydown', handleRestart);
    
    console.log("🎮 Game Over controls active - Drücke R oder Enter zum Neustarten");
  }

  // ======================================
  // 🔄 Spiel neustarten
  // ======================================
  restartGame() {
    if (this.world && typeof this.world.restartGame === 'function') {
      this.world.restartGame();
    } else if (this.world && typeof this.world.init === 'function') {
      this.world.init();
    } else {
      // Fallback: Seite neu laden
      console.log("🔄 Reloading page as fallback");
      location.reload();
    }
  }

  // ==============================
  // 🤕 Verletzung prüfen
  // ==============================
  handleHurtAnimation(setHurtCallback) {
    // Keine Hurt-Animation wenn bereits tot
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

  // ==============================
  // 🦘 Springen prüfen
  // ==============================
  handleJumpingAnimation() {
    if (this.isDying) return false;
    
    if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
      return true;
    }
    return false;
  }

  // ==============================
  // 🚶‍♂️ Laufen prüfen
  // ==============================
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

  // ==============================
  // 💤 Idle-Animationen
  // ==============================
  handleIdleAnimations(idleTime) {
    if (this.isDying) return;
    
    if (idleTime > 4000) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else if (idleTime > 2000) {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  // ======================================
  // 🧃 Flaschen werfen
  // ======================================
  throwBottle() {
    // Keine Flaschen werfen wenn tot
    if (this.isDying || !this.canThrowBottle()) return;

    const bottle = this.createThrowableBottle();
    this.addBottleToWorld(bottle);
    this.updateBottleCount();
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

  updateBottleCount() {
    this.collectedBottles--;
  }

  resetIdleTimer() {
    this.lastMoveTime = Date.now();
  }

  markAsThrowingTemporarily() {
    this.isThrowingBottle = true;
    setTimeout(() => {
      this.isThrowingBottle = false;
    }, 100);
  }

  // ======================================
  // 🩺 Gesundheits-Management
  // ======================================
  takeDamage(damage = 20) {
    if (this.isDying) return;
    
    // Schaden vom MovableObject verarbeiten lassen
    super.hit();
    
    console.log("💥 Damage taken! Energy after hit:", this.energy);
    
    // Sofortige Todesüberprüfung nach Schaden
    this.checkForDeath();
  }

  // Methode zum manuellen Setzen der Gesundheit
  setHealth(health) {
    this.energy = health;
    console.log("❤️ Health set to:", health);
    
    // Sofortige Todesüberprüfung nach Gesundheitsänderung (bei 20% oder weniger)
    this.checkForDeath();
  }

  // Überschreibe die hit() Methode aus MovableObject
  hit() {
    if (this.isDying) return;
    
    super.hit(); // Rufe Original hit() auf
    
    console.log("🎯 Character hit! Energy:", this.energy);
    
    // Sofortige Todesüberprüfung nach Treffer
    this.checkForDeath();
  }
}