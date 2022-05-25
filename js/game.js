'use strict'

const BOMB = '&ofcir;'
const FLAG = '&ofcir;'

var gBoard

var gLevel = {
  size: 12,
  mines: 2,
}
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}

function initGame() {
  gBoard = buildBoard()
  getRendomMinePos(gBoard)
  updateCellNeg(gBoard)
  console.log(gBoard)
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
}

function cellClicked(elCell) {
  var cellPos = getCelPos(elCell)

  if (!gBoard[cellPos.i][cellPos.j].minesAround)
    expandShown(gBoard, cellPos.i, cellPos.j)
  if (gBoard[cellPos.i][cellPos.j].isShown === false) gGame.shownCount++

  if (gBoard[cellPos.i][cellPos.j].isMine) gameOver()

  gBoard[cellPos.i][cellPos.j].isShown = true

  checkGameOver()
  renderBoard(gBoard)
}

function getRendomMinePos(board = gLevel.size, mineCount = gLevel.mines) {
  var minesPosArr = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      minesPosArr.push({ i, j })
    }
  }
  shuffle(minesPosArr)
  minesPosArr = minesPosArr.slice(-mineCount)

  for (var i = 0; i < minesPosArr.length; i++) {
    gBoard[minesPosArr[i].i][minesPosArr[i].j].isMine = true
  }
  console.log(minesPosArr)
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
  } else {
    cell.isMarked = true
  }

  checkGameOver()
  console.log(gGame.markedCount)

  console.log(elCell)
  console.log(gBoard[cellPos.i][cellPos.j])
  renderBoard(gBoard)
}

function checkGameOver() {
  if (gGame.markedCount + gGame.shownCount === gLevel.size ** 2) {
    console.log('you won')
    return
  }
}

function gameOver() {
  console.log('you lost')
  return
}

function expandShown(board, posI, posJ) {
  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue

      if (i === posI && j === posJ) continue

      if (
        !board[i][j].minesAround &&
        !board[i][j].isShown &&
        !board[i][j].isMine
      ) {
        board[i][j].isShown = true
        gGame.isShown++
        expandShown(board, i, j)
      } else if (board[i][j].minesAround && !board[i][j].isShown) {
        board[i][j].isShown = true

        gGame.isShown++
      } else continue
    }
  }
}

// function expandShown(board, posI, posJ) {
//   for (var i = posI - 1; i <= posI + 1; i++) {
//     if (i < 0 || i >= board.length) continue

//     for (var j = posJ - 1; j <= posJ + 1; j++) {
//       if (j < 0 || j >= board[i].length) continue

//       if (i === posI && j === posJ) continue

//      var cell = board[i][j]
//     }
//   }
// }
