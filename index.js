const canvas = document.getElementById('game')
const c = canvas.getContext('2d');


const TILE_COUNT = 20;
const TILE_SIZE = canvas.clientHeight / TILE_COUNT

var fps = 15;
let timeNow;
let timeThen = Date.now();
let timeInterval = 1000 / fps;
let timeDelta;


class SnakeNode {
  constructor({next, color}) {
    this.next = next
    this.color = color
  }
}

class Snake {
  constructor({x, y, color}) {
    this.x = x
    this.y = y
    this.color = color
    this.velocity = {x: 0, y: 0}
    
  }

  changeDirection(e) {
    this.velocity.x = 0
    this.velocity.y = 0
    // up
    if(e.key == "w") {
      this.velocity.y = -1 
    }
    //down
    if(e.key == "s") {
      this.velocity.y = 1 
    }
    //left
    if(e.key == "a") {
      this.velocity.x = -1 
    }
    //right
    if(e.key == "d") {
      this.velocity.x = 1
    }
  }

  draw() {
    c.fillStyle = "orange"
    c.fillRect(this.x * TILE_COUNT, this.y * TILE_COUNT, TILE_SIZE , TILE_SIZE)
  }

  update() {

    this.x += this.velocity.x
    this.y += this.velocity.y

    this.draw()
  }

  
}

class Food {
  constructor({x, y, char}) {
    this.x = x
    this.y = y
    this.char = char
  }

  draw() {
    c.fillStyle = "red"
    c.fillRect(this.x * TILE_COUNT, this.y * TILE_COUNT, TILE_SIZE, TILE_SIZE)
  }
}


const snake = new Snake({x: 10, y: 10, color: 'hsl(24, 100%, 50%)'})
const food = []


function clearScreen(){
  c.fillStyle= 'black'// make screen black
  c.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)// black color start from 0px left, right to canvas width and canvas height
}


let frame = 0
let animationFrame = 0
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

      food.forEach((f, fIndex) => {

        if (f.x == snake.x && f.y == snake.y) {
          setTimeout(() => {
            food.splice(fIndex, 1)
          }, 0)
        }else {
          f.draw()

        }

      })
      
      
  }
  
}


animate()

document.addEventListener("keydown", (e) => {
  snake.changeDirection(e)
})

function spawnFood() {
  console.log("spawning food")
  let x = Math.trunc(Math.random() * TILE_COUNT)
  let y = Math.trunc(Math.random() * TILE_COUNT)

  const color = `hsl(0, 50%, 50%)` // template literal
  food.push(new Food({x, y, color}))
}
