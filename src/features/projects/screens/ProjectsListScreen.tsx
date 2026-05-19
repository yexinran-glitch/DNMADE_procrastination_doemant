import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../../../store/projectStore';
import { useShallow } from 'zustand/react/shallow';
import { colors } from '../../../shared/theme/colors';
import { GlassView } from '../../../shared/components/GlassView';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import type { Project } from '../../../data/models';
import { ProjectStatus } from '../../../data/models';

export function ProjectsListScreen({ navigation }: any) {
  const activeProjects = useStore(useShallow((s) => s.getActiveProjects()));
  const archivedProjects = useStore(useShallow((s) => s.getArchivedProjects()));
  const setCurrentProject = useStore((s) => s.setCurrentProject);

  const handleProjectPress = (project: Project) => {
    setCurrentProject(project.id);
    navigation.navigate('RingDetail');
  };

  const handleArchivedPress = (project: Project) => {
    setCurrentProject(project.id);
    navigation.navigate('ArchivedRing');
  };

  const renderProject = (
    project: Project,
    isArchived: boolean,
  ) => (
    <TouchableOpacity
      key={project.id}
      activeOpacity={0.7}
      onPress={() =>
        isArchived ? handleArchivedPress(project) : handleProjectPress(project)
      }
    >
      <GlassView style={styles.card} borderOpacity={0.1}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View
              style={[styles.colorDot, { backgroundColor: project.color }]}
            />
            <Text style={styles.cardTitle}>{project.name}</Text>
          </View>
          {isArchived && (
            <Text style={styles.archivedBadge}>Archived</Text>
          )}
        </View>
      </GlassView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Projects"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Active</Text>
        {activeProjects.length === 0 ? (
          <Text style={styles.empty}>No active projects</Text>
        ) : (
          activeProjects.map((p) => renderProject(p, false))
        )}

        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Archived</Text>
        {archivedProjects.length === 0 ? (
          <Text style={styles.empty}>No archived projects</Text>
        ) : (
          archivedProjects.map((p) => renderProject(p, true))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  empty: {
    color: colors.textTertiary,
    fontSize: 15,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    marginBottom: 10,
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  archivedBadge: {
    color: colors.textTertiary,
    fontSize: 13,
  },
});
