<template>
  <div class="tx-item">
    <span class="tx-icon">{{ category?.icon || '📦' }}</span>
    <div class="tx-info">
      <span class="tx-name">{{ category?.name || '未知' }}</span>
      <span class="tx-meta">{{ accountName }} {{ tx.note }}</span>
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
  padding: 14px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}
.tx-item:active { background: #f9f9f9; }
.tx-icon { font-size: 32px; margin-right: 12px; flex-shrink: 0; }
.tx-info { flex: 1; min-width: 0; }
.tx-name { display: block; font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tx-meta { display: block; font-size: 12px; color: #999; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tx-amount { font-size: 18px; font-weight: 600; flex-shrink: 0; margin-left: 8px; }
.tx-amount.income { color: #4CAF50; }
.tx-amount.expense { color: #F44336; }
</style>
