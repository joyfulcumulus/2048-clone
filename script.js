import Grid from "./grid.js"

// Get grid element from the HTML and create new Grid object
const gameBoard = document.getElementById("game-board")

const grid = new Grid(gameBoard)
