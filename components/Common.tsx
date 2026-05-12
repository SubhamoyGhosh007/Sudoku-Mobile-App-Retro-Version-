import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', style, textStyle, disabled, icon }) => {
  const { colors } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.primary, borderBottomWidth: 4, borderRightWidth: 4, borderColor: 'rgba(0,0,0,0.2)' };
      case 'secondary':
        return { backgroundColor: colors.secondary, borderBottomWidth: 4, borderRightWidth: 4, borderColor: 'rgba(0,0,0,0.2)' };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return { color: '#FFFFFF' };
      case 'outline':
      case 'ghost':
        return { color: colors.primary };
      default:
        return { color: '#FFFFFF' };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        getVariantStyle(),
        style,
        disabled && { opacity: 0.5 },
      ]}
    >
      <View style={styles.buttonContent}>
        {icon}
        {title ? <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

export const ModalContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8, // More angular for retro
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 10, // Press Start 2P is larger than standard fonts
    fontWeight: '400',
    fontFamily: 'RetroFont',
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 8,
    borderWidth: 4,
    alignItems: 'center',
  },
});
