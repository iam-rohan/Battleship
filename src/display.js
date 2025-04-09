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

  const shipsToPlace = document.querySelector(".ship-container");

  const shipsToDeploy = [
    ["Aircraft Carrier", 5],
    ["Assault Ship", 4],
    ["Cruiser", 4],
    ["Destroyer", 3],
    ["Frigate", 2],
  ];

  for (const [name, length] of shipsToDeploy) {
    const ship = document.createElement("div");
    ship.dataset.length = length;

    //changing the name so that it can be added as a class
    const className = name.toLowerCase().replace(/\s+/g, "-");
    ship.textContent = name;
    ship.classList.add(className);
    shipsToPlace.appendChild(ship);
  }
}
