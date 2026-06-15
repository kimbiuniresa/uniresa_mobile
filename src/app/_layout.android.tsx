import { BookingsIcon, HomeIcon, ProfileIcon, SavedIcon } from '@/assets/icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACTIVE_COLOR = '#079494';
const INACTIVE_COLOR = '#888';
const PILL_BG = 'rgba(7, 148, 148, 0.13)';


interface TabItemProps {
  route: BottomTabBarProps['state']['routes'][0];
  isFocused: boolean;
  options: any;
  onPress: () => void;
}

function TabItem({ route, isFocused, options, onPress }: TabItemProps) {
  const anim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isFocused ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const pillScaleX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.01, 1], 
  });

  const pillOpacity = anim.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0, 1, 1],
  });

  const iconSize = 23;
  const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

  const renderIcon = () => {
    switch (route.name) {
      case 'index': return <HomeIcon color={color} width={iconSize} height={iconSize} />;
      case 'saved': return <SavedIcon color={color} width={iconSize} height={iconSize} />;
      case 'bookings': return <BookingsIcon color={color} width={iconSize} height={iconSize} />;
      case 'profile': return <ProfileIcon color={color} width={iconSize} height={iconSize} />;
      default: return null;
    }
  };

  const label =
    typeof options.tabBarLabel === 'string'
      ? options.tabBarLabel
      : options.title ?? route.name;

  return (
    <Pressable onPress={onPress} style={styles.tabItem}>
      <View style={styles.pillContainer}>
        <Animated.View 
          style={[
            styles.pill, 
            { 
              opacity: pillOpacity,
              transform: [{ scaleX: pillScaleX }]
            }
          ]} 
        />
      </View>
      <View style={styles.iconWrapper}>{renderIcon()}</View>
      <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 4) }]}>
      {state.routes.map((route: any, index:number) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            options={options}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <GestureHandlerRootView>
    <Tabs
      initialRouteName="index"
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index"    options={{ title: 'Home',     tabBarLabel: 'Home' }} />
      <Tabs.Screen name="saved"    options={{ title: 'Saved',    tabBarLabel: 'Saved' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings', tabBarLabel: 'Bookings' }} />
      <Tabs.Screen name="profile"  options={{ title: 'Profile',  tabBarLabel: 'Profile' }} />
    </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 4,
  },
  pillContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    height: 36,
    width: '58%',
    borderRadius: 20,
    backgroundColor: PILL_BG,
  },
  iconWrapper: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    color: INACTIVE_COLOR,
    marginTop: 2,
  },
  labelActive: {
    color: ACTIVE_COLOR,
    fontWeight: '600',
  },
});