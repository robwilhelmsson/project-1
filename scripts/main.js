
// ! Import
import { grid } from "./levels.js";


// ! Variables
const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext('2d')
const gravity = 0.2
const platforms = []
const rows = 35
const cols = 80
let lastKey = ''
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
}


// ! Creating class for the platform
export class Platform {
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

// ! Creating class for the lava
// class Lava extends Platform {
//   constructor(x, y) {
//     super(x, y)
//     this.width = 15
//     this.height = 15
//   }
//   draw() {
//     ctx.fillStyle = 'red'
//     ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
//   }
// }


// ! Display level function
export function displayLevel() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === 1) {
        const platform = new Platform(col * 15, row * 15)
        platforms.push(platform)
      }
    }
  }
}
displayLevel()


// ! Creating the class for player
class Player {
  constructor() {
    // * Player start position
    this.position = {
      x: 300,
      y: 250,
    }
    // * Player size & velocity
    this.width = 8
    this.height = 15
    this.velocity = {
      x: 0,
      y: 0,
    }
  }
  // * Player style & fill
  draw() {
    ctx.fillStyle = '#892CD4'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  // * Making the player move and jump
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}
const player = new Player()


// ! Collission detection function
function checkCollisions(rect1, rect2) {
  if (rect1.x >= rect2.x + rect2.width) {
    return false
  } else if (rect1.x + rect1.width <= rect2.x) {
    return false
  } else if (rect1.y >= rect2.y + rect2.height) {
    return false
  } else if (rect1.y + rect1.height <= rect2.y) {
    return false
  } else {
    return true
  }
}


// ! *******************************************************
// ! Animate Function
function animate() {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  player.update()
  platforms.forEach((platform) => {
    platform.draw()
  })
  // * Moving direction for player (left and right)
  player.velocity.x = 0
  if (keys.right.pressed && lastKey === 'ArrowLeft') {
    player.velocity.x += 3
  } else if (keys.left.pressed && lastKey === 'ArrowRight') {
    player.velocity.x -= 3
  } else {
    player.velocity.x = 0
  }

  if (keys.up.pressed)
    if (player.velocity.y === 0) {
      player.velocity.y -= 5
      console.log(player.velocity.y)
    }
  player.velocity.y += gravity


  // ! Horizontal collission square
  const xRect = {
    x: player.position.x + player.velocity.x,
    y: player.position.y,
    width: player.width,
    height: player.height,
  }
  // ! Vertical collission square
  const yRect = {
    x: player.position.x,
    y: player.position.y + player.velocity.y,
    width: player.width,
    height: player.height,
  }
  // ! Loop to check for collisions
  platforms.forEach((platform) => {
    const platformRect = {
      x: platform.position.x,
      y: platform.position.y,
      width: platform.width,
      height: platform.height,
    }
    if (checkCollisions(xRect, platformRect)) {
      // * This makes things pixel perfect 
      while (checkCollisions(xRect, platformRect)) {
        xRect.x -= Math.sign(player.velocity.x)
      }
      player.position.x = xRect.x
      player.velocity.x = 0
    }
    if (checkCollisions(yRect, platformRect)) {
      // * Do not need this while loop because the player 
      // * always stands pixel perfect on platform. 
      // while (checkCollisions(yRect, platformRect)) {
      //   yRect.y -= Math.sign(player.velocity.y)
      // }
      // player.position.y = yRect.y
      player.velocity.y = 0
    }
  })
}
animate()
// ! *******************************************************


// ! Event Listeners
addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'ArrowLeft':
      keys.left.pressed = true
      lastKey = 'ArrowRight'
      break;
    case 'ArrowRight':
      keys.right.pressed = true
      lastKey = 'ArrowLeft'
      break;
    case 'ArrowUp':
      keys.up.pressed = true
      break;
  }
})
addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'ArrowLeft':
      keys.left.pressed = false
      break;
    case 'ArrowRight':
      keys.right.pressed = false
      break;
    case 'ArrowUp':
      keys.up.pressed = false
      break
  }
})











// ! INCORRECT COLLISION DETECTION.
// ! RESULTS IN PLAYER GETTING STUCK ON PLATFORMS 
// platforms.forEach((platform) => {
// * Collision detection top of platform
//   if (player.position.y + player.height <= platform.position.y
//     && player.position.y + player.height + player.velocity.y >= platform.position.y
//     && player.position.x + player.width >= platform.position.x
//     && player.position.x <= platform.position.x + platform.width) {
//     player.velocity.y = 0
//   }
// * Collision detection bottom of platform
//   if (player.position.y <= platform.position.y + platform.height
//     && player.position.y + player.height >= platform.position.y
//     && player.position.x + player.width >= platform.position.x
//     && player.position.x <= platform.position.x + platform.width) {
//     player.velocity.y = 0
//   }

// * Collision detection sides of platform
//   if (player.position.x + player.width >= platform.position.x
//     && player.position.x <= platform.position.x + platform.width
//     && player.position.y + player.height >= platform.position.y
//     && player.position.y <= platform.position.y + platform.height) {
//     player.velocity.x = 0
//   }
// })








// class Tile {
//   constructor(x, y) {
//     this.position = {
//       x,
//       y,
//     }
//     this.width = 15
//     this.height = 15
//   }
//   draw() {
//     ctx.fillStyle = 'grey'
//     ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
//   }
// }

// class Coin {
//   constructor(x, y) {
//     this.position = {
//       x,
//       y,
//     }
//     this.width = 5
//     this.height = 5
//   }
//   draw() {
//     ctx.fillStyle = 'yellow'
//     ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
//   }
// }