import { Gameboard } from "../src/gameBoard";
import { Ship } from "../src/ship";

describe("GameBoard", () => {
  let warZone;

  beforeEach(() => {
    warZone = new Gameboard();
  });

  test("Gameboard Defined", () => {
    expect(Gameboard).toBeDefined();
  });

  test("Gameboard has assigned values", () => {
    expect(warZone.board[5][4]).toBe(-1);
  });

  test("can assign ships to specific coordinates", () => {
    warZone.assignShip(5, 4, 4);
    expect(warZone.board[5][4]).toBeInstanceOf(Ship);
  });

  test("can deploy ship of given length on the board", () => {
    const startx = 5,
      starty = 4,
      length = 4;
    warZone.assignShip(startx, starty, length);
    let requiredEntity = warZone.board[startx][starty];

    for (let i = startx; i <= length; i++) {
      expect(warZone.board[5][i]).toBe(requiredEntity);
    }
  });

  test("GameBoard can identify already assigned cell and reject reassignment", () => {
    let toSucess = warZone.assignShip(5, 4, 3);

    let toFail = warZone.assignShip(5, 2, 5);

    expect(toSucess).toBeTruthy();
    expect(toFail).toBeFalsy();
  });

  test("Gameboard is able to process a attack on a ship", () => {
    warZone.assignShip(4, 3, 3);

    warZone.receiveAttack(4, 4);
    let attackedShip1 = warZone.board[4][4];
    expect(attackedShip1.hitCount).toBe(1); //That ship should be hit once

    warZone.receiveAttack(4, 5);
    let attackedShip2 = warZone.board[4][5];
    expect(attackedShip2.hitCount).toBe(2); //That ship should be hit twice
  });

  test("Check if all ships are sunk and game is over", () => {
    warZone.assignShip(4, 4, 2);
    warZone.assignShip(4, 1, 3);
    warZone.receiveAttack(4, 4);
    warZone.receiveAttack(4, 5);

    expect(warZone.isGameOver()).toBeFalsy();

    warZone.receiveAttack(4, 1);
    warZone.receiveAttack(4, 2);
    warZone.receiveAttack(4, 3);

    expect(warZone.isGameOver()).toBeTruthy();
  });
});
