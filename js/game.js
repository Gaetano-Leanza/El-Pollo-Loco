let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  initTouchControls();
  console.log("Spielwelt initialisiert");
}

function showStartScreen() {
  if (world) resetGame();

  canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const startImage = new Image();
  startImage.src = "../img/9_intro_outro_screens/start/startscreen_1.png";

  startImage.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
  };

  console.log("Startbildschirm wird angezeigt");
}

function startGame() {
  console.log("Spiel wird gestartet...");
  document.getElementById("startButton").style.display = "none";
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

  console.log("Spiel wurde vollständig zurückgesetzt");
}

window.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39: keyboard.RIGHT = true; break;
    case 37: keyboard.LEFT = true; break;
    case 38: keyboard.UP = true; break;
    case 40: keyboard.DOWN = true; break;
    case 32: keyboard.SPACE = true; break;
    case 68: keyboard.D = true; break;
    case 70: toggleFullscreen(canvas); break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.keyCode) {
    case 39: keyboard.RIGHT = false; break;
    case 37: keyboard.LEFT = false; break;
    case 38: keyboard.UP = false; break;
    case 40: keyboard.DOWN = false; break;
    case 32: keyboard.SPACE = false; break;
    case 68: keyboard.D = false; break;
  }
});

function toggleFullscreen(element) {
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch(err =>
      alert(`Vollbildmodus konnte nicht aktiviert werden: ${err.message}`)
    );
  } else {
    document.exitFullscreen();
  }
}

function initTouchControls() {
  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');
  const jumpBtn = document.getElementById('jumpBtn');
  const throwBtn = document.getElementById('throwBtn');

  if (!(leftBtn && rightBtn && jumpBtn && throwBtn)) {
    console.warn("Touch-Buttons nicht gefunden");
    return;
  }

  [
    { btn: leftBtn, key: 'LEFT' },
    { btn: rightBtn, key: 'RIGHT' },
    { btn: jumpBtn, key: 'SPACE' },
    { btn: throwBtn, key: 'D' }
  ].forEach(({ btn, key }) => {
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      keyboard[key] = true;
    });

    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
  });

  console.log("Touch-Controls initialisiert");
}

window.addEventListener("resize", () => {
  if (canvas) {
    console.log("Fenstergröße geändert – Canvas bleibt responsiv.");
  }
});

document.addEventListener("fullscreenchange", () => {
  console.log("Vollbildmodus geändert");
  if (canvas && world && world.resize) {
    world.resize(); 
  }
});
