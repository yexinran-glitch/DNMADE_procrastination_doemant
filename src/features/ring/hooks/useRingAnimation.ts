import { useCallback, useEffect, useRef } from 'react';
import { useSharedValue, useFrameCallback } from 'react-native-reanimated';

const DEFAULT_SPEED = 0.3; // rad/s (~21 seconds per full rotation)

export function useRingAnimation() {
  const rotation = useSharedValue(0);
  const isAnimating = useRef(true);
  const speedRef = useRef(DEFAULT_SPEED);
  const lastFrameTime = useRef<number | null>(null);

  const frameCallback = useFrameCallback((frameInfo) => {
    if (!isAnimating.current) return;

    const now = frameInfo.timeSinceFirstFrame ?? 0;
    if (lastFrameTime.current === null) {
      lastFrameTime.current = now;
      return;
    }

    const dt = (now - lastFrameTime.current) / 1000; // seconds
    lastFrameTime.current = now;

    // Clamp dt to avoid large jumps (e.g., after app background)
    const clampedDt = Math.min(dt, 0.1);

    const deltaAngle = speedRef.current * clampedDt;
    rotation.value = (rotation.value + deltaAngle) % (2 * Math.PI);
  });

  const start = useCallback(() => {
    isAnimating.current = true;
    lastFrameTime.current = null;
  }, []);

  const stop = useCallback(() => {
    isAnimating.current = false;
  }, []);

  const toggle = useCallback(() => {
    if (isAnimating.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

  const setSpeed = useCallback((speed: number) => {
    speedRef.current = speed;
  }, []);

  // Start animation on mount, stop on unmount
  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  return {
    rotation,
    frameCallback,
    start,
    stop,
    toggle,
    setSpeed,
    isAnimating,
    speed: speedRef.current,
  };
}
