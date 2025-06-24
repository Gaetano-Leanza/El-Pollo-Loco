let canvas;
let world;
let keyboard = new Keyboard();

/**
 * Initialisiert die Spielwelt, das Canvas, die Tastatur und Touch-Steuerung.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  initTouchControls();
  initKeyboardListeners();
}

/**
 * Zeigt den Startbildschirm an und setzt ggf. das Spiel zurück.
 */
function showStartScreen() {
  if (world) resetGame();

  canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  drawStartImage(ctx);
}

/**
 * Zeichnet das Startbild auf das Canvas.
 * @param {CanvasRenderingContext2D} ctx - Der 2D-Zeichenkontext des Canvas.
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
 * Startet das Spiel, blendet UI-Elemente um und ruft `init()` auf.
 */
function startGame() {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("controlsImage").style.display = "block";
  init();
}

/**
 * Setzt die Spielwelt und das Canvas zurück.
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
 * Initialisiert die Tastatur-Event-Listener für Keydown und Keyup.
 */
function initKeyboardListeners() {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}

/**
 * Verarbeitet gedrückte Tasten und aktualisiert das Keyboard-Objekt.
 * @param {KeyboardEvent} e - Das Keydown-Event.
 */
function handleKeyDown(e) {
  switch (e.keyCode) {
    case 39: keyboard.RIGHT = true; break;
    case 37: keyboard.LEFT = true; break;
    case 38: keyboard.UP = true; break;
    case 40: keyboard.DOWN = true; break;
    case 32: keyboard.SPACE = true; break;
    case 68: keyboard.D = true; break;
    case 70: toggleFullscreen(canvas); break;
  }
}

/**
 * Verarbeitet losgelassene Tasten und aktualisiert das Keyboard-Objekt.
 * @param {KeyboardEvent} e - Das Keyup-Event.
 */
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

/**
 * Schaltet den Vollbildmodus für ein Element um.
 * @param {HTMLElement} element - Das Element, das in den Vollbildmodus versetzt werden soll.
 */
function toggleFullscreen(element) {
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch(err =>
      alert(`Vollbildmodus konnte nicht aktiviert werden: ${err.message}`)
    );
  } else {
    document.exitFullscreen();
  }
}

/**
 * Initialisiert die Touch-Steuerung für mobile Geräte.
 */
function initTouchControls() {
  const buttons = getTouchButtons();
  if (!buttons) return;
  addTouchEventListeners(buttons);
}

/**
 * Holt die Touch-Button-Elemente aus dem DOM.
 * @returns {Object|null} Ein Objekt mit Buttons für LEFT, RIGHT, SPACE, D oder null bei Fehler.
 */
function getTouchButtons() {
  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');
  const jumpBtn = document.getElementById('jumpBtn');
  const throwBtn = document.getElementById('throwBtn');

  if (!(leftBtn && rightBtn && jumpBtn && throwBtn)) {
    console.warn("Touch-Buttons nicht gefunden");
    return null;
  }

  return {
    LEFT: leftBtn,
    RIGHT: rightBtn,
    SPACE: jumpBtn,
    D: throwBtn
  };
}

/**
 * Fügt Touch-Event-Listener für alle übergebenen Buttons hinzu.
 * @param {Object} buttons - Ein Objekt mit Touch-Buttons für LEFT, RIGHT, SPACE, D.
 */
function addTouchEventListeners(buttons) {
  Object.entries(buttons).forEach(([key, btn]) => {
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      keyboard[key] = true;
    });

    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
  });
}

/**
 * Passt das Canvas an, wenn die Fenstergröße geändert wird.
 */
window.addEventListener("resize", () => {
  if (canvas && world && world.resize) {
    world.resize();
  }
});

/**
 * Reagiert auf Änderungen des Vollbildmodus und passt ggf. das Canvas an.
 */
document.addEventListener("fullscreenchange", () => {
  if (canvas && world && world.resize) {
    world.resize(); 
  }
});
