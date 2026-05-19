import React, { useCallback } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useStore } from '../../../store/projectStore';
import { useShallow } from 'zustand/react/shallow';
import { RingCanvas } from '../components/RingCanvas';
import { colors } from '../../../shared/theme/colors';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { TaskStatus } from '../../../data/models';
import {
  computeRingRadius,
  RING_CENTER_X,
  RING_CENTER_Y,
} from '../utils/ringGeometry';

export function RingDetailScreen({ navigation }: any) {
  const currentProjectId = useStore((s) => s.currentProjectId);
  const project = useStore(useShallow((s) =>
    currentProjectId ? s.projects[currentProjectId] : null,
  ));
  const ringTasks = useStore(useShallow((s) => s.getRingTasks()));
  const setActiveTask = useStore((s) => s.setActiveTask);

  const orderedTasks = [...ringTasks].sort(
    (a, b) => (a.ringLayerIndex ?? 0) - (b.ringLayerIndex ?? 0),
  );

  const handleRingTap = useCallback(
    (tapX: number, tapY: number) => {
      const dx = tapX - RING_CENTER_X;
      const dy = tapY - RING_CENTER_Y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const RING_HIT_RADIUS = 16;

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
    [orderedTasks, setActiveTask, navigation],
  );

  const hasTasks = orderedTasks.length > 0;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={project?.name ?? 'Ring'}
        onBack={() => navigation.goBack()}
      />

      {/* Ring canvas or empty state */}
      {hasTasks ? (
        <Pressable
          style={styles.ringArea}
          onPress={(e) => {
            const { locationX, locationY } = e.nativeEvent;
            handleRingTap(locationX, locationY);
          }}
        >
          <RingCanvas />
        </Pressable>
      ) : (
        <View style={styles.emptyArea} />
      )}

      {/* Status marker overlay for Frame 21 */}
      {hasTasks && (
        <View style={styles.statusOverlay} pointerEvents="none">
          {orderedTasks.map((task) => {
            if (task.ringLayerIndex === null) return null;
            const ringR = computeRingRadius(task.ringLayerIndex, orderedTasks.length);
            // Position markers at left side (angle = PI, where pen is)
            const x = RING_CENTER_X + ringR * Math.cos(Math.PI);
            const y = RING_CENTER_Y + ringR * Math.sin(Math.PI);
            const color =
              task.status === TaskStatus.TOTALLY_STUCK
                ? colors.statusStuck
                : task.status === TaskStatus.DONE
                  ? colors.statusDone
                  : null;
            if (!color) return null;
            return (
              <View
                key={task.id}
                style={[
                  styles.statusDot,
                  {
                    left: x - 4,
                    top: y - 4,
                    backgroundColor: color,
                  },
                ]}
              />
            );
          })}
        </View>
      )}

      {/* Layer count indicator */}
      {hasTasks && (
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
  ringArea: {
    flex: 1,
  },
  emptyArea: {
    flex: 1,
  },
  statusOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  statusDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  layerIndicator: {
    position: 'absolute',
    bottom: 100,
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
