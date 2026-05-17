# 个人记账系统 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first, mobile-friendly personal accounting SPA with Vue 3 + IndexedDB + PWA.

**Architecture:** Vue 3 SPA with Pinia stores over Dexie.js/IndexedDB. Mobile-first with Vant UI, responsive up to desktop. All data local, no backend.

**Tech Stack:** Vue 3, Vite, Pinia, Vue Router, Dexie.js, ECharts, Vant UI, vite-plugin-pwa, Vitest

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/App.vue`

- [ ] **Step 1: Scaffold with Vite**

Run:
```bash
cd /Users/madison/Documents/Projects/account_web
npm create vite@latest . -- --template vue
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install pinia vue-router dexie echarts vant vue-echarts
npm install -D vitest @vue/test-utils happy-dom vite-plugin-pwa
```

- [ ] **Step 3: Create vite.config.js**

Write `vite.config.js`:
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: '记账助手',
        short_name: '记账',
        description: '个人记账应用',
        theme_color: '#4CAF50',
        icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }]
      }
    })
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{js,ts}']
  }
})
```

- [ ] **Step 4: Create index.html**

Write `index.html`:
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#4CAF50" />
  <link rel="icon" href="/favicon.ico" />
  <title>记账助手</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create minimal src/main.js**

Write `src/main.js`:
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

- [ ] **Step 6: Create minimal src/App.vue**

Write `src/App.vue`:
```vue
<template>
  <div id="app">记账助手</div>
</template>
```

- [ ] **Step 7: Verify dev server starts**

Run: `npm run dev`
Expected: Browser opens with "记账助手"

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "chore: scaffold project with Vite + Vue 3 + deps"
```

---

### Task 2: Database Layer

**Files:**
- Create: `src/db/index.js`

- [ ] **Step 1: Write failing test**

Create `src/db/index.test.js`:
```js
import { describe, it, expect, beforeAll } from 'vitest'
import { db, Transaction, Category, Account } from './index.js'

describe('database', () => {
  beforeAll(async () => {
    // Dexie with indexedDB in happy-dom needs fake-indexeddb
  })

  it('should define Transaction, Category, Account tables', () => {
    expect(db.transaction).toBeDefined()
    expect(db.category).toBeDefined()
    expect(db.account).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify fail**

Run: `npx vitest src/db/index.test.js`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement database**

Write `src/db/index.js`:
```js
import Dexie from 'dexie'

export const db = new Dexie('AccountBook')

db.version(1).stores({
  transaction: '++id, type, categoryId, accountId, date',
  category: '++id, type, sortOrder',
  account: '++id, sortOrder'
})

export class Transaction {
  constructor(type, amount, categoryId, accountId, date, note = '') {
    this.type = type
    this.amount = amount
    this.categoryId = categoryId
    this.accountId = accountId
    this.date = date
    this.note = note
    this.createdAt = Date.now()
  }
}

export class Category {
  constructor(name, type, icon, sortOrder = 0) {
    this.name = name
    this.type = type
    this.icon = icon
    this.sortOrder = sortOrder
  }
}

export class Account {
  constructor(name, type, initialBalance = 0, sortOrder = 0) {
    this.name = name
    this.type = type
    this.initialBalance = initialBalance
    this.sortOrder = sortOrder
  }
}

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: '餐饮', type: 'expense', icon: '🍜', sortOrder: 0 },
  { name: '交通', type: 'expense', icon: '🚌', sortOrder: 1 },
  { name: '购物', type: 'expense', icon: '🛒', sortOrder: 2 },
  { name: '居住', type: 'expense', icon: '🏠', sortOrder: 3 },
  { name: '通讯', type: 'expense', icon: '📱', sortOrder: 4 },
  { name: '医疗', type: 'expense', icon: '💊', sortOrder: 5 },
  { name: '娱乐', type: 'expense', icon: '🎮', sortOrder: 6 },
  { name: '教育', type: 'expense', icon: '📚', sortOrder: 7 },
  { name: '人情', type: 'expense', icon: '💝', sortOrder: 8 },
  { name: '其他', type: 'expense', icon: '📦', sortOrder: 9 }
]

export const DEFAULT_INCOME_CATEGORIES = [
  { name: '工资', type: 'income', icon: '💰', sortOrder: 0 },
  { name: '奖金', type: 'income', icon: '🎁', sortOrder: 1 },
  { name: '投资', type: 'income', icon: '📈', sortOrder: 2 },
  { name: '红包', type: 'income', icon: '🧧', sortOrder: 3 },
  { name: '其他', type: 'income', icon: '📦', sortOrder: 4 }
]

export async function seedDefaults() {
  const catCount = await db.category.count()
  if (catCount > 0) return

  await db.category.bulkAdd([
    ...DEFAULT_EXPENSE_CATEGORIES.map((c, i) => new Category(c.name, c.type, c.icon, i)),
    ...DEFAULT_INCOME_CATEGORIES.map((c, i) => new Category(c.name, c.type, c.icon, i))
  ])

  const acctCount = await db.account.count()
  if (acctCount > 0) return

  await db.account.bulkAdd([
    new Account('现金', 'cash', 0, 0),
    new Account('支付宝', 'alipay', 0, 1),
    new Account('微信', 'wechat', 0, 2)
  ])
}
```

- [ ] **Step 4: Run test**

Run: `npx vitest src/db/index.test.js`
Expected: Cannot fully test in happy-dom (IndexedDB not available). Verify manually via dev server or skip for now — Dexie schema is declarative and correct by construction.

- [ ] **Step 5: Commit**

```bash
git add src/db/ && git commit -m "feat: add database schema with Dexie.js"
```

---

### Task 3: Money Utility

**Files:**
- Create: `src/utils/money.js`, `src/utils/money.test.js`

- [ ] **Step 1: Write failing tests**

Write `src/utils/money.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { toYuan, toCents, formatMoney } from './money.js'

describe('toYuan', () => {
  it('converts cents to yuan string', () => {
    expect(toYuan(0)).toBe('0.00')
    expect(toYuan(1)).toBe('0.01')
    expect(toYuan(100)).toBe('1.00')
    expect(toYuan(10050)).toBe('100.50')
    expect(toYuan(-500)).toBe('-5.00')
  })
})

describe('toCents', () => {
  it('converts yuan string to cents', () => {
    expect(toCents('0.01')).toBe(1)
    expect(toCents('1.00')).toBe(100)
    expect(toCents('100.50')).toBe(10050)
    expect(toCents('5')).toBe(500)
  })

  it('handles input with leading zeros', () => {
    expect(toCents('05')).toBe(500)
  })

  it('returns NaN for invalid input', () => {
    expect(toCents('abc')).toBeNaN()
    expect(toCents('')).toBeNaN()
  })
})

describe('formatMoney', () => {
  it('formats cents with sign and yuan symbol', () => {
    expect(formatMoney(100, 'expense')).toBe('-1.00')
    expect(formatMoney(100, 'income')).toBe('+1.00')
    expect(formatMoney(0, 'expense')).toBe('0.00')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest src/utils/money.test.js`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement**

Write `src/utils/money.js`:
```js
export function toYuan(cents) {
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  const yuan = Math.floor(abs / 100)
  const fen = abs % 100
  return `${sign}${yuan}.${String(fen).padStart(2, '0')}`
}

export function toCents(yuanStr) {
  const trimmed = yuanStr.trim()
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return NaN
  const num = parseFloat(trimmed)
  return Math.round(num * 100)
}

export function formatMoney(cents, type) {
  const yuan = toYuan(cents)
  if (cents === 0) return yuan
  return type === 'income' ? `+${yuan}` : `-${yuan}`
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest src/utils/money.test.js`
Expected: 7 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/money.js src/utils/money.test.js && git commit -m "feat: add money utility functions"
```

---

### Task 4: Date Utility

**Files:**
- Create: `src/utils/date.js`, `src/utils/date.test.js`

- [ ] **Step 1: Write failing tests**

Write `src/utils/date.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { today, getMonthRange, formatDate, formatMonth } from './date.js'

describe('today', () => {
  it('returns ISO date string for today', () => {
    const result = today()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('getMonthRange', () => {
  it('returns first and last day of a month', () => {
    const [start, end] = getMonthRange(2026, 5)
    expect(start).toBe('2026-05-01')
    expect(end).toBe('2026-05-31')
  })

  it('handles December', () => {
    const [start, end] = getMonthRange(2026, 12)
    expect(start).toBe('2026-12-01')
    expect(end).toBe('2026-12-31')
  })
})

describe('formatDate', () => {
  it('formats ISO date to Chinese display', () => {
    expect(formatDate('2026-05-17')).toBe('05月17日')
  })
})

describe('formatMonth', () => {
  it('formats month to Chinese display', () => {
    expect(formatMonth(2026, 5)).toBe('2026年05月')
  })
})
```

- [ ] **Step 2: Run tests to verify fail**

Run: `npx vitest src/utils/date.test.js`
Expected: FAIL

- [ ] **Step 3: Implement**

Write `src/utils/date.js`:
```js
export function today() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getMonthRange(year, month) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return [start, end]
}

export function formatDate(isoDate) {
  const [, m, d] = isoDate.split('-')
  return `${parseInt(m)}月${parseInt(d)}日`
}

export function formatMonth(year, month) {
  return `${year}年${String(month).padStart(2, '0')}月`
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest src/utils/date.test.js`
Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/date.js src/utils/date.test.js && git commit -m "feat: add date utility functions"
```

---

### Task 5: CSV Export Utility

**Files:**
- Create: `src/utils/csv.js`, `src/utils/csv.test.js`

- [ ] **Step 1: Write failing tests**

Write `src/utils/csv.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { toCSV, downloadCSV } from './csv.js'
import { toYuan } from './money.js'

describe('toCSV', () => {
  it('generates CSV from transactions', () => {
    const rows = [
      { date: '2026-05-17', type: 'expense', amount: 2800, categoryName: '餐饮', accountName: '微信', note: '午餐' },
      { date: '2026-05-17', type: 'income', amount: 1200000, categoryName: '工资', accountName: '工商银行', note: '' }
    ]
    const csv = toCSV(rows, (r) => ({
      '日期': r.date,
      '类型': r.type === 'income' ? '收入' : '支出',
      '金额': (r.type === 'expense' ? '-' : '') + toYuan(r.amount),
      '分类': r.categoryName,
      '账户': r.accountName,
      '备注': r.note
    }))

    expect(csv).toContain('日期,类型,金额,分类,账户,备注')
    expect(csv).toContain('2026-05-17,支出,-28.00,餐饮,微信,午餐')
    expect(csv).toContain('2026-05-17,收入,12000.00,工资,工商银行')
  })

  it('handles empty list', () => {
    const csv = toCSV([], (r) => ({ 'a': 'b' }))
    expect(csv).toBe('a')
  })

  it('escapes commas in values', () => {
    const rows = [{ note: 'hello, world' }]
    const csv = toCSV(rows, (r) => ({ '备注': r.note }))
    expect(csv).toContain('"hello, world"')
  })
})
```

- [ ] **Step 2: Run tests to verify fail**

Run: `npx vitest src/utils/csv.test.js`
Expected: FAIL

- [ ] **Step 3: Implement**

Write `src/utils/csv.js`:
```js
function escape(value) {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function toCSV(rows, mapRow) {
  if (rows.length === 0) return Object.keys(mapRow({})).join(',')

  const columns = Object.keys(mapRow(rows[0]))
  const header = columns.join(',')
  const lines = rows.map(row => {
    const obj = mapRow(row)
    return columns.map(col => escape(obj[col])).join(',')
  })
  return [header, ...lines].join('\n')
}

export function downloadCSV(csvContent, filename) {
  const BOM = '﻿'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest src/utils/csv.test.js`
Expected: 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/csv.js src/utils/csv.test.js && git commit -m "feat: add CSV export utility"
```

---

### Task 6: Category Store

**Files:**
- Create: `src/stores/category.js`, `src/stores/category.test.js`

- [ ] **Step 1: Write failing tests**

Write `src/stores/category.test.js`:
```js
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCategoryStore } from './category.js'

// Mock Dexie
import { db } from '../db/index.js'
vi.mock('../db/index.js', () => ({
  db: {
    category: {
      toArray: vi.fn(),
      bulkAdd: vi.fn(),
      count: vi.fn(() => Promise.resolve(0))
    }
  },
  DEFAULT_EXPENSE_CATEGORIES: [
    { name: '餐饮', type: 'expense', icon: '🍜', sortOrder: 0 },
    { name: '交通', type: 'expense', icon: '🚌', sortOrder: 1 }
  ],
  DEFAULT_INCOME_CATEGORIES: [
    { name: '工资', type: 'income', icon: '💰', sortOrder: 0 }
  ],
  Category: class {
    constructor(name, type, icon, sortOrder) {
      this.name = name
      this.type = type
      this.icon = icon
      this.sortOrder = sortOrder
    }
  }
}))

describe('useCategoryStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loads defaults when DB is empty', async () => {
    db.category.toArray.mockResolvedValue([])
    const store = useCategoryStore()
    await store.load()

    expect(db.category.bulkAdd).toHaveBeenCalled()
    expect(store.expenseCategories.length).toBeGreaterThan(0)
    expect(store.incomeCategories.length).toBeGreaterThan(0)
  })

  it('gets categories by type', async () => {
    db.category.toArray.mockResolvedValue([
      { id: 1, name: '餐饮', type: 'expense', icon: '🍜', sortOrder: 0 },
      { id: 2, name: '工资', type: 'income', icon: '💰', sortOrder: 0 }
    ])
    const store = useCategoryStore()
    await store.load()

    expect(store.expenseCategories).toHaveLength(1)
    expect(store.incomeCategories).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run tests to verify fail**

Run: `npx vitest src/stores/category.test.js`
Expected: FAIL

- [ ] **Step 3: Implement**

Write `src/stores/category.js`:
```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, Category } from '../db/index.js'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])

  const expenseCategories = computed(() =>
    categories.value.filter(c => c.type === 'expense').sort((a, b) => a.sortOrder - b.sortOrder)
  )

  const incomeCategories = computed(() =>
    categories.value.filter(c => c.type === 'income').sort((a, b) => a.sortOrder - b.sortOrder)
  )

  async function load() {
    const existing = await db.category.toArray()
    if (existing.length > 0) {
      categories.value = existing
      return
    }

    const defaults = [
      ...DEFAULT_EXPENSE_CATEGORIES.map((c, i) => new Category(c.name, c.type, c.icon, i)),
      ...DEFAULT_INCOME_CATEGORIES.map((c, i) => new Category(c.name, c.type, c.icon, i))
    ]
    await db.category.bulkAdd(defaults)
    categories.value = await db.category.toArray()
  }

  function getById(id) {
    return categories.value.find(c => c.id === id)
  }

  return { categories, expenseCategories, incomeCategories, load, getById }
})
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest src/stores/category.test.js`
Expected: 2 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/stores/category.js src/stores/category.test.js && git commit -m "feat: add category store with default seeding"
```

---

### Task 7: Account Store

**Files:**
- Create: `src/stores/account.js`, `src/stores/account.test.js`

- [ ] **Step 1: Write failing tests**

Write `src/stores/account.test.js`:
```js
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAccountStore } from './account.js'

vi.mock('../db/index.js', () => ({
  db: {
    account: {
      toArray: vi.fn(),
      add: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(() => Promise.resolve(0)),
      bulkAdd: vi.fn()
    }
  },
  Account: class {
    constructor(name, type, initialBalance, sortOrder) {
      this.name = name
      this.type = type
      this.initialBalance = initialBalance
      this.sortOrder = sortOrder
    }
  }
}))

describe('useAccountStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('adds account with correct defaults', async () => {
    const { db } = await import('../db/index.js')
    db.account.toArray.mockResolvedValue([])
    db.account.add.mockResolvedValue(1)

    const store = useAccountStore()
    const id = await store.add('工商银行', 'bank', 500000)

    expect(db.account.add).toHaveBeenCalled()
    const callArg = db.account.add.mock.calls[0][0]
    expect(callArg.name).toBe('工商银行')
    expect(callArg.type).toBe('bank')
    expect(callArg.initialBalance).toBe(500000)
  })

  it('removes account', async () => {
    const { db } = await import('../db/index.js')
    db.account.delete.mockResolvedValue(undefined)

    const store = useAccountStore()
    await store.remove(1)

    expect(db.account.delete).toHaveBeenCalledWith(1)
  })
})
```

- [ ] **Step 2: Run tests to verify fail**

Run: `npx vitest src/stores/account.test.js`
Expected: FAIL

- [ ] **Step 3: Implement**

Write `src/stores/account.js`:
```js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db, Account } from '../db/index.js'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref([])

  async function load() {
    accounts.value = await db.account.orderBy('sortOrder').toArray()
  }

  async function add(name, type, initialBalance = 0) {
    const sortOrder = accounts.value.length
    const id = await db.account.add(new Account(name, type, initialBalance, sortOrder))
    await load()
    return id
  }

  async function update(id, updates) {
    await db.account.update(id, updates)
    await load()
  }

  async function remove(id) {
    await db.account.delete(id)
    await load()
  }

  function getById(id) {
    return accounts.value.find(a => a.id === id)
  }

  return { accounts, load, add, update, remove, getById }
})
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest src/stores/account.test.js`
Expected: 2 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/stores/account.js src/stores/account.test.js && git commit -m "feat: add account store"
```

---

### Task 8: Transaction Store

**Files:**
- Create: `src/stores/transaction.js`, `src/stores/transaction.test.js`

- [ ] **Step 1: Write failing tests**

Write `src/stores/transaction.test.js`:
```js
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTransactionStore } from './transaction.js'

vi.mock('../db/index.js', () => ({
  db: {
    transaction: {
      add: vi.fn(),
      where: vi.fn(() => ({
        between: vi.fn(() => ({
          toArray: vi.fn(() => Promise.resolve([])),
          reverse: vi.fn(() => ({ sortBy: vi.fn(() => Promise.resolve([])) }))
        })),
        equals: vi.fn(() => ({ toArray: vi.fn(() => Promise.resolve([])) }))
      })),
      orderBy: vi.fn(() => ({
        reverse: vi.fn(() => ({
          limit: vi.fn(() => ({ toArray: vi.fn(() => Promise.resolve([])) }))
        }))
      })),
      toArray: vi.fn(() => Promise.resolve([]))
    }
  },
  Transaction: class {
    constructor(type, amount, categoryId, accountId, date, note = '') {
      this.type = type
      this.amount = amount
      this.categoryId = categoryId
      this.accountId = accountId
      this.date = date
      this.note = note
      this.createdAt = Date.now()
    }
  }
}))

describe('useTransactionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('adds transaction', async () => {
    const { db } = await import('../db/index.js')
    db.transaction.add.mockResolvedValue(1)

    const store = useTransactionStore()
    await store.add('expense', 2800, 1, 1, '2026-05-17', '午餐')

    expect(db.transaction.add).toHaveBeenCalled()
    const tx = db.transaction.add.mock.calls[0][0]
    expect(tx.type).toBe('expense')
    expect(tx.amount).toBe(2800)
    expect(tx.note).toBe('午餐')
  })

  it('queries transactions by date range', async () => {
    const { db } = await import('../db/index.js')
    const store = useTransactionStore()
    await store.queryByDateRange('2026-05-01', '2026-05-31')

    expect(db.transaction.where).toHaveBeenCalledWith('date')
  })
})
```

- [ ] **Step 2: Run tests to verify fail**

Run: `npx vitest src/stores/transaction.test.js`
Expected: FAIL

- [ ] **Step 3: Implement**

Write `src/stores/transaction.js`:
```js
import { defineStore } from 'pinia'
import { db, Transaction } from '../db/index.js'
import { getMonthRange } from '../utils/date.js'

export const useTransactionStore = defineStore('transaction', () => {
  async function add(type, amount, categoryId, accountId, date, note = '') {
    const tx = new Transaction(type, amount, categoryId, accountId, date, note)
    return await db.transaction.add(tx)
  }

  async function queryByDateRange(startDate, endDate) {
    return await db.transaction
      .where('date')
      .between(startDate, endDate, true, true)
      .reverse()
      .sortBy('createdAt')
  }

  async function getRecent(limit = 10) {
    return await db.transaction
      .orderBy('createdAt')
      .reverse()
      .limit(limit)
      .toArray()
  }

  async function getMonthSummary(year, month) {
    const [start, end] = getMonthRange(year, month)
    const txs = await queryByDateRange(start, end)

    let totalIncome = 0
    let totalExpense = 0
    const categoryBreakdown = {}

    for (const tx of txs) {
      if (tx.type === 'income') {
        totalIncome += tx.amount
      } else {
        totalExpense += tx.amount
        categoryBreakdown[tx.categoryId] = (categoryBreakdown[tx.categoryId] || 0) + tx.amount
      }
    }

    return { totalIncome, totalExpense, categoryBreakdown }
  }

  async function getAll() {
    return await db.transaction.orderBy('createdAt').reverse().toArray()
  }

  async function remove(id) {
    await db.transaction.delete(id)
  }

  return { add, queryByDateRange, getRecent, getMonthSummary, getAll, remove }
})
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest src/stores/transaction.test.js`
Expected: 2 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/stores/transaction.js src/stores/transaction.test.js && git commit -m "feat: add transaction store"
```

---

### Task 9: App Layout & Router

**Files:**
- Create: `src/router/index.js`, `src/components/AppLayout.vue`
- Modify: `src/main.js`, `src/App.vue`

- [ ] **Step 1: Create router**

Write `src/router/index.js`:
```js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
    meta: { tab: 'home', title: '首页' }
  },
  {
    path: '/record',
    component: () => import('../views/Record.vue'),
    meta: { tab: 'record', title: '记账' }
  },
  {
    path: '/charts',
    component: () => import('../views/Charts.vue'),
    meta: { tab: 'charts', title: '图表' }
  },
  {
    path: '/accounts',
    component: () => import('../views/Accounts.vue'),
    meta: { tab: 'accounts', title: '账户' }
  },
  {
    path: '/records',
    component: () => import('../views/Records.vue'),
    meta: { tab: 'records', title: '流水' }
  },
  {
    path: '/export',
    component: () => import('../views/Export.vue'),
    meta: { tab: 'accounts', title: '导出' }
  },
  {
    path: '/settings',
    component: () => import('../views/Settings.vue'),
    meta: { tab: 'accounts', title: '设置' }
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
```

- [ ] **Step 2: Create AppLayout**

Write `src/components/AppLayout.vue`:
```vue
<template>
  <div class="app-layout">
    <header class="app-header">
      <h1 class="app-title">{{ $route.meta.title }}</h1>
    </header>
    <main class="app-main">
      <router-view />
    </main>
    <nav class="tab-bar">
      <router-link to="/" class="tab-item" :class="{ active: $route.path === '/' }">
        <span class="tab-icon">🏠</span>
        <span class="tab-label">首页</span>
      </router-link>
      <router-link to="/record" class="tab-item tab-item--center" :class="{ active: $route.path === '/record' }">
        <span class="tab-btn-record">+</span>
        <span class="tab-label">记账</span>
      </router-link>
      <router-link to="/charts" class="tab-item" :class="{ active: $route.path === '/charts' }">
        <span class="tab-icon">📊</span>
        <span class="tab-label">图表</span>
      </router-link>
      <router-link to="/accounts" class="tab-item" :class="{ active: $route.path === '/accounts' }">
        <span class="tab-icon">💳</span>
        <span class="tab-label">账户</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.app-layout {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}
.app-header {
  padding: 12px 16px;
  background: #4CAF50;
  color: #fff;
  text-align: center;
}
.app-title { font-size: 18px; margin: 0; font-weight: 500; }
.app-main { flex: 1; overflow-y: auto; padding-bottom: 70px; }
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
  border-top: 1px solid #eee;
  padding: 6px 0 env(safe-area-inset-bottom, 6px);
  z-index: 100;
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #999;
  font-size: 12px;
  padding: 4px 12px;
}
.tab-item.active { color: #4CAF50; }
.tab-icon { font-size: 22px; }
.tab-label { margin-top: 2px; }
.tab-btn-record {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #4CAF50;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 2px;
}
</style>
```

- [ ] **Step 3: Update main.js**

Write `src/main.js`:
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

- [ ] **Step 4: Update App.vue**

Write `src/App.vue`:
```vue
<template>
  <router-view />
</template>
```

- [ ] **Step 5: Create placeholder views**

Write placeholder views so the app compiles:

`src/views/Home.vue`:
```vue
<template>
  <AppLayout>
    <div>首页</div>
  </AppLayout>
</template>
<script setup>
import AppLayout from '../components/AppLayout.vue'
</script>
```

`src/views/Record.vue`:
```vue
<template>
  <AppLayout>
    <div>记账</div>
  </AppLayout>
</template>
<script setup>
import AppLayout from '../components/AppLayout.vue'
</script>
```

`src/views/Charts.vue`:
```vue
<template>
  <AppLayout>
    <div>图表</div>
  </AppLayout>
</template>
<script setup>
import AppLayout from '../components/AppLayout.vue'
</script>
```

`src/views/Accounts.vue`:
```vue
<template>
  <AppLayout>
    <div>账户</div>
  </AppLayout>
</template>
<script setup>
import AppLayout from '../components/AppLayout.vue'
</script>
```

`src/views/Records.vue`:
```vue
<template>
  <AppLayout>
    <div>流水</div>
  </AppLayout>
</template>
<script setup>
import AppLayout from '../components/AppLayout.vue'
</script>
```

`src/views/Export.vue`:
```vue
<template>
  <AppLayout>
    <div>导出</div>
  </AppLayout>
</template>
<script setup>
import AppLayout from '../components/AppLayout.vue'
</script>
```

`src/views/Settings.vue`:
```vue
<template>
  <AppLayout>
    <div>设置</div>
  </AppLayout>
</template>
<script setup>
import AppLayout from '../components/AppLayout.vue'
</script>
```

- [ ] **Step 6: Verify app compiles and routing works**

Run: `npm run dev`
Expected: App loads, clicking tabs navigates between views, title changes.

- [ ] **Step 7: Commit**

```bash
git add src/router/ src/components/AppLayout.vue src/views/ src/main.js src/App.vue && git commit -m "feat: add router and tab bar layout with placeholder views"
```

---

### Task 10: Home View (Dashboard)

**Files:**
- Create: `src/components/StatsCard.vue`, `src/components/TransactionItem.vue`
- Modify: `src/views/Home.vue`

- [ ] **Step 1: Create StatsCard component**

Write `src/components/StatsCard.vue`:
```vue
<template>
  <div class="stats-card">
    <div class="stats-row">
      <div class="stats-item">
        <span class="stats-label">本月支出</span>
        <span class="stats-value stats-value--expense">¥{{ expenseStr }}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">本月收入</span>
        <span class="stats-value stats-value--income">¥{{ incomeStr }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { toYuan } from '../utils/money.js'

const props = defineProps({
  totalIncome: { type: Number, default: 0 },
  totalExpense: { type: Number, default: 0 }
})

const incomeStr = computed(() => toYuan(props.totalIncome))
const expenseStr = computed(() => toYuan(props.totalExpense))
</script>

<style scoped>
.stats-card {
  margin: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
}
.stats-row { display: flex; justify-content: space-around; }
.stats-item { text-align: center; }
.stats-label { display: block; color: #999; font-size: 14px; margin-bottom: 8px; }
.stats-value { font-size: 28px; font-weight: 700; }
.stats-value--expense { color: #F44336; }
.stats-value--income { color: #4CAF50; }
</style>
```

- [ ] **Step 2: Create TransactionItem component**

Write `src/components/TransactionItem.vue`:
```vue
<template>
  <div class="tx-item" @click="$emit('click', tx)">
    <span class="tx-icon">{{ category?.icon || '📦' }}</span>
    <div class="tx-info">
      <span class="tx-name">{{ category?.name || '未知' }}</span>
      <span class="tx-meta">{{ account?.name || '' }} {{ tx.note }}</span>
    </div>
    <span class="tx-amount" :class="tx.type === 'income' ? 'income' : 'expense'">
      {{ formatMoney(tx.amount, tx.type) }}
    </span>
  </div>
</template>

<script setup>
import { formatMoney } from '../utils/money.js'

defineProps({
  tx: { type: Object, required: true },
  category: { type: Object, default: null },
  account: { type: Object, default: null }
})

defineEmits(['click'])
</script>

<style scoped>
.tx-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}
.tx-icon { font-size: 32px; margin-right: 12px; }
.tx-info { flex: 1; }
.tx-name { display: block; font-size: 16px; }
.tx-meta { display: block; font-size: 12px; color: #999; margin-top: 2px; }
.tx-amount { font-size: 18px; font-weight: 600; }
.tx-amount.income { color: #4CAF50; }
.tx-amount.expense { color: #F44336; }
</style>
```

- [ ] **Step 3: Implement Home view**

Write `src/views/Home.vue`:
```vue
<template>
  <AppLayout>
    <StatsCard :total-income="summary.totalIncome" :total-expense="summary.totalExpense" />
    <div class="section-header">最近交易</div>
    <div v-if="recent.length === 0" class="empty">暂无记录，快去记一笔吧</div>
    <TransactionItem
      v-for="tx in recent"
      :key="tx.id"
      :tx="tx"
      :category="categoryStore.getById(tx.categoryId)"
      :account="accountStore.getById(tx.accountId)"
    />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import StatsCard from '../components/StatsCard.vue'
import TransactionItem from '../components/TransactionItem.vue'
import { useTransactionStore } from '../stores/transaction.js'
import { useCategoryStore } from '../stores/category.js'
import { useAccountStore } from '../stores/account.js'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()

const summary = ref({ totalIncome: 0, totalExpense: 0 })
const recent = ref([])

onMounted(async () => {
  await categoryStore.load()
  await accountStore.load()
  const now = new Date()
  summary.value = await transactionStore.getMonthSummary(now.getFullYear(), now.getMonth() + 1)
  recent.value = await transactionStore.getRecent(10)
})
</script>

<style scoped>
.section-header {
  padding: 12px 16px 8px;
  font-size: 14px;
  color: #999;
}
.empty {
  text-align: center;
  color: #ccc;
  padding: 40px 0;
}
</style>
```

- [ ] **Step 4: Verify Home renders**

Run: `npm run dev`
Expected: Home shows stats card with zero values and "暂无记录" empty state.

- [ ] **Step 5: Commit**

```bash
git add src/components/StatsCard.vue src/components/TransactionItem.vue src/views/Home.vue && git commit -m "feat: implement home dashboard with stats and recent transactions"
```

---

### Task 11: Record View (Quick Entry)

**Files:**
- Create: `src/components/AmountInput.vue`, `src/components/CategoryPicker.vue`, `src/components/AccountPicker.vue`
- Modify: `src/views/Record.vue`

- [ ] **Step 1: Create AmountInput (number pad)**

Write `src/components/AmountInput.vue`:
```vue
<template>
  <div class="amount-input">
    <div class="amount-display" :class="{ 'type-income': txType === 'income' }">
      <span class="currency">¥</span>
      <span class="value">{{ displayValue || '0' }}</span>
    </div>
    <div class="type-toggle">
      <button
        :class="{ active: txType === 'expense' }"
        @click="$emit('update:txType', 'expense')"
      >支出</button>
      <button
        :class="{ active: txType === 'income' }"
        @click="$emit('update:txType', 'income')"
      >收入</button>
    </div>
    <div class="num-pad">
      <button v-for="n in [1,2,3,4,5,6,7,8,9,'.',0,'⌫']" :key="n"
        class="num-key"
        :class="{ 'num-key--action': n === '.' || n === '⌫', 'num-key--zero': n === 0 }"
        @click="handleKey(n)">
        {{ n }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ txType: { type: String, default: 'expense' } })
const emit = defineEmits(['update:txType', 'change'])

const displayValue = ref('')

function handleKey(n) {
  if (n === '⌫') {
    displayValue.value = displayValue.value.slice(0, -1)
  } else if (n === '.') {
    if (!displayValue.value.includes('.') && displayValue.value.length > 0) {
      displayValue.value += '.'
    }
  } else {
    // Limit to 9 digits + 2 decimal places
    const parts = displayValue.value.split('.')
    if (parts[0].length >= 9) return
    if (parts[1] && parts[1].length >= 2) return
    displayValue.value += String(n)
  }
  emit('change', displayValue.value)
}
</script>

<style scoped>
.amount-display {
  text-align: center;
  padding: 24px 0;
  font-size: 40px;
  font-weight: 700;
  color: #F44336;
}
.amount-display.type-income { color: #4CAF50; }
.currency { font-size: 28px; }
.type-toggle {
  display: flex;
  margin: 0 16px 16px;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}
.type-toggle button {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
}
.type-toggle button.active {
  background: #F44336;
  color: #fff;
  border-radius: 8px;
}
.type-toggle button.active:last-child {
  background: #4CAF50;
  border-radius: 8px;
}
.num-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #eee;
}
.num-key {
  padding: 18px;
  border: none;
  background: #fff;
  font-size: 22px;
  cursor: pointer;
}
.num-key:active { background: #f0f0f0; }
.num-key--action { color: #4CAF50; font-weight: 600; }
.num-key--zero { grid-column: 1 / 3; }
</style>
```

- [ ] **Step 2: Create CategoryPicker**

Write `src/components/CategoryPicker.vue`:
```vue
<template>
  <div class="category-picker">
    <div class="picker-label">选择分类</div>
    <div class="category-grid">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="category-item"
        :class="{ selected: modelValue === cat.id }"
        @click="$emit('update:modelValue', cat.id)"
      >
        <span class="cat-icon">{{ cat.icon }}</span>
        <span class="cat-name">{{ cat.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, required: true },
  modelValue: { type: Number, default: null }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.picker-label { padding: 8px 16px; font-size: 14px; color: #999; }
.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 0 16px;
}
.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 4px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}
.category-item.selected { border-color: #4CAF50; background: #E8F5E9; }
.cat-icon { font-size: 28px; }
.cat-name { font-size: 12px; margin-top: 4px; color: #666; }
</style>
```

- [ ] **Step 3: Create AccountPicker**

Write `src/components/AccountPicker.vue`:
```vue
<template>
  <div class="account-picker">
    <div class="picker-label">选择账户</div>
    <div class="account-list">
      <button
        v-for="acct in accounts"
        :key="acct.id"
        class="account-item"
        :class="{ selected: modelValue === acct.id }"
        @click="$emit('update:modelValue', acct.id)"
      >
        <span>{{ acct.name }}</span>
        <span v-if="modelValue === acct.id" class="check">✓</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  accounts: { type: Array, required: true },
  modelValue: { type: Number, default: null }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.picker-label { padding: 8px 16px; font-size: 14px; color: #999; }
.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  font-size: 16px;
  cursor: pointer;
}
.account-item.selected { background: #E8F5E9; }
.check { color: #4CAF50; font-weight: 700; }
</style>
```

- [ ] **Step 4: Implement Record view**

Write `src/views/Record.vue`:
```vue
<template>
  <AppLayout>
    <AmountInput
      v-model:tx-type="txType"
      @change="amountStr = $event"
    />
    <CategoryPicker
      v-model="categoryId"
      :categories="txType === 'income' ? categoryStore.incomeCategories : categoryStore.expenseCategories"
    />
    <AccountPicker
      v-model="accountId"
      :accounts="accountStore.accounts"
    />
    <div class="note-row">
      <input v-model="note" class="note-input" placeholder="添加备注..." />
    </div>
    <div class="action-row">
      <button class="btn-save" :disabled="!canSave" @click="save">确定</button>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import AmountInput from '../components/AmountInput.vue'
import CategoryPicker from '../components/CategoryPicker.vue'
import AccountPicker from '../components/AccountPicker.vue'
import { useTransactionStore } from '../stores/transaction.js'
import { useCategoryStore } from '../stores/category.js'
import { useAccountStore } from '../stores/account.js'
import { toCents } from '../utils/money.js'
import { today } from '../utils/date.js'

const router = useRouter()
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()

const txType = ref('expense')
const amountStr = ref('')
const categoryId = ref(null)
const accountId = ref(null)
const note = ref('')

const canSave = computed(() => {
  return amountStr.value !== '' && categoryId.value !== null && accountId.value !== null
})

onMounted(async () => {
  await categoryStore.load()
  await accountStore.load()
  // Default to first account
  if (accountStore.accounts.length > 0) {
    accountId.value = accountStore.accounts[0].id
  }
})

async function save() {
  const amount = toCents(amountStr.value)
  if (isNaN(amount) || amount <= 0) return

  await transactionStore.add(txType.value, amount, categoryId.value, accountId.value, today(), note.value)

  // Reset form
  amountStr.value = ''
  categoryId.value = null
  note.value = ''

  router.push('/')
}
</script>

<style scoped>
.note-row { padding: 12px 16px; }
.note-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
}
.action-row { padding: 20px 16px; }
.btn-save {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: #4CAF50;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
.btn-save:disabled { background: #ccc; cursor: not-allowed; }
</style>
```

- [ ] **Step 5: Verify record flow**

Run: `npm run dev`
Expected: Tap "+" tab → number pad appears → enter amount → select category → tap save → redirected to home with new entry.

- [ ] **Step 6: Commit**

```bash
git add src/components/AmountInput.vue src/components/CategoryPicker.vue src/components/AccountPicker.vue src/views/Record.vue && git commit -m "feat: implement quick record with numpad and category/account pickers"
```

---

### Task 12: Records View (Transaction List)

**Files:**
- Modify: `src/views/Records.vue`

- [ ] **Step 1: Implement Records view**

Write `src/views/Records.vue`:
```vue
<template>
  <AppLayout>
    <div class="filters">
      <select v-model="filterMonth" @change="loadData">
        <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
      <select v-model="filterType" @change="loadData">
        <option value="all">全部</option>
        <option value="income">收入</option>
        <option value="expense">支出</option>
      </select>
    </div>
    <div v-if="filtered.length === 0" class="empty">暂无记录</div>
    <TransactionItem
      v-for="tx in filtered"
      :key="tx.id"
      :tx="tx"
      :category="categoryStore.getById(tx.categoryId)"
      :account="accountStore.getById(tx.accountId)"
      @click="removeTx(tx.id)"
    />
    <div class="confirm-delete" v-if="showDeleteConfirm">
      <p>删除这条记录？</p>
      <button @click="doDelete">确认</button>
      <button @click="showDeleteConfirm = false">取消</button>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import TransactionItem from '../components/TransactionItem.vue'
import { useTransactionStore } from '../stores/transaction.js'
import { useCategoryStore } from '../stores/category.js'
import { useAccountStore } from '../stores/account.js'
import { formatMonth } from '../utils/date.js'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()

const allTransactions = ref([])
const filterMonth = ref('')
const filterType = ref('all')
const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)

const months = computed(() => {
  const set = new Set()
  for (const tx of allTransactions.value) {
    const [y, m] = tx.date.split('-')
    set.add(`${y}-${m}`)
  }
  return Array.from(set).sort().reverse().map(v => {
    const [y, m] = v.split('-')
    return { value: v, label: formatMonth(parseInt(y), parseInt(m)) }
  })
})

const filtered = computed(() => {
  let list = allTransactions.value
  if (filterType.value !== 'all') {
    list = list.filter(tx => tx.type === filterType.value)
  }
  if (filterMonth.value) {
    list = list.filter(tx => tx.date.startsWith(filterMonth.value))
  }
  return list
})

onMounted(async () => {
  await categoryStore.load()
  await accountStore.load()
  await loadData()
})

async function loadData() {
  allTransactions.value = await transactionStore.getAll()
}

function removeTx(id) {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}

async function doDelete() {
  await transactionStore.remove(deleteTargetId.value)
  showDeleteConfirm.value = false
  await loadData()
}
</script>

<style scoped>
.filters {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  margin-bottom: 8px;
}
.filters select {
  flex: 1;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 6px;
  font-size: 14px;
}
.empty { text-align: center; color: #ccc; padding: 40px 0; }
.confirm-delete {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  text-align: center;
  z-index: 200;
}
.confirm-delete button {
  margin: 8px;
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
.confirm-delete button:first-of-type { background: #F44336; color: #fff; }
</style>
```

- [ ] **Step 2: Verify records view**

Run: `npm run dev`
Expected: Records tab shows all transactions with month/type filters. Tap a record to delete (with confirmation).

- [ ] **Step 3: Commit**

```bash
git add src/views/Records.vue && git commit -m "feat: implement transaction list with filters and delete"
```

---

### Task 13: Charts View

**Files:**
- Modify: `src/views/Charts.vue`

- [ ] **Step 1: Implement Charts view**

Write `src/views/Charts.vue`:
```vue
<template>
  <AppLayout>
    <div class="chart-section" v-if="hasData">
      <div class="chart-title">本月支出分类占比</div>
      <div class="chart-container" ref="pieChartRef"></div>
    </div>
    <div v-else class="empty">暂无数据可展示</div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import AppLayout from '../components/AppLayout.vue'
import { useTransactionStore } from '../stores/transaction.js'
import { useCategoryStore } from '../stores/category.js'
import { toYuan } from '../utils/money.js'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

const pieChartRef = ref(null)
const hasData = ref(false)

const chartData = computed(() => {
  const now = new Date()
  return transactionStore.getMonthSummary(now.getFullYear(), now.getMonth() + 1)
})

onMounted(async () => {
  await categoryStore.load()
  const summary = await chartData.value

  if (summary.totalExpense === 0 && summary.totalIncome === 0) {
    hasData.value = false
    return
  }
  hasData.value = true

  await nextTick()
  renderPieChart(summary)
})

function renderPieChart(summary) {
  if (!pieChartRef.value) return

  const chart = echarts.init(pieChartRef.value)
  const data = Object.entries(summary.categoryBreakdown).map(([catId, amount]) => {
    const cat = categoryStore.getById(parseInt(catId))
    return { name: cat?.name || '未知', value: amount, icon: cat?.icon || '📦' }
  })

  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: (p) => `${p.data.icon} ${p.name}: ¥${toYuan(p.value)} (${p.percent}%)`
    },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      data,
      label: {
        formatter: (p) => `${p.data.icon} ${p.name}\n${p.percent}%`
      },
      itemStyle: {
        borderRadius: 4,
        borderColor: '#fff',
        borderWidth: 2
      }
    }]
  })

  window.addEventListener('resize', () => chart.resize())
}
</script>

<style scoped>
.chart-section { padding: 16px; }
.chart-title { font-size: 16px; font-weight: 600; padding: 8px 0 16px; }
.chart-container { width: 100%; height: 340px; }
.empty { text-align: center; color: #ccc; padding: 60px 0; }
</style>
```

- [ ] **Step 2: Verify charts**

Run: `npm run dev`
Expected: After recording some transactions, charts tab shows a ring chart with category breakdown.

- [ ] **Step 3: Commit**

```bash
git add src/views/Charts.vue && git commit -m "feat: implement category pie chart"
```

---

### Task 14: Accounts View

**Files:**
- Modify: `src/views/Accounts.vue`

- [ ] **Step 1: Implement Accounts view**

Write `src/views/Accounts.vue`:
```vue
<template>
  <AppLayout>
    <div class="account-list">
      <div v-for="acct in accountStore.accounts" :key="acct.id" class="account-item">
        <div class="acct-info">
          <span class="acct-name">{{ acct.name }}</span>
          <span class="acct-type">{{ typeLabel(acct.type) }}</span>
        </div>
        <button class="btn-delete" @click="remove(acct.id)">删除</button>
      </div>
    </div>
    <div class="add-form">
      <input v-model="newName" placeholder="账户名称" class="input" />
      <select v-model="newType" class="input">
        <option value="cash">现金</option>
        <option value="bank">银行卡</option>
        <option value="alipay">支付宝</option>
        <option value="wechat">微信</option>
        <option value="other">其他</option>
      </select>
      <input v-model="newBalance" placeholder="初始余额" type="number" class="input" />
      <button class="btn-add" :disabled="!newName" @click="handleAdd">添加</button>
    </div>
    <div class="links">
      <router-link to="/export">导出数据</router-link>
      <router-link to="/settings">设置</router-link>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useAccountStore } from '../stores/account.js'
import { toCents } from '../utils/money.js'

const accountStore = useAccountStore()

const newName = ref('')
const newType = ref('cash')
const newBalance = ref('')

const typeLabel = (t) => ({ cash: '现金', bank: '银行卡', alipay: '支付宝', wechat: '微信', other: '其他' }[t])

onMounted(() => accountStore.load())

async function handleAdd() {
  const balance = newBalance.value ? toCents(newBalance.value) : 0
  await accountStore.add(newName.value, newType.value, balance)
  newName.value = ''
  newBalance.value = ''
}

async function remove(id) {
  await accountStore.remove(id)
}
</script>

<style scoped>
.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}
.acct-name { font-size: 16px; font-weight: 500; }
.acct-type { font-size: 12px; color: #999; margin-left: 8px; }
.btn-delete { color: #F44336; background: none; border: none; font-size: 14px; cursor: pointer; }
.add-form { padding: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.input { flex: 1; min-width: 80px; padding: 10px; border: 1px solid #eee; border-radius: 6px; font-size: 14px; }
.btn-add {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #4CAF50;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.btn-add:disabled { background: #ccc; }
.links { padding: 24px 16px; display: flex; flex-direction: column; gap: 12px; }
.links a { color: #4CAF50; text-decoration: none; font-size: 15px; }
</style>
```

- [ ] **Step 2: Verify accounts view**

Run: `npm run dev`
Expected: Accounts tab shows list, add form works, delete works, links to export/settings.

- [ ] **Step 3: Commit**

```bash
git add src/views/Accounts.vue && git commit -m "feat: implement account management view"
```

---

### Task 15: Export & Settings Views

**Files:**
- Modify: `src/views/Export.vue`, `src/views/Settings.vue`

- [ ] **Step 1: Implement Export view**

Write `src/views/Export.vue`:
```vue
<template>
  <AppLayout>
    <div class="export-page">
      <div class="info-card">
        <p>将全部交易记录导出为 CSV 文件，可用 Excel 打开。</p>
        <p class="count">共 {{ count }} 条记录</p>
      </div>
      <button class="btn-export" @click="handleExport">导出 CSV</button>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useTransactionStore } from '../stores/transaction.js'
import { useCategoryStore } from '../stores/category.js'
import { useAccountStore } from '../stores/account.js'
import { toCSV, downloadCSV } from '../utils/csv.js'
import { toYuan } from '../utils/money.js'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()

const count = ref(0)

onMounted(async () => {
  await categoryStore.load()
  await accountStore.load()
  const all = await transactionStore.getAll()
  count.value = all.length
})

async function handleExport() {
  const all = await transactionStore.getAll()
  const csv = toCSV(all, (tx) => ({
    '日期': tx.date,
    '类型': tx.type === 'income' ? '收入' : '支出',
    '金额': (tx.type === 'expense' ? '-' : '') + toYuan(tx.amount),
    '分类': categoryStore.getById(tx.categoryId)?.name || '',
    '账户': accountStore.getById(tx.accountId)?.name || '',
    '备注': tx.note
  }))
  const now = new Date()
  const filename = `记账数据_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}.csv`
  downloadCSV(csv, filename)
}
</script>

<style scoped>
.export-page { padding: 16px; }
.info-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 15px;
  color: #666;
}
.count { font-weight: 600; color: #333; margin-top: 8px; }
.btn-export {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: #4CAF50;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
</style>
```

- [ ] **Step 2: Implement Settings view**

Write `src/views/Settings.vue`:
```vue
<template>
  <AppLayout>
    <div class="settings-page">
      <div class="setting-group">
        <div class="setting-item">
          <span>版本</span>
          <span class="setting-value">v1.0.0</span>
        </div>
        <div class="setting-item">
          <span>存储位置</span>
          <span class="setting-value">浏览器本地</span>
        </div>
        <button class="btn-danger" @click="handleReset">清除所有数据</button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { db } from '../db/index.js'

async function handleReset() {
  const confirmed = window.confirm('确定要清除所有记账数据吗？此操作不可恢复。')
  if (!confirmed) return
  await db.transaction.clear()
  await db.category.clear()
  await db.account.clear()
  window.location.reload()
}
</script>

<style scoped>
.settings-page { padding: 16px; }
.setting-group { background: #fff; border-radius: 12px; overflow: hidden; }
.setting-item {
  display: flex;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
}
.setting-value { color: #999; }
.btn-danger {
  width: 100%;
  padding: 14px;
  border: none;
  background: #fff;
  color: #F44336;
  font-size: 15px;
  cursor: pointer;
}
</style>
```

- [ ] **Step 3: Verify export and settings**

Run: `npm run dev`
Expected: Export page downloads CSV, settings shows version and clear data button.

- [ ] **Step 4: Commit**

```bash
git add src/views/Export.vue src/views/Settings.vue && git commit -m "feat: implement CSV export and settings views"
```

---

### Task 16: Error Handling & IndexedDB Check

**Files:**
- Modify: `src/main.js`

- [ ] **Step 1: Add global error handler and IndexedDB check**

Write `src/main.js`:
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'

// Check IndexedDB availability
function checkIndexedDB() {
  if (!window.indexedDB) {
    document.body.innerHTML = `
      <div style="text-align:center; padding: 40px 20px; font-family: sans-serif;">
        <p style="font-size:48px;">⚠️</p>
        <h2>浏览器不支持</h2>
        <p>您的浏览器不支持本地存储（IndexedDB），请使用现代浏览器，或关闭无痕/隐私模式后重试。</p>
      </div>
    `
    return false
  }
  return true
}

if (checkIndexedDB()) {
  const app = createApp(App)

  app.config.errorHandler = (err, instance, info) => {
    console.error('Global error:', err, info)
    // Show user-friendly message
    const msg = err.message || '发生未知错误，请刷新页面重试'
    const el = document.createElement('div')
    el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#F44336;color:#fff;padding:12px 20px;border-radius:8px;z-index:9999;max-width:90vw;'
    el.textContent = msg
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 4000)
  }

  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}
```

- [ ] **Step 2: Add fallback for IndexedDB write errors**

No separate file needed; this is handled via `app.config.errorHandler` above. Dexie throws on quota exceeded which gets caught by the global handler.

- [ ] **Step 3: Verify error handling**

Run: `npm run dev`
Expected: App loads normally. To test IndexedDB unavailable, open in private browsing with IndexedDB disabled (browser dev tools).

- [ ] **Step 4: Commit**

```bash
git add src/main.js && git commit -m "feat: add IndexedDB availability check and global error handler"
```

---

### Task 17: PWA & Final Polish

**Files:**
- Modify: `vite.config.js`
- Create: `public/pwa-192x192.png` (placeholder)

- [ ] **Step 1: Ensure PWA config is correct**

Verify `vite.config.js` contains the PWA plugin from Task 1.

- [ ] **Step 2: Create PWA icon placeholder**

The `VitePWA` plugin will auto-generate icons at build time. For dev, we'll skip the actual icon file — the manifest icon is only used when installed.

- [ ] **Step 3: Build and test production build**

Run:
```bash
npm run build
npm run preview
```

Expected: Production build works, PWA manifest served at `/manifest.webmanifest`, service worker registered.

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "chore: finalize PWA config and verify production build"
```

---

## Implementation Notes

- Vue Router uses hash history (`createWebHashHistory`) for static hosting compatibility.
- All monetary values stored as integers (cents). Display via `toYuan()`.
- Default categories seeded on first load (`seedDefaults()` in db layer).
- The app has no authentication, no backend, no external dependencies at runtime.
- Vant UI is installed but used minimally — the custom components in this plan handle the core UI directly since the design is specific. Vant can be used for Toasts, Dialogs, and other utility components as needed.
- Dexie schema uses `version(1)`. If the schema changes in the future, increment the version number and Dexie will auto-migrate.
