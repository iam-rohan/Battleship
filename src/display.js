import { Player } from "./player.js";
import { Ship } from "./ship.js";

export function initiateGame() {
  function restart() {
    // Reload the page to reset the game state
    window.location.reload();
  }

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
      computerCellButton.dataset.xCord = i;
      computerCellButton.dataset.yCord = j;
      computerGrid.appendChild(computerCellButton);
    }
  }

  // To handle all the attack clicks

  const buttons = document.querySelectorAll(".attack-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.target;

      const xCord = e.target.dataset.xCord;
      const yCord = e.target.dataset.yCord;

      if (target.classList.contains("player-cell-button")) {
        let hitOrMiss = humanPlayer.attackOn(xCord, yCord);

        if (hitOrMiss === "Hit") {
          button.classList.add("attack-hit");
          button.disabled = true;
        } else if (hitOrMiss === "Miss") {
          button.classList.add("attack-miss");
          button.disabled = true;
        }
      }

      if (target.classList.contains("computer-cell-button")) {
        let hitOrMiss = computerPlayer.attackOn(xCord, yCord);

        if (hitOrMiss === "Hit") {
          button.classList.add("attack-hit");
          button.disabled = true;
        } else if (hitOrMiss === "Miss") {
          button.classList.add("attack-miss");
          button.disabled = true;
        }
      }

      if (humanPlayer.hasLost()) {
        document.getElementById("gameOverTextHuman").style.display = "block";
        disableGrids();
      } else if (computerPlayer.hasLost()) {
        document.getElementById("gameOverTextComputer").style.display = "block";
        disableGrids();
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

  const stateButtonsDiv = document.querySelector(".state-buttons");

  const stateButtons = stateButtonsDiv.querySelectorAll("button");

  stateButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.target;

      if (target.textContent == "Random Placement") {
        randomPlacement();
      } else if (target.textContent == "Restart") {
        restart();
      }
    });
  });

  function randomPlacement() {
    shipsToDeploy.forEach((ship) => {
      humanPlayer.placeShip(getRandomNumber(0, 9), getRandomNumber(0, 9), ship[1], getRandomDirection());
      computerPlayer.placeShip(getRandomNumber(0, 9), getRandomNumber(0, 9), ship[1], getRandomDirection());
    });

    console.log(humanPlayer.board);
    console.log(computerPlayer.board);

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (humanPlayer.board.board[i][j] instanceof Ship) {
          const button = document.querySelector(`.player-cell-button[data-x-cord="${i}"][data-y-cord="${j}"]`);
          if (button) button.classList.add("ship-placed-cell");
        }
      }
    }
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function getRandomDirection() {
    const toCheck = getRandomNumber(0, 1);
    if (toCheck == 0) {
      return "horizontal";
    } else {
      return "vertical";
    }
  }

  function disableGrids() {
    const playerGrid = document.querySelector(".player-grid");
    const computerGrid = document.querySelector(".computer-grid");

    playerGrid.classList.add("grid-disabled");
    computerGrid.classList.add("grid-disabled");

    // For smoothing the visuals
    setTimeout(() => {
      playerGrid.classList.remove("grid-enabled");
      computerGrid.classList.remove("grid-enabled");
    }, 500);
  }

  function enableGrids() {
    const playerGrid = document.querySelector(".player-grid");
    const computerGrid = document.querySelector(".computer-grid");

    playerGrid.classList.add("grid-enabled");
    computerGrid.classList.add("grid-enabled");

    // For smoothing the visuals
    setTimeout(() => {
      playerGrid.classList.remove("grid-disabled");
      computerGrid.classList.remove("grid-disabled");
    }, 500);
  }
}
