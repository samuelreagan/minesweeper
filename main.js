const state = {
  board: [],
  boardSize: 10,
  totalBombs: 10,
  bombs:[],
  grid: document.getElementById('board')
}

function createCells(s) {
  for (let i = 0; i < s.boardSize; i++) {
    s.board[i] = [];
    for (let j = 0; j < s.boardSize; j++) {
      s.board[i][j] = {
        isHidden: true,
        hasBomb: false,
        adjBombs: 0,
        expanded: false
      };
    }
  }
}

function generateBombs(s) {
  for (let i = 0; i < s.totalBombs; i++) {
    // Generate a random number between 0-9 for the row and column
    let randomRow = getRandomNumber(s);
    let randomCol = getRandomNumber(s);

    // console.log(randomRow, randomCol);

    while (s.board[randomRow][randomCol].hasBomb) {
      // console.log('Duplicate', randomRow, randomCol);
      randomRow = getRandomNumber(s);
      randomCol = getRandomNumber(s);
    }
    
    s.board[randomRow][randomCol].hasBomb = true;
    s.bombs.push({row: randomRow, col: randomCol});
  }
  //s.board[2][2].hasBomb = true;
  //s.bombs.push({row: 2, col: 2});
}

function getRandomNumber(s) {
  return Math.floor(Math.random() * (s.boardSize - 1));
}

function calculateAdjBombs(s) {
  for (let i = 0; i < s.bombs.length; i++) {
    console.log(s.bombs[i]);
    let bomb = s.bombs[i];
    // Top Left
    if (bomb.row - 1 > -1 && bomb.col - 1 > -1 && !s.board[bomb.row - 1][bomb.col - 1].hasBomb) {
      s.board[bomb.row - 1][bomb.col - 1].adjBombs++;
    }
    // Top Right
    if (bomb.row - 1 > -1 && bomb.col + 1 < s.boardSize && !s.board[bomb.row - 1][bomb.col + 1].hasBomb) {
      s.board[bomb.row - 1][bomb.col + 1].adjBombs++;
    }
    // Top
    if (bomb.row - 1 > -1 && !s.board[bomb.row - 1][bomb.col].hasBomb) {
      s.board[bomb.row - 1][bomb.col].adjBombs++;
    }
    // Left
    if (bomb.col - 1 > -1 && !s.board[bomb.row][bomb.col - 1].hasBomb) {
      s.board[bomb.row][bomb.col - 1].adjBombs++;
    }
    // Right
    if (bomb.col + 1 < s.boardSize && !s.board[bomb.row][bomb.col + 1].hasBomb) {
      s.board[bomb.row ][bomb.col + 1].adjBombs++;
    }
    // Bottom Right
    if (bomb.row + 1 < s.boardSize && bomb.col + 1 < s.boardSize && !s.board[bomb.row + 1][bomb.col + 1].hasBomb) {
      s.board[bomb.row + 1][bomb.col + 1].adjBombs++;
    }
    // Bottom Left
    if (bomb.row + 1 < s.boardSize && bomb.col - 1 > -1 && !s.board[bomb.row + 1][bomb.col - 1].hasBomb) {
      s.board[bomb.row + 1][bomb.col - 1].adjBombs++;
    }
    // Bottom
    if (bomb.row + 1 < s.boardSize && !s.board[bomb.row + 1][bomb.col].hasBomb) {
      s.board[bomb.row + 1][bomb.col].adjBombs++;
    }
  }
}

function drawBoard(s) {
  for (let i = 0; i < s.boardSize; i++) {
    for (let j = 0; j < s.boardSize; j++) {
      let cell = document.createElement('div');
      cell.classList.add('block');
      cell.style.background = (j + i) % 2 == 0 ? '#ff4538' : '#e03f34';
      cell.setAttribute('data-row', i);
      cell.setAttribute('data-col', j);
      cell.addEventListener('click', cellClick);
      s.grid.appendChild(cell);
    }
  }
}

function cellClick(event) {
  let cell = event.target;
  let row = Number(cell.getAttribute('data-row'));
  let col = Number(cell.getAttribute('data-col'));

  if (state.board[row][col].isHidden) {
    cell.style.background = (col + row) % 2 == 0 ? '#ccc' : '#eee';
    state.board[row][col].isHidden = false;

    if (state.board[row][col].hasBomb) {
      showBombs(state);
    } else if (state.board[row][col].adjBombs > 0) {
      cell.textContent = state.board[row][col].adjBombs;
    } else if (state.board[row][col].adjBombs == 0) {
      expand(state, row, col);
    }
  }
}

function expand(s, row, col) {
  let cell = document.querySelectorAll([`[data-row='${row}'][data-col='${col}']`]);

  if (cell.length && !s.board[row][col].expanded) {
    s.board[row][col].expanded = true;
    if (s.board[row][col].adjBombs == 0) {
      expand(s, row - 1, col);
      expand(s, row + 1, col);
      expand(s, row, col - 1);
      expand(s, row, col + 1);
    } else {
      cell[0].textContent = s.board[row][col].adjBombs;
    }
    s.board[row][col].isHidden = false;
    cell[0].style.background = (col + row) % 2 == 0 ? '#ccc' : '#eee';
  }
}

function showBombs(s) {
  s.bombs.forEach(bomb => {
    let cell = document.querySelectorAll([`[data-row='${bomb.row}'][data-col='${bomb.col}']`])[0];
    cell.style.background = 'blue';
    //cell.textContent = '💣';
    document.getElementById('message').textContent = 'You lose';
  });
}

// Create Cells
createCells(state);

// Generate Bombs
generateBombs(state);

// Label Numbers for Nearby Bombs
calculateAdjBombs(state);

// Draw Board
drawBoard(state);

console.log(state);

// 🚩