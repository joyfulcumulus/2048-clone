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
  // getter to return array of cells by Column for sliding up/down action
  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [] // init empty array for each col if not done
      cellGrid[cell.x][cell.y] = cell // transpose the position of the cell in the new array inside cellGrid
      return cellGrid
    }, [])
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
  #mergeTile

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement
    this.#x = x
    this.#y = y
  }

  get x() {
    return this.#x
  }

  get y() {
    return this.#y
  }

  get tile() {
    return this.#tile
  }

  set tile(value) {
    this.#tile = value // can be a Tile object or null
    if (value == null) return // means this cell has no tile anymore

    // if tile has a Tile object, set its position to same x,y as its Cell
    // (Utilises the Tile class's x and y setter methods)
    this.#tile.x = this.#x
    this.#tile.y = this.#y
  }

  get mergeTile () {
    return this.#mergeTile
  }

  set mergeTile(value) {
    this.#mergeTile = value
    if (value == null) return
    this.#mergeTile.x = this.#x
    this.#mergeTile.y = this.#y
  }

  canAccept(tile) {
    // accept conditions:
    // 1. the cell instance has no tile OR
    // 2. this cell's tile has same value as the tile passed in AND no merge done in earlier tiles of the group
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    )
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
