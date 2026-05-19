import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../shared/theme/colors';

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Ring: { active: '◉', inactive: '○' },
  Projects: { active: '◼', inactive: '◻' },
  Identity: { active: '◆', inactive: '◇' },
  Profile: { active: '●', inactive: '○' },
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View
        style={[StyleSheet.absoluteFill, styles.blurBg]}
      />
      <View style={styles.container}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];

          // Center button special handling
          if (index === 2) {
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.centerButton}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('NewProjectModal');
                }}
              >
                <View
                  style={[styles.centerButtonGradient, styles.centerBlurBg]}
                />
                <Text style={{ color: colors.textPrimary, fontSize: 28 }}>+</Text>
              </TouchableOpacity>
            );
          }

          const isFocused = state.index === index;
          const iconConfig = TAB_ICONS[route.name];
          const iconName = iconConfig
            ? isFocused
              ? iconConfig.active
              : iconConfig.inactive
            : 'ellipse-outline';

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            >
              <Text
                style={{
                  color: isFocused ? colors.accentLight : colors.textSecondary,
                  fontSize: 22,
                }}
              >
                {iconName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    paddingBottom: 20,
  },
  blurBg: {
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    backgroundColor: 'rgba(0,0,0,0.45)',
  } as any,
  container: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  centerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginTop: -8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
  },
  centerButtonGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  centerBlurBg: {
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(0,0,0,0.35)',
  } as any,
});
