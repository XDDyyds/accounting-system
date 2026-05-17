<template>
  <AppLayout>
    <StatsCard :total-income="summary.totalIncome" :total-expense="summary.totalExpense" />
    <div class="section-header">最近交易</div>
    <div v-if="recent.length === 0" class="empty">暂无记录，快去记一笔吧</div>
    <div v-else class="tx-list">
      <TransactionItem
        v-for="(tx, i) in recent"
        :key="tx.id"
        :tx="tx"
        :category="categoryStore.getById(tx.categoryId)"
        :account="accountStore.getById(tx.accountId)"
        :style="{ animationDelay: `${i * 40}ms` }"
        class="tx-enter"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import StatsCard from '../components/StatsCard.vue'
import TransactionItem from '../components/TransactionItem.vue'
import { useTransactionStore } from '../stores/transaction.js'
import { useCategoryStore } from '../stores/category.js'
import { useAccountStore } from '../stores/account.js'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()

const summary = ref({ totalIncome: 0, totalExpense: 0 })
const recent = ref([])

onMounted(async () => {
  await categoryStore.load()
  await accountStore.load()
  const now = new Date()
  summary.value = await transactionStore.getMonthSummary(now.getFullYear(), now.getMonth() + 1)
  recent.value = await transactionStore.getRecent(10)
})
</script>

<style scoped>
.section-header {
  padding: 8px 16px 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.03em;
}
.tx-list {
  margin: 0 16px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: 48px 0;
  font-size: 15px;
}
.tx-enter {
  animation: slideUp 0.35s ease-out both;
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
