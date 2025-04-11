import { Player } from "./player.js";
import { Ship } from "./ship.js";

export function initiateGame() {
  // To make sure there are ships on the board when Game starts
  let shipPlaced = false;

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

  // ——— TURN‑BY‑TURN ATTACK SETUP ———
  let currentTurn = "human";

  const computerGridCells = document.querySelectorAll(".computer-cell-button");
  computerGridCells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      if (currentTurn !== "human") return;

      const target = e.target;
      const xCord = parseInt(target.dataset.xCord, 10);
      const yCord = parseInt(target.dataset.yCord, 10);

      const result = computerPlayer.attackOn(xCord, yCord);
      markCell(target, result);

      if (computerPlayer.hasLost()) {
        document.getElementById("gameOverTextWin").style.display = "block";
        disableGrids();
        return;
      }

      currentTurn = "computer";
      computerTurn();
    });
  });

  // Common helper to style & disable a cell after attack
  function markCell(button, result) {
    button.classList.add(result === "Hit" ? "attack-hit" : "attack-miss");
    button.disabled = true;
  }

  // Computer’s automated turn
  function computerTurn() {
    if (humanPlayer.hasLost()) return;

    setTimeout(() => {
      let xCord, yCord, button;

      do {
        xCord = getRandomNumber(0, 10);
        yCord = getRandomNumber(0, 10);
        button = document.querySelector(`.player-cell-button[data-x-cord="${xCord}"][data-y-cord="${yCord}"]`);
      } while (button.disabled);

      const result = humanPlayer.attackOn(xCord, yCord);
      markCell(button, result);

      if (humanPlayer.hasLost()) {
        document.getElementById("gameOverTextLose").style.display = "block";
        disableGrids();
        return;
      }

      currentTurn = "human";
    }, 500);
  }

  disableGrids();

  // Turn by turn Attack
  function startGame() {
    const startButton = document.querySelector(".start-btn");

    setTimeout(() => {
      startButton.classList.add("start-btn-disable");
    }, 500);

    enableGrids();
    disableRandomPlacement();
  }

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
      } else if (target.textContent == "Start") {
        if (!shipPlaced) {
          alert("No Ships on the bay! Tip: Click Random Placement.");
          return;
        }
        startGame();
      }
    });
  });

  function randomPlacement() {
    revertPreviousShips();
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

    shipPlaced = true;
  }

  function revertPreviousShips() {
    humanPlayer.board.resetBoard();
    computerPlayer.board.resetBoard();

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const playerButton = document.querySelector(`.player-cell-button[data-x-cord="${i}"][data-y-cord="${j}"]`);
        const computerButton = document.querySelector(`.computer-cell-button[data-x-cord="${i}"][data-y-cord="${j}"]`);

        if (playerButton) {
          playerButton.classList.remove("ship-placed-cell");
        }
        if (computerButton) {
          computerButton.classList.remove("ship-placed-cell");
        }
      }
    }
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function getRandomDirection() {
    const toCheck = getRandomNumber(0, 2);
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

  function disableRandomPlacement() {
    const randomButton = document.querySelector(".random-btn");

    setTimeout(() => {
      randomButton.classList.add("random-btn-disable");
    }, 500);
  }
}
