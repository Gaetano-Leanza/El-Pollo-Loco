/**
 * Main game initialization and control script.
 * Handles UI management, game state transitions, input controls, and device orientation.
 * Manages the complete game lifecycle from startup to gameplay to end screens.
 */

// DOM element references for UI interaction
/**
 * Collection of keyboard key display elements.
 * @type {NodeListOf<Element>}
 */
const imgRef = document.querySelectorAll(".key");

/**
 * Start screen container element.
 * @type {HTMLElement}
 */
const startScreenRef = document.getElementById("start");

/**
 * Help dialog modal element.
 * @type {HTMLDialogElement}
 */
const dialog = document.querySelector("dialog");

/**
 * Close button for the help dialog.
 * @type {HTMLElement}
 */
const closeBtn = document.getElementById("close-btn");

/**
 * Desktop button container element.
 * @type {HTMLElement}
 */
const btnContainer = document.getElementById("btn-container");

/**
 * Mobile button container element.
 * @type {HTMLElement}
 */
const btnContainerMobile = document.getElementById("mobileBtn-container");

/**
 * Collection of all button elements in the UI.
 * @type {NodeListOf<HTMLButtonElement>}
 */
const buttons = document.querySelectorAll("button");

// Global game state variables
/**
 * Array storing all active interval IDs for cleanup purposes.
 * @type {number[]}
 */
let intervalIds = [];

/**
 * Global flag tracking character's facing direction for throwing mechanics.
 * @type {boolean}
 */
otherDirectionCharacter = false;

/**
 * Flag tracking fullscreen state.
 * @type {boolean}
 * @default false
 */
let fullscreen_on = false;

/**
 * Flag indicating if the game is currently running.
 * @type {boolean}
 * @default false
 */
let gameStarted = false;

/**
 * HTML5 Canvas element for game rendering.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Main game world instance managing all game objects and logic.
 * @type {World}
 */
let world;

/**
 * Input handler instance tracking keyboard and touch input states.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Audio manager instance handling all game sounds and music.
 * @type {SoundManager}
 */
let soundManager;

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);

/**
 * Initializes the application when the page loads.
 * Sets up input controls and device orientation handling.
 */
function initializeApp() {
  initializeMobileControls();
  initializeKeyboardControls();
  addOrientationListeners();
}

/**
 * Creates a stoppable interval that can be cleared during game reset.
 * Automatically tracks interval ID for cleanup purposes.
 * @param {Function} fn - Function to execute at each interval
 * @param {number} time - Interval duration in milliseconds
 * @returns {number} The interval ID
 */
function setStoppableInterval(fn, time) {
  let id = setInterval(fn, time);
  intervalIds.push(id);
  return id;
}

/**
 * Stops the game by resetting intervals and pausing all audio.
 * Safely terminates all game processes and resets state flags.
 */
function stopGame() {
  gameStarted = false;
  resetIntervals();
  soundManager.pauseAll();
}

/**
 * Clears all registered intervals to prevent memory leaks.
 * Essential for proper game cleanup and restart functionality.
 */
function resetIntervals() {
  intervalIds.forEach(clearInterval);
  intervalIds = [];
}

/**
 * Restarts the game by cleaning up previous session and starting fresh.
 * Ensures proper state reset between game sessions.
 */
function restartGame() {
  resetIntervals();
  startGame();
}

/**
 * Shows the loading spinner during game initialization.
 */
function showLoadingSpinner() {
  toggleVisibility("spinner", true);
}

/**
 * Hides the loading spinner after game loads.
 */
function hideLoadingSpinner() {
  toggleVisibility("spinner", false);
}

/**
 * Initializes and starts a new game session.
 * Creates all necessary game objects and transitions to game screen.
 */
async function startGame() {
  // Verhindere mehrfaches Klicken
  if (gameStarted) return;

  const startButton = event?.target;
  if (startButton) {
    startButton.disabled = true;
    startButton.textContent = "Lädt...";
  }

  try {
    initLevel();
    canvas = document.getElementById("canvas");

    // Kurz warten für Canvas-Initialisierung
    await new Promise((resolve) => setTimeout(resolve, 10));

    soundManager = new SoundManager();
    world = new World(canvas, keyboard);
    showGameScreen();
    gameStarted = true;
    toggleButtonContainer();
  } catch (error) {
    console.error("Fehler beim Starten:", error);
    gameStarted = false;
  } finally {
    if (startButton) {
      startButton.disabled = false;
      startButton.textContent = "Starten";
    }
  }
}

/**
 * Opens the help dialog modal on the start screen.
 * Provides game instructions and controls information.
 */
function openDialog() {
  onclick = "window.location.href='gameRules.html'";
}

/**
 * Closes the help dialog modal and removes background overlay.
 */
function dialogClose() {
  dialog.close();
  dialog.classList.remove("bg");
}

const toggleButton = document.getElementById("toggleSounds");

toggleButton.addEventListener("click", toggleVolume);
toggleButton.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "Enter") {
    e.preventDefault(); // verhindert doppeltes Auslösen
    toggleVolume();
  }
});

function toggleVolume() {
  soundManager.toggleMute();

  // Bild im Button aktualisieren
  const img = toggleButton.querySelector("img");
  if (img) {
    img.src = soundManager.isMuted
      ? "img/SVG/volume-off.svg"
      : "img/SVG/volume-on.svg";
  }

  // Fokus entfernen, damit Leertaste danach nicht erneut auslöst
  toggleButton.blur();

  // Falls Sound wieder an, Enemy-Sounds starten
  if (!soundManager.isMuted && world) {
    world.playSoundsOfEnemies();
  }
}

/**
 * Updates keyboard key display to show pressed/unpressed states.
 * Provides visual feedback for keyboard input on desktop.
 * @param {string} img - CSS class index for default key image
 * @param {string} img_active - CSS class index for pressed key image
 */
function toggleDisplay(img, img_active) {
  imgRef[img].classList.add("d_none");
  imgRef[img_active].classList.remove("d_none");
}

/**
 * Toggles fullscreen mode and updates the fullscreen button icon.
 * Handles cross-browser fullscreen API compatibility.
 */
function toggleFullscreen() {
  const fullscreen = document.getElementById("fullscreen");
  if (!fullscreen_on) {
    enterFullscreen(fullscreen);
    this.src = "img/SVG/resize-1.svg";
    fullscreen_on = true;
  } else {
    exitFullscreen(fullscreen);
    this.src = "img/SVG/resize-2.svg";
    fullscreen_on = false;
  }
}

/**
 * Enters fullscreen mode with cross-browser compatibility.
 * @param {HTMLElement} element - Element to make fullscreen
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

/**
 * Exits fullscreen mode with cross-browser compatibility.
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Controls the visibility of UI elements by toggling display styles.
 * @param {string} elementId - ID of the element to show/hide
 * @param {boolean} isVisible - Whether element should be visible
 */
function toggleVisibility(elementId, isVisible) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = isVisible ? "flex" : "none";
  }
}

/**
 * Transitions UI to show the main game screen.
 * Hides all menus and shows game canvas with controls.
 */
function showGameScreen() {
  toggleVisibility("fullscreen", true);
  toggleVisibility("start", false);
  toggleVisibility("game-over-screen", false);
  toggleVisibility("win-screen", false);
}

/**
 * Transitions UI to show the start/menu screen.
 * Hides game and end screens, shows main menu.
 */
function showStartScreen() {
  toggleVisibility("start", true);
  toggleVisibility("fullscreen", false);
  toggleVisibility("game-over-screen", false);
  toggleVisibility("win-screen", false);
}

/**
 * Displays the game over screen and plays defeat music.
 * Called when player character dies.
 */
function showGameoverScreen() {
  toggleVisibility("game-over-screen", true);
  soundManager.play("gameOver");
}

/**
 * Hides the game over screen.
 * Used when transitioning back to other screens.
 */
function hideGameOverScreen() {
  toggleVisibility("game-over-screen", false);
}

/**
 * Displays the victory screen and plays winning music.
 * Called when player completes all objectives.
 */
function showWinningScreen() {
  toggleVisibility("win-screen", true);
  soundManager.play("win");
}

/**
 * Hides the victory screen.
 * Used when transitioning back to other screens.
 */
function hideWinningScreen() {
  toggleVisibility("win-screen", false);
}

/**
 * Shows device orientation message and hides main content.
 * Prompts mobile users to rotate device to landscape mode.
 */
function showRotateMessage() {
  toggleVisibility("orientationMessage", true);
  toggleVisibility("canvas-container", false);
}

/**
 * Hides orientation message and shows main game content.
 * Called when device is in proper landscape orientation.
 */
function showMainContent() {
  toggleVisibility("orientationMessage", false);
  toggleVisibility("canvas-container", true);
}

/**
 * Checks current device orientation and shows appropriate content.
 * Ensures game is only playable in landscape mode on mobile devices.
 */
function checkOrientation() {
  window.innerHeight > window.innerWidth
    ? showRotateMessage()
    : showMainContent();
}

/**
 * Sets up orientation change listeners for mobile devices.
 * Monitors screen rotation and window resize events.
 */
function addOrientationListeners() {
  checkOrientation();
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
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
