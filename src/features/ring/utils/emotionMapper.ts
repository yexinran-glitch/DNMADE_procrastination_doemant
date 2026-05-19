import type { EmotionPoint } from '../../../data/models';
import { TaskStatus } from '../../../data/models';

// Maximum wave amplitude in pixels
const MAX_WAVE_AMPLITUDE = 12;

// Status to trajectory thickness mapping
export const STATUS_THICKNESS: Record<string, number> = {
  [TaskStatus.SMOOTH]: 1.5,
  [TaskStatus.PROCRASTINATE]: 4.0,
  [TaskStatus.TOTALLY_STUCK]: 6.0,
  [TaskStatus.DONE]: 0,
};

/**
 * Map an emotion point to wave parameters (amplitude + phase).
 * - Distance from center = emotional intensity → amplitude
 * - Angle in the 2D emotion space → wave phase shift
 */
export function emotionToWaveParams(
  emotion: EmotionPoint,
): { amplitude: number; phase: number } {
  const { x, y } = emotion;

  // Euclidean distance from origin = emotional intensity (0 to ~1.414)
  const intensity = Math.sqrt(x * x + y * y);

  // Map intensity to amplitude with a smooth curve
  // At center (calm + neutral) → amplitude = 0 (perfect circle)
  // At edges → amplitude increases
  const amplitude = Math.min(intensity * MAX_WAVE_AMPLITUDE, MAX_WAVE_AMPLITUDE);

  // Direction in emotion space → wave phase offset
  const phase = Math.atan2(y, x);

  return { amplitude, phase };
}

/**
 * Compute the radius offset at a given ring-local angle based on current emotion.
 * Uses a sinusoidal wave pattern.
 */
export function computeRadiusOffset(
  angle: number,
  emotion: EmotionPoint | null,
): number {
  if (!emotion) return 0;

  const { amplitude, phase } = emotionToWaveParams(emotion);

  // Dead zone: if amplitude is negligible, return 0 (perfect arc)
  if (amplitude < 0.3) return 0;

  // Sinusoidal wave: offset varies as the ring rotates
  return amplitude * Math.sin(angle + phase);
}

/**
 * Get trajectory line thickness for a given task status.
 */
export function getStatusThickness(status: string): number {
  return STATUS_THICKNESS[status] ?? 1.5;
}
