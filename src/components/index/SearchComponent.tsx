// SearchComponent.tsx
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    useColorScheme,
    View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

import { Activity, Bed, Car, Plane } from '@/assets/icons';
import { SearchCriteria } from '@/types/bookings';
import ActivitiesSearchComponent from './headers/ActivitiesSearchComponent';
import CarSearchComponent from './headers/CarSearchComponent';
import FlightSearchComponent from './headers/FlightSearchComponent';
import StaySearchComponent from './headers/StaySearchComponent';

const PRIMARY        = 'rgba(7, 148, 148, 1)';
const PRIMARY_LIGHT  = 'rgba(6,148,148,0.10)';
const NEUTRAL        = 'rgba(98,98,98,1)';
const SPRING_IN      = { damping: 16, stiffness: 340, mass: 0.75 };
const SPRING_OUT     = { damping: 20, stiffness: 260, mass: 0.75 };
const TIMING_TAB     = { duration: 220 };

interface SearchComponentProps {
  initialSearchCriteria?: SearchCriteria;
}

interface TabConfig {
  id: string;
  labelKey: string;
  Icon: React.FC<{ size: number; color: string }>;
  component: React.ReactNode;
}

interface TabPillProps {
  tab: TabConfig;
  isActive: boolean;
  onSelect: (id: string) => void;
  isDark: boolean;
}

function TabPill({ tab, isActive, onSelect, isDark }: TabPillProps) {
  const scale    = useSharedValue(1);
  const progress = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, TIMING_TAB);
  }, [isActive]);

  const hapticLight = useCallback(() =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}), []);

  const fireSelect = useCallback(() => onSelect(tab.id), [tab.id, onSelect]);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      scale.value = withSpring(0.91, SPRING_IN);
      runOnJS(hapticLight)();
    })
    .onEnd(() => {
      'worklet';
      scale.value = withSpring(1, SPRING_OUT);
      runOnJS(fireSelect)();
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1, SPRING_OUT);
    });

  const animatedOuter = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', PRIMARY],
    ),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [isDark ? 'rgba(255,255,255,0.0)' : 'rgba(0,0,0,0.0)', PRIMARY_LIGHT],
    ),
  }));

  const animatedLabel = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [isDark ? 'rgba(180,180,180,1)' : NEUTRAL, PRIMARY],
    ),
  }));

  const iconColor = isActive ? PRIMARY : (isDark ? 'rgba(180,180,180,1)' : NEUTRAL);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.pill, animatedOuter]}>
        <tab.Icon size={17} color={iconColor} />
        <Animated.Text style={[styles.pillLabel, animatedLabel]}>{tab.labelKey}</Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
}

const SearchComponent: React.FC<SearchComponentProps> = ({ initialSearchCriteria }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [activeTab, setActiveTab] = useState('stay');

  const tabs: TabConfig[] = [
    {
      id: 'stay',
      labelKey: 'Stays',
      Icon: ({ size, color }) => <Bed width={size} height={size} color={color} />,
      component: <StaySearchComponent initialSearchCriteria={initialSearchCriteria} />,
    },
    {
      id: 'flight',
      labelKey: 'Flights',
      Icon: ({ size, color }) => <Plane width={size} height={size} color={color} />,
      component: <FlightSearchComponent />,
    },
    {
      id: 'car',
      labelKey: 'Cars',
      Icon: ({ size, color }) => <Car width={size} height={size} color={color} />,
      component: <CarSearchComponent />,
    },
    {
      id: 'activity',
      labelKey: 'Activities',
      Icon: ({ size, color }) => <Activity width={size} height={size} color={color} />,
      component: <ActivitiesSearchComponent />,
    },
  ];

  const activeComponent = tabs.find(t => t.id === activeTab)?.component;

  const cardBg    = isDark ? 'rgba(28,28,30,0.82)'  : 'rgba(255,255,255,0.92)';
  const borderCol = isDark ? 'rgba(255,255,255,0.10)': 'rgba(255,255,255,0.70)';
  const divider   = isDark ? 'rgba(255,255,255,0.07)': 'rgba(0,0,0,0.06)';

  return (
    <>
        <View style={[styles.card, { borderColor: borderCol }]}>
            {Platform.OS === 'ios' && (
                <BlurView
                intensity={isDark ? 80 : 68}
                tint={isDark ? 'systemThinMaterialDark' : 'systemThinMaterial'}
                blurMethod="dimezisBlurView"
                style={[StyleSheet.absoluteFill, styles.blurFill]}
                />
            )}

            {Platform.OS !== 'ios' && (
                <View style={[StyleSheet.absoluteFill, styles.blurFill, { backgroundColor: cardBg }]} />
            )}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabRow}
                style={styles.tabScroll}
            >
                {tabs.map(tab => (
                <TabPill
                    key={tab.id}
                    tab={tab}
                    isActive={activeTab === tab.id}
                    onSelect={setActiveTab}
                    isDark={isDark}
                />
                ))}
            </ScrollView>


        </View>
        <View style={styles.panel}>
            {activeComponent}
        </View>
    </>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    marginInline: 10
  },
  blurFill: {
    borderRadius: 20,
  },
  tabScroll: {
    flexGrow: 0,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    width: 100
  },
  pillLabel: {
    fontSize: 13.5,
  },
  panel: {
    padding: 14,
  },
});