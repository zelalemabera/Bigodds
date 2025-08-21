import SoccerMatchPredictions from '@/components/SoccerMatchPredictions'
import { ImageBackground } from 'expo-image'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

const PredictionsScreen = () => {
  return (
    <ImageBackground
      source={require('@/assets/images/Bg.jpg')}
      style={{ flex: 1 }}
      blurRadius={2}
    >
      <Text style={styles.header}>Today&apos;s Predictions</Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.predictionsContainer}>
          <SoccerMatchPredictions />
          <SoccerMatchPredictions />
          <SoccerMatchPredictions />
          <SoccerMatchPredictions />
          <SoccerMatchPredictions />
          <SoccerMatchPredictions />
          <SoccerMatchPredictions />
          <SoccerMatchPredictions />
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40, // Extra padding at bottom for better scrolling
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 20,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  predictionsContainer: {
    gap: 16, // Adds space between match cards
  }
});

export default PredictionsScreen;