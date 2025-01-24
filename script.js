const words = ["CAT", "DOG", "BIRD", "FISH", "COW", "LION", "FROG"];
const gridSize = 10;
let grid = [];
let selectedCells = [];
let foundWords = [];
let score = 0;
let timer = 60;
let timerInterval;
let isTimeMode = false;

// DOM Elements
const gridContainer = document.getElementById("grid");
const wordList = document.getElementById("wordList");
const timerElement = document.getElementById("time");
const timerDiv = document.getElementById("timer");
const scoreElement = document.getElementById("scoreCount");
const startButton = document.getElementById("startButton");
const regularModeButton = document.getElementById("regularModeButton");
const timeModeButton = document.getElementById("timeModeButton");

// Mode Selection
regularModeButton.addEventListener("click", () => {
  isTimeMode = false;
  startGame();
});
timeModeButton.addEventListener("click", () => {
  isTimeMode = true;
  startGame();
});

// Start the game
function startGame() {
  resetGame();
  generateGrid();
  placeWords();
  displayWordList();

  // Show/hide timer based on mode
  timerDiv.style.display = isTimeMode ? "block" : "none";

  if (isTimeMode) startTimer();
}

// Reset game state
function resetGame() {
  grid = [];
  foundWords = [];
  score = 0;
  timer = 60;
  selectedCells = [];
  gridContainer.innerHTML = "";
  wordList.innerHTML = "";
  scoreElement.textContent = score;
  clearInterval(timerInterval);
}

// Generate a random letter grid
function generateGrid() {
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
  }

  renderGrid();
}

// Render the grid on the screen
function renderGrid() {
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  grid.forEach((row, rowIndex) => {
    row.forEach((letter, colIndex) => {
      const button = document.createElement("button");
      button.textContent = letter;
      button.dataset.row = rowIndex;
      button.dataset.col = colIndex;

      button.addEventListener("mousedown", handleCellSelect);
      button.addEventListener("mouseenter", handleCellHover);
      button.addEventListener("mouseup", checkSelection);

      gridContainer.appendChild(button);
    });
  });
}

// Place words in the grid
function placeWords() {
  words.forEach((word) => {
    const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);

    if (direction === "horizontal" && col + word.length <= gridSize) {
      for (let i = 0; i < word.length; i++) {
        grid[row][col + i] = word[i];
      }
    } else if (direction === "vertical" && row + word.length <= gridSize) {
      for (let i = 0; i < word.length; i++) {
        grid[row + i][col] = word[i];
      }
    }
  });
}

// Display the word list
function displayWordList() {
  words.forEach((word) => {
    const listItem = document.createElement("li");
    listItem.textContent = word;
    wordList.appendChild(listItem);
  });
}

// Handle cell selection
function handleCellSelect(e) {
  selectedCells = [e.target];
  e.target.classList.add("selected");
}

// Handle hover during drag
function handleCellHover(e) {
  if (selectedCells.length) {
    e.target.classList.add("selected");
    selectedCells.push(e.target);
  }
}

// Check if selected cells form a word
function checkSelection() {
  const selectedWord = selectedCells
    .map((cell) => cell.textContent)
    .join("");

  if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
    foundWords.push(selectedWord);
    score += 10;
    updateUI(selectedWord);
  }

  selectedCells.forEach((cell) => cell.classList.remove("selected"));
  selectedCells = [];
}

// Update UI for found words
function updateUI(word) {
  document.querySelectorAll(`#wordList li`).forEach((item) => {
    if (item.textContent === word) {
      item.classList.add("found");
    }
  });

  selectedCells.forEach((cell) => cell.classList.add("found"));
  scoreElement.textContent = score;
}

// Timer logic
function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    timerElement.textContent = timer;

    if (timer <= 0) {
      clearInterval(timerInterval);
      alert("Time's up! Game Over.");
    }
  }, 1000);
}
