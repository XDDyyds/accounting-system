<template>
  <AppLayout>
    <div class="filters">
      <select v-model="filterMonth">
        <option value="">全部月份</option>
        <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
      <select v-model="filterType">
        <option value="all">全部</option>
        <option value="income">收入</option>
        <option value="expense">支出</option>
      </select>
    </div>
    <div v-if="filtered.length === 0" class="empty">暂无记录</div>
    <div v-else class="tx-list">
      <TransactionItem
        v-for="tx in filtered"
        :key="tx.id"
        :tx="tx"
        :category="categoryStore.getById(tx.categoryId)"
        :account="accountStore.getById(tx.accountId)"
        @click="confirmDelete(tx.id)"
      />
    </div>
    <div v-if="showConfirm" class="overlay" @click.self="showConfirm = false">
      <div class="confirm-dialog">
        <p class="confirm-text">删除这条记录？</p>
        <p class="confirm-hint">此操作不可恢复</p>
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
  allTransactions.value = await transactionStore.getAll()
})

function confirmDelete(id) {
  deleteTargetId.value = id
  showConfirm.value = true
}

async function doDelete() {
  await transactionStore.remove(deleteTargetId.value)
  showConfirm.value = false
  allTransactions.value = await transactionStore.getAll()
}
</script>

<style scoped>
.filters {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
}
.filters select {
  flex: 1;
  padding: 10px 12px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  background: var(--color-surface);
  color: var(--color-text);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B8E80' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
}
.tx-list {
  margin: 0 16px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.empty { text-align: center; color: var(--color-text-muted); padding: 48px 0; font-size: 15px; }

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 36, 24, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.confirm-dialog {
  background: var(--color-surface);
  padding: 28px 24px 20px;
  border-radius: var(--radius-lg);
  text-align: center;
  min-width: 280px;
  box-shadow: var(--shadow-lg);
}
.confirm-text { font-size: 17px; font-weight: 500; color: var(--color-text); margin-bottom: 4px; }
.confirm-hint { font-size: 13px; color: var(--color-text-secondary); margin-bottom: 20px; }
.confirm-actions { display: flex; gap: 12px; }
.btn-cancel, .btn-confirm {
  flex: 1;
  padding: 11px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.15s;
}
.btn-cancel:active, .btn-confirm:active { transform: scale(0.97); }
.btn-cancel { background: var(--color-bg); color: var(--color-text); }
.btn-confirm { background: var(--color-danger); color: #fff; }
</style>
