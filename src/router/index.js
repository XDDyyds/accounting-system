import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { tab: 'home', title: '首页' }
  },
  {
    path: '/record',
    name: 'record',
    component: () => import('../views/Record.vue'),
    meta: { tab: 'record', title: '记账' }
  },
  {
    path: '/charts',
    name: 'charts',
    component: () => import('../views/Charts.vue'),
    meta: { tab: 'charts', title: '图表' }
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('../views/Accounts.vue'),
    meta: { tab: 'accounts', title: '账户' }
  },
  {
    path: '/records',
    name: 'records',
    component: () => import('../views/Records.vue'),
    meta: { tab: null, title: '流水' }
  },
  {
    path: '/export',
    name: 'export',
    component: () => import('../views/Export.vue'),
    meta: { tab: null, title: '导出' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/Settings.vue'),
    meta: { tab: null, title: '设置' }
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
