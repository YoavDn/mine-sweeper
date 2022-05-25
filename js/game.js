'use strict'

const BOMB = '&ofcir;'
const FLAG = '&ofcir;'

var gBoard

var gLevel = {
  size: 4,
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
