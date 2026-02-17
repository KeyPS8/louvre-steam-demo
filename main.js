const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameStarted = false;
let score = 0;
let teamName = "";

let player = { x: 500, y: 400, size: 15, speed: 2 };
let camera = { x: 0, y: 0 };

// Guardamos teclas por "code" (más estable que e.key)
let keys = {};

let suspects = ["gardien", "touriste", "restaurateur"];
let culprit = suspects[Math.floor(Math.random() * suspects.length)];

// Pantalla "Press Any Key" -> muestra menú
document.addEventListener(
  "keydown",
  () => {
    document.getElementById("pressKey").style.display = "none";
    document.getElementById("menu").style.display = "flex";
  },
  { once: true }
);

// Input del juego (captura flechas y evita que el navegador las use)
document.addEventListener(
  "keydown",
  (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
      e.preventDefault();
    }
    keys[e.code] = true;
  },
  { passive: false }
);

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function startGame() {
  teamName = prompt("Nom de l'équipe:");
  if (!teamName) return;

  document.getElementById("teamNameDisplay").innerText = teamName;
  document.getElementById("menu").style.display = "none";
  gameStarted = true;
  gameLoop();
}

function update() {
  // Movimiento normal (arriba = y disminuye)
  if (keys["KeyW"] || keys["ArrowUp"]) player.y -= player.speed;
  if (keys["KeyS"] || keys["ArrowDown"]) player.y += player.speed;

  if (keys["KeyA"] || keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["KeyD"] || keys["ArrowRight"]) player.x += player.speed;

  camera.x = player.x - canvas.width / 2;
  camera.y = player.y - canvas.height / 2;
}

function drawWorld() {
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, 3000, 2000);

  ctx.fillStyle = "#333";
  ctx.fillRect(800 - camera.x, 400 - camera.y, 200, 150);
  ctx.fillRect(1400 - camera.x, 400 - camera.y, 200, 150);
}

function drawPlayer() {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(player.x - camera.x, player.y - camera.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawLighting() {
  let g = ctx.createRadialGradient(
    player.x - camera.x,
    player.y - camera.y,
    40,
    player.x - camera.x,
    player.y - camera.y,
    250
  );
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.3)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
  if (!gameStarted) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawWorld();
  drawPlayer();
  drawLighting();
  requestAnimationFrame(gameLoop);
}

function accuse() {
  let guess = prompt("Qui est le coupable?");
  endGame(guess === culprit);
}

function endGame(success) {
  const ending = document.getElementById("ending");
  ending.style.display = "flex";
  if (success) {
    ending.innerHTML = "<h2>MISSION RÉUSSIE</h2><p>Le coupable était " + culprit + "</p>";
  } else {
    ending.innerHTML = "<h2>ÉCHEC</h2><p>Le vrai coupable était " + culprit + "</p>";
  }
}
