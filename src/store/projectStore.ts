import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { webStorage } from '../shared/web/webStorage';
import { v4 as uuid } from 'uuid';
import type {
  Project,
  ProjectId,
  Story,
  StoryId,
  Task,
  TaskId,
  TrajectoryPoint,
  EmotionPoint,
} from '../data/models';
import { TaskStatus, ProjectStatus } from '../data/models';

// ---- Storage ----
const storageAdapter = {
  getItem: (key: string) => webStorage.getItem(key),
  setItem: (key: string, value: string) => webStorage.setItem(key, value),
  removeItem: (key: string) => webStorage.removeItem(key),
};

// ---- State shape ----
interface ProjectState {
  projects: Record<ProjectId, Project>;
  stories: Record<StoryId, Story>;
  tasks: Record<TaskId, Task>;
  currentProjectId: ProjectId | null;
  activeTaskId: TaskId | null;

  // Project actions
  createProject: (name: string, color: string) => ProjectId;
  deleteProject: (id: ProjectId) => void;
  archiveProject: (id: ProjectId) => void;
  unarchiveProject: (id: ProjectId) => void;
  setCurrentProject: (id: ProjectId | null) => void;

  // Story actions
  createStory: (projectId: ProjectId, name: string, color: string) => StoryId;
  deleteStory: (id: StoryId) => void;

  // Task actions
  createTask: (storyId: StoryId, name: string) => TaskId;
  deleteTask: (id: TaskId) => void;
  addTaskToRing: (taskId: TaskId) => void;
  removeTaskFromRing: (taskId: TaskId) => void;
  reorderRingLayer: (taskId: TaskId, newIndex: number) => void;

  // Recording actions
  setActiveTask: (taskId: TaskId | null) => void;
  updateTaskStatus: (taskId: TaskId, status: TaskStatus) => void;
  recordEmotion: (taskId: TaskId, x: number, y: number) => void;
  appendTrajectoryPoint: (taskId: TaskId, point: TrajectoryPoint) => void;

  // Computed helpers
  getRingTasks: (projectId?: ProjectId) => Task[];
  getActiveProjects: () => Project[];
  getArchivedProjects: () => Project[];
  getStoriesForProject: (projectId: ProjectId) => Story[];
  getTasksForStory: (storyId: StoryId) => Task[];
}

export const useStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: {},
      stories: {},
      tasks: {},
      currentProjectId: null,
      activeTaskId: null,

      // ---- Project actions ----
      createProject: (name: string, color: string) => {
        const id = uuid();
        set((state) => ({
          projects: {
            ...state.projects,
            [id]: {
              id,
              name,
              color,
              status: ProjectStatus.ACTIVE,
              storyIds: [],
              createdAt: Date.now(),
              archivedAt: null,
            },
          },
          currentProjectId: id,
        }));
        return id;
      },

      deleteProject: (id: ProjectId) => {
        set((state) => {
          const project = state.projects[id];
          if (!project) return state;

          const storyIdsToDelete = project.storyIds;
          const taskIdsToDelete: TaskId[] = [];
          for (const sid of storyIdsToDelete) {
            const story = state.stories[sid];
            if (story) taskIdsToDelete.push(...story.taskIds);
          }

          const newStories = { ...state.stories };
          const newTasks = { ...state.tasks };
          for (const sid of storyIdsToDelete) delete newStories[sid];
          for (const tid of taskIdsToDelete) delete newTasks[tid];

          const newProjects = { ...state.projects };
          delete newProjects[id];

          return {
            projects: newProjects,
            stories: newStories,
            tasks: newTasks,
            currentProjectId:
              state.currentProjectId === id ? null : state.currentProjectId,
          };
        });
      },

      archiveProject: (id: ProjectId) => {
        set((state) => {
          const project = state.projects[id];
          if (!project) return state;
          return {
            projects: {
              ...state.projects,
              [id]: {
                ...project,
                status: ProjectStatus.ARCHIVED,
                archivedAt: Date.now(),
              },
            },
          };
        });
      },

      unarchiveProject: (id: ProjectId) => {
        set((state) => {
          const project = state.projects[id];
          if (!project) return state;
          return {
            projects: {
              ...state.projects,
              [id]: { ...project, status: ProjectStatus.ACTIVE, archivedAt: null },
            },
          };
        });
      },

      setCurrentProject: (id: ProjectId | null) => {
        set({ currentProjectId: id });
      },

      // ---- Story actions ----
      createStory: (projectId: ProjectId, name: string, color: string) => {
        const id = uuid();
        set((state) => ({
          stories: {
            ...state.stories,
            [id]: {
              id,
              projectId,
              name,
              color,
              taskIds: [],
              createdAt: Date.now(),
            },
          },
          projects: {
            ...state.projects,
            [projectId]: {
              ...state.projects[projectId],
              storyIds: [...state.projects[projectId].storyIds, id],
            },
          },
        }));
        return id;
      },

      deleteStory: (id: StoryId) => {
        set((state) => {
          const story = state.stories[id];
          if (!story) return state;

          const newTasks = { ...state.tasks };
          for (const tid of story.taskIds) delete newTasks[tid];

          const newStories = { ...state.stories };
          delete newStories[id];

          return {
            stories: newStories,
            tasks: newTasks,
            projects: {
              ...state.projects,
              [story.projectId]: {
                ...state.projects[story.projectId],
                storyIds: state.projects[story.projectId].storyIds.filter(
                  (sid) => sid !== id,
                ),
              },
            },
          };
        });
      },

      // ---- Task actions ----
      createTask: (storyId: StoryId, name: string) => {
        const id = uuid();
        set((state) => ({
          tasks: {
            ...state.tasks,
            [id]: {
              id,
              storyId,
              name,
              ringLayerIndex: null,
              status: TaskStatus.SMOOTH,
              currentEmotion: { x: 0, y: 0, timestamp: Date.now() },
              emotionHistory: [],
              trajectory: [],
              createdAt: Date.now(),
            },
          },
          stories: {
            ...state.stories,
            [storyId]: {
              ...state.stories[storyId],
              taskIds: [...state.stories[storyId].taskIds, id],
            },
          },
        }));
        return id;
      },

      deleteTask: (id: TaskId) => {
        set((state) => {
          const task = state.tasks[id];
          if (!task) return state;

          const newTasks = { ...state.tasks };
          delete newTasks[id];

          const story = state.stories[task.storyId];
          if (story) {
            return {
              tasks: newTasks,
              stories: {
                ...state.stories,
                [task.storyId]: {
                  ...story,
                  taskIds: story.taskIds.filter((tid) => tid !== id),
                },
              },
            };
          }
          return { tasks: newTasks };
        });
      },

      addTaskToRing: (taskId: TaskId) => {
        set((state) => {
          const task = state.tasks[taskId];
          if (!task) return state;

          // Find next available ring layer index
          const ringTasks = Object.values(state.tasks).filter(
            (t) => t.ringLayerIndex !== null,
          );
          const nextIndex = ringTasks.length;

          return {
            tasks: {
              ...state.tasks,
              [taskId]: { ...task, ringLayerIndex: nextIndex },
            },
          };
        });
      },

      removeTaskFromRing: (taskId: TaskId) => {
        set((state) => {
          const task = state.tasks[taskId];
          if (!task || task.ringLayerIndex === null) return state;

          const removedIndex = task.ringLayerIndex;

          // Shift higher indices down
          const newTasks = { ...state.tasks };
          newTasks[taskId] = { ...task, ringLayerIndex: null };

          for (const [tid, t] of Object.entries(newTasks)) {
            if (
              t.ringLayerIndex !== null &&
              t.ringLayerIndex > removedIndex
            ) {
              newTasks[tid] = { ...t, ringLayerIndex: t.ringLayerIndex - 1 };
            }
          }

          return { tasks: newTasks };
        });
      },

      reorderRingLayer: (taskId: TaskId, newIndex: number) => {
        set((state) => {
          const task = state.tasks[taskId];
          if (!task || task.ringLayerIndex === null) return state;

          const oldIndex = task.ringLayerIndex;
          if (oldIndex === newIndex) return state;

          const newTasks = { ...state.tasks };

          for (const [tid, t] of Object.entries(newTasks)) {
            if (t.ringLayerIndex === null) continue;
            if (tid === taskId) {
              newTasks[tid] = { ...t, ringLayerIndex: newIndex };
            } else if (
              oldIndex < newIndex &&
              t.ringLayerIndex > oldIndex &&
              t.ringLayerIndex <= newIndex
            ) {
              newTasks[tid] = { ...t, ringLayerIndex: t.ringLayerIndex - 1 };
            } else if (
              oldIndex > newIndex &&
              t.ringLayerIndex >= newIndex &&
              t.ringLayerIndex < oldIndex
            ) {
              newTasks[tid] = { ...t, ringLayerIndex: t.ringLayerIndex + 1 };
            }
          }

          return { tasks: newTasks };
        });
      },

      // ---- Recording actions ----
      setActiveTask: (taskId: TaskId | null) => {
        set({ activeTaskId: taskId });
      },

      updateTaskStatus: (taskId: TaskId, status: TaskStatus) => {
        set((state) => {
          const task = state.tasks[taskId];
          if (!task) return state;
          return {
            tasks: {
              ...state.tasks,
              [taskId]: { ...task, status },
            },
          };
        });
      },

      recordEmotion: (taskId: TaskId, x: number, y: number) => {
        set((state) => {
          const task = state.tasks[taskId];
          if (!task) return state;
          const emotionPoint: EmotionPoint = { x, y, timestamp: Date.now() };
          return {
            tasks: {
              ...state.tasks,
              [taskId]: {
                ...task,
                currentEmotion: emotionPoint,
                emotionHistory: [...task.emotionHistory, emotionPoint],
              },
            },
          };
        });
      },

      appendTrajectoryPoint: (taskId: TaskId, point: TrajectoryPoint) => {
        set((state) => {
          const task = state.tasks[taskId];
          if (!task) return state;
          const trajectory = [...task.trajectory, point];
          // Cap at 10000 points
          if (trajectory.length > 10000) {
            // Keep first 20%, evenly sample rest
            const oldestCount = Math.floor(2000);
            const oldest = trajectory.slice(0, oldestCount);
            const rest = trajectory.slice(oldestCount);
            const step = Math.ceil(rest.length / 6000);
            const sampled = rest.filter((_, i) => i % step === 0);
            return {
              tasks: {
                ...state.tasks,
                [taskId]: { ...task, trajectory: [...oldest, ...sampled] },
              },
            };
          }
          return {
            tasks: {
              ...state.tasks,
              [taskId]: { ...task, trajectory },
            },
          };
        });
      },

      // ---- Computed helpers ----
      getRingTasks: (projectId?: ProjectId) => {
        const state = get();
        const pid = projectId ?? state.currentProjectId;
        if (!pid) return [];

        const project = state.projects[pid];
        if (!project) return [];

        const tasks: Task[] = [];
        for (const storyId of project.storyIds) {
          const story = state.stories[storyId];
          if (!story) continue;
          for (const taskId of story.taskIds) {
            const task = state.tasks[taskId];
            if (task && task.ringLayerIndex !== null) {
              tasks.push(task);
            }
          }
        }
        return tasks.sort(
          (a, b) => (a.ringLayerIndex ?? 0) - (b.ringLayerIndex ?? 0),
        );
      },

      getActiveProjects: () => {
        return Object.values(get().projects).filter(
          (p) => p.status === ProjectStatus.ACTIVE,
        );
      },

      getArchivedProjects: () => {
        return Object.values(get().projects).filter(
          (p) => p.status === ProjectStatus.ARCHIVED,
        );
      },

      getStoriesForProject: (projectId: ProjectId) => {
        const state = get();
        const project = state.projects[projectId];
        if (!project) return [];
        return project.storyIds
          .map((sid) => state.stories[sid])
          .filter(Boolean);
      },

      getTasksForStory: (storyId: StoryId) => {
        const state = get();
        const story = state.stories[storyId];
        if (!story) return [];
        return story.taskIds.map((tid) => state.tasks[tid]).filter(Boolean);
      },
    }),
    {
      name: 'dormant-data',
      storage: createJSONStorage(() => storageAdapter),
      partialize: (state) => ({
        projects: state.projects,
        stories: state.stories,
        tasks: state.tasks,
        currentProjectId: state.currentProjectId,
      }),
    },
  ),
);
