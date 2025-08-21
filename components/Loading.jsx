import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      {/* Branding can go here */}
      <Text style={styles.title}>Big Odds</Text>
      
      {/* The Spinner */}
      <ActivityIndicator size="large" color="#FF3B30" /> {/* Use your app's theme color */}
      
      {/* Helpful Text */}
      <Text style={styles.text}>Loading today&apos;s predictions...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // or a dark theme '#121212'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000', // or '#FFF' for dark mode
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#666', // or '#AAA' for dark mode
  },
});

export default LoadingScreen;