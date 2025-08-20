import { useColorScheme } from 'react-native';

const useColorTheme = () => {
  // Use React Native's built-in color scheme hook
  const colorScheme = useColorScheme();
  
  // Simply return the current color scheme
  return colorScheme || 'light'; // Fallback to 'light' if undefined
}

export default useColorTheme;