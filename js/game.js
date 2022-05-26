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

      var className = addCellClass(cell, i, j)

      if (cell.isMine) {
        if (!gGame.isOn) {
          cell.isShown = true
        }
      }

      var cellValue = cell.isMine ? BOMB : cell.minesAround

      if (!cell.isShown) cellValue = ''
      if (cell.isMarked) cellValue = FLAG

      strHtml += `<td class="${className}" oncontextmenu="markCell(this, event)" onclick="cellClicked(
        this
      )">${cellValue}</td>`
    }
    strHtml += `</tr>`
  }
  strHtml += `</table>`

  boardContainer.innerHTML = strHtml
  EL_FLAG.innerText = gMark
}

function cellClicked(elCell) {
  if (!gGame.isOn) {
    getRendomMinePos(gBoard, gLevel.mines)
    updateCellNeg(gBoard)

    gInterval = setInterval(() => {
      gGame.secsPassed++
      EL_TIME.innerText = gGame.secsPassed
    }, 1000)
    gGame.isOn = true
  }
  var cellPos = getCelPos(elCell)

  if (gBoard[cellPos.i][cellPos.j].isMine) {
    gameOver(gBoard, cellPos.i, cellPos.j)
  }

  if (!gBoard[cellPos.i][cellPos.j].minesAround) {
    expandShown(cellPos.i, cellPos.j)
  }

  if (gGame.isHelp) {
    getHelp(cellPos.i, cellPos.j)
    setTimeout(() => hideHelpCells(cellPos.i, cellPos.j), 1000)
    gGame.helpsLeft--
    updateHelpSign()
  }
  gBoard[cellPos.i][cellPos.j].isShown = true

  if (gBoard[cellPos.i][cellPos.j].isShown === false) gGame.shownCount++

  checkGameOver()
  renderBoard(gBoard)
  console.log(gGame.shownCount)
}

function getRendomMinePos(board, mineCount) {
  var minesPosArr = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      minesPosArr.push({ i, j })
    }
  }
  shuffle(minesPosArr)
  minesPosArr = minesPosArr.slice(-mineCount)

  for (var i = 0; i < minesPosArr.length; i++) {
    gBoard[minesPosArr[i].i][minesPosArr[i].j].isMine = true
  }
  // console.log(minesPosArr)
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5)
}

function markCell(elCell, e) {
  e.preventDefault()

  var cellPos = getCelPos(elCell)
  var cell = gBoard[cellPos.i][cellPos.j]

  if (cell.isMine) gGame.markedCount++

  if (!cell.isMarked && gMark === 0) return // if there no more flags to give return
  if (cell.isMarked) {
    cell.isMarked = false
    gMark++
  } else if (!cell.isMarked) {
    cell.isMarked = true
    gMark--
  }

  console.log(gGame.markedCount)
  checkGameOver()

  renderBoard(gBoard)
}

function checkGameOver() {
  if (gGame.markedCount + gGame.shownCount === gLevel.size ** 2) {
    console.log('you won')
    SMILEY.src = '/imges/won.svg'
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
  console.log('you lost')
  clearInterval(gInterval)
}

// function expandShown(board, posI, posJ) {
//   for (var i = posI - 1; i <= posI + 1; i++) {
//     if (i < 0 || i >= board.length) continue

//     for (var j = posJ - 1; j <= posJ + 1; j++) {
//       if (j < 0 || j >= board[i].length) continue

//       if (i === posI && j === posJ) continue

//       if (
//         !board[i][j].minesAround &&
//         !board[i][j].isShown &&
//         !board[i][j].isMine
//       ) {
//         board[i][j].isShown = true
//         gGame.shownCount++
//         expandShown(board, i, j)
//       } else if (board[i][j].minesAround && !board[i][j].isShown) {
//         board[i][j].isShown = true
//         gGame.shownCount++
//         return
//       } else continue
//     }
//   }
// }

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

  SMILEY.src = '/imges/normal.svg'
  gMark = gLevel.mines
  clearInterval(gInterval)
  EL_TIME.innerText = 0
  initGame()
}

function expandShown(posI, posJ) {
  var count
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
      if (neg.minesAround === '') expandShown(i, j) // expend the cell with no  mines around
      // reveledNeg(i, j)
    }
  }
}

function reveledNeg(posI, posJ) {
  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue

      if (i === posI && j === posJ) continue

      var neg = gBoard[i][j]

      if (!neg.isMine) {
        neg.isShown = true
        gGame.shownCount++
      }
    }
  }
}

function getHelp(posI, posJ) {
  if (!gGame.isHelp) return

  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue

      if (i === posI && j === posJ) continue

      gBoard[i][j].isShown = true
      console.log(gBoard[i][j].isShown)
    }
  }
  renderBoard(gBoard)
}

function hideHelpCells(posI, posJ) {
  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue

      if (i === posI && j === posJ) continue

      gBoard[i][j].isShown = false
      console.log(gBoard[i][j].isShown)
    }
  }
  renderBoard(gBoard)
}

// function expandShown(posI, posJ) {
//   console.log(posI, posJ)
//   for (var i = posI - 1; i <= posI + 1; i++) {
//     if (i < 0 || i >= gBoard.length) continue

//     for (var j = posJ - 1; j <= posJ + 1; j++) {
//       if (j < 0 || j >= gBoard[i].length) continue

//       if (i === posI && j === posJ) continue
//       if (gBoard[i][j].minesAround)
//         if (gBoard[i][j].isMine || gBoard[i][j].isShown) continue

//       gBoard[i][j].isShown = true
//       console.log(
//         'this is the mines around',
//         gBoard[i][j].minesAround,
//         'this is the pos:',
//         i,
//         j
//       )

//       if (!gBoard[i][j].minesAround) expandShown(i, j)
//     }
//   }
//   return
// }
