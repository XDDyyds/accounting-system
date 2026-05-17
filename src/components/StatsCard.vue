<template>
  <div class="stats-card">
    <div class="stats-row">
      <div class="stats-item">
        <span class="stats-label">本月支出</span>
        <span class="stats-value stats-value--expense">¥{{ expenseStr }}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">本月收入</span>
        <span class="stats-value stats-value--income">¥{{ incomeStr }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { toYuan } from '../utils/money.js'

const props = defineProps({
  totalIncome: { type: Number, default: 0 },
  totalExpense: { type: Number, default: 0 }
})

const incomeStr = computed(() => toYuan(props.totalIncome))
const expenseStr = computed(() => toYuan(props.totalExpense))
</script>

<style scoped>
.stats-card {
  margin: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
}
.stats-row { display: flex; justify-content: space-around; }
.stats-item { text-align: center; }
.stats-label { display: block; color: #999; font-size: 14px; margin-bottom: 8px; }
.stats-value { font-size: 28px; font-weight: 700; }
.stats-value--expense { color: #F44336; }
.stats-value--income { color: #4CAF50; }
</style>
