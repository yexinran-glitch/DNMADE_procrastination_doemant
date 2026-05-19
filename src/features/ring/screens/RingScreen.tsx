import React, { useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Pressable } from 'react-native';
import { useStore } from '../../../store/projectStore';
import { useShallow } from 'zustand/react/shallow';
import { RingCanvas } from '../components/RingCanvas';
import { colors } from '../../../shared/theme/colors';
import { GlassView } from '../../../shared/components/GlassView';
import {
  computeRingRadius,
  RING_CENTER_X,
  RING_CENTER_Y,
} from '../utils/ringGeometry';

export function RingScreen({ navigation }: any) {
  const currentProjectId = useStore((s) => s.currentProjectId);
  const project = useStore(useShallow((s) =>
    currentProjectId ? s.projects[currentProjectId] : null,
  ));
  const ringTasks = useStore(useShallow((s) => s.getRingTasks()));
  const setActiveTask = useStore((s) => s.setActiveTask);

  const hasProject = !!currentProjectId && !!project;

  const handleOutlinePress = () => {
    if (currentProjectId) {
      navigation.navigate('Projects', {
        screen: 'ProjectOutline',
      });
    }
  };

  // Detect tap on ring layers
  const handleRingTap = useCallback(
    (tapX: number, tapY: number) => {
      const dx = tapX - RING_CENTER_X;
      const dy = tapY - RING_CENTER_Y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const RING_HIT_RADIUS = 16;
      const orderedTasks = [...ringTasks].sort(
        (a, b) => (a.ringLayerIndex ?? 0) - (b.ringLayerIndex ?? 0),
      );

      for (const task of orderedTasks) {
        if (task.ringLayerIndex === null) continue;
        const ringR = computeRingRadius(
          task.ringLayerIndex,
          orderedTasks.length,
        );
        if (Math.abs(dist - ringR) <= RING_HIT_RADIUS) {
          setActiveTask(task.id);
          navigation.navigate('TaskRecordingModal', { taskId: task.id });
          return;
        }
      }
    },
    [ringTasks, setActiveTask, navigation],
  );

  return (
    <View style={styles.container}>
      {/* Ring Canvas */}
      {hasProject ? (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={(e) => {
            const { locationX, locationY } = e.nativeEvent;
            handleRingTap(locationX, locationY);
          }}
        >
          <RingCanvas />
        </Pressable>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Project Selected</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to create your first project
          </Text>
        </View>
      )}

      {/* HUD overlay */}
      <View style={styles.hud}>
        <GlassView style={styles.projectNameBadge} borderOpacity={0.08}>
          <Text style={styles.projectName} numberOfLines={1}>
            {project?.name ?? 'Dormant'}
          </Text>
        </GlassView>

        {hasProject && (
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={handleOutlinePress}
            activeOpacity={0.7}
          >
            <GlassView style={styles.outlineGlass} borderOpacity={0.1}>
              <Text style={styles.outlineText}>Outline</Text>
            </GlassView>
          </TouchableOpacity>
        )}
      </View>

      {/* Layer count indicator */}
      {ringTasks.length > 0 && (
        <View style={styles.layerIndicator}>
          <Text style={styles.layerCount}>{ringTasks.length} layers</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: colors.textTertiary,
    fontSize: 15,
    textAlign: 'center',
  },
  hud: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  projectNameBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxWidth: '60%',
  },
  projectName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  outlineButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  outlineGlass: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  outlineText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  layerIndicator: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    backgroundColor: colors.glassBg,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
  },
  layerCount: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
