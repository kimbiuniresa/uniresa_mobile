import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { SearchCriteria } from '@/types/bookings'
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native'

import { DateIcon, LocationPin, PersonIcon, SearchIcon } from '@/assets/icons'
import Button from '@/components/ui/Button'
import { useState } from 'react'
import { DateRangeModal } from '../DatePickerModal'
import { PeoplePickerModal } from '../PeoplePicker'
import { SearchModal } from '../SearchModal'

const StaySearchComponent = ({ initialSearchCriteria }: { initialSearchCriteria: SearchCriteria | undefined }) => {
  const scheme = useColorScheme()
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [peoplePickerVisible, setPeoplePickerVisible] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const isDark = scheme === 'dark';
  const defaultCheckInDates = () => {
      return false;
  }
  const selectedVisitors = () => {
    return "1 Guest 2 children"
  }
  return (
    <>
    <View style={styles.container}>
      
      <ThemedView style={styles.inputButton}>
        <LocationPin width={24} height={24} color={isDark ? 'white' : 'black'} />
        <Pressable onPress={() => setSearchVisible(true)} style={{ flex: 1}}>
          <ThemedText style={styles.inputButtonTextLabel}>DESTINATION OR HOTEL</ThemedText>
          <ThemedText style={styles.inputButtonTextValue}>{initialSearchCriteria?.destination?.city || 'Where are you going?'}</ThemedText>
        </Pressable>
      </ThemedView>
     
      <ThemedView style={styles.inputButton}>
        <DateIcon width={24} height={24} color={isDark ? 'white' : 'black'} />
        <Pressable onPress={() => setDatePickerVisible(true)} style={{ flex: 1}}>
          <ThemedText style={styles.inputButtonTextLabel}>YOUR DATES</ThemedText>
          <ThemedText style={styles.inputButtonTextValue}>{defaultCheckInDates() || 'Select your dates'}</ThemedText>
        </Pressable>
      </ThemedView>
     
     
      <View style={styles.searchButtonRow}>
        
        <ThemedView style={[styles.inputButton, { width: '67%'}]}>
          <PersonIcon width={24} height={24} color={isDark ? 'white' : 'black'} />
          <Pressable onPress={() => setPeoplePickerVisible(true)} style={{ flex: 1}}>
            <ThemedText style={styles.inputButtonTextLabel}>HOW MANY PEOPLE</ThemedText>
            <ThemedText style={styles.inputButtonTextValue}>{selectedVisitors()}</ThemedText>
          </Pressable>
        </ThemedView>
        
        <Button loading={false} onPress={() => console.log('pressing me!!')} btnStyle={styles.ctaBtn}>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flex: 1}}>
            <SearchIcon width={18} height={18} color='#fff' />
            <ThemedText style={{ color: '#fff', fontWeight: 300, }}>Search</ThemedText>
            </View>
        </Button>

      </View>

    </View>
    
    <SearchModal
      visible={searchVisible}
      onClose={() => setSearchVisible(false)}
      value={query}
      onChangeText={setQuery}
    />
    <DateRangeModal
      visible={datePickerVisible}
      onClose={() => setDatePickerVisible(false)}
      onRangeSelected={(startDate, endDate) => {
        console.log('Selected range:', startDate, endDate);
        setDatePickerVisible(false);
      }}
    />
    <PeoplePickerModal
      visible={peoplePickerVisible}
      onClose={() => setPeoplePickerVisible(false)}
      onRangeSelected={(travelingPeople) => {
        console.log('Selected range:', travelingPeople);
      }}
    />
    </>
  )
}


export default StaySearchComponent

const styles = StyleSheet.create({
  container: {
    borderColor: 'orange',
    borderWidth: 3,
    borderRadius: 9,
    width: '100%',
    padding: 5,
    overflow: "hidden",
  },
  inputButton: {
    borderColor: '#c0c0c0ff',
    borderWidth: StyleSheet.hairlineWidth,
    padding: 4,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  inputButtonTextLabel: {
    fontWeight: 300,
    letterSpacing: 1.2,
    fontSize: 13.5
  },
  inputButtonTextValue: {
    fontWeight: 300,
    fontSize: 13
  },
  searchButtonRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: 'center',
  },
  ctaBtn: {
    width: "30%",
    marginTop: -5,
    height: '90%',
    paddingLeft: 0,
  }
})