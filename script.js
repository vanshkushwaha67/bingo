class Game {
    constructor() {
        this.player1Board = [];      // 5x5 numbers
        this.player2Board = [];
        this.player1Marked = [];      // 5x5 booleans
        this.player2Marked = [];
        this.currentPlayer = 1;        // 1 or 2
        this.gameOver = false;
        this.player1Lines = 0;
        this.player2Lines = 0;

        // DOM elements
        this.board1El = document.getElementById('player1-board');
        this.board2El = document.getElementById('player2-board');
        this.turnText = document.getElementById('turnText');
        this.player1LinesSpan = document.getElementById('player1Lines');
        this.player2LinesSpan = document.getElementById('player2Lines');
        this.restartBtn = document.getElementById('restartBtn');

        // Bind methods
        this.handleCellClick = this.handleCellClick.bind(this);
        this.restart = this.restart.bind(this);

        // Event listener for restart
        this.restartBtn.addEventListener('click', this.restart);

        // Initialize game
        this.init();
    }

    // Generate a random 5x5 board with numbers 1-25 shuffled
    static generateRandomBoard() {
        const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
        // Fisher-Yates shuffle
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        // Convert to 5x5
        const board = [];
        for (let i = 0; i < 5; i++) {
            board.push(numbers.slice(i * 5, i * 5 + 5));
        }
        return board;
    }

    // Initialize / reset game state
    init() {
        // Generate fresh boards
        this.player1Board = Game.generateRandomBoard();
        this.player2Board = Game.generateRandomBoard();

        // Reset marked arrays (all false)
        this.player1Marked = Array(5).fill().map(() => Array(5).fill(false));
        this.player2Marked = Array(5).fill().map(() => Array(5).fill(false));

        this.currentPlayer = 1;
        this.gameOver = false;
        this.player1Lines = 0;
        this.player2Lines = 0;

        // Update UI
        this.updateTurnDisplay();
        this.renderBoard(1);
        this.renderBoard(2);
        this.updateLineCounts();
        this.highlightActiveBoard();
    }

    // Render a player's board (1 or 2)
    renderBoard(player) {
        const boardEl = player === 1 ? this.board1El : this.board2El;
        const boardData = player === 1 ? this.player1Board : this.player2Board;
        const markedData = player === 1 ? this.player1Marked : this.player2Marked;

        boardEl.innerHTML = ''; // Clear

        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (markedData[r][c]) cell.classList.add('marked');
                cell.textContent = boardData[r][c];
                cell.dataset.player = player;
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener('click', this.handleCellClick);
                boardEl.appendChild(cell);
            }
        }
    }

    // Click handler for cells
    handleCellClick(e) {
        if (this.gameOver) return;

        const cell = e.currentTarget;
        const player = parseInt(cell.dataset.player);
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        // Only current player can click, and cell must not be marked
        if (player !== this.currentPlayer) return;

        const marked = player === 1 ? this.player1Marked : this.player2Marked;
        if (marked[row][col]) return; // already marked

        // Mark the cell
        marked[row][col] = true;
        cell.classList.add('marked');

        // Recalculate lines for this player
        this.updatePlayerLines(player);

        // Check win condition
        const lines = player === 1 ? this.player1Lines : this.player2Lines;
        if (lines >= 5) {
            this.gameOver = true;
            alert(`Player ${player} Wins! 🎉`);
            this.disableAllClicks();
            return;
        }

        // Switch turn
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.updateTurnDisplay();
        this.highlightActiveBoard();
    }

    // Update line count for a player (recalculates from marked)
    updatePlayerLines(player) {
        const marked = player === 1 ? this.player1Marked : this.player2Marked;
        const lines = this.countLines(marked);
        if (player === 1) {
            this.player1Lines = lines;
        } else {
            this.player2Lines = lines;
        }
        this.updateLineCounts();
    }

    // Count completed lines (rows, columns, diagonals) for a given marked board
    countLines(marked) {
        let lineCount = 0;

        // Check rows
        for (let r = 0; r < 5; r++) {
            if (marked[r].every(cell => cell)) lineCount++;
        }

        // Check columns
        for (let c = 0; c < 5; c++) {
            let full = true;
            for (let r = 0; r < 5; r++) {
                if (!marked[r][c]) {
                    full = false;
                    break;
                }
            }
            if (full) lineCount++;
        }

        // Check main diagonal (top-left to bottom-right)
        let diag1 = true;
        for (let i = 0; i < 5; i++) {
            if (!marked[i][i]) {
                diag1 = false;
                break;
            }
        }
        if (diag1) lineCount++;

        // Check other diagonal (top-right to bottom-left)
        let diag2 = true;
        for (let i = 0; i < 5; i++) {
            if (!marked[i][4 - i]) {
                diag2 = false;
                break;
            }
        }
        if (diag2) lineCount++;

        return lineCount;
    }

    // Update UI line counters
    updateLineCounts() {
        this.player1LinesSpan.textContent = this.player1Lines;
        this.player2LinesSpan.textContent = this.player2Lines;
    }

    // Update turn text
    updateTurnDisplay() {
        this.turnText.textContent = `Player ${this.currentPlayer} Turn`;
    }

    // Highlight the active board by adding a class
    highlightActiveBoard() {
        const wrapper1 = document.getElementById('player1-wrapper');
        const wrapper2 = document.getElementById('player2-wrapper');
        wrapper1.classList.remove('active-turn');
        wrapper2.classList.remove('active-turn');
        if (this.currentPlayer === 1) {
            wrapper1.classList.add('active-turn');
        } else {
            wrapper2.classList.add('active-turn');
        }
    }

    // Disable all clicks on both boards (game over)
    disableAllClicks() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.pointerEvents = 'none';
            cell.classList.add('inactive');
        });
    }

    // Restart the game
    restart() {
        // Re-enable clicks (remove any inactive class)
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.pointerEvents = '';
            cell.classList.remove('inactive');
        });

        // Reinitialize everything
        this.init();
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});