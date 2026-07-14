import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { PressableScale } from 'pressto'
import { useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native'

const { width: SW } = Dimensions.get('window')
const CARD_W = SW * 0.62
const CARD_H = CARD_W * 1.28
const CARD_GAP = 14

const TEAL = '#047575'
const TEAL_LIGHT = 'rgba(4,117,117,0.18)'

const trendingDestinations = [
  {
    id: 1001,
    place: 'Yaoundé',
    label: 'CAPITALE',
    location: {
      city: 'Yaoundé',
      district: 'Mfoundi',
      region: 'Centre',
      country: 'Cameroun',
      latitude: 3.848,
      longitude: 11.5021,
    },
    cityImage: require('../../assets/images/yaounde.jpg'),
    description: 'Capitale politique du Cameroun',
  },
  {
    id: 1002,
    place: 'Douala',
    label: 'ÉCONOMIQUE',
    location: {
      city: 'Douala',
      district: 'Wouri',
      region: 'Littoral',
      country: 'Cameroun',
      latitude: 4.0511,
      longitude: 9.7679,
    },
    cityImage: require('../../assets/images/diedo.webp'),
    description: 'Capitale économique du Cameroun',
  },
  {
    id: 1003,
    place: 'Limbe',
    label: 'VOLCANIQUE',
    location: {
      city: 'Limbe',
      district: 'Fako',
      region: 'Sud-Ouest',
      country: 'Cameroun',
      latitude: 4.0127,
      longitude: 9.2018,
    },
    cityImage: require('../../assets/images/limbe.avif'),
    description: 'Plages de sable noir volcanique',
  },
  {
    id: 1004,
    place: 'Foumban',
    label: 'ROYAL',
    location: {
      city: 'Foumban',
      district: 'Noun',
      region: 'Ouest',
      country: 'Cameroun',
      latitude: 5.7167,
      longitude: 10.9,
    },
    cityImage: require('../../assets/images/foumban.jpg'),
    description: 'Cité royale et centre artistique',
  },
  {
    id: 1005,
    place: 'Kribi',
    label: 'BALNÉAIRE',
    emoji: '🏖',
    location: {
      city: 'Kribi',
      district: "Océan",
      region: 'Sud',
      country: 'Cameroun',
      latitude: 2.9397,
      longitude: 9.9088,
    },
    cityImage: require('../../assets/images/kribi.jpeg'),
    description: 'Station balnéaire aux plages magnifiques',
  },
  {
    id: 1006,
    place: 'Bafoussam',
    label: 'MONTAGNES',
    location: {
      city: 'Bafoussam',
      district: 'Mifi',
      region: 'Ouest',
      country: 'Cameroun',
      latitude: 5.4737,
      longitude: 10.4175,
    },
    cityImage: require('../../assets/images/bafoussam.jpg'),
    description: "Ville des hauts plateaux de l'Ouest",
  },
  {
    id: 1007,
    place: 'Bamenda',
    label: 'CULTUREL',
    location: {
      city: 'Bamenda',
      district: 'Mezam',
      region: 'Nord-Ouest',
      country: 'Cameroun',
      latitude: 5.9597,
      longitude: 10.1459,
    },
    cityImage: require('../../assets/images/bamenda.jpg'),
    description: 'Centre culturel du Nord-Ouest',
  },
]

type Destination = (typeof trendingDestinations)[number]

// ─── Glass pill — uses BlurView on iOS 26 / expo-blur, fallback on Android ───
function GlassPill({ children, style }: { children: React.ReactNode; style?: object }) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={55}
        tint="dark"
        style={[styles.glassPill, style]}
      >
        {children}
      </BlurView>
    )
  }
  // Android fallback — semi-transparent dark
  return (
    <View style={[styles.glassPill, styles.glassPillAndroid, style]}>
      {children}
    </View>
  )
}

function GlassCard({ children, style }: { children: React.ReactNode; style?: object }) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={70}
        tint="dark"
        style={[styles.glassCard, style]}
      >
        {children}
      </BlurView>
    )
  }
  return (
    <View style={[styles.glassCard, styles.glassCardAndroid, style]}>
      {children}
    </View>
  )
}

// ─── Single destination card ─────────────────────────────────────────────────
function DestinationCard({
  item,
  loadingId,
  onPress,
}: {
  item: Destination
  loadingId: number | null
  onPress: (item: Destination) => void
}) {
  const isLoading = loadingId === item.id

  return (
    <PressableScale style={styles.card} onPress={() => onPress(item)}>
      <Image source={item.cityImage} style={StyleSheet.absoluteFill} contentFit="cover" />

      <View style={styles.topRow}>
        <GlassPill>
          <Text style={styles.labelEmoji}>{item.emoji}</Text>
          <Text style={styles.labelText}>{item.label}</Text>
        </GlassPill>
      </View>

      <View style={styles.bottomContent}>
        <Text style={styles.cityName}>{item.location.city}</Text>

        <View style={styles.regionRow}>
          <View style={styles.regionDot} />
          <Text style={styles.regionText}>
            {item.location.region} · {item.location.country}
          </Text>
        </View>

        <GlassCard style={styles.ctaCard}>
          <View style={styles.ctaInner}>
            <View style={styles.ctaLeft}>
              <Text style={styles.ctaDistrict}>{item.location.district}</Text>
              <Text style={styles.ctaDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>

            {/* Arrow / loader */}
            <View style={[styles.ctaArrow, isLoading && styles.ctaArrowLoading]}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.ctaArrowText}>→</Text>
              )}
            </View>
          </View>
        </GlassCard>
      </View>
    </PressableScale>
  )
}

// ─── List ────────────────────────────────────────────────────────────────────
export default function CityPropertiesList() {
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const handlePress = (item: Destination) => {
    setLoadingId(item.id)
    // navigate / fetch here
    setTimeout(() => setLoadingId(null), 1500) // placeholder
  }

  return (
    <FlatList
      data={trendingDestinations}
      keyExtractor={item => String(item.id)}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
      snapToInterval={CARD_W + CARD_GAP}
      decelerationRate="fast"
      snapToAlignment="start"
      renderItem={({ item }) => (
        <DestinationCard
          item={item}
          loadingId={loadingId}
          onPress={handlePress}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#111',
  },

  topRow: {
    position: 'absolute',
    top: 16,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  glassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.22)',
    gap: 5,
  },
  glassPillAndroid: {
    backgroundColor: 'rgba(0,0,0,0.48)',
  },
  labelEmoji: {
    fontSize: 11,
  },
  labelText: {
    fontSize: 10,
    fontFamily: 'OutfitSemiBold',
    color: '#fff',
    letterSpacing: 0.6,
  },
  saveBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  saveIcon: {
    fontSize: 15,
    color: '#fff',
  },

  // Bottom content
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  cityName: {
    fontSize: 36,
    fontFamily: 'OutfitSemiBold',
    color: '#fff',
    lineHeight: 40,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  regionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TEAL,
  },
  regionText: {
    fontSize: 13,
    fontFamily: 'Outfit',
    color: 'rgba(255,255,255,0.82)',
  },

  glassCard: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  glassCardAndroid: {
    backgroundColor: 'rgba(0,0,0,0.58)',
  },
  ctaCard: {
  },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 12,
  },
  ctaLeft: {
    flex: 1,
    gap: 3,
  },
  ctaDistrict: {
    fontSize: 11,
    fontFamily: 'OutfitSemiBold',
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ctaDescription: {
    fontSize: 13,
    fontFamily: 'Outfit',
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 18,
  },
  ctaArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ctaArrowLoading: {
    backgroundColor: 'rgba(4,117,117,0.6)',
  },
  ctaArrowText: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 20,
  },
})