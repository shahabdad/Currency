import React from 'react';
import { StyleSheet, Text, View, useColorScheme, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const containerBg = isDark ? '#151718' : '#F8FAFC';
  const cardBg = isDark ? '#212324' : '#FFFFFF';
  const textColor = isDark ? '#ECEDEE' : '#1E293B';
  const subTextColor = isDark ? '#9BA1A6' : '#64748B';
  const accentColor = '#0284c7'; // sky-600 (water-blue)

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: containerBg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: subTextColor }]}>Welcome Back</Text>
          <Text style={[styles.title, { color: textColor }]}>Currency Converter</Text>
        </View>

        {/* Quick Convert Card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: isDark ? '#2D3032' : '#E2E8F0' }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>Popular Rate</Text>
          <View style={styles.rateRow}>
            <Text style={[styles.currencyText, { color: textColor }]}>1 USD</Text>
            <IconSymbol name="chevron.right" size={20} color={accentColor} />
            <Text style={[styles.currencyText, { color: textColor }]}>0.92 EUR</Text>
          </View>
          <Text style={[styles.updateText, { color: subTextColor }]}>Last updated: Just now</Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          <TouchableOpacity style={[styles.featureItem, { backgroundColor: cardBg, borderColor: isDark ? '#2D3032' : '#E2E8F0' }]}>
            <View style={[styles.iconWrapper, { backgroundColor: isDark ? 'rgba(2, 132, 199, 0.15)' : 'rgba(2, 132, 199, 0.08)' }]}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={accentColor} />
            </View>
            <Text style={[styles.featureLabel, { color: textColor }]}>Exchange Rates</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.featureItem, { backgroundColor: cardBg, borderColor: isDark ? '#2D3032' : '#E2E8F0' }]}>
            <View style={[styles.iconWrapper, { backgroundColor: isDark ? 'rgba(2, 132, 199, 0.15)' : 'rgba(2, 132, 199, 0.08)' }]}>
              <IconSymbol name="clock.fill" size={24} color={accentColor} />
            </View>
            <Text style={[styles.featureLabel, { color: textColor }]}>Track History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  currencyText: {
    fontSize: 24,
    fontWeight: '800',
  },
  updateText: {
    fontSize: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  featureItem: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
