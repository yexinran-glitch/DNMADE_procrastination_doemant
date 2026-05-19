import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { colors } from '../theme/colors';

interface WebBlurViewProps extends ViewProps {
  blurType?: 'dark' | 'light';
  blurAmount?: number;
  reducedTransparencyFallbackColor?: string;
}

export function WebBlurView({
  style,
  blurType = 'dark',
  blurAmount = 20,
  reducedTransparencyFallbackColor = colors.surfaceElevated,
  children,
  ...props
}: WebBlurViewProps) {
  return (
    <View
      style={[
        style,
        {
          // @ts-ignore - backdropFilter is a web-only CSS property
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          backgroundColor:
            blurType === 'dark'
              ? 'rgba(0,0,0,0.4)'
              : 'rgba(255,255,255,0.1)',
        } as any,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
