import { Stack, Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import AdressList from "../../components/Modal/AdressList";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={{ presentation: "transparentModal" }}>
      <Stack.Screen name="AdressList" options={{ headerShown: false }} />
      <Stack.Screen name="Cart" options={{ headerShown: false }} />
      <Stack.Screen name="OrderDetails" options={{ headerShown: false }} />
      <Stack.Screen name="Dish" options={{ headerShown: false }} />
      <Stack.Screen name="UpdateInfo" options={{ headerShown: false }} />
      <Stack.Screen name="UpdateAdress" options={{ headerShown: false }} />
      <Stack.Screen name="UpdatePassword" options={{ headerShown: false }} />
    </Stack>
  );
}
