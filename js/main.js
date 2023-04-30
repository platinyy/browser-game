  /*----- constants -----*/
  const COLORS = {
    '0': 'white',
    '1': 'purple',
    '-1':'orange'
  };

  /*----- state variables -----*/
  let board; // array of 7 column arrays
  let turn; //  1 or -1 
  let winner; // null = no winner ; 1 or -1 winner; 'T' tie game

  /*----- cached elements  -----*/
const messageEl = document.querySelector('h1');

const playAgainBtn = document.querySelector('button');
const markerEls = [...document.querySelectorAll('#markers > div')];


  /*----- event listeners -----*/
  document.getElementById('markers').addEventListener('click', handleDrop);
playAgainBtn.addEventListener('click', init);
  /*----- functions -----*/
  init();
//initialize all state , then call render()
  function init(){

    board = [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0], 
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0], 
    ];
    turn = 1;
    winner = null;
    render();
  }



  function render() {
    renderBoard();
    renderMessage();
    renderControls();

  }
  function renderBoard(){
    board.forEach(function(colArr, colIdx){
        colArr.forEach(function(cellVal ,rowIdx){
        const cellId = `c${colIdx}r${rowIdx}`;
        const cellEl = document.getElementById(cellId);
        cellEl.style.backgroundColor = COLORS[cellVal];
    });
    });
  }

  function renderMessage(){
    if (winner === 'T') { 
      messageEl.innerText = "It's a Tie!!!";  
    }else if (winner){
        messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> Wins!`;
    }else {
        messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s Turn`;
        }
  }

  function renderControls(){
    playAgainBtn.style.visibility = winner ? 'visible': 'hidden';

    markerEls.forEach(function(markerEl, colIdx){
    const hideMarker = !board[colIdx].includes(0) || winner;
    markerEl.style.visibility = hideMarker ? 'hidden' : 'visible';


});
}

function handleDrop(evt){
    const colIdx =markerEls.indexOf(evt.target);
    if (colIdx === -1 )  return;
    const colArr = board[colIdx];
    const rowIdx = colArr.indexOf(0);
    colArr[rowIdx] = turn;
    turn *= -1;
    winner = getWinner(colIdx, rowIdx);
    render();
}

function getWinner(colIdx, rowIdx){
    return checkVerticalWin(colIdx,rowIdx) ||
    checkHorizontalWin (colIdx,rowIdx) ||
    checkDiagonalWinNESW(colIdx,rowIdx) ||
    checkDiagonalWinNWSE(colIdx,rowIdx);
}

function checkVerticalWin(colIdx, rowIdx){
   
    return countAdjacent(colIdx, rowIdx, 0,-1) ===3 ? board[colIdx][rowIdx] : null;

}
function checkDiagonalWinNWSE(colIdx, rowIdx){
    const adjCountNW = countAdjacent(colIdx, rowIdx, -1, 1);
    const adjCountSE = countAdjacent(colIdx, rowIdx, 1, -1);
   return (adjCountNW + adjCountSE) >=3 ? board[colIdx][rowIdx] : null;

}
function checkDiagonalWinNESW(colIdx, rowIdx){
    const adjCountNE = countAdjacent(colIdx, rowIdx, 1, 1);
    const adjCountSW = countAdjacent(colIdx, rowIdx, -1, -1);
   return (adjCountNE + adjCountSW) >=3 ? board[colIdx][rowIdx] : null;

}
function checkHorizontalWin(colIdx, rowIdx){
    const adjCountLeft = countAdjacent(colIdx, rowIdx, -1, 0);
    const adjCountRight = countAdjacent(colIdx, rowIdx, 1, 0);
   return (adjCountLeft + adjCountRight ) >=3 ? board[colIdx][rowIdx] : null;

}

function countAdjacent(colIdx,rowIdx, colOffset, rowOffset){
    const player = board[colIdx][rowIdx];
    let count =0;
    colIdx += colOffset;
    rowIdx += rowOffset;
    while (
        board[colIdx] !== undefined && 
        board[colIdx][rowIdx] !== undefined &&
        board[colIdx][rowIdx] === player
    ){
        count ++;
        colIdx += colOffset;
        rowIdx += rowOffset;
    }
    return count;
}