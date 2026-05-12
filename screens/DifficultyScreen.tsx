import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { Button, ModalContainer } from '../components/Common';
import { DifficultyLevel, DIFFICULTIES } from '../utils/SudokuEngine';
import { ChevronLeft, Play, AlertCircle } from 'lucide-react-native';

interface DifficultyScreenProps {
  onSelect: (level: DifficultyLevel) => void;
  onBack: () => void;
}

const DifficultyScreen: React.FC<DifficultyScreenProps> = ({ onSelect, onBack }) => {
  const { colors } = useTheme();
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Button 
          title="" 
          onPress={onBack} 
          variant="ghost" 
          style={styles.backButton}
          icon={<ChevronLeft size={28} color={colors.text} />}
        />
        <Text style={[styles.title, { color: colors.text }]}>MISSION SELECT</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {(Object.keys(DIFFICULTIES) as DifficultyLevel[]).map((level) => (
          <DifficultyItem 
            key={level}
            level={level} 
            description={`${DIFFICULTIES[level].holes} empty cells. Max ${DIFFICULTIES[level].maxMistakes} mistakes.`} 
            onPress={() => setSelectedLevel(level)} 
          />
        ))}
      </ScrollView>

      <Modal transparent visible={selectedLevel !== null} animationType="fade">
        <ModalContainer>
          <View style={[styles.confirmIcon, { backgroundColor: colors.primary + '20' }]}>
            <Play size={48} color={colors.primary} />
          </View>
          <Text style={[styles.modalTitle, { color: colors.text }]}>START MISSION?</Text>
          <Text style={[styles.modalText, { color: colors.textSecondary }]}>
            Mode: {selectedLevel}{"\n"}
            Difficulty: {selectedLevel && DIFFICULTIES[selectedLevel].maxMistakes} Mistake Limit
          </Text>
          <View style={styles.modalActions}>
            <Button
              title="GO!"
              onPress={() => {
                if (selectedLevel) onSelect(selectedLevel);
                setSelectedLevel(null);
              }}
              style={styles.confirmBtn}
            />
            <Button
              title="ABORT"
              onPress={() => setSelectedLevel(null)}
              variant="ghost"
            />
          </View>
        </ModalContainer>
      </Modal>
    </View>
  );
};

const DifficultyItem = ({ level, description, onPress }: { level: string, description: string, onPress: () => void }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.levelTitle, { color: colors.text }]}>{level}</Text>
        <Text style={[styles.levelDesc, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <Button title="CHOOSE" onPress={onPress} style={styles.playButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  backButton: { marginRight: 16, paddingHorizontal: 0 },
  title: { fontSize: 16, fontWeight: '400', fontFamily: 'RetroFont' },
  content: { gap: 16 },
  card: { padding: 20, borderRadius: 12, borderWidth: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 6, borderRightWidth: 6, borderColor: 'rgba(0,0,0,0.1)' },
  levelTitle: { fontSize: 12, fontWeight: '400', fontFamily: 'RetroFont', marginBottom: 8 },
  levelDesc: { fontSize: 8, fontFamily: 'RetroFont', maxWidth: 180, lineHeight: 12 },
  playButton: { paddingVertical: 8, paddingHorizontal: 12 },
  confirmIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 16, fontWeight: '400', fontFamily: 'RetroFont', marginBottom: 12 },
  modalText: { fontSize: 10, fontFamily: 'RetroFont', textAlign: 'center', marginBottom: 24, lineHeight: 18 },
  modalActions: { width: '100%', gap: 12 },
  confirmBtn: { width: '100%' },
});

export default DifficultyScreen;
