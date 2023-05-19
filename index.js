const canvas = document.getElementById('game')
const c = canvas.getContext('2d');


const tileCount = 20;
const tileSize = canvas.height / tileCount

var fps = 15;
let timeNow;
let timeThen = Date.now();
let timeInterval = 1000 / fps;
let timeDelta;




class Snake {
  constructor({x, y}) {
    this.x = x
    this.y = y
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
    c.fillRect(this.x * tileCount, this.y * tileCount, tileSize , tileSize)
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
    //c.fillRect(this.x)
  }
}


const snake = new Snake({x: 10, y: 10})

function drawGame(){
  clearScreen();
  
  snake.update()
  
}

function clearScreen(){
  c.fillStyle= 'black'// make screen black
  c.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)// black color start from 0px left, right to canvas width and canvas height
}



let animationFrame = 0
function animate() {
  animationFrame = requestAnimationFrame(animate)
  // control frame rate
  // once the difference between then and now >= the interval, animate
  timeNow = Date.now();
  timeDelta = timeNow - timeThen;
  if (timeDelta > timeInterval) {
      // get rid of the extra time that remains in delta
      timeThen = timeNow - (timeDelta % timeInterval)

      // ANIMATE
      drawGame()
      
      
  }
  
}


animate()

document.addEventListener("keydown", (e) => {
  snake.changeDirection(e)
})