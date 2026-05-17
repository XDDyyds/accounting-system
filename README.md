# 记账助手

本地优先的个人网页记账应用。打开即记，快速便捷。

## 功能

- **快速记账** — 数字键盘输入金额，点选分类，2 秒完成一笔
- **多账户管理** — 支持现金、银行卡、支付宝、微信等账户
- **图表分析** — 月度分类占比环形图，收支一目了然
- **数据导出** — 一键导出 CSV，Excel 可直接打开
- **离线可用** — PWA 支持，可添加到手机主屏幕
- **本地存储** — 数据存在浏览器 IndexedDB，无需注册，隐私安全

## 技术栈

Vue 3 · Vite · Pinia · Vue Router · Dexie.js · ECharts · Vant UI · PWA

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 测试

```bash
npx vitest run
```
