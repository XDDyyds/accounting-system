import { describe, it, expect, beforeAll } from 'vitest'
import { db, Transaction, Category, Account } from './index.js'

describe('database', () => {
  beforeAll(async () => {
    // Dexie with indexedDB in happy-dom needs fake-indexeddb — skipping in happy-dom
  })

  it('should define Transaction, Category, Account tables', () => {
    expect(db.transaction).toBeDefined()
    expect(db.category).toBeDefined()
    expect(db.account).toBeDefined()
  })
})
