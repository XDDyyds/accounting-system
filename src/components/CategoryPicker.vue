<template>
  <div class="category-picker">
    <div class="picker-label">选择分类</div>
    <div class="category-grid">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="category-item"
        :class="{ selected: modelValue === cat.id }"
        @click="$emit('update:modelValue', cat.id)"
      >
        <span class="cat-icon">{{ cat.icon }}</span>
        <span class="cat-name">{{ cat.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, required: true },
  modelValue: { type: Number, default: null }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.picker-label {
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.03em;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 0 16px;
}
.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 4px 10px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.category-item:active { transform: scale(0.96); }
.category-item.selected {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}
.cat-icon { font-size: 26px; line-height: 1; }
.cat-name {
  font-size: 11px;
  margin-top: 5px;
  color: var(--color-text-secondary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.category-item.selected .cat-name {
  color: var(--color-accent);
}
</style>
