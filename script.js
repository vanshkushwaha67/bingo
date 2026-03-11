class Game {
    constructor() {
        this.board = [];           // 5x5 numbers
        this.marked = [];          // 5x5 booleans
        this.lines = 0;
        this.gameOver = false;

        // DOM elements
        this.boardEl = document.getElementById('player-board');
        this.linesSpan = document.getElementById('playerLines');
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
        this.board = Game.generateRandomBoard();
        this.marked = Array(5).fill().map(() => Array(5).fill(false));
        this.lines = 0;
        this.gameOver = false;

        this.renderBoard();
        this.updateLineCount();
    }

    // Render the board (always show marks because it's single player)
    renderBoard() {
        this.boardEl.innerHTML = ''; // Clear

        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (this.marked[r][c]) cell.classList.add('marked');
                cell.textContent = this.board[r][c];
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener('click', this.handleCellClick);
                this.boardEl.appendChild(cell);
            }
        }
    }

    // Click handler for cells
    handleCellClick(e) {
        if (this.gameOver) return;

        const cell = e.currentTarget;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (this.marked[row][col]) return; // already marked

        // Mark the cell
        this.marked[row][col] = true;
        cell.classList.add('marked');

        // Recalculate lines
        this.lines = this.countLines();
        this.updateLineCount();

        // Check win condition
        if (this.lines >= 5) {
            this.gameOver = true;
            alert('You Win! 🎉');
        }
    }

    // Count completed lines (rows, columns, diagonals) from current marked
    countLines() {
        let lineCount = 0;

        // Check rows
        for (let r = 0; r < 5; r++) {
            if (this.marked[r].every(cell => cell)) lineCount++;
        }

        // Check columns
        for (let c = 0; c < 5; c++) {
            let full = true;
            for (let r = 0; r < 5; r++) {
                if (!this.marked[r][c]) {
                    full = false;
                    break;
                }
            }
            if (full) lineCount++;
        }

        // Check main diagonal (top-left to bottom-right)
        let diag1 = true;
        for (let i = 0; i < 5; i++) {
            if (!this.marked[i][i]) {
                diag1 = false;
                break;
            }
        }
        if (diag1) lineCount++;

        // Check other diagonal (top-right to bottom-left)
        let diag2 = true;
        for (let i = 0; i < 5; i++) {
            if (!this.marked[i][4 - i]) {
                diag2 = false;
                break;
            }
        }
        if (diag2) lineCount++;

        return lineCount;
    }

    // Update UI line counter
    updateLineCount() {
        this.linesSpan.textContent = this.lines;
    }

    // Restart the game
    restart() {
        this.init();
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});