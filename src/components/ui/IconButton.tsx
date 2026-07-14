// IconButton.tsx
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo } from 'react';
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

// Conditionally import the modern Expo Glass Effect module safely
let GlassView: any = null;
let isGlassEffectAPIAvailable: (() => boolean) | null = null;
try {
  const GlassModule = require('expo-glass-effect');
  GlassView = GlassModule.GlassView;
  isGlassEffectAPIAvailable = GlassModule.isGlassEffectAPIAvailable;
} catch (e) {
  // Graceful fallback if module isn't loaded
}

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

// Fluid interaction spring weight configurations
const SPRING_DOWN = { damping: 14, stiffness: 360, mass: 0.7 };
const SPRING_UP   = { damping: 16, stiffness: 260, mass: 0.8 };

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

  // Runtime structural feature detection for iOS 26+ native engine
  const useNativeLiquidGlass = useMemo(() => {
    if (Platform.OS !== 'ios' || !GlassView || !isGlassEffectAPIAvailable) {
      return false;
    }
    try {
      return isGlassEffectAPIAvailable();
    } catch {
      return false;
    }
  }, []);

  const hapticLight  = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);
  
  const hapticMedium = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }, []);

  const firePress = useCallback(() => { if (!loading) onPress?.(); }, [loading, onPress]);
  const fireLong  = useCallback(() => { if (!loading) onLongPress?.(); }, [loading, onLongPress]);

  const tapGesture = Gesture.Tap()
    .maxDuration(300)
    .onBegin(() => {
      'worklet';
      scale.value = withSpring(0.92, SPRING_DOWN);
      runOnJS(hapticLight)();
    })
    .onEnd(() => {
      'worklet';
      runOnJS(firePress)();
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1, SPRING_UP);
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(400)
    .onStart(() => {
      'worklet';
      scale.value = withSpring(0.88, SPRING_DOWN);
      runOnJS(hapticMedium)();
    })
    .onEnd(() => {
      'worklet';
      runOnJS(fireLong)();
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1, SPRING_UP);
    });

  const composedGesture = Gesture.Exclusive(longPressGesture, tapGesture);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: loading ? 0.5 : 1,
  }));

  const inner = (
    <>
      {loading ? (
        <ActivityIndicator color={isDark ? '#fff' : '#000'} size="small" />
      ) : (
        children
      )}
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
    <GestureHandlerRootView style={{ alignSelf: fullWidth ? 'stretch' : 'auto' }}>
      <GestureDetector gesture={loading ? Gesture.Fling() : composedGesture}>
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
            useNativeLiquidGlass ? (
              /* Pipeline 1: iOS 26+ Liquid Glass Native Node */
              <GlassView
                isInteractive={true}
                colorScheme={isDark ? 'dark' : 'light'}
                glassEffectStyle="regular"
                style={[
                  StyleSheet.absoluteFill,
                  styles.center,
                  {
                    borderRadius: radius,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: isDark
                      ? 'rgba(255,255,255,0.18)'
                      : 'rgba(255,255,255,0.60)',
                  },
                ]}
              >
                {inner}
              </GlassView>
            ) : (
              /* Pipeline 2: iOS < 26 Backwards Compatible Composited Blur */
              <BlurView
                intensity={isDark ? 85 : 72}
                tint={isDark ? 'systemThinMaterialDark' : 'systemThinMaterial'}
                style={[
                  StyleSheet.absoluteFill,
                  styles.center,
                  {
                    borderRadius: radius,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: isDark
                      ? 'rgba(255,255,255,0.18)'
                      : 'rgba(255,255,255,0.60)',
                  },
                ]}
              >
                {inner}
              </BlurView>
            )
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