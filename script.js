// ============================================================
// 2048 – script.js
// Section 1: Settings and variables
// Section 2: Board          (from board.py)
// Section 3: Game logic     (from game_logic.py)
// Section 4: Storage        (from file_manager.py)
// Section 5: Drawing        (replaces board.display())
// Section 6: Game flow      (from main.py)
// Section 7: Controls       (replaces input() in main.py)
// Section 8: Start the game
// Section 9: Offline / install support
// ============================================================


// ============================================================
// 1. SETTINGS AND VARIABLES
// ============================================================
const SIZE = 4;
const WIN_VALUE = 2048;
const SAVE_KEY = "2048-save";

let grid = [];
let score = 0;
let best = 0;
let keepPlaying = false;
let nextId = 1;

// Handles to elements on the page (found by their id)
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const tilesLayer = document.getElementById("tiles");
const boardEl = document.getElementById("board");
const overlayEl = document.getElementById("overlay");
const overlayText = document.getElementById("overlay-text");
const newGameBtn = document.getElementById("new-game-btn");
const tryAgainBtn = document.getElementById("try-again-btn");
const keepGoingBtn = document.getElementById("keep-going-btn");
const helpBtn = document.getElementById("help-btn");
const helpModal = document.getElementById("help-modal");
const helpClose = document.getElementById("help-close");

// Remembers which on-screen element belongs to which tile
const elements = new Map();


// ============================================================
// 2. BOARD  (from board.py)
// ============================================================
function createEmptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
}

function createTile(value, row, col) {
  return { id: nextId++, value: value, row: row, col: col, isNew: false, merged: false };
}

function getEmptyCells() {
  const empty = [];
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (grid[i][j] === null) {
        empty.push([i, j]);
      }
    }
  }
  return empty;
}

function addRandomTile() {
  const empty = getEmptyCells();
  if (empty.length === 0) return;

  const [i, j] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  const tile = createTile(value, i, j);
  tile.isNew = true;
  grid[i][j] = tile;
}


// ============================================================
// 3. GAME LOGIC  (from game_logic.py)
// ============================================================
function compress(g) {
  return g.map((row) => {
    const newRow = row.filter((tile) => tile !== null);
    while (newRow.length < SIZE) {
      newRow.push(null);
    }
    return newRow;
  });
}

function merge(g) {
  let gained = 0;
  const absorbed = [];

  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - 1; j++) {
      const a = g[i][j];
      const b = g[i][j + 1];
      if (a !== null && b !== null && a.value === b.value) {
        a.value = a.value * 2;
        a.merged = true;
        gained += a.value;
        absorbed.push({ tile: b, into: a });
        g[i][j + 1] = null;
      }
    }
  }
  return { grid: g, gained: gained, absorbed: absorbed };
}

function mirror(g) {
  return g.map((row) => [...row].reverse());
}

function transpose(g) {
  return g[0].map((_, i) => g.map((row) => row[i]));
}

function moveLeft(g) {
  let result = merge(compress(g));
  result.grid = compress(result.grid);
  return result;
}

function moveRight(g) {
  const result = moveLeft(mirror(g));
  result.grid = mirror(result.grid);
  return result;
}

function moveUp(g) {
  const result = moveLeft(transpose(g));
  result.grid = transpose(result.grid);
  return result;
}

function moveDown(g) {
  const result = moveRight(transpose(g));
  result.grid = transpose(result.grid);
  return result;
}

const MOVES = { left: moveLeft, right: moveRight, up: moveUp, down: moveDown };

function hasWon(g) {
  for (const row of g) {
    for (const tile of row) {
      if (tile !== null && tile.value >= WIN_VALUE) return true;
    }
  }
  return false;
}

function isGameOver(g) {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (g[i][j] === null) return false;
    }
  }
  const t = transpose(g);
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - 1; j++) {
      if (g[i][j].value === g[i][j + 1].value || t[i][j].value === t[i][j + 1].value) {
        return false;
      }
    }
  }
  return true;
}

function sameLayout(a, b) {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const idA = a[i][j] ? a[i][j].id : 0;
      const idB = b[i][j] ? b[i][j].id : 0;
      if (idA !== idB) return false;
    }
  }
  return true;
}


// ============================================================
// 4. STORAGE  (from file_manager.py)
// ============================================================
function saveGame() {
  const data = {
    board: grid.map((row) => row.map((tile) => (tile ? tile.value : 0))),
    score: score,
    best: best,
    keepPlaying: keepPlaying,
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Could not save game:", error);
  }
}

function loadGame() {
  try {
    const text = localStorage.getItem(SAVE_KEY);
    if (!text) return null;

    const data = JSON.parse(text);
    const valid =
      Array.isArray(data.board) &&
      data.board.length === SIZE &&
      data.board.every((row) => Array.isArray(row) && row.length === SIZE);
    return valid ? data : null;
  } catch (error) {
    return null;
  }
}


// ============================================================
// 5. DRAWING  (replaces board.display())
// ============================================================
function drawTile(tile, layer) {
  let el = elements.get(tile.id);
  if (!el) {
    el = document.createElement("div");
    tilesLayer.appendChild(el);
    elements.set(tile.id, el);
  }

  const label = tile.value > WIN_VALUE ? "super" : tile.value;
  el.className = "tile tile-" + label;
  el.textContent = tile.value;
  el.style.setProperty("--x", tile.col);
  el.style.setProperty("--y", tile.row);
  el.style.zIndex = layer;

  if (tile.isNew || tile.merged) {
    void el.offsetWidth; // forces the browser to restart the animation
    el.classList.add(tile.isNew ? "tile-new" : "tile-merged");
    tile.isNew = false;
    tile.merged = false;
  }
}

function removeTileElement(id) {
  const el = elements.get(id);
  if (el) {
    el.remove();
    elements.delete(id);
  }
}

function render(absorbed = []) {
  const alive = new Set();

  for (const row of grid) {
    for (const tile of row) {
      if (tile !== null) {
        drawTile(tile, 2);
        alive.add(tile.id);
      }
    }
  }

  for (const pair of absorbed) {
    drawTile(pair.tile, 1);
    alive.add(pair.tile.id);
  }

  for (const id of [...elements.keys()]) {
    if (!alive.has(id)) removeTileElement(id);
  }

  for (const pair of absorbed) {
    setTimeout(() => removeTileElement(pair.tile.id), 130);
  }
}

function updateScores() {
  scoreEl.textContent = score;
  bestEl.textContent = best;
}

function showOverlay(message, canKeepGoing) {
  overlayText.textContent = message;
  keepGoingBtn.classList.toggle("hidden", !canKeepGoing);
  overlayEl.classList.remove("hidden");
}

function hideOverlay() {
  overlayEl.classList.add("hidden");
}


// ============================================================
// 6. GAME FLOW  (from main.py)
// ============================================================
function isInputBlocked() {
  const messageShowing = !overlayEl.classList.contains("hidden");
  const helpShowing = !helpModal.classList.contains("hidden");
  return messageShowing || helpShowing;
}

function checkEnd() {
  if (hasWon(grid) && !keepPlaying) {
    showOverlay("You reached 2048!", true);
  } else if (isGameOver(grid)) {
    showOverlay("Game over", false);
  }
}

function startNewGame() {
  grid = createEmptyGrid();
  score = 0;
  keepPlaying = false;

  tilesLayer.innerHTML = "";
  elements.clear();
  hideOverlay();

  addRandomTile();
  addRandomTile();

  render();
  updateScores();
  saveGame();
}

function restoreGame(data) {
  grid = createEmptyGrid();
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const value = data.board[i][j];
      if (value > 0) {
        grid[i][j] = createTile(value, i, j);
      }
    }
  }
  score = data.score || 0;
  best = data.best || 0;
  keepPlaying = Boolean(data.keepPlaying);

  render();
  updateScores();
  checkEnd();
}

function handleMove(direction) {
  if (isInputBlocked()) return;

  const result = MOVES[direction](grid);

  if (sameLayout(grid, result.grid)) return;

  grid = result.grid;

  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (grid[i][j] !== null) {
        grid[i][j].row = i;
        grid[i][j].col = j;
      }
    }
  }
  for (const pair of result.absorbed) {
    pair.tile.row = pair.into.row;
    pair.tile.col = pair.into.col;
  }

  score += result.gained;
  if (score > best) best = score;

  addRandomTile();

  render(result.absorbed);
  updateScores();
  saveGame();
  checkEnd();
}


// ============================================================
// 7. CONTROLS  (replaces input() in main.py)
// ============================================================
const KEY_MAP = {
  arrowup: "up",
  arrowdown: "down",
  arrowleft: "left",
  arrowright: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  if (event.key === "Escape") {
    closeHelp();
    return;
  }

  const direction = KEY_MAP[event.key.toLowerCase()];
  if (direction) {
    event.preventDefault();
    handleMove(direction);
  }
});

let touchStartX = 0;
let touchStartY = 0;

boardEl.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

boardEl.addEventListener("touchend", (event) => {
  const dx = event.changedTouches[0].clientX - touchStartX;
  const dy = event.changedTouches[0].clientY - touchStartY;

  if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    handleMove(dx > 0 ? "right" : "left");
  } else {
    handleMove(dy > 0 ? "down" : "up");
  }
});

function openHelp() {
  helpModal.classList.remove("hidden");
  helpClose.focus();
}

function closeHelp() {
  if (helpModal.classList.contains("hidden")) return;
  helpModal.classList.add("hidden");
  helpBtn.focus();
}

helpBtn.addEventListener("click", openHelp);
helpClose.addEventListener("click", closeHelp);
helpModal.addEventListener("click", (event) => {
  if (event.target === helpModal) closeHelp();
});

newGameBtn.addEventListener("click", startNewGame);
tryAgainBtn.addEventListener("click", startNewGame);

keepGoingBtn.addEventListener("click", () => {
  keepPlaying = true;
  hideOverlay();
  saveGame();
  checkEnd();
});


// ============================================================
// 8. START THE GAME
// ============================================================
const savedData = loadGame();
if (savedData) {
  restoreGame(savedData);
} else {
  startNewGame();
}


// ============================================================
// 9. OFFLINE / INSTALL SUPPORT
// ============================================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .catch((error) => console.error("Service worker failed:", error));
  });
}
