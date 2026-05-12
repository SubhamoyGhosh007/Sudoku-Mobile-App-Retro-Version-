import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { Button } from '../components/Common';
import { Play, Settings, Book, Lightbulb, History, LayoutGrid, Heart } from 'lucide-react-native';

interface HomeScreenProps {
  onNavigate: (screen: 'HOME' | 'DIFFICULTY' | 'GAME' | 'SETTINGS' | 'RULES' | 'SOLVER' | 'HISTORY') => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
          <Heart size={60} color="#FFFFFF" fill="#FFFFFF" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>PINK{"\n"}SUDOKU</Text>
        <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
          <Text style={styles.badgeText}>RETRO EDITION v2.0</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <Button
          title="START GAME"
          onPress={() => onNavigate('DIFFICULTY')}
          style={styles.mainButton}
          textStyle={styles.mainButtonText}
          icon={<Play size={20} color="#FFF" fill="#FFF" />}
        />
        
        <View style={styles.gridMenu}>
          <MenuButton 
            title="HISTORY" 
            icon={<History size={20} color={colors.text} />} 
            onPress={() => onNavigate('HISTORY')} 
          />
          <MenuButton 
            title="GUIDE" 
            icon={<Book size={20} color={colors.text} />} 
            onPress={() => onNavigate('RULES')} 
          />
          <MenuButton 
            title="SOLVER" 
            icon={<Lightbulb size={20} color={colors.text} />} 
            onPress={() => onNavigate('SOLVER')} 
          />
          <MenuButton 
            title="SETTINGS" 
            icon={<Settings size={20} color={colors.text} />} 
            onPress={() => onNavigate('SETTINGS')} 
          />
        </View>
      </View>

      <Text style={[styles.footer, { color: colors.textSecondary }]}>MADE WITH 💖 IN RETRO SPACE</Text>
    </View>
  );
};

const MenuButton = ({ title, icon, onPress }: { title: string, icon: React.ReactNode, onPress: () => void }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.gridItem, { backgroundColor: colors.surface, borderColor: colors.border }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconBg, { backgroundColor: colors.background }]}>{icon}</View>
      <Text style={[styles.gridText, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderColor: 'rgba(0,0,0,0.1)',
    transform: [{ rotate: '-5deg' }],
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: -1,
    textAlign: 'center',
    fontFamily: 'RetroFont',
    lineHeight: 32,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 7,
    fontWeight: '400',
    fontFamily: 'RetroFont',
  },
  menu: {
    width: '100%',
  },
  mainButton: {
    height: 56,
    borderRadius: 10,
    marginBottom: 20,
    marginVertical: 0,
  },
  mainButtonText: {
    fontSize: 12,
    fontWeight: '400',
  },
  gridMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    aspectRatio: 1.1,
    borderRadius: 12,
    borderWidth: 2,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  gridText: {
    fontSize: 8,
    fontWeight: '400',
    fontFamily: 'RetroFont',
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    fontSize: 7,
    fontFamily: 'RetroFont',
    fontWeight: '400',
    opacity: 0.6,
  },
});

export default HomeScreen;
