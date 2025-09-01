import React from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native';

const LoadingScreen = () => {
  return (
    <ImageBackground
      source={require('@/assets/images/Bg.jpg')}
      style={[styles.background, { flex: 10 }]} // Use the background style and combine with flex
      blurRadius={2}
      resizeMode="cover" // Add resizeMode
    >
      <View style={styles.container}>
        {/* Branding can go here */}
        <Text style={styles.title}>Big Odds</Text>

        {/* The Spinner */}
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#67ff30ff" />
        </View>

        {/* Helpful Text */}
        <Text style={styles.text}>Loading today&apos;s predictions...</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent overlay
  },
  spinnerContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#FFF',
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
});

export default LoadingScreen;
