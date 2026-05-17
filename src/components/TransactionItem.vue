<template>
  <div class="tx-item">
    <div class="tx-icon-wrap">
      <span class="tx-icon">{{ category?.icon || '📦' }}</span>
    </div>
    <div class="tx-info">
      <span class="tx-name">{{ category?.name || '未知' }}</span>
      <span class="tx-meta">{{ accountName }}<span v-if="tx.note"> · {{ tx.note }}</span></span>
    </div>
    <span class="tx-amount" :class="tx.type">
      {{ formatMoney(tx.amount, tx.type) }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatMoney } from '../utils/money.js'

const props = defineProps({
  tx: { type: Object, required: true },
  category: { type: Object, default: null },
  account: { type: Object, default: null }
})

const accountName = computed(() => props.account?.name || '')
</script>

<style scoped>
.tx-item {
  display: flex;
  align-items: center;
  padding: 16px 16px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  transition: background 0.15s;
}
.tx-item:first-of-type {
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}
.tx-item:last-of-type {
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  border-bottom: none;
}
.tx-item:only-of-type {
  border-radius: var(--radius-md);
}
.tx-item:active { background: var(--color-bg); }

.tx-icon-wrap {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  margin-right: 12px;
  flex-shrink: 0;
}
.tx-icon { font-size: 24px; line-height: 1; }

.tx-info {
  flex: 1;
  min-width: 0;
}
.tx-name {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tx-meta {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tx-amount {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 400;
  flex-shrink: 0;
  margin-left: 12px;
  letter-spacing: -0.01em;
}
.tx-amount.income { color: var(--color-income); }
.tx-amount.expense { color: var(--color-expense); }
</style>
