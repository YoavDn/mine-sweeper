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

function addCellClass(cell, i, j) {
  var className = ` cell cell-${i}-${j}`

  if (cell.isMarked) className = 'marked ' + className
  if (cell.minesAround === '' && cell.isShown) className = 'empty ' + className
  if (cell.isMine && cell.isShown) className = 'mine ' + className
  if (cell.minesAround === 1 && cell.isShown) className = 'green ' + className
  if (cell.minesAround === 2 && cell.isShown) className = 'brown ' + className
  if (cell.minesAround === 3 && cell.isShown) className = 'orange ' + className
  if (cell.minesAround > 3 && cell.isShown) className = 'red ' + className

  return className
}
