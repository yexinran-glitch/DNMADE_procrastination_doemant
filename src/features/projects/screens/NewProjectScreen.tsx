import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useStore } from '../../../store/projectStore';
import { colors } from '../../../shared/theme/colors';
import { GlassView } from '../../../shared/components/GlassView';

const RING_COLORS = colors.ringColors;

export function NewProjectScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(RING_COLORS[0]);
  const createProject = useStore((s) => s.createProject);

  const handleCreate = () => {
    if (!name.trim()) return;
    createProject(name.trim(), selectedColor);
    // Also create first default story
    const state = useStore.getState();
    const projectId = state.currentProjectId;
    if (projectId) {
      state.createStory(projectId, 'Default Story', selectedColor);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View
        style={[StyleSheet.absoluteFill, styles.modalBlurBg]}
      />

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeText}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.title}>New Project</Text>

        <GlassView style={styles.inputContainer} borderOpacity={0.1}>
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            placeholderTextColor={colors.textTertiary}
            value={name}
            onChangeText={setName}
            autoFocus
          />
        </GlassView>

        <Text style={styles.label}>Color</Text>
        <View style={styles.colorRow}>
          {RING_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setSelectedColor(color)}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.colorOptionSelected,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.createButton,
            !name.trim() && styles.createButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={!name.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>Create Project</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalBlurBg: {
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  } as any,
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 24,
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 32,
  },
  inputContainer: {
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: colors.textPrimary,
  },
  createButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.4,
  },
  createButtonText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
});
