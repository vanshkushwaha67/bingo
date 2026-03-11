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
        this.winOverlay = document.getElementById('winOverlay');
        this.playAgainBtn = document.getElementById('playAgainBtn');

        // Bind methods
        this.handleCellClick = this.handleCellClick.bind(this);
        this.restart = this.restart.bind(this);
        this.hideWinOverlay = this.hideWinOverlay.bind(this);

        // Event listeners
        this.restartBtn.addEventListener('click', this.restart);
        this.playAgainBtn.addEventListener('click', this.restart);
        this.winOverlay.addEventListener('click', (e) => {
            if (e.target === this.winOverlay) this.hideWinOverlay();
        });

        // Initialize game
        this.init();
    }

    // Generate a random 5x5 board with numbers 1-25 shuffled
    static generateRandomBoard() {
        const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        const board = [];
        for (let i = 0; i < 5; i++) {
            board.push(numbers.slice(i * 5, i * 5 + 5));
        }
        return board;
    }

    init() {
        this.board = Game.generateRandomBoard();
        this.marked = Array(5).fill().map(() => Array(5).fill(false));
        this.lines = 0;
        this.gameOver = false;
        this.hideWinOverlay();
        this.renderBoard();
        this.updateLineCount();
    }

    renderBoard() {
        this.boardEl.innerHTML = '';
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

    handleCellClick(e) {
        if (this.gameOver) return;
        const cell = e.currentTarget;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (this.marked[row][col]) return;

        this.marked[row][col] = true;
        cell.classList.add('marked');

        this.lines = this.countLines();
        this.updateLineCount();

        if (this.lines >= 5) {
            this.gameOver = true;
            this.showWinOverlay();
        }
    }

    countLines() {
        let lineCount = 0;

        // rows
        for (let r = 0; r < 5; r++) {
            if (this.marked[r].every(cell => cell)) lineCount++;
        }

        // columns
        for (let c = 0; c < 5; c++) {
            let full = true;
            for (let r = 0; r < 5; r++) {
                if (!this.marked[r][c]) { full = false; break; }
            }
            if (full) lineCount++;
        }

        // main diagonal
        let diag1 = true;
        for (let i = 0; i < 5; i++) {
            if (!this.marked[i][i]) { diag1 = false; break; }
        }
        if (diag1) lineCount++;

        // other diagonal
        let diag2 = true;
        for (let i = 0; i < 5; i++) {
            if (!this.marked[i][4 - i]) { diag2 = false; break; }
        }
        if (diag2) lineCount++;

        return lineCount;
    }

    updateLineCount() {
        this.linesSpan.textContent = this.lines;
    }

    showWinOverlay() {
        this.winOverlay.classList.remove('hidden');
    }

    hideWinOverlay() {
        this.winOverlay.classList.add('hidden');
    }

    restart() {
        this.init();
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});