import { defineStore } from 'pinia'
import { db, Transaction } from '../db/index.js'
import { getMonthRange } from '../utils/date.js'

export const useTransactionStore = defineStore('transaction', () => {
  async function add(type, amount, categoryId, accountId, date, note = '') {
    const tx = new Transaction(type, amount, categoryId, accountId, date, note)
    return await db.transactions.add(tx)
  }

  async function queryByDateRange(startDate, endDate) {
    return await db.transactions
      .where('date')
      .between(startDate, endDate, true, true)
      .reverse()
      .sortBy('createdAt')
  }

  async function getRecent(limit = 10) {
    return await db.transactions
      .orderBy('createdAt')
      .reverse()
      .limit(limit)
      .toArray()
  }

  async function getMonthSummary(year, month) {
    const [start, end] = getMonthRange(year, month)
    const txs = await queryByDateRange(start, end)

    let totalIncome = 0
    let totalExpense = 0
    const categoryBreakdown = {}

    for (const tx of txs) {
      if (tx.type === 'income') {
        totalIncome += tx.amount
      } else {
        totalExpense += tx.amount
        categoryBreakdown[tx.categoryId] = (categoryBreakdown[tx.categoryId] || 0) + tx.amount
      }
    }

    return { totalIncome, totalExpense, categoryBreakdown }
  }

  async function getAll() {
    return await db.transactions.orderBy('createdAt').reverse().toArray()
  }

  async function remove(id) {
    await db.transactions.delete(id)
  }

  return { add, queryByDateRange, getRecent, getMonthSummary, getAll, remove }
})
