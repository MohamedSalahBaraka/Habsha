import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/context/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Cairo: require("../assets/fonts/Cairo.ttf"),
    Alexandria: require("../assets/fonts/Alexandria.ttf"),
    ElMessiri: require("../assets/fonts/ElMessiri.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(modal)" options={{ headerShown: false }} />
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="CheckOutStore" options={{ headerShown: false }} />
          <Stack.Screen name="CheckOut" options={{ headerShown: false }} />
          <Stack.Screen name="Dishes" options={{ headerShown: false }} />
          <Stack.Screen name="Products" options={{ headerShown: false }} />
          <Stack.Screen name="Register" options={{ headerShown: false }} />
          <Stack.Screen name="Restaurant" options={{ headerShown: false }} />
          <Stack.Screen name="StoreScreen" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
