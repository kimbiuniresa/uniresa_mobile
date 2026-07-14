import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { GlassContainer } from 'expo-glass-effect';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme ?? 'light'];

  return (
    <GlassContainer style={{flex: 1, backgroundColor: 'transparent'}}>
      <NativeTabs
        backgroundColor="transparent"
        indicatorColor={colors.backgroundElement}
        iconColor="#079494"
        labelStyle={{ selected: { color: '#079494' } }}>

        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'house', selected: 'house.fill' }}
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="saved">
          <NativeTabs.Trigger.Label>Saved</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'heart', selected: 'heart.fill' }}
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="bookings">
          <NativeTabs.Trigger.Label>Bookings</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'calendar', selected: 'calendar.badge.checkmark' }}
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="profile">
          <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'person', selected: 'person.fill' }}
          />
        </NativeTabs.Trigger>

      </NativeTabs>
    </GlassContainer>
  );
}