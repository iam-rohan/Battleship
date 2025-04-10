import { Gameboard } from "./gameBoard.js";

export class Player {
  constructor(type) {
    this.type = type;
    this.board = new Gameboard();
  }

  attackOn(x, y) {
    return this.board.receiveAttack(x, y);
  }

  placeShip(x, y, length) {
    this.board.assignShip(x, y, length);
  }

  hasLost() {
    this.board.isGameOver();
  }
}
