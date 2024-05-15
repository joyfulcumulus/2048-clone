const GRID_SIZE = 4
const CELL_SIZE = 20
const CELL_GAP = 2

export default class Grid {
  #cells

  constructor(gridElement) {
    // set layout of gameboard in css
    gridElement.style.setProperty("--grid-size", GRID_SIZE)
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)
    // create divs with class "cell" in gameboard based on grid_size
    // create an array of JS Cell objects using map, based on each "cell" div
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE))
    })
  }

  // private getter to retrieve all empty cells (without tiles) as an array
  get #emptyCells() {
    return this.#cells.filter(cell => cell.tile == null)
  }

  // pick a random empty cell and return it
  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
    return this.#emptyCells[randomIndex]
  }
}

class Cell {
  #cellElement
  #x
  #y
  #tile

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement
    this.#x = x
    this.#y = y
  }

  get tile() {
    return this.#tile
  }

  set tile(value) {
    this.#tile = value
    if (value == null) return // means this cell has no tile anymore

    // if tile has value (e.g. 2, 4, 8) set its position to same x,y as its Cell
    this.#tile.x = this.#x
    this.#tile.y = this.#y
  }
}

function createCellElements(gridElement) {
  const cells = []
  for (let i = 0; i < GRID_SIZE ** 2; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cells.push(cell)
    gridElement.append(cell)
  }
  return cells // array output will be used in chained .map
}
