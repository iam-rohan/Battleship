export class Ship {
  constructor(length) {
    this.length = length;
    this.hitCount = 0;
    this.sunk = false;
  }
  isSunk() {
    if (this.length == this.hitCount) {
      this.sunk = true;
    } else {
      this.sunk = false;
    }
    return this.sunk;
  }
}
