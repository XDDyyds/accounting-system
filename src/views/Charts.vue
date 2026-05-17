<template>
  <AppLayout>
    <div v-if="!hasData" class="empty">暂无数据可展示</div>
    <div v-else class="chart-section">
      <div class="chart-title">本月支出分类占比</div>
      <div class="chart-container" ref="chartRef"></div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import AppLayout from '../components/AppLayout.vue'
import { useTransactionStore } from '../stores/transaction.js'
import { useCategoryStore } from '../stores/category.js'
import { toYuan } from '../utils/money.js'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

const chartRef = ref(null)
const hasData = ref(false)

onMounted(async () => {
  await categoryStore.load()
  const now = new Date()
  const summary = await transactionStore.getMonthSummary(now.getFullYear(), now.getMonth() + 1)

  if (Object.keys(summary.categoryBreakdown).length === 0) {
    return
  }

  hasData.value = true
  await nextTick()

  if (!chartRef.value) return
  const chart = echarts.init(chartRef.value)

  const data = Object.entries(summary.categoryBreakdown).map(([catId, amount]) => {
    const cat = categoryStore.getById(parseInt(catId))
    return {
      name: cat?.name || '未知',
      value: amount,
      icon: cat?.icon || '📦'
    }
  })

  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: (p) => `${p.data.icon} ${p.name}: ¥${toYuan(p.value)} (${p.percent}%)`
    },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '50%'],
      data,
      label: {
        formatter: (p) => `${p.data.icon} ${p.name}\n${p.percent}%`
      },
      itemStyle: {
        borderRadius: 4,
        borderColor: '#fff',
        borderWidth: 2
      }
    }]
  })
})
</script>

<style scoped>
.chart-section { padding: 16px; }
.chart-title { font-size: 16px; font-weight: 600; padding: 8px 0 16px; }
.chart-container { width: 100%; height: 340px; }
.empty { text-align: center; color: #ccc; padding: 60px 0; }
</style>
