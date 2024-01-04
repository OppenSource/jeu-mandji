document.addEventListener('DOMContentLoaded', function() {
    let board = document.getElementById('board');
    let scoreElement = document.getElementById('score');
    let currentPlayer = 0;
    let boardArray = Array.from({ length: 7 }, () => Array(7).fill(''));
    let playerNames = ['', '']; // Noms des joueurs

    initializePlayers();
    initializeBoard();

    function initializePlayers() {
        playerNames[0] = prompt("Entrez le nom du joueur Noir :") || 'Black';
        playerNames[1] = prompt("Entrez le nom du joueur Blanc :") || 'White';
        updateScore(); // Mettre à jour les noms des joueurs dès le début
    }

    function restartGame() {
        // Réinitialise le tableau et le joueur courant
        boardArray = Array.from({ length: 7 }, () => Array(7).fill(''));
        currentPlayer = 0;

        // Réinitialise le tableau visuel
        updateBoard();
    }

    function initializeBoard() {
        // Ajoute deux cases de chaque joueur au centre
        boardArray[4][4] = 'Black';
        boardArray[4][3] = 'Black';
        boardArray[3][3] = 'White';
        boardArray[3][4] = 'White';

        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => onCellClick(row, col));
                board.appendChild(cell);
            }
        }
        updateBoard();
        updateScore();
    }

    function onCellClick(row, col) {
        if (boardArray[row][col] === '') {
            boardArray[row][col] = currentPlayer === 0 ? 'Black' : 'White';
            currentPlayer = 1 - currentPlayer; // Switch player
            updateBoard();
            let winner = checkWinner();
            if (winner !== null) {
                showBootstrapAlert(`Le joueur ${playerNames[winner]} a gagné!`, 'success');
                restartGame();
            } else if (isBoardFull()) {
                showBootstrapAlert("Match nul!", 'warning');
                restartGame();
            }
        }
    }

    function updateBoard() {
        let cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            let row = parseInt(cell.dataset.row);
            let col = parseInt(cell.dataset.col);
            cell.textContent = boardArray[row][col];
            cell.classList.remove('black', 'white');
            if (boardArray[row][col] === 'Black') {
                cell.classList.add('black');
            } else if (boardArray[row][col] === 'White') {
                cell.classList.add('white');
            }
        });
        updateScore();
    }

    function updateScore() {
        let scorePlayer1 = boardArray.flat().filter(color => color === 'Black').length;
        let scorePlayer2 = boardArray.flat().filter(color => color === 'White').length;
        scoreElement.textContent = `${playerNames[0]}: ${scorePlayer1} | ${playerNames[1]}: ${scorePlayer2}`;
    }

    function checkWinner() {
        // Check rows, columns, and diagonals for a winner
        if (checkLinesForWinner(boardArray) || checkColumnsForWinner(boardArray) || checkDiagonalsForWinner(boardArray)) {
            return currentPlayer === 0 ? 0 : 1;
        }
        return null;
    }

    function checkLinesForWinner(board) {
        for (let row = 0; row < 7; row++) {
            if (board[row][0] !== '' && board[row][0] === board[row][1] && board[row][0] === board[row][2] && board[row][0] === board[row][3] && board[row][0] === board[row][4] && board[row][0] === board[row][5] && board[row][0] === board[row][6]) {
                return true;
            }
        }
        return false;
    }

    function checkColumnsForWinner(board) {
        for (let col = 0; col < 7; col++) {
            if (board[0][col] !== '' && board[0][col] === board[1][col] && board[0][col] === board[2][col] && board[0][col] === board[3][col] && board[0][col] === board[4][col] && board[0][col] === board[5][col] && board[0][col] === board[6][col]) {
                return true;
            }
        }
        return false;
    }

    function checkDiagonalsForWinner(board) {
        if (board[0][0] !== '' && board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] === board[3][3] && board[0][0] === board[4][4] && board[0][0] === board[5][5] && board[0][0] === board[6][6]) {
            return true;
        }
        if (board[0][6] !== '' && board[0][6] === board[1][5] && board[0][6] === board[2][4] && board[0][6] === board[3][3] && board[0][6] === board[4][2] && board[0][6] === board[5][1] && board[0][6] === board[6][0]) {
            return true;
        }
        return false;
    }

    function isBoardFull() {
        return boardArray.flat().every(cell => cell !== '');
    }

    function restartGame() {
        boardArray = Array.from({ length: 7 }, () => Array(7).fill(''));
        currentPlayer = 0;
        updateBoard();
    }

    function showBootstrapAlert(message, type) {
        // Create a Bootstrap alert element
        let alertElement = document.createElement('div');
        alertElement.classList.add('alert', `alert-${type}`);
        alertElement.role = 'alert';
        alertElement.innerHTML = `
        <strong>${message}</strong>
        `;
        
        // Append the alert to the container
        let container = document.querySelector('.container');
        container.appendChild(alertElement);

        // Automatically dismiss the alert after 3 seconds (adjust as needed)
        setTimeout(() => {
            alertElement.remove();
        }, 3000);
    }
});