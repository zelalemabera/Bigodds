import SoccerMatchPredictions from '@/components/SoccerMatchPredictions'
import { ImageBackground } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'



const PredictionsScreen = () => {
  const [Prediction, setPrediction] = useState([]);

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
        setPrediction(data.data||[]);
      } catch (error) {
        console.error('Predictions Fetch Error:', error);
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
      <Text style={styles.header}>Today&apos;s Predictions</Text>
   
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.predictionsContainer}>
          {Prediction.map((Match)=>(
            <SoccerMatchPredictions
              HomeTeam = {Match.home_team}
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
          {/* <SoccerMatchPredictions />
          <SoccerMatchPredictions />
          <SoccerMatchPredictions />
          <SoccerMatchPredictions />
          <SoccerMatchPredictions />
          <SoccerMatchPredictions />
          <SoccerMatchPredictions />
          <SoccerMatchPredictions /> */}
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
    paddingBottom: 40,
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
    gap: 16,
  }
});

export default PredictionsScreen;