/**
 * Canvas-Element für die Spielfläche.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Instanz der Spielwelt.
 * @type {World}
 */
let world;

/**
 * Instanz des Tastatur-Status-Handlers.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Status, ob der Sound stummgeschaltet ist.
 * @type {boolean}
 */
let isMuted = false;

/**
 * Flag, ob das Mute-System bereits initialisiert wurde.
 * @type {boolean}
 */
let muteInitialized = false;

/**
 * Cache für geladene Audiodateien, um mehrfaches Laden zu vermeiden.
 * @type {Object.<string, HTMLAudioElement>}
 */
const soundCache = {};

/**
 * Event-Listener für das Laden der Seite, um den Mute-Zustand zu laden und das Mute-System zu initialisieren.
 * @event
 */
document.addEventListener("DOMContentLoaded", () => {
  loadMuteState();
  initMuteSystem();
});

/**
 * Initialisiert das Canvas, die Spielwelt, die Tastatur und die Touch-Steuerung.
 * Muss beim Start des Spiels aufgerufen werden.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  initTouchControls();
  initKeyboardListeners();
}

/**
 * Spielt einen Sound ab, sofern der Sound nicht stummgeschaltet ist.
 * Nutzt einen Cache, um Sounds nicht mehrfach zu laden.
 * Erstellt eine Kopie des Audio-Elements, um gleichzeitiges Abspielen mehrerer Instanzen zu ermöglichen.
 *
 * @param {string} soundFile - Pfad zur Audiodatei oder Dateiname im Ordner "sounds".
 */
function playSound(soundFile) {
  const fullPath = soundFile.startsWith("sounds/")
    ? soundFile
    : `sounds/${soundFile}`;

  if (!soundCache[fullPath]) {
    const audio = new Audio(fullPath);
    audio.preload = "auto";
    soundCache[fullPath] = audio;
  }

  const sound = soundCache[fullPath].cloneNode();
  sound.muted = isMuted;
  sound.volume = 1;
  sound.play().catch((e) => {
    if (e.name !== "AbortError") console.warn("Sound error:", e);
  });
}

/**
 * Lädt den gespeicherten Mute-Zustand aus dem localStorage.
 * Setzt den globalen isMuted-Status entsprechend.
 */
function loadMuteState() {
  const savedMute = localStorage.getItem("gameMuted");
  isMuted = savedMute === "true"; // Nur wenn explizit 'true' gespeichert ist
  console.log("Mute state loaded:", isMuted);
}

/**
 * Initialisiert das Mute-System:
 * Bindet den Mute-Button an die Umschaltfunktion und sorgt für korrekte Bedienbarkeit.
 * Führt die Initialisierung nur einmal aus.
 */
function initMuteSystem() {
  if (muteInitialized) return;

  const muteButton = document.getElementById("muteButton");
  const muteButtonMobile = document.getElementById("muteButtonMobile");

  if (muteButton) {
    const newButton = muteButton.cloneNode(true);
    muteButton.parentNode.replaceChild(newButton, muteButton);
    newButton.addEventListener("click", toggleMute);
    newButton.addEventListener("keydown", (e) => {
      if (["Enter", "Space", " "].includes(e.key)) {
        e.preventDefault();
      }
    });
  }

  if (muteButtonMobile) {
    const newButtonMobile = muteButtonMobile.cloneNode(true);
    muteButtonMobile.parentNode.replaceChild(newButtonMobile, muteButtonMobile);
    newButtonMobile.addEventListener("click", toggleMute);
    newButtonMobile.addEventListener("keydown", (e) => {
      if (["Enter", "Space", " "].includes(e.key)) {
        e.preventDefault();
      }
    });
  }

  muteInitialized = true;
  updateMuteUI();
}

/**
 * Schaltet den Mute-Status um, speichert den neuen Zustand und aktualisiert die UI.
 * Alle vorhandenen Sound-Objekte werden entsprechend stummgeschaltet oder aktiviert.
 */
function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem("gameMuted", isMuted.toString());
  updateMuteUI();

  Object.values(soundCache).forEach((sound) => {
    sound.muted = isMuted;
  });
}

/**
 * Aktualisiert die Darstellung des Mute-Buttons und ggf. Icons im UI.
 * Ändert Text, Tooltip und Stil abhängig vom aktuellen Mute-Status.
 */
function updateMuteUI() {
  const desktopBtn = document.getElementById("muteButton");
  const mobileBtn = document.getElementById("muteButtonMobile");

  if (desktopBtn) {
    desktopBtn.innerHTML = isMuted ? "🔇 Ton an" : "🔊 Ton aus";
    desktopBtn.style.opacity = isMuted ? "0.6" : "1";
    desktopBtn.title = isMuted ? "Sound einschalten" : "Sound stummschalten";
  }

  if (mobileBtn) {
    mobileBtn.textContent = isMuted ? "🔇" : "🔊";
    mobileBtn.style.opacity = isMuted ? "0.6" : "1";
    mobileBtn.title = isMuted ? "Sound einschalten" : "Sound stummschalten";
  }
}

/**
 * Zeigt den Startbildschirm an und zeichnet das Startbild auf das Canvas.
 * Setzt das Spiel ggf. zurück.
 */
function showStartScreen() {
  if (world) resetGame();
  canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  drawStartImage(ctx);
}

/**
 * Zeichnet das Startbild auf das übergebene Canvas-Rendering-Kontext-Objekt.
 *
 * @param {CanvasRenderingContext2D} ctx - Kontext des Canvas zum Zeichnen.
 */
function drawStartImage(ctx) {
  const startImage = new Image();
  startImage.src = "../img/9_intro_outro_screens/start/startscreen_1.png";
  startImage.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
  };
}

/**
 * Startet das Spiel:
 * Versteckt Start-Buttons, zeigt Steuerungsbild und initialisiert das Spiel.
 */
function startGame() {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("gamerulesButton").style.display = "none";
  document.getElementById("controlsImage").style.display = "block";
  init();
}

/**
 * Setzt das Spiel zurück:
 * Löscht alle Intervalle, leert die Welt-Instanz, leert das Canvas und initialisiert die Tastatur neu.
 */
function resetGame() {
  if (world && world.clearAllIntervals) {
    world.clearAllIntervals();
  }
  world = null;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  keyboard = new Keyboard();
}

/**
 * Initialisiert Keyboard-Eventlistener für keydown und keyup.
 */
function initKeyboardListeners() {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}

/**
 * Event-Handler für Tastendruck (keydown).
 * Setzt die entsprechenden Tasten-Flags in der Keyboard-Instanz.
 * Unterstützt Pfeiltasten, Leertaste, Taste D und Fullscreen-Toggle (Taste F).
 *
 * @param {KeyboardEvent} e - Das KeyboardEvent-Objekt.
 */
function handleKeyDown(e) {
  switch (e.keyCode) {
    case 39:
      keyboard.RIGHT = true;
      break;
    case 37:
      keyboard.LEFT = true;
      break;
    case 38:
      keyboard.UP = true;
      break;
    case 40:
      keyboard.DOWN = true;
      break;
    case 32:
      keyboard.SPACE = true;
      break;
    case 68:
      keyboard.D = true;
      break;
    case 70:
      toggleFullscreen(canvas);
      break;
  }
}

/**
 * Event-Handler für Tastelöschung (keyup).
 * Setzt die entsprechenden Tasten-Flags in der Keyboard-Instanz zurück.
 *
 * @param {KeyboardEvent} e - Das KeyboardEvent-Objekt.
 */
function handleKeyUp(e) {
  switch (e.keyCode) {
    case 39:
      keyboard.RIGHT = false;
      break;
    case 37:
      keyboard.LEFT = false;
      break;
    case 38:
      keyboard.UP = false;
      break;
    case 40:
      keyboard.DOWN = false;
      break;
    case 32:
      keyboard.SPACE = false;
      break;
    case 68:
      keyboard.D = false;
      break;
  }
}

/**
 * Aktiviert oder deaktiviert den Vollbildmodus für das angegebene Element.
 *
 * @param {HTMLElement} element - Das HTML-Element, das im Vollbildmodus angezeigt werden soll.
 */
function toggleFullscreen(element) {
  if (!document.fullscreenElement) {
    element
      .requestFullscreen()
      .catch((err) =>
        alert(`Vollbildmodus konnte nicht aktiviert werden: ${err.message}`)
      );
  } else {
    document.exitFullscreen();
  }
}

/**
 * Initialisiert die Touch-Steuerung, indem Touch-Eventlistener an die Steuerungs-Buttons gebunden werden.
 */
function initTouchControls() {
  const buttons = getTouchButtons();
  if (!buttons) return;
  addTouchEventListeners(buttons);
}

/**
 * Sammelt die Steuerungs-Buttons für Touch-Eingaben.
 *
 * @returns {Object|null} Objekt mit den Buttons oder null, falls nicht alle gefunden wurden.
 */
function getTouchButtons() {
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");
  const jumpBtn = document.getElementById("jumpBtn");
  const throwBtn = document.getElementById("throwBtn");

  if (!(leftBtn && rightBtn && jumpBtn && throwBtn)) {
    console.warn("Touch-Buttons nicht gefunden");
    return null;
  }

  return { LEFT: leftBtn, RIGHT: rightBtn, SPACE: jumpBtn, D: throwBtn };
}

/**
 * Fügt Touch-Eventlistener an die Steuerungs-Buttons hinzu,
 * um die Keyboard-Flags bei Touchstart und Touchend zu setzen bzw. zurückzusetzen.
 *
 * @param {Object.<string, HTMLElement>} buttons - Objekt mit Tastenbezeichnungen als Schlüssel und Button-Elementen als Werte.
 */
function addTouchEventListeners(buttons) {
  Object.entries(buttons).forEach(([key, btn]) => {
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard[key] = true;
    });
    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
  });
}

/**
 * Event-Handler für das Fenster-Resize-Event.
 * Passt die Spielwelt bei Änderung der Fenstergröße an.
 */
window.addEventListener("resize", () => {
  if (canvas && world && world.resize) {
    world.resize();
  }
});

/**
 * Event-Handler für Änderungen des Vollbildmodus.
 * Passt die Spielwelt an die neue Größe an.
 */
document.addEventListener("fullscreenchange", () => {
  if (canvas && world && world.resize) {
    world.resize();
  }
});
