import { PHONE_WIDTH, PHONE_HEIGHT } from '../../../shared/theme/layout';

const SW = PHONE_WIDTH;
const SH = PHONE_HEIGHT;

// Ring center: far right, vertically centered
export const RING_CENTER_X = SW * 0.85;
export const RING_CENTER_Y = SH * 0.5;

// Visible arc: left portion
export const VISIBLE_START_ANGLE = (2 * Math.PI) / 3; // 120°
export const VISIBLE_END_ANGLE = (4 * Math.PI) / 3; // 240°

// Layer spacing between rings
export const RING_SPACING = 28;

// Pen fixed at left side (angle = PI)
export const PEN_ANGLE = Math.PI;

// Maximum ring radius
export const MAX_RING_RADIUS = Math.min(SW, SH) * 0.48;

/**
 * Compute the radius for a ring layer at the given index.
 * Index 0 = innermost ring.
 */
export function computeRingRadius(
  layerIndex: number,
  totalLayers: number,
): number {
  if (totalLayers <= 0) return MAX_RING_RADIUS * 0.5;
  return MAX_RING_RADIUS - (totalLayers - 1 - layerIndex) * RING_SPACING;
}

/**
 * Convert ring-local angle + rotation to screen-space position.
 */
export function ringToScreen(
  ringRadius: number,
  ringLocalAngle: number,
  rotation: number,
  radiusOffset: number = 0,
): { x: number; y: number } {
  const screenAngle = ringLocalAngle + rotation;
  const effectiveR = ringRadius + radiusOffset;
  return {
    x: RING_CENTER_X + effectiveR * Math.cos(screenAngle),
    y: RING_CENTER_Y + effectiveR * Math.sin(screenAngle),
  };
}

/**
 * Get the pen's screen-space position for a given ring radius.
 */
export function penScreenPosition(ringRadius: number): { x: number; y: number } {
  return {
    x: RING_CENTER_X + ringRadius * Math.cos(PEN_ANGLE),
    y: RING_CENTER_Y + ringRadius * Math.sin(PEN_ANGLE),
  };
}

/**
 * Convert a screen-space angle to the ring-local coordinate system.
 */
export function screenToRingLocal(screenAngle: number, rotation: number): number {
  let local = screenAngle - rotation;
  if (local < 0) local += 2 * Math.PI;
  if (local >= 2 * Math.PI) local -= 2 * Math.PI;
  return local;
}

/**
 * Normalize an angle to [0, 2*PI).
 */
export function normalizeAngle(angle: number): number {
  let a = angle % (2 * Math.PI);
  if (a < 0) a += 2 * Math.PI;
  return a;
}

/**
 * Check if a screen-space angle falls within the visible arc.
 */
export function isAngleVisible(screenAngle: number): boolean {
  const a = normalizeAngle(screenAngle);
  return a >= VISIBLE_START_ANGLE && a <= VISIBLE_END_ANGLE;
}

/**
 * Compute angular distance between two angles (shortest path).
 */
export function angularDistance(a: number, b: number): number {
  let diff = normalizeAngle(a) - normalizeAngle(b);
  if (diff > Math.PI) diff -= 2 * Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;
  return Math.abs(diff);
}
