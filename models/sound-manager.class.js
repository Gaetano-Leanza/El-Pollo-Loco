/**
 * Singleton class that manages all audio playback in the game.
 * Handles sound effects, background music, looping audio, volume control, and mute functionality.
 * Provides centralized audio management with error handling and UI integration.
 */
class SoundManager {
  /**
   * Singleton instance reference to ensure only one SoundManager exists.
   * @type {SoundManager}
   * @static
   */
  static instance;

  /**
   * Collection of all game audio files with their respective volume settings.
   * Each entry contains an Audio object and volume level.
   * @type {Object.<string, {audio: Audio, volume: number}>}
   */
  sounds = {};

  /**
   * Global mute state flag controlling all audio playback.
   * @type {boolean}
   * @default false
   */
  isMuted = false;

  /**
   * Reference to the game world object.
   * @type {World}
   */
  world;

  /**
   * Creates or returns the singleton SoundManager instance.
   * Initializes all game sounds with appropriate volume levels and loop settings.
   */
  constructor() {
    if (SoundManager.instance) {
      return SoundManager.instance;
    }
    SoundManager.instance = this;

    // sounds and volumes
    this.sounds = {
      background: { audio: new Audio("audio/background.mp3"), volume: 0.3 },
      coin: { audio: new Audio("audio/collect-coin-2.mp3"), volume: 0.1 },
      running: { audio: new Audio("audio/running.mp3"), volume: 1.0 },
      hit: { audio: new Audio("audio/hit.mp3"), volume: 0.2 },
      damage: { audio: new Audio("audio/damage-2.mp3"), volume: 0.02 },
      jump: { audio: new Audio("audio/jump-2.mp3"), volume: 0.03 },
      throw: { audio: new Audio("audio/throw.mp3"), volume: 0.03 },
      bottle: { audio: new Audio("audio/collect-bottle-1.mp3"), volume: 0.05 },
      bottle_break: { audio: new Audio("audio/bottle-break.mp3"), volume: 0.5 },
      gameOver: { audio: new Audio("audio/game-over.mp3"), volume: 1.0 },
      win: { audio: new Audio("audio/winning.mp3"), volume: 1.0 },
      endboss_hit: { audio: new Audio("audio/chicken-alarm.mp3"), volume: 1.0 },
      chicken: { audio: new Audio("audio/chicken.mp3"), volume: 0.05 },
      chicken_small: {
        audio: new Audio("audio/chickenSmall.mp3"),
        volume: 0.05,
      },
      snoring: { audio: new Audio("audio/snoring.mp3"), volume: 0.1 },
      suspense: { audio: new Audio("audio/endboss-music.mp3"), volume: 1.0 },
    };

    this.sounds.background.audio.loop = true;
    this.sounds.background.audio.volume = this.sounds.background.volume;
    this.sounds.background.audio.play();
    this.sounds.suspense.audio.loop = true;
    this.sounds.chicken.audio.loop = true;

    this.sounds.chicken_small.audio.loop = true;
  }

  /**
   * Plays background music with looping enabled.
   * Respects the global mute state.
   * @param {string} soundName - Name of the background sound to play
   */
  playBackground(soundName) {
    const sound = this.sounds[soundName];
    if (sound && !this.isMuted) {
      sound.audio.play();
    }
  }

  /**
   * Pauses a specific sound by name.
   * Does not respect mute state - always pauses when called.
   * @param {string} soundName - Name of the sound to pause
   */
  pause(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.audio.pause();
    }
  }

  /**
   * Plays a sound effect with volume control and restart capability.
   * Automatically restarts sound if already playing and respects mute state.
   * Includes error handling for audio playback issues.
   * @param {string} soundName - Name of the sound to play
   */
  play(soundName) {
    const sound = this.sounds[soundName];
    if (sound && !this.isMuted) {
      if (!sound.audio.paused) {
        sound.audio.currentTime = 0;
      }
      sound.audio.volume = sound.volume;
      sound.audio.play().catch((error) => {
        console.error(`Error playing sound`, error);
      });
    }
  }

  /**
   * Immediately pauses all sounds in the game.
   * Used for emergency stops or when switching to mute state.
   */
  pauseAll() {
    Object.values(this.sounds).forEach((sound) => sound.audio.pause());
  }

  /**
   * Toggles the global mute state and updates the UI mute button.
   * When unmuting, automatically restarts background music.
   * Updates the mute button icon to reflect current state.
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    const toggleButton = document.getElementById("toggleSounds");
    const imgElement = toggleButton.querySelector("img");

    imgElement.src = this.isMuted
      ? "img/SVG/volume-off.svg"
      : "img/SVG/volume-on.svg";

    if (this.isMuted) {
      this.pauseAll();
    } else {
      this.playBackground("background");
    }
  }
}
