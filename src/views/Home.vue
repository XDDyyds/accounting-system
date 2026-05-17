<template>
  <AppLayout>
    <StatsCard :total-income="summary.totalIncome" :total-expense="summary.totalExpense" />
    <div class="section-header">最近交易</div>
    <div v-if="recent.length === 0" class="empty">暂无记录，快去记一笔吧</div>
    <TransactionItem
      v-for="tx in recent"
      :key="tx.id"
      :tx="tx"
      :category="categoryStore.getById(tx.categoryId)"
      :account="accountStore.getById(tx.accountId)"
    />
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
  padding: 12px 16px 8px;
  font-size: 14px;
  color: #999;
}
.empty {
  text-align: center;
  color: #ccc;
  padding: 40px 0;
}
</style>
