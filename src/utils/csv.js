function escape(value) {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function toCSV(rows, mapRow) {
  if (rows.length === 0) return Object.keys(mapRow({})).join(',')

  const columns = Object.keys(mapRow(rows[0]))
  const header = columns.join(',')
  const lines = rows.map(row => {
    const obj = mapRow(row)
    return columns.map(col => escape(obj[col])).join(',')
  })
  return [header, ...lines].join('\n')
}

export function downloadCSV(csvContent, filename) {
  const BOM = '﻿'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
