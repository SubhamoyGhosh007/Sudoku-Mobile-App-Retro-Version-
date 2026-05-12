import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, Modal, Text, BackHandler } from 'react-native';
import { ThemeProvider, useTheme } from './utils/ThemeContext';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import ModeSelectionScreen from './screens/ModeSelectionScreen';
import DifficultyScreen from './screens/DifficultyScreen';
import SettingsScreen from './screens/SettingsScreen';
import RulesScreen from './screens/RulesScreen';
import SolverScreen from './screens/SolverScreen';
import HistoryScreen from './screens/HistoryScreen';
import { DifficultyLevel } from './utils/SudokuEngine';
import { getSavedGame, saveCurrentGame, SavedGame } from './utils/Storage';
import { Button, ModalContainer } from './components/Common';
import { Play } from 'lucide-react-native';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

type Screen = 'HOME' | 'MODE_SELECTION' | 'DIFFICULTY' | 'GAME' | 'SETTINGS' | 'RULES' | 'SOLVER' | 'HISTORY';

function AppContent() {
  const { colors, isDark } = useTheme();
  const [fontsLoaded] = useFonts({
    'RetroFont': PressStart2P_400Regular,
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [gameMode, setGameMode] = useState<'CLASSIC' | 'KILLER'>('CLASSIC');
  const [resumeData, setResumeData] = useState<SavedGame | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const checkSavedGame = async () => {
    const saved = await getSavedGame();
    if (saved && currentScreen === 'HOME') {
      setResumeData(saved);
      setShowResumeModal(true);
    }
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
    if (screen !== 'HOME') {
      setShowResumeModal(false);
    }
  };

  useEffect(() => {
    checkSavedGame();

    const backAction = () => {
      if (currentScreen === 'HOME') {
        return false; // Exit app
      }
      
      // Define back navigation logic
      switch (currentScreen) {
        case 'MODE_SELECTION':
          setCurrentScreen('HOME');
          break;
        case 'DIFFICULTY':
          setCurrentScreen('MODE_SELECTION');
          break;
        case 'GAME':
          // GameScreen has its own internal BackHandler for the "Quit" modal
          // Returning false here lets GameScreen's listener handle it
          return false; 
        case 'SETTINGS':
        case 'RULES':
        case 'SOLVER':
        case 'HISTORY':
          setCurrentScreen('HOME');
          break;
      }
      return true; // Prevent default (exiting)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [currentScreen]);

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  const handleResume = () => {
    if (resumeData) {
      setDifficulty(resumeData.difficulty);
      setGameMode(resumeData.mode);
      setCurrentScreen('GAME');
      setShowResumeModal(false);
    }
  };

  const handleDiscardSaved = async () => {
    await saveCurrentGame(null);
    setResumeData(null);
    setShowResumeModal(false);
  };

  const startModeSelection = () => {
    setCurrentScreen('MODE_SELECTION');
  };

  const selectMode = (mode: 'CLASSIC' | 'KILLER') => {
    setGameMode(mode);
    setCurrentScreen('DIFFICULTY');
  };

  const startGame = (level: DifficultyLevel) => {
    setResumeData(null); // Ensure we start fresh
    setDifficulty(level);
    setCurrentScreen('GAME');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen onNavigate={(s) => s === 'DIFFICULTY' ? startModeSelection() : navigateTo(s)} />;
      case 'MODE_SELECTION':
        return <ModeSelectionScreen onSelect={selectMode} onBack={() => navigateTo('HOME')} />;
      case 'DIFFICULTY':
        return <DifficultyScreen onSelect={startGame} onBack={() => navigateTo('MODE_SELECTION')} />;
      case 'GAME':
        return difficulty ? (
          <GameScreen 
            difficulty={difficulty} 
            mode={gameMode}
            onBack={() => navigateTo('HOME')} 
            onFinish={() => navigateTo('HISTORY')}
            initialSavedGame={resumeData}
          />
        ) : null;
      case 'SETTINGS':
        return <SettingsScreen onBack={() => navigateTo('HOME')} />;
      case 'RULES':
        return <RulesScreen onBack={() => navigateTo('HOME')} />;
      case 'SOLVER':
        return <SolverScreen onBack={() => navigateTo('HOME')} />;
      case 'HISTORY':
        return <HistoryScreen onBack={() => navigateTo('HOME')} />;
      default:
        return <HomeScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.notchSpacer} />
      {renderScreen()}

      <Modal transparent visible={showResumeModal} animationType="fade">
        <ModalContainer>
          <View style={[styles.resumeIcon, { backgroundColor: colors.primary + '20' }]}>
            <Play size={48} color={colors.primary} />
          </View>
          <Text style={[styles.modalTitle, { color: colors.text }]}>RESUME GAME?</Text>
          <Text style={[styles.modalText, { color: colors.textSecondary }]}>
            You have an unfinished {resumeData?.mode} puzzle ({resumeData?.difficulty}). Would you like to continue?
          </Text>
          <View style={styles.modalActions}>
            <Button
              title="CONTINUE"
              onPress={handleResume}
              style={styles.confirmBtn}
            />
            <Button
              title="START NEW"
              onPress={handleDiscardSaved}
              variant="outline"
            />
          </View>
        </ModalContainer>
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notchSpacer: {
    height: 20,
  },
  resumeIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 16, fontWeight: '400', fontFamily: 'RetroFont', marginBottom: 16, textAlign: 'center', lineHeight: 24 },
  modalText: { fontSize: 10, fontFamily: 'RetroFont', textAlign: 'center', marginBottom: 24, lineHeight: 18 },
  modalActions: { width: '100%', gap: 12 },
  confirmBtn: { width: '100%' },
});
