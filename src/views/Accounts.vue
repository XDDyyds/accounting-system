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
      <router-link to="/records">交易流水</router-link>
      <router-link to="/export">导出数据</router-link>
      <router-link to="/settings">设置</router-link>
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
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}
.acct-name { font-size: 16px; font-weight: 500; }
.acct-type { font-size: 12px; color: #999; margin-left: 8px; }
.btn-delete { color: #F44336; background: none; border: none; font-size: 14px; cursor: pointer; }
.add-form { padding: 16px; display: flex; gap: 8px; }
.input { flex: 1; min-width: 0; padding: 10px; border: 1px solid #eee; border-radius: 6px; font-size: 14px; }
.btn-add {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #4CAF50;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}
.btn-add:disabled { background: #ccc; }
.links { padding: 24px 16px; display: flex; flex-direction: column; gap: 12px; }
.links a { color: #4CAF50; text-decoration: none; font-size: 15px; }
.empty { text-align: center; color: #ccc; padding: 40px 0; }
</style>
