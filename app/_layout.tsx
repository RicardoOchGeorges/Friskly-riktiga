import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { AuthProvider } from '../lib/auth';
import { ProtectedRouteProvider } from '../lib/protected-route';

// Define custom theme for React Native Paper
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    secondary: '#2196F3',
    error: '#F44336',
  },
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedRouteProvider>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <StatusBar style="auto" />
              <Slot />
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </PaperProvider>
      </ProtectedRouteProvider>
    </AuthProvider>
  );
}
