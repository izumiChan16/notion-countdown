# 技术设计文档

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **部署**: Vercel
- **包管理**: pnpm

## 项目结构

```
notion-countdown/
├── app/
│   ├── page.tsx              # 配置页面
│   ├── widget/
│   │   └── page.tsx          # 倒计时展示页面
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ConfigForm.tsx        # 配置表单组件
│   ├── CountdownWidget.tsx   # 倒计时核心组件
│   └── StylePreview.tsx      # 样式预览组件
├── lib/
│   ├── countdown.ts          # 倒计时计算逻辑
│   ├── theme.ts              # 主题处理
│   └── url-builder.ts        # URL 生成/解析
├── types/
│   └── index.ts              # 类型定义
└── docs/
    ├── PRD.md
    └── TECH_DESIGN.md
```

## URL 参数设计

### Query 参数

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `end` | ISO8601 string | 是 | 结束时间 | `2024-12-31T23:59:59` |
| `title` | string | 否 | 标题文本 | `考试倒计时` |
| `unit` | enum | 否 | 精度单位 | `days\|hours\|minutes\|seconds` (默认 `days`) |
| `theme` | enum | 否 | 主题模式 | `light\|dark\|auto` (默认 `auto`) |
| `style` | enum | 否 | 样式预设 | `minimal\|card\|gradient` (默认 `minimal`) |

### 示例 URL

```
/widget?end=2024-12-31T23:59:59&title=新年倒计时&unit=days&theme=auto&style=minimal
```

## 核心类型定义

```typescript
type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds';
type Theme = 'light' | 'dark' | 'auto';
type Style = 'minimal' | 'card' | 'gradient';

interface CountdownConfig {
  end: Date;
  title?: string;
  unit: CountdownUnit;
  theme: Theme;
  style: Style;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
```

## 核心功能实现

### 1. 倒计时计算 (`lib/countdown.ts`)

- `calculateTimeRemaining(endDate: Date): TimeRemaining`
- 实时更新（使用 `setInterval`）
- 处理过期状态

### 2. URL 处理 (`lib/url-builder.ts`)

- `buildWidgetUrl(config: CountdownConfig): string`
- `parseWidgetUrl(searchParams: URLSearchParams): CountdownConfig`
- 参数验证和默认值处理

### 3. 主题处理 (`lib/theme.ts`)

- 监听系统主题变化（`prefers-color-scheme`）
- 动态切换 CSS 变量或 Tailwind 类

## 组件设计

### ConfigForm 组件

- 日期时间选择器
- 单选/下拉选择（unit, theme, style）
- 文本输入（title）
- 生成 URL 按钮 + 复制功能

### CountdownWidget 组件

- 接收配置参数（从 URL 解析）
- 实时更新倒计时
- 响应式布局
- 主题切换
- 样式变体渲染

## 部署配置

### Vercel 配置 (`vercel.json`)

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### 环境变量

无需额外环境变量，纯静态生成。

## 性能优化

- 使用 Next.js App Router 的流式渲染
- Widget 页面使用客户端组件（实时更新）
- 配置页面服务端渲染
- Tailwind CSS 按需加载
- 字体优化（next/font）

## 浏览器兼容性

- 现代浏览器（Chrome, Firefox, Safari, Edge 最新版）
- 支持 CSS Grid 和 Flexbox
- 使用 `Date` API（无需 polyfill）
