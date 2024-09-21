const gameBoard = document.querySelector("#game-board");
const infoDisplay = document.querySelector("#info");
const resetButton = document.querySelector("#reset-button");
const aiSelect = document.querySelector("#ai-algorithm");

let currentPlayer = 'O'; // O is player, X is AI
let board = Array(9).fill('');

// Define winning combinations
const winningCombo = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Initialize the board
function createBoard() {
    gameBoard.innerHTML = '';
    board = Array(9).fill('');
    currentPlayer = 'O';
    infoDisplay.textContent = "Player O's turn";

    board.forEach((_, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("square");
        cellElement.addEventListener("click", () => playerMove(index));
        gameBoard.append(cellElement);
    });
}

// Player's move
function playerMove(index) {
    if (board[index] === '') {
        board[index] = currentPlayer;
        updateBoard();
        if (!checkWinner()) {
            currentPlayer = 'X';
            aiMove();
        }
    }
}

// AI's move
function aiMove() {
    const aiAlgorithm = aiSelect.value;
    let bestMove;

    if (aiAlgorithm === "minimax") {
        bestMove = getBestMoveMinimax();
    } else if (aiAlgorithm === "alpha-beta") {
        bestMove = getBestMoveAlphaBeta();
    } else if (aiAlgorithm === "negamax") {
        bestMove = getBestMoveNegamax();
    } else if (aiAlgorithm === "mcts") {
        bestMove = getBestMoveMCTS();
    } else {
        bestMove = getBestMoveHeuristics();
    }

    board[bestMove] = currentPlayer;
    updateBoard();
    if (!checkWinner()) {
        currentPlayer = 'O';
        infoDisplay.textContent = "Player O's turn";
    }
}

// Update the board display
function updateBoard() {
    gameBoard.childNodes.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

// Check if there's a winner or draw
function checkWinner() {
    let winner = null;

    winningCombo.forEach(combo => {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winner = board[a];
        }
    });

    if (winner) {
        infoDisplay.textContent = `${winner} wins!`;
        return true;
    } else if (board.every(cell => cell)) {
        infoDisplay.textContent = "It's a draw!";
        return true;
    }

    return false;
}

// Reset the game
resetButton.addEventListener("click", createBoard);

// Initialize game on page load
createBoard();



//Minmax
function getBestMoveMinimax() {
    let bestScore = -Infinity;
    let bestMove;

    board.forEach((cell, index) => {
        if (cell === '') {
            board[index] = 'X';
            let score = minimax(board, 0, false);
            board[index] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }
    });
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const score = evaluateBoard(board);
    if (score !== 0 || board.every(cell => cell)) return score;

    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach((cell, index) => {
            if (cell === '') {
                board[index] = 'X';
                let score = minimax(board, depth + 1, false);
                board[index] = '';
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach((cell, index) => {
            if (cell === '') {
                board[index] = 'O';
                let score = minimax(board, depth + 1, true);
                board[index] = '';
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function evaluateBoard(board) {
    for (const combo of winningCombo) {
        const [a, b, c] = combo;
        if (board[a] === board[b] && board[a] === board[c]) {
            if (board[a] === 'X') return 10;
            if (board[a] === 'O') return -10;
        }
    }
    return 0;
}


//Alpha Beta
//
// function getBestMoveAlphaBeta() {
//     let bestScore = -Infinity;
//     let bestMove;
//
//     board.forEach((cell, index) => {
//         if (cell === '') {
//             board[index] = 'X';
//             let score = minimaxAlphaBeta(board, 0, false, -Infinity, Infinity);
//             board[index] = '';
//             if (score > bestScore) {
//                 bestScore = score;
//                 bestMove = index;
//             }
//         }
//     });
//     return bestMove;
// }
// function minimaxAlphaBeta(board, depth, isMaximizing, alpha , beta) {
//     const score = evaluateBoard(board)
//
//     if(score !== 0 || board.every(cell => cell)) return score;
//
// if(isMaximizing){
//     let bestScore = -Infinity;
//     board.forEach((cell, index) => {
//         if(cell === ''){
//             board[index] ='X';
//             let score = minimaxAlphaBeta(board , depth + 1, false, alpha , beta);
//
//             board[index] = '';
//             bestScore = Math.max(score, bestScore);
//             alpha = Math.max(alpha, bestScore);
//             if(beta <= alpha) return bestScore;
//         }
//     })
//
//     return bestScore;
// }else {
//     let bestScore = Infinity;
//     board.forEach((cell, index) => {
//         if(cell === ''){
//             board[index] ='O';
//             let score = minimaxAlphaBeta(board , depth + 1, true, alpha , beta);
//
//             board[index] = '';
//             bestScore = Math.min(score, bestScore);
//             beta = Math.min(beta, bestScore);
//             if(beta <=alpha) return bestScore;
//         }
//     })
//     return bestScore;
// }
// }
//
// //Negamax
//
// function getBestMoveNegamax(){
//     let bestScore = -Infinity;
//     let bestMove;
//
//     board.forEach((cell, index) => {
//         if(cell === ''){
//             board[index] = 'X';
//             let score = -negamax(board, 0, false);
//             board[index] = '';
//             if(score >bestScore){
//                 bestScore = score;
//                 bestMove= index;
//             }
//         }
//
//     })
//
//     return bestMove;
// }
//
// function negamax(board, depth, isMaximizing){
//     const score = evaluateBoard(board);
//
//     if(score !== 0 || board.every(cell => cell)) return score;
//
//     let bestScore = -Infinity;
//
//     board.forEach((cell, index) => {
//         if(cell === ''){
//             board[index] = isMaximizing ? 'X' :'O';
//
//             let score = -negamax(board, depth +1 , !isMaximizing);
//             board[index] = '';
//             bestScore = Math.max(score, bestScore)
//         }
//     })
//
//     return bestScore
// }
//
//
// //Monte Carlo Tree Search
//
// function getBestMoveMCTS() {
//
// }