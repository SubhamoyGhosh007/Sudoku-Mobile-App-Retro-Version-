import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme, ThemeMode } from '../utils/ThemeContext';
import { Button } from '../components/Common';
import { Moon, Sun, Monitor, ChevronLeft } from 'lucide-react-native';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { 
    colors, mode, setMode, emojiProgress, setEmojiProgress,
    highlightDuplicates, setHighlightDuplicates,
    highlightAreas, setHighlightAreas,
    highlightIdenticalNumbers, setHighlightIdenticalNumbers,
    animateFinishedAreas, setAnimateFinishedAreas,
    animateFinishedLevels, setAnimateFinishedLevels
  } = useTheme();

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
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>THEME</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemeOption 
              label="Light" 
              active={mode === 'light'} 
              onPress={() => setMode('light')} 
              icon={<Sun size={20} color={mode === 'light' ? colors.primary : colors.textSecondary} />}
            />
            <ThemeOption 
              label="Dark" 
              active={mode === 'dark'} 
              onPress={() => setMode('dark')} 
              icon={<Moon size={20} color={mode === 'dark' ? colors.primary : colors.textSecondary} />}
            />
            <ThemeOption 
              label="System" 
              active={mode === 'system'} 
              onPress={() => setMode('system')} 
              icon={<Monitor size={20} color={mode === 'system' ? colors.primary : colors.textSecondary} />}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>HIGHLIGHTING</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SettingItem 
              label="Duplicates" 
              desc="Mark incorrect numbers in red"
              value={highlightDuplicates} 
              onToggle={setHighlightDuplicates} 
            />
            <SettingItem 
              label="Areas" 
              desc="Highlight row, column and box"
              value={highlightAreas} 
              onToggle={setHighlightAreas} 
            />
            <SettingItem 
              label="Identical Numbers" 
              desc="Highlight same numbers on board"
              value={highlightIdenticalNumbers} 
              onToggle={setHighlightIdenticalNumbers} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ANIMATIONS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SettingItem 
              label="Finished Areas" 
              desc="Animate completed 3x3 boxes"
              value={animateFinishedAreas} 
              onToggle={setAnimateFinishedAreas} 
            />
            <SettingItem 
              label="Finished Levels" 
              desc="Animate completed rows and columns"
              value={animateFinishedLevels} 
              onToggle={setAnimateFinishedLevels} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CUSTOMIZATION</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SettingItem 
              label="Emoji Progress" 
              desc="Show fun emojis based on your progress"
              value={emojiProgress} 
              onToggle={setEmojiProgress} 
            />
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const SettingItem = ({ label, desc, value, onToggle }: { label: string, desc: string, value: boolean, onToggle: (val: boolean) => void }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.settingItem}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{desc}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
};

const ThemeOption = ({ label, active, onPress, icon }: { label: string, active: boolean, onPress: () => void, icon: React.ReactNode }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.themeOption, active && { backgroundColor: colors.background }]} 
      onPress={onPress}
    >
      <View style={styles.themeOptionLeft}>
        {icon}
        <Text style={[styles.themeLabel, { color: active ? colors.primary : colors.text }]}>{label}</Text>
      </View>
      {active && <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backBtn: { marginRight: 16, paddingHorizontal: 0 },
  title: { fontSize: 16, fontWeight: '400', fontFamily: 'RetroFont' },
  scrollContent: {
    paddingBottom: 20,
  },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 8, fontWeight: '400', marginBottom: 12, letterSpacing: 1, fontFamily: 'RetroFont' },
  card: { borderRadius: 12, borderWidth: 3, overflow: 'hidden', borderBottomWidth: 8, borderRightWidth: 8, borderColor: 'rgba(0,0,0,0.1)' },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  themeOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  themeLabel: { fontSize: 10, fontWeight: '400', fontFamily: 'RetroFont' },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLabel: { fontSize: 10, fontWeight: '400', marginBottom: 6, fontFamily: 'RetroFont' },
  settingDesc: { fontSize: 7, fontFamily: 'RetroFont', lineHeight: 12 },
});

export default SettingsScreen;
