<template>
  <div class="stats-card">
    <div class="stats-row">
      <div class="stats-item">
        <span class="stats-label">本月支出</span>
        <span class="stats-value expense">¥{{ expenseStr }}</span>
      </div>
      <div class="stats-divider"></div>
      <div class="stats-item">
        <span class="stats-label">本月收入</span>
        <span class="stats-value income">¥{{ incomeStr }}</span>
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
  margin: 16px 16px 20px;
  padding: 24px 20px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
.stats-row {
  display: flex;
  align-items: center;
}
.stats-item {
  flex: 1;
  text-align: center;
}
.stats-divider {
  width: 1px;
  height: 48px;
  background: var(--color-border);
  flex-shrink: 0;
}
.stats-label {
  display: block;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}
.stats-value {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1;
}
.stats-value.expense { color: var(--color-expense); }
.stats-value.income { color: var(--color-income); }
</style>
