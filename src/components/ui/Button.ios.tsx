import { GlassView } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { PressableScale, PressablesConfig } from 'pressto';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

interface ButtonProps {
  loading?: boolean;
  btnStyle?: any;
  textStyle?: any;
  onPress?: () => void;
  children: React.ReactNode;
}

export default function ButtonIOS({ 
  loading, 
  btnStyle, 
  textStyle, 
  onPress, 
  children 
}: ButtonProps) {

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress();
    }
  };

  return (
    <PressablesConfig
      animationType="spring"
      animationConfig={{ damping: 25, stiffness: 280 }}
      config={{ minScale: 0.96, activeOpacity: 1 }}
    >
      <PressableScale
        onPress={handlePress}
        style={[styles.container, btnStyle]}
      >
        <GlassView 
          isInteractive={true} 
          style={styles.glassWrapper}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={[styles.text, textStyle]}>{children}</Text>
          )}
        </GlassView>
      </PressableScale>
    </PressablesConfig>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#045151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  glassWrapper: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#045151',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.4, 
    textAlign: 'center',
  },
});