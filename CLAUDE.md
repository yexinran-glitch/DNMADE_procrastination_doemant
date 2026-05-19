# CLAUDE.md — Dormant 项目指引

## 项目简介

Dormant 是一个运行在 iPhone 上的任务管理工具，以"年轮"（同心旋转圆环）作为核心可视化隐喻。React Native (Expo) 构建，截止 2026年6月5日。

## 标准文件路径

| 文档 | 路径 |
|------|------|
| 项目需求 | [docs/requirements.md](docs/requirements.md) |
| 技术规范 | [docs/tech-spec.md](docs/tech-spec.md) |
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) |
| 执行计划 | [docs/execution-plan.md](docs/execution-plan.md) |
| 开发日志 | [devlog/](devlog/) |
| 设计稿 | [wireframe/](wireframe/) |
| Plan 文件 | ~/.claude/plans/federated-stargazing-lightning.md |

## 工作说明

### 开发环境
- 包管理器：bun（系统无 npm/Node.js）
- 安装依赖：`bun install`
- 启动开发：`bun run start` 或 `bunx expo start`
- 目标平台：iOS（iPhone）

### 每次开发会话
1. 查看 [devlog/](devlog/) 了解最新进展
2. 更新今日开发日志文件 `devlog/YYYY-MM-DD.md`
3. 按执行计划的阶段顺序推进

### 代码规范
- 所有新代码使用 TypeScript
- 源码放在 `src/` 目录下
- 功能模块放在 `src/features/<feature>/` 下
- 共享组件放在 `src/shared/components/`
- 使用路径别名 `@/` 指向 `src/`

### 关键架构决策
- 年轮可视化使用 @shopify/react-native-skia 实现
- 状态管理使用 Zustand + persist middleware
- 本地存储使用 react-native-mmkv
- 3D 导出使用纯 JS 自研 STL 生成器（无第三方依赖）
- UI 风格：黑色调 + 玻璃材质（Glassmorphism）

### 用户偏好
- 用户是编程初学者，不需要解释每行代码
- 优先完成核心功能（Ring、Projects、New Project），Identity 和 Profile 仅占位
- 时间紧张，遇到完全卡住的功能先简化实现再优化
