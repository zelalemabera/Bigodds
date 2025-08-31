import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ 
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-9846851270242418/8861639209';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
        interstitial.show(); // Show ad immediately when loaded
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
    };
  }, []);

  return( <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Interstitial Ad Example</Text>
    {!loaded && <Text>Loading Ad...</Text>}
  </View>);
}
export default App;
