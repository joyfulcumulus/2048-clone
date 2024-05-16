export default class Tile {
  #tileElement
  #x
  #y
  #value

  // creates a tile HTML with class "tile", and the value is 50-50 chance of being 2 or 4
  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement("div")
    this.#tileElement.classList.add("tile")
    tileContainer.append(this.#tileElement)
    this.value = value // utilises value setter method
  }

  get value() {
    return this.#value
  }

  // setter methods which will use CSS to place the tile on screen correctly
  set x(value) {
    this.#x = value
    this.#tileElement.style.setProperty("--x", value)
  }

  set y(value) {
    this.#y = value
    this.#tileElement.style.setProperty("--y", value)
  }

  // setter method to give the tile a value, and use CSS to color the tile based on magnitude
  set value(v) {
    this.#value = v
    this.#tileElement.textContent = v
    const power = Math.log2(v)
    const backgroundLightness = 100 - (power * 9) // 2048 = 2**11, starting no. is 2 = 2**1 so there are 10 shades of color
    this.#tileElement.style.setProperty("--background-lightness", `${backgroundLightness}%`)
    this.#tileElement.style.setProperty("--text-lightness", `${backgroundLightness <= 50 ? 90 : 10}%`) // if background is light, use dark text, vice versa
  }

  remove() {
    // targets the exact HTML element in the Tile object and removes it
    this.#tileElement.remove()
  }

  waitForTransition() {
    // return a promise. The executor function only has resolve method which will happen after transition complete
    return new Promise(resolve => {
      this.#tileElement.addEventListener("transitionend", resolve, { once: true })
    })
  }
}
