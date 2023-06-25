// Constants
const gameContainer = document.getElementById("game-container");
const rod1 = document.getElementById("rod1");
const rod2 = document.getElementById("rod2");
const ball = document.getElementById("ball");
const ballSpeed = 4; // Adjust as needed

// Variables
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let maxScore = localStorage.getItem("maxScore");
let maxScorePlayer = localStorage.getItem("maxScorePlayer");
let ballX = 0;
let ballY = 0;
let ballDirectionX = 1;
let ballDirectionY = 1;
let gameOver = false;

// Function to move rods
function moveRods(event) {
  if (gameOver) return;

  const key = event.key.toLowerCase();
  const step = 10; // Adjust as needed

  if (key === "arrowleft" && rod1.offsetLeft > 0 && rod2.offsetLeft > 0) {
    rod1.style.left = `${rod1.offsetLeft - step}px`;
    rod2.style.left = `${rod2.offsetLeft - step}px`;
  } else if (key === "arrowright" && rod1.offsetLeft + rod1.offsetWidth < gameContainer.offsetWidth && rod2.offsetLeft + rod2.offsetWidth < gameContainer.offsetWidth) {
    rod1.style.left = `${rod1.offsetLeft + step}px`;
    rod2.style.left = `${rod2.offsetLeft + step}px`;
  }
}

// Function to move the ball
function moveBall() {
  if (gameOver) return;

  ballX += ballSpeed * ballDirectionX;
  ballY += ballSpeed * ballDirectionY;

  // Collision detection with walls
  if (ballX <= 0 || ballX >= gameContainer.offsetWidth - ball.offsetWidth) {
    ballDirectionX *= -1;
  }

  // Collision detection with rods
  if (ballY <= rod1.offsetTop + rod1.offsetHeight && ballY + ball.offsetHeight >= rod1.offsetTop && ballX + ball.offsetWidth >= rod1.offsetLeft && ballX <= rod1.offsetLeft + rod1.offsetWidth) {
    ballDirectionY *= -1;
    scorePlayer1++;
  } else if (ballY <= rod2.offsetTop + rod2.offsetHeight && ballY + ball.offsetHeight >= rod2.offsetTop && ballX + ball.offsetWidth >= rod2.offsetLeft && ballX <= rod2.offsetLeft + rod2.offsetWidth) {
    ballDirectionY *= -1;
    scorePlayer2++;
  }

  // Check if ball is missed
  if (ballY <= 0 || ballY >= gameContainer.offsetHeight) {
    gameOver = true;
    const winner = scorePlayer1 > scorePlayer2 ? "Player 1" : "Player 2";
    const roundScore = `Player 1: ${scorePlayer1} - Player 2: ${scorePlayer2}`;
    alert(`Game over!\n\nWinner: ${winner}\nScore: ${roundScore}`);

    // Reset scores and ball position for the next round
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    ballX = (gameContainer.offsetWidth - ball.offsetWidth) / 2;
    ballY = 0;
    ballDirectionX = 1;
    ballDirectionY = 1;
    rod1.style.left = `${(gameContainer.offsetWidth - rod1.offsetWidth) / 2}px`;
    rod2.style.left = `${(gameContainer.offsetWidth - rod2.offsetWidth) / 2}px`;
  }

  // Update ball position
  ball.style.left = `${ballX}px`;
  ball.style.bottom = `${ballY}px`;

  // Repeat the animation
  requestAnimationFrame(moveBall);
}

// Function to start the game on Enter key press
function startGame(event) {
  if (event.key === "Enter") {
    // Get highest score and player from local storage
    const highestScore = localStorage.getItem("maxScore");
    const highestScorePlayer = localStorage.getItem("maxScorePlayer");

    // Display highest score and player
    let highestScoreMessage;
    if (highestScore && highestScorePlayer) {
      highestScoreMessage = `Highest Score: ${highestScore} by ${highestScorePlayer}`;
    } else {
      highestScoreMessage = "This is your first time";
    }
    alert(highestScoreMessage);

    // Start the game
    document.removeEventListener("keydown", startGame);
    document.addEventListener("keydown", moveRods);
    moveBall();
  }
}


// Set initial positions
rod1.style.left = `${(gameContainer.offsetWidth - rod1.offsetWidth) / 2}px`;
rod2.style.left = `${(gameContainer.offsetWidth - rod2.offsetWidth) / 2}px`;
ball.style.left = `${(gameContainer.offsetWidth - ball.offsetWidth) / 2}px`;
ball.style.bottom = "0";

// Event listener to start the game on Enter key press
document.addEventListener("keydown", startGame);
