import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, Modal, Animated, BackHandler, AppState } from 'react-native';
import Board from '../components/Board';
import NumberPad from '../components/NumberPad';
import Controls from '../components/Controls';
import * as Engine from '../utils/SudokuEngine';
import { useTheme } from '../utils/ThemeContext';
import { Button, ModalContainer } from '../components/Common';
import { saveGameToHistory, saveCurrentGame, getSavedGame } from '../utils/Storage';
import { Timer, XCircle, Play, Pause, ChevronLeft, Trophy, Star, History as HistoryIcon, RotateCcw, Skull, Save, LogOut } from 'lucide-react-native';

interface GameScreenProps {
  difficulty: Engine.DifficultyLevel;
  mode: 'CLASSIC' | 'KILLER';
  onBack: () => void;
  onFinish: () => void;
  initialSavedGame?: any; // To pass resumed game data
}

const GameScreen: React.FC<GameScreenProps> = ({ difficulty, mode, onBack, onFinish, initialSavedGame }) => {
  const { 
    colors, emojiProgress, 
    highlightDuplicates, highlightAreas, highlightIdenticalNumbers,
    animateFinishedLevels, animateFinishedAreas,
  } = useTheme();
  
  const [board, setBoard] = useState<Engine.Board>([]);
  const [initialBoard, setInitialBoard] = useState<Engine.Board>([]);
  const [solution, setSolution] = useState<Engine.Board>([]);
  const [cages, setCages] = useState<Engine.Cage[]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [history, setHistory] = useState<Engine.Board[]>([]);
  
  const [mistakes, setMistakes] = useState(0);
  const [snarkyMessage, setSnarkyMessage] = useState('');
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVictoryModalVisible, setIsVictoryModalVisible] = useState(false);
  const [isGameOverModalVisible, setIsGameOverModalVisible] = useState(false);
  const [isQuitModalVisible, setIsQuitModalVisible] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const victoryScale = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const mistakeScale = useRef(new Animated.Value(1)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const maxMistakes = Engine.DIFFICULTIES[difficulty].maxMistakes;

  // Refs for auto-saving logic
  const stateRef = useRef({ board, initialBoard, solution, difficulty, mode, time, mistakes, cages, history });
  
  useEffect(() => {
    stateRef.current = { board, initialBoard, solution, difficulty, mode, time, mistakes, cages, history };
  }, [board, initialBoard, solution, difficulty, mode, time, mistakes, cages, history]);

  const handleAutoSave = useCallback(async () => {
    const s = stateRef.current;
    if (s.board.length > 0 && !isVictoryModalVisible && !isGameOverModalVisible) {
      await saveCurrentGame({
        board: s.board,
        initialBoard: s.initialBoard,
        solution: s.solution,
        difficulty: s.difficulty,
        mode: s.mode,
        time: s.time,
        mistakes: s.mistakes,
        cages: s.cages,
        history: s.history
      });
    }
  }, [isVictoryModalVisible, isGameOverModalVisible]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState.match(/inactive|background/)) {
        handleAutoSave();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [handleAutoSave]);

  const SNARKY_MESSAGES = [
    "Seriously? Try again.",
    "My cat plays better than this.",
    "Are you even trying?",
    "That's... creative. But wrong.",
    "Math is hard, isn't it?",
    "A bold move. Completely wrong, but bold.",
    "Maybe stick to Tic-Tac-Toe?",
    "Oops! Your brain glitched.",
    "I'm not mad, just disappointed.",
    "Even the AI is facepalming right now."
  ];

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const showSnarkyMessage = () => {
    const msg = SNARKY_MESSAGES[Math.floor(Math.random() * SNARKY_MESSAGES.length)];
    setSnarkyMessage(msg);
    Animated.sequence([
      Animated.timing(messageOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(messageOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  const getProgressEmoji = () => {
    const total = 81;
    const filled = board.flat().filter(c => c !== null).length;
    const progress = filled / total;
    if (progress < 0.2) return '👾';
    if (progress < 0.4) return '🍄';
    if (progress < 0.6) return '🌈';
    if (progress < 0.8) return '💖';
    return '🦄';
  };

  const startNewGame = useCallback(() => {
    if (initialSavedGame) {
      setBoard(initialSavedGame.board);
      setInitialBoard(initialSavedGame.initialBoard);
      setSolution(initialSavedGame.solution);
      setCages(initialSavedGame.cages || []);
      setHistory(initialSavedGame.history || []);
      setMistakes(initialSavedGame.mistakes || 0);
      setTime(initialSavedGame.time || 0);
      // Clear saved game after resume
      saveCurrentGame(null);
    } else {
      const fullBoard = Engine.generateFullBoard();
      setSolution(fullBoard);

      if (mode === 'KILLER') {
        const generatedCages = Engine.generateCages(fullBoard);
        setCages(generatedCages);
        const puzzle = Engine.pokeHoles(fullBoard, Engine.DIFFICULTIES[difficulty].holes);
        setInitialBoard(Engine.copyBoard(puzzle));
        setBoard(Engine.copyBoard(puzzle));
      } else {
        setCages([]);
        const puzzle = Engine.pokeHoles(fullBoard, Engine.DIFFICULTIES[difficulty].holes);
        setInitialBoard(Engine.copyBoard(puzzle));
        setBoard(Engine.copyBoard(puzzle));
      }

      setHistory([]);
      setMistakes(0);
      setTime(0);
    }

    setSelectedCell(null);
    setIsPaused(false);
    setIsVictoryModalVisible(false);
    setIsGameOverModalVisible(false);
    setIsQuitModalVisible(false);
    victoryScale.setValue(0);
  }, [difficulty, mode, initialSavedGame]);

  const restartGame = () => {
    setBoard(Engine.copyBoard(initialBoard));
    setHistory([]);
    setMistakes(0);
    setTime(0);
    setIsPaused(false);
    setIsGameOverModalVisible(false);
    saveCurrentGame(null);
  };

  useEffect(() => {
    startNewGame();
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isVictoryModalVisible || isGameOverModalVisible) {
        onBack();
        return true;
      }
      setIsQuitModalVisible(true);
      setIsPaused(true);
      return true;
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      backHandler.remove();
    };
  }, [startNewGame]);

  useEffect(() => {
    if (!isPaused && !isVictoryModalVisible && !isGameOverModalVisible && !isQuitModalVisible) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isVictoryModalVisible, isGameOverModalVisible, isQuitModalVisible]);

  const handleCellPress = (row: number, col: number) => {
    if (isPaused || isVictoryModalVisible || isGameOverModalVisible || isQuitModalVisible) return;
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isPaused || isVictoryModalVisible || isGameOverModalVisible || isQuitModalVisible) return;
    const [r, c] = selectedCell;

    if (initialBoard[r][c] !== null) return;
    if (board[r][c] === num) return;

    // Check mistake
    if (solution[r][c] !== num) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      triggerShake();
      showSnarkyMessage();
      
      Animated.sequence([
        Animated.timing(mistakeScale, { toValue: 1.5, duration: 100, useNativeDriver: true }),
        Animated.spring(mistakeScale, { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();

      if (newMistakes >= maxMistakes) {
        handleGameOver();
      }
      return;
    }

    setHistory((prev) => [...prev, Engine.copyBoard(board)]);
    const newBoard = Engine.copyBoard(board);
    newBoard[r][c] = num;
    setBoard(newBoard);

    checkCompletions(newBoard, r, c);

    if (Engine.isBoardComplete(newBoard, solution)) {
      handleWin();
    }
  };

  const checkCompletions = (currBoard: Engine.Board, r: number, c: number) => {
    const isRowComplete = currBoard[r].every(v => v !== null);
    const isColComplete = currBoard.every(row => row[c] !== null);
    const boxR = Math.floor(r / 3) * 3;
    const boxC = Math.floor(c / 3) * 3;
    let isBoxComplete = true;
    for (let i = boxR; i < boxR + 3; i++) {
      for (let j = boxC; j < boxC + 3; j++) {
        if (currBoard[i][j] === null) isBoxComplete = false;
      }
    }

    if ((isRowComplete || isColComplete) && animateFinishedLevels) {
    }
    if (isBoxComplete && animateFinishedAreas) {
    }
  };

  const handleWin = async () => {
    const score = Engine.calculateScore(difficulty, time, mistakes);
    setFinalScore(score);
    setIsVictoryModalVisible(true);
    setIsPaused(true);

    Animated.spring(victoryScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    await saveGameToHistory({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      difficulty,
      score: score,
      time,
      mistakes,
      status: 'WON',
    });
    await saveCurrentGame(null);
  };

  const handleGameOver = async () => {
    setIsGameOverModalVisible(true);
    setIsPaused(true);
    await saveGameToHistory({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      difficulty,
      score: 0,
      time,
      mistakes,
      status: 'LOST',
    });
    await saveCurrentGame(null);
  };

  const handleAbandon = async () => {
    await saveGameToHistory({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      difficulty,
      score: 0,
      time,
      mistakes,
      status: 'ABANDONED',
    });
    await saveCurrentGame(null);
    onBack();
  };

  const handleSaveAndQuit = async () => {
    await saveCurrentGame({
      board,
      initialBoard,
      solution,
      difficulty,
      mode,
      time,
      mistakes,
      cages,
      history
    });
    onBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleErase = () => {
    if (!selectedCell || isPaused) return;
    const [r, c] = selectedCell;
    if (initialBoard[r][c] !== null) return;

    setHistory((prev) => [...prev, Engine.copyBoard(board)]);
    const newBoard = Engine.copyBoard(board);
    newBoard[r][c] = null;
    setBoard(newBoard);
  };

  const handleUndo = () => {
    if (history.length === 0 || isPaused) return;
    const previousBoard = history[history.length - 1];
    setBoard(previousBoard);
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleHint = () => {
    if (!selectedCell || isPaused) return;
    const [r, c] = selectedCell;
    if (board[r][c] !== null) return;

    const hintValue = solution[r][c];
    handleNumberInput(hintValue!);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Button 
          title="" 
          onPress={() => setIsQuitModalVisible(true)} 
          variant="ghost" 
          style={styles.backBtn} 
          icon={<ChevronLeft size={28} color={colors.text} />}
        />
        <View style={styles.stats}>
          {emojiProgress && (
            <View style={styles.statItem}>
              <Text style={{ fontSize: 24 }}>{getProgressEmoji()}</Text>
            </View>
          )}
          <View style={styles.statItem}>
            <Timer size={18} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.text }]}>{formatTime(time)}</Text>
          </View>
          <Animated.View style={[styles.statItem, { transform: [{ scale: mistakeScale }] }]}>
            <XCircle size={18} color={colors.error} />
            <Text style={[styles.statText, { color: colors.text }]}>{mistakes}/{maxMistakes}</Text>
          </Animated.View>
        </View>
        <Button 
          title="" 
          onPress={() => setIsPaused(!isPaused)} 
          variant="ghost" 
          style={styles.pauseBtn}
          icon={isPaused ? <Play size={24} color={colors.primary} /> : <Pause size={24} color={colors.primary} />}
        />
      </View>

      <Animated.View style={{ 
        transform: [{ translateX: shakeAnim }],
        opacity: isPaused ? 0.3 : 1
      }}>
        <Board
          board={board}
          initialBoard={initialBoard}
          selectedCell={selectedCell}
          solution={solution}
          cages={cages}
          onCellPress={handleCellPress}
          isPaused={isPaused}
          settings={{
            highlightDuplicates,
            highlightAreas,
            highlightIdenticalNumbers
          }}
        />
      </Animated.View>

      <Animated.View style={[styles.snarkyContainer, { opacity: messageOpacity }]}>
        <Text style={[styles.snarkyText, { color: colors.error }]}>{snarkyMessage}</Text>
      </Animated.View>

      <Controls
        onReset={() => restartGame()}
        onUndo={handleUndo}
      />

      <NumberPad
        onNumberPress={handleNumberInput}
        onErasePress={handleErase}
        onHintPress={handleHint}
      />

      {/* Victory Modal */}
      <Modal transparent visible={isVictoryModalVisible} animationType="none">
        <ModalContainer>
          <Animated.View style={{ transform: [{ scale: victoryScale }], alignItems: 'center' }}>
            <View style={[styles.trophyContainer, { backgroundColor: colors.primary + '20' }]}>
              <Trophy size={64} color={colors.primary} />
            </View>
            <Text style={[styles.victoryTitle, { color: colors.text }]}>Level Up!</Text>
            <Text style={[styles.victorySubtitle, { color: colors.textSecondary }]}>{mode} • {difficulty}</Text>

            <View style={styles.scoreRow}>
              <View style={styles.scoreItem}><Star size={20} color="#FBBF24" /><Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Score</Text><Text style={[styles.scoreValue, { color: colors.text }]}>{finalScore}</Text></View>
              <View style={styles.scoreItem}><Timer size={20} color={colors.primary} /><Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Time</Text><Text style={[styles.scoreValue, { color: colors.text }]}>{formatTime(time)}</Text></View>
              <View style={styles.scoreItem}><XCircle size={20} color={colors.error} /><Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Mistakes</Text><Text style={[styles.scoreValue, { color: colors.text }]}>{mistakes}</Text></View>
            </View>

            <View style={styles.victoryActions}>
              <Button title="New Game" onPress={startNewGame} style={styles.victoryBtn} icon={<RotateCcw size={20} color="#FFF" />} />
              <Button title="History" onPress={onFinish} variant="outline" style={styles.victoryBtn} icon={<HistoryIcon size={20} color={colors.primary} />} />
              <Button title="Home" onPress={onBack} variant="ghost" />
            </View>
          </Animated.View>
        </ModalContainer>
      </Modal>

      {/* Game Over Modal */}
      <Modal transparent visible={isGameOverModalVisible} animationType="fade">
        <ModalContainer>
          <View style={[styles.gameOverIcon, { backgroundColor: colors.error + '20' }]}>
            <Skull size={64} color={colors.error} />
          </View>
          <Text style={[styles.victoryTitle, { color: colors.error }]}>Game Over</Text>
          <Text style={[styles.modalText, { color: colors.textSecondary }]}>Too many mistakes! You reached the limit of {maxMistakes} mistakes for {difficulty} mode.</Text>
          <View style={styles.victoryActions}>
            <Button title="Try Again" onPress={restartGame} style={styles.victoryBtn} icon={<RotateCcw size={20} color="#FFF" />} />
            <Button title="New Puzzle" onPress={startNewGame} variant="outline" style={styles.victoryBtn} />
            <Button title="Quit" onPress={onBack} variant="ghost" />
          </View>
        </ModalContainer>
      </Modal>

      {/* Quit Confirmation Modal */}
      <Modal transparent visible={isQuitModalVisible} animationType="fade">
        <ModalContainer>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Quit Mission?</Text>
          <Text style={[styles.modalText, { color: colors.textSecondary }]}>You have progress on this board. What would you like to do?</Text>
          <View style={styles.victoryActions}>
            <Button title="Save and Continue Later" onPress={handleSaveAndQuit} style={styles.victoryBtn} icon={<Save size={20} color="#FFF" />} />
            <Button title="Resume Now" onPress={() => { setIsQuitModalVisible(false); setIsPaused(false); }} variant="outline" style={styles.victoryBtn} />
            <Button title="Abandon Mission (Mark Lost)" onPress={handleAbandon} variant="ghost" style={styles.victoryBtn} icon={<LogOut size={20} color={colors.error} />} />
          </View>
        </ModalContainer>
      </Modal>

      {/* Pause Modal */}
      <Modal transparent visible={isPaused && !isVictoryModalVisible && !isGameOverModalVisible && !isQuitModalVisible} animationType="fade">
        <ModalContainer>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Paused</Text>
          <View style={styles.victoryActions}>
            <Button title="Resume" onPress={() => setIsPaused(false)} style={styles.victoryBtn} />
            <Button title="Restart" onPress={restartGame} variant="outline" style={styles.victoryBtn} />
            <Button title="Quit" onPress={() => setIsQuitModalVisible(true)} variant="ghost" />
          </View>
        </ModalContainer>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  backBtn: { paddingHorizontal: 0 },
  pauseBtn: { paddingHorizontal: 0 },
  stats: { flexDirection: 'row', gap: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 10, fontWeight: '400', fontFamily: 'RetroFont' },
  modalTitle: { fontSize: 16, fontWeight: '400', fontFamily: 'RetroFont', marginBottom: 24, textAlign: 'center', lineHeight: 24 },
  modalText: { fontSize: 9, fontFamily: 'RetroFont', textAlign: 'center', marginBottom: 24, lineHeight: 16 },
  trophyContainer: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  gameOverIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  victoryTitle: { fontSize: 18, fontWeight: '400', fontFamily: 'RetroFont', marginBottom: 8, textAlign: 'center' },
  victorySubtitle: { fontSize: 8, fontWeight: '400', fontFamily: 'RetroFont', marginBottom: 24, textTransform: 'uppercase' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 32, backgroundColor: 'rgba(0,0,0,0.05)', paddingVertical: 16, borderRadius: 12 },
  scoreItem: { alignItems: 'center', gap: 6 },
  scoreLabel: { fontSize: 7, fontWeight: '400', fontFamily: 'RetroFont' },
  scoreValue: { fontSize: 12, fontWeight: '400', fontFamily: 'RetroFont' },
  victoryActions: { width: '100%', gap: 12 },
  victoryBtn: { marginVertical: 0, width: '100%' },
  snarkyContainer: {
    position: 'absolute',
    top: '55%',
    width: '100%',
    alignItems: 'center',
    zIndex: 100,
  },
  snarkyText: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'RetroFont',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    color: '#FF4D94',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FF4D94',
  },
});

export default GameScreen;
