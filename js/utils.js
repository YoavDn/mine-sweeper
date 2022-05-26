'use strict'

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

// function updateCellNeg(board) {
//   for (var i = 0; i < board.length; i++) {
//     for (var j = 0; j < board[0].length; j++) {
//       var cell = board[i][j]
//       cell.minesAround = setMinesNegsCount(board, i, j)
//       if (!cell.minesAround) cell.minesAround = ''
//     }
//   }
// }

function getCelPos(cell) {
  var cellPos = cell.className.split('-')

  return {
    i: cellPos[1],
    j: cellPos[2],
  }
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5)
}

function addCellClass(cell, i, j) {
  var className = ` cell cell-${i}-${j}`

  if (cell.isMarked) className = 'marked ' + className
  if (!cell.minesAround && cell.isShown) className = 'empty ' + className
  if (cell.isMine && cell.isShown) className = 'mine ' + className
  if (cell.minesAround === 1 && cell.isShown) className = 'green ' + className
  if (cell.minesAround === 2 && cell.isShown) className = 'brown ' + className
  if (cell.minesAround === 3 && cell.isShown) className = 'orange ' + className
  if (cell.minesAround >= 3 && cell.isShown) className = 'red ' + className

  return className
}

function setDiff(elDiff) {
  if (elDiff.className === 'easy') {
    gLevel.size = 4
    gLevel.mines = 2
  }
  if (elDiff.className === 'medium') {
    gLevel.size = 8
    gLevel.mines = 12
  }
  if (elDiff.className === 'hard') {
    gLevel.size = 12
    gLevel.mines = 30
  }
  resetGame()
}

function showHelp() {
  var elHelpSigns = document.querySelectorAll('.help')

  for (var i = 0; i < elHelpSigns.length; i++) {
    elHelpSigns[i].classList.remove('hidden')
  }
}

function activateHelp(elHelp) {
  gGame.isHelp = true
  elHelp.src = './imges/active-help.svg'
  elHelp.id = 'active-cell'
  console.log(elHelp.id)
}

function updateHelpSign() {
  var elHelpSign = document.querySelector('#active-cell')
  elHelpSign.classList.add('hide-help-sign')
  elHelpSign.id = 'used'
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5)
}
