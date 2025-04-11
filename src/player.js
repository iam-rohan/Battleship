import { Gameboard } from "./gameBoard.js";

export class Player {
  constructor(type) {
    this.type = type;
    this.board = new Gameboard();
  }

  attackOn(x, y) {
    return this.board.receiveAttack(x, y);
  }

  placeShip(x, y, length, direction) {
    return this.board.assignShip(x, y, length, direction);
  }

  hasLost() {
    return this.board.isGameOver();
  }
}
