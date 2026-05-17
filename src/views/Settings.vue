<template>
  <AppLayout>
    <div class="settings-page">
      <div class="setting-group">
        <div class="setting-item">
          <span>版本</span>
          <span class="setting-value">v1.0.0</span>
        </div>
        <div class="setting-item">
          <span>存储位置</span>
          <span class="setting-value">浏览器本地</span>
        </div>
      </div>
      <div class="setting-group" style="margin-top: 16px;">
        <button class="btn-danger" @click="handleReset">清除所有数据</button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { db } from '../db/index.js'

async function handleReset() {
  const confirmed = window.confirm('确定要清除所有记账数据吗？此操作不可恢复。')
  if (!confirmed) return
  await db.transactions.clear()
  await db.category.clear()
  await db.account.clear()
  window.location.reload()
}
</script>

<style scoped>
.settings-page { padding: 16px; }
.setting-group {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.setting-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 16px;
  border-bottom: 1px solid var(--color-border);
  font-size: 15px;
}
.setting-item:last-child { border-bottom: none; }
.setting-value { color: var(--color-text-secondary); }

.btn-danger {
  width: 100%;
  padding: 15px;
  border: none;
  background: var(--color-surface);
  color: var(--color-expense);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-danger:active { background: var(--color-expense-bg); }
</style>
