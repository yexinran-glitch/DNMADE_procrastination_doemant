import { useRef, useCallback } from 'react';
import { useStore } from '../../../store/projectStore';
import { TaskStatus } from '../../../data/models';
import type { Task, TaskId } from '../../../data/models';
import {
  PEN_ANGLE,
  normalizeAngle,
  angularDistance,
} from '../utils/ringGeometry';
import { computeRadiusOffset, getStatusThickness } from '../utils/emotionMapper';

// Record a trajectory point every 0.5° of rotation
const ANGLE_STEP = (2 * Math.PI) / 720;

/**
 * Frame-level trajectory recorder.
 * Called every animation frame to record trajectory points for all ring tasks.
 */
export function useTrajectoryRecorder() {
  const lastRecordedAngles = useRef<Map<TaskId, number>>(new Map());

  const getRingTasks = useStore((s) => s.getRingTasks);
  const appendTrajectoryPoint = useStore((s) => s.appendTrajectoryPoint);

  const recordFrame = useCallback(
    (currentRotation: number) => {
      const ringTasks = getRingTasks();

      for (const task of ringTasks) {
        if (task.ringLayerIndex === null) continue;
        if (task.status === TaskStatus.DONE) continue;

        // Compute the ring-local angle at the pen position
        // Pen is fixed at screen angle PI; ring-local angle = PI - rotation
        const ringLocalAngle = normalizeAngle(PEN_ANGLE - currentRotation);

        const lastAngle = lastRecordedAngles.current.get(task.id);
        if (lastAngle !== undefined) {
          const dist = angularDistance(ringLocalAngle, lastAngle);
          if (dist < ANGLE_STEP) continue;
        }

        lastRecordedAngles.current.set(task.id, ringLocalAngle);

        const radiusOffset = computeRadiusOffset(ringLocalAngle, task.currentEmotion);
        const thickness = getStatusThickness(task.status);

        appendTrajectoryPoint(task.id, {
          angle: ringLocalAngle,
          radiusOffset,
          thickness,
          timestamp: Date.now(),
        });
      }
    },
    [getRingTasks, appendTrajectoryPoint],
  );

  // Reset recorder when ring tasks change
  const reset = useCallback(() => {
    lastRecordedAngles.current.clear();
  }, []);

  return { recordFrame, reset };
}
