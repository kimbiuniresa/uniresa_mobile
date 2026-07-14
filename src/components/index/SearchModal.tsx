import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  BackHandler,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChevronLeftIcon } from '@/assets/icons';
import { ThemedView } from '@/components/themed-view';
import IconButton from '../ui/IconButton';

let GlassView: any = null;
let isGlassEffectAPIAvailable: (() => boolean) | null = null;
try {
  const GlassModule = require('expo-glass-effect');
  GlassView = GlassModule.GlassView;
  isGlassEffectAPIAvailable = GlassModule.isGlassEffectAPIAvailable;
} catch (e) {}

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchModal({ visible, onClose, value, onChangeText }: SearchModalProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const inputRef = useRef<TextInput>(null);

  const useNativeLiquidGlass = useMemo(() => {
    if (Platform.OS !== 'ios' || !GlassView || !isGlassEffectAPIAvailable) return false;
    try { return isGlassEffectAPIAvailable(); } catch { return false; }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onBackPress = () => true; 
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClear = useCallback(() => {
    onChangeText('');
    inputRef.current?.focus();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [onChangeText]);

  // Decoupled functional internal input core
  const searchInputContent = (
    <View style={styles.inputInnerContainer}>
      <TextInput
        ref={inputRef}
        style={[
          styles.searchInput,
          { color: isDark ? '#ffffff' : '#000000' }
        ]}
        placeholder="Search here..."
        placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={Keyboard.dismiss}
      />
      {value.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={handleClear}
          activeOpacity={0.5}
        >
          <View style={[styles.clearCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.35)' }]}>
            <Text style={[styles.clearCross, { color: isDark ? '#000000' : '#ffffff' }]}>✕</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      statusBarTranslucent={true} 
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent={true} />

      <ThemedView style={styles.windowContainer}>
        <SafeAreaView style={styles.safeArea} edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}>
          
          <ThemedView style={styles.headerRow}>
            <IconButton onPress={onClose} rounded={true} size={50}>
              <ChevronLeftIcon color={isDark ? '#ffffff' : '#000000'} width={22} height={22} />
            </IconButton>

            <View style={styles.inputWrapper}>
              {Platform.OS === 'ios' ? (
                useNativeLiquidGlass ? (

                  <GlassView
                    isInteractive={false}
                    colorScheme={isDark ? 'dark' : 'light'}
                    glassEffectStyle="clear"
                    style={[styles.glassInputContainer, {
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.45)',
                    }]}
                  >
                    {searchInputContent}
                  </GlassView>
                ) : (
                  <BlurView
                    intensity={isDark ? 75 : 65}
                    tint={isDark ? 'systemThinMaterialDark' : 'systemThinMaterial'}
                    style={[styles.glassInputContainer, {
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.50)',
                    }]}
                  >
                    {searchInputContent}
                  </BlurView>
                )
              ) : (
                <View
                  style={[
                    styles.glassInputContainer,
                    {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    }
                  ]}
                >
                  {searchInputContent}
                </View>
              )}
            </View>
          </ThemedView>

          <Pressable style={styles.dismissalZone} onPress={Keyboard.dismiss} accessible={false}>
            <ThemedView style={styles.resultsBody} />
          </Pressable>

        </SafeAreaView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  windowContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    flex: 1,
    height: 50, 
  },
  glassInputContainer: {
    flex: 1,
    borderRadius: 64,
    overflow: 'hidden',
  },
  inputInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingVertical: 0,
    margin: 0,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif', 
  },
  clearButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearCross: {
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: -1, 
  },
  dismissalZone: {
    flex: 1,
  },
  resultsBody: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});