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
.picker-label { padding: 8px 16px; font-size: 14px; color: #999; }
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
  padding: 10px 4px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}
.category-item.selected { border-color: #4CAF50; background: #E8F5E9; }
.cat-icon { font-size: 28px; }
.cat-name { font-size: 12px; margin-top: 4px; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
</style>
