import 'react-native-url-polyfill/auto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import AuthScreen from './screens/AuthScreen';
import { AuthProvider, useUserInfo } from '@/lib/userContext';
import React from 'react';

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...Colors.dark,
  },
};

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors.light,
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session } = useUserInfo();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}>
      {session ? (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="screens/subjects" options={{ title: 'Asignaturas' }} />
          <Stack.Screen name="screens/reminders" options={{ title: 'Recordatorios' }} />
          <Stack.Screen name="screens/notes" options={{ title: 'Apuntes' }} />
          <Stack.Screen name="screens/assignments" options={{ title: 'Tareas' }} />
          <Stack.Screen name="screens/exams" options={{ title: 'Pruebas' }} />
          <Stack.Screen name="screens/schedule" options={{ title: 'Horario' }} />
        </Stack>
      ) : (
        <AuthScreen />
      )}
    </ThemeProvider>
  );
}
