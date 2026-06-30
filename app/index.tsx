import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleStart = () => {
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  // Color palette matching the mockup
  const containerBg = isDark ? '#151718' : '#FFFFFF';
  const cardBg = isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC';
  const textColor = isDark ? '#ECEDEE' : '#000000';
  const subTextColor = isDark ? '#9BA1A6' : '#475569';
  const brandRed = '#EF4444';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: containerBg }]}>
      {/* Background Radial Glow */}
      {!isDark && <View style={styles.backgroundGlow} />}

      <View style={styles.container}>
        {/* Brand Title */}
        <Text style={[styles.brandTitle, { color: brandRed }]}>Currency Master</Text>

        {/* Center Illustration */}
        <View style={styles.illustrationContainer}>
          {/* Circular Backdrop */}
          <View
            style={[
              styles.circleBackdrop,
              {
                backgroundColor: cardBg,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
              },
            ]}>
            {/* Main Red Icon Box with soft red shadow */}
            <View style={[styles.iconBox, { backgroundColor: brandRed, shadowColor: brandRed }]}>
              <Feather name="trending-up" size={56} color="#FFFFFF" />
            </View>

            {/* Floating Badge */}
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: '#FFFFFF',
                  shadowColor: isDark ? '#000' : '#475569',
                },
              ]}>
              <Text style={styles.badgeText}>+1.24%</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: textColor }]}>
            Track Global Currency{'\n'}Rates In Real Time
          </Text>
          <Text style={[styles.description, { color: subTextColor }]}>
            Access lightning-fast updates from over{'\n'}170+ markets with professional-grade{'\n'}accuracy.
          </Text>
        </View>

        {/* Page Indicators */}
        <View style={styles.indicatorContainer}>
          <View style={[styles.dot, { backgroundColor: isDark ? '#ECEDEE' : '#475569' }]} />
          <View style={[styles.dot, { backgroundColor: isDark ? '#3A3D40' : '#E2E8F0', opacity: 0.8 }]} />
          <View style={[styles.dot, { backgroundColor: isDark ? '#3A3D40' : '#E2E8F0', opacity: 0.8 }]} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: brandRed, shadowColor: brandRed }]}
            activeOpacity={0.8}
            onPress={handleStart}>
            <Text style={styles.buttonText}>GET STARTED</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            activeOpacity={0.6}
            onPress={handleSkip}>
            <Text style={[styles.skipButtonText, { color: subTextColor }]}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundGlow: {
    position: 'absolute',
    top: -160,
    left: -160,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(239, 68, 68, 0.035)',
    zIndex: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 24,
    zIndex: 1,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
    letterSpacing: -0.2,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  circleBackdrop: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBox: {
    width: 140,
    height: 140,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: 50,
    right: -10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeText: {
    color: '#15803D',
    fontWeight: '800',
    fontSize: 15,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 25,
    paddingHorizontal: 16,
    letterSpacing: -0.1,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  skipButton: {
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
