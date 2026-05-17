<template>
  <div class="amount-input">
    <div class="amount-display" :class="{ 'type-income': txType === 'income' }">
      <span class="currency">¥</span>
      <span class="value">{{ displayValue || '0' }}</span>
      <span class="cursor" v-if="displayValue">&hairsp;</span>
    </div>
    <div class="type-toggle">
      <button
        :class="{ active: txType === 'expense' }"
        @click="$emit('update:txType', 'expense')"
      >支出</button>
      <button
        :class="{ active: txType === 'income' }"
        @click="$emit('update:txType', 'income')"
      >收入</button>
    </div>
    <div class="num-pad">
      <button v-for="n in keys" :key="n.label"
        class="num-key"
        :class="n.cls"
        @click="handleKey(n.label)">
        {{ n.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ txType: { type: String, default: 'expense' } })
const emit = defineEmits(['update:txType', 'change'])

const displayValue = ref('')

const keys = [
  { label: '1' }, { label: '2' }, { label: '3' },
  { label: '4' }, { label: '5' }, { label: '6' },
  { label: '7' }, { label: '8' }, { label: '9' },
  { label: '.', cls: 'num-key--action' }, { label: '0', cls: 'num-key--zero' }, { label: '⌫', cls: 'num-key--action' }
]

function handleKey(n) {
  if (n === '⌫') {
    displayValue.value = displayValue.value.slice(0, -1)
  } else if (n === '.') {
    if (!displayValue.value.includes('.') && displayValue.value.length > 0) {
      displayValue.value += '.'
    }
  } else {
    const parts = displayValue.value.split('.')
    if (parts[0].length >= 9) return
    if (parts[1] && parts[1].length >= 2) return
    displayValue.value += String(n)
  }
  emit('change', displayValue.value)
}
</script>

<style scoped>
.amount-display {
  text-align: center;
  padding: 28px 0 20px;
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 400;
  color: var(--color-expense);
  letter-spacing: -0.02em;
  line-height: 1.1;
  transition: color 0.25s;
}
.amount-display.type-income { color: var(--color-income); }
.currency {
  font-size: 32px;
  opacity: 0.6;
  margin-right: 4px;
}
.value { }
.cursor {
  display: inline-block;
  width: 2px;
  height: 40px;
  background: currentColor;
  opacity: 0.3;
  vertical-align: middle;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}

.type-toggle {
  display: flex;
  margin: 0 16px 16px;
  background: var(--color-border);
  border-radius: 10px;
  padding: 3px;
}
.type-toggle button {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}
.type-toggle button.active:first-child {
  background: var(--color-expense);
  color: #fff;
  box-shadow: 0 2px 8px rgba(199, 91, 74, 0.3);
}
.type-toggle button.active:last-child {
  background: var(--color-income);
  color: #fff;
  box-shadow: 0 2px 8px rgba(74, 124, 89, 0.3);
}

.num-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--color-border);
}
.num-key {
  padding: 20px;
  border: none;
  background: var(--color-surface);
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.1s;
  -webkit-tap-highlight-color: transparent;
}
.num-key:active { background: var(--color-bg); }
.num-key--action {
  font-family: var(--font-body);
  color: var(--color-accent);
  font-weight: 500;
  font-size: 16px;
}
.num-key--zero { grid-column: span 2; }
</style>
