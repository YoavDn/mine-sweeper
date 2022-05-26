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

    //dont know why
    gInterval = setInterval(() => {
      gGame.secsPassed++
      EL_TIME.innerText = gGame.secsPassed
    }, 1000)
    gGame.isOn = true
  }
  var cellPos = getCelPos(elCell)

  if (!gBoard[cellPos.i][cellPos.j].minesAround) {
    expandShown(cellPos.i, cellPos.j)
  }
  if (gBoard[cellPos.i][cellPos.j].isShown === false) gGame.shownCount++

  if (gBoard[cellPos.i][cellPos.j].isMine) {
    gameOver(gBoard, cellPos.i, cellPos.j)
  }

  gBoard[cellPos.i][cellPos.j].isShown = true

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

  if (cell.isMarked) {
    cell.isMarked = false
    gMark++
  } else {
    cell.isMarked = true
    gMark--
  }

  console.log(gGame.markedCount)
  checkGameOver()

  //   console.log(elCell)
  //   console.log(gBoard[cellPos.i][cellPos.j])
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
    gGame.lives--
    LIFES[gGame.lives].classList.add('hidden') //

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
  }
  SMILEY.src = '/imges/normal.svg'
  gMark = gLevel.mines
  clearInterval(gInterval)
  EL_TIME.innerText = 0
  initGame()
}

function expandShown(posI, posJ) {
  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      if (i === posI && j === posJ) continue
      var neg = gBoard[i][j]

      if (neg.isShown || neg.isMine || neg.minesAround >= 1) continue // skip the neg that are shown or mine
      neg.isShown = true
      gGame.shownCount++
      if (!neg.minesAround) expandShown(i, j) // expend the cell with no  mines around
      reveledNeg(i, j)
    }
  }
}

function reveledNeg(posI, posJ) {
  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue

      if (i === posI && j === posJ) continue
      if (
        (i === posI - 1 && j === posJ - 1) || // get rig of dignonal
        (i === posI + 1 && j === posJ + 1) ||
        (i === posI - 1 && j === posJ + 1) ||
        (i === posI + 1 && j === posJ - 1)
      )
        continue
      var neg = gBoard[i][j]

      if (!neg.isMine && !neg.isShown && neg.minesAround !== '') {
        neg.isShown = true
        gGame.shownCount++
      }
    }
  }
}
