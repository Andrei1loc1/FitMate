import { Stack, useRouter } from "expo-router";
import "./globals.css";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfilePictureProvider } from "@/contexts/ProfilePictureContext";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("onboardingSeen");
      if (!seen) {
        router.replace("/(auth)/onboarding");
      }
    };
    checkOnboarding();
  }, []);

  return (
    <ProfilePictureProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </ProfilePictureProvider>
  );
}
