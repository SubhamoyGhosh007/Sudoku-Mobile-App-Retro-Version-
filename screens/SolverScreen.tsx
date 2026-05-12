import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { Button } from '../components/Common';
import Board from '../components/Board';
import NumberPad from '../components/NumberPad';
import * as Engine from '../utils/SudokuEngine';
import { ChevronLeft } from 'lucide-react-native';

interface SolverScreenProps {
  onBack: () => void;
}

const SolverScreen: React.FC<SolverScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const [board, setBoard] = useState<Engine.Board>(Array.from({ length: 9 }, () => Array(9).fill(null)));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const handleCellPress = (row: number, col: number) => {
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    
    // Check if valid before placing
    if (!Engine.isValid(board, r, c, num)) {
      Alert.alert('Invalid Move', 'This number cannot be placed here according to Sudoku rules.');
      return;
    }

    const newBoard = Engine.copyBoard(board);
    newBoard[r][c] = num;
    setBoard(newBoard);
  };

  const handleErase = () => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    const newBoard = Engine.copyBoard(board);
    newBoard[r][c] = null;
    setBoard(newBoard);
  };

  const handleSolve = () => {
    const boardToSolve = Engine.copyBoard(board);
    if (Engine.solve(boardToSolve)) {
      setBoard(boardToSolve);
    } else {
      Alert.alert('Unsolvable', 'This puzzle cannot be solved. Please check your inputs.');
    }
  };

  const handleClear = () => {
    setBoard(Array.from({ length: 9 }, () => Array(9).fill(null)));
    setSelectedCell(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Button 
          title="" 
          onPress={onBack} 
          variant="ghost" 
          style={styles.backBtn} 
          icon={<ChevronLeft size={28} color={colors.text} />}
        />
        <Text style={[styles.title, { color: colors.text }]}>Sudoku Solver</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.infoText, { color: colors.textSecondary, textAlign: 'center' }]}>
          Input your puzzle and press Solve.
        </Text>
      </View>

      <Board
        board={board}
        initialBoard={Array.from({ length: 9 }, () => Array(9).fill(null))}
        selectedCell={selectedCell}
        solution={board} // Not used for validation here
        cages={[]}
        onCellPress={handleCellPress}
        settings={{
          highlightDuplicates: true,
          highlightAreas: true,
          highlightIdenticalNumbers: true
        }}
      />

      <View style={styles.actions}>
        <Button title="Solve Puzzle" onPress={handleSolve} style={styles.solveBtn} />
        <Button title="Clear All" onPress={handleClear} variant="ghost" style={styles.clearBtn} />
      </View>

      <NumberPad
        onNumberPress={handleNumberInput}
        onErasePress={handleErase}
        onHintPress={() => Alert.alert('Hint', 'Input numbers first!')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  backBtn: { marginRight: 16, paddingHorizontal: 0 },
  title: { fontSize: 16, fontWeight: '400', fontFamily: 'RetroFont' },
  info: { marginBottom: 10 },
  infoText: { fontSize: 8, fontFamily: 'RetroFont', lineHeight: 14 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  solveBtn: { flex: 2 },
  clearBtn: { flex: 1 },
});

export default SolverScreen;
