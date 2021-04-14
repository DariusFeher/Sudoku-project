function newGame(no_digits_to_be_removed) {
	var boardElement = document.getElementById('board');
	if (boardElement) {
		var parentBoard = boardElement.parentElement;
		parentBoard.removeChild(boardElement);
	}

	var winMessageHeader = document.getElementById('winMessageHeader');
	if (winMessageHeader) {
		var parentHeader = winMessageHeader.parentElement;
		parentHeader.removeChild(winMessageHeader);
	}

	board = new Array(9);
	solution_board = board;
	board_after_remove = board;

	current_row = [-1];
	current_col = [-1];

	window.addEventListener('keydown',function() {fillCell(event, current_row, current_col, board, solution_board, board_after_remove)});

	createBoard(board, current_row, current_col);

	fillDiagonalBoxes(board);

	fillRemaining(0, 3, board);

	solution_board = getBoardCopy(board);
	console.log(solution_board);

	removeKDigits(no_digits_to_be_removed, board);

	board_after_remove = getBoardCopy(board);

	updateBoardView(board);
}

function getCellId(row, col) {
	return row.toString() + "," + col.toString();
}

function selectCell(event, cell, current_row, current_col) {
	var res = cell.id.split(",");
	var x = parseInt(res[0])
	var y = parseInt(res[1]);
	console.log(current_row, current_col);
	if (current_row != -1 && current_col != -1) {
		shadeUnshadeColRowBox(current_row, current_col, "unshade")
	}
	shadeUnshadeColRowBox(x, y, "shade")
	cell.className = "current_selected_cell";
	current_row[0] = x;
	current_col[0] = y;
}

function createBoard(board, current_row, current_col) {
	var table = document.createElement('table');
	table.className = "boardContainer";
	table.id = "board";
	for (var i = 0; i < 9; i++) {
		board[i] = new Array(9);
	    var tr = document.createElement('tr');
		for (var j = 0; j < 9; j++) {
			board[i][j] = 0;
		    var td = document.createElement('td');
		    var cell = document.createElement("BUTTON");
		    cell.id = i.toString() + "," + j.toString();
		    cell.className = "empty_cell";
		    cell.onmousedown = function() {selectCell(event, this, current_row, current_col)};
		    td.appendChild(cell);
		    tr.appendChild(td);
		}
	    table.appendChild(tr);
	}

	document.getElementById("table").appendChild(table);
}

function fillCell(event, current_row, current_col, board, solution_board, board_after_remove) {
	if (current_row != -1 && current_col != -1) { // Check if the user selected a cell before pressing a key
		var cell = document.getElementById(getCellId(current_row, current_col));
		updateContentAndColor(board, cell, current_row, current_col, event, board_after_remove)
	}
}

function updateContentAndColor(board, cell, i, j, event, board_after_remove) {
	if (cell.disabled == false && board_after_remove[i][j] == 0) {
		if (event.key >= 1 && event.key <= 9) {
			handleValidDigit(board, cell, i, j, parseInt(event.key));
		} else if (event.key == "Backspace") {
			handleBackSpace(cell, i, j, board, board_after_remove);
		}
	}
}

function handleValidDigit(board, cell, i, j, digit) {
	cell.innerHTML = event.key;
	if (checkIfSafe(i, j, parseInt(event.key)) == false) {
		cell.style.color = "red";
	} else {
		cell.style.color = "DarkBlue";
	}
	board[i][j] = digit;
	updateSafeUnsafeValues(board, board_after_remove);

	if (checkWin(board, solution_board)) {
		var winMessageDiv = document.getElementById("winMessage");
		var winMessageHeader = document.createElement("h1");
		winMessageHeader.id = "winMessageHeader"
		winMessageHeader.innerHTML = "Congratulations, you won!"
		winMessageDiv.appendChild(winMessageHeader);
		disableCells();
	}
}

function handleBackSpace(cell, i, j, board, board_after_remove) {
	cell.innerHTML = "";
	board[i][j] = 0;
	updateSafeUnsafeValues(board, board_after_remove);
}


function shadeUnshadeColRowBox(row, col, action) {
	if (action == "shade") {
		// Shade BOX
		var rowSt = Math.floor(row / 3) * 3;
		var colSt = Math.floor(col / 3) * 3;
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				var cell = document.getElementById(getCellId(rowSt + i, colSt + j));
				cell.className = "cell_shaded"
			}
		}
		// Shade ROW
		for (var j = 0; j < 9; j++) {
			var cell = document.getElementById(getCellId(row, j));
			cell.className = "cell_shaded"
		}
		// Shade COL
		for (var i = 0; i < 9; i++) {
			var cell = document.getElementById(getCellId(i, col));
			cell.className = "cell_shaded"
		}

	} else if (action == "unshade") {
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				var cell = document.getElementById(getCellId(i, j));
				if (cell.className == "cell_shaded" || cell.className == "current_selected_cell") {
					cell.className = "empty_cell"
				}
			}
		}
	}
}

function fillDiagonalBoxes(board) {
    for (var i = 0; i < 9; i += 3)
        fillBox(i, i, board);
}

function fillBox(row, col, board) {
    var digit;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
        	digit = 1 + Math.floor(Math.random() * 9);
            while (!checkIfSafe(row, col, digit)) {
            	digit = 1 + Math.floor(Math.random() * 9);
            }
            board[row + i][col + j] = digit;
        }
    }
}

function checkIfSafe(row, col, digit) {
	// Check if used in ROW
	for (var j = 0; j < 9; j++)
       if (board[row][j] == digit)
            return false;

    // Check if used in COL
    for (var i = 0; i<9; i++)
        if (board[i][col] == digit)
            return false;

    // Check if used in BOX
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j<3; j++) {
            if (board[row - row % 3 + i][col - col % 3 + j] == digit) {
                return false;
            }
        }
    }
    return true
}

function fillRemaining(i, j, board) {
    if (j == 9 && i == 8) {
    	return true;
    }

    if (j == 9) {
    	i++;
    	j = 0;
    }

    if (board[i][j] > 0) {
    	return fillRemaining(i, j + 1, board);
    }

    for (var digit = 1; digit <= 9; digit++) {
        if (checkIfSafe(i, j, digit)) {
            board[i][j] = digit;
            if (fillRemaining(i, j + 1, board)) {
                return true;
            }
            board[i][j] = 0;
        }
    }
    return false;
}

function removeKDigits(no_digits_to_be_removed, board) {
    var count = no_digits_to_be_removed;
    while (count != 0) {
        var i = Math.floor(Math.random() * 9);
        var j = Math.floor(Math.random() * 9);

        if (board[i][j] != 0) {
            count--;
            board[i][j] = 0;
        }
    }
}

function getBoardCopy(board) {
	var board_copy = new Array(9);

	for (var i = 0; i < 9; i++) {
		board_copy[i] = new Array(9);
		for (var j = 0; j < 9; j++) {
			board_copy[i][j] = board[i][j];
		}
	}
	return board_copy;
}

function updateBoardView(board) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
		    var cell = document.getElementById(i.toString() + "," + j.toString());
		    if (board[i][j]) {
		    	cell.innerHTML = board[i][j];
		    }
		}
	}
}

function updateSafeUnsafeValues(board, board_after_remove) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board_after_remove[i][j] == 0) {
			    var cell = document.getElementById(i.toString() + "," + j.toString());
			    var aux = board[i][j];
			    board[i][j] = 0;
			    if (checkIfSafe(i, j, aux)) {
			    	cell.style.color = "DarkBlue";
			    } else {
			    	cell.style.color = "red";
			    }
			    board[i][j] = aux;
			}
		}
	}
}

function checkWin(board, solution_board) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
		    if (board[i][j] != solution_board[i][j]) {
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