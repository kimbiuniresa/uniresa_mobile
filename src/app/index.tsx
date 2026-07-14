import { StyleSheet, View } from 'react-native';

import CityPropertiesList from '@/components/index/CityPropertiesList';
// import BestDeals from '@/components/index/deals/BestDeals';
import Header from '@/components/index/Header';
import SaveOrShare from '@/components/index/SaveOrShare';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top }} >
        <Header />
        {/* <BestDeals /> */}
        <SaveOrShare />
        {/* <BestDeals /> */}
        <CityPropertiesList />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
      flex: 1,
    }
});
