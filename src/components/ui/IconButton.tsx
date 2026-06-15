// Button.tsx — zero dependency on pressto
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface IconButtonProps {
  onPress?: () => void;
  onLongPress?: () => void;
  loading?: boolean;
  badgeCount?: number;
  rounded?: boolean;
  size?: number;
  borderRadius?: number;
  fullWidth?: boolean;
  style?: any;
  children: React.ReactNode;
}

// Spring configs
const SPRING_DOWN = { damping: 15, stiffness: 320, mass: 0.8 };  // snap in
const SPRING_UP   = { damping: 18, stiffness: 280, mass: 0.8 };  // release

function IconButton({
  onPress,
  onLongPress,
  loading = false,
  badgeCount = 0,
  rounded = false,
  size = 44,
  borderRadius = 8,
  fullWidth = false,
  style,
  children,
}: IconButtonProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const scale = useSharedValue(1);
  const radius = rounded ? size / 2 : borderRadius;

  // JS-thread haptic helpers (called via runOnJS from worklet)
  const hapticLight  = useCallback(() =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}), []);
  const hapticMedium = useCallback(() =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}), []);
  const firePress    = useCallback(() => { if (!loading) onPress?.(); },    [loading, onPress]);
  const fireLong     = useCallback(() => { if (!loading) onLongPress?.(); }, [loading, onLongPress]);

  const gesture = Gesture.Simultaneous(
    // Tap gesture — handles press + release scale
    Gesture.Tap()
      .onBegin(() => {
        'worklet';
        scale.value = withSpring(0.90, SPRING_DOWN);
        runOnJS(hapticLight)();
      })
      .onEnd(() => {
        'worklet';
        scale.value = withSpring(1, SPRING_UP);
        runOnJS(firePress)();
      })
      .onFinalize(() => {
        'worklet';
        scale.value = withSpring(1, SPRING_UP); // safety release on cancel
      }),

    // Long press gesture
    Gesture.LongPress()
      .minDuration(400)
      .onStart(() => {
        'worklet';
        scale.value = withSpring(0.86, SPRING_DOWN); // deeper press for long hold
        runOnJS(hapticMedium)();
      })
      .onEnd(() => {
        'worklet';
        scale.value = withSpring(1, SPRING_UP);
        runOnJS(fireLong)();
      })
      .onFinalize(() => {
        'worklet';
        scale.value = withSpring(1, SPRING_UP);
      }),
  );

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: loading ? 0.5 : 1,
  }));

  const inner = (
    <>
      {loading
        ? <ActivityIndicator color={isDark ? '#fff' : '#000'} size="small" />
        : children}
      {badgeCount > 0 && !loading && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
    </>
  );

  return (
    // GestureHandlerRootView is safe to nest — RN gesture handler handles dedup
    <GestureHandlerRootView style={{ alignSelf: fullWidth ? 'stretch' : 'auto' }}>
      <GestureDetector gesture={loading ? Gesture.Race() : gesture}>
        <Animated.View
          style={[
            styles.base,
            {
              height: size,
              width: fullWidth ? '100%' : size,
              borderRadius: radius,
            },
            animStyle,
            style,
          ]}
        >
          {Platform.OS === 'ios' ? (
            /*
             * iOS 26 Liquid Glass
             * systemThinMaterial = deep translucent frosted layer
             * dimezisBlurView = real-time composited blur (needed in RN)
             * hairline specular border = the defining iOS 26 rim highlight
             */
            <BlurView
              intensity={isDark ? 85 : 72}
              tint={isDark ? 'systemThinMaterialDark' : 'systemThinMaterial'}
              experimentalBlurMethod="dimezisBlurView"
              style={[
                StyleSheet.absoluteFill,
                styles.center,
                {
                  borderRadius: radius,
                  overflow: 'hidden',
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: isDark
                    ? 'rgba(255,255,255,0.18)'
                    : 'rgba(255,255,255,0.60)',
                },
              ]}
            >
              {inner}
            </BlurView>
          ) : (
            <View
              style={[
                styles.center,
                {
                  borderRadius: radius,
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.10)'
                    : 'rgba(0,0,0,0.05)',
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.06)',
                },
              ]}
            >
              {inner}
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

export { IconButton };
export default IconButton;

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ff3b30',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
    textAlign: 'center',
  },
});