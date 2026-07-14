import { BlurView } from 'expo-blur'
import { Platform, Pressable, Share, StyleSheet, Text, useColorScheme, View, } from 'react-native'
import SignupSVG from '../../assets/svg/signup.svg'
import { ThemedText } from '../themed-text'

const TEAL = '#047575'
const TEAL_DARK = '#034f4f'
const TEAL_LIGHT = '#68ababff'

const getReferralCode = (_userId: string): string | null => null

function GlassCard({ children, style }: { children: React.ReactNode; style?: object }) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={18} tint="default" style={[styles.card, style]}>
        {children}
      </BlurView>
    )
  }
  return <View style={[styles.card, style]}>{children}</View>
}

function SignInCard() {
  const scheme = useColorScheme() ?? 'light'
  const isDark = scheme === 'dark'

  return (
    <GlassCard style={isDark ? styles.cardDark : styles.cardLight}>
      <View style={styles.row}>
        <View style={styles.textBlock}>
          <ThemedText style={[styles.title]}>
            Économisez plus
          </ThemedText>
          <ThemedText style={[styles.body]}>
            Profitez de 10% de réduction ou plus dans les établissements participants avec un
            compte Uniresa gratuit.
          </ThemedText>
          {/* <Button btnStyle={styles.btn}>Se connecter</Button> */}
        </View>

        <View style={styles.accentBlock}>
          <SignupSVG width={140} />
        </View>
      </View>
    </GlassCard>
  )
}

function ReferralCard({ userId }: { userId: string }) {
  const scheme = useColorScheme() ?? 'light'
  const isDark = scheme === 'dark'
  const referralCode = getReferralCode(userId)
  const hasCode = !!referralCode

  const handleShare = async () => {
    if (!referralCode) return
    try {
      await Share.share({
        message: `Réserve ton hébergement avec Uniresa ! Utilise mon code de parrainage ${referralCode} pour obtenir une réduction. https://link.uniresa.com/r/${referralCode}`,
        url: `https://uniresa.com/r/${referralCode}`, 
      })
    } catch (e) {
      console.warn("Share dismissed: ", e)
    }
  }

  const handleCreateReferral = () => {
    // TODO: navigate to referral creation screen
  }

  return (
    <GlassCard style={{backgroundColor: "#088787", borderWidth: 0, borderColor: "#088787"}}>
      <Pressable style={[styles.row]} onPress={hasCode ? handleShare : handleCreateReferral}>
        <View style={styles.textBlock}>
          <Text style={[styles.title, {color: "#fff"}]}>
            {hasCode ? 'Parrainez un ami' : 'Créez votre lien'}
          </Text>
          <Text style={[styles.body, {color: "#fff"}]}>
            {hasCode
              ? `Partagez votre code et gagnez des réductions à chaque réservation de votre filleul.`
              : `Créez votre lien de parrainage et commencez à gagner des récompenses.`}
          </Text>

          {hasCode && (
            <View style={[styles.codePill, isDark && styles.codePillDark]}>
              <Text style={styles.codeText}>{referralCode}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </GlassCard>
  )
}

export default function SaveOrShare() {
  const user = false

  if (user) {
    return <ReferralCard userId={user} />
  }
  return <SignInCard />
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardLight: {
    borderColor: 'rgba(4,117,117,0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  cardDark: {
    borderColor: 'rgba(4,117,117,0.25)',
    backgroundColor: 'rgba(3,79,79,0.25)',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 12,
  },

  textBlock: {
    flex: 1,
    gap: 6,
  },

  title: {
    fontSize: 15,
    fontFamily: 'OutfitSemiBold',
  },
  titleLight: { color: TEAL_DARK },
  titleDark:  { color: '#9dd8d8' },

  body: {
    fontSize: 12,
    fontFamily: 'Outfit',
    lineHeight: 17,
  },
  bodyLight: { color: '#4a6a6a' },
  bodyDark:  { color: 'rgba(200,230,230,0.75)' },

  codePill: {
    alignSelf: 'flex-start',
    backgroundColor: TEAL_LIGHT,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 2,
  },
  codePillDark: {
    backgroundColor: 'rgba(4,117,117,0.3)',
  },
  codeText: {
    fontSize: 13,
    fontFamily: 'OutfitSemiBold',
    color: TEAL,
    letterSpacing: 1.2,
  },

  btn: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: "auto"
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: TEAL,
  },
  btnText: {
    fontSize: 13,
    fontFamily: 'OutfitSemiBold',
    color: '#fff',
  },
  btnTextOutline: {
    color: TEAL,
  },

  accentBlock: {
    height: 52,
    width: '35%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  accentCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: TEAL,
    opacity: 0.18,
    position: 'absolute',
  },
  accentCircleSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: TEAL,
    opacity: 0.22,
  },
})