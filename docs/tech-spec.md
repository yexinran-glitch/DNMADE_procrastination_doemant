# Dormant — 技术规范

## 技术栈

| 类别 | 选型 | 版本 |
|------|------|------|
| 框架 | Expo + React Native | Expo ~52, RN 0.76 |
| 语言 | TypeScript | ~5.3 |
| 导航 | @react-navigation/native | ^7.0 |
| 动画 | react-native-reanimated | ~3.16 |
| 画布 | @shopify/react-native-skia | ^1.5 |
| 手势 | react-native-gesture-handler | ~2.20 |
| 状态管理 | Zustand | ^5.0 |
| 本地存储 | react-native-mmkv | ^3.2 |
| 毛玻璃 | @react-native-community/blur | ^4.4 |
| 图标 | @expo/vector-icons | ^14.0 |

## 项目结构

```
dormant/
├── App.tsx                    # 入口
├── app.json                   # Expo 配置
├── babel.config.js            # Babel + Reanimated 插件
├── tsconfig.json              # TypeScript 配置
├── package.json
│
├── assets/                    # 静态资源
├── docs/                      # 项目文档
├── devlog/                    # 开发日志
├── wireframe/                 # 设计稿
│
└── src/
    ├── app/
    │   ├── App.tsx            # 应用根组件
    │   └── navigation/
    │       ├── RootNavigator.tsx   # 导航配置
    │       └── CustomTabBar.tsx    # 自定义玻璃 TabBar
    │
    ├── data/
    │   └── models.ts          # 数据接口定义
    │
    ├── store/
    │   └── projectStore.ts    # Zustand Store (CRUD + 持久化)
    │
    ├── features/
    │   ├── ring/              # 年轮可视化
    │   │   ├── screens/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   └── utils/
    │   ├── projects/          # 项目管理
    │   │   ├── screens/
    │   │   └── components/
    │   └── archive/           # 归档 & STL 导出
    │       ├── screens/
    │       └── utils/
    │
    └── shared/
        ├── components/        # 共享 UI 组件 (GlassView, GlassModal)
        ├── theme/             # 主题 (colors, spacing)
        └── types/             # 共享类型
```

## 数据模型

核心接口：Project → Story → Task → TrajectoryPoint

- Project: id, name, color, status(active/archived), storyIds, createdAt, archivedAt
- Story: id, projectId, name, color, taskIds, createdAt
- Task: id, storyId, name, ringLayerIndex, status, currentEmotion, emotionHistory[], trajectory[], createdAt
- TrajectoryPoint: angle, radiusOffset, thickness, timestamp
- EmotionPoint: x(-1~+1), y(+1~-1), timestamp

## 年轮可视化算法

### 坐标系
- 年轮中心 C = (SW * 0.85, SH * 0.5)，位于屏幕右侧
- 可见弧：角度 [2π/3, 4π/3]，约左侧 120°
- 圈层间距：28px
- 旋转速度：约 0.3 rad/s（~21秒一圈）

### 渲染流程（每帧）
1. 清屏（黑色背景）
2. 从内到外画圈层：轨道圆 → 可见弧段轨迹 → 笔触点
3. 画径向唱针线
4. 边缘渐变遮罩

### 轨迹录制
- 每帧计算笔在环局部坐标的接触角
- 累计 0.5° 角距离后记录一个轨迹点
- 轨迹上限 10000 点，超限时采样压缩

### 状态→粗细映射
- Smooth: 1.5px
- Procrastinate: 4px
- Totally Stuck: 6px
- Done: 0 (不再记录)

### 情绪→波动映射
- 情绪距原点距离 → 波动幅度 (0~12px)
- 情绪角度 → 波动相位偏移

## STL 导出规范
- 格式：二进制 STL (Binary STL)
- 结构：同心环柱体，顶面带有轨迹波动浮雕
- 实现：纯 TypeScript，无需第三方 3D 库
- 导出方式：iOS Share Sheet
