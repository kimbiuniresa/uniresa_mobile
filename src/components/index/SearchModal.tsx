import { useEffect, useRef } from 'react';
import { BackHandler, Keyboard, Modal, Platform, Pressable, StatusBar, StyleSheet, TextInput, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChevronLeftIcon } from '@/assets/icons';
import { ThemedView } from '@/components/themed-view';
import IconButton from '../ui/IconButton';

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

  useEffect(() => {
    if (!visible) return;

    const onBackPress = () => {return true}; 
    
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

  const themeBackgroundColor = isDark ? '#121212' : '#ffffff';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      statusBarTranslucent={true} 
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent={true} />

      <ThemedView style={[styles.windowContainer, { backgroundColor: themeBackgroundColor }]}>
        <SafeAreaView style={styles.safeArea} edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}>
          
          <ThemedView style={styles.headerRow}>
            <IconButton onPress={onClose} rounded={true} size={50}>
              <ChevronLeftIcon color={isDark ? '#ffffff' : '#000000'} width={22} height={22} />
            </IconButton>

            <TextInput
              ref={inputRef}
              style={[
                styles.searchInput,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  color: isDark ? '#ffffff' : '#000000',
                }
              ]}
              placeholder="Search here..."
              placeholderTextColor={isDark ? '#888888' : '#666666'}
              value={value}
              onChangeText={onChangeText}
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
            />
          </ThemedView>

          <Pressable style={styles.dismissalZone} onPress={Keyboard.dismiss} accessible={false}>
            <ThemedView style={styles.resultsBody}>
            </ThemedView>
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
  searchInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif', 
  },
  dismissalZone: {
    flex: 1,
  },
  resultsBody: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});