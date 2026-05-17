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
  it('handles February in leap year', () => {
    const [start, end] = getMonthRange(2024, 2)
    expect(end).toBe('2024-02-29')
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
