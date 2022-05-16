const canvas = document.getElementById("levelCanvas");
const canvasContext = canvas.getContext("2d");
const easyBtn = document.getElementById("easy-lvl-btn");
const hardBtn = document.getElementById("hard-lvl-btn");
const startWrapper = document.getElementById("start-wrapper");
const popUp = document.getElementById("pop-up");
const scoreElement = document.getElementById("score");
const scoreBoard = document.getElementById("score-board");
const saveScoreElement = document.getElementById("save-score");
const saveScoreBtn = document.getElementById("save-btn");
const scoreBoardBtn = document.getElementById("score-board-btn");
const backBtn = document.getElementById("back-btn");
const cancelBtn = document.getElementById("cancel-btn");
const music = document.getElementById("music");
const volumeSwitch = document.getElementById("switch");
const volumeImg = document.getElementById("volume-img");

const primaryColor = "#0F2007";
const bgColor = "#5D9640";

let snake;
let currentLevel;
let moveX = 20;
let moveY = 0;
let score = 0;
let isPaused = false;

const soundEffect = new Audio("./music/eating.mp3");

const appleImg = document.getElementById("apple-img");
const goldenAppleImg = document.getElementById("golden-apple-img");

const apple = [
  [appleImg, 10],
  [goldenAppleImg, 50],
];

const probability = [0, 0, 0, 1];

let generatedApple;

let appleX;
let appleY;

popUp.style.display = "none";
canvas.style.display = "none";
scoreElement.style.display = "none";
scoreBoard.style.display = "none";
saveScoreElement.style.display = "none";

volumeSwitch.addEventListener("click", function () {
  if (music.paused) {
    volumeImg.src = "./img/volume.png";
    music.play();
  } else {
    volumeImg.src = "./img/mute.png";
    music.pause();
  }
});

easyBtn.addEventListener("click", function () {
  currentLevel = new Level(160, 400);
  drawLevel();
  createSnake();
  document.addEventListener("keydown", changeDirection);
  score = 0;
  scoreElement.style.display = "flex";
  start();
  document.addEventListener("keydown", function (e) {
    if (e.keyCode === 32) {
      isPaused = !isPaused;
    }
  });
  generateApple();
});

hardBtn.addEventListener("click", function () {
  currentLevel = new Level(120, 600);
  drawLevel();
  createSnake();
  document.addEventListener("keydown", changeDirection);
  score = 0;
  scoreElement.style.display = "flex";
  start();
  document.addEventListener("keydown", function (e) {
    if (e.keyCode === 32) {
      isPaused = !isPaused;
    }
  });
  generateApple();
});

scoreBoardBtn.addEventListener("click", function () {
  startWrapper.style.display = "none";
  scoreBoard.style.display = "flex";
  printScore();
  backBtn.addEventListener("click", function () {
    startWrapper.style.display = "flex";
    scoreBoard.style.display = "none";
  });
});

function start() {
  if (isGameOver()) {
    popUp.style.display = "flex";
    setTimeout(function () {
      popUp.style.display = "none";
      canvas.style.display = "none";
      scoreElement.style.display = "none";
      if (score > 0) {
        saveScoreElement.style.display = "flex";
        saveScoreBtn.addEventListener("click", function () {
          saveScore();
          window.location.reload();
        });
        cancelBtn.addEventListener("click", function () {
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    }, 1000);
    return;
  }

  setTimeout(function () {
    if (!isPaused) {
      createCanvas();
      drawApple();
      moveSnake();
      drawSnake();
    }
    start();
  }, currentLevel.getSpeed());
}

function drawLevel() {
  startWrapper.style.display = "none";
  canvas.style.display = "block";
  canvas.width = currentLevel.getSize();
  canvas.height = currentLevel.getSize();
}

function createSnake() {
  let x = currentLevel.getSize() / 2;
  let y = currentLevel.getSize() / 2;
  snake = [
    { x: x, y: y },
    { x: x - 20, y: y },
    { x: x - 40, y: y },
    { x: x - 60, y: y },
    { x: x - 80, y: y },
  ];
}

function drawSnake() {
  snake.forEach((part) => drawSnakePart(part));
}

function drawSnakePart(part) {
  canvasContext.fillStyle = primaryColor;
  canvasContext.fillRect(part.x, part.y, 20, 20);
}

function createCanvas() {
  canvasContext.fillStyle = bgColor;
  canvasContext.fillRect(0, 0, currentLevel.getSize(), currentLevel.getSize());
}

function moveSnake() {
  const snakeHead = {
    x: snake[0].x + moveX,
    y: snake[0].y + moveY,
  };
  snake.unshift(snakeHead);
  if (snake[0].x === appleX && snake[0].y === appleY) {
    soundEffect.play();
    score += generatedApple[1];
    scoreElement.innerHTML = "Score: " + score;
    generateApple();
  } else {
    snake.pop();
  }
}

function changeDirection(e) {
  const up = moveY === -20;
  const down = moveY === 20;
  const right = moveX === 20;
  const left = moveX === -20;

  if ((e.keyCode === 38 || e.keyCode === 87) && !down) {
    moveX = 0;
    moveY = -20;
  }

  if ((e.keyCode === 40 || e.keyCode === 83) && !up) {
    moveX = 0;
    moveY = 20;
  }

  if ((e.keyCode === 39 || e.keyCode === 68) && !left) {
    moveX = 20;
    moveY = 0;
  }

  if ((e.keyCode === 37 || e.keyCode === 65) && !right) {
    moveX = -20;
    moveY = 0;
  }
}

function isGameOver() {
  if (
    snake[0].y < 0 ||
    snake[0].y > canvas.height - 20 ||
    snake[0].x < 0 ||
    snake[0].x > canvas.width - 20
  )
    return true;

  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
}

function randomLocation(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 20) * 20;
}

function randomApple() {
  const randomIdx = Math.floor(Math.random() * probability.length);
  return apple[probability[randomIdx]];
}

function generateApple() {
  generatedApple = randomApple();
  appleX = randomLocation(0, canvas.width - 20);
  appleY = randomLocation(0, canvas.height - 20);

  snake.forEach(function isEaten(snakePart) {
    if (snakePart.x == appleX && snakePart.y == appleY) {
      generateApple();
    }
  });
}

function drawApple() {
  canvasContext.drawImage(generatedApple[0], appleX, appleY, 20, 20);
}

function saveScore() {
  let nameInput = document.getElementById("score-name").value;
  window.localStorage.setItem(nameInput, score);
}

function printScore() {
  const scoreList = document.getElementById("score-list");
  scoreList.innerHTML = "";
  let scores = new Map();

  Object.keys(localStorage).forEach(function (key) {
    scores.set(key, localStorage.getItem(key));
  });

  let sortedScores = new Map([...scores].sort((a, b) => b[1] - a[1]));
  for (const [key, value] of sortedScores.entries()) {
    let entry = document.createElement("li");
    let text = document.createTextNode(key + " " + value);
    entry.appendChild(text);
    scoreList.appendChild(entry);
  }
}
