import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CustomTabBar } from '@/components/custom-tab-bar';

const Colors = {
  light: {
    tint: '#0a7ea4',
  },
  dark: {
    tint: '#fff',
  },
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="rates"
        options={{
          title: 'Rates',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
