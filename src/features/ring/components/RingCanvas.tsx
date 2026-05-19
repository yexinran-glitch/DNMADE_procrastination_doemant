import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useStore } from '../../../store/projectStore';
import { useShallow } from 'zustand/react/shallow';
import { useTrajectoryRecorder } from '../hooks/useTrajectoryRecorder';
import {
  PEN_ANGLE,
  computeRingRadius,
} from '../utils/ringGeometry';
import { colors } from '../../../shared/theme/colors';

const DEFAULT_SPEED = 0.3;

export function RingCanvas() {
  const ringTasks = useStore(useShallow((s) => s.getRingTasks()));
  const currentProjectId = useStore((s) => s.currentProjectId);
  const stories = useStore(useShallow((s) => s.stories));

  const containerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const dataRef = useRef({ ringTasks, stories });
  dataRef.current = { ringTasks, stories };

  const orderedTasks = useMemo(() => {
    return [...ringTasks].sort(
      (a, b) => (a.ringLayerIndex ?? 0) - (b.ringLayerIndex ?? 0),
    );
  }, [ringTasks]);

  // Trajectory recording
  const { recordFrame } = useTrajectoryRecorder();
  const recordRef = useRef(recordFrame);
  recordRef.current = recordFrame;

  useEffect(() => {
    const interval = setInterval(() => {
      recordRef.current(rotationRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Create canvas element
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const SW = window.innerWidth;
    const SH = window.innerHeight;
    const canvas = document.createElement('canvas');
    canvas.width = SW * window.devicePixelRatio;
    canvas.height = SH * window.devicePixelRatio;
    canvas.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;';
    container.appendChild(canvas);
    canvasRef.current = canvas;

    return () => {
      if (canvasRef.current) {
        canvasRef.current.remove();
        canvasRef.current = null;
      }
    };
  }, []);

  // Animation + draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SW = window.innerWidth;
    const SH = window.innerHeight;
    const dpr = window.devicePixelRatio;
    const centerX = SW * 0.85;
    const centerY = SH * 0.5;

    let lastTime: number | null = null;

    const draw = (rotation: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Draw rotating group
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      const tasks = dataRef.current.ringTasks;
      const currentStories = dataRef.current.stories;
      const sorted = [...tasks].sort(
        (a, b) => (a.ringLayerIndex ?? 0) - (b.ringLayerIndex ?? 0),
      );
      const totalLayers = sorted.length;

      for (const task of sorted) {
        const layerIndex = task.ringLayerIndex ?? 0;
        const ringR = computeRingRadius(layerIndex, totalLayers);
        const story = currentStories[task.storyId];
        const ringColor = story?.color ?? colors.ringColors[0];

        // Ring track circle
        ctx.beginPath();
        ctx.arc(0, 0, ringR, 0, 2 * Math.PI);
        ctx.strokeStyle = ringColor + '30';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Trajectory path
        if (task.trajectory.length >= 2) {
          const pts = task.trajectory;
          ctx.beginPath();
          for (let i = 0; i < pts.length; i++) {
            const pt = pts[i];
            const effectiveR = ringR + pt.radiusOffset;
            const x = effectiveR * Math.cos(pt.angle);
            const y = effectiveR * Math.sin(pt.angle);
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = pts[pts.length - 1].thickness;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = ringColor;
          ctx.shadowBlur = 1.5;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      ctx.restore();

      // Pen radial line (static in screen space)
      if (sorted.length > 0) {
        const innerR = computeRingRadius(0, sorted.length);
        const outerR = computeRingRadius(sorted.length - 1, sorted.length);

        const penX1 = centerX + innerR * Math.cos(PEN_ANGLE);
        const penY1 = centerY + innerR * Math.sin(PEN_ANGLE);
        const penX2 = centerX + outerR * Math.cos(PEN_ANGLE);
        const penY2 = centerY + outerR * Math.sin(PEN_ANGLE);

        // Glow line
        ctx.beginPath();
        ctx.moveTo(penX1, penY1);
        ctx.lineTo(penX2, penY2);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(penX1, penY1);
        ctx.lineTo(penX2, penY2);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 0.5;
        ctx.shadowColor = 'rgba(255,255,255,0.6)';
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    };

    const animate = (time: number) => {
      const timeSec = time / 1000;
      if (lastTime === null) {
        lastTime = timeSec;
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      const dt = Math.min(timeSec - lastTime, 0.1);
      lastTime = timeSec;
      rotationRef.current =
        (rotationRef.current + DEFAULT_SPEED * dt) % (2 * Math.PI);
      draw(rotationRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  if (!currentProjectId || orderedTasks.length === 0) return null;

  return (
    <View
      ref={containerRef}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}
