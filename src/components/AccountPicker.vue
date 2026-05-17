<template>
  <div class="account-picker">
    <div class="picker-label">选择账户</div>
    <div class="account-list">
      <button
        v-for="acct in accounts"
        :key="acct.id"
        class="account-item"
        :class="{ selected: modelValue === acct.id }"
        @click="$emit('update:modelValue', acct.id)"
      >
        <span class="acct-name">{{ acct.name }}</span>
        <span class="acct-type">{{ typeLabel(acct.type) }}</span>
        <span v-if="modelValue === acct.id" class="check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  accounts: { type: Array, required: true },
  modelValue: { type: Number, default: null }
})
defineEmits(['update:modelValue'])

const typeLabel = (t) => ({ cash: '现金', bank: '银行卡', alipay: '支付宝', wechat: '微信', other: '其他' }[t] || t)
</script>

<style scoped>
.picker-label {
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.03em;
}
.account-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 15px;
  cursor: pointer;
  box-sizing: border-box;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.account-item:active { background: var(--color-bg); }
.account-item.selected { background: var(--color-accent-light); }
.acct-name { font-weight: 500; }
.acct-type {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-left: 8px;
}
.check {
  margin-left: auto;
  color: var(--color-accent);
  display: flex;
  align-items: center;
}
</style>
