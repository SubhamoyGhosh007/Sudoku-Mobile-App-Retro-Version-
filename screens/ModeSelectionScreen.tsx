import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { Button } from '../components/Common';
import { LayoutGrid, Target, ChevronLeft } from 'lucide-react-native';

interface ModeSelectionScreenProps {
  onSelect: (mode: 'CLASSIC' | 'KILLER') => void;
  onBack: () => void;
}

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onSelect, onBack }) => {
  const { colors } = useTheme();

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
        <Text style={[styles.title, { color: colors.text }]}>SELECT MODE</Text>
      </View>

      <View style={styles.content}>
        <ModeCard
          title="Classic"
          description="Traditional Sudoku rules. Fill the grid with numbers 1-9."
          icon={<LayoutGrid size={40} color={colors.primary} />}
          onPress={() => onSelect('CLASSIC')}
        />
        <ModeCard
          title="Killer"
          description="Classic rules plus 'cages' that must sum to a specific total."
          icon={<Target size={40} color={colors.secondary} />}
          onPress={() => onSelect('KILLER')}
        />
      </View>
    </View>
  );
};

const ModeCard = ({ title, description, icon, onPress }: { title: string, description: string, icon: React.ReactNode, onPress: () => void }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title.toUpperCase()}</Text>
        <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <Button title="CHOOSE" onPress={onPress} style={styles.selectBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  backBtn: { marginRight: 16, paddingHorizontal: 0 },
  title: { fontSize: 16, fontWeight: '400', fontFamily: 'RetroFont' },
  content: { gap: 24 },
  card: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 3,
    alignItems: 'center',
    borderBottomWidth: 10,
    borderRightWidth: 10,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  iconContainer: { marginBottom: 16 },
  textContainer: { alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: '400', fontFamily: 'RetroFont', marginBottom: 12 },
  cardDesc: { fontSize: 8, textAlign: 'center', paddingHorizontal: 12, fontFamily: 'RetroFont', lineHeight: 14 },
  selectBtn: { width: '100%' },
});

export default ModeSelectionScreen;
