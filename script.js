import Grid from "./grid.js"
import Tile from "./tile.js"

// initialise variables to detect touch interaction on mobile
let startX;
let endX;
let startY;
let endY;

// Get grid element from the HTML and create new Grid object in this HTML
const gameBoard = document.getElementById("game-board")

const grid = new Grid(gameBoard)

// On the grid instance, choose 2 random empty cells to have 2 tiles to start game
// For each empty cell, assign "tile" property using a setter method
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)

// init first event listener for game start
setupInput()

// setupInput only invokes once after being added, because if handleInput function is
// still ongoing, we dont want to allow the user to perform another keydown operation.
// Only after the movement of tiles is complete, we re-setup the event listener again
function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true})

  window.addEventListener("touchstart", handleTouchStart, { once: true})
  window.addEventListener("touchend", handleTouchInput, { once: true})
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput()
        return
      }
      await moveUp()
      break
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput()
        return
      }
      await moveDown()
      break
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput()
        return
      }
      await moveLeft()
      break
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput()
        return
      }
      await moveRight()
      break
    default:
      setupInput() // wait for another user input if other keys pressed wrongly
      return
  }

  grid.cells.forEach(cell => cell.mergeTiles()) // merge overlapping tiles on each cell if any

  const newTile = new Tile(gameBoard)
  grid.randomEmptyCell().tile = newTile // add new tile to board after valid user input

  // check if user has lost, if havent continue game to accept next user input
  // if lost, wait for newTile to appear (animation finished), then pop up alert
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      alert("You lose")
    })
    return
  }
  // if lost, wait for newTile animation to finish, then have alert

  setupInput()
}

function handleTouchStart(e) {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}

async function handleTouchInput(e) {
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;

  let swipeDistanceX = endX - startX;
  let swipeDistanceY = endY - startY;
  let swipeThreshold = 0.2 * Math.min(window.innerWidth, window.innerHeight);

  switch (true) {
    case Math.abs(swipeDistanceY) > Math.abs(swipeDistanceX) && swipeDistanceY < -swipeThreshold:
      if (!canMoveUp()) {
        setupInput()
        return
      }
      await moveUp()
      break
    case Math.abs(swipeDistanceY) > Math.abs(swipeDistanceX) && swipeDistanceY > swipeThreshold:
      if (!canMoveDown()) {
        setupInput()
        return
      }
      await moveDown()
      break
    case Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) && swipeDistanceX < -swipeThreshold:
      if (!canMoveLeft()) {
        setupInput()
        return
      }
      await moveLeft()
      break
    case Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) && swipeDistanceX > swipeThreshold:
      if (!canMoveRight()) {
        setupInput()
        return
      }
      await moveRight()
      break
    default:
      setupInput(); // Wait for another user input if no swipe meeting threshold detected
      return
  }

  grid.cells.forEach(cell => cell.mergeTiles()) // merge overlapping tiles on each cell if any

  const newTile = new Tile(gameBoard)
  grid.randomEmptyCell().tile = newTile // add new tile to board after valid user input

  // check if user has lost, if havent continue game to accept next user input
  // if lost, wait for newTile to appear (animation finished), then pop up alert
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      alert("You lose")
    })
    return
  }
  // if lost, wait for newTile animation to finish, then have alert

  setupInput()
}

function moveUp() {
  slideTiles(grid.cellsByColumn)
}

function moveDown() {
  slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
  // reverse direction of cells in each column before passing into slideTiles
}

function moveLeft() {
  slideTiles(grid.cellsByRow)
}

function moveRight() {
  slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
  // reverse direction of cells in each column before passing into slideTiles
}

function slideTiles(cells) {
  return Promise.all(
    // for each cell i in the group (col / row)
    //   1. check for each previous cell j, if can accept a tile
    //   2. mark the cell that the tile can move to with lastValidCell
    //   3. then move the tile / or leave it if cant
    // repeat steps 1-3 for next cell
    cells.flatMap(group => {
      const promises = []

      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue // if cell has no tile, check next cell, skip code below
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
          promises.push(cell.tile.waitForTransition()) // resolve promise each time transitionend
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile // update lastValidCell.mergeTile property so there are now 2 tiles on lastValidCell
          } else {
          lastValidCell.tile = cell.tile // no merging, just move the cell's tile info over
          }
          // remove tile from current cell by setting null
          cell.tile = null
        }
      }

      return promises // after all waitForTransition() promises completed, return promise array
    })
  )
}
// Note: canAccept is a Cell class method

function canMoveUp() {
  return canMove(grid.cellsByColumn)
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

function canMoveLeft() {
  return canMove(grid.cellsByRow)
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cells) {
  // usage of some() means if true for at least 1 cell in 1 group, will return true
  return cells.some(group => {
    return group.some((cell, index) => {
      // guard clauses: if cell is 1st pos, cannot move
      // guard clauses: if no tile in cell, nothing to move
      if (index === 0) return false
      if (cell.tile == null) return false

      // for each remaining cell in the group, check if preceding cell can accept it
      const moveToCell = group[index - 1]
      return moveToCell.canAccept(cell.tile)
    })
  })
}
