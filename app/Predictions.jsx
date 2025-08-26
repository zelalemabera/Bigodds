import LoadingScreen from '@/components/Loading'
import SoccerMatchPredictions from '@/components/SoccerMatchPredictions'
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

const PredictionsScreen = () => {
  const [prediction, setPrediction] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch('http://localhost:80/Big-Odds/api/BigOdds.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log('Predictions Fetch Success:', data);
        // Ensuring prediction is always an array
        setPrediction(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Predictions Fetch Error:', error);
        setPrediction([]); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  return (
    <ImageBackground
      source={require('@/assets/images/Bg.jpg')}
      style={{ flex: 1 }}
      blurRadius={2}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Today&apos;s Predictions</Text>
      </View>

      {isLoading ? (
       <LoadingScreen/>
      ) : !Array.isArray(prediction) || prediction.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>No predictions available for today</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.predictionsContainer}>
            {prediction.map((Match) => (
              <SoccerMatchPredictions
                HomeTeam={Match.home_team}
                League={Match.League}
                matchTime={Match.created_at}
                AwayTeam={Match.away_team}
                HomePossesion={Match.Home_Possesion}
                AwayPossesion={Match.Away_Possesion}
                odds={Match.odds}
                Tip={Match.Tips}
                status={Match.Mtch_Status}
                HomeTeamScore={Match.Home_Team_Score}
                AwayTeamScore={Match.Away_Team_Score}
                key={Match.id}
              />
            ))}
          </View>
        </ScrollView>
        
      )}
        {/* <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('index')}
        >
          <Text style={styles.homeButtonText}>🏠</Text>
        </TouchableOpacity> */}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    marginHorizontal: 10,
    marginLeft:25,
    flex: 1,
  },
  homeButton: {
    position: 'absolute',
    left:27,
    top: 27,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 12,
    borderRadius: 0,
  },
  homeButtonText: {
    fontSize: 24,
  },
  predictionsContainer: {
    gap: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  noDataText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
});

export default PredictionsScreen;
