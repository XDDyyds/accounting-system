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
  it('formats cents with sign', () => {
    expect(formatMoney(100, 'expense')).toBe('-1.00')
    expect(formatMoney(100, 'income')).toBe('+1.00')
    expect(formatMoney(0, 'expense')).toBe('0.00')
  })
})
