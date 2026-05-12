import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { Button } from '../components/Common';
import { ChevronLeft, Info, Target, Zap, AlertTriangle, Trophy, Star } from 'lucide-react-native';

interface RulesScreenProps {
  onBack: () => void;
}

const RulesScreen: React.FC<RulesScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const scrollY = React.useRef(new Animated.Value(0)).current;

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
        <Text style={[styles.title, { color: colors.text }]}>Game Guide</Text>
      </View>

      <View style={styles.scrollWrapper}>
        <ScrollView 
          contentContainerStyle={styles.content}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionHeading, { color: colors.textSecondary }]}>HOW TO PLAY</Text>
          
          <RuleCard 
            icon={<Info size={24} color={colors.primary} />}
            title="Standard Grid" 
            text="Sudoku is played on a 9x9 grid, divided into nine 3x3 sub-grids called 'boxes'." 
          />
          <RuleCard 
            icon={<Target size={24} color={colors.primary} />}
            title="The Objective" 
            text="Every row, column, and box must contain the digits 1-9 exactly once." 
          />
          <RuleCard 
            icon={<Zap size={24} color={colors.primary} />}
            title="Killer Sudoku" 
            text="Includes 'cages' with a small number. The digits inside each cage must sum up to that total." 
          />
          <RuleCard 
            icon={<AlertTriangle size={24} color={colors.error} />}
            title="Stay Sharp" 
            text="Entering an incorrect digit counts as a mistake. Too many mistakes and it's game over!" 
          />
          <RuleCard 
            icon={<Trophy size={24} color={colors.secondary} />}
            title="Master Scoring" 
            text="Points are awarded based on difficulty, completion time, and accuracy." 
          />

          <Text style={[styles.sectionHeading, { color: colors.textSecondary, marginTop: 32 }]}>PRO TIPS</Text>
          
          <RuleCard 
            icon={<Star size={24} color="#FBBF24" />}
            title="Hidden Singles" 
            text="Look for numbers that can only fit in one spot within a specific row or column." 
          />
          <RuleCard 
            icon={<Star size={24} color="#FBBF24" />}
            title="Cage Math" 
            text="In Killer mode, use the sums to narrow down possible digit combinations." 
          />
          
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Custom Modern Scroll Indicator */}
        <View style={[styles.indicatorContainer, { backgroundColor: colors.border }]}>
          <Animated.View 
            style={[
              styles.indicator, 
              { 
                backgroundColor: colors.primary,
                height: scrollY.interpolate({
                  inputRange: [0, 500],
                  outputRange: ['10%', '100%'],
                  extrapolate: 'clamp'
                })
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

const RuleCard = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
        {icon}
      </View>
      <View style={styles.cardTextContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backBtn: { marginRight: 12, paddingHorizontal: 0 },
  title: { fontSize: 16, fontWeight: '400', fontFamily: 'RetroFont' },
  scrollWrapper: { flex: 1, flexDirection: 'row' },
  content: { paddingRight: 16 },
  sectionHeading: { fontSize: 8, fontWeight: '400', marginBottom: 16, letterSpacing: 1, fontFamily: 'RetroFont' },
  card: { 
    flexDirection: 'row', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 2, 
    marginBottom: 12,
    alignItems: 'center',
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  iconContainer: { 
    width: 40, 
    height: 40, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardTextContent: { flex: 1 },
  cardTitle: { fontSize: 10, fontWeight: '400', marginBottom: 6, fontFamily: 'RetroFont' },
  cardText: { fontSize: 7, fontFamily: 'RetroFont', lineHeight: 12 },
  indicatorContainer: { 
    width: 4, 
    height: '60%', 
    borderRadius: 2, 
    alignSelf: 'center', 
    marginLeft: 8,
    overflow: 'hidden'
  },
  indicator: { width: '100%', borderRadius: 2 },
});

export default RulesScreen;
