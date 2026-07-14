import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


import Header from '@/components/index/Header'
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme'

export default function bookings() {
  return (
    <SafeAreaView>
      <Text>Bookings</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
})