function beginnerGame() {
	newGame(15);
}

function intermediateGame() {
	newGame(45);
}

function expertGame() {
	newGame(60);
}

function newGame(no_digits_to_be_removed) {
	var board = document.getElementById('board');
	if (board) {
		var parentBoard = board.parentElement;
		parentBoard.removeChild(board);
	}

	this.board = new Array(9);

	window.addEventListener('keydown',function() {fillCell(event)});

	this.current_row = -1;
	this.current_col = -1;

	createBoard();

	fillDiagonalBoxes();

	fillRemaining(0, 3);

	this.solution_board = getBoardCopy();

	removeKDigits(no_digits_to_be_removed);

	this.board_after_remove = getBoardCopy();

	updateBoardView();
}

function getCellId(row, col) {
	return row.toString() + "," + col.toString();
}

function selectCell(event, cell) {
	var res = cell.id.split(",");
	var x = parseInt(res[0])
	var y = parseInt(res[1]);
	
	if (this.current_row != -1 && this.current_col != -1) {
		var last_cell = document.getElementById(getCellId(this.current_row, this.current_col));
		last_cell.style.backgroundColor = "white";
		shadeUnshadeRow(this.current_row, "unshade");
		shadeUnshadeCol(this.current_col, "unshade");
		shadeUnshadeBox(this.current_row, this.current_col, "unshade");
	}
	
	shadeUnshadeRow(x, "shade");
	shadeUnshadeCol(y, "shade");
	shadeUnshadeBox(x, y, "shade");
	cell.style.backgroundColor = "DarkGreen";
	this.current_row = x;
	this.current_col = y;
}

function createBoard() {
	var table = document.createElement('table');
	table.className = "boardContainer";
	table.id = "board";
	for (var i = 0; i < 9; i++) {
		this.board[i] = new Array(9);
	    var tr = document.createElement('tr');
		for (var j = 0; j < 9; j++) {
			this.board[i][j] = 0;
		    var td = document.createElement('td');
		    var cell = document.createElement("BUTTON");
		    cell.id = i.toString() + "," + j.toString();
		    cell.className = "table_but";
		    cell.onmousedown = function() {selectCell(event, this)};
		    td.appendChild(cell);
		    tr.appendChild(td);
		}
	    table.appendChild(tr);
	}

	document.getElementById("table").appendChild(table);
}

function fillCell(event) {
	if (this.current_row != -1 && this.current_col != -1) {
		var i = this.current_row;
		var j = this.current_col;
		var cell = document.getElementById(getCellId(i, j));
		if (cell.disabled == false) {
			if (this.board_after_remove[i][j] == 0) {
				if (event.key >= 1 && event.key <= 9) {
					cell.innerHTML = event.key;
					this.board[i][j] = parseInt(event.key);
					updateSafeUnsafeValues();
					if (checkWin()) {
						alert("Congratulations, you won!");
						disableCells();
					}
				} else if (event.key == "Backspace") {
					cell.innerHTML = "";
					this.board[i][j] = 0;
				}
			}
		}
	}
}

function shadeUnshadeBox(row, col, action) {
	var rowSt = Math.floor(row / 3) * 3;
	var colSt = Math.floor(col / 3) * 3;
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			var cell = document.getElementById(getCellId(rowSt + i, colSt + j));
			if (action == "shade") {
				cell.style.backgroundColor = "DarkSeaGreen";
			} else if (action == "unshade") {
				cell.style.backgroundColor = "white";
			}
		}
	}
}


function shadeUnshadeRow(row, action) {
	for (var j = 0; j < 9; j++) {
		var cell = document.getElementById(getCellId(row, j));
		if (action == "shade") {
			cell.style.backgroundColor = "DarkSeaGreen";
		} else if (action == "unshade") {
			cell.style.backgroundColor = "white";
		}
	}
}

function shadeUnshadeCol(col, action) {
	for (var i = 0; i < 9; i++) {
		var cell = document.getElementById(getCellId(i, col));
		if (action == "shade") {
			cell.style.backgroundColor = "DarkSeaGreen";
		} else if (action == "unshade") {
			cell.style.backgroundColor = "white";
		}
	}
}

function fillDiagonalBoxes() {
    for (var i = 0; i < 9; i += 3)
        fillBox(i, i);
}
  
function unUsedInBox(rowStart, colStart, digit) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j<3; j++) {
            if (this.board[rowStart + i][colStart + j] == digit) {
                return false;
            }
        }
    }
    return true;
}

function fillBox(row, col) {
    var digit;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
        	digit = 1 + Math.floor(Math.random() * 9);
            while (!unUsedInBox(row, col, digit)) {
            	digit = 1 + Math.floor(Math.random() * 9);
            }
            this.board[row + i][col + j] = digit;
        }
    }
}

  
function CheckIfSafe(i, j, digit) {
    return (unUsedInRow(i, digit) &&
            unUsedInCol(j, digit) &&
            unUsedInBox(i - i % 3, j - j % 3, digit));
}
  
function unUsedInRow(i, digit) {
    for (var j = 0; j < 9; j++)
       if (this.board[i][j] == digit)
            return false;
    return true;
}
  
function unUsedInCol(j, digit) {
    for (var i = 0; i<9; i++)
        if (this.board[i][j] == digit)
            return false;
    return true;
}
  
function fillRemaining(i, j) {
    if (j >= 9 && i < 8) {
        i++;
        j = 0;
    }

    if (i >= 9 && j >= 9) {
        return true;
    }

    if (i < 3) {
        if (j < 3) {
            j = 3;
        }
    } else if (i < 6) {
        if (j == Math.floor(i / 3) * 3) {
            j += 3;
        }
    } else {
        if (j == 6) {
            i++;
            j = 0;
            if (i >= 9) {
                return true;
            }
        }
    }

    for (var digit = 1; digit <= 9; digit++) {
        if (CheckIfSafe(i, j, digit)) {
            this.board[i][j] = digit;
            if (fillRemaining(i, j + 1)) {
                return true;
            }
            this.board[i][j] = 0;
        }
    }
    return false;
}

function removeKDigits(no_digits_to_be_removed) {
    var count = no_digits_to_be_removed;
    while (count != 0) {
        var i = Math.floor(Math.random() * 9);
        var j = Math.floor(Math.random() * 9);

        if (this.board[i][j] != 0) {
            count--;
            this.board[i][j] = 0;
        }
    }
}

function getBoardCopy() {
	var board_copy = new Array(9);

	for (var i = 0; i < 9; i++) {
		board_copy[i] = new Array(9);
		for (var j = 0; j < 9; j++) {
			board_copy[i][j] = this.board[i][j];
		}
	}
	return board_copy;
}

function updateBoardView() {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
		    var cell = document.getElementById(i.toString() + "," + j.toString());
		    if (this.board[i][j]) {
		    	cell.innerHTML = this.board[i][j];
		    }
		}
	}
}

function updateSafeUnsafeValues() {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
		    var cell = document.getElementById(i.toString() + "," + j.toString());
		    var aux = this.board[i][j];
		    this.board[i][j] = 0;
		    if (CheckIfSafe(i, j, aux)) {
		    	cell.style.color = "DarkBlue";
		    } else {
		    	cell.style.color = "red";
		    }
		    this.board[i][j] = aux;
		}
	}
}

function checkWin() {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
		    if (this.board[i][j] != this.solution_board[i][j]) {
		    	return false;
		    }
		}
	}
	return true;
}

function disableCells() {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
		    var cell = document.getElementById(i.toString() + "," + j.toString());
		    cell.disabled = true;
		}
	}
}