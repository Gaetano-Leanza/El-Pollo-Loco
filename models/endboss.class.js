/**
 * Represents the final boss enemy in the game.
 * Inherits from MovableObject and contains logic for various states
 * like walking, alert, attacking, being hurt, and dying.
 */
class Endboss extends MovableObject {
  /** @type {number} Height of the boss sprite in pixels */
  height = 400;

  /** @type {number} Width of the boss sprite in pixels */
  width = 250;

  /** @type {number} Movement speed of the boss */
  speed = 0.2;

  /** @type {number} Initial vertical position */
  y = 62;

  /** @type {number} Initial horizontal position */
  x = 3800;

  /** @type {string[]} Walking animation frames */
  IMAGES_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /** @type {string[]} Alert animation frames */
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

  /** @type {string[]} Attack animation frames */
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

  /** @type {string[]} Hurt animation frames */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /** @type {string[]} Death animation frames */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /** @type {boolean} Indicates if the boss is hurt */
  isHurt = false;

  /** @type {boolean} Indicates if the boss is dead */
  isDead = false;

  /** @type {boolean} Indicates if the boss is walking */
  isWalking = false;

  /** @type {boolean} Indicates if the boss is alerted */
  isAlerted = false;

  /** @type {boolean} Indicates if the boss is attacking */
  isAttacking = false;

  /** @type {number | undefined} Interval ID for animation loop */
  animationInterval;

  /** @type {number | undefined} ID for movement animation */
  movementAnimationId;

  /** @type {number} Current frame index for hurt animation */
  hurtFrameIndex = 0;

  /** @type {boolean} Whether the hurt animation is playing */
  hurtAnimationPlaying = false;

  /** @type {number} Current frame index for general animation */
  currentFrameIndex = 0;

  /** @type {boolean} Indicates if boss is currently jumping */
  isJumping = false;

  /** @type {number} Y-position where jump started */
  jumpStartY = 0;

  /** @type {number} X-position where jump started */
  jumpStartX = 0;

  /** @type {number} X-position where jump should end */
  jumpTargetX = 0;

  /** @type {number} Jump speed */
  jumpSpeed = 8;

  /** @type {number} Maximum jump height */
  jumpHeight = 150;

  /** @type {number} Progress of the jump (0 to 1) */
  jumpProgress = 0;

  /** @type {HTMLImageElement | null} Victory image shown upon winning */
  victoryImage = null;

  /** @type {boolean} Whether to show the victory screen */
  showVictoryScreen = false;

  /** @type {number} Health of the boss */
  health = 100;

  /** @type {number} Number of hits taken */
  hitCounter = 0;

  /** @type {number} Timestamp of the last hit */
  lastHitTime = 0;

  /** @type {number} Minimum time between two hits in ms */
  hitCooldown = 500;

  /** @type {number} Maximum number of hits allowed */
  maxHits = 5;

  /**
   * Creates a new Endboss instance and initializes image assets,
   * audio, animation, and movement.
   */
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

    /** @type {HTMLAudioElement} Sound played on victory */
    this.victorySound = new Audio("audio/winner.mp4");
    this.victorySound.volume = 0.1;

    this.x = 4000;
    this.loadVictoryImage();
    this.animate();
    this.startMovement();

    // Delay world reference assignment to ensure it's initialized
    setTimeout(() => {
      if (world) this.worldReference = world;
    }, 100);
  }

  /**
   * Lädt das Bild, das beim Sieg angezeigt wird,
   * und weist es der `victoryImage`-Eigenschaft zu.
   * Gibt Erfolg oder Fehler in der Konsole aus.
   */
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

  /**
   * Startet die Animationsschleife des Bosses.
   * Prüft regelmäßig den aktuellen Zustand (tot, verletzt, Angriff usw.)
   * und spielt die passende Animation.
   * Die Prüfung erfolgt alle 200 Millisekunden.
   */
  animate() {
    this.animationInterval = setInterval(() => {
      if (this.isDead) {
        if (!this.deathSoundPlayed) {
          this.playDeathSound();
          this.deathSoundPlayed = true;
        }
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

  /**
   * Spielt den Soundeffekt, der beim Tod des Bosses abgespielt wird.
   * Bei einem Fehler beim Abspielen wird dies in der Konsole geloggt.
   */
  playDeathSound() {
    const victorySound = new Audio("audio/winner.mp4");
    victorySound
      .play()
      .catch((e) => console.error("Sound konnte nicht abgespielt werden:", e));
  }

  /**
   * Startet die kontinuierliche Bewegungslogik für das Objekt.
   * Beendet sich automatisch, wenn das Objekt tot ist.
   * Die Methode ruft regelmäßig updateDirection und evaluateCharacterDistance auf.
   */
  startMovement() {
    const move = () => {
      if (this.isDead) {
        cancelAnimationFrame(this.movementAnimationId);
        return;
      }

      if (window.character) {
        this.updateDirection();
        this.evaluateCharacterDistance();
        if (this.isJumping) this.updateJumpAttack();
      }

      this.movementAnimationId = requestAnimationFrame(move);
    };
    move();
  }

  /**
   * Aktualisiert die Blickrichtung des Objekts in Bezug auf die Position des Charakters.
   * Wird nur ausgeführt, wenn das Objekt nicht springt.
   */
  updateDirection() {
    const distance = Math.abs(this.x - character.x);
    if (!this.isJumping) {
      this.otherDirection = character.x > this.x;
    }
  }

  /**
   * Bewertet die Entfernung zum Charakter und führt je nach Distanz
   * die entsprechende Verhaltenslogik aus.
   */
  evaluateCharacterDistance() {
    const distance = Math.abs(this.x - character.x);

    if (distance < 100) {
      this.handleCloseRange();
    } else if (distance < 400) {
      this.handleMidRange();
    } else {
      this.handleFarRange();
    }
  }

  /**
   * Verhalten im Nahbereich (< 100 Pixel).
   * Startet ggf. einen Sprungangriff, deaktiviert Gehen und Alarmbereitschaft.
   */
  handleCloseRange() {
    if (!this.isAttacking && !this.isJumping) {
      this.startJumpAttack();
    }
    this.isWalking = false;
    this.isAttacking = true;
    this.isAlerted = false;
  }

  /**
   * Verhalten im mittleren Abstand (100–399 Pixel).
   * Aktiviert ggf. das Gehen in Richtung des Charakters.
   */
  handleMidRange() {
    if (!this.isHurt && !this.isAlerted && !this.isJumping) {
      this.isWalking = true;
      this.isAttacking = false;
    }
    this.moveTowardsCharacter();
  }

  /**
   * Verhalten im Fernbereich (>= 400 Pixel).
   * Deaktiviert Gehen und Angreifen, kann aber Alarmbereitschaft aktivieren.
   */
  handleFarRange() {
    this.isWalking = false;
    this.isAttacking = false;
    if (!this.isHurt && !this.isJumping) {
      this.isAlerted = true;
    }
  }

  /**
   * Bewegt das Objekt in Richtung des Charakters, falls dieser existiert,
   * das Objekt lebt und sich im "Gehen"-Zustand befindet.
   * Die Bewegung erfolgt horizontal mit konstanter Geschwindigkeit.
   */
  moveTowardsCharacter() {
    if (!window.character || this.isDead || !this.isWalking) return;

    const distanceX = character.x - this.x;
    const speed = 3;

    this.otherDirection = character.x > this.x;

    if (Math.abs(distanceX) > 20) {
      this.x += distanceX > 0 ? speed : -speed;
    }
  }

  /**
   * Spielt die Alarm-/Aufmerksamkeitsanimation ab.
   * Nutzt das Bilderset `IMAGES_ALERT`.
   */
  playAlertAnimation() {
    this.playAnimation(this.IMAGES_ALERT);
  }

  /**
   * Spielt die Geh-Animation ab.
   * Nutzt das Bilderset `IMAGES_WALK`.
   */
  playWalkAnimation() {
    this.playAnimation(this.IMAGES_WALK);
  }

  /**
   * Spielt die Verletzungsanimation ab, falls sie nicht bereits läuft.
   * Nach Abschluss wird das Objekt wieder in einen aktiven Zustand versetzt.
   * Am Ende wird eine kurze Verzögerung gesetzt, bevor das Objekt wieder geht.
   */
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

  /**
   * Startet einen Sprungangriff in Richtung des Charakters,
   * sofern das Objekt nicht bereits springt und der Charakter vorhanden ist.
   * Initialisiert alle für den Sprung benötigten Werte.
   */
  startJumpAttack() {
    if (this.isJumping || !window.character) return;

    this.isJumping = true;
    this.jumpStartY = this.y;
    this.jumpStartX = this.x;
    this.jumpTargetX = character.x;
    this.jumpProgress = 0;
    this.otherDirection = character.x > this.x;
  }

  /**
   * Aktualisiert die Position während eines Sprungangriffs.
   * Beendet den Sprung bei Abschluss und startet eine Verzögerung zur Deaktivierung des Angriffs.
   */
  updateJumpAttack() {
    if (!this.isJumping) return;

    this.advanceJumpProgress();

    if (this.isJumpComplete()) {
      this.finishJump();
      return;
    }

    this.updateJumpPosition();
  }

  /**
   * Erhöht den Fortschritt des Sprungs.
   */
  advanceJumpProgress() {
    this.jumpProgress += 0.05;
  }

  /**
   * Prüft, ob der Sprung abgeschlossen ist.
   * @returns {boolean}
   */
  isJumpComplete() {
    return this.jumpProgress >= 1;
  }

  /**
   * Beendet den Sprung, setzt Position zurück und startet einen kurzen Cooldown.
   */
  finishJump() {
    this.isJumping = false;
    this.y = this.jumpStartY;
    this.jumpProgress = 0;

    setTimeout(() => {
      this.isAttacking = false;
    }, 500);
  }

  /**
   * Aktualisiert die horizontale und vertikale Position basierend auf Sprungfortschritt.
   */
  updateJumpPosition() {
    const progress = this.jumpProgress;
    const targetDistance = this.jumpTargetX - this.jumpStartX;

    this.x = this.jumpStartX + targetDistance * progress;

    const verticalOffset = this.jumpHeight * Math.sin(progress * Math.PI);
    this.y = this.jumpStartY - verticalOffset;
  }

  /**
   * Spielt die Angriffsanimation des Objekts ab.
   * Verwendet das Bilderset `IMAGES_ATTACK`.
   */
  playAttackAnimation() {
    this.playAnimation(this.IMAGES_ATTACK);
  }

  /**
   * Spielt die Todesanimation des Objekts ab und leitet nach deren Ende
   * die Entfernung des Objekts sowie die Anzeige des Victory-Screens ein.
   *
   * Die Animation läuft basierend auf der Anzahl der Bilder in `IMAGES_DEAD`,
   * wobei jedes Frame 200 ms angezeigt wird.
   * Nach Abschluss:
   * - wird die Animationswiederholung gestoppt,
   * - das Bewegungs-Frame gecancelt,
   * - das Objekt zur Entfernung markiert,
   * - und der Victory-Screen ausgelöst.
   */
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

  /**
   * Zeigt den Victory-Screen an, wenn ein Sieg erzielt wurde.
   */
  displayVictoryScreen() {
    const ctx = this.findCanvasContext();
    if (!this.victoryImage || !ctx) return;

    const canvas = ctx.canvas;
    const { x, y, width, height } = this.calculateCenteredImageBounds(canvas);

    const draw = () =>
      this.drawVictoryOverlay(ctx, canvas, x, y, width, height);

    const loop = () => {
      if (this.showVictoryScreen) {
        draw();
        requestAnimationFrame(loop);
      }
    };

    loop();

    this.scheduleVictoryScreenEnd();
  }

  /**
   * Berechnet die zentrierte Position und skalierte Größe des Victory-Bildes.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element.
   * @returns {{ x: number, y: number, width: number, height: number }}
   */
  calculateCenteredImageBounds(canvas) {
    const maxWidth = canvas.width * 0.8;
    const maxHeight = canvas.height * 0.8;

    const scale = Math.min(
      maxWidth / this.victoryImage.width,
      maxHeight / this.victoryImage.height,
      1
    );

    const width = this.victoryImage.width * scale;
    const height = this.victoryImage.height * scale;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;

    return { x, y, width, height };
  }

  /**
   * Zeichnet den Victory-Screen mit dunklem Overlay und Bild.
   * @param {CanvasRenderingContext2D} ctx - Der Canvas-Kontext.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element.
   * @param {number} x - X-Position.
   * @param {number} y - Y-Position.
   * @param {number} width - Bildbreite.
   * @param {number} height - Bildhöhe.
   */
  drawVictoryOverlay(ctx, canvas, x, y, width, height) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.victoryImage, x, y, width, height);
  }

  /**
   * Plant das automatische Ausblenden des Victory-Screens und ein Seiten-Reload.
   */
  scheduleVictoryScreenEnd() {
    setTimeout(() => {
      this.showVictoryScreen = false;
      this.reloadPage();
    }, 2000);
  }

  /**
   * Lädt die aktuelle Seite neu.
   * Wird typischerweise verwendet, um das Spiel vollständig zurückzusetzen.
   */
  reloadPage() {
    window.location.reload();
  }

  /**
   * Beendet die aktuelle Spielsitzung und kehrt zum Startbildschirm zurück.
   *
   * - Stoppt aktive Animationen und Intervallfunktionen.
   * - Löscht den Canvas-Inhalt.
   * - Setzt den Startbildschirm-Zustand zurück.
   */
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

  /**
   * Setzt die Anzeigeelemente des Startbildschirms in ihren Ursprungszustand zurück.
   *
   * - Zeigt den Start-Button.
   * - Blendet das Steuerungsbild aus.
   * - Ruft ggf. die globale `showStartScreen()`-Funktion auf.
   */
  resetToOriginalStartScreen() {
    const startButton = document.getElementById("startButton");
    const controlsImage = document.getElementById("controlsImage");

    if (startButton) startButton.style.display = "block";
    if (controlsImage) controlsImage.style.display = "none";

    if (typeof showStartScreen === "function") showStartScreen();
  }

  /**
   * Reagiert auf einen Treffer durch den Spieler.
   * Führt Energieverlust, Sound, visuelle Effekte und ggf. Tod aus.
   */
  hit() {
    if (this.isDead || !this.canBeHit()) return;

    this.registerHit();
    this.updateEnergy();
    this.notifyWorld();
    this.playHurtSound();
    this.evaluateDeathOrHurt();
  }

  /**
   * Prüft, ob der Endboss aktuell getroffen werden darf.
   * @returns {boolean}
   */
  canBeHit() {
    const currentTime = Date.now();
    return currentTime - this.lastHitTime >= this.hitCooldown;
  }

  /**
   * Aktualisiert den Zeitpunkt des letzten Treffers und erhöht den Zähler.
   */
  registerHit() {
    this.lastHitTime = Date.now();
    this.hitCounter++;
  }

  /**
   * Reduziert die Energie basierend auf der Anzahl der erlittenen Treffer.
   */
  updateEnergy() {
    this.energy = Math.max(0, 100 - this.hitCounter * 20);
  }

  /**
   * Informiert die Welt (z. B. HUD oder Spiellogik) über den neuen Energiezustand.
   */
  notifyWorld() {
    if (this.worldReference?.registerEndbossHit) {
      this.worldReference.registerEndbossHit(this.energy);
    }
  }

  /**
   * Spielt das Treffer-Geräusch ab.
   */
  playHurtSound() {
    const hurtSound = new Audio("audio/hurt-endboss.mp4");
    hurtSound.volume = 0.6;
    hurtSound.currentTime = 0;

    hurtSound
      .play()
      .catch((e) =>
        console.warn("Endboss-Hurt-Sound konnte nicht abgespielt werden:", e)
      );
  }

  /**
   * Prüft, ob der Endboss tot ist – und löst ggf. Tod oder Schmerzreaktion aus.
   */
  evaluateDeathOrHurt() {
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

  /**
   * Spielt eine Bild-Animation ab, indem nacheinander die Bilder im `images`-Array durchlaufen werden.
   *
   * @param {string[]} images - Ein Array von Bildpfaden oder Bild-URLs für die Animation.
   */
  playAnimation(images) {
    if (this.currentFrameIndex >= images.length) {
      this.currentFrameIndex = 0;
    }

    this.loadImage(images[this.currentFrameIndex]);
    this.currentFrameIndex++;
  }

  /**
   * Sucht und gibt den aktuellen 2D-Canvas-Kontext zurück.
   *
   * Die Methode sucht nach möglichen Quellen in folgender Reihenfolge:
   * - `world.ctx`
   * - `window.canvas`
   * - erstem `<canvas>`-Element im DOM
   * - `window.ctx`
   *
   * Gibt `null` zurück, wenn kein Kontext gefunden wird.
   *
   * @returns {CanvasRenderingContext2D|null} - Der gefundene Zeichenkontext oder `null`, falls nicht verfügbar.
   */
  findCanvasContext() {
    if (typeof world !== "undefined" && world?.ctx) return world.ctx;
    if (window.canvas?.getContext) return window.canvas.getContext("2d");
    if (document.querySelector("canvas"))
      return document.querySelector("canvas").getContext("2d");
    if (window.ctx) return window.ctx;

    console.error("Kein Canvas Context gefunden!");
    return null;
  }

  /**
   * Gibt die aktuelle Trefferbox (Hitbox) des Objekts zurück.
   * Diese wird z. B. für Kollisionsprüfungen verwendet.
   *
   * @returns {{x: number, y: number, width: number, height: number}} - Die Hitbox des Objekts.
   */
  getHitbox() {
    return {
      x: this.x + 50,
      y: this.y + 120,
      width: this.width - 80,
      height: this.height - 150,
    };
  }

  /**
   * Startet das Spiel neu und setzt die Anzeige auf den Startbildschirm zurück.
   * - Stoppt Animationen und Bewegungs-Frames.
   * - Räumt globale Intervallfunktionen auf.
   * - Blendet UI-Elemente ein/aus.
   */
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

  /**
   * Zeigt den Startbildschirm des Spiels auf dem Canvas an.
   * Lädt dazu ein Startbild und zeichnet es zentriert in das Canvas.
   */
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
