import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { Button } from '../components/Common';
import { getHistory, GameRecord } from '../utils/Storage';
import { Trophy, Clock, XCircle, ChevronLeft, AlertCircle, Ban } from 'lucide-react-native';

interface HistoryScreenProps {
  onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const [history, setHistory] = useState<GameRecord[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'WON': return { color: colors.success, label: 'VICTORY' };
      case 'LOST': return { color: colors.error, label: 'DEFEAT' };
      case 'ABANDONED': return { color: colors.textSecondary, label: 'QUIT' };
      default: return { color: colors.text, label: 'DONE' };
    }
  };

  const renderItem = ({ item }: { item: GameRecord }) => {
    const status = getStatusStyle(item.status);
    return (
      <View style={[styles.recordCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.recordHeader}>
          <View>
            <Text style={[styles.difficulty, { color: colors.primary }]}>{item.difficulty}</Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
        <View style={styles.recordStats}>
          <View style={styles.statLine}>
            <Trophy size={14} color={colors.secondary} />
            <Text style={[styles.score, { color: colors.text }]}>{item.score}</Text>
          </View>
          <View style={styles.statLine}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{formatTime(item.time)}</Text>
          </View>
          <View style={styles.statLine}>
            <XCircle size={14} color={colors.error} />
            <Text style={[styles.statValue, { color: colors.text }]}>{item.mistakes}</Text>
          </View>
        </View>
      </View>
    );
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
        <Text style={[styles.title, { color: colors.text }]}>MISSION LOG</Text>
      </View>

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>NO MISSIONS LOGGED YET.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backBtn: { marginRight: 16, paddingHorizontal: 0 },
  title: { fontSize: 16, fontWeight: '400', fontFamily: 'RetroFont' },
  list: { paddingBottom: 40 },
  recordCard: { 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 2, 
    marginBottom: 12,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'flex-start' },
  difficulty: { fontWeight: '400', letterSpacing: 1, fontFamily: 'RetroFont', fontSize: 10 },
  date: { fontSize: 7, fontFamily: 'RetroFont', marginTop: 4 },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 6,
    fontWeight: '400',
    fontFamily: 'RetroFont',
  },
  recordStats: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.03)', padding: 10, borderRadius: 8 },
  statLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  score: { fontSize: 10, fontWeight: '400', fontFamily: 'RetroFont' },
  statValue: { fontSize: 8, fontWeight: '400', fontFamily: 'RetroFont' },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontFamily: 'RetroFont', fontWeight: '400', fontSize: 10 },
});

export default HistoryScreen;
