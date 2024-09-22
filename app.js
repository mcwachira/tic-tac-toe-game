// const board = document.querySelector("#board");
const infoDisplay = document.querySelector("#info");
const resetButton = document.querySelector("#restartGame");
const aiSelect = document.querySelector("#ai-algorithm");

let currentPlayer = "X"; // Initial player
let gameActive = true;
let winnerDisplay = document.getElementById('winnerDisplay');
let aiThinking = document.getElementById('aiThinking');
let board = Array(9).fill('');


// Define winning combinations
const winningCombo = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Initialize the board
// function createBoard() {
//     // gameBoard.innerHTML = '';
//     // board = Array(9).fill('');
//     currentPlayer = 'O';
//     // infoDisplay.textContent = "Player O's turn";
//
//     board.forEach((_, index) => {
//         const cellElement = document.createElement("div");
//         cellElement.classList.add("square");
//         cellElement.addEventListener("click", () => handlePlayerMove(index));
//         board.append(cellElement);
//     });
// }

// Player's move
function handlePlayerMove(index) {
    if (!gameActive || board[index] !== '') return ;
        board[index] = currentPlayer;
        document.getElementById(`cell-${index}`).innerText = currentPlayer;
        // updateBoard();
        if (checkWinner()) return
            //Losing player starts the next game
            currentPlayer = (currentPlayer === 'X') ? "O" : "X";



        if(currentPlayer === 'O' && gameActive
        ){
    aiMove();
        }

}

// AI's move
function aiMove() {
    const aiAlgorithm = aiSelect.value;
    let bestMove;
    aiThinking.style.display = 'block'
    setTimeout(() => {

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

    // board[bestMove] = currentPlayer;
        board[bestMove] = "0";
    document.getElementById(`cell-${bestMove}`).innerText = "O"
        aiThinking.style.display = 'none';
    // updateBoard();
    if (checkWinner()) return ;
        currentPlayer = 'X';


    },1000)
}


function highlightAiCell(index){
    document.getElementById(`cell-${index}`).classList.add('highlight');
        setTimeout(() =>{
            document.getElementById(`cell-${index}`).classList.remove('highlight');
        }, 500)
}
// Update the board display
// function updateBoard() {
//     gameBoard.childNodes.forEach((cell, index) => {
//         cell.textContent = board[index];
//     });
// }

// Check if there's a winner or draw
function checkWinner() {
    // let winner = null;

    winningCombo.forEach(combo => {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
           declareWinner(currentPlayer)
            return true;
        }
    });

 if (board.every(cell => cell)) {
       declareWinner("Tie")
        return true;
    }

    return false;
}
function declareWinner(winner){

    if(winner === 'Tie'){
        winnerDisplay.innerHTML = "It's a tie!"
    }else {
        winnerDisplay.innerHTML= `${winner} wins!`
    }

    gameActive = false;
}


function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    winnerDisplay.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        document.getElementById(`cell-${i}`).innerText = "";
    }
}

window.onload = function() {
    const boardDiv = document.getElementById('board');
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = `cell-${i}`;
        cell.addEventListener('click', () => handlePlayerMove(i));
        boardDiv.appendChild(cell);
    }
};

// Reset the game
resetButton.addEventListener("click", restartGame);

// Initialize game on page load
// createBoard();



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

function getBestMoveAlphaBeta() {
    let bestScore = -Infinity;
    let bestMove;

    board.forEach((cell, index) => {
        if (cell === '') {
            board[index] = 'X';
            let score = minimaxAlphaBeta(board, 0, false, -Infinity, Infinity);
            board[index] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }
    });
    return bestMove;
}
function minimaxAlphaBeta(board, depth, isMaximizing, alpha , beta) {
    const score = evaluateBoard(board)

    if(score !== 0 || board.every(cell => cell)) return score;

if(isMaximizing){
    let bestScore = -Infinity;
    board.forEach((cell, index) => {
        if(cell === ''){
            board[index] ='X';
            let score = minimaxAlphaBeta(board , depth + 1, false, alpha , beta);

            board[index] = '';
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, bestScore);
            if(beta <= alpha) return bestScore;
        }
    })

    return bestScore;
}else {
    let bestScore = Infinity;
    board.forEach((cell, index) => {
        if(cell === ''){
            board[index] ='O';
            let score = minimaxAlphaBeta(board , depth + 1, true, alpha , beta);

            board[index] = '';
            bestScore = Math.min(score, bestScore);
            beta = Math.min(beta, bestScore);
            if(beta <=alpha) return bestScore;
        }
    })
    return bestScore;
}
}

//Negamax

function getBestMoveNegamax(){
    let bestScore = -Infinity;
    let bestMove;

    board.forEach((cell, index) => {
        if(cell === ''){
            board[index] = 'X';
            let score = -negamax(board, 0, false);
            board[index] = '';
            if(score >bestScore){
                bestScore = score;
                bestMove= index;
            }
        }

    })

    return bestMove;
}

function negamax(board, depth, isMaximizing){
    const score = evaluateBoard(board);

    if(score !== 0 || board.every(cell => cell)) return score;

    let bestScore = -Infinity;

    board.forEach((cell, index) => {
        if(cell === ''){
            board[index] = isMaximizing ? 'X' :'O';

            let score = -negamax(board, depth +1 , !isMaximizing);
            board[index] = '';
            bestScore = Math.max(score, bestScore)
        }
    })

    return bestScore
}


//Monte Carlo Tree Search

class Node {
    constructor(board, player, move = null, parent = null) {
        this.board = [...board]; // Copy of the board state
        this.player = player; // Current player at this node (1 for 'X', -1 for 'O')
        this.move = move; // Move that led to this state
        this.parent = parent;
        this.children = [];
        this.visits = 0; // Total number of visits to this node
        this.wins = 0; // Number of wins for this node
    }

    isFullyExpanded() {
        return this.children.length === this.availableMoves().length;
    }

    availableMoves() {
        return this.board.map((cell, index) => cell === '' ? index : null).filter(move => move !== null);
    }

    isTerminal() {
        return checkWinner(this.board) || this.board.every(cell => cell);
    }

    addChild(move, player) {
        const newBoard = [...this.board];
        newBoard[move] = player === 1 ? 'X' : 'O';
        const childNode = new Node(newBoard, -player, move, this);
        this.children.push(childNode);
        return childNode;
    }

    bestChild() {
        let bestChild = null;
        let bestUCB = -Infinity;
        this.children.forEach(child => {
            const ucb = (child.wins / child.visits) + Math.sqrt(2 * Math.log(this.visits) / child.visits);
            if (ucb > bestUCB) {
                bestUCB = ucb;
                bestChild = child;
            }
        });
        return bestChild;
    }

    mostVisitedChild() {
        return this.children.reduce((maxChild, child) => child.visits > maxChild.visits ? child : maxChild, this.children[0]);
    }
}

function getBestMoveMCTS() {
    const iterations = 100000// Number of MCTS simulations
    const rootNode = new Node(board, currentPlayer === 'X' ? 1 : -1);

    for (let i = 0; i < iterations; i++) {
        let node = rootNode;

        // Selection: Traverse down using UCB until we find a non-terminal node
        while (!node.isTerminal() && node.isFullyExpanded()) {
            node = node.bestChild();
        }

        // Expansion: Expand the node by adding a new child if it's not fully expanded
        if (!node.isTerminal() && !node.isFullyExpanded()) {
            const availableMoves = node.availableMoves();
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            node = node.addChild(randomMove, node.player);
        }

        // Simulation: Simulate a random game from this node
        let simulationNode = node;
        let simulationPlayer = simulationNode.player;
        while (!simulationNode.isTerminal()) {
            const availableMoves = simulationNode.availableMoves();
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            const newBoard = [...simulationNode.board];
            newBoard[randomMove] = simulationPlayer === 1 ? 'X' : 'O';
            simulationNode = new Node(newBoard, -simulationPlayer, randomMove);
            simulationPlayer = -simulationPlayer;
        }

        // Backpropagation: Propagate the result back up the tree
        let winner = checkWinner(simulationNode.board);
        let result = winner === 'X' ? 1 : (winner === 'O' ? -1 : 0);
        while (node) {
            node.visits++;
            if (node.player === 1) {
                node.wins += result === 1 ? 1 : (result === -1 ? 0 : 0.5);
            } else {
                node.wins += result === -1 ? 1 : (result === 1 ? 0 : 0.5);
            }
            node = node.parent;
        }
    }

    // Choose the child with the highest visit count (most promising)
    return rootNode.mostVisitedChild().move;
}


// Define the heuristic function
function evaluateBoard(board, player) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    let score = 0;

    // Scoring based on center control
    if (board[4] === player) score += 50;

    // Scoring based on corner control
    [0, 2, 6, 8].forEach(pos => {
        if (board[pos] === player) score += 30;
    });

    // Evaluate each line for potential wins or blocks
    lines.forEach(line => {
        const [a, b, c] = line;

        // Count how many marks the player and the opponent have in the line
        const playerCount = [board[a], board[b], board[c]].filter(mark => mark === player).length;
        const opponentCount = [board[a], board[b], board[c]].filter(mark => mark && mark !== player).length;

        // Heuristic scoring based on line evaluations
        if (playerCount === 3) {
            // Winning line
            score += 1000;
        } else if (playerCount === 2 && opponentCount === 0) {
            // Two in a row with a free space
            score += 100;
        } else if (opponentCount === 2 && playerCount === 0) {
            // Block opponent's win
            score += 500;
        }
    });

    return score;
}

// Get the best move based on heuristic evaluation
function getBestMoveHeuristics() {
    let bestMove = null;
    let bestScore = -Infinity;

    board.forEach((cell, index) => {
        if (cell === "") { // Check if the cell is empty
            board[index] = currentPlayer; // Make the move
            let score = evaluateBoard(board, currentPlayer); // Evaluate the board

            // If this move is better, update the best move
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }

            board[index] = ""; // Undo the move
        }
    });

    return bestMove;
}
