const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let score = 0;
let gameOver = false;

let emojisPeixes = ["🐟", "🐠", "🐡", "🦀", "🦑"];
let emojisObstaculos = ["🪣", "🗑️", "🚫", "🛢️"];

let fish, obstacle, hook;

function initGame() {
  score = 0;
  gameOver = false;
  document.getElementById("score").innerText = "Peixes: " + score;

  fish = {
    x: canvas.width,
    y: Math.random() * 350,
    speed: 2,
    emoji: emojisPeixes[Math.floor(Math.random() * emojisPeixes.length)]
  };

  obstacle = {
    x: canvas.width + 200,
    y: Math.random() * 350,
    speed: 3,
    emoji: emojisObstaculos[Math.floor(Math.random() * emojisObstaculos.length)]
  };

  hook = { x: 300, y: 0, width: 30, height: 30, down: false };

  update();
}

// desenha peixe
function drawFish() {
  ctx.font = "28px Arial";
  ctx.fillText(fish.emoji, fish.x, fish.y);
}

// desenha obstáculo
function drawObstacle() {
  ctx.font = "28px Arial";
  ctx.fillText(obstacle.emoji, obstacle.x, obstacle.y);
}

// desenha anzol com linha
function drawHook() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(hook.x + hook.width / 2, 0);
  ctx.lineTo(hook.x + hook.width / 2, hook.y);
  ctx.stroke();

  ctx.font = "30px Arial";
  ctx.fillText("🪝", hook.x, hook.y + hook.height);
}

// atualizar jogo
function update() {
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER!", canvas.width / 2 - 120, canvas.height / 2);

    ctx.fillStyle = "yellow";
    ctx.font = "25px Arial";
    ctx.fillText("Pressione ESPAÇO para recomeçar", canvas.width / 2 - 170, canvas.height / 2 + 40);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // mover peixe
  fish.x -= fish.speed;
  if (fish.x < -20) {
    fish.x = canvas.width;
    fish.y = Math.random() * 350;
    fish.emoji = emojisPeixes[Math.floor(Math.random() * emojisPeixes.length)];
  }

  // mover obstáculo
  obstacle.x -= obstacle.speed;
  if (obstacle.x < -20) {
    obstacle.x = canvas.width + Math.random() * 200;
    obstacle.y = Math.random() * 350;
    obstacle.emoji = emojisObstaculos[Math.floor(Math.random() * emojisObstaculos.length)];
  }

  // mover anzol
  if (hook.down && hook.y < canvas.height - 50) {
    hook.y += 4;
  } else if (!hook.down && hook.y > 0) {
    hook.y -= 4;
  }

  // colisão peixe x anzol
  if (
    hook.x < fish.x + 25 &&
    hook.x + hook.width > fish.x &&
    hook.y < fish.y + 25 &&
    hook.y + hook.height > fish.y
  ) {
    score++;
    document.getElementById("score").innerText = "Peixes: " + score;
    fish.x = canvas.width;
    fish.y = Math.random() * 350;
    fish.emoji = emojisPeixes[Math.floor(Math.random() * emojisPeixes.length)];
  }

  // colisão obstáculo x anzol → GAME OVER
  if (
    hook.x < obstacle.x + 25 &&
    hook.x + hook.width > obstacle.x &&
    hook.y < obstacle.y + 25 &&
    hook.y + hook.height > obstacle.y
  ) {
    gameOver = true;
  }

  drawFish();
  drawObstacle();
  drawHook();

  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") hook.down = true;
  if (e.code === "Space" && gameOver) {
    initGame(); // reinicia o jogo
  }
});
document.addEventListener("keyup", (e) => {
  if (e.code === "Space") hook.down = false;
});

// inicia o jogo pela primeira vez
initGame();
