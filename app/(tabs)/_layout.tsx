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
          href: null,
        }}
      />
      <Tabs.Screen
        name="converter"
        options={{
          title: 'Converter',
        }}
      />
      <Tabs.Screen
        name="live-rates"
        options={{
          title: 'Live Rates',
        }}
      />
      <Tabs.Screen
        name="conversion-history"
        options={{
          title: 'History Log',
        }}
      />

    </Tabs>
  );
}
