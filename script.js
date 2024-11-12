const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
canvas.width = 400;
canvas.height = 400;

let score = 0;
let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let snakeDirection = { x: gridSize, y: 0 };
let food = spawnFood();
let speed = 200;
let lastRenderTime = 0;
let gameRunning = false;

document.getElementById("score").innerText = "Score: " + score;

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
  };
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment) => {
    ctx.fillStyle = "#4caf50";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#4caf50";
    ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);
    ctx.fillStyle = "#66bb6a";
    ctx.fillRect(segment.x + 2, segment.y + 2, gridSize - 4, gridSize - 4);
  });

  // Draw food
  ctx.fillStyle = "#ff5252";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#ff5252";
  ctx.fillRect(food.x + 2, food.y + 2, gridSize - 4, gridSize - 4);
}

function updateGame() {
  if (!gameRunning) return;

  const head = { x: snake[0].x + snakeDirection.x, y: snake[0].y + snakeDirection.y };

  // Check for wall collision
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    resetGame();
    return;
  }

  // Check for self-collision
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      resetGame();
      return;
    }
  }

  snake.unshift(head);

  // Check for food collision
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    food = spawnFood();
  } else {
    snake.pop();
  }
}

function resetGame() {
  gameRunning = false;
  score = 0;
  snake = [{ x: gridSize * 5, y: gridSize * 5 }];
  snakeDirection = { x: gridSize, y: 0 };
  food = spawnFood();
  document.getElementById("score").innerText = "Score: " + score;
}

function gameLoop(currentTime) {
  if (currentTime - lastRenderTime < speed) {
    requestAnimationFrame(gameLoop);
    return;
  }
  lastRenderTime = currentTime;

  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

function togglePlayPause() {
  gameRunning = !gameRunning;
  document.getElementById("playPause").innerText = gameRunning ? "Pause" : "Play";
}

function startGame() {
  resetGame();
  gameRunning = true;
  document.getElementById("playPause").innerText = "Pause";
  requestAnimationFrame(gameLoop);
}

// Play/Pause and Refresh button controls
document.getElementById("playPause").addEventListener("click", togglePlayPause);
document.getElementById("refresh").addEventListener("click", startGame);

// Keyboard controls
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (snakeDirection.y === 0) snakeDirection = { x: 0, y: -gridSize };
      break;
    case "ArrowDown":
      if (snakeDirection.y === 0) snakeDirection = { x: 0, y: gridSize };
      break;
    case "ArrowLeft":
      if (snakeDirection.x === 0) snakeDirection = { x: -gridSize, y: 0 };
      break;
    case "ArrowRight":
      if (snakeDirection.x === 0) snakeDirection = { x: gridSize, y: 0 };
      break;
  }
});

// On-screen button controls
document.getElementById("up").addEventListener("click", () => {
  if (snakeDirection.y === 0) snakeDirection = { x: 0, y: -gridSize };
});
document.getElementById("down").addEventListener("click", () => {
  if (snakeDirection.y === 0) snakeDirection = { x: 0, y: gridSize };
});
document.getElementById("left").addEventListener("click", () => {
  if (snakeDirection.x === 0) snakeDirection = { x: -gridSize, y: 0 };
});
document.getElementById("right").addEventListener("click", () => {
  if (snakeDirection.x === 0) snakeDirection = { x: gridSize, y: 0 };
});
