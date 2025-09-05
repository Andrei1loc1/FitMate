import { Stack, useRouter, usePathname } from "expo-router";
import "./globals.css";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfilePictureProvider } from "@/contexts/ProfilePictureContext";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";

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
    
    // Hide navigation bar and status bar for full screen experience
    NavigationBar.setVisibilityAsync("hidden");
    // Keep system bar hidden; if revealed, overlay content (no insets)
    NavigationBar.setBehaviorAsync("overlay-swipe");

    // Auth gate: navigate based on auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const current = pathnameRef.current;
      if (!user) {
        if (!current.startsWith("/(auth)")) {
          router.replace("/(auth)/login");
        }
      } else {
        if (!current.startsWith("/(tabs)")) {
          router.replace("/(tabs)");
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Track current pathname to avoid redirect loops
  const pathname = usePathname();
  const pathnameRef = React.useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
    // Re-apply nav bar settings on route changes to keep it hidden in tabs
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, [pathname]);

  return (
    <ProfilePictureProvider>
      <StatusBar style="light" hidden={true} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </ProfilePictureProvider>
  );
}
