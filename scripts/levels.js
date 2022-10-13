import { ctx } from "./main.js";


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
  new Platform(460, 450, 15, 15),
  new Platform(600, 380, 15, 15),
  new Platform(100, 280, 15, 15),
  new Platform(270, 320, 15, 15),
  new Platform(300, 380, 15, 15),
  new Platform(350, 380, 15, 15)
]

