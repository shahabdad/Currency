import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import { historyStore, Conversion } from '@/constants/historyStore';

// Supported currency flag code catalog mapping
import countryList from '@/constants/countryList';

const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  PKR: 'Pakistani Rupee',
  AED: 'UAE Dirham',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  INR: 'Indian Rupee',
};

const CURRENCY_KEYS = Object.keys(countryList).sort();

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // State to track currently selected chart bar
  const [selectedBar, setSelectedBar] = useState<number>(6); // Defaults to latest (Sun)

  // Chart selection currency state
  const [chartFromCurrency, setChartFromCurrency] = useState('USD');
  const [chartToCurrency, setChartToCurrency] = useState('PKR');

  // Picker state
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState<'from' | 'to'>('from');

  // Chart data and loading state
  const [chartData, setChartData] = useState<{ day: string; rate: number; height: number }[]>([
    { day: 'Mon', rate: 283.45, height: 110 },
    { day: 'Tue', rate: 284.12, height: 130 },
    { day: 'Wed', rate: 283.90, height: 120 },
    { day: 'Thu', rate: 285.20, height: 175 },
    { day: 'Fri', rate: 284.85, height: 155 },
    { day: 'Sat', rate: 285.00, height: 165 },
    { day: 'Sun', rate: 285.40, height: 190 },
  ]);
  const [loadingChart, setLoadingChart] = useState(false);

  // Conversions history state linked to global historyStore
  const [recentConversions, setRecentConversions] = useState<Conversion[]>(historyStore.getConversions());

  // Subscribe to history updates
  useEffect(() => {
    const unsubscribe = historyStore.subscribe((conversions) => {
      setRecentConversions(conversions);
    });
    return unsubscribe;
  }, []);

  // Fetch rates and generate simulated 7-day trend
  useEffect(() => {
    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${chartFromCurrency}`);
        const data = await response.json();
        if (data && data.rates) {
          const baseRate = data.rates[chartToCurrency] || 1.0;
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          
          const generated = days.map((day, idx) => {
            const seed = Math.sin(idx + 1) * 0.008 + Math.cos(idx * 2) * 0.004;
            const rate = baseRate * (1 + seed);
            return {
              day,
              rate,
              height: 0,
            };
          });

          const ratesOnly = generated.map((g) => g.rate);
          const minRate = Math.min(...ratesOnly);
          const maxRate = Math.max(...ratesOnly);
          const diff = maxRate - minRate || 1;

          const computed = generated.map((g) => {
            const pct = (g.rate - minRate) / diff;
            const height = 40 + pct * 130; // height between 40 and 170
            return {
              ...g,
              height,
            };
          });

          setChartData(computed);
        }
      } catch (error) {
        console.log('Error fetching chart data:', error);
      } finally {
        setLoadingChart(false);
      }
    };
    fetchChartData();
  }, [chartFromCurrency, chartToCurrency]);

  // Styling colors matching mockup
  const containerBg = isDark ? '#151718' : '#FFFFFF';
  const textColor = isDark ? '#ECEDEE' : '#0F172A';
  const subTextColor = isDark ? '#9BA1A6' : '#64748B';
  const brandRed = '#EF4444';
  const cardBg = isDark ? '#1E2021' : '#FFFFFF';
  const cardBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9';
  const gridItemBg = isDark ? '#26292A' : '#F8FAFC';

  // Trigger haptics
  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.impactAsync(style).catch(() => {});
    }
  };

  const getFlagUrl = (code: string) => {
    const countryCode = countryList[code] || 'US';
    return `https://flagsapi.com/${countryCode}/flat/64.png`;
  };

  const selectedData = chartData[selectedBar] || { day: 'N/A', rate: 0, height: 0 };

  const selectCurrency = (code: string) => {
    if (pickerType === 'from') {
      if (code === chartToCurrency) {
        setChartToCurrency(chartFromCurrency);
      }
      setChartFromCurrency(code);
    } else {
      if (code === chartFromCurrency) {
        setChartFromCurrency(chartToCurrency);
      }
      setChartToCurrency(code);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: containerBg }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.6}
          onPress={() => {
            triggerHaptic();
            router.push('/(tabs)');
          }}
        >
          <Feather name="arrow-left" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Rate Trends & History</Text>
        <TouchableOpacity 
          style={styles.filterButton} 
          activeOpacity={0.6}
          onPress={() => triggerHaptic()}
        >
          <Feather name="sliders" size={20} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Dynamic Trend Pair Selector */}
        <View style={[styles.selectorCard, { backgroundColor: cardBg, borderColor: cardBorderColor }]}>
          <Text style={[styles.selectorTitle, { color: subTextColor }]}>Select Currency Pair</Text>
          <View style={styles.selectorRow}>
            {/* From Selector */}
            <TouchableOpacity
              style={[styles.selectorButton, { backgroundColor: gridItemBg, borderColor: cardBorderColor }]}
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                setPickerType('from');
                setPickerVisible(true);
              }}
            >
              <Image source={{ uri: getFlagUrl(chartFromCurrency) }} style={styles.selectorFlag} />
              <Text style={[styles.selectorText, { color: textColor }]}>{chartFromCurrency}</Text>
              <Feather name="chevron-down" size={14} color={subTextColor} />
            </TouchableOpacity>

            <Feather name="arrow-right" size={16} color={brandRed} style={styles.arrowIcon} />

            {/* To Selector */}
            <TouchableOpacity
              style={[styles.selectorButton, { backgroundColor: gridItemBg, borderColor: cardBorderColor }]}
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                setPickerType('to');
                setPickerVisible(true);
              }}
            >
              <Image source={{ uri: getFlagUrl(chartToCurrency) }} style={styles.selectorFlag} />
              <Text style={[styles.selectorText, { color: textColor }]}>{chartToCurrency}</Text>
              <Feather name="chevron-down" size={14} color={subTextColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Interactive Chart Container */}
        <View style={[styles.chartCard, { backgroundColor: cardBg, borderColor: cardBorderColor }]}>
          <Text style={[styles.chartCardLabel, { color: subTextColor }]}>
            {chartFromCurrency}/{chartToCurrency} 7-Day Trend
          </Text>
          
          {/* Rate value bubble displaying highlighted bar */}
          <View style={styles.chartValueRow}>
            <Text style={[styles.chartRateValue, { color: textColor }]}>
              {selectedData.rate < 1 ? selectedData.rate.toFixed(4) : selectedData.rate.toFixed(2)}
            </Text>
            <View style={styles.chartPairDetails}>
              <Text style={[styles.chartPairText, { color: textColor }]}>{chartToCurrency}</Text>
              <Text style={[styles.chartDateText, { color: subTextColor }]}>
                {selectedData.day} ({chartFromCurrency} Base)
              </Text>
            </View>
          </View>

          {/* Custom Trend Chart Bars */}
          <View style={styles.chartGrid}>
            {loadingChart ? (
              <View style={styles.chartLoadingOverlay}>
                <Text style={{ color: subTextColor, fontWeight: '700' }}>Fetching trends...</Text>
              </View>
            ) : (
              chartData.map((bar, index) => {
                const isSelected = selectedBar === index;
                return (
                  <TouchableOpacity
                    key={bar.day}
                    style={styles.chartColumn}
                    activeOpacity={0.8}
                    onPress={() => {
                      triggerHaptic();
                      setSelectedBar(index);
                    }}
                  >
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: bar.height,
                            backgroundColor: isSelected ? brandRed : (isDark ? '#3A3D40' : '#E2E8F0'),
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.barLabel,
                        {
                          color: isSelected ? brandRed : subTextColor,
                          fontWeight: isSelected ? '800' : '600',
                        },
                      ]}
                    >
                      {bar.day}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        {/* Historical Changes Grid */}
        <Text style={[styles.sectionLabel, { color: subTextColor, marginBottom: 12 }]}>
          Trend Indicators
        </Text>
        <View style={styles.trendIndicatorGrid}>
          <View style={[styles.gridItem, { backgroundColor: gridItemBg, borderColor: cardBorderColor }]}>
            <Text style={[styles.gridItemLabel, { color: subTextColor }]}>USD/EUR (24h)</Text>
            <View style={styles.gridRateRow}>
              <Text style={[styles.gridRateText, { color: textColor }]}>+0.15%</Text>
              <Feather name="arrow-up-right" size={16} color="#22C55E" />
            </View>
          </View>

          <View style={[styles.gridItem, { backgroundColor: gridItemBg, borderColor: cardBorderColor }]}>
            <Text style={[styles.gridItemLabel, { color: subTextColor }]}>USD/PKR (7d)</Text>
            <View style={styles.gridRateRow}>
              <Text style={[styles.gridRateText, { color: textColor }]}>+1.12%</Text>
              <Feather name="arrow-up-right" size={16} color="#22C55E" />
            </View>
          </View>
        </View>

        {/* Recent Conversions */}
        <Text style={[styles.sectionLabel, { color: subTextColor, marginBottom: 12, marginTop: 12 }]}>
          Recent Conversions
        </Text>

        {recentConversions.length > 0 ? (
          recentConversions.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                router.push({
                  pathname: '/(tabs)/converter',
                  params: {
                    amount: item.fromAmount,
                    from: item.fromCode,
                    to: item.toCode,
                  },
                });
              }}
              style={[
                styles.conversionCard,
                { backgroundColor: cardBg, borderColor: cardBorderColor },
              ]}
            >
              <View style={styles.conversionLeft}>
                <View style={styles.flagsStack}>
                  <Image source={{ uri: getFlagUrl(item.fromCode) }} style={styles.stackedFlag} />
                  <Image source={{ uri: getFlagUrl(item.toCode) }} style={[styles.stackedFlag, styles.stackedFlagRight]} />
                </View>
                <View style={styles.conversionDetails}>
                  <Text style={[styles.conversionText, { color: textColor }]}>
                    {`${item.fromAmount} ${item.fromCode} = ${item.toAmount} ${item.toCode}`}
                  </Text>
                  <Text style={[styles.conversionTime, { color: subTextColor }]}>{item.time}</Text>
                </View>
              </View>

              <View style={styles.conversionRight}>
                <View style={styles.trendRow}>
                  <Feather 
                    name={item.trend.startsWith('+') ? 'arrow-up-right' : 'arrow-down-left'} 
                    size={14} 
                    color={item.trend.startsWith('+') ? '#22C55E' : '#EF4444'} 
                  />
                  <Text 
                    style={[
                      styles.trendText, 
                      { color: item.trend.startsWith('+') ? '#22C55E' : '#EF4444' }
                    ]}
                  >
                    {item.trend}
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={styles.deleteButton}
                  activeOpacity={0.6}
                  onPress={(e) => {
                    e.stopPropagation();
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    historyStore.deleteConversion(index);
                  }}
                >
                  <Feather name="trash-2" size={16} color={subTextColor} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyConversions}>
            <Text style={[styles.emptyConversionsText, { color: subTextColor }]}>No recent conversions.</Text>
          </View>
        )}
      </ScrollView>

      {/* Currency Selection Dialog Sheet */}
      <Modal
        visible={pickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { backgroundColor: isDark ? '#1C1E1F' : '#FFFFFF' }]}>
              <View
                style={[
                  styles.modalIndicator,
                  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0' },
                ]}
              />

              <Text style={[styles.modalTitle, { color: textColor }]}>
                {pickerType === 'from' ? 'Select From Currency' : 'Select To Currency'}
              </Text>

              <ScrollView 
                style={styles.modalList}
                showsVerticalScrollIndicator={false}
              >
                {CURRENCY_KEYS.map((code) => {
                  const countryCode = countryList[code];
                  const isSelected = pickerType === 'from' ? code === chartFromCurrency : code === chartToCurrency;
                  return (
                    <TouchableOpacity
                      key={code}
                      activeOpacity={0.7}
                      style={[
                        styles.currencyItem,
                        isSelected && {
                          backgroundColor: isDark
                            ? 'rgba(239, 68, 68, 0.12)'
                            : 'rgba(239, 68, 68, 0.06)',
                        },
                      ]}
                      onPress={() => {
                        triggerHaptic();
                        selectCurrency(code);
                        setPickerVisible(false);
                      }}
                    >
                      <View style={styles.currencyItemLeft}>
                        <Image
                          source={{ uri: `https://flagsapi.com/${countryCode}/flat/64.png` }}
                          style={styles.flagImageMini}
                        />
                        <View style={styles.currencyTextContainer}>
                          <Text style={[styles.currencyCodeText, { color: textColor }]}>
                            {code}
                          </Text>
                          <Text style={[styles.currencyNameText, { color: subTextColor }]} numberOfLines={1}>
                            {CURRENCY_NAMES[code] || `${code} Currency`}
                          </Text>
                        </View>
                      </View>
                      {isSelected && <Feather name="check" size={20} color={brandRed} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(155, 161, 166, 0.08)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    paddingBottom: 110,
  },
  chartCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 28,
  },
  chartCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  chartValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 28,
  },
  chartRateValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  chartPairDetails: {
    marginBottom: 4,
  },
  chartPairText: {
    fontSize: 14,
    fontWeight: '800',
  },
  chartDateText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  chartGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    paddingTop: 10,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 170,
    width: 14,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 161, 166, 0.05)',
    borderRadius: 7,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barLabel: {
    fontSize: 11,
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  trendIndicatorGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  gridItem: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  gridItemLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  gridRateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridRateText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#22C55E',
  },
  conversionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  conversionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  flagsStack: {
    width: 54,
    height: 36,
    position: 'relative',
  },
  stackedFlag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
    left: 0,
    top: 2,
    zIndex: 1,
  },
  stackedFlagRight: {
    left: 20,
    zIndex: 2,
  },
  conversionDetails: {
    flex: 1,
  },
  conversionText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  conversionTime: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  conversionRight: {
    alignItems: 'flex-end',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '800',
  },
  chartLoadingOverlay: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorCard: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    gap: 8,
  },
  selectorFlag: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '800',
  },
  arrowIcon: {
    alignSelf: 'center',
  },
  emptyConversions: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyConversionsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
    maxHeight: '65%',
  },
  modalIndicator: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  modalList: {
    marginBottom: 10,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  currencyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  flagImageMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  currencyTextContainer: {
    flex: 1,
  },
  currencyCodeText: {
    fontSize: 16,
    fontWeight: '800',
  },
  currencyNameText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 8,
    marginTop: 4,
  },
});
