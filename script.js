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

function slideTiles(cells) {
  // for each cell i in the group (col / row)
  //   1. check for each previous cell j, if can accept a tile
  //   2. mark the cell that the tile can move to with lastValidCell
  //   3. then move the tile / or leave it if cant
  // repeat steps 1-3 for next cell
  cells.forEach(group => {
    for (let i = 1; i < group.length; i++) {
      const cell = group[i]
      let lastValidCell

      for (let j = i - 1; j >= 0; j--) {
        const moveToCell = group[j]
        if (!moveToCell.canAccept(cell.tile)) break // if moveToCell cannot accept a tile, break the loop
        lastValidCell = moveToCell // if moveToCell can accept, mark lastValidCell position
      }

      // if lastValidCell has a value (means there is a cell to move to)
      // check if the cell is occupied by tile
      // if it's occupid, merge, else, move the tile over by reassigning it
      if (lastValidCell != null) {
        if (lastValidCell.tile != null) {
          lastValidCell.mergeTile = cell.tile
        } else {
        lastValidCell.tile = cell.tile
        }
        // remove tile from current cell by setting null
        cell.tile = null
      }
    }
  })
}

// Note: canAccept is a Cell class method
