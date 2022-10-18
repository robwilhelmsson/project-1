
// ! Import
import { levelsObject } from './levels.js'

// ! DOM
const canvasGame = document.querySelector('.canvas-game')

// ! Variables
const ctx = canvasGame.getContext('2d')
const gravity = 0.2
let platforms = []
let lavas = []
let coins = []
let downLava = []
let coinsCollect = 0
let level = 0
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
const rockImg = new Image()
rockImg.src = '../assets/rock.jpg'


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
    ctx.drawImage(rockImg, this.position.x, this.position.y, this.width, this.height)
  }
}

// ! Creating class for the lava
class Lava {
  constructor(x, y) {
    this.position = {
      x,
      y,
    }
    this.width = 15
    this.height = 15
  }
  draw() {
    ctx.fillStyle = 'red'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}
// ! Creating class for the up and down lava
class DownLava {
  constructor(x, y) {
    this.position = {
      x,
      y,
    }
    this.width = 15
    this.height = 15
    this.velocity = {
      x,
      y,
    }
  }
  draw() {
    ctx.fillStyle = 'orange'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  update() {
    this.draw()
    this.position.y += 0.5
  }
}

// ! Creating class for the coin
class Coin {
  constructor(x, y) {
    this.position = {
      x,
      y,
    }
    this.width = 5
    this.height = 5
  }
  draw() {
    ctx.fillStyle = 'yellow'
    ctx.fillRect(this.position.x + 5, this.position.y + 5, this.width, this.height)
  }
}


// ! Display level function (1 - platform, 2 - lava, 3 - coinc)
// * The display level function allows arguments of level for condition checks
function displayLevel(levelNum) {
  platforms = []
  lavas = []
  coins = []
  downLava = []
  const level = levelsObject[levelNum]
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (level[row][col] === 1) {
        const platform = new Platform(col * 15, row * 15)
        platforms.push(platform)
      }
      if (level[row][col] === 2) {
        const lava = new Lava(col * 15, row * 15)
        lavas.push(lava)
      }
      if (level[row][col] === 3) {
        const coin = new Coin(col * 15, row * 15)
        coins.push(coin)
      }
      if (level[row][col] === 4) {
        const movingLava = new DownLava(col * 15, row * 15)
        downLava.push(movingLava)
      }
    }
  }
}
displayLevel(4)

// ! Creating the class for player
class Player {
  constructor() {
    // * Player start position
    this.position = {
      x: 90,
      y: 400,
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
    this.height = 15
    this.width = 8

  }
  drawWin() {
    ctx.fillStyle = 'green'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  drawLose() {
    // ctx.clearRect(this.position.x, this.position.y, this.width, this.height)
    // this.height = 5
    // ctx.fillStyle = 'red'
    // console.log(this.position.x, this.position.y, this.height, this.width)
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

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


// ! Reset Level function
function resetLevel() {
  // player.drawLose()
  player.position.x = 90
  player.position.y = 400
  requestAnimationFrame(animate)
}


function resetPlayer() {
  player.position.x = 90
  player.position.y = 400
}

// ! ******************** Animate Function ***************************
function animate() {
  console.log('animate')
  ctx.clearRect(0, 0, canvasGame.width, canvasGame.height)
  // * Drawing the different level items
  player.update()
  platforms.forEach((platform) => {
    platform.draw()
  })
  lavas.forEach((lava) => {
    lava.draw()
  })
  coins.forEach((coin) => {
    coin.draw()
  })
  downLava.forEach((dl) => {
    dl.update()
  })
  // * Moving direction for player
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
    }
  player.velocity.y += gravity

  // ! Horizontal collission square player
  const xRect = {
    x: player.position.x + player.velocity.x,
    y: player.position.y,
    width: player.width,
    height: player.height,
  }
  // ! Vertical collission square for player
  const yRect = {
    x: player.position.x,
    y: player.position.y + player.velocity.y,
    width: player.width,
    height: player.height,
  }
  // ! Loop to check for collisions with platforms
  platforms.forEach((platform) => {
    const platformRect = {
      x: platform.position.x,
      y: platform.position.y,
      width: platform.width,
      height: platform.height,
    }
    // * What to do in case of collision with platform
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

  // ! Loop to check for collisions with coin
  coins.forEach((coin, index) => {
    const coinRect = {
      x: coin.position.x + 5,
      y: coin.position.y + 5,
      width: coin.width,
      height: coin.height,
    }
    if (checkCollisions(xRect, coinRect) || checkCollisions(yRect, coinRect)) {
      delete coins[index]
      coinsCollect++
    }
  })

  // ! Loop to check for collisions with lava
  let endGame;
  lavas.forEach((lava) => {
    const lavaRect = {
      x: lava.position.x,
      y: lava.position.y,
      width: lava.width,
      height: lava.height,
    }
    if (checkCollisions(yRect, lavaRect)) {
      endGame = true
    }
  })
  if (endGame) {
    resetLevel()
    return
  }

  // ! Generating next level when coins are collected
  if (player.position.y - player.height > canvasGame.height
    || player.position.x + player.width + 1 < 0
    || player.position.x - 1 > 1200) {
    resetLevel()
  } else if (level === 0 && coinsCollect === 1) {
    setTimeout(() => {
      displayLevel(nextLevel)
      resetPlayer()
      document.querySelector('.canvas-game').style.backgroundImage = "url(assets/background.jpg)"
    }, 1000);
    const nextLevel = level += 1
    coinsCollect = 0
    requestAnimationFrame(animate)
  } else if (level === 1 && coinsCollect === 10) {
    setTimeout(() => {
      displayLevel(nextLevel)
      resetPlayer()
    }, 1000);
    const nextLevel = level += 1
    coinsCollect = 0
    requestAnimationFrame(animate)
  } else if (level === 2 && coinsCollect === 14) {
    setTimeout(() => {
      displayLevel(nextLevel)
      resetPlayer()
      document.querySelector('.canvas-game').style.backgroundImage = "url(assets/level3.jpg)"
    }, 1000);
    const nextLevel = level += 1
    coinsCollect = 0
    requestAnimationFrame(animate)
  } else if (level === 3 && coinsCollect === 38) {
    setTimeout(() => {
      displayLevel(nextLevel)
      resetPlayer()
      document.querySelector('.canvas-game').style.backgroundImage = "url(assets/background.jpg)"
    }, 1000);
    const nextLevel = level += 1
    coinsCollect = 0
    requestAnimationFrame(animate)
  } else {
    requestAnimationFrame(animate)
  }
}
requestAnimationFrame(animate)
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

