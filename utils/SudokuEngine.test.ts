import { isValid, solve, generateFullBoard, isBoardComplete, Board, calculateScore, generateCages, pokeHoles } from './SudokuEngine';

describe('SudokuEngine', () => {
  const emptyBoard: Board = Array.from({ length: 9 }, () => Array(9).fill(null));

  test('isValid identifies valid and invalid moves', () => {
    expect(isValid(emptyBoard, 0, 0, 5)).toBe(true);
    
    const boardWithRowConflict = emptyBoard.map(r => [...r]);
    boardWithRowConflict[0][5] = 5;
    expect(isValid(boardWithRowConflict, 0, 0, 5)).toBe(false);

    const boardWithColConflict = emptyBoard.map(r => [...r]);
    boardWithColConflict[5][0] = 5;
    expect(isValid(boardWithColConflict, 0, 0, 5)).toBe(false);

    const boardWithBoxConflict = emptyBoard.map(r => [...r]);
    boardWithBoxConflict[1][1] = 5;
    expect(isValid(boardWithBoxConflict, 0, 0, 5)).toBe(false);
  });

  test('generateFullBoard creates a valid board', () => {
    const board = generateFullBoard();
    expect(board.length).toBe(9);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        expect(board[r][c]).not.toBeNull();
        const val = board[r][c] as number;
        board[r][c] = null;
        expect(isValid(board, r, c, val)).toBe(true);
        board[r][c] = val;
      }
    }
  });

  test('solve solves a board', () => {
    const board: Board = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ];
    expect(solve(board)).toBe(true);
    board.forEach(row => row.forEach(cell => expect(cell).not.toBeNull()));
  });

  test('pokeHoles removes the correct number of cells', () => {
    const fullBoard = generateFullBoard();
    const holes = 40;
    const boardWithHoles = pokeHoles(fullBoard, holes);
    let nullCount = 0;
    boardWithHoles.forEach(row => {
      row.forEach(cell => {
        if (cell === null) nullCount++;
      });
    });
    expect(nullCount).toBe(holes);
  });

  test('calculateScore returns expected values', () => {
    // EASY baseScore is 1000. Time penalty 2/sec, mistake penalty 200/mistake.
    // 60 seconds, 1 mistake -> 1000 - 120 - 200 = 680
    expect(calculateScore('EASY', 60, 1)).toBe(680);
    // Score should not be negative
    expect(calculateScore('EASY', 1000, 10)).toBe(0);
  });

  test('generateCages creates valid cages', () => {
    const board = generateFullBoard();
    const cages = generateCages(board);
    
    expect(cages.length).toBeGreaterThan(0);
    
    const coveredCells = new Set<string>();
    cages.forEach(cage => {
      let sum = 0;
      cage.cells.forEach(([r, c]) => {
        sum += (board[r][c] as number);
        coveredCells.add(`${r},${c}`);
      });
      expect(cage.sum).toBe(sum);
    });
    
    // Every cell should be in exactly one cage
    expect(coveredCells.size).toBe(81);
  });
});
