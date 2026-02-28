class SudokuGame {
  constructor() {
    this.solution = [];
    this.board = [];
    this.fixed = [];
    this.selected = null;
    this.hintsLeft = 3;
    this.moves = 0;
    this.initSolved();
    this.initUI();
    this.newGame();
  }
  initSolved() {
    this.solved = [
      1,2,3,4,5,6,7,8,9,
      4,5,6,7,8,9,1,2,3,
      7,8,9,1,2,3,4,5,6,
      2,3,4,5,6,7,8,9,1,
      5,6,7,8,9,1,2,3,4,
      8,9,1,2,3,4,5,6,7,
      3,4,5,6,7,8,9,1,2,
      6,7,8,9,1,2,3,4,5,
      9,1,2,3,4,5,6,7,8
    ];
    this.solution = this.solved.slice();
  }
  initUI() {
    const grid = document.getElementById('sudoku-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < 81; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      cell.addEventListener('click', () => this.selectCell(i));
      grid.appendChild(cell);
    }
    const diffBtn = document.getElementById('diff-btn');
    if (diffBtn) diffBtn.addEventListener('click', () => this.newGame());
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) hintBtn.addEventListener('click', () => this.useHint());
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetGame());
    const checkBtn = document.getElementById('check-btn');
    if (checkBtn) checkBtn.addEventListener('click', () => this.checkAnswers());
    const difficulty = document.getElementById('difficulty');
    if (difficulty) difficulty.addEventListener('change', (e) => { this.newGame(); });
    document.addEventListener('keydown', (e) => this.handleInput(e));
  }
  newGame() {
    // Start with a simple puzzle: reveal first 40 cells from the solved grid
    this.board = Array(81).fill(null);
    this.fixed = Array(81).fill(false);
    const reveal = 40;
    for (let i = 0; i < reveal; i++) {
      this.board[i] = this.solution[i];
      this.fixed[i] = true;
    }
    this.selected = null;
    this.moves = 0;
    this.hintsLeft = 3;
    this.render();
  }
  render() {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < 81; i++) {
      const c = cells[i];
      c.textContent = this.board[i] === null ? '' : String(this.board[i]);
      if (this.fixed[i]) c.classList.add('fixed'); else c.classList.remove('fixed');
      c.onclick = () => this.selectCell(i);
    }
  }
  selectCell(index) {
    this.selected = index;
    document.querySelectorAll('.cell.selected').forEach(el => el.classList.remove('selected'));
    const cells = document.querySelectorAll('.cell');
    cells[index].classList.add('selected');
  }
  handleInput(e) {
    if (this.selected == null) return;
    const idx = this.selected;
    if (e.key >= '1' && e.key <= '9') {
      this.board[idx] = parseInt(e.key, 10);
      this.moves++;
      this.render();
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      this.board[idx] = null;
      this.moves++;
      this.render();
    }
  }
  useHint() {
    if (this.hintsLeft <= 0) return;
    const empties = [];
    for (let i = 0; i < 81; i++) if (this.board[i] === null) empties.push(i);
    if (!empties.length) return;
    const idx = empties[Math.floor(Math.random() * empties.length)];
    this.board[idx] = this.solution[idx];
    this.fixed[idx] = true;
    this.hintsLeft--;
    this.render();
  }
  resetGame() {
    if (confirm('Reset game?')) this.newGame();
  }
  checkAnswers() {
    let errors = 0;
    for (let i = 0; i < 81; i++) {
      if (this.board[i] !== null && this.board[i] !== this.solution[i]) errors++;
    }
    const status = document.getElementById('game-status');
    if (errors === 0) {
      if (status) status.textContent = '🎉 恭喜！所有答案都正确！';
    } else {
      if (status) status.textContent = `❌ 有 ${errors} 个错误，请重试！`;
    }
  }
  init() { }
  timerDisplay() { return '00:00'; }
  timer() {}
  updateScore() {
    this.render();
    const hintsP = document.getElementById('hints-left');
    if (hintsP) hintsP.textContent = this.hintsLeft;
    const stats = document.getElementById('game-stats');
    if (stats) {
      const filled = this.board.filter(v => v !== null).length;
      stats.innerHTML = `<p>已完成：${filled} / 81</p><p>步骤：${this.moves}</p>`;
    }
  }
  handleInput(e) { /* placeholder if needed */ }
}

document.addEventListener('DOMContentLoaded', () => {
  new SudokuGame();
});
