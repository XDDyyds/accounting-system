<template>
  <AppLayout>
    <div v-if="accountStore.accounts.length === 0" class="empty">暂无账户，请添加</div>
    <div v-for="acct in accountStore.accounts" :key="acct.id" class="account-item">
      <div class="acct-info">
        <span class="acct-name">{{ acct.name }}</span>
        <span class="acct-type">{{ typeLabel(acct.type) }}</span>
      </div>
      <button class="btn-delete" @click="remove(acct.id)">删除</button>
    </div>
    <div class="add-form">
      <input v-model="newName" placeholder="账户名称" class="input" />
      <select v-model="newType" class="input">
        <option value="cash">现金</option>
        <option value="bank">银行卡</option>
        <option value="alipay">支付宝</option>
        <option value="wechat">微信</option>
        <option value="other">其他</option>
      </select>
      <button class="btn-add" :disabled="!newName" @click="handleAdd">添加</button>
    </div>
    <div class="links">
      <router-link to="/records" class="link-item">
        <span>交易流水</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
      </router-link>
      <router-link to="/export" class="link-item">
        <span>导出数据</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
      </router-link>
      <router-link to="/settings" class="link-item">
        <span>设置</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
      </router-link>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useAccountStore } from '../stores/account.js'

const accountStore = useAccountStore()

const newName = ref('')
const newType = ref('cash')

const typeLabel = (t) => ({ cash: '现金', bank: '银行卡', alipay: '支付宝', wechat: '微信', other: '其他' }[t] || t)

onMounted(() => accountStore.load())

async function handleAdd() {
  await accountStore.add(newName.value, newType.value)
  newName.value = ''
}

async function remove(id) {
  await accountStore.remove(id)
}
</script>

<style scoped>
.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}
.acct-name { font-size: 15px; font-weight: 500; }
.acct-type { font-size: 12px; color: var(--color-text-secondary); margin-left: 8px; }
.btn-delete { color: var(--color-expense); background: none; border: none; font-size: 14px; cursor: pointer; opacity: 0.7; transition: opacity 0.15s; }
.btn-delete:hover { opacity: 1; }

.add-form { padding: 16px; display: flex; gap: 8px; }
.input {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  background: var(--color-surface);
  outline: none;
  transition: border-color 0.2s;
}
.input:focus { border-color: var(--color-accent); }
.btn-add {
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.btn-add:disabled { background: var(--color-border); color: var(--color-text-muted); cursor: not-allowed; }
.btn-add:not(:disabled):active { transform: scale(0.97); }

.links {
  margin: 16px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.link-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
  font-size: 15px;
  color: var(--color-text);
  text-decoration: none;
  transition: background 0.15s;
}
.link-item:last-child { border-bottom: none; }
.link-item:active { background: var(--color-bg); }
.link-item svg { color: var(--color-text-muted); }
.empty { text-align: center; color: var(--color-text-muted); padding: 40px 0; font-size: 15px; }
</style>
