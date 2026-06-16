const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const DROP_INTERVAL_MS = 800;

const LINE_SCORES = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

const TETROMINOES = {
  I: {
    rotations: [
      [[0, 0], [0, 1], [0, 2], [0, 3]],
      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[0, 0], [0, 1], [0, 2], [0, 3]],
      [[0, 0], [1, 0], [2, 0], [3, 0]],
    ],
    className: "piece-i",
    spawn: { row: 0, col: 3 },
  },
  O: {
    rotations: [
      [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]],
    ],
    className: "piece-o",
    spawn: { row: 0, col: 4 },
  },
  T: {
    rotations: [
      [[0, 1], [1, 0], [1, 1], [1, 2]],
      [[0, 1], [1, 1], [1, 2], [2, 1]],
      [[1, 0], [1, 1], [1, 2], [2, 1]],
      [[0, 1], [1, 0], [1, 1], [2, 1]],
    ],
    className: "piece-t",
    spawn: { row: 0, col: 3 },
  },
  S: {
    rotations: [
      [[0, 1], [0, 2], [1, 0], [1, 1]],
      [[0, 1], [1, 1], [1, 2], [2, 2]],
      [[1, 1], [1, 2], [2, 0], [2, 1]],
      [[0, 0], [1, 0], [1, 1], [2, 1]],
    ],
    className: "piece-s",
    spawn: { row: 0, col: 3 },
  },
  Z: {
    rotations: [
      [[0, 0], [0, 1], [1, 1], [1, 2]],
      [[0, 2], [1, 1], [1, 2], [2, 1]],
      [[1, 0], [1, 1], [2, 1], [2, 2]],
      [[0, 1], [1, 0], [1, 1], [2, 0]],
    ],
    className: "piece-z",
    spawn: { row: 0, col: 3 },
  },
  J: {
    rotations: [
      [[0, 0], [1, 0], [1, 1], [1, 2]],
      [[0, 1], [0, 2], [1, 1], [2, 1]],
      [[1, 0], [1, 1], [1, 2], [2, 2]],
      [[0, 1], [1, 1], [2, 0], [2, 1]],
    ],
    className: "piece-j",
    spawn: { row: 0, col: 3 },
  },
  L: {
    rotations: [
      [[0, 2], [1, 0], [1, 1], [1, 2]],
      [[0, 1], [1, 1], [2, 1], [2, 2]],
      [[1, 0], [1, 1], [1, 2], [2, 0]],
      [[0, 0], [0, 1], [1, 1], [2, 1]],
    ],
    className: "piece-l",
    spawn: { row: 0, col: 3 },
  },
};

const PIECE_TYPES = Object.keys(TETROMINOES);

const boardElement = document.getElementById("board");
const scoreElement = document.getElementById("score");
const gameStatusElement = document.getElementById("game-status");
const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");

let board = [];
let score = 0;
let currentPiece = null;
let dropTimerId = null;
let isGameOver = false;
let isPlaying = false;
let keyboardControlsBound = false;

function createEmptyBoard() {
  const emptyBoard = [];

  for (let row = 0; row < BOARD_HEIGHT; row++) {
    const rowCells = [];

    for (let col = 0; col < BOARD_WIDTH; col++) {
      rowCells.push(0);
    }

    emptyBoard.push(rowCells);
  }

  return emptyBoard;
}

function createEmptyRow() {
  return Array(BOARD_WIDTH).fill(0);
}

function createBoardCells() {
  boardElement.innerHTML = "";

  for (let row = 0; row < BOARD_HEIGHT; row++) {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;
      boardElement.appendChild(cell);
    }
  }
}

function getCellElement(row, col) {
  return boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function getPieceCells(piece) {
  return TETROMINOES[piece.type].rotations[piece.rotation];
}

function createPiece(type) {
  const pieceType = type || PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  const pieceDef = TETROMINOES[pieceType];

  if (!pieceDef) {
    throw new Error(`Unknown piece type: ${pieceType}`);
  }

  return {
    type: pieceType,
    row: pieceDef.spawn.row,
    col: pieceDef.spawn.col,
    rotation: 0,
  };
}

function isRowFull(matrix, row) {
  return matrix[row].every((cell) => cell !== 0);
}

function clearLines(matrix) {
  let linesCleared = 0;

  for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
    if (isRowFull(matrix, row)) {
      matrix.splice(row, 1);
      matrix.unshift(createEmptyRow());
      linesCleared += 1;
      row += 1;
    }
  }

  return linesCleared;
}

function addScore(linesCleared) {
  if (linesCleared <= 0) {
    return;
  }

  score += LINE_SCORES[linesCleared] || linesCleared * 100;
  updateScoreDisplay();
}

function canMove(piece, dx, dy, matrix, cells) {
  if (!piece) {
    return false;
  }

  const pieceCells = cells || getPieceCells(piece);
  const nextRow = piece.row + dy;
  const nextCol = piece.col + dx;

  for (const [rowOffset, colOffset] of pieceCells) {
    const row = nextRow + rowOffset;
    const col = nextCol + colOffset;

    if (row < 0 || row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH) {
      return false;
    }

    if (matrix[row][col]) {
      return false;
    }
  }

  return true;
}

function lockPiece(piece, matrix) {
  const pieceCells = getPieceCells(piece);

  pieceCells.forEach(([rowOffset, colOffset]) => {
    const row = piece.row + rowOffset;
    const col = piece.col + colOffset;
    matrix[row][col] = piece.type;
  });
}

function triggerGameOver() {
  isGameOver = true;
  isPlaying = false;
  currentPiece = null;
  stopDropLoop();
  updateGameStatus();
}

function spawnNextPiece() {
  currentPiece = createPiece();

  if (!canMove(currentPiece, 0, 0, board)) {
    triggerGameOver();
  }
}

function settleCurrentPiece() {
  lockPiece(currentPiece, board);
  const linesCleared = clearLines(board);
  addScore(linesCleared);
  spawnNextPiece();
  updateGameStatus();
  renderBoard();
}

function tryMove(dx, dy) {
  if (!currentPiece || isGameOver) {
    return false;
  }

  if (!canMove(currentPiece, dx, dy, board)) {
    return false;
  }

  currentPiece.row += dy;
  currentPiece.col += dx;
  renderBoard();
  return true;
}

function tryRotate() {
  if (!currentPiece || isGameOver) {
    return false;
  }

  const pieceDef = TETROMINOES[currentPiece.type];
  const nextRotation = (currentPiece.rotation + 1) % pieceDef.rotations.length;
  const nextCells = pieceDef.rotations[nextRotation];
  const wallKicks = [0, -1, 1];

  for (const dx of wallKicks) {
    if (canMove(currentPiece, dx, 0, board, nextCells)) {
      currentPiece.rotation = nextRotation;
      currentPiece.col += dx;
      renderBoard();
      return true;
    }
  }

  return false;
}

function softDrop() {
  if (!currentPiece || isGameOver) {
    return;
  }

  if (!tryMove(0, 1)) {
    settleCurrentPiece();
  }
}

function hardDrop() {
  if (!currentPiece || isGameOver) {
    return;
  }

  while (canMove(currentPiece, 0, 1, board)) {
    currentPiece.row += 1;
  }

  settleCurrentPiece();
}

function tick() {
  if (isGameOver || !currentPiece) {
    return;
  }

  if (!tryMove(0, 1)) {
    settleCurrentPiece();
  }
}

function startDropLoop() {
  stopDropLoop();
  dropTimerId = setInterval(tick, DROP_INTERVAL_MS);
  isPlaying = true;
}

function stopDropLoop() {
  if (dropTimerId !== null) {
    clearInterval(dropTimerId);
    dropTimerId = null;
  }
}

function drawPiece(piece) {
  if (!piece) {
    return;
  }

  const pieceDef = TETROMINOES[piece.type];
  const pieceCells = getPieceCells(piece);

  pieceCells.forEach(([rowOffset, colOffset]) => {
    const row = piece.row + rowOffset;
    const col = piece.col + colOffset;
    const cell = getCellElement(row, col);

    if (cell) {
      cell.classList.add("filled", pieceDef.className);
    }
  });
}

function renderBoard() {
  const cells = boardElement.querySelectorAll(".cell");

  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const lockedType = board[row][col];

    cell.className = "cell";

    if (lockedType) {
      const lockedDef = TETROMINOES[lockedType];
      cell.classList.add("filled", lockedDef.className);
    }
  });

  drawPiece(currentPiece);
}

function updateScoreDisplay() {
  scoreElement.textContent = String(score);
}

function updateGameStatus() {
  gameStatusElement.className = "info-box game-status";

  if (isGameOver) {
    gameStatusElement.textContent = "게임 오버! 재시작 버튼을 누르세요.";
    gameStatusElement.classList.add("is-game-over");
    return;
  }

  if (isPlaying) {
    gameStatusElement.textContent = "플레이 중";
    gameStatusElement.classList.add("is-playing");
    return;
  }

  gameStatusElement.textContent = "시작 버튼을 눌러 플레이하세요.";
}

function resetGame() {
  stopDropLoop();
  board = createEmptyBoard();
  score = 0;
  isGameOver = false;
  isPlaying = false;
  currentPiece = createPiece();
  updateScoreDisplay();
  updateGameStatus();
  renderBoard();
}

function restartGame() {
  resetGame();
  startDropLoop();
  updateGameStatus();
}

function startGame() {
  restartGame();
}

function handleKeyDown(event) {
  if (isGameOver || !currentPiece) {
    return;
  }

  switch (event.code) {
    case "ArrowLeft":
      event.preventDefault();
      tryMove(-1, 0);
      break;
    case "ArrowRight":
      event.preventDefault();
      tryMove(1, 0);
      break;
    case "ArrowDown":
      event.preventDefault();
      softDrop();
      break;
    case "ArrowUp":
      event.preventDefault();
      tryRotate();
      break;
    case "Space":
      event.preventDefault();
      hardDrop();
      break;
    default:
      break;
  }
}

function setupKeyboardControls() {
  if (keyboardControlsBound) {
    return;
  }

  document.addEventListener("keydown", handleKeyDown);
  keyboardControlsBound = true;
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

createBoardCells();
setupKeyboardControls();
resetGame();
