<template>
  <div class="amount-input">
    <div class="amount-display" :class="{ 'type-income': txType === 'income' }">
      <span class="currency">¥</span>
      <span class="value">{{ displayValue || '0' }}</span>
    </div>
    <div class="type-toggle">
      <button :class="{ active: txType === 'expense' }" @click="$emit('update:txType', 'expense')">支出</button>
      <button :class="{ active: txType === 'income' }" @click="$emit('update:txType', 'income')">收入</button>
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

const props = defineProps({ txType: { type: String, default: 'expense' } })
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
  padding: 24px 0 16px;
  font-size: 40px;
  font-weight: 700;
  color: #F44336;
}
.amount-display.type-income { color: #4CAF50; }
.currency { font-size: 28px; }
.type-toggle {
  display: flex;
  margin: 0 16px 16px;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}
.type-toggle button {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
}
.type-toggle button.active:first-child { background: #F44336; color: #fff; }
.type-toggle button.active:last-child { background: #4CAF50; color: #fff; }
.num-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #eee;
}
.num-key {
  padding: 18px;
  border: none;
  background: #fff;
  font-size: 22px;
  cursor: pointer;
}
.num-key:active { background: #f0f0f0; }
.num-key--action { color: #4CAF50; font-weight: 600; }
.num-key--zero { grid-column: span 2; }
</style>
