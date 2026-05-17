<template>
  <AppLayout>
    <AmountInput v-model:tx-type="txType" @change="amountStr = $event" />
    <CategoryPicker
      v-model="categoryId"
      :categories="txType === 'income' ? categoryStore.incomeCategories : categoryStore.expenseCategories"
    />
    <AccountPicker v-model="accountId" :accounts="accountStore.accounts" />
    <div class="note-row">
      <input v-model="note" class="note-input" placeholder="添加备注..." />
    </div>
    <div class="action-row">
      <button class="btn-save" :disabled="!canSave" @click="save">确定</button>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import AmountInput from '../components/AmountInput.vue'
import CategoryPicker from '../components/CategoryPicker.vue'
import AccountPicker from '../components/AccountPicker.vue'
import { useTransactionStore } from '../stores/transaction.js'
import { useCategoryStore } from '../stores/category.js'
import { useAccountStore } from '../stores/account.js'
import { toCents } from '../utils/money.js'
import { today } from '../utils/date.js'

const router = useRouter()
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()

const txType = ref('expense')
const amountStr = ref('')
const categoryId = ref(null)
const accountId = ref(null)
const note = ref('')

const canSave = computed(() => {
  return amountStr.value !== '' && categoryId.value !== null && accountId.value !== null
})

onMounted(async () => {
  await categoryStore.load()
  await accountStore.load()
  if (accountStore.accounts.length > 0) {
    accountId.value = accountStore.accounts[0].id
  }
})

// Reset category when switching type (income/expense categories differ)
watch(txType, () => {
  categoryId.value = null
})

async function save() {
  const amount = toCents(amountStr.value)
  if (isNaN(amount) || amount <= 0) return

  await transactionStore.add(txType.value, amount, categoryId.value, accountId.value, today(), note.value)
  amountStr.value = ''
  categoryId.value = null
  note.value = ''
  router.push('/')
}
</script>

<style scoped>
.note-row { padding: 12px 16px; }
.note-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
}
.action-row { padding: 20px 16px; }
.btn-save {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: #4CAF50;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
.btn-save:disabled { background: #ccc; cursor: not-allowed; }
</style>
