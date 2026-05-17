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
        <span>{{ acct.name }}</span>
        <span v-if="modelValue === acct.id" class="check">✓</span>
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
</script>

<style scoped>
.picker-label { padding: 8px 16px; font-size: 14px; color: #999; }
.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  font-size: 16px;
  cursor: pointer;
  box-sizing: border-box;
}
.account-item.selected { background: #E8F5E9; }
.check { color: #4CAF50; font-weight: 700; }
</style>
