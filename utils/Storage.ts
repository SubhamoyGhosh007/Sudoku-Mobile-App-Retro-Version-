import AsyncStorage from '@react-native-async-storage/async-storage';
import { Board, DifficultyLevel, Cage } from './SudokuEngine';

const HISTORY_KEY = '@sudoku_history';
const SETTINGS_KEY = '@sudoku_settings';
const SAVED_GAME_KEY = '@sudoku_saved_game';

export type GameStatus = 'WON' | 'LOST' | 'ABANDONED';

export interface GameRecord {
  id: string;
  date: string;
  difficulty: DifficultyLevel;
  score: number;
  time: number;
  mistakes: number;
  status: GameStatus;
}

export interface SavedGame {
  board: Board;
  initialBoard: Board;
  solution: Board;
  difficulty: DifficultyLevel;
  mode: 'CLASSIC' | 'KILLER';
  time: number;
  mistakes: number;
  cages: Cage[];
  history: Board[];
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  emojiProgress: boolean;
  animateFinishedAreas: boolean;
  animateFinishedLevels: boolean;
  highlightDuplicates: boolean;
  highlightAreas: boolean;
  highlightIdenticalNumbers: boolean;
}

export const saveGameToHistory = async (record: GameRecord) => {
  try {
    const existingHistory = await getHistory();
    const newHistory = [record, ...existingHistory];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error('Failed to save history', e);
  }
};

export const getHistory = async (): Promise<GameRecord[]> => {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveCurrentGame = async (game: SavedGame | null) => {
  try {
    if (game === null) {
      await AsyncStorage.removeItem(SAVED_GAME_KEY);
    } else {
      await AsyncStorage.setItem(SAVED_GAME_KEY, JSON.stringify(game));
    }
  } catch (e) {
    console.error('Failed to save current game', e);
  }
};

export const getSavedGame = async (): Promise<SavedGame | null> => {
  try {
    const data = await AsyncStorage.getItem(SAVED_GAME_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const saveSettings = async (settings: Settings) => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const getSettings = async (): Promise<Settings | null> => {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};
