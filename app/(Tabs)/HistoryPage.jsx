import LoadingScreen from '@/components/Loading'
import SoccerMatchPredictions from '@/components/SoccerMatchPredictions'
import { supabase } from '@/services/supaBaseClient'
import { ImageBackground } from 'expo-image'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'
import { useSafeAreaInsets } from 'react-native-safe-area-context'



const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-9846851270242418/8340629564';


const HistoryPage = () => {
  const [prediction, setPrediction] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const bannerRef = useRef(null);




  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        // Fetching predictions from Supabase
        const { data, error } = await supabase
          .from('predictions')
          .select('*')
          .order('Posted_At', { ascending: false }); // Ordering by most recent first

        if (error) {
          console.error('Supabase Fetch Error:', error);
          setPrediction([]);
          return;
        }

        console.log('Predictions Fetch Success:', data);
        setPrediction(Array.isArray(data) ? data : []);

      } catch (error) {
        console.error('Unexpected Fetch Error:', error);
        setPrediction([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPredictions();
  }, []);
  
  return (
    <View style={{ flex: 1, paddingTop: insets.top}}>
    <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      <ImageBackground
        source={require('@/assets/images/Bg.jpg')}
        style={{ flex: 1 }}
        blurRadius={2}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Past Predictions</Text>
        </View>

        {isLoading ? (
          <LoadingScreen />
        ) : !Array.isArray(prediction) || prediction.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.noDataText}>No predictions available for today </Text>
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
                  League={Match.league}
                  matchTime={new Date(Match.created_at).toLocaleTimeString()}
                  AwayTeam={Match.away_team}
                  HomePossesion={Match.Home_Possesion}
                  AwayPossesion={Match.Away_Possesion}
                  odds={Match.odds}
                  Tip={Match.tips}
                  status={Match.Mtch_Status}
                  HomeTeamScore={Match.Home_Team_Score}
                  AwayTeamScore={Match.Away_Team_Score}
                  key={Match.id}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </ImageBackground>
    </View>
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
    marginLeft: 25,
    flex: 1,
  },
  homeButton: {
    position: 'absolute',
    left: 27,
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

export default HistoryPage;
