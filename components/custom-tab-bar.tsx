import { useColorScheme } from '@/hooks/use-color-scheme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from './ui/icon-symbol';

const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
}) as any;

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();

  // Tab Bar Dimensions
  const horizontalMargin = 16;
  const internalPadding = 8;
  const tabBarWidth = width - horizontalMargin * 2;
  const usableWidth = tabBarWidth - internalPadding * 2;
  const tabWidth = usableWidth / state.routes.length;

  const indicatorWidth = tabWidth - 12;
  const indicatorHeight = 52;

  // Animation values for the bubble indicator
  const translateX = useSharedValue(internalPadding + state.index * tabWidth + (tabWidth - indicatorWidth) / 2);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  useEffect(() => {
    const targetX = internalPadding + state.index * tabWidth + (tabWidth - indicatorWidth) / 2;

    // Smooth sliding animation with spring
    translateX.value = withSpring(targetX, {
      damping: 14,
      stiffness: 110,
    });

    // Squash and stretch liquid/jelly bubble transition
    scaleX.value = withSequence(
      withSpring(1.35, { damping: 8, stiffness: 140 }),
      withSpring(0.85, { damping: 8, stiffness: 120 }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );

    scaleY.value = withSequence(
      withSpring(0.7, { damping: 8, stiffness: 140 }),
      withSpring(1.15, { damping: 8, stiffness: 120 }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );
  }, [state.index, tabWidth, indicatorWidth, translateX, scaleX, scaleY]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
      ],
    };
  });

  return (
    <BlurView
      intensity={isDark ? 65 : 85}
      tint={isDark ? 'dark' : 'light'}
      style={[
        styles.tabBarContainer,
        {
          bottom: Platform.OS === 'ios' ? insets.bottom + 8 : 16,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
          shadowColor: isDark ? '#000' : '#475569',
          shadowOpacity: isDark ? 0.25 : 0.06,
          backgroundColor: isDark ? 'rgba(21, 23, 24, 0.75)' : 'rgba(255, 255, 255, 0.75)', // Fallback background
          overflow: 'hidden',
        },
      ]}>
      {/* Liquid Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            width: indicatorWidth,
            height: indicatorHeight,
            // Subtle transparent highlight instead of solid blue
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)',
          },
          animatedIndicatorStyle,
        ]}
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Determine icon name based on screen route
        let iconName: any = 'house.fill';
        if (route.name === 'rates') iconName = 'chart.line.uptrend.xyaxis';
        else if (route.name === 'history') iconName = 'clock.fill';
        else if (route.name === 'profile') iconName = 'person.fill';

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={(options as any).tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
            style={styles.tabButton}>
            <TabItem
              isFocused={isFocused}
              iconName={iconName}
              label={options.title || route.name}
              isDark={isDark}
            />
          </TouchableOpacity>
        );
      })}
    </BlurView>
  );
}

// Inner component to handle individual tab button animations cleanly
function TabItem({
  isFocused,
  iconName,
  label,
  isDark,
}: {
  isFocused: boolean;
  iconName: string;
  label: string;
  isDark: boolean;
}) {
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isFocused ? 1.12 : 1, { damping: 12, stiffness: 180 }) },
        { translateY: withSpring(isFocused ? -5 : 0, { damping: 12, stiffness: 180 }) },
      ],
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isFocused ? 1 : 0, { damping: 15 }),
      transform: [
        { translateY: withSpring(isFocused ? 0 : 8, { damping: 15, stiffness: 120 }) },
        { scale: withSpring(isFocused ? 1 : 0.8, { damping: 15 }) },
      ],
    };
  });

  // Active color matching the theme instead of static white
  const activeColor = isDark ? '#ffffff' : '#1e293b';
  const inactiveColor = isDark
    ? 'rgba(236, 237, 238, 0.45)'
    : 'rgba(15, 23, 42, 0.45)';

  const iconColor = isFocused ? activeColor : inactiveColor;

  return (
    <View style={styles.tabItemContainer}>
      <Animated.View style={animatedIconStyle}>
        <IconSymbol size={24} name={iconName as any} color={iconColor} />
      </Animated.View>
      <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
        <Text
          style={[
            styles.labelText,
            {
              color: activeColor, // text matches the active theme color
              fontFamily: Platform.OS === 'web' ? Fonts.web.sans : undefined,
            },
          ]}>
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: 16,
    right: 16,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  indicator: {
    position: 'absolute',
    left: 0,
    borderRadius: 26,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 8,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
