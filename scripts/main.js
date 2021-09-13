//import Game from '/scripts/game.js'

// Character constant
const CHARACTER_WIDTH = 20
const CHARACTER_HEIGHT = 20
const FPS = 60
const LOOP_INTERVAL = Math.round(1000 / FPS)
const VELOCITY = 1

// Opposition player
const OPPOSITION_WIDTH = 30
const OPPOSITION_HEIGHT = 30
const OPPOSITION_VELOCITY = 3

// Opposition GK
const OPPOSITION_GK_WIDTH = 20
const OPPOSITION_GK_HEIGHT = 20
const OPPOSITION_GK_VELOCITY = 2

// Time left constant
const $timeLeftText = $('#time-left')
const INIT_SECONDS = 2
const INIT_MS = INIT_SECONDS * 1000
const PENALTY_SECONDS = -5
const CLOCK_INVOKE_INTERVAL = 100

// Game over box
const $gameOverBox = $('#game-over-box')
const $scoreText = $('#score')
const $restartBTN = $('#restart-btn')

let clockInterval, timeLeft, points

const $player = $('#player')
const $oppositionPlayer = $('.opposition-player')
const $opP1 = $('#op-play1')
const $gameScreen = $('#game-screen')
const $gameArea = $('#game-area')
const $display = $('#display')
const $startingInstruction = $('#starting-instruction')




//Shooting function



//Defining the goal


//Scoring - pending
const goal = () => {
//if (player scores a goal) {
  points +=1
  resetPlayerPosition()
}

// Game Loop
let gameLoop

// Character
let player = {
  position: { x: 225 - (CHARACTER_WIDTH / 2), y: 560 },
  movement: { left: false, up: false, right: false, down: false, shoot: false }
}

//Opposition player
let Opposition = (x,y, OPPOSITION_VELOCITY, OPPOSITION_WIDTH, OPPOSITION_HEIGHT) => {
  this.x = x;
  this.y = y;
  this.OPPOSITION_VELOCITY = OPPOSITION_VELOCITY;
  this.OPPOSITION_WIDTH = OPPOSITION_WIDTH;
  this.OPPOSITION_HEIGHT = OPPOSITION_HEIGHT;
  this.update = function () {
     this.x = this.x + 10
  }
}

Opposition ()




//Player collision - in progress
// var rect1 = {x: 5, y: 5, width: 50, height: 50}
// var rect2 = {x: 20, y: 10, width: 10, height: 10}

// const playerCollision = () => {
//   if (5 < 30 &&
//       55 > 20 &&
//       5 < 20 &&
//       55 > 10) {
//       points -=1
//       timeLeft = timeLeft - PENALTY_SECONDS
//   }
// }



// Toggle which direction the character is moving to
const setPlayerMovement = (value, keyCode, e) => {
  switch (keyCode) {
    case 37:
      e.preventDefault() // locks the browser so it doesn't scroll because using arrow keys, using WASD won't have this problem
      player.movement.left = value
      break
    case 38:
      e.preventDefault()
      player.movement.up = value
      break
    case 39:
      e.preventDefault()
      player.movement.right = value
      break
    case 40:
      e.preventDefault()
      player.movement.down = value
      break
    case 32: //spacebar
      e.preventDefault()
      player.movement.shoot = value
      break// to shoot
    }
}

// Handling Key Down
const handleKeyDown = (e) => {
  if (!clockInterval) startClock ()
  $startingInstruction.hide()
  setPlayerMovement(true, e.keyCode, e) //the extra e prevents default
}

// Handling Key Up
const handleKeyUp = (e) => {
  setPlayerMovement(false, e.keyCode, e)
}

// Every time this gets invoked, update character position/also includes collision
const updateMovements = () => {
  const gameWidth = $gameArea.width()
  const gameHeight = $gameArea.height()
  const {
    position: { x, y },
    movement: { left, up, right, down }
  } = player
  let newX = x
  let newY = y

  if (left) {
    newX = x - VELOCITY < 0 ? 0 : newX - VELOCITY //left is 0 because the corner point is 0
  }
  if (up) {
    newY = y - VELOCITY < 0 ? 0 : newY - VELOCITY //up is also 0 because top left = 0
  }
  if (right) {
    newX = x + CHARACTER_WIDTH + VELOCITY > gameWidth ? gameWidth - CHARACTER_WIDTH : newX + VELOCITY
  }
  if (down) {
    newY = y + CHARACTER_HEIGHT + VELOCITY > gameHeight ? gameHeight - CHARACTER_HEIGHT : newY + VELOCITY
  }

  player.position.x = newX
  player.position.y = newY
  $player.css('left', newX).css('top', newY)
}

const resetPlayerPosition = () => {
  player.position.x = 225 - ((CHARACTER_WIDTH) / 2)
  player.position.y = 560
}

//Start Clock
const startClock = () => {
  timeLeft = INIT_MS
  clockInterval = setInterval(updateSecondsLeft, CLOCK_INVOKE_INTERVAL)
}

const updateSecondsLeft = () => {
  timeLeft = timeLeft - CLOCK_INVOKE_INTERVAL
  $timeLeftText.text((timeLeft / 1000).toFixed(1))
  if (timeLeft <= 0) gameOver()
}

//Game over
const gameOver = () => {
  clearInterval(clockInterval)
  $player.hide()
  $oppositionPlayer.hide() //have not programed yet
  $gameScreen.hide()
  $display.hide()
  $gameOverBox.show() // show game over
  $scoreText.text(points) //show points score
}

//Restart
const restart = () => {
  clockInterval = null
  points = 0
  $scoreText.text('')
  $gameOverBox.hide()
  $player.show()
  $oppositionPlayer.show() //have not programed yet
  $gameScreen.show()
  $display.show()
  resetPlayerPosition()
  $startingInstruction.show()

}

const init = () => {
  $(document).on('keydown', handleKeyDown)
  $(document).on('keyup', handleKeyUp)
  $restartBTN.on('click', restart)
  gameLoop = setInterval(updateMovements, LOOP_INTERVAL)
}

init()
