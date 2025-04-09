import { Gameboard } from "./gameBoard.js";

export class Player {
  constructor(type) {
    this.type = type;
    this.board = new Gameboard();
  }

  attackOn(x, y) {
    this.board.receiveAttack(x, y);
  }
}
