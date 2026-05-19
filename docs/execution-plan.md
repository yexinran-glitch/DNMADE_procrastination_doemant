# Dormant — 执行计划

## 开发周期
- 开始：2026年5月19日
- 截止：2026年6月5日
- 总计：17 天

## 阶段划分

### Phase 1: 基础搭建 (Day 1-2)
- [x] Expo 项目初始化
- [x] 数据模型定义 (models.ts)
- [x] Zustand Store (projectStore.ts)
- [x] 导航骨架 (BottomTab + Stack)
- [x] 主题系统 (colors, spacing)
- [x] 共享组件 (GlassView, GlassModal)
- [ ] 安装依赖并验证运行

### Phase 2: 年轮可视化 (Day 3-5)
- [ ] RingCanvas Skia 画布组件
- [ ] 旋转动画 (Reanimated 驱动)
- [ ] 轨迹录制管线 (useTrajectoryRecorder)
- [ ] 坐标变换工具 (ringGeometry.ts)
- [ ] 情绪映射工具 (emotionMapper.ts)
- [ ] 可见弧裁剪 & 边缘渐变
- [ ] 60fps 性能验证

### Phase 3: 任务管理 (Day 6-8)
- [ ] 完善 NewProjectScreen
- [ ] 完善 ProjectOutlineScreen
- [ ] 拖拽 Task 入环功能
- [ ] 中间 Tab 按钮跳转逻辑

### Phase 4: 任务记录 (Day 9-11)
- [ ] 圈层点击检测 (useRingTapDetection)
- [ ] TaskRecordingModal UI
- [ ] 状态标签选择器 (StatusTagPicker)
- [ ] 情绪方格输入器 (EmotionGridInput)
- [ ] 记录→轨迹联动验证

### Phase 5: STL 导出 (Day 12-14)
- [ ] STL 生成器 (stlGenerator.ts)
- [ ] ArchivedRingScreen 完整年轮展示
- [ ] 文件导出 via iOS Share Sheet
- [ ] STL 格式验证

### Phase 6: 打磨测试 (Day 15-17)
- [ ] 玻璃材质 UI 细节完善
- [ ] 性能优化 (轨迹简化、渲染优化)
- [ ] 边界情况处理
- [ ] 端到端测试 (创建→记录→归档→导出)
- [ ] 最终验收
