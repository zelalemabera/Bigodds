import SoccerMatchPredictions from '@/components/SoccerMatchPredictions'
import { ImageBackground } from 'expo-image'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const PredictionsScreen = () => {
  return (
    <ImageBackground
      source={require('@/assets/images/Bg.jpg')}
      style={{ flex: 1, blur: 2 }}
      >
      <View>
        <SoccerMatchPredictions />
        <SoccerMatchPredictions />
        <SoccerMatchPredictions />
        <SoccerMatchPredictions />
        <SoccerMatchPredictions />
        <SoccerMatchPredictions />
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
    textAlignVertical: 'center',

    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
  }

});

export default PredictionsScreen;
