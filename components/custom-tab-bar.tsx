import { useColorScheme } from '@/hooks/use-color-scheme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import {
  Platform,
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

// Brand palette: red / black / white
const PALETTE = {
  red: '#E11D2E',
  white: '#FFFFFF',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();

  // Tab Bar Dimensions
  const horizontalMargin = 16;
  const internalPadding = 6;
  const tabBarWidth = width - horizontalMargin * 2;
  const usableWidth = tabBarWidth - internalPadding * 2;
  const tabWidth = usableWidth / state.routes.length;

  const indicatorWidth = tabWidth - 10;
  const indicatorHeight = 56;

  // Animation values for the pill indicator
  const translateX = useSharedValue(internalPadding + state.index * tabWidth + (tabWidth - indicatorWidth) / 2);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  useEffect(() => {
    const targetX = internalPadding + state.index * tabWidth + (tabWidth - indicatorWidth) / 2;

    translateX.value = withSpring(targetX, {
      damping: 16,
      stiffness: 160,
    });

    // Subtle squash and stretch — punchier, less jelly, more "snap"
    scaleX.value = withSequence(
      withSpring(1.18, { damping: 10, stiffness: 180 }),
      withSpring(0.94, { damping: 10, stiffness: 160 }),
      withSpring(1, { damping: 12, stiffness: 140 })
    );

    scaleY.value = withSequence(
      withSpring(0.82, { damping: 10, stiffness: 180 }),
      withSpring(1.08, { damping: 10, stiffness: 160 }),
      withSpring(1, { damping: 12, stiffness: 140 })
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
      intensity={isDark ? 40 : 60}
      tint={isDark ? 'dark' : 'light'}
      className="flex-row absolute left-4 right-4 h-[68px] rounded-[30px] items-center px-1.5 border border-[rgba(10,10,10,0.06)] dark:border-[rgba(255,255,255,0.08)] bg-white/92 dark:bg-[#0A0A0A]/92 overflow-hidden shadow-2xl"
      style={{
        bottom: Platform.OS === 'ios' ? insets.bottom + 8 : 16,
        shadowColor: '#000000',
        shadowOpacity: isDark ? 0.5 : 0.18,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
      }}>
      {/* Solid red pill indicator — the accent moment */}
      <Animated.View
        className="absolute left-0 rounded-[22px] bg-[#E11D2E]"
        style={[
          {
            width: indicatorWidth,
            height: indicatorHeight,
            shadowColor: '#E11D2E',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 4,
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
        if (route.name === 'live-rates') iconName = 'chart.line.uptrend.xyaxis';
        else if (route.name === 'conversion-history') iconName = 'clock.fill';

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={(options as any).tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.75}
            className="flex-1 h-full items-center justify-center">
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
interface TabItemProps {
  isFocused: boolean;
  iconName: string;
  label: string;
  isDark: boolean;
}

function TabItem({ isFocused, iconName, label, isDark }: TabItemProps) {
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isFocused ? 1.1 : 1, { damping: 14, stiffness: 200 }) },
        { translateY: withSpring(isFocused ? -4 : 0, { damping: 14, stiffness: 200 }) },
      ],
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isFocused ? 1 : 0, { damping: 16 }),
      transform: [
        { translateY: withSpring(isFocused ? 0 : 8, { damping: 16, stiffness: 140 }) },
        { scale: withSpring(isFocused ? 1 : 0.8, { damping: 16 }) },
      ],
    };
  });

  // Icon/label sits on top of the red pill when focused → always white.
  // Inactive icons are quiet black/white depending on theme.
  const activeColor = PALETTE.white;
  const inactiveColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(10,10,10,0.45)';

  const iconColor = isFocused ? activeColor : inactiveColor;

  return (
    <View className="items-center justify-center h-full">
      <Animated.View style={animatedIconStyle}>
        <IconSymbol size={23} name={iconName as any} color={iconColor} />
      </Animated.View>
      <Animated.View style={[animatedLabelStyle, { position: 'absolute', bottom: 6 }]}>
        <Text
          style={{
            color: activeColor,
            fontFamily: Platform.OS === 'web' ? Fonts.web.sans : undefined,
          }}
          className="text-[10px] font-bold text-center capitalize tracking-[0.2px]">
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}
