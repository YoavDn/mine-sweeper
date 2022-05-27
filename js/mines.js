'use strict'

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

function renderAllMines(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].isMine) board[i][j].isShown = true
    }
  }
}

function cleanCustomMines() {
  for (var i = 0; i < gCustom.customMinePos.length; i++) {
    var elCell = document.querySelector(
      `.cell-${gCustom.customMinePos[i].i}-${gCustom.customMinePos[i].j}`
    )
    elCell.innerText = ''
  }
}
