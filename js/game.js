// Globale Variablen
let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;
let muteInitialized = false;
const soundCache = {}; // Sound-Dateien werden hier zwischengespeichert

/**
 * Initialisierung beim Start
 */
document.addEventListener("DOMContentLoaded", () => {
  loadMuteState();
});

/**
 * Initialisiert die Spielwelt, das Canvas, die Tastatur und Touch-Steuerung.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  initTouchControls();
  initKeyboardListeners();
  initMuteSystem();
}

/**
 * Spielt einen Sound ab, sofern nicht stummgeschaltet. Nutzt Caching.
 * Unterstützt gleichzeitige Wiedergabe durch cloneNode + muting.
 */
function playSound(soundFile) {
  const fullPath = soundFile.startsWith('sounds/') ? soundFile : `sounds/${soundFile}`;

  if (!soundCache[fullPath]) {
    const audio = new Audio(fullPath);
    audio.preload = 'auto';
    soundCache[fullPath] = audio;
  }

  const sound = soundCache[fullPath].cloneNode(); // Für gleichzeitige Wiedergabe
  sound.muted = isMuted; // WICHTIG: Sound stummschalten, falls nötig
  sound.volume = 1;      // Optional: Lautstärke setzen (zwischen 0 und 1)
  sound.play().catch((e) => {
    if (e.name !== "AbortError") console.warn("Sound error:", e);
  });
}

/**
 * Initialisiert das Mute-System
 */
function initMuteSystem() {
  if (muteInitialized) return;
  muteInitialized = true;

  loadMuteState();
  updateMuteUI();
}

/**
 * Lädt den gespeicherten Mute-Status aus dem localStorage
 */
function loadMuteState() {
  try {
    const saved = localStorage.getItem('gameMuted');
    isMuted = saved === 'true';
    console.log("Mute state loaded:", isMuted);
  } catch (e) {
    console.warn("LocalStorage error:", e);
    isMuted = false;
  }
}

/**
 * Schaltet den Mute-Status um und speichert ihn
 */
function toggleMute() {
  isMuted = !isMuted;
  console.log("Mute toggled to:", isMuted);

  try {
    localStorage.setItem('gameMuted', isMuted.toString());
  } catch (e) {
    console.warn("Could not save mute state:", e);
  }

  updateMuteUI();
}

/**
 * Aktualisiert die Mute-Button UI
 */
function updateMuteUI() {
  const btn = document.getElementById('muteButton');
  if (btn) {
    btn.innerHTML = isMuted ? '🔇 Ton an' : '🔊 Ton aus';
    btn.style.opacity = isMuted ? '0.6' : '1';
    btn.title = isMuted ? "Sound einschalten" : "Sound stummschalten";
  }

  const muteIcon = document.getElementById("muteIcon");
  if (muteIcon) {
    muteIcon.textContent = isMuted ? "🔇" : "🔊";
  }
}

// Event Listener für Mute Button
window.addEventListener('load', () => {
  const muteButton = document.getElementById('muteButton');
  if (muteButton) {
    muteButton.addEventListener('click', toggleMute);
  }

  updateMuteUI();
  console.log("Initial mute state:", isMuted);
});


// Startscreen & Game-Logik
function showStartScreen() {
  if (world) resetGame();
  canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  drawStartImage(ctx);
}

function drawStartImage(ctx) {
  const startImage = new Image();
  startImage.src = "../img/9_intro_outro_screens/start/startscreen_1.png";
  startImage.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
  };
}

function startGame() {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("gamerulesButton").style.display = "none";
  document.getElementById("controlsImage").style.display = "block";
  init();
}

function resetGame() {
  if (world && world.clearAllIntervals) {
    world.clearAllIntervals();
  }
  world = null;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  keyboard = new Keyboard();
}

// Keyboard Listeners
function initKeyboardListeners() {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}

function handleKeyDown(e) {
  switch (e.keyCode) {
    case 39: keyboard.RIGHT = true; break;
    case 37: keyboard.LEFT = true; break;
    case 38: keyboard.UP = true; break;
    case 40: keyboard.DOWN = true; break;
    case 32: keyboard.SPACE = true; break;
    case 68: keyboard.D = true; break;
    case 70: toggleFullscreen(canvas); break;
    case 77: toggleMute(); break; // M-Taste für Mute
  }
}

function handleKeyUp(e) {
  switch (e.keyCode) {
    case 39: keyboard.RIGHT = false; break;
    case 37: keyboard.LEFT = false; break;
    case 38: keyboard.UP = false; break;
    case 40: keyboard.DOWN = false; break;
    case 32: keyboard.SPACE = false; break;
    case 68: keyboard.D = false; break;
  }
}

// Fullscreen
function toggleFullscreen(element) {
  if (!document.fullscreenElement) {
    element.requestFullscreen()
      .catch((err) => alert(`Vollbildmodus konnte nicht aktiviert werden: ${err.message}`));
  } else {
    document.exitFullscreen();
  }
}

// Touch Controls
function initTouchControls() {
  const buttons = getTouchButtons();
  if (!buttons) return;
  addTouchEventListeners(buttons);
}

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

// Resize Events
window.addEventListener("resize", () => {
  if (canvas && world && world.resize) {
    world.resize();
  }
});

document.addEventListener("fullscreenchange", () => {
  if (canvas && world && world.resize) {
    world.resize();
  }
});
