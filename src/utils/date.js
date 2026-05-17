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
  return `${m}月${d}日`
}

export function formatMonth(year, month) {
  return `${year}年${String(month).padStart(2, '0')}月`
}
