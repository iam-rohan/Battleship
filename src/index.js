document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.querySelector(".game-container");

  const playerGrid = document.querySelector(".player-grid");

  const computerGrid = document.querySelector(".computer-grid");

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let playerCellDiv = document.createElement("div");
      playerCellDiv.classList.add("player-cell-div");
      playerGrid.appendChild(playerCellDiv);

      let computerCellDiv = document.createElement("div");
      computerCellDiv.classList.add("computer-cell-div");
      computerGrid.appendChild(computerCellDiv);
    }
  }
});
