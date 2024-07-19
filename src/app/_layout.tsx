import { Slot, Stack, Tabs } from "expo-router";
import { View, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "blue" }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="camera" options={{ headerShown: false }} />
    </Stack>
  );
}
