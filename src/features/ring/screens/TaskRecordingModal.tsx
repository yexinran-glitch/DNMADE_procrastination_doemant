import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../../../store/projectStore';
import { colors } from '../../../shared/theme/colors';
import { statusColors, statusLabels } from '../../../shared/theme/colors';
import { TaskStatus } from '../../../data/models';

// Phase 4 will add full StatusPicker + EmotionGrid here
// For now, placeholder with close button

export function TaskRecordingModal({ navigation, route }: any) {
  const { taskId } = route.params ?? {};
  const task = useStore((s) => (taskId ? s.tasks[taskId] : null));
  const updateTaskStatus = useStore((s) => s.updateTaskStatus);
  const recordEmotion = useStore((s) => s.recordEmotion);

  const handleStatusSelect = (status: TaskStatus) => {
    if (taskId) updateTaskStatus(taskId, status);
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <View style={[StyleSheet.absoluteFill, styles.modalBlurBg]} />
        <Text style={styles.headerTitle}>Task not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFill, styles.modalBlurBg]} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{task.name}</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Status Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Task Status</Text>
        <View style={styles.statusRow}>
          {Object.values(TaskStatus).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusPill,
                task.status === status && {
                  backgroundColor: statusColors[status] + '30',
                  borderColor: statusColors[status],
                },
              ]}
              onPress={() => handleStatusSelect(status)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.statusText,
                  task.status === status && {
                    color: statusColors[status],
                  },
                ]}
              >
                {statusLabels[status]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Emotion Section (placeholder for Phase 4) */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Emotion</Text>
        <View style={styles.emotionPlaceholder}>
          <Text style={styles.placeholderText}>
            Emotion Grid — Phase 4
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  modalBlurBg: {
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  } as any,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassBg,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  emotionPlaceholder: {
    height: 200,
    borderRadius: 16,
    backgroundColor: colors.glassBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.textTertiary,
    fontSize: 14,
  },
});
