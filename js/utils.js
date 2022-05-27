'use strict'

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5)
}

function addCellClass(i, j) {
  var cell = gBoard[i][j]
  var className = `cell cell-${i}-${j}`

  if (cell.isMarked) className = 'marked ' + className
  if (!cell.minesAround && cell.isShown) className = 'empty ' + className
  if (cell.isMine && cell.isShown) className = 'mine ' + className
  if (cell.minesAround === 1 && cell.isShown) className = 'green ' + className
  if (cell.minesAround === 2 && cell.isShown) className = 'brown ' + className
  if (cell.minesAround === 3 && cell.isShown) className = 'orange ' + className
  if (cell.minesAround >= 3 && cell.isShown) className = 'red ' + className

  return className
}

function showHelp() {
  var elHelpSigns = document.querySelectorAll('.help')

  for (var i = 0; i < elHelpSigns.length; i++) {
    elHelpSigns[i].classList.toggle('hide-help-sign')
  }
}

function activateHelp(elHelp) {
  if (gGame.gameEnd) return
  gGame.isHelp = true
  elHelp.src = 'imges/active-help.svg'
  elHelp.id = 'active-cell'
  console.log(elHelp.id)
}

function updateHelpSign() {
  var elHelpSign = document.querySelector('#active-cell')
  elHelpSign.classList.add('hide-help-sign')
  elHelpSign.id = 'used'
}

function resetDom() {
  SMILEY.src = 'imges/normal.svg'
  EL_TIME.innerText = 0
  CUSTOM.classList.remove('red')

  var elHelpSigns = document.querySelectorAll('.help')

  for (var i = 0; i < elHelpSigns.length; i++) {
    elHelpSigns[i].classList.add('hide-help-sign')
    elHelpSigns[i].src = 'imges/help.svg'
    LIFES[i].classList.remove('hidden')
  }
}

function renderCell(i, j, display) {
  var elCell = document.querySelector(`.cell-${i}-${j}`)
  var className = addCellClass(i, j)
  console.log(elCell)
  var cellValue = gBoard[i][j].minesAround
  if (gBoard[i][j].isMarked) return
  if (gBoard[i][j].isShown) return
  if (gBoard[i][j].isMine) cellValue = 'M'
  // if (!gBoard[i][j].minesAround) cellValue = ''

  elCell.innerHTML = display ? cellValue : ''
}

function startGame() {
  renderBoard(gBoard)

  gInterval = setInterval(() => {
    gGame.secsPassed++
    EL_TIME.innerText = gGame.secsPassed
  }, 1000)
  gGame.isOn = true
}

function setDiff() {
  var diff = document.getElementById('diff')
  var option = diff.options[diff.selectedIndex]
  console.log(option.value)
  if (option.value === 'easy') {
    gLevel.level = 'easy'
    gLevel.size = 4
    gLevel.mines = 2
  }
  if (option.value === 'medium') {
    gLevel.level = 'medium'
    gLevel.size = 8
    gLevel.mines = 12
  }
  if (option.value === 'hard') {
    gLevel.level = 'hard'
    gLevel.size = 12
    gLevel.mines = 30
  }
  resetGame()
}
