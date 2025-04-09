import { Player } from "./player.js";

export function initiateGame() {
  const humanPlayer = new Player("human");
  const computerPlayer = new Player("computer");
  const playerGrid = document.querySelector(".player-grid");

  const computerGrid = document.querySelector(".computer-grid");

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let playerCellButton = document.createElement("button");
      playerCellButton.classList.add("player-cell-button", "attack-btn", "btn");
      playerCellButton.dataset.xCord = i;
      playerCellButton.dataset.yCord = j;
      playerGrid.appendChild(playerCellButton);

      let computerCellButton = document.createElement("button");
      computerCellButton.classList.add("computer-cell-button", "attack-btn", "btn");
      computerCellButton.dataset.yCord = i;
      computerCellButton.dataset.xCord = j;
      computerGrid.appendChild(computerCellButton);
    }
  }

  // To handle all the button clicks

  const buttons = document.querySelectorAll(".attack-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.target;

      const xCord = e.target.dataset.xCord;
      const yCord = e.target.dataset.yCord;

      if (target.classList.contains("player-cell-button")) {
        console.log("player [" + xCord + " , " + yCord + "]");
        humanPlayer.attackOn(xCord, yCord);
      }

      if (target.classList.contains("computer-cell-button")) {
        console.log("computer [" + xCord + " , " + yCord + "]");
        computerPlayer.attackOn(xCord, yCord);
      }
    });
  });
}
