# Notion Countdown Widget

一个可部署在 Vercel 上的轻量级倒计时页面，用作 Notion Widget。

## 功能特性

- 📅 自定义结束日期和时间
- ⏱️ 多种精度选择（天/小时/分钟/秒）
- 🎨 主题适配 Notion（浅色/深色/自动）
- 💎 多种样式（简约/卡片/渐变）
- 🔗 生成 URL 直接嵌入 Notion

## 在线使用

1. 访问配置页面
2. 填写配置信息（结束日期、标题等）
3. 点击"生成 Widget URL"
4. 在 Notion 中使用 `/embed` 命令粘贴生成的 URL

**注意：** Notion embed 功能需要 HTTPS 公网 URL，本地开发环境无法直接嵌入。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署到 Vercel

### 方式一：一键部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 方式二：命令行部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel
```

部署完成后，使用 Vercel 提供的 HTTPS 域名生成 Widget URL。

## 技术栈

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Vercel

## 项目结构

```
notion-countdown/
├── app/
│   ├── page.tsx              # 配置页面
│   └── widget/
│       └── page.tsx          # 倒计时展示页面
├── lib/                      # 核心逻辑
│   ├── countdown.ts          # 倒计时计算
│   ├── url-builder.ts        # URL 生成/解析
│   └── theme.ts              # 主题处理
├── types/                    # 类型定义
└── docs/                     # 项目文档
```

## 文档

- [PRD](docs/PRD.md) - 产品需求文档
- [技术设计](docs/TECH_DESIGN.md) - 技术架构文档

