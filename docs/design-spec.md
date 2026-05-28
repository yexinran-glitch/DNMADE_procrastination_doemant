# Dormant — 设计规范

## 色彩系统

### 背景
- 主背景: `#000000` (纯黑)
- 表面: `#0D0D0D`
- 抬升表面: `#1A1A1A`

### 玻璃材质
- 玻璃背景: `rgba(255,255,255,0.06)`
- 玻璃边框: `rgba(255,255,255,0.12)`
- 玻璃高光: `rgba(255,255,255,0.08)`
- 毛玻璃模糊: `UIBlurEffectStyleSystemUltraThinMaterialDark` (iOS)

### 文字
- 主文字: `#FFFFFF`
- 次要文字: `rgba(255,255,255,0.6)`
- 辅助文字: `rgba(255,255,255,0.35)`

### 状态色
- Smooth: `#4ADE80` (绿色)
- Procrastinate: `#FBBF24` (黄色)
- Totally Stuck: `#F87171` (红色)
- Done: `#60A5FA` (蓝色)

### 年轮色板 (10色)
`#6366F1` `#8B5CF6` `#A855F7` `#EC4899` `#F43F5E`
`#F97316` `#EAB308` `#22C55E` `#14B8A6` `#06B6D4`

### 强调色
- 主强调: `#6366F1` (靛蓝)
- 浅强调: `#818CF8`

## 字体规范
- 字体族: 'Roboto Serif', serif
- 标题: 20-32px, fontWeight 700-800
- 正文: 14-17px, fontWeight 400-600
- 辅助: 11-13px, fontWeight 400-500
- 等宽数字: 系统默认

## 间距系统
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

## 圆角
- 小型组件 (按钮/输入框): 12-14px
- 卡片: 16px
- 模态/面板: 20-24px
- TabBar 顶部: 24px

## 玻璃材质规范
- 背景模糊: 20-25px blur
- 半透明覆盖: 6% 白色透明度
- 边框: hairlineWidth, 12% 白色
- 避免深层嵌套毛玻璃组件

## 交互规范
- 点击反馈: 透明度变化 (activeOpacity 0.7-0.8)
- 页面过渡: 系统默认 push/pop
- Modal: 从底部弹出 (iOS 风格)
- 拖拽: 长按 400ms 激活

## 暗色模式
- 仅支持暗色模式
- StatusBar: light content
