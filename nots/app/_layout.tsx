import 'react-native-url-polyfill/auto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import AuthScreen from './screens/AuthScreen';
import { AuthProvider, useUserInfo } from '@/lib/userContext';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeColor, View } from '@/components/Themed';
import { DrawerItem } from '@react-navigation/drawer';
import { supabase } from '@/lib/supabase';

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

const handleSignOut = async () => {
  try {
    await supabase.auth.signOut();
    // Aquí puedes añadir lógica adicional después de cerrar sesión, como navegar a la pantalla de inicio de sesión
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
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
  const iconColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');

  return (
    <ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}>
      {session ? (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer
            screenOptions={{
              headerTintColor: iconColor,
            }}
          >
            <Drawer.Screen
              name="(tabs)"
              options={{
                drawerLabel: "Inicio",
                headerShown: false,
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="home-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="screens/subjects"
              options={{
                drawerLabel: "Asignaturas",
                headerTitle: "Asignaturas",
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="book-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="screens/reminders"
              options={{
                drawerLabel: "Recordatorios",
                headerTitle: "Recordatorios",
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="notifications-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="screens/notes"
              options={{
                drawerLabel: "Apuntes",
                headerTitle: "Apuntes",
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="document-text-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="screens/assignments"
              options={{
                drawerLabel: "Tareas",
                headerTitle: "Tareas",
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="clipboard-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="screens/exams"
              options={{
                drawerLabel: "Pruebas",
                headerTitle: "Pruebas",
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="document-attach-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="drawer-schedule"
              options={{
                drawerLabel: "Horario",
                headerTitle: "Mi Horario",
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="calendar-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="drawer-profile"
              options={{
                drawerLabel: "Perfil",
                headerTitle: "Mi Perfil",
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="person-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="sign-out"
              options={{
                drawerLabel: "Cerrar sesión",
                headerTitle: "Cerrar sesión",
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="exit-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="screens/schedule"
              options={{
                drawerItemStyle: { height: 0 }
              }}
            />
            <Drawer.Screen
              name="+not-found"
              options={{
                drawerItemStyle: { height: 0 }
              }}
            />
            <Drawer.Screen
              name="modal"
              options={{
                drawerItemStyle: { height: 0 }
              }}
            />
            <Drawer.Screen
              name="screens/AuthScreen"
              options={{
                drawerItemStyle: { height: 0 }
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      ) : (
        <AuthScreen />
      )}
    </ThemeProvider>
  );
}
