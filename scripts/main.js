// ! DOM Selectors
const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext('2d')


// ! Variables
const gravity = 0.18
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
}
let lastKey


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
    this.height = 14
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

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity
    } else {
      this.velocity.y = 0
    }
  }
}


// ! Creating class for the platforms
class Platform {
  constructor(x, y) {
    this.position = {
      x,
      y,
    }
    this.width = 14
    this.height = 60
  }
  draw() {
    ctx.fillStyle = 'black'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}


// ! Create new player & platform
const player = new Player()
const platforms = [ new Platform(250, 420)
]


// ! Create new player & platform
function animate() {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  player.update()
  platforms.draw()
  // * Moving direction for player 
  player.velocity.x = 0
  if (keys.right.pressed && lastKey === 39) {
    player.velocity.x = 3
  } else if (keys.left.pressed && lastKey === 37) {
    player.velocity.x = -3
  } else {
    player.velocity.x = 0
  }

  // * Collision detection top of platform
  if (player.position.y + player.height <= platforms.position.y
    && player.position.y + player.height + player.velocity.y >= platforms.position.y
    && player.position.x + player.width >= platforms.position.x
    && player.position.x <= platforms.position.x + platforms.width) {
    player.velocity.y = 0
  }
  // * Collision detection bottom of platform
  if (player.position.y >= platforms.position.y - platforms.height
    && player.position.y <= platforms.position.y + platforms.height
    && player.position.x + player.width >= platforms.position.x
    && player.position.x <= platforms.position.x + platforms.width) {
    player.velocity.y = 1
  }
  // * Collision detection sides of platform
  if (player.position.x + player.width >= platforms.position.x
    && player.position.x <= platforms.position.x + platforms.width
    && player.position.y + player.height >= platforms.position.y
    && player.position.y <= platforms.position.y + platforms.height) {
    player.velocity.x = 0
    // player.velocity.y = 2
  }
}
animate()


// ! Event Listeners
addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      keys.left.pressed = true
      lastKey = 37
      break;
    case 39:
      keys.right.pressed = true
      lastKey = 39
      break;
    case 38:
      if (player.velocity.y === 0) {
        player.velocity.y -= 5
        // console.log('up')
      }
      break;
  }
})

addEventListener('keyup', ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      keys.left.pressed = false
      break;
    case 39:
      keys.right.pressed = false
      break;
  }
})