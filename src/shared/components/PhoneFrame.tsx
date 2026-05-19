import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PHONE_WIDTH, PHONE_HEIGHT } from '../theme/layout';

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.pageBg}>
      <View style={styles.bezel}>
        {/* Notch */}
        <View style={styles.notch} />
        {/* Screen area */}
        <View style={styles.screen}>{children}</View>
        {/* Home indicator */}
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageBg: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  } as any,
  bezel: {
    width: PHONE_WIDTH + 24,
    height: PHONE_HEIGHT + 24,
    borderRadius: 40,
    backgroundColor: '#1c1c1e',
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 20,
    position: 'relative',
  } as any,
  screen: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#000',
  } as any,
  notch: {
    position: 'absolute',
    top: 6,
    width: 120,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    zIndex: 10,
  } as any,
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 130,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#555',
    zIndex: 10,
  } as any,
});
