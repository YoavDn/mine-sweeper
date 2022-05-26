'use strict'

const BOMB = '&ofcir;'
const FLAG = '&ofcir;'
const EL_FLAG = document.querySelector('.flags-text')
const EL_TIME = document.querySelector('.time-text')
const SMILEY = document.querySelector('.smiley')
const LIFES = document.querySelectorAll('.live')

var gMark = 2

var gBoard
var gInterval

var gLevel = {
  size: 4,
  mines: 2,
}
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: 3,
  isHelp: false,
  helpsLeft: 3,
}

function initGame() {
  gBoard = buildBoard()
  renderBoard(gBoard)
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

      var className = addCellClass(cell, i, j)

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
  //first click to start
  if (!gGame.isOn) {
    getRendomMinePos(gBoard, gLevel.mines)
    renderBoard(gBoard)

    gInterval = setInterval(() => {
      gGame.secsPassed++
      EL_TIME.innerText = gGame.secsPassed
    }, 1000)
    gGame.isOn = true
  }
  // var cellPos = getCelPos(elCell)

  //when cell contain mine
  if (gBoard[i][j].isMine) {
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

      gBoard[i][j].isShown = display
    }
  }
  renderBoard(gBoard)
}

function resetGame() {
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    isHelp: false,
    helpsLeft: 3,
  }
  gMark = gLevel.mines
  resetDom()
  clearInterval(gInterval)
  initGame()
}
