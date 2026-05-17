<template>
  <AppLayout>
    <div class="export-page">
      <div class="info-card">
        <p class="info-text">导出全部交易记录为 CSV 文件</p>
        <p class="info-sub">可用 Excel 或 Numbers 打开</p>
        <p class="count">共 <strong>{{ count }}</strong> 条记录</p>
      </div>
      <button class="btn-export" :disabled="count === 0" @click="handleExport">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" style="margin-right:6px">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        导出 CSV
      </button>
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
  background: var(--color-surface);
  padding: 28px 20px;
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
  text-align: center;
  box-shadow: var(--shadow-sm);
}
.info-text { font-size: 15px; color: var(--color-text); font-weight: 500; margin-bottom: 4px; }
.info-sub { font-size: 13px; color: var(--color-text-secondary); margin-bottom: 12px; }
.count { font-size: 14px; color: var(--color-text-secondary); }
.count strong { color: var(--color-text); font-weight: 600; }

.btn-export {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-accent);
  color: #fff;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  letter-spacing: 0.02em;
}
.btn-export:active { transform: scale(0.98); }
.btn-export:disabled { background: var(--color-border); color: var(--color-text-muted); cursor: not-allowed; }
</style>
