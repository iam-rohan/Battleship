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

  // Function to check if all ships are placed
  function allShipsPlaced() {
    const ships = shipsToPlace.querySelectorAll(".draggable-ships");
    for (let ship of ships) {
      if (!ship.classList.contains("ship-placed")) {
        return false; // A ship is not placed
      }
    }
    return true; // All ships are placed
  }

  // Turn by turn Attack
  function startGame() {
    if (allShipsPlaced()) {
      const startButton = document.querySelector(".start-btn");

      setTimeout(() => {
        startButton.classList.add("start-btn-disable");
      }, 500);

      enableGrids();
      disableRandomPlacement();
      randomPlacement("computer");
      console.log(humanPlayer.board);
      console.log(computerPlayer.board);
    } else {
      alert("Can't start game until all ships are placed. You can use Random Placement instaed then start.");
    }
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
    ship.classList.add(className, "draggable-ships");
    shipsToPlace.appendChild(ship);
  }

  const stateButtonsDiv = document.querySelector(".state-buttons");

  const stateButtons = stateButtonsDiv.querySelectorAll("button");

  stateButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.target;

      if (target.textContent == "Random Placement") {
        randomPlacement("human");
        randomPlacement("computer");
      } else if (target.textContent == "Restart") {
        restart();
      } else if (target.textContent == "Start") {
        startGame();
      }
    });
  });

  function randomPlacement(player) {
    revertPreviousShips(player);

    shipsToDeploy.forEach((ship) => {
      const x = getRandomNumber(0, 9);
      const y = getRandomNumber(0, 9);
      const direction = getRandomDirection();

      if (player === "human") {
        humanPlayer.placeShip(x, y, ship[1], direction);
      } else if (player === "computer") {
        computerPlayer.placeShip(x, y, ship[1], direction);
      }
    });

    if (player === "human") {
      // Update the human grid visually
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (humanPlayer.board.board[i][j] instanceof Ship) {
            const button = document.querySelector(`.player-cell-button[data-x-cord="${i}"][data-y-cord="${j}"]`);
            if (button) button.classList.add("ship-placed-cell");
          }
        }
      }

      const dragShips = document.querySelectorAll(".draggable-ships");
      dragShips.forEach((ship) => {
        ship.classList.add("ship-placed");
        ship.style.display = "none";
      });
    }
  }

  function revertPreviousShips(player) {
    if (player === "human" || player === "both") {
      humanPlayer.board.resetBoard();

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const playerButton = document.querySelector(`.player-cell-button[data-x-cord="${i}"][data-y-cord="${j}"]`);
          if (playerButton) {
            playerButton.classList.remove("ship-placed-cell");
          }
        }
      }
    }

    if (player === "computer" || player === "both") {
      computerPlayer.board.resetBoard();

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const computerButton = document.querySelector(`.computer-cell-button[data-x-cord="${i}"][data-y-cord="${j}"]`);
          if (computerButton) {
            computerButton.classList.remove("ship-placed-cell");
          }
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

  // To implement Drag and Drop
  const dragShips = document.querySelectorAll(".draggable-ships");

  let isDragging = false;
  let currentShip = null;
  let startX = 0,
    startY = 0,
    currentX = 0,
    currentY = 0;

  function dragStart(e) {
    isDragging = true;
    currentShip = e.currentTarget;

    currentX = 0;
    currentY = 0;

    startX = e.clientX;
    startY = e.clientY;

    currentShip.style.cursor = "grabbing";
  }

  dragShips.forEach((ship) => {
    ship.addEventListener("mousedown", dragStart);
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging || !currentShip) return;

    currentX = e.clientX - startX;
    currentY = e.clientY - startY;

    currentShip.style.transform = `translate(${currentX}px, ${currentY}px)`;
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging || !currentShip) return;

    isDragging = false;
    currentShip.style.cursor = "grab";

    const shipRect = currentShip.getBoundingClientRect();
    const gridCells = document.querySelectorAll(".player-cell-button");

    let targetCell = null;

    for (let cell of gridCells) {
      const rect = cell.getBoundingClientRect();

      if (shipRect.left >= rect.left && shipRect.left < rect.right && shipRect.top >= rect.top && shipRect.top < rect.bottom) {
        targetCell = cell;
        break;
      }
    }

    if (targetCell) {
      const x = parseInt(targetCell.dataset.xCord, 10);
      const y = parseInt(targetCell.dataset.yCord, 10);
      const length = parseInt(currentShip.dataset.length, 10);
      const direction = "horizontal"; // You can allow rotation later

      // Prevent overlap by checking the cells where the ship would be placed
      const isOverlapping = checkOverlap(x, y, length, direction);
      if (!isOverlapping) {
        // VALID placement
        humanPlayer.placeShip(x, y, length, direction);

        for (let i = 0; i < length; i++) {
          const cell = document.querySelector(`.player-cell-button[data-x-cord="${x}"][data-y-cord="${y + i}"]`);
          if (cell) cell.classList.add("ship-placed-cell");
        }

        currentShip.style.transform = "none";
        currentShip.style.display = "none";
        currentShip.classList.add("ship-placed");
        currentShip.removeEventListener("mousedown", dragStart);
        currentShip.style.pointerEvents = "none";
        currentShip.style.opacity = "0.5";
        currentShip = null;
      } else {
        //INVALID placement (overlap)
        currentShip.classList.add("invalid-placement");
        setTimeout(() => {
          currentShip.classList.remove("invalid-placement");
        }, 300);
        currentShip.style.transform = "none";
      }
    } else {
      currentShip.style.transform = "none";
    }

    currentShip = null;
  });

  // Check if the ship overlaps with any existing ship
  function checkOverlap(x, y, length, direction) {
    for (let i = 0; i < length; i++) {
      const cell = document.querySelector(`.player-cell-button[data-x-cord="${x}"][data-y-cord="${y + i}"]`);
      if (cell && cell.classList.contains("ship-placed-cell")) {
        return true; // The cell is occupied by another ship
      }
    }
    return false; // No overlap
  }
}
