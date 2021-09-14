//import Game from '/scripts/game.js'

// Character constant
const CHARACTER_WIDTH = 20
const CHARACTER_HEIGHT = 20
const FPS = 60
const LOOP_INTERVAL = Math.round(1000 / FPS)
const VELOCITY = 5
const INVINCIBLE_TIME = 1000

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
const INIT_SECONDS = 60
const INIT_MS = INIT_SECONDS * 1000
const PENALTY_SECONDS = 5
const PENALTY_MS = PENALTY_SECONDS * 1000
const CLOCK_INVOKE_INTERVAL = 100

// Game Over Box
const $gameOverBox = $('#game-over-box')
const $scoreText = $('#game-over-score')
const $restartBTN = $('#restart-btn')

// Game Screen Box
const $gameScreen = $('#game-screen')
const $gameArea = $('#game-area')
const $display = $('#display')
const $startingInstruction = $('#starting-instruction')
const gameWidth = $gameArea.width()
const gameHeight = $gameArea.height()

// Score
const $displayScore = $('#display-score')
const PENALTY_POINT = 1

// Players
const $player = $('#player')
const $opPlay1 = $('#op-play1')
const $opPlay2 = $('#op-play2')
const $opPlay3 = $('#op-play3')
const $opPlay4 = $('#op-play4')
const $opPlay5 = $('#op-play5')
const $oppositionGk = $('#opposition-gk')
const $oppositionPlayer = $('.opposition-player')

// Other Global Values
let clockInterval, timeLeft, points
let gameLoop
let player = {
  position: { x: 225 - (CHARACTER_WIDTH / 2), y: 560 },
  dimension: { w: CHARACTER_WIDTH, h: CHARACTER_HEIGHT},
  movement: { left: false, up: false, right: false, down: false, shoot: false },
  lastHit: 0
}
let opPlayers = [
  {
    $elem: $oppositionGk,
    dimension: { w: OPPOSITION_GK_WIDTH, h: OPPOSITION_GK_HEIGHT  },
    position: { y: 10 }
  }, {
    $elem: $opPlay1,
    dimension: { w: OPPOSITION_WIDTH, h: OPPOSITION_HEIGHT  },
    position: { y: 100 }
  }, {
    $elem: $opPlay2,
    dimension: { w: OPPOSITION_WIDTH, h: OPPOSITION_HEIGHT  },
    position: { y: 200 }
  }, {
    $elem: $opPlay3,
    dimension: { w: OPPOSITION_WIDTH, h: OPPOSITION_HEIGHT  },
    position: { y: 300 }
  }, {
    $elem: $opPlay4,
    dimension: { w: OPPOSITION_WIDTH, h: OPPOSITION_HEIGHT  },
    position: { y: 400 }
  }, {
    $elem: $opPlay5,
    dimension: { w: OPPOSITION_WIDTH, h: OPPOSITION_HEIGHT  },
    position: { y: 500 }
  }
] //creates an array for opposition players

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

//Shooting function

//Defining the goal

//Scoring - pending
const goal = () => {
//if (player scores a goal) {
  points +=1
  resetPlayerPosition()
}

// Random function
const randomInt = (max) => {
  return Math.floor(Math.random() * max)
}

// let moveOpposition = () => {
//   if($opPlay1: position X> max-width), -1
// }

const updateCharacterMovement = () => {
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

const updateOpMovement = () => {
  const {
    position: { x, y },
    movement: { left, up, right, down }
  } = player
  let newX = x
  let newY = y

  if (left) {
    newX = x - VELOCITY < 0 ? 0 : newX - VELOCITY //left is 0 because the corner point is 0
  }
  if (right) {
    newX = x + OPPOSITION_WIDTH + VELOCITY > gameWidth ? gameWidth - OPPOSITION_WIDTH : newX + VELOCITY
  }


  player.position.x = newX
  player.position.y = newY
  $player.css('left', newX).css('top', newY)
}

const checkCollision = () => { //will always run because this is in the function updateMovements
  const timeNow = Date.now() //shows unix date and time in numbers
  const isInvincible = (player.lastHit + INVINCIBLE_TIME) > timeNow //this makes the assignment tht lastHit + invincible_time > timeNow

  if (!isInvincible) {  //If lastHit + invincible_time < timeNow, then do the following
    $player.removeClass('flashing') //removing the flashing icon

    opPlayers.forEach((opPlay) => { //iterates the player against each opposition to check for collisions
      if (player.position.x < opPlay.position.x + opPlay.dimension.w &&
          player.position.x + player.dimension.w > opPlay.position.x &&
          player.position.y < opPlay.position.y + opPlay.dimension.h &&
          player.position.y + player.dimension.h > opPlay.position.y) {
        $player.addClass('flashing') //flashing for 2 seconds
        player.lastHit = timeNow //compares .lastHit + INVINCIBLE_TIME to this, and if longer than X seconds then the belows will occur
        timeLeft -= PENALTY_MS
        points -= PENALTY_POINT
        $displayScore.text(points)
      }
    })
  }
}

// Every time this gets invoked, update character position/also includes collision
const updateMovements = () => {
  updateCharacterMovement()
  updateOpMovement()
  checkCollision()
}

// Update Seconds and Trigger Game Over
const updateSecondsLeft = () => {
  timeLeft = timeLeft - CLOCK_INVOKE_INTERVAL
  $timeLeftText.text((timeLeft / 1000).toFixed(1))
  if (timeLeft <= 0) gameOver()
}

//Start Clock
const startClock = () => {
  timeLeft = INIT_MS
  clockInterval = setInterval(updateSecondsLeft, CLOCK_INVOKE_INTERVAL)
}

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

const resetPlayerPosition = () => {
  player.position.x = 225 - ((player.dimension.w) / 2)
  player.position.y = 560
}

const setOpposition = () => {
  opPlayers.forEach((opPlay) => { //inputs the x co-ordinate into the opPlayers array
    opPlay.position.x = randomInt(450 - (opPlay.dimension.w / 2))
    opPlay.$elem.css('top', opPlay.position.y).css('left', opPlay.position.x)
  })
}

//Restart
const restart = () => {
  clockInterval = null
  points = 0
  $scoreText.text('')
  $displayScore.text('0')
  $gameOverBox.hide()
  $player.show()
  $oppositionPlayer.show() //have not programed yet
  $gameScreen.show()
  $display.show()
  $startingInstruction.show()
  resetPlayerPosition()
  setOpposition()
}

const init = () => {
  $(document).on('keydown', handleKeyDown)
  $(document).on('keyup', handleKeyUp)
  $restartBTN.on('click', restart)
  gameLoop = setInterval(updateMovements, LOOP_INTERVAL)
  restart()
}

init()
