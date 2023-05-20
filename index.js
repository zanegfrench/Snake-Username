const canvas = document.getElementById('game')
const c = canvas.getContext('2d')

const TILE_COUNT = 20;
const SIDE_LENGTH = Math.floor(Math.min(window.innerHeight, window.innerWidth) / TILE_COUNT) * TILE_COUNT
const TILE_SIZE = SIDE_LENGTH / TILE_COUNT

canvas.height = SIDE_LENGTH
canvas.width = SIDE_LENGTH

const CHARACTERS = "abcdefghijklmnopqrstuvwxyz"

const startGameBtn = document.querySelector("#startGameBtn")
const modalEl = document.querySelector("#modalEl")
const nameEl = document.querySelector('#nameEl')

var fps = 10;
let timeNow;
let timeThen = Date.now();
let timeInterval = 1000 / fps;
let timeDelta;


class SnakeNode {
  constructor({x, y, color, char}) {
    this.x = x
    this.y = y
    this.color = color
    this.char = char
  }

  draw() {
    c.beginPath()
    c.lineWidth = 1
    c.rect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE , TILE_SIZE)
    c.fillStyle = this.color
    c.strokeStyle = "black"
    c.fill()
    c.stroke()

    c.font = `${TILE_SIZE}px Ariel`
    c.fillStyle = "white"
    c.textAlign = "center"
    c.fillText(this.char, (this.x + .5) * TILE_SIZE, (this.y) * TILE_SIZE + TILE_SIZE - 2, TILE_SIZE)
  }
}

class Snake {
  constructor({x, y, color}) {
    this.x = x
    this.y = y
    this.color = color
    this.velocity = {x: 1, y: 0}
    this.head = new SnakeNode({x: this.x, y: this.y, color: this.color, char: ' '})
    this.tail = []
  }

  addNode({char}) {
    this.tail.push(new SnakeNode({x: 0, y: 0, color: this.color, char: char}))
  }

  changeDirection(e) {
    // up
    if(e.key == "w") {
      if (this.velocity.y === 1) {
        return
      }
      this.velocity.x = 0
      this.velocity.y = -1 
    }
    //down
    if(e.key == "s") {
      if (this.velocity.y === -1) {
        return
      }
      this.velocity.x = 0
      this.velocity.y = 1 
    }
    //left
    if(e.key == "a") {
      if (this.velocity.x === 1) {
        return
      }
      this.velocity.x = -1 
      this.velocity.y = 0
    }
    //right
    if(e.key == "d") {
      if (this.velocity.x === -1) {
        return
      }
      this.velocity.x = 1
      this.velocity.y = 0
    }
  }

  draw() {
    this.head.draw()
    this.tail.forEach((node) => {
      node.draw()
    })
  }

  update() {

    let prevX = this.head.x
    let prevY = this.head.y


    this.tail.forEach((tailPiece) => {
      let tempX = tailPiece.x
      let tempY = tailPiece.y
      tailPiece.x = prevX
      tailPiece.y = prevY
      prevX = tempX
      prevY = tempY
    })

    this.head.x += this.velocity.x
    this.head.y += this.velocity.y

    this.draw()
  }

  
}

class Food {
  constructor({x, y, char}) {
    this.x = x
    this.y = y
    this.char = char
    this.color = "red"
  }

  draw() {
    c.beginPath()
    c.lineWidth = 1
    c.rect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE , TILE_SIZE)
    c.fillStyle = this.color
    c.strokeStyle = "black"
    c.fill()
    c.stroke()

    c.font = `${TILE_SIZE}px Ariel`
    c.fillStyle = "white"
    c.textAlign = "center"
    c.fillText(this.char, (this.x + .5) * TILE_SIZE, (this.y) * TILE_SIZE + TILE_SIZE - 2, TILE_SIZE)
  }
}


function clearScreen(){
  c.fillStyle= 'black'// make screen black
  c.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)// black color start from 0px left, right to canvas width and canvas height
}

clearScreen()
let frame = 0
let animationFrame = 0
let gameOver = false
function animate() {
  animationFrame = requestAnimationFrame(animate)
  // control frame rate
  // once the difference between then and now >= the interval, animate
  timeNow = Date.now();
  timeDelta = timeNow - timeThen;
  // frame
  if (timeDelta > timeInterval) {
    // get rid of the extra time that remains in delta
    timeThen = timeNow - (timeDelta % timeInterval)
    frame += 1
    // ANIMATE

    if (frame % 20 == 0) {
      spawnFood()
    }

    clearScreen()
    snake.update()

    // FOOD COLLISION
    food.forEach((f, fIndex) => {
      if (f.x == snake.head.x && f.y == snake.head.y) {
        snake.addNode({char: f.char})

        setTimeout(() => {
          food.splice(fIndex, 1)
        }, 0)
      }else {
        f.draw()

      }

    })

    gameOver = isGameOver()
    
    
    if (gameOver) {
      cancelAnimationFrame(animationFrame)
      let finalName = ""
      snake.tail.forEach((tailPiece) => {
        finalName += tailPiece.char
      })
      nameEl.innerHTML = finalName
      modalEl.style.display = 'flex'
      isGameStarted = false
    }
  }
}

let snake = new Snake({x: 10, y: 10, color: 'green'})
let food = []
function init() {
  snake = new Snake({x: 10, y: 10, color: 'green'})
  food = []
}

function spawnFood() {
  const x = Math.trunc(Math.random() * TILE_COUNT)
  const y = Math.trunc(Math.random() * TILE_COUNT)
  const character = CHARACTERS.charAt(Math.trunc(Math.random() * CHARACTERS.length))

  const color = `hsl(0, 50%, 50%)` // template literal
  food.push(new Food({x, y, color, char: character}))
}

function isGameOver() {
  let gameOver = false
  if (snake.head.x < 0 || snake.head.x === TILE_COUNT || snake.head.y < 0 || snake.head.y === TILE_COUNT) {
    gameOver = true
  }

  //stop the game when snake bumps into itself
  snake.tail.forEach(tailPiece => {
    if (snake.head.x === tailPiece.x && snake.head.y === tailPiece.y) {
      gameOver = true
      
    }
  })

  return gameOver;
}

document.addEventListener("keydown", (e) => {

  if (!isGameStarted) {
    isGameStarted = true
    init()
    animate()
  
    modalEl.style.display = 'none'
  }

  snake.changeDirection(e)

})



let isGameStarted = false