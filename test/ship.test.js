import { Ship } from "../src/ship";

describe("ship", () => {
  test("ship's status update for sinking", () => {
    const titanic = new Ship(5);
    titanic.hitCount = 5;
    expect(titanic.isSunk()).toBe(true);
  });
});
