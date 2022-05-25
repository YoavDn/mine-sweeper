"use strict"

const BOMB = "&ofcir;"

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
  console.table(gBoard)
  console.log(gBoard)
  renderBoard(gBoard)
}

function buildBoard() {
  var board = []

  for (var i = 0; i < gLevel.size; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.size; j++) {
      board[i][j] = {
        minesAroundCount: "",
        isShown: true,
        isMine: false,
        isMarked: true,
      }
    }
  }

  return board
}
