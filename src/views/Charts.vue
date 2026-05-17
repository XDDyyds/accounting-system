<template>
  <AppLayout>
    <div v-if="!hasData" class="empty">
      <span class="empty-icon">📊</span>
      <p>暂无数据可展示</p>
    </div>
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

const COLORS = [
  '#C75B4A', '#8B6F5E', '#C4944A', '#6A8A7B', '#4A7C59',
  '#7B687D', '#B88B6E', '#A0897C', '#5A7A82', '#8B7A6E'
]

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
    color: COLORS,
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#EDE8E0',
      textStyle: { color: '#2D2418', fontSize: 13, fontFamily: 'PingFang SC, sans-serif' },
      formatter: (p) => `${p.data.icon} ${p.name}<br/>¥${toYuan(p.value)} <span style="color:#9B8E80">(${p.percent}%)</span>`
    },
    series: [{
      type: 'pie',
      radius: ['52%', '78%'],
      center: ['50%', '48%'],
      data,
      label: {
        color: '#2D2418',
        fontFamily: 'PingFang SC, sans-serif',
        fontSize: 12,
        formatter: (p) => `${p.data.icon} ${p.name}\n${p.percent}%`
      },
      labelLine: { lineStyle: { color: '#C4B8A8' } },
      itemStyle: {
        borderRadius: 3,
        borderColor: '#F9F7F2',
        borderWidth: 3
      },
      emphasis: {
        itemStyle: { shadowBlur: 20, shadowColor: 'rgba(45, 36, 24, 0.15)' }
      }
    }]
  })
})
</script>

<style scoped>
.chart-section { padding: 16px 16px 24px; }
.chart-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  padding: 8px 4px 20px;
}
.chart-container { width: 100%; height: 360px; }
.empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: 80px 0;
}
.empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }
.empty p { font-size: 15px; }
</style>
