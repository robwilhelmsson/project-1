

// ! DOM Selectors
export const canvas = document.querySelector('.canvas')
export const ctx = canvas.getContext('2d')

// ! Creating class for the platform
class Platform {
  constructor(x, y) {
    this.position = {
      x,
      y,
    }
    this.width = 15
    this.height = 15
  }
  draw() {
    ctx.fillStyle = 'black'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}


export const platforms = [new Platform(200, 200)]