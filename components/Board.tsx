import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Cell from './Cell';
import { Board as BoardType, Cage } from '../utils/SudokuEngine';
import { useTheme } from '../utils/ThemeContext';

const { width } = Dimensions.get('window');
const BOARD_PADDING = 32;
const CELL_SIZE = Math.floor((width - BOARD_PADDING) / 9);
const BOARD_SIZE = CELL_SIZE * 9;

interface BoardProps {
  board: BoardType;
  initialBoard: BoardType;
  selectedCell: [number, number] | null;
  solution: BoardType;
  cages: Cage[];
  onCellPress: (row: number, col: number) => void;
  isPaused?: boolean;
  settings: {
    highlightDuplicates: boolean;
    highlightAreas: boolean;
    highlightIdenticalNumbers: boolean;
  };
}

const Board: React.FC<BoardProps> = ({ 
  board, initialBoard, selectedCell, solution, 
  cages, onCellPress, isPaused, settings 
}) => {
  const { colors } = useTheme();

  const isHighlighted = (r: number, c: number) => {
    if (!selectedCell || !settings.highlightAreas) return false;
    const [sr, sc] = selectedCell;
    if (r === sr || c === sc) return true;
    const boxR = Math.floor(sr / 3) * 3;
    const boxC = Math.floor(sc / 3) * 3;
    if (r >= boxR && r < boxR + 3 && c >= boxC && c < boxC + 3) return true;
    return false;
  };

  const isIdentical = (r: number, c: number) => {
    if (!selectedCell || !settings.highlightIdenticalNumbers) return false;
    const [sr, sc] = selectedCell;
    const val = board[sr][sc];
    return val !== null && board[r][c] === val;
  };

  const isDuplicate = (r: number, c: number) => {
    if (!settings.highlightDuplicates || board[r][c] === null) return false;
    const val = board[r][c];

    // Check row
    for (let x = 0; x < 9; x++) if (x !== c && board[r][x] === val) return true;
    // Check col
    for (let x = 0; x < 9; x++) if (x !== r && board[x][c] === val) return true;
    // Check box
    const boxR = Math.floor(r / 3) * 3;
    const boxC = Math.floor(c / 3) * 3;
    for (let i = boxR; i < boxR + 3; i++) {
      for (let j = boxC; j < boxC + 3; j++) {
        if ((i !== r || j !== c) && board[i][j] === val) return true;
      }
    }
    return false;
  };

  const getCageInfo = (r: number, c: number) => {
    const cage = cages.find(cg => cg.cells.some(([cr, cc]) => cr === r && cc === c));
    if (!cage) return null;

    // Show sum only in the top-leftmost cell of the cage
    const sortedCells = [...cage.cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const isFirstCell = sortedCells[0][0] === r && sortedCells[0][1] === c;

    // Borders calculation
    const hasNeighbor = (dr: number, dc: number) => 
      cage.cells.some(([cr, cc]) => cr === r + dr && cc === c + dc);

    return {
      sum: isFirstCell ? cage.sum : null,
      borders: {
        top: !hasNeighbor(-1, 0),
        bottom: !hasNeighbor(1, 0),
        left: !hasNeighbor(0, -1),
        right: !hasNeighbor(0, 1),
      }
    };
  };

  return (
    <View style={styles.container}>
      <View style={[styles.board, { backgroundColor: colors.surface }]}>
        {board.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((value, c) => {
              const cageInfo = getCageInfo(r, c);
              return (
                <Cell
                  key={c}
                  value={value}
                  isInitial={initialBoard[r][c] !== null}
                  isSelected={selectedCell?.[0] === r && selectedCell?.[1] === c}
                  isHighlighted={isHighlighted(r, c)}
                  isIdentical={isIdentical(r, c)}
                  isDuplicate={isDuplicate(r, c)}
                  onPress={() => onCellPress(r, c)}
                  isPaused={isPaused}
                  cageSum={cageInfo?.sum}
                  cageBorders={cageInfo?.borders}
                />
              );
            })}
          </View>
        ))}
        
        {/* Visual separators for 3x3 grid */}
        <View style={[styles.verticalLine, { left: '33.33%', backgroundColor: colors.text }]} pointerEvents="none" />
        <View style={[styles.verticalLine, { left: '66.66%', backgroundColor: colors.text }]} pointerEvents="none" />
        <View style={[styles.horizontalLine, { top: '33.33%', backgroundColor: colors.text }]} pointerEvents="none" />
        <View style={[styles.horizontalLine, { top: '66.66%', backgroundColor: colors.text }]} pointerEvents="none" />
        
        {/* Outer Borders to ensure they match cell borders perfectly */}
        <View style={[styles.outerBorder, { top: 0, left: 0, right: 0, height: 2, backgroundColor: colors.text }]} pointerEvents="none" />
        <View style={[styles.outerBorder, { bottom: 0, left: 0, right: 0, height: 2, backgroundColor: colors.text }]} pointerEvents="none" />
        <View style={[styles.outerBorder, { top: 0, bottom: 0, left: 0, width: 2, backgroundColor: colors.text }]} pointerEvents="none" />
        <View style={[styles.outerBorder, { top: 0, bottom: 0, right: 0, width: 2, backgroundColor: colors.text }]} pointerEvents="none" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  board: {
    position: 'relative',
    flexDirection: 'column',
    width: BOARD_SIZE,
    height: BOARD_SIZE,
  },
  row: {
    flexDirection: 'row',
  },
  verticalLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    zIndex: 1,
  },
  horizontalLine: {
    position: 'absolute',
    height: 2,
    width: '100%',
    zIndex: 1,
  },
  outerBorder: {
    position: 'absolute',
    zIndex: 2,
  },
});

export default Board;
