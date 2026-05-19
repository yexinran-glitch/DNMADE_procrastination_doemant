// ---- Identifiers ----
export type ProjectId = string;
export type StoryId = string;
export type TaskId = string;

// ---- Enums ----
export enum TaskStatus {
  SMOOTH = 'smooth',
  PROCRASTINATE = 'procrastinate',
  TOTALLY_STUCK = 'totally_stuck',
  DONE = 'done',
}

export enum ProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

// ---- Emotion ----
export interface EmotionPoint {
  x: number; // -1 (calm) to +1 (anxious)
  y: number; // +1 (motivated) to -1 (unmotivated)
  timestamp: number;
}

// ---- Trajectory ----
export interface TrajectoryPoint {
  angle: number; // 0 to 2*PI, ring-local angular position
  radiusOffset: number; // pixels, deviation from base ring radius (wave)
  thickness: number; // pixels, line width (from status)
  timestamp: number;
}

// ---- Task (one ring layer) ----
export interface Task {
  id: TaskId;
  storyId: StoryId;
  name: string;
  ringLayerIndex: number | null; // null = not yet added to ring
  status: TaskStatus;
  currentEmotion: EmotionPoint;
  emotionHistory: EmotionPoint[];
  trajectory: TrajectoryPoint[];
  createdAt: number;
}

// ---- Story (groups tasks, has a color) ----
export interface Story {
  id: StoryId;
  projectId: ProjectId;
  name: string;
  color: string;
  taskIds: TaskId[];
  createdAt: number;
}

// ---- Project ----
export interface Project {
  id: ProjectId;
  name: string;
  color: string;
  status: ProjectStatus;
  storyIds: StoryId[];
  createdAt: number;
  archivedAt: number | null;
}
