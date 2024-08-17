const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const unitSize = 20;
const canvasWidth = 400;
const canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let snake = [{ x: unitSize * 5, y: unitSize * 5 }];
let direction = { x: unitSize, y: 0 };
let apple = { x: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize, y: Math.floor(Math.random() * (canvasHeight / unitSize)) * unitSize };
let score = 0;
let gameInterval;
let gameRunning = false;

document.addEventListener("keydown", changeDirection);
document.getElementById("stop-btn").addEventListener("click", stopGame);
document.getElementById("play-btn").addEventListener("click", startGame);

function gameLoop() {
    if (checkCollision()) {
        endGame("Game Over! Your score was " + score);
        return;
    }

    if (score === 20) {
        endGame("Winner!");
        return;
    }

    clearCanvas();
    drawApple();
    moveSnake();
    drawSnake();
    checkAppleCollision();
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        resetGame();
        gameInterval = setInterval(gameLoop, 100);
        document.getElementById("message").innerText = "";
    }
}

function stopGame() {
    if (gameRunning) {
        clearInterval(gameInterval);
        gameRunning = false;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = "white"; // White snake
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, unitSize, unitSize);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    snake.pop();
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = direction.y === -unitSize;
    const goingDown = direction.y === unitSize;
    const goingRight = direction.x === unitSize;
    const goingLeft = direction.x === -unitSize;

    switch (keyPressed) {
        case 37: // Left arrow key
            if (!goingRight) {
                direction = { x: -unitSize, y: 0 };
            }
            break;
        case 38: // Up arrow key
            if (!goingDown) {
                direction = { x: 0, y: -unitSize };
            }
            break;
        case 39: // Right arrow key
            if (!goingLeft) {
                direction = { x: unitSize, y: 0 };
            }
            break;
        case 40: // Down arrow key
            if (!goingUp) {
                direction = { x: 0, y: unitSize };
            }
            break;
    }
}

function drawApple() {
    ctx.fillStyle = "green"; // Green apple
    ctx.fillRect(apple.x, apple.y, unitSize, unitSize);
}

function checkAppleCollision() {
    if (snake[0].x === apple.x && snake[0].y === apple.y) {
        score++;
        document.getElementById("score").innerText = "Score: " + score;
        snake.push({}); // Grow snake
        apple = { x: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize, y: Math.floor(Math.random() * (canvasHeight / unitSize)) * unitSize };
    }
}

function checkCollision() {
    // Check wall collision
    if (snake[0].x < 0 || snake[0].x >= canvasWidth || snake[0].y < 0 || snake[0].y >= canvasHeight) {
        return true;
    }

    // Check self-collision
    for (let i = 4; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function endGame(message) {
    clearInterval(gameInterval);
    gameRunning = false;
    document.getElementById("message").innerText = message;
}

function resetGame() {
    snake = [{ x: unitSize * 5, y: unitSize * 5 }];
    direction = { x: unitSize, y: 0 };
    apple = { x: Math.floor(Math.random() * (canvasWidth / unitSize)) * unitSize, y: Math.floor(Math.random() * (canvasHeight / unitSize)) * unitSize };
    score = 0;
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("message").innerText = "";
}
