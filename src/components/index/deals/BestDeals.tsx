import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import PropertyCard, {
    AccommodationProperty,
    CARD_WIDTH,
} from './PropertyCard'

const TEAL = '#047575'
const TEAL_LIGHT = '#e6f4f4'
const TEAL_DARK = '#034f4f'
const CARD_GAP = 14

export default function BestDeals() {
  const [properties, setProperties] = useState<AccommodationProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch(
          'https://backenddev-jnj53zn5ba-ew.a.run.app/api/accommodation/getSearchedAccommodations?destination[city]=Yaounde&destination[district]=Mfoundi&destination[region]=Centre&destination[postalCode]=&destination[country]=Cameroun&destination[latitude]=3.83989&destination[longitude]=11.568026&checkInDate=2026-06-25T23:00:00.000Z&checkOutDate=2026-06-27T23:00:00.000Z&guests[adults]=1&guests[children]=0&minGuests=1&minRooms=1&limit=10'
        )
        const data = await response.json()
        setProperties(data?.data ?? data ?? [])
      } catch {
        setError('Impossible de charger les hébergements.')
      } finally {
        setLoading(false)
      }
    }
    fetchAccommodations()
  }, [])

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Offres incroyables</Text>
          <Text style={styles.subtitle}>Les meilleurs hébergements à Yaoundé</Text>
        </View>
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={TEAL} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_GAP}
          snapToAlignment="start"
        >
          {properties.map(property => (
            <PropertyCard key={property.propertyId} property={property} />
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // NO flex:1 here — lets it size to content height
    width: '100%',
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontFamily: 'OutfitSemiBold',
    color: '#0f1a1a',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Outfit',
    color: '#6b7b7b',
    marginTop: 2,
  },
  seeAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: TEAL_LIGHT,
  },
  seeAllText: {
    fontSize: 12,
    fontFamily: 'OutfitSemiBold',
    color: TEAL_DARK,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: CARD_GAP,
  },
  center: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Outfit',
    color: '#c0392b',
    textAlign: 'center',
  },
})