# 个人记账系统 — 设计规格

## 概述

一款本地优先的网页版个人记账系统。核心体验：打开即记，追求速度和便利。Vue 3 SPA，数据存本地 IndexedDB，PWA 支持添加到手机主屏幕。

## 技术选型

| 库 | 用途 |
|---|---|
| Vue 3 + Composition API | 前端框架 |
| Vite | 构建工具 |
| Pinia | 状态管理 |
| Vue Router | 路由 |
| Dexie.js | IndexedDB 封装 |
| ECharts | 图表 |
| Vant UI | 移动端组件库 |
| vite-plugin-pwa | PWA 支持 |
| Vitest | 单元/组件测试 |

## 路由

| 路径 | 页面 | 说明 |
|---|---|---|
| `/` | 首页仪表盘 | 当月汇总 + 最近流水 |
| `/record` | 快速记账 | 核心入口，数字键盘 + 选分类 |
| `/records` | 流水列表 | 筛选、搜索 |
| `/charts` | 图表分析 | 饼图/折线图 |
| `/accounts` | 账户管理 | 账户列表 + CRUD |
| `/export` | 数据导出 | CSV 下载 |
| `/settings` | 设置 | 主题、关于 |

## 数据模型

### Transaction（交易记录）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | auto PK | 自增主键 |
| type | `'income' \| 'expense'` | 收入或支出 |
| amount | number | 金额，以「分」为单位，整数存储 |
| categoryId | FK → Category.id | 所属分类 |
| accountId | FK → Account.id | 所属账户 |
| date | string (ISO date) | 交易日期 |
| note | string? | 备注，可选 |
| createdAt | timestamp | 创建时间 |

### Category（分类）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | auto PK | 自增主键 |
| name | string | 分类名称 |
| type | `'income' \| 'expense'` | 该分类属于收入还是支出 |
| icon | string | emoji 图标 |
| sortOrder | number | 排序权重 |

预置支出分类：🍜 餐饮、🚌 交通、🛒 购物、🏠 居住、📱 通讯、💊 医疗、🎮 娱乐、📚 教育、💝 人情、📦 其他

预置收入分类：💰 工资、🎁 奖金、📈 投资、🧧 红包、📦 其他

### Account（账户）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | auto PK | 自增主键 |
| name | string | 账户名称 |
| type | `'cash' \| 'bank' \| 'alipay' \| 'wechat' \| 'other'` | 账户类型 |
| initialBalance | number | 初始余额，以「分」为单位 |
| sortOrder | number | 排序权重 |

## UI 布局

### 移动端（主要使用场景）

底部 TabBar 四个入口：
- **首页** — 当月汇总（收入和支出总额 + 分类占比环形图）+ 最近 10 条流水
- **记账** — 全屏快速记账：数字键盘 → 输入金额 → 选收入/支出 → 点分类图标 → 选账户 → 确定
- **图表** — 饼图（分类占比）、折线图（月度趋势）
- **账户** — 账户列表 + 设置/导出入口

### 桌面端

同内容单栏居中，最大宽度 480px。图表页可宽屏展开。

### 核心交互：快速记账

进入记账页 → 自动弹出数字键盘 → 输入金额 → 默认支出（可切换）→ 点击分类图标 → 默认上次账户（可切换）→ 确定。目标：2-3 秒完成一笔记录。

## 数据流

所有数据读写走 IndexedDB，无网络请求。

Pinia Store 划分：
- **useTransactionStore** — 交易 CRUD、按月查询、汇总统计
- **useCategoryStore** — 分类读取、排序
- **useAccountStore** — 账户 CRUD

数据流：组件 → Pinia Store → Dexie.js → IndexedDB。Store 的方法更新数据后，Vue 响应式系统自动更新 UI。

## v1 功能范围

- [x] 记一笔（收入/支出 + 分类 + 账户 + 备注）
- [x] 多账户管理（现金、银行卡、支付宝、微信等）
- [x] 图表分析（分类饼图、月度趋势折线图）
- [x] 数据导出为 CSV
- [x] PWA 离线可用 + 添加到主屏幕
- [x] 响应式布局

不在 v1 范围：
- 预算管理
- 周期账单提醒
- 云端同步
- 多用户
- 数据导入

## 错误处理

| 场景 | 处理 |
|---|---|
| IndexedDB 不可用（无痕模式） | 启动时检测，提示切换普通模式 |
| 存储空间不足 | Toast 提示 + 建议先导出数据 |
| 数据版本迁移 | Dexie schema version 机制自动处理 |
| 非法输入 | 表单校验，按钮置灰 |
| 未处理异常 | `app.config.errorHandler` 全局兜底 |

## 测试策略（TDD）

- **单元测试 — Pinia Store**（Vitest）：所有业务逻辑先写测试再实现
- **单元测试 — 工具函数**（Vitest）：金额格式化、CSV 生成、日期处理
- **组件测试**（Vitest + @vue/test-utils）：记账表单校验、分类选择器交互
- **E2E**（Playwright，可选）：完整记账流程、导出流程
