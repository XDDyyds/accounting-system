import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTransactionStore } from './transaction.js'

vi.mock('../db/index.js', () => ({
  db: {
    transactions: {
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
      toArray: vi.fn(() => Promise.resolve([])),
      delete: vi.fn()
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

vi.mock('../utils/date.js', () => ({
  getMonthRange: vi.fn((year, month) => [`${year}-05-01`, `${year}-05-31`])
}))

describe('useTransactionStore', () => {
  let db

  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    db = (await import('../db/index.js')).db
  })

  it('adds transaction with correct fields', async () => {
    db.transactions.add.mockResolvedValue(1)

    const store = useTransactionStore()
    await store.add('expense', 2800, 1, 1, '2026-05-17', '午餐')

    const arg = db.transactions.add.mock.calls[0][0]
    expect(arg.type).toBe('expense')
    expect(arg.amount).toBe(2800)
    expect(arg.categoryId).toBe(1)
    expect(arg.accountId).toBe(1)
    expect(arg.date).toBe('2026-05-17')
    expect(arg.note).toBe('午餐')
  })

  it('getMonthSummary calculates totals correctly', async () => {
    const mockTxs = [
      { id: 1, type: 'expense', amount: 2800, categoryId: 1, date: '2026-05-17' },
      { id: 2, type: 'expense', amount: 1200, categoryId: 2, date: '2026-05-17' },
      { id: 3, type: 'income', amount: 500000, categoryId: 10, date: '2026-05-01' }
    ]

    // Mock the chained query
    const mockBetweenMethod = { toArray: vi.fn().mockResolvedValue(mockTxs) }
    const mockReverse = { sortBy: vi.fn().mockResolvedValue(mockTxs) }
    db.transactions.where.mockReturnValue({
      between: vi.fn(() => ({ reverse: vi.fn(() => mockReverse) }))
    })

    const store = useTransactionStore()
    const summary = await store.getMonthSummary(2026, 5)

    expect(summary.totalIncome).toBe(500000)
    expect(summary.totalExpense).toBe(4000) // 2800 + 1200
    expect(summary.categoryBreakdown[1]).toBe(2800)
    expect(summary.categoryBreakdown[2]).toBe(1200)
  })

  it('getRecent returns limited results', async () => {
    const mockTxs = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const mockLimit = { toArray: vi.fn().mockResolvedValue(mockTxs) }
    db.transactions.orderBy.mockReturnValue({
      reverse: vi.fn(() => ({ limit: vi.fn(() => mockLimit) }))
    })

    const store = useTransactionStore()
    const result = await store.getRecent(3)
    expect(result).toHaveLength(3)
  })

  it('getAll returns all transactions', async () => {
    const mockTxs = [{ id: 1 }, { id: 2 }]
    db.transactions.orderBy.mockReturnValue({
      reverse: vi.fn(() => ({ toArray: vi.fn().mockResolvedValue(mockTxs) }))
    })

    const store = useTransactionStore()
    const result = await store.getAll()
    expect(result).toHaveLength(2)
  })

  it('remove deletes transaction', async () => {
    db.transactions.delete.mockResolvedValue(undefined)
    const store = useTransactionStore()
    await store.remove(1)
    expect(db.transactions.delete).toHaveBeenCalledWith(1)
  })
})
