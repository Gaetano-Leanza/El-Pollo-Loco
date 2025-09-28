/**
 * Input handler class that tracks the state of keyboard keys and touch/mouse button presses.
 * Maintains boolean flags for all supported input methods including WASD keys and mobile touch controls.
 * Used by game objects to check input states for movement, jumping, and actions.
 */
class Keyboard {
    /**
     * Left arrow key or 'A' key pressed state.
     * @type {boolean}
     * @default false
     */
    LEFT = false;

    /**
     * Right arrow key or 'D' key pressed state.
     * @type {boolean}
     * @default false
     */
    RIGHT = false;

    /**
     * Down arrow key or 'S' key pressed state.
     * @type {boolean}
     * @default false
     */
    DOWN = false;

    /**
     * Spacebar key pressed state (for jumping).
     * @type {boolean}
     * @default false
     */
    SPACE = false;

    /**
     * 'D' key pressed state (for throwing objects).
     * @type {boolean}
     * @default false
     */
    D = false;

    /**
     * Touch/mobile jump button pressed state.
     * Provides mobile alternative to keyboard jump input.
     * @type {boolean}
     * @default false
     */
    jumpButtonPressed = false;

    /**
     * Touch/mobile left movement button pressed state.
     * Provides mobile alternative to keyboard left input.
     * @type {boolean}
     * @default false
     */
    leftButtonPressed = false;

    /**
     * Touch/mobile right movement button pressed state.
     * Provides mobile alternative to keyboard right input.
     * @type {boolean}
     * @default false
     */
    rightButtonPressed = false;

    /**
     * Touch/mobile throw button pressed state.
     * Provides mobile alternative to keyboard throw input.
     * @type {boolean}
     * @default false
     */
    throwButtonPressed = false;
}
