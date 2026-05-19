import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { useStore } from '../../../store/projectStore';
import { useShallow } from 'zustand/react/shallow';
import { colors } from '../../../shared/theme/colors';
import { GlassView } from '../../../shared/components/GlassView';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import type { StoryId } from '../../../data/models';

export function ProjectOutlineScreen({ navigation }: any) {
  const currentProjectId = useStore((s) => s.currentProjectId);
  const project = useStore(useShallow((s) =>
    currentProjectId ? s.projects[currentProjectId] : null,
  ));
  const stories = useStore(useShallow((s) =>
    currentProjectId ? s.getStoriesForProject(currentProjectId) : [],
  ));
  const createStory = useStore((s) => s.createStory);
  const createTask = useStore((s) => s.createTask);
  const addTaskToRing = useStore((s) => s.addTaskToRing);
  const removeTaskFromRing = useStore((s) => s.removeTaskFromRing);

  const [newStoryName, setNewStoryName] = useState('');
  const [expandedStory, setExpandedStory] = useState<StoryId | null>(null);
  const [newTaskName, setNewTaskName] = useState<Record<StoryId, string>>({});

  const handleCreateStory = () => {
    if (!newStoryName.trim() || !currentProjectId) return;
    const colorIdx = stories.length % colors.ringColors.length;
    createStory(currentProjectId, newStoryName.trim(), colors.ringColors[colorIdx]);
    setNewStoryName('');
  };

  const handleCreateTask = (storyId: StoryId) => {
    const name = newTaskName[storyId]?.trim();
    if (!name) return;
    createTask(storyId, name);
    setNewTaskName((prev) => ({ ...prev, [storyId]: '' }));
  };

  const handleAddToRing = (taskId: string) => {
    addTaskToRing(taskId);
  };

  const handleRemoveFromRing = (taskId: string) => {
    removeTaskFromRing(taskId);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={`${project?.name ?? 'Project'} Outline`}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>

      {/* New Story Input */}
      <GlassView style={styles.inputRow} borderOpacity={0.1}>
        <TextInput
          style={styles.input}
          placeholder="New Story..."
          placeholderTextColor={colors.textTertiary}
          value={newStoryName}
          onChangeText={setNewStoryName}
          onSubmitEditing={handleCreateStory}
        />
        <TouchableOpacity onPress={handleCreateStory} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </GlassView>

      {stories.map((story) => (
        <View key={story.id} style={styles.storySection}>
          <TouchableOpacity
            style={styles.storyHeader}
            onPress={() =>
              setExpandedStory(
                expandedStory === story.id ? null : story.id,
              )
            }
          >
            <View
              style={[styles.storyColorDot, { backgroundColor: story.color }]}
            />
            <Text style={styles.storyName}>{story.name}</Text>
            <Text style={styles.taskCount}>
              {story.taskIds.length} tasks
            </Text>
          </TouchableOpacity>

          {expandedStory === story.id && (
            <View style={styles.taskList}>
              {story.taskIds.map((tid) => {
                const task = useStore.getState().tasks[tid];
                if (!task) return null;
                const isInRing = task.ringLayerIndex !== null;
                return (
                  <View key={task.id} style={styles.taskRow}>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <Text style={styles.taskStatus}>{task.status}</Text>
                    <TouchableOpacity
                      style={[
                        styles.ringBtn,
                        isInRing && styles.ringBtnActive,
                      ]}
                      onPress={() =>
                        isInRing
                          ? handleRemoveFromRing(task.id)
                          : handleAddToRing(task.id)
                      }
                    >
                      <Text
                        style={[
                          styles.ringBtnText,
                          isInRing && styles.ringBtnTextActive,
                        ]}
                      >
                        {isInRing ? 'In Ring' : 'Add to Ring'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
              <View style={styles.newTaskRow}>
                <TextInput
                  style={styles.taskInput}
                  placeholder="New Task..."
                  placeholderTextColor={colors.textTertiary}
                  value={newTaskName[story.id] ?? ''}
                  onChangeText={(t) =>
                    setNewTaskName((prev) => ({ ...prev, [story.id]: t }))
                  }
                  onSubmitEditing={() => handleCreateTask(story.id)}
                />
              </View>
            </View>
          )}
        </View>
      ))}
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
  inputRow: {
    flexDirection: 'row',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    padding: 4,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  addBtnText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  storySection: {
    marginBottom: 12,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.surfaceElevated,
  },
  storyColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  storyName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  taskCount: {
    color: colors.textTertiary,
    fontSize: 13,
  },
  taskList: {
    paddingLeft: 22,
    paddingTop: 8,
    gap: 8,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.glassBg,
  },
  taskName: {
    color: colors.textPrimary,
    fontSize: 14,
    flex: 1,
  },
  taskStatus: {
    color: colors.textTertiary,
    fontSize: 12,
    marginRight: 10,
  },
  ringBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  ringBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  ringBtnText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  ringBtnTextActive: {
    color: colors.textPrimary,
  },
  newTaskRow: {
    marginTop: 4,
  },
  taskInput: {
    color: colors.textPrimary,
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.glassBg,
  },
});
