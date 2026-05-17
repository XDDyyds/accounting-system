import { describe, it, expect } from 'vitest'
import { toCSV, downloadCSV } from './csv.js'

describe('toCSV', () => {
  it('generates CSV from transactions', () => {
    const rows = [
      { date: '2026-05-17', type: 'expense', amount: 2800, categoryName: '餐饮', accountName: '微信', note: '午餐' },
      { date: '2026-05-17', type: 'income', amount: 1200000, categoryName: '工资', accountName: '工商银行', note: '' }
    ]
    const csv = toCSV(rows, (r) => ({
      '日期': r.date,
      '类型': r.type === 'income' ? '收入' : '支出',
      '金额': r.amount,
      '分类': r.categoryName,
      '账户': r.accountName,
      '备注': r.note
    }))
    expect(csv).toContain('日期,类型,金额,分类,账户,备注')
    expect(csv).toContain('2026-05-17,支出,2800,餐饮,微信,午餐')
    expect(csv).toContain('2026-05-17,收入,1200000,工资,工商银行')
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

  it('escapes double quotes in values', () => {
    const rows = [{ note: 'say "hello"' }]
    const csv = toCSV(rows, (r) => ({ '备注': r.note }))
    expect(csv).toContain('"say ""hello"""')
  })
})
