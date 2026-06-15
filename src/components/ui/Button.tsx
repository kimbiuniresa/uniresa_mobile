import * as Haptics from 'expo-haptics';
import { PressableScale, PressablesConfig } from 'pressto';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function Button({ loading, btnStyle, onPress, children }: { loading?: boolean; btnStyle?: any; onPress?: () => void; children: React.ReactNode }) {

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress();
    }
  }
  
  return (
    <PressablesConfig
      animationType="spring"
      animationConfig={{ damping: 30, stiffness: 200 }}
      config={{ minScale: 0.97, activeOpacity: 0.6 }}
      defaultProps={{ rippleColor: 'transparent' }}
    >
        <PressableScale
          rippleColor="rgba(0, 0, 0, 0.1)"
          onPress={handlePress}
          style={[styles.btn, btnStyle]}
        >
          {
            loading ? (
              <ActivityIndicator color="#EEEDFE" />
            ) : (
              <Text style={styles.text}>{children}</Text>
            )
          }
        </PressableScale>
    </PressablesConfig>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 14,
    backgroundColor: '#045151',
    alignItems: 'center',
    borderRadius: 5,
    width: '90%',
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'OutfitSemiBold',
    marginLeft: 10,
  },
});