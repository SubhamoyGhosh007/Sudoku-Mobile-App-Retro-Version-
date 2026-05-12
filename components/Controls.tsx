import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { Button, ModalContainer } from './Common';
import { RotateCcw, Undo2, AlertCircle } from 'lucide-react-native';

interface ControlsProps {
  onReset: () => void;
  onUndo: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onReset, onUndo }) => {
  const { colors } = useTheme();
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button
        title="Undo"
        onPress={onUndo}
        variant="secondary"
        style={styles.controlBtn}
        icon={<Undo2 size={20} color="#FFFFFF" />}
      />
      <Button
        title="Reset"
        onPress={() => setIsResetModalVisible(true)}
        variant="outline"
        style={styles.controlBtn}
        icon={<RotateCcw size={20} color={colors.primary} />}
      />

      <Modal transparent visible={isResetModalVisible} animationType="fade">
        <ModalContainer>
          <View style={[styles.alertIcon, { backgroundColor: colors.error + '20' }]}>
            <AlertCircle size={48} color={colors.error} />
          </View>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Reset Board?</Text>
          <Text style={[styles.modalText, { color: colors.textSecondary }]}>
            This will clear all your progress on the current board.
          </Text>
          <View style={styles.modalActions}>
            <Button
              title="Yes, Reset"
              onPress={() => {
                onReset();
                setIsResetModalVisible(false);
              }}
              style={styles.resetConfirmBtn}
            />
            <Button
              title="Cancel"
              onPress={() => setIsResetModalVisible(false)}
              variant="ghost"
            />
          </View>
        </ModalContainer>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  controlBtn: {
    flex: 1,
    marginVertical: 0,
  },
  alertIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'RetroFont',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalText: {
    fontSize: 10,
    fontFamily: 'RetroFont',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  modalActions: {
    width: '100%',
    gap: 8,
  },
  resetConfirmBtn: {
    width: '100%',
    backgroundColor: '#FF2E2E',
  },
});

export default Controls;
