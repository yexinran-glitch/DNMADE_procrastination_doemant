import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { colors } from '../theme/colors';

interface GlassViewProps extends ViewProps {
  blurIntensity?: number;
  borderOpacity?: number;
}

export function GlassView({
  style,
  blurIntensity = 20,
  borderOpacity = 0.12,
  children,
  ...props
}: GlassViewProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.blurBg,
          { borderRadius: (style as any)?.borderRadius ?? 0 },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.glassBg },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: `rgba(255,255,255,${borderOpacity})`,
            borderRadius: (style as any)?.borderRadius ?? 0,
          },
        ]}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  blurBg: {
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    backgroundColor: 'rgba(0,0,0,0.35)',
  } as any,
});
