import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Google Fonts
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';

import {
  Oswald_400Regular,
  Oswald_600SemiBold,
} from '@expo-google-fonts/oswald';

import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';

import {
  SourceSansPro_400Regular,
  SourceSansPro_600SemiBold,
} from '@expo-google-fonts/source-sans-pro';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const RootLayout: React.FC = () => {
  const [fontsLoaded] = useFonts({
    // Custom fonts from assets
    'Anton': require('../assets/fonts/Anton-Regular.ttf'),
    'BebasNeue': require('../assets/fonts/Bebas-Neue-Regular.ttf'),
    'FredokaOne': require('../assets/fonts/Fredoka-One-Regular.ttf'),
    'Oswald': require('../assets/fonts/Oswald-Bold.ttf'),
    'Righteous': require('../assets/fonts/Righteous-Regular.ttf'),

    // Google Fonts - alternatives to system fonts
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    Oswald_400Regular,
    Oswald_600SemiBold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    SourceSansPro_400Regular,
    SourceSansPro_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

// Default export for Expo Router compatibility
export default RootLayout;
