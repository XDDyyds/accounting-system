<template>
  <AppLayout>
    <div class="export-page">
      <div class="info-card">
        <p>将全部交易记录导出为 CSV 文件，可用 Excel 打开。</p>
        <p class="count">共 {{ count }} 条记录</p>
      </div>
      <button class="btn-export" :disabled="count === 0" @click="handleExport">导出 CSV</button>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useTransactionStore } from '../stores/transaction.js'
import { useCategoryStore } from '../stores/category.js'
import { useAccountStore } from '../stores/account.js'
import { toCSV, downloadCSV } from '../utils/csv.js'
import { toYuan } from '../utils/money.js'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()

const count = ref(0)

onMounted(async () => {
  await categoryStore.load()
  await accountStore.load()
  const all = await transactionStore.getAll()
  count.value = all.length
})

async function handleExport() {
  const all = await transactionStore.getAll()
  const csv = toCSV(all, (tx) => ({
    '日期': tx.date,
    '类型': tx.type === 'income' ? '收入' : '支出',
    '金额': (tx.type === 'expense' ? '-' : '') + toYuan(tx.amount),
    '分类': categoryStore.getById(tx.categoryId)?.name || '',
    '账户': accountStore.getById(tx.accountId)?.name || '',
    '备注': tx.note
  }))
  const now = new Date()
  const filename = `记账数据_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}.csv`
  downloadCSV(csv, filename)
}
</script>

<style scoped>
.export-page { padding: 16px; }
.info-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 15px;
  color: #666;
}
.count { font-weight: 600; color: #333; margin-top: 8px; }
.btn-export {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: #4CAF50;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
.btn-export:disabled { background: #ccc; cursor: not-allowed; }
</style>
