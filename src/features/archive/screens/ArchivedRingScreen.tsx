import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../../../store/projectStore';
import { useShallow } from 'zustand/react/shallow';
import { colors } from '../../../shared/theme/colors';

export function ArchivedRingScreen() {
  const currentProjectId = useStore((s) => s.currentProjectId);
  const project = useStore(useShallow((s) =>
    currentProjectId ? s.projects[currentProjectId] : null,
  ));

  const handleExportSTL = () => {
    // STL export - Phase 5
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{project?.name ?? 'Archived Ring'}</Text>
      <View style={styles.ringPreview}>
        <Text style={styles.placeholder}>Complete Ring View</Text>
        <Text style={styles.subtext}>Phase 5 Implementation</Text>
      </View>
      <TouchableOpacity style={styles.exportBtn} onPress={handleExportSTL}>
        <Text style={styles.exportBtnText}>Export STL for 3D Printing</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  ringPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: colors.textSecondary,
    fontSize: 18,
  },
  subtext: {
    color: colors.textTertiary,
    fontSize: 13,
    marginTop: 8,
  },
  exportBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 40,
  },
  exportBtnText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
