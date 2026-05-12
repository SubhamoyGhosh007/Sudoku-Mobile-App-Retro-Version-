export type Board = (number | null)[][];

export const DIFFICULTIES = {
  EASY: { holes: 30, baseScore: 1000, maxMistakes: 5 },
  MEDIUM: { holes: 40, baseScore: 2000, maxMistakes: 3 },
  HARD: { holes: 50, baseScore: 3500, maxMistakes: 3 },
  EXPERT: { holes: 60, baseScore: 5000, maxMistakes: 2 },
  MASTER: { holes: 64, baseScore: 7500, maxMistakes: 2 },
  EXTREME: { holes: 68, baseScore: 10000, maxMistakes: 1 },
};

export type DifficultyLevel = keyof typeof DIFFICULTIES;

export interface Cage {
  id: string;
  cells: [number, number][];
  sum: number;
}

/**
 * Generates cages for Killer Sudoku.
 */
export const generateCages = (board: Board): Cage[] => {
  const cages: Cage[] = [];
  const visited = Array.from({ length: 9 }, () => Array(9).fill(false));
  let cageId = 0;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!visited[r][c]) {
        const cageCells: [number, number][] = [];
        const targetSize = Math.floor(Math.random() * 4) + 2; // Size 2 to 5
        
        const growCage = (currR: number, currC: number) => {
          if (cageCells.length >= targetSize) return;
          if (currR < 0 || currR >= 9 || currC < 0 || currC >= 9) return;
          if (visited[currR][currC]) return;

          visited[currR][currC] = true;
          cageCells.push([currR, currC]);

          // Neighbors
          const dirs = shuffle([[0, 1], [0, -1], [1, 0], [-1, 0]]);
          for (const [dr, dc] of dirs) {
            growCage(currR + dr, currC + dc);
          }
        };

        growCage(r, c);
        
        const sum = cageCells.reduce((acc, [row, col]) => acc + (board[row][col] || 0), 0);
        cages.push({
          id: `cage-${cageId++}`,
          cells: cageCells,
          sum
        });
      }
    }
  }

  return cages;
};

/**
 * Calculates score based on difficulty, time, and mistakes.
 */
export const calculateScore = (difficulty: DifficultyLevel, timeSeconds: number, mistakes: number): number => {
  const { baseScore } = DIFFICULTIES[difficulty];
  const timePenalty = timeSeconds * 2;
  const mistakePenalty = mistakes * 200;
  
  const finalScore = baseScore - timePenalty - mistakePenalty;
  return Math.max(0, Math.floor(finalScore));
};

/**
 * Checks if placing a number in a given cell is valid according to Sudoku rules.
 */
export const isValid = (board: Board, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

/**
 * Solves the Sudoku board using backtracking.
 * Also used to generate a full valid board.
 */
export const solve = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

/**
 * Shuffles an array (Fisher-Yates).
 */
const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Generates a full valid Sudoku board.
 */
export const generateFullBoard = (): Board => {
  const board: Board = Array.from({ length: 9 }, () => Array(9).fill(null));
  solve(board);
  return board;
};

/**
 * Pokes holes in a full board based on difficulty.
 */
export const pokeHoles = (fullBoard: Board, holes: number): Board => {
  const board: Board = fullBoard.map((row) => [...row]);
  let removed = 0;
  const maxHoles = 81;
  const actualHoles = Math.min(holes, maxHoles);
  
  while (removed < actualHoles) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (board[row][col] !== null) {
      board[row][col] = null;
      removed++;
    }
  }
  return board;
};

/**
 * Deep copy a board.
 */
export const copyBoard = (board: Board): Board => {
  return board.map((row) => [...row]);
};

/**
 * Checks if the board is complete and correct.
 */
export const isBoardComplete = (board: Board, solution: Board): boolean => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
};
