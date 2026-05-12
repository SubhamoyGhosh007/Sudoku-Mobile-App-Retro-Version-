import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveGameToHistory, getHistory, GameRecord } from './Storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe('Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save a record to history', async () => {
    const record: GameRecord = {
      id: '1',
      date: '2023-01-01',
      difficulty: 'EASY',
      score: 100,
      time: 60,
      mistakes: 0,
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
    await saveGameToHistory(record);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@sudoku_history',
      JSON.stringify([record])
    );
  });

  it('should return empty array if no history exists', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const history = await getHistory();
    expect(history).toEqual([]);
  });
});
