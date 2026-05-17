<template>
  <AppLayout>
    <div class="filters">
      <select v-model="filterMonth" @change="loadData">
        <option value="">全部月份</option>
        <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
      <select v-model="filterType" @change="loadData">
        <option value="all">全部</option>
        <option value="income">收入</option>
        <option value="expense">支出</option>
      </select>
    </div>
    <div v-if="filtered.length === 0" class="empty">暂无记录</div>
    <TransactionItem
      v-for="tx in filtered"
      :key="tx.id"
      :tx="tx"
      :category="categoryStore.getById(tx.categoryId)"
      :account="accountStore.getById(tx.accountId)"
      @click="confirmDelete(tx.id)"
    />
    <div v-if="showConfirm" class="overlay" @click.self="showConfirm = false">
      <div class="confirm-dialog">
        <p>删除这条记录？</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="showConfirm = false">取消</button>
          <button class="btn-confirm" @click="doDelete">确认删除</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import TransactionItem from '../components/TransactionItem.vue'
import { useTransactionStore } from '../stores/transaction.js'
import { useCategoryStore } from '../stores/category.js'
import { useAccountStore } from '../stores/account.js'
import { formatMonth } from '../utils/date.js'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()

const allTransactions = ref([])
const filterMonth = ref('')
const filterType = ref('all')
const showConfirm = ref(false)
const deleteTargetId = ref(null)

const months = computed(() => {
  const set = new Set()
  for (const tx of allTransactions.value) {
    const [y, m] = tx.date.split('-')
    set.add(`${y}-${m}`)
  }
  return Array.from(set).sort().reverse().map(v => {
    const [y, m] = v.split('-')
    return { value: v, label: formatMonth(parseInt(y), parseInt(m)) }
  })
})

const filtered = computed(() => {
  let list = allTransactions.value
  if (filterType.value !== 'all') {
    list = list.filter(tx => tx.type === filterType.value)
  }
  if (filterMonth.value) {
    list = list.filter(tx => tx.date.startsWith(filterMonth.value))
  }
  return list
})

onMounted(async () => {
  await categoryStore.load()
  await accountStore.load()
  await loadData()
})

async function loadData() {
  allTransactions.value = await transactionStore.getAll()
}

function confirmDelete(id) {
  deleteTargetId.value = id
  showConfirm.value = true
}

async function doDelete() {
  await transactionStore.remove(deleteTargetId.value)
  showConfirm.value = false
  await loadData()
}
</script>

<style scoped>
.filters {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  margin-bottom: 8px;
}
.filters select {
  flex: 1;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 6px;
  font-size: 14px;
}
.empty { text-align: center; color: #ccc; padding: 40px 0; }
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.confirm-dialog {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  min-width: 280px;
}
.confirm-actions { display: flex; gap: 12px; margin-top: 16px; }
.btn-cancel, .btn-confirm {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}
.btn-cancel { background: #f0f0f0; }
.btn-confirm { background: #F44336; color: #fff; }
</style>
