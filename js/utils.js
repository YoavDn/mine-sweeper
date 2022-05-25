'use strict'

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

function setMinesNegsCount(board, posI, posJ) {
  var count = 0
  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue

      if (i === posI && j === posJ) continue

      if (board[i][j].isMine) count++
    }
  }
  return count
}

function updateCellNeg(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j]
      cell.minesAround = setMinesNegsCount(board, i, j)
      if (!cell.minesAround) cell.minesAround = ''
    }
  }
}

function getCelPos(cell) {
  var cellPos = cell.className.split('-')
  return {
    i: cellPos[1],
    j: cellPos[2],
  }
}

function cellClicked(elCell) {
  var cellPos = getCelPos(elCell)
  gBoard[cellPos.i][cellPos.j].isShown = true
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
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5)
}
