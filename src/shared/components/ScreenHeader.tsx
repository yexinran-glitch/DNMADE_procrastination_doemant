import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: { label: string; onPress: () => void } | null;
}

export function ScreenHeader({ title, onBack, rightAction }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.6}>
            <Text style={styles.backArrow}>{'<'}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>
        {rightAction && (
          <TouchableOpacity onPress={rightAction.onPress} activeOpacity={0.6}>
            <Text style={styles.rightLabel}>{rightAction.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: 8,
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  backArrow: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '400',
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  right: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightLabel: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
});
