import dayjs, { Dayjs } from 'dayjs';
import { BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Easing, Modal, Platform, Pressable, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '../themed-text';

interface DateRangeModalProps {
  visible: boolean;
  onClose: () => void;
  onRangeSelected: (travelingPeople: TravelingPeopleInterface) => void;
}

interface TravelingPeopleInterface {
    adults: number,
    children: number,
    numberOfRooms: number,
    frequentTraveler?: boolean,
    havePets?: boolean
}

interface DateRangeState {
  startDate: Date | string | Dayjs | null;
  endDate: Date | string | Dayjs | null;
}

export function PeoplePickerModal({ visible, onClose, onRangeSelected }: DateRangeModalProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [range, setRange] = useState<DateRangeState>({
    startDate: dayjs(),
    endDate: dayjs().add(1, 'day'),
  });

  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(0);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const onBackPress = () => {
      handleDismiss();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [visible]);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };


  const sheetTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const isSelectionIncomplete = !range.startDate || !range.endDate;

  const textColor = isDark ? '#ffffff' : '#000000';
  const secondaryTextColor = isDark ? '#aaaaaa' : '#555555';

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={handleDismiss}
    >
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent={true}
      />

      <View style={styles.windowWrapper}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleDismiss}>
          <BlurView intensity={isDark ? 30 : 20} tint={isDark ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, styles.backdropOverlay]} />
        </Pressable>

        <Animated.View style={[ styles.animatedSheet, { transform: [{ translateY: sheetTranslateY }] }]} >
          <ThemedView style={styles.sheetContainer}>
            <View style={styles.headerIndicatorBar}>
              <View style={styles.pillIndicator} />
            </View>


            <View style={styles.headerRow}>
                <ThemedText type="subtitle" style={styles.titleText}>
                Select rooms and guests
                </ThemedText>
            </View>


          </ThemedView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  windowWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  animatedSheet: {
    width: '100%',
    height: '65%', // Locks view ratio exactly to ~60% bounds
  },
  sheetContainer: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 38 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 24,
  },
  headerIndicatorBar: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  pillIndicator: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(128, 128, 128, 0.4)',
  },
  headerRow: {
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  titleText: {
    fontWeight: '400',
    fontSize: 22
  },
});