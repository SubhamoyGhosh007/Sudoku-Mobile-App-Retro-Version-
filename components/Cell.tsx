import React from 'react';
import { StyleSheet, Pressable, Text, Dimensions } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

interface CellProps {
  value: number | null;
  isInitial: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isIdentical: boolean;
  isDuplicate: boolean;
  onPress: () => void;
  isPaused?: boolean;
  cageSum?: number | null;
  cageBorders?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
}

const { width } = Dimensions.get('window');
const BOARD_PADDING = 32;
const CELL_SIZE = Math.floor((width - BOARD_PADDING) / 9);

const Cell: React.FC<CellProps> = ({ 
  value, isInitial, isSelected, isHighlighted, 
  isIdentical, isDuplicate, onPress, isPaused,
  cageSum, cageBorders
}) => {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (isPaused) return colors.surface;
    if (isSelected) return colors.cellSelected; // Light pink instead of solid pink
    if (isIdentical) return colors.cellHighlight;
    if (isHighlighted) return colors.cellHighlight;
    return colors.surface;
  };

  const getTextColor = () => {
    if (isPaused) return 'transparent';
    if (isDuplicate) return colors.error;
    return isInitial ? colors.cellInitial : colors.cellUser;
  };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.cell,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: isSelected ? colors.primary : colors.border,
          borderWidth: isSelected ? 2 : 0.5,
          borderTopWidth: cageBorders?.top ? 2 : (isSelected ? 2 : 0.5),
          borderBottomWidth: cageBorders?.bottom ? 2 : (isSelected ? 2 : 0.5),
          borderLeftWidth: cageBorders?.left ? 2 : (isSelected ? 2 : 0.5),
          borderRightWidth: cageBorders?.right ? 2 : (isSelected ? 2 : 0.5),
          borderStyle: (cageBorders?.top || cageBorders?.bottom || cageBorders?.left || cageBorders?.right) ? 'dashed' : 'solid',
          zIndex: isSelected ? 10 : 0,
        },
      ]}
    >
      {cageSum !== undefined && cageSum !== null && (
        <Text style={[styles.cageSum, { color: colors.textSecondary }]}>{cageSum}</Text>
      )}
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontWeight: '400',
            fontFamily: 'RetroFont',
          },
        ]}
      >
        {value}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  text: {
    fontSize: 14,
  },
  cageSum: {
    position: 'absolute',
    top: 1,
    left: 1,
    fontSize: 6,
    fontWeight: '400',
    fontFamily: 'RetroFont',
  },
});

export default Cell;
