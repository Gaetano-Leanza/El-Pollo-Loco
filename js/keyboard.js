// Mobile touch buttons for controlling player input
const mobileControls = {
  /** Start jump action */
  startJumping: () => (world.keyboard.jumpButtonPressed = true),

  /** Start throwing action */
  startThrowing: () => (world.keyboard.throwButtonPressed = true),

  /** Start moving left */
  startMovingLeft: () => (world.keyboard.leftButtonPressed = true),

  /** Stop moving left */
  stopMovingLeft: () => (world.keyboard.leftButtonPressed = false),

  /** Start moving right */
  startMovingRight: () => (world.keyboard.rightButtonPressed = true),

  /** Stop moving right */
  stopMovingRight: () => (world.keyboard.rightButtonPressed = false),
};

/**
 * Adds touch event listeners (touchstart and touchend) to a mobile control button.
 * The button must have `data-start` and `data-stop` attributes that map to
 * functions inside `mobileControls`.
 *
 * @param {HTMLElement} button - The button element to attach listeners to.
 */
function addTouchListeners(button) {
  const startAction = button.dataset.start;
  const stopAction = button.dataset.stop;
  button.addEventListener("touchstart", (event) =>
    handleTouch(event, startAction)
  );
  button.addEventListener("touchend", (event) =>
    handleTouch(event, stopAction)
  );
}

/**
 * Handles a touch event and triggers the corresponding control action.
 *
 * @param {TouchEvent} event - The touch event object.
 * @param {string} actionName - The name of the control action in `mobileControls`.
 */
function handleTouch(event, actionName) {
  event.preventDefault();
  if (actionName && typeof mobileControls[actionName] === "function") {
    mobileControls[actionName]();
  }
}

/**
 * Toggles visibility of the mobile button container depending on screen width.
 * The container is only visible if the game has started and the window width
 * is below 1400px.
 *
 * @returns {void}
 */
function toggleButtonContainer() {
  const container = document.getElementById("mobileBtn-container");

  if (!gameStarted) return;
  container.style.display = window.innerWidth < 1400 ? "flex" : "none";
}

/**
 * Initializes mobile controls by:
 * - Attaching touch listeners to all control buttons
 * - Running an initial visibility check
 * - Adding a resize listener to re-check button visibility
 *
 * @returns {void}
 */
function initializeMobileControls() {
  const buttons = document.querySelectorAll("#mobileBtn-container button");
  buttons.forEach((button) => addTouchListeners(button)); // Add touch listeners
  toggleButtonContainer(); // Initial visibility check
  window.addEventListener("resize", toggleButtonContainer); // Re-check on resize
}

/**
 * Initializes keyboard controls by attaching `keydown` and `keyup` listeners.
 *
 * @returns {void}
 */
function initializeKeyboardControls() {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}

/**
 * Handles keydown events and sets the appropriate flags on the keyboard object.
 * Also triggers UI updates via `toggleDisplay`.
 *
 * @param {KeyboardEvent} event - The keydown event object.
 * @returns {void}
 */
function handleKeyDown(event) {
  if (event.key == "ArrowRight") {
    keyboard.RIGHT = true;
    toggleDisplay(5, 6);
  }
  if (event.key == "ArrowLeft") {
    keyboard.LEFT = true;
    toggleDisplay(2, 3);
  }
  if (event.key == "ArrowDown") {
    keyboard.DOWN = true;
  }
  if (event.key == " ") {
    keyboard.SPACE = true;
    toggleDisplay(0, 1);
  }
  if (event.key == "d") {
    keyboard.D = true;
    toggleDisplay(7, 8);
  }
}

/**
 * Handles keyup events and resets the appropriate flags on the keyboard object.
 * Also triggers reverse UI updates via `toggleDisplay`.
 *
 * @param {KeyboardEvent} event - The keyup event object.
 * @returns {void}
 */
function handleKeyUp(event) {
  if (event.key == "ArrowRight") {
    keyboard.RIGHT = false;
    toggleDisplay(6, 5);
  }
  if (event.key == "ArrowLeft") {
    keyboard.LEFT = false;
    toggleDisplay(3, 2);
  }
  if (event.key == "ArrowDown") {
    keyboard.DOWN = false;
  }
  if (event.key == " ") {
    keyboard.SPACE = false;
    toggleDisplay(1, 0); // Reverse animation
  }
  if (event.key == "d") {
    keyboard.D = false;
    toggleDisplay(8, 7);
  }
}
