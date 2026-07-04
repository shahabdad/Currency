import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native';

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

// Generate list dynamically from countryList
const CURRENCY_LIST = Object.keys(countryList).map((code) => ({
  code,
  country: countryList[code],
  name: CURRENCY_NAMES[code] || `${code} Currency`,
  shortName: CURRENCY_NAMES[code] || `${code} Currency`,
}));

const CURRENCY_KEYS = Object.keys(countryList).sort();

export default function RatesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['PKR', 'AED', 'JPY']);
  const [favorites, setFavorites] = useState(['USD', 'GBP']);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Live exchange rates and base selection state
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  // Fetch exchange rates when baseCurrency changes
  useEffect(() => {
    const fetchRates = async () => {
      setLoadingRates(true);
      try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
        const data = await response.json();
        if (data && data.rates) {
          setRates(data.rates);
        }
      } catch (error) {
        console.log(`Error fetching rates for base ${baseCurrency}:`, error);
      } finally {
        setLoadingRates(false);
      }
    };
    fetchRates();
  }, [baseCurrency]);

  // Theme styling colors
  const containerBg = isDark ? '#151718' : '#FFFFFF';
  const textColor = isDark ? '#ECEDEE' : '#0F172A';
  const subTextColor = isDark ? '#9BA1A6' : '#64748B';
  const brandRed = '#EF4444';
  const cardBg = isDark ? '#1E2021' : '#FFFFFF';
  const cardBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9';
  const inputBg = isDark ? '#26292A' : '#F8FAFC';
  const inputBorderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0';
  const tagBg = isDark ? '#212324' : '#F1F5F9';

  // Helper: trigger haptics
  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.impactAsync(style).catch(() => { });
    }
  };

  // FlagsAPI helper
  const getFlagUrl = (code: string) => {
    const countryCode = countryList[code] || 'US';
    return `https://flagsapi.com/${countryCode}/flat/64.png`;
  };

  // Toggle Favorite
  const toggleFavorite = (code: string) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    if (favorites.includes(code)) {
      setFavorites(favorites.filter((fav) => fav !== code));
    } else {
      setFavorites([...favorites, code]);
    }
  };

  // Remove Recent Search Tag
  const removeRecent = (code: string) => {
    triggerHaptic();
    setRecentSearches(recentSearches.filter((item) => item !== code));
  };

  // Clear All Recents
  const clearAllRecents = () => {
    triggerHaptic();
    setRecentSearches([]);
  };

  // Filter Currency List
  const filteredCurrencies = CURRENCY_LIST.filter(
    (item) =>
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={[styles.headerTitle, { color: textColor }]}>Search Currency</Text>
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar Input */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: inputBg,
              borderColor: isSearchFocused ? brandRed : inputBorderColor,
            },
          ]}
        >
          <Feather name="search" size={20} color={subTextColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search by name or code..."
            placeholderTextColor={subTextColor}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                triggerHaptic();
                setSearchQuery('');
              }}
              style={styles.clearIconWrapper}
            >
              <Feather name="x-circle" size={16} color={subTextColor} />
            </TouchableOpacity>
          )}
        </View>

        {/* Base Currency Selection Card */}
        <View style={[styles.baseSelectCard, { backgroundColor: cardBg, borderColor: cardBorderColor }]}>
          <Text style={[styles.baseSelectLabel, { color: subTextColor }]}>Base Currency</Text>
          <TouchableOpacity
            style={[styles.baseSelectButton, { backgroundColor: inputBg, borderColor: inputBorderColor }]}
            activeOpacity={0.6}
            onPress={() => {
              triggerHaptic();
              setPickerVisible(true);
            }}
          >
            <View style={styles.baseSelectLeft}>
              <Image source={{ uri: getFlagUrl(baseCurrency) }} style={styles.baseSelectFlag} />
              <Text style={[styles.baseSelectCode, { color: textColor }]}>
                {baseCurrency} - {CURRENCY_NAMES[baseCurrency] || `${baseCurrency} Currency`}
              </Text>
            </View>
            <Feather name="chevron-down" size={18} color={subTextColor} />
          </TouchableOpacity>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionLabel, { color: subTextColor }]}>Recent Searches</Text>
              <TouchableOpacity activeOpacity={0.6} onPress={clearAllRecents}>
                <Text style={[styles.clearLink, { color: brandRed }]}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentTagsContainer}
            >
              {recentSearches.map((item) => (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.7}
                  style={[styles.tagPill, { backgroundColor: tagBg }]}
                  onPress={() => {
                    triggerHaptic();
                    setSearchQuery(item);
                  }}
                >
                  <Text style={[styles.tagText, { color: textColor }]}>{item}</Text>
                  <TouchableOpacity
                    style={styles.tagCloseButton}
                    onPress={() => removeRecent(item)}
                  >
                    <Feather name="x" size={14} color={subTextColor} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: subTextColor, marginBottom: 12 }]}>
              Favorites
            </Text>

            <View style={styles.favoritesGrid}>
              {favorites.map((code) => {
                const item = CURRENCY_LIST.find((c) => c.code === code);
                if (!item) return null;
                return (
                  <View
                    key={code}
                    style={[
                      styles.favoriteCard,
                      { backgroundColor: cardBg, borderColor: cardBorderColor },
                    ]}
                  >
                    <View style={styles.favoriteCardHeader}>
                      <Image
                        source={{ uri: getFlagUrl(item.code) }}
                        style={styles.circularFlag}
                      />
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => toggleFavorite(code)}
                        style={styles.starWrapper}
                      >
                        <Feather name="star" size={18} color={brandRed} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.favoriteCode, { color: textColor }]}>{item.code}</Text>
                    <Text style={[styles.favoriteName, { color: subTextColor }]} numberOfLines={1}>
                      {item.shortName}
                    </Text>
                    <Text style={[styles.favoriteRate, { color: brandRed }]} numberOfLines={1}>
                      {loadingRates ? '...' : rates && rates[code] ? `1 ${baseCurrency} = ${rates[code] < 1 ? rates[code].toFixed(4) : rates[code].toFixed(2)}` : 'N/A'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* All Currencies */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: subTextColor, marginBottom: 12 }]}>
            All Currencies
          </Text>

          {filteredCurrencies.length > 0 ? (
            filteredCurrencies.map((item) => {
              const isFav = favorites.includes(item.code);
              return (
                <View
                  key={item.code}
                  style={[
                    styles.currencyListItem,
                    { backgroundColor: cardBg, borderColor: cardBorderColor },
                  ]}
                >
                  <View style={styles.listItemLeft}>
                    <Image
                      source={{ uri: getFlagUrl(item.code) }}
                      style={styles.circularFlag}
                    />
                    <View style={styles.listTextContainer}>
                      <Text style={[styles.listCode, { color: textColor }]}>{item.code}</Text>
                      <Text style={[styles.listName, { color: subTextColor }]} numberOfLines={1}>{item.name}</Text>
                    </View>
                  </View>

                  <View style={styles.listItemRight}>
                    <View style={styles.rateValueContainer}>
                      {loadingRates ? (
                        <Text style={[styles.rateLoadingText, { color: subTextColor }]}>...</Text>
                      ) : rates && rates[item.code] ? (
                        <Text style={[styles.rateValueText, { color: textColor }]}>
                          {rates[item.code] < 1
                            ? rates[item.code].toFixed(4)
                            : rates[item.code].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                      ) : (
                        <Text style={[styles.rateValueText, { color: subTextColor }]}>N/A</Text>
                      )}
                      <Text style={[styles.rateCodeText, { color: subTextColor }]}>{item.code}</Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => toggleFavorite(item.code)}
                      style={styles.starIconWrapper}
                    >
                      <Feather
                        name="star"
                        size={18}
                        color={isFav ? brandRed : (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: subTextColor }]}>No currencies found.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Base Currency Selection Dialog Sheet */}
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
                Select Base Currency
              </Text>

              <ScrollView
                style={styles.modalList}
                showsVerticalScrollIndicator={false}
              >
                {CURRENCY_KEYS.map((code) => {
                  const countryCode = countryList[code];
                  const isSelected = code === baseCurrency;
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
                        setBaseCurrency(code);
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '600',
  },
  clearIconWrapper: {
    padding: 4,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  clearLink: {
    fontSize: 12,
    fontWeight: '700',
  },
  recentTagsContainer: {
    paddingRight: 20,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '700',
  },
  tagCloseButton: {
    padding: 2,
  },
  favoritesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  favoriteCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  favoriteCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  circularFlag: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  starWrapper: {
    padding: 4,
  },
  favoriteCode: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  favoriteName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  currencyListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  listTextContainer: {
    flex: 1,
  },
  listCode: {
    fontSize: 16,
    fontWeight: '800',
  },
  listName: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  baseSelectCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  baseSelectLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  baseSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  baseSelectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  baseSelectFlag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  baseSelectCode: {
    fontSize: 16,
    fontWeight: '700',
  },
  favoriteRate: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  rateValueContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  rateValueText: {
    fontSize: 16,
    fontWeight: '800',
  },
  rateCodeText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  rateLoadingText: {
    fontSize: 16,
    fontWeight: '800',
  },
  starIconWrapper: {
    padding: 6,
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
});
