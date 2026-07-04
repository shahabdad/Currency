import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  useColorScheme,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';

interface MarketNewsProps {
  fromCurrency: string;
  toCurrency: string;
}

interface NewsArticle {
  id: string;
  title: string;
  category: string;
  time: string;
  source: string;
  content: string;
  link?: string;
}

export default function MarketNews({ fromCurrency, toCurrency }: MarketNewsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // State Properties
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [liveNews, setLiveNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const triggerHaptic = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const fetchLiveNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://www.cnbc.com/id/19794293/device/rss/rss.xml');
      const text = await response.text();
      
      const items: NewsArticle[] = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;
      
      while ((match = itemRegex.exec(text)) !== null && items.length < 5) {
        const itemContent = match[1];
        
        const titleMatch = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || itemContent.match(/<title>([\s\S]*?)<\/title>/);
        const descMatch = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || itemContent.match(/<description>([\s\S]*?)<\/description>/);
        const dateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
        
        const title = titleMatch ? titleMatch[1].trim() : 'CNBC Market Update';
        const description = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : 'Click to view the full market insight details from CNBC.';
        const pubDate = dateMatch ? dateMatch[1].trim() : '';
        const link = linkMatch ? linkMatch[1].trim() : 'https://www.cnbc.com';
        
        let timeAgo = 'Just now';
        try {
          if (pubDate) {
            const dateObj = new Date(pubDate);
            const now = new Date();
            const diffMs = now.getTime() - dateObj.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 60) {
              timeAgo = `${diffMins}m ago`;
            } else {
              const diffHours = Math.floor(diffMins / 60);
              if (diffHours < 24) {
                timeAgo = `${diffHours}h ago`;
              } else {
                timeAgo = `${Math.floor(diffHours / 24)}d ago`;
              }
            }
          }
        } catch {}

        // Set category dynamically based on keywords
        let category = 'MARKET';
        if (title.toUpperCase().includes('FED') || title.toUpperCase().includes('BANK') || title.toUpperCase().includes('POLICY')) {
          category = 'POLICY';
        } else if (title.toUpperCase().includes('FORECAST') || title.toUpperCase().includes('OUTLOOK') || title.toUpperCase().includes('EXPECT')) {
          category = 'FORECAST';
        }
        
        items.push({
          id: Math.random().toString(),
          title,
          content: description,
          time: timeAgo,
          source: 'CNBC Finance',
          category,
          link,
        });
      }
      
      if (items.length > 0) {
        setLiveNews(items);
      }
    } catch (error) {
      console.log('Error fetching live news from CNBC:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNews();
  }, [fromCurrency, toCurrency]);

  const GET_NEWS_HEADLINES = (from: string, to: string) => [
    {
      id: '1',
      title: `${from} Trading Volume Surges Amid Market Volatility`,
      category: 'MARKET',
      time: '15m ago',
      source: 'Forex Pulse',
      content: `Trading volumes for the ${from} currency pair have hit a monthly high today. Market analysts point to foreign investment inflows and recent rate updates which have increased liquidity. Retail trading accounts show high activity, driving price action across key currency pairs. Traders are advised to monitor major resistance zones in the upcoming sessions as short-term volatility is expected to persist.`,
    },
    {
      id: '2',
      title: `Central Bank Updates Impacting ${to} Exchange Outlook`,
      category: 'POLICY',
      time: '1h ago',
      source: 'Global Economy Insight',
      content: `The national treasury announced adjustments to monetary policy framework that directly affect the native currency ${to}. Economic indicators suggest a shift in sentiment as fiscal authorities focus on trade balances and stabilization strategies. Financial institutions expect further policy guidelines by the end of the quarter, highlighting macro adjustments that might dictate long-term rates.`,
    },
    {
      id: '3',
      title: `Forex Forecast: What's Next for the ${from}/${to} Pair?`,
      category: 'FORECAST',
      time: '3h ago',
      source: 'FxMarketWatch',
      content: `Technical analysis for the ${from} to ${to} pair shows convergence near key moving averages. Momentum oscillators suggest neutral territory, but dynamic support holds strong. Market participants are positioning themselves ahead of the upcoming manufacturing report, which historically serves as a volatility trigger for cross-border currency pairs. Watch support lines closely.`,
    },
  ];

  // Theme styling colors
  const textColor = isDark ? '#ECEDEE' : '#0F172A';
  const subTextColor = isDark ? '#9BA1A6' : '#64748B';
  const brandRed = '#EF4444';
  const cardBg = isDark ? '#1E2021' : '#FFFFFF';
  const cardBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9';

  return (
    <View style={styles.container}>
      {/* Live Market News Section Header */}
      <View style={styles.newsSectionHeader}>
        <View style={styles.newsHeaderLeft}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Market Insights</Text>
          <View style={[styles.newsStatusBadge, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
            <View style={styles.statusDot} />
            <Text style={styles.newsStatusText}>Live Feed</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.refreshNewsButton, { borderColor: cardBorderColor }]}
          activeOpacity={0.6}
          onPress={() => {
            triggerHaptic();
            fetchLiveNews();
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={brandRed} />
          ) : (
            <Feather name="refresh-cw" size={14} color={textColor} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.newsList}>
        {(liveNews.length > 0 ? liveNews : GET_NEWS_HEADLINES(fromCurrency, toCurrency)).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.newsCard, { backgroundColor: cardBg, borderColor: cardBorderColor }]}
            activeOpacity={0.7}
            onPress={() => {
              triggerHaptic();
              setSelectedNews(item);
            }}
          >
            <View style={styles.newsCardHeader}>
              <View
                style={[
                  styles.newsTag,
                  {
                    backgroundColor:
                      item.category === 'POLICY'
                        ? 'rgba(239, 68, 68, 0.12)'
                        : item.category === 'MARKET'
                        ? 'rgba(34, 197, 94, 0.12)'
                        : 'rgba(59, 130, 246, 0.12)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.newsTagText,
                    {
                      color:
                        item.category === 'POLICY'
                          ? '#EF4444'
                          : item.category === 'MARKET'
                          ? '#22C55E'
                          : '#3B82F6',
                    },
                  ]}
                >
                  {item.category}
                </Text>
              </View>
              <Text style={[styles.newsCardTime, { color: subTextColor }]}>{item.time}</Text>
            </View>
            <Text style={[styles.newsCardTitle, { color: textColor }]} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.newsCardFooter}>
              <Text style={[styles.newsCardSource, { color: subTextColor }]}>{item.source}</Text>
              <Feather name="arrow-right" size={14} color={brandRed} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* News Detail Dialog Modal */}
      <Modal
        visible={selectedNews !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedNews(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedNews(null)}
        >
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { backgroundColor: isDark ? '#1C1E1F' : '#FFFFFF' }]}>
              <View
                style={[
                  styles.modalIndicator,
                  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0' },
                ]}
              />

              {selectedNews && (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                  <View style={styles.newsDetailHeader}>
                    <View
                      style={[
                        styles.newsTag,
                        {
                          backgroundColor:
                            selectedNews.category === 'POLICY'
                              ? 'rgba(239, 68, 68, 0.12)'
                              : selectedNews.category === 'MARKET'
                              ? 'rgba(34, 197, 94, 0.12)'
                              : 'rgba(59, 130, 246, 0.12)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.newsTagText,
                          {
                            color:
                              selectedNews.category === 'POLICY'
                                ? '#EF4444'
                                : selectedNews.category === 'MARKET'
                                ? '#22C55E'
                                : '#3B82F6',
                          },
                        ]}
                      >
                        {selectedNews.category}
                      </Text>
                    </View>
                    <Text style={[styles.newsDetailTime, { color: subTextColor }]}>
                      {selectedNews.time} • {selectedNews.source}
                    </Text>
                  </View>

                  <Text style={[styles.newsDetailTitle, { color: textColor }]}>
                    {selectedNews.title}
                  </Text>

                  <Text style={[styles.newsDetailContent, { color: textColor }]}>
                    {selectedNews.content}
                  </Text>

                  <TouchableOpacity
                    style={[styles.closeNewsButton, { backgroundColor: brandRed }]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedNews(null)}
                  >
                    <Text style={styles.closeNewsButtonText}>Close Article</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  newsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 10,
  },
  newsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  refreshNewsButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  newsStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  newsStatusText: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  newsList: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  newsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  newsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  newsTag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  newsTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  newsCardTime: {
    fontSize: 11,
    fontWeight: '600',
  },
  newsCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 12,
  },
  newsCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newsCardSource: {
    fontSize: 11,
    fontWeight: '600',
  },
  newsDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  newsDetailTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  newsDetailTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  newsDetailContent: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    opacity: 0.85,
    marginBottom: 24,
  },
  closeNewsButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  closeNewsButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
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
});
