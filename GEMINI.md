# Project Specification: Expo Sudoku Mobile App

## 1. Overview
Develop a fully functional Sudoku mobile application using **Expo (React Native)**. The app should allow users to play Sudoku puzzles of varying difficulty, provide a clean user interface, and handle all game logic (generation, validation, and completion).

## 2. Core Game Logic (Rules for the AI)
The app must strictly adhere to standard Sudoku rules:
- **Grid:** A 9x9 matrix divided into nine 3x3 sub-grids.
- **Goal:** Fill the grid so that every row, every column, and every 3x3 sub-grid contains the digits 1 through 9 without repetition.
- **Validation:** Every time a user inputs a number, the app must check:
    1. Row uniqueness.
    2. Column uniqueness.
    3. 3x3 sub-grid (box) uniqueness.

## 3. Technical Requirements
- **Framework:** Expo (React Native).
- **Language:** JavaScript or TypeScript.
- **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`).
- **Styling:** `StyleSheet` with Flexbox for a responsive 9x9 grid.
- **Algorithms:**
    - **Generator:** Use a Backtracking algorithm to generate a full, valid board, then remove numbers based on difficulty to create the puzzle.
    - **Solver:** A helper function to check if the current board is solvable and to provide 'Hints' if requested.

## 4. UI/UX Requirements
- **Board Layout:** A 9x9 grid where cells are square and responsive to screen width.
- **Visual Cues:**
    - Highlight the selected cell.
    - Highlight the corresponding row, column, and 3x3 box of the selected cell.
    - Use a different color for "Initial Numbers" (fixed) vs. "User Input" (editable).
    - Red text for conflicting/invalid numbers.
- **Input Method:** A custom Number Pad (1-9) at the bottom of the screen (avoiding the native mobile keyboard).
- **Controls:**
    - "New Game" (Easy, Medium, Hard).
    - "Reset" (Clear user inputs).
    - "Undo" (Revert last move).

## 5. Component Structure
- `App.js`: Entry point and main game state.
- `Board.js`: Renders the 9x9 grid.
- `Cell.js`: Individual square component with press handlers.
- `NumberPad.js`: Input buttons 1-9 and 'Erase'.
- `SudokuEngine.js`: Utility file for the backtracking and validation logic.

## 6. Implementation Instructions for Gemini
1. Create a 2D array representation of the 9x9 board.
2. Implement the `isValid(board, row, col, num)` utility.
3. Write a recursive backtracking function to generate a complete board.
4. Create a function to "poke holes" in the board based on difficulty (e.g., 40 holes for Easy, 60 for Hard).
5. Build the UI using `View` and `Pressable` components.
6. Ensure the board scales correctly on both iOS and Android.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
