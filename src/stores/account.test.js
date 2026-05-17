import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAccountStore } from './account.js'

vi.mock('../db/index.js', () => ({
  db: {
    account: {
      orderBy: vi.fn(() => ({ toArray: vi.fn(() => Promise.resolve([])) })),
      add: vi.fn(),
      put: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(() => Promise.resolve(0)),
      bulkAdd: vi.fn()
    }
  },
  Account: class {
    constructor(name, type, initialBalance, sortOrder) {
      this.name = name
      this.type = type
      this.initialBalance = initialBalance ?? 0
      this.sortOrder = sortOrder ?? 0
    }
  }
}))

describe('useAccountStore', () => {
  let db

  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    db = (await import('../db/index.js')).db
  })

  it('loads accounts sorted', async () => {
    db.account.orderBy.mockReturnValue({ toArray: vi.fn().mockResolvedValue([
      { id: 1, name: '支付宝', type: 'alipay', initialBalance: 0, sortOrder: 1 },
      { id: 2, name: '现金', type: 'cash', initialBalance: 0, sortOrder: 0 }
    ])})
    const store = useAccountStore()
    await store.load()
    expect(store.accounts).toHaveLength(2)
  })

  it('adds account with correct fields', async () => {
    db.account.add.mockResolvedValue(1)
    db.account.orderBy.mockReturnValue({ toArray: vi.fn().mockResolvedValue([]) })

    const store = useAccountStore()
    store.accounts.value = []
    const id = await store.add('工商银行', 'bank', 500000)

    expect(db.account.add).toHaveBeenCalled()
    const arg = db.account.add.mock.calls[0][0]
    expect(arg.name).toBe('工商银行')
    expect(arg.type).toBe('bank')
    expect(arg.initialBalance).toBe(500000)
  })

  it('removes account', async () => {
    db.account.delete.mockResolvedValue(undefined)
    db.account.orderBy.mockReturnValue({ toArray: vi.fn().mockResolvedValue([]) })

    const store = useAccountStore()
    await store.remove(1)
    expect(db.account.delete).toHaveBeenCalledWith(1)
  })

  it('getById returns correct account', async () => {
    db.account.orderBy.mockReturnValue({ toArray: vi.fn().mockResolvedValue([
      { id: 5, name: '微信', type: 'wechat', initialBalance: 0, sortOrder: 0 }
    ])})
    const store = useAccountStore()
    await store.load()
    expect(store.getById(5)?.name).toBe('微信')
    expect(store.getById(99)).toBeUndefined()
  })
})
