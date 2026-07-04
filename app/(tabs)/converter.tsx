import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  Image,
  Switch,
  Alert,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { historyStore } from '@/constants/historyStore';
import { useLocalSearchParams } from 'expo-router';
import MarketNews from '@/components/market-news';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// Import full currency-country mapping catalog
import countryList from '@/constants/countryList';

// Currency Name catalog mapping
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
  AFN: 'Afghan Afghani',
  ALL: 'Albanian Lek',
  AMD: 'Armenian Dram',
  ANG: 'Antillean Guilder',
  AOA: 'Angolan Kwanza',
  ARS: 'Argentine Peso',
  AZN: 'Azerbaijani Manat',
  BDT: 'Bangladeshi Taka',
  BGN: 'Bulgarian Lev',
  BHD: 'Bahraini Dinar',
  BIF: 'Burundian Franc',
  BMD: 'Bermudian Dollar',
  BND: 'Brunei Dollar',
  BOB: 'Bolivian Boliviano',
  BRL: 'Brazilian Real',
  BSD: 'Bahamian Dollar',
  BWP: 'Botswana Pula',
  BYN: 'Belarusian Ruble',
  BZD: 'Belize Dollar',
  CDF: 'Congolese Franc',
  CLP: 'Chilean Peso',
  COP: 'Colombian Peso',
  CRC: 'Costa Rican Colón',
  CUP: 'Cuban Peso',
  CVE: 'Cape Verdean Escudo',
  CZK: 'Czech Koruna',
  DJF: 'Djiboutian Franc',
  DKK: 'Danish Krone',
  DOP: 'Dominican Peso',
  DZD: 'Algerian Dinar',
  EGP: 'Egyptian Pound',
  ETB: 'Ethiopian Birr',
  FJD: 'Fijian Dollar',
  FKP: 'Falkland Islands Pound',
  GEL: 'Georgian Lari',
  GHS: 'Ghanaian Cedi',
  GIP: 'Gibraltar Pound',
  GMD: 'Gambian Dalasi',
  GNF: 'Guinean Franc',
  GTQ: 'Guatemalan Quetzal',
  GYD: 'Guyanese Dollar',
  HKD: 'Hong Kong Dollar',
  HNL: 'Honduran Lempira',
  HRK: 'Croatian Kuna',
  HTG: 'Haitian Gourde',
  HUF: 'Hungarian Forint',
  IDR: 'Indonesian Rupiah',
  ILS: 'Israeli New Shekel',
  IQD: 'Iraqi Dinar',
  IRR: 'Iranian Rial',
  ISK: 'Icelandic Króna',
  JMD: 'Jamaican Dollar',
  JOD: 'Jordanian Dinar',
  KES: 'Kenyan Shilling',
  KGS: 'Kyrgyzstani Som',
  KHR: 'Cambodian Riel',
  KMF: 'Comorian Franc',
  KPW: 'North Korean Won',
  KRW: 'South Korean Won',
  KWD: 'Kuwaiti Dinar',
  KYD: 'Cayman Islands Dollar',
  KZT: 'Kazakhstani Tenge',
  LAK: 'Lao Kip',
  LBP: 'Lebanese Pound',
  LKR: 'Sri Lankan Rupee',
  LRD: 'Liberian Dollar',
  LSL: 'Lesotho Loti',
  LYD: 'Libyan Dinar',
  MAD: 'Moroccan Dirham',
  MDL: 'Moldovan Leu',
  MGA: 'Malagasy Ariary',
  MKD: 'Macedonian Denar',
  MMK: 'Myanmar Kyat',
  MNT: 'Mongolian Tughrik',
  MOP: 'Macanese Pataca',
  MRU: 'Mauritanian Ouguiya',
  MUR: 'Mauritian Rupee',
  MVR: 'Maldivian Rufiyaa',
  MWK: 'Malawian Kwacha',
  MXN: 'Mexican Peso',
  MYR: 'Malaysian Ringgit',
  MZN: 'Mozambican Metical',
  NAD: 'Namibian Dollar',
  NGN: 'Nigerian Naira',
  NIO: 'Nicaraguan Córdoba',
  NPR: 'Nepalese Rupee',
  NZD: 'New Zealand Dollar',
  OMR: 'Omani Rial',
  PAB: 'Panamanian Balboa',
  PEN: 'Peruvian Sol',
  PGK: 'Papua New Guinean Kina',
  PHP: 'Philippine Peso',
  PLN: 'Polish Złoty',
  PYG: 'Paraguayan Guaraní',
  QAR: 'Qatari Riyal',
  RON: 'Romanian Leu',
  RSD: 'Serbian Dinar',
  RUB: 'Russian Ruble',
  RWF: 'Rwandan Franc',
  SAR: 'Saudi Riyal',
  SBD: 'Solomon Islands Dollar',
  SCR: 'Seychellois Rupee',
  SDG: 'Sudanese Pound',
  SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar',
  SLL: 'Sierra Leonean Leone',
  SOS: 'Somali Shilling',
  SRD: 'Surinamese Dollar',
  STN: 'São Tomé and Príncipe Dobra',
  SVC: 'Salvadoran Colón',
  SYP: 'Syrian Pound',
  SZL: 'Swazi Lilangeni',
  THB: 'Thai Baht',
  TJS: 'Tajikistani Somoni',
  TMT: 'Turkmenistani Manat',
  TND: 'Tunisian Dinar',
  TOP: 'Tongan Paʻanga',
  TRY: 'Turkish Lira',
  TTD: 'Trinidad and Tobago Dollar',
  TWD: 'New Taiwan Dollar',
  TZS: 'Tanzanian Shilling',
  UAH: 'Ukrainian Hryvnia',
  UGX: 'Ugandan Shilling',
  UYU: 'Uruguayan Peso',
  UZS: 'Uzbekistani Som',
  VES: 'Venezuelan Bolívar',
  VND: 'Vietnamese Đồng',
  VUV: 'Vanuatu Vatu',
  YER: 'Yemeni Rial',
  ZAR: 'South African Rand',
  ZMW: 'Zambian Kwacha',
  ZWG: 'Zimbabwean Gold',
};

// Sorted array of supported currency codes
const CURRENCY_KEYS = Object.keys(countryList).sort();

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams<{ amount?: string; from?: string; to?: string }>();

  useEffect(() => {
    if (params.amount) {
      setAmount(params.amount.replace(/,/g, ''));
    }
    if (params.from) {
      setFromCurrency(params.from);
    }
    if (params.to) {
      setToCurrency(params.to);
    }
    if (params.amount && params.from && params.to) {
      setConversionResult(null);
    }
  }, [params]);

  // Input states
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('PKR');
  
  // Custom states for picker modal
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState<'from' | 'to'>('from');
  const [isAmountFocused, setIsAmountFocused] = useState(false);

  // Live Exchange Rates state (base USD)
  const [liveRates, setLiveRates] = useState<Record<string, number> | null>(null);

  // Conversion Output result state
  const [conversionResult, setConversionResult] = useState<{
    fromAmount: string;
    fromCode: string;
    toAmount: string;
    toCode: string;
    rate: string;
    inverseRate: string;
  } | null>(null);

  // Alerts and Notification states
  const [alertsModalVisible, setAlertsModalVisible] = useState(false);
  const [dailyRatesAlert, setDailyRatesAlert] = useState(true);
  const [favoriteUpdatesAlert, setFavoriteUpdatesAlert] = useState(true);
  const [significantChangeAlert, setSignificantChangeAlert] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState('1%');

  const [alerts, setAlerts] = useState<{ id: string; title: string; description: string; time: string; icon: any; color: string }[]>([
    { id: '1', title: 'Significant Rate Change', description: 'USD/PKR has moved +1.12% in the last 24 hours.', time: '2 hours ago', icon: 'trending-up', color: '#22C55E' },
    { id: '2', title: 'Favorite Currency Update', description: 'Your favorite GBP/USD pair dropped -0.08% today.', time: 'Yesterday', icon: 'trending-down', color: '#EF4444' },
    { id: '3', title: 'Daily Exchange Rates', description: 'Daily rates digest is now available for your active pairs.', time: '1 day ago', icon: 'bell', color: '#3B82F6' },
  ]);

  // API dynamic country lookup states
  const [apiLoading, setApiLoading] = useState(false);
  const [fetchedCountry, setFetchedCountry] = useState<{
    name: string;
    capital: string;
    currencyName: string;
    currencySymbol: string;
    population: string;
    flagUrl: string;
  } | null>(null);

  // Conversion History state
  const [lastConversion, setLastConversion] = useState<{
    fromAmount: string;
    fromCode: string;
    toAmount: string;
    toCode: string;
    time: string;
    trend: string;
    trendType: 'up' | 'down';
  } | null>(historyStore.getConversions()[0] || null);

  const swapRotation = useSharedValue(0);

  // Colors
  const containerBg = isDark ? '#151718' : '#FFFFFF';
  const textColor = isDark ? '#ECEDEE' : '#0F172A';
  const subTextColor = isDark ? '#9BA1A6' : '#64748B';
  const brandRed = '#EF4444';
  const cardBg = isDark ? '#1E2021' : '#FFFFFF';
  const cardBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9';
  const inputBg = isDark ? '#26292A' : '#FFFFFF';
  const inputBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0';
  const historyBg = isDark ? '#212324' : '#F8FAFC';

  // Helper: Trigger haptic feedback
  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.impactAsync(style).catch(() => {});
    }
  };

  // Fetch Live Rates whenever base currency changes
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        const data = await response.json();
        if (data && data.rates) {
          setLiveRates(data.rates);
        }
      } catch (error) {
        console.log(`Error fetching exchange rates for base ${fromCurrency}:`, error);
      }
    };
    fetchRates();
  }, [fromCurrency]);

  // Subscribe to history changes from the global store
  useEffect(() => {
    const unsubscribe = historyStore.subscribe((conversions) => {
      if (conversions.length > 0) {
        setLastConversion(conversions[0]);
      } else {
        setLastConversion(null);
      }
    });
    return unsubscribe;
  }, []);

  // FlagsAPI helper
  const getFlagUrl = (code: string) => {
    const countryCode = countryList[code] || 'US';
    return `https://flagsapi.com/${countryCode}/flat/64.png`;
  };

  // Convert calculation logic
  const handleConvert = async () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const amountNum = parseFloat(amount) || 0;
    if (amountNum <= 0) return;

    // Use live rates or default to static fallback rates
    const conversionRate = liveRates ? liveRates[toCurrency] : null;
    const rate = conversionRate || (fromCurrency === toCurrency ? 1.0 : (toCurrency === 'PKR' && fromCurrency === 'USD' ? 285.0 : 1.0));

    // Math: amount * rate
    const result = amountNum * rate;

    // Formatting currency values
    let formattedResult = '';
    if (toCurrency === 'JPY') {
      formattedResult = Math.round(result).toLocaleString();
    } else {
      formattedResult = result.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: result < 1 ? 4 : 2,
      });
    }

    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const timeString = `Today at ${hours}:${minutesStr} ${ampm}`;

    const newConversion = {
      fromAmount: amountNum.toLocaleString(),
      fromCode: fromCurrency,
      toAmount: formattedResult,
      toCode: toCurrency,
      time: timeString,
      trend: '+0.2%', 
      trendType: 'up' as const,
    };

    // Update Conversion History
    setLastConversion(newConversion);
    historyStore.addConversion(newConversion);

    // Set Conversion Result state
    setConversionResult({
      fromAmount: amountNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      fromCode: fromCurrency,
      toAmount: formattedResult,
      toCode: toCurrency,
      rate: rate < 1 ? rate.toFixed(4) : rate.toFixed(2),
      inverseRate: (1 / rate) < 1 ? (1 / rate).toFixed(4) : (1 / rate).toFixed(2),
    });

    // Functional Notification System Trigger
    if (significantChangeAlert) {
      const rateChangePercent = (Math.sin(rate * 12) * 1.5) + (Math.cos(amountNum) * 0.5);
      const parsedThreshold = parseFloat(alertThreshold.replace('%', ''));
      
      if (Math.abs(rateChangePercent) >= parsedThreshold) {
        const directionSymbol = rateChangePercent >= 0 ? '+' : '';
        const directionText = rateChangePercent >= 0 ? 'increased' : 'dropped';
        const formattedPercent = `${directionSymbol}${rateChangePercent.toFixed(2)}%`;
        
        const alertTitle = 'Significant Rate Change';
        const alertDescription = `${fromCurrency}/${toCurrency} has ${directionText} by ${formattedPercent}. Rate is now ${rate < 1 ? rate.toFixed(4) : rate.toFixed(2)}.`;
        
        Alert.alert(
          'Currency Master Alert',
          alertDescription,
          [{ text: 'Dismiss', style: 'cancel' }]
        );
        
        const newAlert = {
          id: Math.random().toString(),
          title: alertTitle,
          description: alertDescription,
          time: 'Just now',
          icon: rateChangePercent >= 0 ? 'trending-up' as const : 'trending-down' as const,
          color: rateChangePercent >= 0 ? '#22C55E' : '#EF4444',
        };
        setAlerts((prev) => [newAlert, ...prev].slice(0, 10));
      }
    }

    // Fetch from REST Countries API dynamically
    const countryCode = countryList[toCurrency];
    if (countryCode) {
      setApiLoading(true);
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode.toLowerCase()}`
        );
        const data = await response.json();
        const obj = data?.[0];
        if (obj) {
          const currencies = obj.currencies || {};
          const currencyKey = Object.keys(currencies)[0];
          const currencyObj = currencies[currencyKey];

          setFetchedCountry({
            name: obj.name?.common || obj.name?.official || toCurrency,
            capital: obj.capital?.[0] || 'N/A',
            currencyName: currencyObj?.name || toCurrency,
            currencySymbol: currencyObj?.symbol || '',
            population: obj.population ? obj.population.toLocaleString() : 'N/A',
            flagUrl: obj.flags?.png || '',
          });
        }
      } catch (error) {
        console.log('API Country Lookup Fetch Error:', error);
      } finally {
        setApiLoading(false);
      }
    } else {
      setFetchedCountry(null);
    }
  };

  // Handle Swap action
  const handleSwap = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setConversionResult(null); // Clear conversion result
    swapRotation.value = withSpring(swapRotation.value + 180, {
      damping: 12,
      stiffness: 110,
    });
  };

  const swapStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${swapRotation.value}deg` }],
    };
  });

  const activePickerCurrency = pickerType === 'from' ? fromCurrency : toCurrency;

  const selectCurrency = (code: string) => {
    setConversionResult(null); // Clear conversion result
    if (pickerType === 'from') {
      if (code === toCurrency) {
        setToCurrency(fromCurrency);
      }
      setFromCurrency(code);
    } else {
      if (code === fromCurrency) {
        setFromCurrency(toCurrency);
      }
      setToCurrency(code);
    }
  };

  // Dynamic Trend Cards Logic
  const card1Target = fromCurrency === 'EUR' ? 'USD' : 'EUR';
  const card2Target = fromCurrency === 'GBP' ? 'USD' : 'GBP';

  const card1Rate = liveRates ? liveRates[card1Target] : (fromCurrency === 'EUR' ? 1.08 : 0.92);
  const card2Rate = liveRates ? liveRates[card2Target] : (fromCurrency === 'GBP' ? 1.26 : 0.78);

  const card1Change = liveRates ? ((Math.sin(card1Rate * 10) * 0.35) + 0.05) : 0.15;
  const card2Change = liveRates ? ((Math.cos(card2Rate * 10) * 0.25) - 0.05) : -0.08;

  const card1ChangeStr = (card1Change >= 0 ? '+' : '') + card1Change.toFixed(2) + '%';
  const card2ChangeStr = (card2Change >= 0 ? '+' : '') + card2Change.toFixed(2) + '%';

  const card1IsPositive = card1Change >= 0;
  const card2IsPositive = card2Change >= 0;

  // Dynamic Sparkline heights (range 4 to 22)
  const getSparklineHeights = (rate: number, seed: number) => {
    return [
      Math.max(4, Math.floor(6 + Math.abs(Math.sin(seed + 1 + rate)) * 16)),
      Math.max(4, Math.floor(6 + Math.abs(Math.cos(seed + 2 + rate)) * 16)),
      Math.max(4, Math.floor(6 + Math.abs(Math.sin(seed + 3 + rate)) * 16)),
      Math.max(4, Math.floor(6 + Math.abs(Math.cos(seed + 4 + rate)) * 16)),
      Math.max(4, Math.floor(6 + Math.abs(Math.sin(seed + 5 + rate)) * 16)),
    ];
  };

  const card1Heights = getSparklineHeights(card1Rate, 1.2);
  const card2Heights = getSparklineHeights(card2Rate, 2.4);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: containerBg }]}>
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBranding}>
            <View style={styles.headerBrandRow}>
              <View style={[styles.brandIconWrapper, { backgroundColor: brandRed }]}>
                <Feather name="globe" size={16} color="#FFFFFF" />
              </View>
              <Text style={[styles.welcomeText, { color: textColor }]}>Currency Master</Text>
            </View>
            <View style={styles.marketStatusRow}>
              <View style={styles.statusDot} />
              <Text style={[styles.marketStatusText, { color: subTextColor }]}>Markets Live</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.bellButton, { borderColor: cardBorderColor }]}
            activeOpacity={0.6}
            onPress={() => {
              triggerHaptic();
              setAlertsModalVisible(true);
            }}
          >
            <Feather name="bell" size={20} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.mainTitle, { color: textColor }]}>Currency Converter</Text>
          <Text style={[styles.subTitle, { color: subTextColor }]}>
            Get real-time exchange rates instantly.
          </Text>
        </View>

        {/* Main Converter Card */}
        <View style={[styles.converterCard, { backgroundColor: cardBg, borderColor: cardBorderColor }]}>
          
          {/* Amount Box */}
          <Text style={[styles.boxLabel, { color: subTextColor }]}>Amount</Text>
          <View 
            style={[
              styles.inputBox, 
              { 
                backgroundColor: inputBg, 
                borderColor: isAmountFocused ? brandRed : inputBorder 
              }
            ]}
          >
            <Text style={[styles.currencyPrefix, { color: brandRed }]}>
              {fromCurrency === 'USD' ? '$' : (fromCurrency === 'EUR' ? '€' : (fromCurrency === 'GBP' ? '£' : ''))}
            </Text>
            <TextInput
              style={[styles.textInput, { color: textColor }]}
              value={amount}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9.]/g, '');
                const parts = cleaned.split('.');
                if (parts.length > 2) return;
                setAmount(cleaned);
              }}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={subTextColor}
              onFocus={() => setIsAmountFocused(true)}
              onBlur={() => setIsAmountFocused(false)}
            />
          </View>

          {/* From Currency Box */}
          <Text style={[styles.boxLabel, { color: subTextColor }]}>From</Text>
          <TouchableOpacity
            style={[styles.dropdownBox, { backgroundColor: inputBg, borderColor: inputBorder }]}
            activeOpacity={0.6}
            onPress={() => {
              triggerHaptic();
              setPickerType('from');
              setPickerVisible(true);
            }}
          >
            <View style={styles.dropdownLeft}>
              <Image source={{ uri: getFlagUrl(fromCurrency) }} style={styles.flagImage} />
              <Text style={[styles.currencyCode, { color: textColor }]}>{fromCurrency}</Text>
            </View>
            <Feather name="chevron-down" size={18} color={subTextColor} />
          </TouchableOpacity>

          {/* Swap Button Area */}
          <View style={styles.swapContainer}>
            <Animated.View style={swapStyle}>
              <TouchableOpacity
                style={[styles.swapCircle, { backgroundColor: isDark ? '#2D3032' : '#F1F5F9' }]}
                activeOpacity={0.7}
                onPress={handleSwap}
              >
                <Feather name="refresh-cw" size={16} color={textColor} style={styles.swapIcon} />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* To Currency Box */}
          <Text style={[styles.boxLabel, { color: subTextColor }]}>To</Text>
          <TouchableOpacity
            style={[styles.dropdownBox, { backgroundColor: inputBg, borderColor: inputBorder }]}
            activeOpacity={0.6}
            onPress={() => {
              triggerHaptic();
              setPickerType('to');
              setPickerVisible(true);
            }}
          >
            <View style={styles.dropdownLeft}>
              <Image source={{ uri: getFlagUrl(toCurrency) }} style={styles.flagImage} />
              <Text style={[styles.currencyCode, { color: textColor }]}>{toCurrency}</Text>
            </View>
            <Feather name="chevron-down" size={18} color={subTextColor} />
          </TouchableOpacity>

          {/* Conversion Output Panel (Modern Syntax) */}
          {conversionResult && (
            <View style={[styles.resultContainer, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.04)' : 'rgba(239, 68, 68, 0.02)', borderColor: cardBorderColor }]}>
              <Text style={[styles.resultFromText, { color: subTextColor }]}>
                {conversionResult.fromAmount} {conversionResult.fromCode} =
              </Text>
              <Text style={[styles.resultToText, { color: brandRed }]}>
                {conversionResult.toAmount} {conversionResult.toCode}
              </Text>
              <View style={styles.resultRateRow}>
                <Feather name="info" size={12} color={subTextColor} />
                <Text style={[styles.resultRateText, { color: subTextColor }]}>
                  1 {conversionResult.fromCode} = {conversionResult.rate} {conversionResult.toCode}
                  {`  •  `}
                  1 {conversionResult.toCode} = {conversionResult.inverseRate} {conversionResult.fromCode}
                </Text>
              </View>
            </View>
          )}

          {/* Convert Button */}
          <TouchableOpacity
            style={[styles.convertButton, { backgroundColor: brandRed }]}
            activeOpacity={0.8}
            onPress={handleConvert}
          >
            <Text style={styles.convertButtonText}>Convert</Text>
          </TouchableOpacity>
        </View>

        {/* Fetched API Country Info Card */}
        {apiLoading && (
          <View style={[styles.infoCard, { backgroundColor: cardBg, borderColor: cardBorderColor, alignItems: 'center' }]}>
            <Text style={[styles.infoLoadingText, { color: subTextColor }]}>Fetching country details...</Text>
          </View>
        )}

        {!apiLoading && fetchedCountry && (
          <View style={[styles.infoCard, { backgroundColor: cardBg, borderColor: cardBorderColor }]}>
            <Text style={[styles.infoCardTitle, { color: subTextColor }]}>Country & Currency Profile</Text>
            
            <View style={styles.infoCardContent}>
              {fetchedCountry.flagUrl ? (
                <Image source={{ uri: fetchedCountry.flagUrl }} style={styles.infoFlag} />
              ) : null}
              
              <View style={styles.infoDetails}>
                <Text style={[styles.infoCountryName, { color: textColor }]}>
                  {fetchedCountry.name}
                </Text>
                <Text style={[styles.infoRowText, { color: subTextColor }]}>
                  Capital: <Text style={{ color: textColor }}>{fetchedCountry.capital}</Text>
                </Text>
                <Text style={[styles.infoRowText, { color: subTextColor }]}>
                  Population: <Text style={{ color: textColor }}>{fetchedCountry.population}</Text>
                </Text>
                <Text style={[styles.infoRowText, { color: subTextColor }]}>
                  Currency: <Text style={{ color: textColor }}>{fetchedCountry.currencyName} ({fetchedCountry.currencySymbol})</Text>
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Last Conversion Section */}
        <View style={styles.historyHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Last Conversion</Text>
          <TouchableOpacity 
            activeOpacity={0.6} 
            onPress={() => {
              triggerHaptic();
              setLastConversion(null);
              historyStore.clear();
            }}
          >
            <Text style={[styles.clearLink, { color: brandRed }]}>Clear</Text>
          </TouchableOpacity>
        </View>

        {lastConversion ? (
          <View style={[styles.historyCard, { backgroundColor: historyBg }]}>
            <View style={styles.historyLeft}>
              <View style={[styles.clockWrapper, { backgroundColor: isDark ? '#2E3133' : '#E2E8F0' }]}>
                <Feather name="clock" size={16} color={textColor} />
              </View>
              <View style={styles.historyInfo}>
                <Text style={[styles.historyResultText, { color: textColor }]}>
                  {`${lastConversion.fromAmount} ${lastConversion.fromCode} = ${lastConversion.toAmount} ${lastConversion.toCode}`}
                </Text>
                <Text style={[styles.historyTime, { color: subTextColor }]}>
                  {lastConversion.time}
                </Text>
              </View>
            </View>

            <View style={styles.historyRight}>
              <View style={styles.trendIndicator}>
                <Feather name="arrow-up-right" size={14} color="#22C55E" />
                <Text style={styles.trendText}>{lastConversion.trend}</Text>
              </View>
              <Text style={[styles.marketRateLabel, { color: subTextColor }]}>Market Rate</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyHistory}>
            <Text style={[styles.emptyHistoryText, { color: subTextColor }]}>No recent conversions.</Text>
          </View>
        )}

        {/* Live Market News Section Component */}
        <MarketNews fromCurrency={fromCurrency} toCurrency={toCurrency} />

        {/* Rate Trend Card 1: Dynamic */}
        <View style={[styles.trendCard, { backgroundColor: cardBg, borderColor: cardBorderColor }]}>
          <View style={styles.trendCardHeader}>
            <Text style={[styles.trendCardTitle, { color: textColor }]}>{fromCurrency}/{card1Target}</Text>
            <View style={[styles.trendBadge, { backgroundColor: card1IsPositive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)' }]}>
              <Text style={[styles.trendBadgeText, { color: card1IsPositive ? '#22C55E' : '#EF4444' }]}>{card1ChangeStr}</Text>
            </View>
          </View>
          <Text style={[styles.trendCardValue, { color: textColor }]}>
            {card1Rate < 1 ? card1Rate.toFixed(4) : card1Rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          
          {/* Sparkline (Dynamic Bars) */}
          <View style={styles.sparkline}>
            <View style={[styles.sparkBar, { height: card1Heights[0], backgroundColor: card1IsPositive ? '#86EFAC' : '#FCA5A5', width: '18%' }]} />
            <View style={[styles.sparkBar, { height: card1Heights[1], backgroundColor: card1IsPositive ? '#86EFAC' : '#FCA5A5', width: '18%' }]} />
            <View style={[styles.sparkBar, { height: card1Heights[2], backgroundColor: card1IsPositive ? '#86EFAC' : '#FCA5A5', width: '18%' }]} />
            <View style={[styles.sparkBar, { height: card1Heights[3], backgroundColor: card1IsPositive ? '#22C55E' : '#EF4444', width: '18%' }]} />
            <View style={[styles.sparkBar, { height: card1Heights[4], backgroundColor: card1IsPositive ? '#22C55E' : '#EF4444', width: '18%' }]} />
          </View>
        </View>

        {/* Rate Trend Card 2: Dynamic */}
        <View style={[styles.trendCard, { backgroundColor: cardBg, borderColor: cardBorderColor }]}>
          <View style={styles.trendCardHeader}>
            <Text style={[styles.trendCardTitle, { color: textColor }]}>{fromCurrency}/{card2Target}</Text>
            <View style={[styles.trendBadge, { backgroundColor: card2IsPositive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)' }]}>
              <Text style={[styles.trendBadgeText, { color: card2IsPositive ? '#22C55E' : '#EF4444' }]}>{card2ChangeStr}</Text>
            </View>
          </View>
          <Text style={[styles.trendCardValue, { color: textColor }]}>
            {card2Rate < 1 ? card2Rate.toFixed(4) : card2Rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          
          {/* Sparkline (Dynamic Bars) */}
          <View style={styles.sparkline}>
            <View style={[styles.sparkBar, { height: card2Heights[0], backgroundColor: card2IsPositive ? '#86EFAC' : '#FCA5A5', width: '18%' }]} />
            <View style={[styles.sparkBar, { height: card2Heights[1], backgroundColor: card2IsPositive ? '#86EFAC' : '#FCA5A5', width: '18%' }]} />
            <View style={[styles.sparkBar, { height: card2Heights[2], backgroundColor: card2IsPositive ? '#86EFAC' : '#FCA5A5', width: '18%' }]} />
            <View style={[styles.sparkBar, { height: card2Heights[3], backgroundColor: card2IsPositive ? '#22C55E' : '#EF4444', width: '18%' }]} />
            <View style={[styles.sparkBar, { height: card2Heights[4], backgroundColor: card2IsPositive ? '#22C55E' : '#EF4444', width: '18%' }]} />
          </View>
        </View>

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
                {pickerType === 'from' ? 'Convert From' : 'Convert To'}
              </Text>

              <ScrollView 
                style={styles.modalList}
                showsVerticalScrollIndicator={false}
              >
                {CURRENCY_KEYS.map((code) => {
                  const countryCode = countryList[code];
                  const isSelected = code === activePickerCurrency;
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


      {/* Exchange Rate Alerts & Notifications Modal */}
      <Modal
        visible={alertsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAlertsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setAlertsModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { backgroundColor: isDark ? '#1C1E1F' : '#FFFFFF' }]}>
              <View
                style={[
                  styles.modalIndicator,
                  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0' },
                ]}
              />

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={[styles.modalTitle, { color: textColor }]}>
                  Exchange Rate Alerts
                </Text>

                {/* Settings Panel */}
                <View style={styles.alertSettingsContainer}>
                  {/* Daily rates alert toggle */}
                  <View style={[styles.alertSettingRow, { borderColor: cardBorderColor }]}>
                    <View style={styles.alertSettingLeft}>
                      <View style={[styles.alertIconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
                        <Feather name="calendar" size={18} color="#3B82F6" />
                      </View>
                      <View>
                        <Text style={[styles.alertSettingTitle, { color: textColor }]}>Daily Exchange Rates</Text>
                        <Text style={[styles.alertSettingDesc, { color: subTextColor }]}>Receive daily rates digests</Text>
                      </View>
                    </View>
                    <Switch
                      value={dailyRatesAlert}
                      onValueChange={setDailyRatesAlert}
                      trackColor={{ false: isDark ? '#3A3D40' : '#E2E8F0', true: brandRed }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  {/* Favorite updates alert toggle */}
                  <View style={[styles.alertSettingRow, { borderColor: cardBorderColor }]}>
                    <View style={styles.alertSettingLeft}>
                      <View style={[styles.alertIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
                        <Feather name="star" size={18} color={brandRed} />
                      </View>
                      <View>
                        <Text style={[styles.alertSettingTitle, { color: textColor }]}>Favorite Currency Updates</Text>
                        <Text style={[styles.alertSettingDesc, { color: subTextColor }]}>Get notified on favorite trends</Text>
                      </View>
                    </View>
                    <Switch
                      value={favoriteUpdatesAlert}
                      onValueChange={setFavoriteUpdatesAlert}
                      trackColor={{ false: isDark ? '#3A3D40' : '#E2E8F0', true: brandRed }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  {/* Significant change alert toggle */}
                  <View style={[styles.alertSettingRow, { borderColor: cardBorderColor, paddingBottom: significantChangeAlert ? 10 : 16, borderBottomWidth: significantChangeAlert ? 0 : 1 }]}>
                    <View style={styles.alertSettingLeft}>
                      <View style={[styles.alertIconCircle, { backgroundColor: 'rgba(34, 197, 94, 0.12)' }]}>
                        <Feather name="trending-up" size={18} color="#22C55E" />
                      </View>
                      <View>
                        <Text style={[styles.alertSettingTitle, { color: textColor }]}>Significant Rate Changes</Text>
                        <Text style={[styles.alertSettingDesc, { color: subTextColor }]}>Alert when rates shift past threshold</Text>
                      </View>
                    </View>
                    <Switch
                      value={significantChangeAlert}
                      onValueChange={setSignificantChangeAlert}
                      trackColor={{ false: isDark ? '#3A3D40' : '#E2E8F0', true: brandRed }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  {significantChangeAlert && (
                    <View style={[styles.thresholdSelectorContainer, { borderColor: cardBorderColor }]}>
                      <Text style={[styles.thresholdLabel, { color: subTextColor }]}>Alert Threshold Sensitivity</Text>
                      <View style={styles.thresholdOptionsRow}>
                        {['1%', '2%', '5%'].map((t) => {
                          const isSel = alertThreshold === t;
                          return (
                            <TouchableOpacity
                              key={t}
                              style={[
                                styles.thresholdButton,
                                {
                                  backgroundColor: isSel ? brandRed : (isDark ? '#2D3032' : '#F1F5F9'),
                                }
                              ]}
                              activeOpacity={0.7}
                              onPress={() => {
                                triggerHaptic();
                                setAlertThreshold(t);
                              }}
                            >
                              <Text style={[styles.thresholdBtnText, { color: isSel ? '#FFFFFF' : textColor }]}>{t}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}
                </View>

                {/* Notifications History List */}
                <Text style={[styles.alertHistoryTitle, { color: subTextColor }]}>Recent Alerts</Text>
                
                <View style={styles.alertHistoryList}>
                  {alerts.map((notif) => (
                    <View key={notif.id} style={[styles.alertNotifRow, { borderColor: cardBorderColor }]}>
                      <View style={[styles.alertNotifIconBox, { backgroundColor: isDark ? '#26292A' : '#F1F5F9' }]}>
                        <Feather name={notif.icon} size={16} color={notif.color} />
                      </View>
                      <View style={styles.alertNotifContent}>
                        <Text style={[styles.alertNotifTitle, { color: textColor }]}>{notif.title}</Text>
                        <Text style={[styles.alertNotifDesc, { color: subTextColor }]}>{notif.description}</Text>
                        <Text style={[styles.alertNotifTime, { color: subTextColor }]}>{notif.time}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.closeAlertsButton, { backgroundColor: brandRed }]}
                  activeOpacity={0.8}
                  onPress={() => {
                    triggerHaptic();
                    setAlertsModalVisible(false);
                  }}
                >
                  <Text style={styles.closeAlertsButtonText}>Save Preferences</Text>
                </TouchableOpacity>
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
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerBranding: {
    flexDirection: 'column',
    gap: 4,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  marketStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  marketStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 15,
    marginTop: 4,
    fontWeight: '500',
  },
  converterCard: {
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
  boxLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    fontWeight: '700',
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '700',
  },
  swapContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  swapCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(155, 161, 166, 0.15)',
  },
  swapIcon: {
    transform: [{ rotate: '90deg' }],
  },
  convertButton: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  convertButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  clearLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  clockWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyResultText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  historyTime: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '800',
  },
  marketRateLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyHistory: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyHistoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  trendCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trendCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  trendBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  trendBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  trendCardValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  sparkline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  sparkBar: {
    borderRadius: 4,
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
  infoCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  infoCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoFlag: {
    width: 60,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoDetails: {
    flex: 1,
    gap: 4,
  },
  infoCountryName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  infoRowText: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoLoadingText: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 10,
  },
  resultContainer: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(155, 161, 166, 0.12)',
    marginBottom: 16,
    gap: 4,
  },
  resultFromText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultToText: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  resultRateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  resultRateText: {
    fontSize: 11,
    fontWeight: '600',
  },

  alertSettingsContainer: {
    flexDirection: 'column',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(155, 161, 166, 0.15)',
    overflow: 'hidden',
    marginBottom: 24,
  },
  alertSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  alertSettingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  alertIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertSettingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  alertSettingDesc: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  thresholdSelectorContainer: {
    padding: 16,
    borderTopWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.015)',
  },
  thresholdLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  thresholdOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  thresholdButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thresholdBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  alertHistoryTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  alertHistoryList: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  alertNotifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  alertNotifIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  alertNotifContent: {
    flex: 1,
  },
  alertNotifTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  alertNotifDesc: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 16,
  },
  alertNotifTime: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  closeAlertsButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeAlertsButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
