"use strict"

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

function renderBoard(board) {
  var boardContainer = document.querySelector(".board-container")
  var strHtml = "<table>"

  for (var i = 0; i < board.length; i++) {
    strHtml += `<tr>`
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j]
      var className = "cell cell-" + i + "-" + j
      strHtml += `<td class="${className}">${cell.minesAroundCount}</td>`
    }
    strHtml += `</tr>`
  }
  strHtml += `</table>`

  boardContainer.innerHTML = strHtml
}

function setMinesNegsCount(board) {
  var count = 0
  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i >= mat.length) continue

    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue

      if (i === posI && j === posJ) continue

      if (mat[i][j] === life) count++
    }
  }
  return count
}
