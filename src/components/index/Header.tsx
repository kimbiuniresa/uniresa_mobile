import { Image } from 'expo-image';
import { StyleSheet, useColorScheme } from 'react-native';

import { NotificationIcon } from '@/assets/icons';
import { ThemedView } from '@/components/themed-view';
import IconButton from '../ui/IconButton';
import SearchComponent from './SearchComponent';


export default function Header() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const iconColor = isDark ? '#ffffff' : '#000000';
  
  const logoSource = isDark 
    ? require('@/assets/images/logo.png') 
    : require('@/assets/images/logo-light.png');

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.nameBar}>
        <Image source={logoSource} style={styles.logo} contentFit="contain" />

        <IconButton 
          onPress={() => console.log('Tapped!')}
          onLongPress={() => console.log('Held down notification option menu')}
          badgeCount={7} 
          rounded={true}
          size={42}
        >
          <NotificationIcon color={iconColor} width={22} height={22} />
        </IconButton>
      </ThemedView>
      <SearchComponent />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: '100%',
    backgroundColor: 'transparent',
},
  nameBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  logo: { 
    width: 100, 
    height: 40 
  },
});