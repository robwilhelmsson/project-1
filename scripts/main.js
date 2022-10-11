const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext('2d')

const gravity = 0.5
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

// ! Creating the class for player
class Player {
  constructor() {
    // * Player start position
    this.position = {
      x: 200,
      y: 450,
    }
    // * Player size & velocity
    this.width = 10
    this.height = 20
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
  constructor() {
    this.position = {
      x: 250,
      y: 420,
    }
    this.width = 200
    this.height = 20
  }
  draw() {
    ctx.fillStyle = 'black'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

// * Create new player & platform
const player = new Player()
const platform = new Platform()


// * Passing the update function to animate
function animate() {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  player.update()
  platform.draw()
  // * Moving direction for player 
  if (keys.right.pressed) {
    player.velocity.x = 5
  } else if (keys.left.pressed) {
    player.velocity.x = -5
  } else {
    player.velocity.x = 0
  }
  // * Collision detection top of platform
  if (player.position.y + player.height <= platform.position.y
    && player.position.y + player.height + player.velocity.y >= platform.position.y
    && player.position.x + player.width >= platform.position.x
    && player.position.x <= platform.position.x + platform.width) {
    player.velocity.y = 0
  }
  // * Collision detection bottom of platform
  if (player.position.y >= platform.position.y - platform.height
    && player.position.y <= platform.position.y + platform.height
    && player.position.x + player.width >= platform.position.x
    && player.position.x <= platform.position.x + platform.width) {
    player.velocity.y = 1
  }
  // * Collision detection sides of platform
  if (player.position.x + player.width >= platform.position.x 
    && player.position.x <= platform.position.x + platform.width
    && player.position.y + player.height >= platform.position.y
    && player.position.y <= platform.position.y + platform.height) {
    player.velocity.x = 0
  }
}
animate()

// ! Arrow keys for movement 
addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      keys.left.pressed = true
      console.log('left')
      break;

    case 39:
      keys.right.pressed = true
      console.log('right')
      break;

    case 38:
      player.velocity.y -= 10
      console.log('up')
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

    case 38:
      player.velocity.y = 0
      break;
  }
})