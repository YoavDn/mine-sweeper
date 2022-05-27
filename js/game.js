'use strict'

const BOMB = '&ofcir;'
const FLAG = '&ofcir;'
const EL_FLAG = document.querySelector('.flags-text')
const EL_TIME = document.querySelector('.time-text')
const SMILEY = document.querySelector('.smiley')
const LIFES = document.querySelectorAll('.live')
const BEST_SCORE = document.querySelector('.best-score-num')
const DIFF = document.getElementById('diff')
const CUSTOM = document.querySelector('.custom')

const gBestScores = {
  easy: 100000,
  medium: 100000,
  hard: 100000,
}

var gLevel = {
  level: 'easy',
  size: 4,
  mines: 2,
}
var gGame = {
  isOn: false,
  customed: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: 3,
  isHelp: false,
  gameEnd: false,
  helpsLeft: 3,
}

var gMark = 2
// var gHistory = []
var gBoard
var gInterval

var gCustom = {
  isCustom: false,
  customMinePos: [],
  customMinesCount: gLevel.mines,
}

function initGame() {
  gBoard = buildBoard()
  renderBoard(gBoard)
  BEST_SCORE.innerText = window.localStorage.getItem(gLevel.level)
  console.log('heelow')
}

function buildBoard() {
  var board = []

  for (var i = 0; i < gLevel.size; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.size; j++) {
      board[i][j] = {
        minesAround: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }

  return board
}

function renderBoard(board) {
  var boardContainer = document.querySelector('.board-container')
  var strHtml = '<table>'

  for (var i = 0; i < board.length; i++) {
    strHtml += `<tr>`
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j]
      cell.minesAround = setMinesNegsCount(gBoard, i, j)

      var className = addCellClass(i, j)

      var cellValue = cell.isMine ? BOMB : cell.minesAround
      if (!cellValue) cellValue = ''

      if (!cell.isShown) cellValue = ''
      if (cell.isMarked) cellValue = FLAG

      strHtml += `<td class="${className}" oncontextmenu="markCell(this, event, ${i},${j})" onclick="cellClicked(
        this ,${i},${j}
      )">${cellValue}</td>`
    }
    strHtml += `</tr>`
  }
  strHtml += `</table>`

  boardContainer.innerHTML = strHtml
  EL_FLAG.innerText = gMark
}

function cellClicked(elCell, i, j) {
  if (gGame.gameEnd) return // if the game ended cant play
  // if the game is custom
  if (gCustom.isCustom) {
    gGame.customed = true
    if (gCustom.customMinesCount === 0) {
      cleanCustomMines()
      gCustom.isCustom = false
      startGame()
      return
    }
    gBoard[i][j].isMine = true
    elCell.innerText = 'M'
    gCustom.customMinePos.push({ i, j })

    gCustom.customMinesCount--

    return
  }
  //first click to start
  if (!gGame.isOn) {
    getRendomMinePos(gBoard, gLevel.mines)
    startGame()
  }

  if (gBoard[i][j].isMarked) gBoard[i][j].isMarked = false

  //when cell contain mine
  if (gBoard[i][j].isMine && !gBoard[i][j].isShown) {
    gameOver(gBoard, i, j)
  }

  //if the cell has no mines around
  if (!gBoard[i][j].minesAround && !gBoard[i][j].isMine) {
    console.log(gBoard[i][j])
    console.log('ues')
    expandShown(i, j)
  }

  //help
  if (gGame.isHelp) {
    getHelp(i, j)
    setTimeout(() => getHelp(i, j, false), 1000)
    gGame.isHelp = false
    //update lives
    gGame.helpsLeft--
    updateHelpSign()
    return
  }

  if (gBoard[i][j].isShown === false) gGame.shownCount++
  gBoard[i][j].isShown = true

  checkGameWin()
  renderBoard(gBoard)
  console.log(gGame.shownCount)
}

function markCell(elCell, e, i, j) {
  e.preventDefault()
  if (gCustom.isCustom) return
  if (gBoard[i][j].isShown) return

  // var cellPos = getCelPos(elCell)
  var cell = gBoard[i][j]

  if (cell.isMine) gGame.markedCount++ // counts only if flag is on bomb

  if (!cell.isMarked && gMark === 0) return // if there no more flags to give return

  //dom mark logic
  if (cell.isMarked) {
    cell.isMarked = false
    gMark++
  } else if (!cell.isMarked) {
    cell.isMarked = true
    gMark--
  }

  console.log(gGame.markedCount)
  checkGameWin()

  renderBoard(gBoard)
}

function checkGameWin() {
  if (gGame.markedCount + gGame.shownCount === gLevel.size ** 2) {
    //check game diff
    var gameDiff = gLevel.level
    if (gGame.secsPassed < gBestScores[gameDiff] && !gGame.customed) {
      gBestScores[gameDiff] = gGame.secsPassed
      window.localStorage.removeItem(gameDiff)
      window.localStorage.setItem(gameDiff, gGame.secsPassed)
      BEST_SCORE.innerText = window.localStorage.getItem(gameDiff) + 's'
    }
    gGame.gameEnd = true
    console.log('you won')
    SMILEY.src = 'imges/won.svg'
    clearInterval(gInterval)
  }
}

function gameOver(board, i, j) {
  if (gGame.lives !== 0) {
    if (!gGame.isHelp) {
      gGame.lives--
      LIFES[gGame.lives].classList.add('hidden') //
    }
    return
  }
  gGame.gameEnd = true
  SMILEY.src = '/imges/lost.svg'
  console.log('You lost')
  renderAllMines(gBoard)
  renderBoard(gBoard)
  clearInterval(gInterval)
}

function expandShown(posI, posJ) {
  if (gGame.isHelp) return
  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      if (i === posI && j === posJ) continue
      var neg = gBoard[i][j]

      if (neg.isMarked && !neg.inMine) {
        neg.isShown = true
        neg.isMarked = false
        gMark++
        gGame.shownCount++
        continue
      }
      if (neg.isMine || neg.isShown) continue
      neg.isShown = true
      gGame.shownCount++
      console.log(neg.minesAround)
      if (!neg.minesAround) expandShown(i, j) // expend the cell with no  mines around
      // reveledNeg(i, j)
    }
  }
}

function getHelp(posI, posJ, display = true) {
  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue

      // if (i === posI && j === posJ) continue

      // gBoard[i][j].isShown = display
      renderCell(i, j, display)
    }
  }
}

function resetGame() {
  gGame = {
    isOn: false,
    customed: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    gameWon: false,
    isHelp: false,
    helpsLeft: 3,
  }
  gCustom = {
    isCustom: false,
    customMinePos: [],
    customMinesCount: gLevel.mines,
  }
  gMark = gLevel.mines
  resetDom()
  clearInterval(gInterval)
  initGame()
}

function customGame() {
  resetGame()
  gCustom.isCustom = true
  CUSTOM.classList.add('red')
}

// function undo() {
//   // var gBoard = gHistory.pop()
//   console.log(gHistory)

//   // renderBoard(gBoard)
// }
