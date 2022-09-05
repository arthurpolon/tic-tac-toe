// visual 2d array reference => https://media.geeksforgeeks.org/wp-content/uploads/two-d.png

const gameElement = document.querySelector("#game");
const outputElement = document.querySelector("#output");
const resetButton = document.querySelector("#reset");

let cellElements = [];

function map2d(arr, callback) {
  const mappedArray = Array.from({ length: arr.length }, (value, index) => {
    return Array.from({ length: arr[index].length });
  });

  for (let row = 0; row < arr.length; row++) {
    for (let column = 0; column < arr[row].length; column++) {
      const value = callback(arr[row][column], row, column, arr);

      mappedArray[row][column] = value;
    }
  }

  return mappedArray;
}

function some2d(arr, callback) {
  for (let row = 0; row < arr.length; row++) {
    for (let column = 0; column < arr[row].length; column++) {
      const condition = callback(arr[row][column], row, column, arr);

      if (condition === true) {
        return true;
      }
    }
  }

  return false;
}

function checkAllEqual(arr) {
  const uniqueArray = [...new Set(arr)];

  return uniqueArray.length === 1;
}

class Game {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  players = { X: "X", O: "O" };
  currentPlayer = "X";
  isGameOver = false;
  result = null; // null | 'tie' | 'X' | 'O'

  swapPlayers() {
    const nextPlayer =
      this.currentPlayer === this.players.X ? this.players.O : this.players.X;

    this.currentPlayer = nextPlayer;
  }

  move(row, column) {
    if (this.isGameOver) {
      return;
    }

    const cellIsAlreadyMarked = this.board[row][column] !== "";

    if (cellIsAlreadyMarked) {
      return;
    }

    this.board[row][column] = this.currentPlayer;

    this.checkWin();

    this.swapPlayers.bind(this)();
  }

  checkWin() {
    const hasAvailableSpace = some2d(this.board, (value) => value === "");

    if (hasAvailableSpace === false) {
      this.isGameOver = true;
      this.result = "tie";
      return;
    }

    // Diagonals
    const diagonalOne = [this.board[0][0], this.board[1][1], this.board[2][2]];
    const diagonalTwo = [this.board[2][0], this.board[1][1], this.board[0][2]];

    const isDiagonalOneEmpty = diagonalOne.every((cell) => cell === "");
    const isDiagonalTwoEmpty = diagonalTwo.every((cell) => cell === "");

    if (isDiagonalOneEmpty || isDiagonalTwoEmpty) {
      return;
    }

    if (checkAllEqual(diagonalOne) || checkAllEqual(diagonalTwo)) {
      this.isGameOver = true;
      this.result = this.currentPlayer;
      return;
    }

    // horizontal and vertical
    for (let idx = 0; idx < 3; idx++) {
      const horizontalCells = this.board[idx];
      const verticalCells = [
        this.board[0][idx],
        this.board[1][idx],
        this.board[2][idx],
      ];

      const isVerticalEmpty = verticalCells.every((cell) => cell === "");
      const isHorizontalEmpty = horizontalCells.every((cell) => cell === "");

      if (isHorizontalEmpty || isVerticalEmpty) {
        continue;
      }

      if (checkAllEqual(horizontalCells)) {
        this.isGameOver = true;
        this.result = this.currentPlayer;
        return;
      }

      if (checkAllEqual(verticalCells)) {
        this.isGameOver = true;
        this.result = this.currentPlayer;
        return;
      }
    }
  }

  reset() {
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    this.currentPlayer = "X";
    this.isGameOver = false;
    this.result = null;
  }

  get gameState() {
    const { board, currentPlayer, isGameOver, result } = this;

    return {
      board,
      result,
      isGameOver,
      currentPlayer,
    };
  }
}

function render(game) {
  const { board, isGameOver, result } = game.gameState;

  if (isGameOver) {
    switch (result) {
      case "tie":
        outputElement.textContent = "It is a Tie";
        break;
      case "X":
        outputElement.textContent = "X is the Winner!";
        break;
      case "O":
        outputElement.textContent = "O is the Winner!";
        break;
    }
  } else {
    outputElement.textContent = "";
  }

  map2d(board, (value, row, column) => {
    const cell = document.querySelector(`#row${row}-col${column}`);

    cell.textContent = value;
  });
}

function main() {
  const game = new Game();

  const { board } = game.gameState;

  resetButton.addEventListener("click", () => {
    game.reset();

    render(game);
  });

  cellElements = map2d(board, (value, row, column) => {
    const cell = document.querySelector(`#row${row}-col${column}`);

    cell.addEventListener("click", () => {
      game.move(row, column);

      render(game);
    });

    return cell;
  });
}

main();
