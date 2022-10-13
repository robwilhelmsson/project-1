
// ! DOM Selectors
export const canvas = document.querySelector('.canvas')
export const ctx = canvas.getContext('2d')

// ! Page Style


// ! Creating class for the platform
class Platform {
  constructor(x, y, width, height) {
    this.position = {
      x,
      y,
    }
    this.width = width
    this.height = height
  }
  draw() {
    ctx.fillStyle = 'black'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}


export const platforms = [
  new Platform(460, 450, 50, 50),
  new Platform(600, 380, 50, 50),
  new Platform(100, 280, 50, 50),
  new Platform(230, 320, 50, 50),
  new Platform(350, 380, 50, 50)
]

