import Grid from "./grid.js"
import Tile from "./tile.js"

// Get grid element from the HTML and create new Grid object in this HTML
const gameBoard = document.getElementById("game-board")

const grid = new Grid(gameBoard)

// On the grid instance, choose 2 random empty cells to have 2 tiles to start game
// For each empty cell, assign "tile" property using a setter method
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
