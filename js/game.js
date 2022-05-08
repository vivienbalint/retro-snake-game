const canvas = document.getElementById("levelCanvas");
const canvasContext = canvas.getContext("2d");
const easyBtn = document.getElementById("easy-lvl-btn");
const hardBtn = document.getElementById("hard-lvl-btn");
const startWrapper = document.getElementById("start-wrapper");
const popUp = document.getElementById("pop-up");

const primaryColor = "#0F2007";
const bgColor = "#5D9640";

let snake;
let currentLevel;
let moveX = 20;
let moveY = 0;

popUp.style.display = "none";
canvas.style.display = "none";

easyBtn.addEventListener("click", function () {
  currentLevel = new Level(120, 500);
  drawLevel();
  createSnake();
  document.addEventListener("keydown", changeDirection);
  start();
});

hardBtn.addEventListener("click", function () {
  currentLevel = new Level(70, 600);
  drawLevel();
  createSnake();
  document.addEventListener("keydown", changeDirection);
  start();
});

function start() {
  setTimeout(function() {
    createCanvas();
    moveSnake();
    drawSnake();
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
  snake.pop();
}

function changeDirection(e) {
  const up = moveY === -20;
  const down = moveY === 20;
  const right = moveX === 20;
  const left = moveX === -20;

  if((e.keyCode === 38 || e.keyCode === 87) && !down) {
    moveX = 0;
    moveY = -20;
  }

  if((e.keyCode === 40 || e.keyCode === 83) && !up) {
    moveX = 0;
    moveY = 20;
  } 

  if((e.keyCode === 39 || e.keyCode === 68) && !left) {
    moveX = 20;
    moveY = 0;
  }

  if((e.keyCode === 37 || e.keyCode === 65) && !right) {
    moveX = -20;
    moveY = 0;
  }
}

function isGameOver() {
  
}