import { FontAwesome } from '@expo/vector-icons';
import { navigate } from 'expo-router/build/global-state/routing';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PredictionPopup = ({ onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.container}>
          <View style={styles.popup}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Match Predictions</Text>

            <Text style={styles.message}>
              Watch a short ad to unlock expert predictions for today&apos;s matches!
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => { navigate('/Predictions'); onClose(); }}
              activeOpacity={0.8}
            >
              <FontAwesome name="play" size={24} color="white" />
              <Text style={styles.buttonText}>Watch Ad</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    width: '80%',
    maxWidth: 340,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '100%',
    borderRadius: 20,
    padding: 25,
    backgroundColor: '#0c0e15ff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    marginBottom: 15,
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  message: {
    marginBottom: 25,
    fontSize: 16,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 22,
    lineHeight: 22,
    fontWeight: 'bold',
    marginTop: -2,
  }
});

export default PredictionPopup;
