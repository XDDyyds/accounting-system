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
.setting-group { background: #fff; border-radius: 12px; overflow: hidden; }
.setting-item {
  display: flex;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
}
.setting-value { color: #999; }
.btn-danger {
  width: 100%;
  padding: 14px;
  border: none;
  background: #fff;
  color: #F44336;
  font-size: 15px;
  cursor: pointer;
}
</style>
