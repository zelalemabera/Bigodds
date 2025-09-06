import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const PredictionPopup = ({ onClose , isPopUpVisible}) => {
  const [showReward, setShowReward] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useRouter();

  const handleWatchAd = async () => {
    try {
      setIsLoading(true);
      const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['sports', 'games','food','clothing'],
      });

      rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setIsLoading(false);
        rewarded.show();
      });

      rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        setShowReward(true);
        navigation.push('Predictions');
      });

      rewarded.load();

    } catch (error) {
      console.log('Error showing rewarded ad:', error);
      setIsLoading(false);
      // Handle error case
    }
  };

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
              onPress={isPopUpVisible ? onClose : null}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Match Predictions</Text>

            {!showReward ? (
              <>
                <Text style={styles.message}>
                  Watch a short ad to unlock expert predictions for today&apos;s matches!
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleWatchAd}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <FontAwesome name={isLoading ? "spinner" : "play"} size={24} color="white" />
                  <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Watch Ad'}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.message}>
                  Congratulations!you can now view predictions:
                </Text>

                <TouchableOpacity
                  style={[styles.button, styles.closeBtn]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
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
  reward: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50'
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
  closeBtn: {
    backgroundColor: '#666'
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
