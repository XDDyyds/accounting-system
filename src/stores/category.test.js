import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCategoryStore } from './category.js'

// Mock the db module
vi.mock('../db/index.js', () => ({
  db: {
    category: {
      toArray: vi.fn(),
      orderBy: vi.fn(),
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
  let db

  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    db = (await import('../db/index.js')).db
  })

  it('loads defaults when DB is empty', async () => {
    db.category.orderBy.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([])
    })
    const store = useCategoryStore()
    await store.load()

    expect(db.category.bulkAdd).toHaveBeenCalled()
    const callArg = db.category.bulkAdd.mock.calls[0][0]
    expect(callArg.length).toBe(3) // 2 expense + 1 income defaults
  })

  it('does not re-seed if categories exist', async () => {
    db.category.orderBy.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([
        { id: 1, name: '餐饮', type: 'expense', icon: '🍜', sortOrder: 0 }
      ])
    })
    const store = useCategoryStore()
    await store.load()

    expect(db.category.bulkAdd).not.toHaveBeenCalled()
  })

  it('separates expense and income categories', async () => {
    db.category.orderBy.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([
        { id: 1, name: '餐饮', type: 'expense', icon: '🍜', sortOrder: 1 },
        { id: 2, name: '交通', type: 'expense', icon: '🚌', sortOrder: 0 },
        { id: 3, name: '工资', type: 'income', icon: '💰', sortOrder: 0 }
      ])
    })
    const store = useCategoryStore()
    await store.load()

    expect(store.expenseCategories).toHaveLength(2)
    expect(store.incomeCategories).toHaveLength(1)
    // Should be sorted by sortOrder
    expect(store.expenseCategories[0].name).toBe('交通') // sortOrder 0
    expect(store.expenseCategories[1].name).toBe('餐饮') // sortOrder 1
  })

  it('getById returns correct category', async () => {
    db.category.orderBy.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([
        { id: 42, name: '餐饮', type: 'expense', icon: '🍜', sortOrder: 0 }
      ])
    })
    const store = useCategoryStore()
    await store.load()

    expect(store.getById(42)?.name).toBe('餐饮')
    expect(store.getById(99)).toBeUndefined()
  })
})
