import { useSafeAreaInsets } from 'react-native-safe-area-context';

const UseInset = () => {
  // Get safe area insets from React Native
  const insets = useSafeAreaInsets();
  
  // Return top and bottom insets for layout spacing
  return {
    top: insets.top,
    bottom: insets.bottom
  };
}

export default UseInset;
