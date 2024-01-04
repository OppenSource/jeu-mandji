document.addEventListener('DOMContentLoaded', function () {
    let board = document.getElementById('board');
    let scoreElement = document.getElementById('score');
    let currentPlayer = 0;
    let boardArray = Array.from({ length: 8 }, () => Array(8).fill(''));
    let playerNames = ['', '']; // Noms des joueurs

    initializePlayers();
    initializeBoard();

    function initializePlayers() {
        playerNames[0] = prompt("Entrez le nom du joueur Noir :") || 'Black';
        playerNames[1] = prompt("Entrez le nom du joueur Blanc :") || 'White';
        updateScore(); // Mettre à jour les noms des joueurs dès le début
    }

    function restartGame() {
        location.replace(location.href);
    }

    function initializeBoard() {
        // Ajoute deux cases de chaque joueur au centre
        boardArray[3][3] = 'Black';
        boardArray[3][4] = 'Black';
        boardArray[4][3] = 'White';
        boardArray[4][4] = 'White';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
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
        if (boardArray[row][col] === '' && isAdjacentCellSelected(row, col) && isDirectlyConnected(row, col)) {
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
        } else {
            showBootstrapAlert("Erreur : action impossible", 'danger');
        }
    }

    function isAdjacentCellSelected(row, col) {
        // Vérifie si une cellule adjacente a déjà été sélectionnée
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < 8 && j >= 0 && j < 8 && !(i === row && j === col) && boardArray[i][j] !== '') {
                    return true;
                }
            }
        }
        return false;
    }

    function isDirectlyConnected(row, col) {
        // Vérifie si la cellule est directement connectée à une cellule sélectionnée
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < 8 && j >= 0 && j < 8 && !(i === row && j === col) && boardArray[i][j] !== '' && isCellConnected(row, col, i, j)) {
                    return true;
                }
            }
        }
        return false;
    }

    function isCellConnected(row1, col1, row2, col2) {
        // Vérifie si deux cellules sont directement connectées
        return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
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
        for (let row = 0; row < 8; row++) {
            if (board[row][0] !== '' && board[row][0] === board[row][1] && board[row][0] === board[row][2] && board[row][0] === board[row][3] && board[row][0] === board[row][4] && board[row][0] === board[row][5] && board[row][0] === board[row][6] && board[row][0] === board[row][7]) {
                return true;
            }
        }
        return false;
    }

    function checkColumnsForWinner(board) {
        for (let col = 0; col < 8; col++) {
            if (board[0][col] !== '' && board[0][col] === board[1][col] && board[0][col] === board[2][col] && board[0][col] === board[3][col] && board[0][col] === board[4][col] && board[0][col] === board[5][col] && board[0][col] === board[6][col] && board[0][col] === board[7][col]) {
                return true;
            }
        }
        return false;
    }

    function checkDiagonalsForWinner(board) {
        if (board[0][0] !== '' && board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] === board[3][3] && board[0][0] === board[4][4] && board[0][0] === board[5][5] && board[0][0] === board[6][6] && board[0][0] === board[7][7]) {
            return true;
        }
        if (board[0][7] !== '' && board[0][7] === board[1][6] && board[0][7] === board[2][5] && board[0][7] === board[3][4] && board[0][7] === board[4][3] && board[0][7] === board[5][2] && board[0][7] === board[6][1] && board[0][7] === board[7][0]) {
            return true;
        }
        return false;
    }

    function isBoardFull() {
        return boardArray.flat().every(cell => cell !== '');
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
