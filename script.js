import Grid from "./grid.js"
import Tile from "./tile.js"

// Get grid element from the HTML and create new Grid object in this HTML
const gameBoard = document.getElementById("game-board")

const grid = new Grid(gameBoard)

// On the grid instance, choose 2 random empty cells to have 2 tiles to start game
// For each empty cell, assign "tile" property using a setter method
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true})
}
// setupInput only invokes once after being added, because if handleInput function is
// still ongoing, we dont want to allow the user to perform another keydown operation.
// Only after the movement of tiles is complete, we re-setup the event listener again

function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      moveUp()
      break
    case "ArrowDown":
      moveDown()
      break
    case "ArrowLeft":
      moveLeft()
      break
    case "ArrowRight":
      moveRight()
      break
    default:
      setupInput() // wait for another user input if other keys pressed wrongly
      return
  }
  setupInput() // after action done, wait for another user input
}

function moveUp() {
  slideTiles(grid.cellsByColumn)
}
