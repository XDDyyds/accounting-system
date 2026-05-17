import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db, Account } from '../db/index.js'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref([])

  async function load() {
    accounts.value = await db.account.orderBy('sortOrder').toArray()
  }

  async function add(name, type, initialBalance = 0) {
    const sortOrder = accounts.value.length
    const id = await db.account.add(new Account(name, type, initialBalance, sortOrder))
    await load()
    return id
  }

  async function update(id, updates) {
    await db.account.update(id, updates)
    await load()
  }

  async function remove(id) {
    await db.account.delete(id)
    await load()
  }

  function getById(id) {
    return accounts.value.find(a => a.id === id)
  }

  return { accounts, load, add, update, remove, getById }
})
