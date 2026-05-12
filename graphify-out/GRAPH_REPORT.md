# Graph Report - Sudoko  (2026-05-12)

## Corpus Check
- 24 files · ~225,408 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 141 nodes · 249 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `137e5ebe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 36 edges
2. `Button()` - 12 edges
3. `Project Specification: Expo Sudoku Mobile App` - 8 edges
4. `ModalContainer()` - 6 edges
5. `Sudoku Retro Mobile 🎮` - 6 edges
6. `solve()` - 5 edges
7. `Board` - 4 edges
8. `DifficultyLevel` - 4 edges
9. `saveGameToHistory()` - 4 edges
10. `getHistory()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `AppContent()` --calls--> `useTheme()`  [EXTRACTED]
  App.tsx → utils/ThemeContext.tsx
- `NumberPad()` --calls--> `useTheme()`  [EXTRACTED]
  components/NumberPad.tsx → utils/ThemeContext.tsx
- `Cell()` --calls--> `useTheme()`  [EXTRACTED]
  components/Cell.tsx → utils/ThemeContext.tsx
- `Board()` --calls--> `useTheme()`  [EXTRACTED]
  components/Board.tsx → utils/ThemeContext.tsx
- `HistoryScreen()` --calls--> `useTheme()`  [EXTRACTED]
  screens/HistoryScreen.tsx → utils/ThemeContext.tsx

## Communities (10 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (25): Button(), ButtonProps, ModalContainer(), styles, Controls(), ControlsProps, styles, HomeScreen() (+17 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (25): Board(), BoardProps, CELL_SIZE, styles, { width }, Board, Cage, calculateScore() (+17 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (18): GameScreen(), GameScreenProps, styles, HistoryScreen(), HistoryScreenProps, styles, AppContent(), Screen (+10 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (13): NumberPad(), NumberPadProps, styles, SolverScreen(), SolverScreenProps, styles, darkColors, lightColors (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (12): code:bash (git clone <repository-url>), code:bash (npm install), code:bash (npm start), ✨ Features, 🚀 Getting Started, Installation, 📝 License, Prerequisites (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (8): 1. Overview, 2. Core Game Logic (Rules for the AI), 3. Technical Requirements, 4. UI/UX Requirements, 5. Component Structure, 6. Implementation Instructions for Gemini, graphify, Project Specification: Expo Sudoku Mobile App

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (6): DifficultyItem(), DifficultyScreen(), DifficultyScreenProps, styles, DIFFICULTIES, DifficultyLevel

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (5): Cell(), CELL_SIZE, CellProps, styles, { width }

## Knowledge Gaps
- **66 isolated node(s):** `Timeout`, `Screen`, `styles`, `NumberPadProps`, `styles` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTheme()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.185) - this node is a cross-community bridge._
- **Why does `Board` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 0` to `Community 2`, `Community 3`, `Community 6`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `Timeout`, `Screen`, `styles` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._