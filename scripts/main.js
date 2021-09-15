//import Game from '/scripts/game.js'

// Character constant
const CHARACTER_WIDTH = 20
const CHARACTER_HEIGHT = 20
const FPS = 30
const LOOP_INTERVAL = Math.round(1000 / FPS)
const VELOCITY = 2
const INVINCIBLE_TIME = 1000

// Opposition player
const OPPOSITION_WIDTH = 30
const OPPOSITION_HEIGHT = 30

// Opposition GK
const OPPOSITION_GK_WIDTH = 20
const OPPOSITION_GK_HEIGHT = 30

// Ball constant
const BALL_WIDTH = 7
const BALL_HEIGHT = 7
const BALL_VELOCITY = 4
const BALL_TIME = 2000

// Time left constant
const $timeLeftText = $('#time-left')
const INIT_SECONDS = 10
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
const $ball = $('#ball')

// Other Global Values
let clockInterval, timeLeft, points, shooter
let gameLoop

let fBall = {
  $elemBall: ball,
  position: { },
  dimension: { w: BALL_WIDTH, h: BALL_HEIGHT },
  ballVelocity: BALL_VELOCITY,
  yBound: gameHeight,
  ballTime: BALL_TIME
}

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
    position: { y: 10 },
    levelVelocity: 2,
    lBound: 100,
    rBound: 350,
  }, {
    $elem: $opPlay1,
    dimension: { w: OPPOSITION_WIDTH, h: OPPOSITION_HEIGHT  },
    position: { y: 100 },
    levelVelocity: 2.5,
    lBound: 0,
    rBound: gameWidth
  }, {
    $elem: $opPlay2,
    dimension: { w: OPPOSITION_WIDTH, h: OPPOSITION_HEIGHT  },
    position: { y: 200 },
    levelVelocity: 2.5,
    lBound: 0,
    rBound: gameWidth
  }, {
    $elem: $opPlay3,
    dimension: { w: OPPOSITION_WIDTH, h: OPPOSITION_HEIGHT  },
    position: { y: 300 },
    levelVelocity: 2.5,
    lBound: 0,
    rBound: gameWidth
  }, {
    $elem: $opPlay4,
    dimension: { w: OPPOSITION_WIDTH, h: OPPOSITION_HEIGHT  },
    position: { y: 400 },
    levelVelocity: 2.5,
    lBound: 0,
    rBound: gameWidth
  }, {
    $elem: $opPlay5,
    dimension: { w: OPPOSITION_WIDTH, h: OPPOSITION_HEIGHT  },
    position: { y: 500 },
    levelVelocity: 2.5,
    lBound: 0,
    rBound: gameWidth
  }
]

// creates an array for opposition players

// const levelMapping = {
//   1: [
//     [0, 3],
//     [4, 6]
//   ],
//   2: [
//     [2, 6]
//     [3, 6]
//     [4, 8]
//     [5, 6]
//   ]
// }

// Game over
const gameOver = () => {
  clearInterval(clockInterval)
  $player.hide()
  $oppositionPlayer.hide() //have not programed yet
  $gameScreen.hide()
  $display.hide()
  $gameOverBox.show() // show game over
  $scoreText.text(points) //show points score
}

// Shooting reaction
// 4 results:
// Ball enter goals = +1 point
// Ball goes offscreen
// Ball hits opposition
// Ball hits none goal area


// Shooting path
// const ballMovement = () => {
//   const {
    // dimension: { w, h },
//     position: { y },
//     ballVelocity,
//   } = ball
//   let newY = y

//   newY = y - ballVelocity < 0 ? 0 : newY - ballVelocity

//   ball.position.y = newY
//   ball.css('top', newY)
// }

// const characterFire = () => {

//   if (player.movement.shoot) {
//     const charMidPoint = player.dimension.w / 2
//     ball = charMidPoint

//     const timeNow = Date.now()
//     const isInvincible = (player.lastHit + INVINCIBLE_TIME) > timeNow
//     player.lastHit = timeNow
//   }
// }


  // remove ball from current starting position in the class
  // ball += Y
  // add ball
  // if hit area, flash animation with alert Goal, then reset player position and clear the ball
  // if miss and over the play area, clear interval

  //Scoring - pending
// const goal = () => {
// if (ball.x + ball.size > canvas.width) {
//     if(ball.100 > x && ball.y < 350)
//   points +=1
//   $displayScore.text(points)
  // levelup - increase velocity
//   resetPlayerPosition()
// }

// Random function
const randomInt = (max) => {
  return Math.floor(Math.random() * max)
}

const updateCharacterMovement = () => {
  const {
    position: { x, y },
    movement: { left, up, right, down, shoot }
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
  if (shoot) {
    $ball.show()
  }

  player.position.x = newX
  player.position.y = newY
  fBall.position.x = player.position.x + 7
  fBall.position.y = player.position.y - 10
  $player.css('left', newX).css('top', newY)
  $ball.css('left', fBall.position.x).css('top', fBall.position.y)

}

const opMovement = () => {
  opPlayers.forEach((opPlay) => { //multiple for Arrays; singular for parameter because targeting individually
    const {
      $elem,
      dimension: { w },
      position: { x },
      velocity,
      lBound,
      rBound
    } = opPlay
    let newX = x

    if (velocity < 0) { //if velocity is heading to the left....
      if (x + velocity < lBound) {
        newX = lBound
        opPlay.velocity = velocity * -1 //switch and move to the right
      } else {
        newX = newX + velocity //keep moving to the left
      }
    } else { //if velocity is heading to the right...
      if (x + w + velocity > rBound) {
        newX = rBound - w
        opPlay.velocity = velocity * -1 //switch and move to the left
      } else {
        newX = newX + velocity //keep moving to the left
      }
    }

    opPlay.position.x = newX // updates the new X position in the array
    $elem.css('left', newX) // replaces the left position in CSS
  })
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
        player.lastHit = timeNow //For every seconds, this below will happen; compares .lastHit + INVINCIBLE_TIME to this. Basically this makes sure the deduction happens every 1 second rather than every millisecond. It should be equal as < will rush it every millisecond.
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
      opMovement()
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
    case 32: //shoot
      e.preventDefault()
      player.movement.shoot = value
      break
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
    const randomX = randomInt(420 - (opPlay.dimension.w / 2)) //sets the random X position
    opPlay.position.x =  randomX //max width of the game minus biggest width of the opponent
    opPlay.$elem.css('top', opPlay.position.y).css('left', opPlay.position.x)
    opPlay.velocity = randomX < (210 - opPlay.dimension.w) ? opPlay.levelVelocity * -1 : opPlay.levelVelocity //sets an IF function if left or right
  })
}

//Restart
const restart = () => {
  clockInterval = null
  points = 0
  $displayScore.text('0')
  $gameOverBox.hide()
  $player.show()
  $oppositionPlayer.show() //have not programed yet
  $gameScreen.show()
  $display.show()
  $startingInstruction.show()
  resetPlayerPosition()
  setOpposition()
  $ball.hide()
}

const init = () => {
  $(document).on('keydown', handleKeyDown)
  $(document).on('keyup', handleKeyUp)
  $restartBTN.on('click', restart)
  gameLoop = setInterval(updateMovements, LOOP_INTERVAL)
  restart()
}

init()
