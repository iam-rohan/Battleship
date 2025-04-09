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

  assignShip(x, y, length) {
    if (length > 10) {
      throw new Error("Ship's length exceeds board size.");
    }

    // Adjusting y if ship would go out of bounds
    if (y + length > 10) {
      y = 10 - length; // shifting left so the ship fits
    }

    // Check for overlap
    for (let i = y; i < y + length; i++) {
      if (this.board[x][i] !== -1) {
        return false;
      }
    }

    const ship = new Ship(length);
    this.ships.push(ship);

    // Assign the same ship reference to all cells
    for (let i = y; i < y + length; i++) {
      this.board[x][i] = ship;
    }

    return true;
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
