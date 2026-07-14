import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
export const CARD_WIDTH = SCREEN_WIDTH * 0.62

const TEAL = '#047575'
const TEAL_DARK = '#034f4f'

interface RoomType {
  pricePerNight?: number
  currency?: string
}

export interface AccommodationProperty {
  propertyId: string
  propertyName: string
  propertyType: string
  propertyImages: string[]
  reviewsRating?: number
  numberOfReviews: number
  numberOfStars: number
  location: { city?: string; district?: string }
  roomTypes: RoomType[]
  isSponsored?: boolean
  sponsorshipCategory?: string
  tagMessage?: string
  distanceFromCityCenter?: number
  cancellationPolicy?: string
}

function getLowestPrice(roomTypes: RoomType[]): number | null {
  if (!roomTypes?.length) return null
  const prices = roomTypes
    .map(r => r.pricePerNight)
    .filter((p): p is number => typeof p === 'number')
  return prices.length ? Math.min(...prices) : null
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0,
  }).format(price)
}

function renderStars(count: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Text key={i} style={i < count ? styles.starFilled : styles.starEmpty}>
      ★
    </Text>
  ))
}

export default function PropertyCard({ property }: { property: AccommodationProperty }) {
  const price = getLowestPrice(property.roomTypes)
  const rating = property.reviewsRating ?? 0
  const imageUri = property.propertyImages?.[0]
  const freeCancellation = property.cancellationPolicy?.toLowerCase().includes('annulation')

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.92}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderIcon}>🏨</Text>
          </View>
        )}

        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{property.propertyType}</Text>
        </View>

        {/* Bottom: distance chip */}
        {!!property.distanceFromCityCenter && (
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceBadgeText}>
              {property.distanceFromCityCenter} km du centre
            </Text>
          </View>
        )}
      </View>

      {/* Body */}
      <View style={styles.body}>

        {/* {!!property.tagMessage && (
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText} numberOfLines={1}>
              {property.tagMessage}
            </Text>
          </View>
        )} */}

        <Text style={styles.name} numberOfLines={1}>
          {property.propertyName}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          {[property.location?.district, property.location?.city]
            .filter(Boolean)
            .join(', ')}
        </Text>

        {/* Stars + review count */}
        <View style={styles.starsRow}>
          <View style={styles.starsGroup}>
            {renderStars(property.numberOfStars)}
          </View>
          <Text style={styles.reviewCount}>
            {property.numberOfReviews > 0
              ? `${property.numberOfReviews} avis`
              : 'Nouveau'}
          </Text>
        </View>

        {/* Rating score — only if exists */}
        {rating > 0 && (
          <View style={styles.ratingChip}>
            <Text style={styles.ratingChipText}>{rating.toFixed(1)}</Text>
            <Text style={styles.ratingLabel}> Très bien</Text>
          </View>
        )}

        {/* Free cancellation badge */}
        {freeCancellation && (
          <Text style={styles.freeCancelText}>✓ Annulation gratuite</Text>
        )}

        {/* Price row — static placeholder until you wire it */}
        <View style={styles.priceRow}>
          {price !== null ? (
            <>
              <Text style={styles.price}>{formatPrice(price)}</Text>
              <Text style={styles.perNight}> / nuit</Text>
            </>
          ) : (
            <>
              <Text style={styles.priceStatic}>25 000 XAF</Text>
              <Text style={styles.priceStaticStrike}> 30 000</Text>
              <Text style={styles.perNight}> / nuit</Text>
            </>
          )}
        </View>

      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    // borderColor: 'orange',
    // borderWidth: 5
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: '#e8f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: { fontSize: 32 },

  typeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(4, 117, 117, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: 'OutfitSemiBold',
    color: '#fff',
  },

  distanceBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.48)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  distanceBadgeText: {
    fontSize: 9,
    color: '#fff',
    fontFamily: 'Outfit',
  },

  body: {
    padding: 12,
    gap: 5,
  },

  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#e6f4f4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  tagPillText: {
    fontSize: 9,
    fontFamily: 'Outfit',
    color: TEAL_DARK,
    maxWidth: CARD_WIDTH - 48,
  },

  name: {
    fontSize: 14,
    fontFamily: 'OutfitSemiBold',
    color: '#0f1a1a',
  },
  location: {
    fontSize: 12,
    fontFamily: 'Outfit',
    color: '#7a8c8c',
  },

  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  starsGroup: {
    flexDirection: 'row',
    gap: 1,
  },
  starFilled: { fontSize: 11, color: '#f5a623' },
  starEmpty:  { fontSize: 11, color: '#ddd' },
  reviewCount: {
    fontSize: 11,
    fontFamily: 'Outfit',
    color: '#9aabab',
  },

  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: TEAL,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingChipText: {
    fontSize: 11,
    fontFamily: 'OutfitSemiBold',
    color: '#fff',
  },
  ratingLabel: {
    fontSize: 10,
    fontFamily: 'Outfit',
    color: 'rgba(255,255,255,0.85)',
  },

  freeCancelText: {
    fontSize: 10,
    fontFamily: 'Outfit',
    color: '#2e7d32',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontFamily: 'OutfitSemiBold',
    color: TEAL,
  },
  priceStatic: {
    fontSize: 15,
    fontFamily: 'OutfitSemiBold',
    color: TEAL,
  },
  priceStaticStrike: {
    fontSize: 12,
    fontFamily: 'Outfit',
    color: '#bbb',
    textDecorationLine: 'line-through',
  },
  perNight: {
    fontSize: 11,
    fontFamily: 'Outfit',
    color: '#9aabab',
  },
})
