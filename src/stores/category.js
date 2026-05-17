import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, Category } from '../db/index.js'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])

  const expenseCategories = computed(() =>
    categories.value
      .filter(c => c.type === 'expense')
      .sort((a, b) => a.sortOrder - b.sortOrder)
  )

  const incomeCategories = computed(() =>
    categories.value
      .filter(c => c.type === 'income')
      .sort((a, b) => a.sortOrder - b.sortOrder)
  )

  async function load() {
    const existing = await db.category.orderBy('sortOrder').toArray()
    if (existing.length > 0) {
      categories.value = existing
      return
    }

    const defaults = [
      ...DEFAULT_EXPENSE_CATEGORIES.map((c) => new Category(c.name, c.type, c.icon, c.sortOrder)),
      ...DEFAULT_INCOME_CATEGORIES.map((c) => new Category(c.name, c.type, c.icon, c.sortOrder))
    ]
    await db.category.bulkAdd(defaults)
    categories.value = await db.category.orderBy('sortOrder').toArray()
  }

  function getById(id) {
    return categories.value.find(c => c.id === id)
  }

  return { categories, expenseCategories, incomeCategories, load, getById }
})
