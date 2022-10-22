![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

### General Assembly Software Engineering Flex 
# Project 1 - The Game

## The Overview

The assignment was to create a grid-based game to be rendered in the browser, using HTML, CSS and JavaScript. The project was to be completed **individually** within **two weeks**.

Given a list of options, I chose to make a simple platformer game called **Pixel Hill**. A game where a littl pixel character has to collect gems to reach the top of **Pixel Hill** to win. Including various level designs, a smooth character movement as well as fall traps and enemy traps.

You can launch the game on GitHub pages [here](https://robwilhelmsson.github.io/project-game/), or find the GitHub repo [here](https://github.com/robwilhelmsson/project-game).

## Brief

- **Render a game in the browser**
- **Design logic for winning & visually display which player won**
- **Include separate HTML / CSS / JavaScript files**
- Stick with **KISS (Keep It Simple Stupid)** and **DRY (Don't Repeat Yourself)** principles
- Use **Javascript** for **DOM manipulation**
- **Deploy your game online**, where the rest of the world can access it
- Use **semantic markup** for HTML and CSS (adhere to best practices)

## Technologies Used

- Excalidraw
- HTML
- CSS
- JavaScript
- Git and GitHub
- Adobe Illustrator
- Google Fonts

## Approach

### Setup
* I decided to use the **canvas** element in html so I could make a game board, I then looked into **requestAnimationFrame** and decided this would be the best way to approach the game, as I could make smooth movements where **setInterval** would not be able to. All the classes and functions had to be called inside an animate function where **requestAnimationFrame** would run.

### Movement 
*** **Refer to comments within javascript file if to find out where problems arose.**
  * I started out making the player class to test out the movement of the player. At first I made it impossible to drop below the canvas so I could set up movement, left and right. And then adding velocity to the player which used a gravity constant for more realistic and smooth moevements. I added event listeners to the keys, and then also added **lastKey** variables which made it possible to change direction whilst still pressing the old key. 

  * I had quite a lot of issues with collission detection which can be seen at the bottom of the main.js file, where I left the old code. Eventually I made a collision function with two rectangles as arguments and then made seperate rectangular detection boxes for the player, platforms, lava and coins to detect those collisions.

**Collision Function**
```js
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
```
**Collision square for player (and others for lava, coin etc..)**
```js
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
```

### Levels 

* I first made seperate classes for the platforms, lava, moving lava and coins. 
* I created the levels in the sperate **levels.js** file. I used an array of arrays to draw out the levels, using numbers for each of the different elements in the array. 
* I then looped through the array in the **main.js** file and pushed each element into another variable array to use the forEach method to draw those elements in the grid. 
```js
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
```
```js
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
```
* I used the same method for collision detection as I used for the player and the platforms, but using different end results, eg. resetting the level on lava touch death & collecting coins. 

### Changing Levels

* I used a fairly simple method to change the levels by creating a **level** variable that went up by one every time the number of coins collected on that level was at the correct number. Just a lot of if/else statements.  
```js
} else if (level === 1 && coinsCollect === 10) {
    setTimeout(() => {
      displayLevel(nextLevel)
      resetPlayer()
    }, 1000);
    const nextLevel = level += 1
    coinsCollect = 0
    requestAnimationFrame(animate)
```
* Calling the request animate function again in these if/else statements is necessary.
* I aso added in the correct background with tips for certain levels in these statements. 
### Resetting Levels
* I added a button on the last congratulation screen, mainly just to make sure I could. This calls a function which adds an html element to the screen which can be clicked on to reset. Although this just calls the location.relaod() built in method.
```js
function buttonFunction(){
  button.innerHTML = "RESTART"
  button.classList.add('button-show')
}

button.addEventListener('click', () => {
  location.reload()
})
```

### Lava
* I used a seperate class for the moving lava and added an initial position so when the collision detect with another lava was true, it reset to the original position using a ```resetLava()```function. 
```js
 downLava.forEach((dl) => {
    const DownLavaRect = {
      x: dl.position.x,
      y: dl.position.y,
      width: dl.width,
      height: dl.height,
    }
    lavas.forEach((lava) => {
      const lavaRect = {
        x: lava.position.x,
        y: lava.position.y,
        width: lava.width,
        height: lava.height,
      }
      if (checkCollisions(lavaRect, DownLavaRect)) {
        dl.resetLava()
      }
    })
  })
```

### Main Issues
* Collision detection was a challenge, but now it's working, it makes a lot more sense. 
* Accidentally calling the request animation frame again and then the game running at double speed. 
* I eventually used images made in illustrator to add a few items that did not need to move on the screen. This made the code a little cleaner to deal with without having to create html elements which was a tad difficult with canvas. 
* I had to put the startscreen background image in the javascript file as it would not laod in the css file. I think this was due to the background image changing on different level conditions.
* Getting the moving lava to reset in position was a challenge, the intitial position made it much easier.

## Screenshots

![start screen](/assets/screenshots/screenshot1.png)
![start screen](/assets/screenshots/screenshot2.png)

### Bugs 
* There seems to sometimes be a problem if you jump directly into the corner of a square. I think this is caused by two seperate collision detections happening at once. 
* Images laoding for the first time dont happen immediately, but it's not too much of a problem. 

### Next Time
* I would like to make sprites to show moving animation.
* Get the coins to wobble a bit, using the same method as I did with the moving lava. 
* Create all the elements with javascript instead of using images. (although this wouldnt change the outcome)
* More levels.
* Parallax scrolling background
* Add in a simple timer to see how long it took to complete.
* Add a death counter. Both of these would be fairly simple variables to add.
