import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {
    this.board = this.generateboard();
    this.ships = []; //to account for all the ships created
    this.gameOver = false; //to report if game is over(all ships sunk)
  }

  generateboard() {
    //board creation
    let board = [];
    for (let i = 0; i < 10; i++) {
      board[i] = [];
      for (let j = 0; j < 10; j++) {
        board[i][j] = -1;
      }
    }
    return board;
  }

  resetBoard() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(-1));
    this.ships = [];
  }

  assignShip(x, y, length, direction) {
    if (length > 10) {
      throw new Error("Ship's length exceeds board size.");
    }

    // Helper function to check if we can place ship starting at (i, j)
    const isValidPosition = (i, j) => {
      if (direction === "horizontal") {
        if (j + length > 10) return false;
        for (let k = 0; k < length; k++) {
          if (this.board[i][j + k] !== -1) return false;
        }
      } else {
        if (i + length > 10) return false;
        for (let k = 0; k < length; k++) {
          if (this.board[i + k][j] !== -1) return false;
        }
      }
      return true;
    };

    // Helper function to place the ship
    const placeShip = (i, j, ship) => {
      if (direction === "horizontal") {
        for (let k = 0; k < length; k++) {
          this.board[i][j + k] = ship;
        }
      } else {
        for (let k = 0; k < length; k++) {
          this.board[i + k][j] = ship;
        }
      }
    };

    // Try the original position first
    if (isValidPosition(x, y)) {
      const ship = new Ship(length);
      this.ships.push(ship);
      placeShip(x, y, ship);
      return true;
    }

    // Else scan the board for the first valid empty spot
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (isValidPosition(i, j)) {
          const ship = new Ship(length);
          this.ships.push(ship);
          placeShip(i, j, ship);
          return true;
        }
      }
    }

    // No valid space found
    return false;
  }

  receiveAttack(x, y) {
    let attackedCell = this.board[x][y];

    if (attackedCell == 0) {
      return "Already attacked"; //Already been attacked
    } else if (attackedCell == -1) {
      this.board[x][y] = 0; // to keep track of missed attacks

      return "Miss"; //Attacked for the first time but no ship there
    } else if (attackedCell instanceof Ship) {
      attackedCell.hitCount++; //Updating the hitCount of that ship

      attackedCell.isSunk(); //Checking the sinking status

      if (this.ships.every((ship) => ship.isSunk())) {
        this.gameOver = true;
      }

      return "Hit";
    }
  }

  isGameOver() {
    //check if all ships are sunk
    return this.gameOver;
  }
}
