import Dexie from 'dexie'

export const db = new Dexie('AccountBook')

db.version(2).stores({
  transactions: '++id, type, categoryId, accountId, date, createdAt',
  category: '++id, type, sortOrder',
  account: '++id, sortOrder'
})

export class Transaction {
  constructor(type, amount, categoryId, accountId, date, note = '', createdAt) {
    if (!['income', 'expense'].includes(type)) throw new Error(`Invalid transaction type: ${type}`)
    if (!Number.isInteger(amount)) throw new Error(`Amount must be an integer (cents), got: ${amount}`)
    this.type = type
    this.amount = amount
    this.categoryId = categoryId
    this.accountId = accountId
    this.date = date
    this.note = note
    this.createdAt = createdAt ?? Date.now()
  }
}

export class Category {
  constructor(name, type, icon, sortOrder = 0) {
    if (!['income', 'expense'].includes(type)) throw new Error(`Invalid category type: ${type}`)
    this.name = name
    this.type = type
    this.icon = icon
    this.sortOrder = sortOrder
  }
}

export class Account {
  constructor(name, type, initialBalance = 0, sortOrder = 0) {
    if (!['cash', 'bank', 'alipay', 'wechat', 'other'].includes(type)) throw new Error(`Invalid account type: ${type}`)
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
    ...DEFAULT_EXPENSE_CATEGORIES.map((c, i) => new Category(c.name, c.type, c.icon, c.sortOrder ?? i)),
    ...DEFAULT_INCOME_CATEGORIES.map((c, i) => new Category(c.name, c.type, c.icon, c.sortOrder ?? i))
  ])

  const acctCount = await db.account.count()
  if (acctCount > 0) return

  await db.account.bulkAdd([
    new Account('现金', 'cash', 0, 0),
    new Account('支付宝', 'alipay', 0, 1),
    new Account('微信', 'wechat', 0, 2)
  ])
}
