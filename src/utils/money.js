export function toYuan(cents) {
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  const yuan = Math.floor(abs / 100)
  const fen = abs % 100
  return `${sign}${yuan}.${String(fen).padStart(2, '0')}`
}

export function toCents(yuanStr) {
  const trimmed = yuanStr.trim()
  if (!/^-?\d+(\.\d{1,2})?$/.test(trimmed)) return NaN
  const num = parseFloat(trimmed)
  return Math.round(num * 100)
}

export function formatMoney(cents, type) {
  if (!['income', 'expense'].includes(type)) {
    return toYuan(cents)
  }
  if (cents === 0) return '0.00'
  const sign = type === 'income' ? '+' : '-'
  return sign + toYuan(Math.abs(cents))
}
