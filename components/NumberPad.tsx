import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { Eraser, Lightbulb } from 'lucide-react-native';

interface NumberPadProps {
  onNumberPress: (num: number) => void;
  onErasePress: () => void;
  onHintPress: () => void;
}

const NumberPad: React.FC<NumberPadProps> = ({ onNumberPress, onErasePress, onHintPress }) => {
  const { colors } = useTheme();

  const renderNumberButton = (num: number) => {
    const scale = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        key={num}
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => onNumberPress(num)}
        style={{ flex: 1, marginHorizontal: 2 }}
      >
        <Animated.View
          style={[
            styles.numberButton,
            { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              transform: [{ scale }] 
            }
          ]}
        >
          <Text style={[styles.numberText, { color: colors.primary }]}>{num}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderActionButton = (title: string, icon: React.ReactNode, color: string, onPress: () => void) => {
    const scale = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={[
            styles.actionButton,
            { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              transform: [{ scale }]
            }
          ]}
        >
          {icon}
          <Text style={[styles.actionText, { color }]}>{title}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(renderNumberButton)}
      </View>
      <View style={styles.actionGrid}>
        {renderActionButton('Erase', <Eraser size={22} color={colors.error} />, colors.error, onErasePress)}
        {renderActionButton('Hint', <Lightbulb size={22} color={colors.secondary} />, colors.secondary, onHintPress)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  numberButton: {
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  numberText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'RetroFont',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 8,
    fontWeight: '400',
    fontFamily: 'RetroFont',
    textTransform: 'uppercase',
  },
});

export default NumberPad;
