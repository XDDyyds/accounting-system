<template>
  <div class="app-layout">
    <header class="app-header">
      <h1 class="app-title">{{ $route.meta.title }}</h1>
    </header>
    <main class="app-main">
      <slot />
    </main>
    <nav class="tab-bar">
      <router-link to="/" class="tab-item" :class="{ active: $route.path === '/' }">
        <span class="tab-icon">🏠</span>
        <span class="tab-label">首页</span>
      </router-link>
      <router-link to="/record" class="tab-item tab-item--center" :class="{ active: $route.path === '/record' }">
        <span class="tab-btn-record">+</span>
        <span class="tab-label">记账</span>
      </router-link>
      <router-link to="/charts" class="tab-item" :class="{ active: $route.path === '/charts' }">
        <span class="tab-icon">📊</span>
        <span class="tab-label">图表</span>
      </router-link>
      <router-link to="/accounts" class="tab-item" :class="{ active: $route.path === '/accounts' }">
        <span class="tab-icon">💳</span>
        <span class="tab-label">账户</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.app-layout {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}
.app-header {
  padding: 12px 16px;
  background: #4CAF50;
  color: #fff;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 50;
}
.app-title { font-size: 18px; margin: 0; font-weight: 500; }
.app-main { flex: 1; overflow-y: auto; padding-bottom: 70px; }
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
  border-top: 1px solid #eee;
  padding: 6px 0 env(safe-area-inset-bottom, 6px);
  z-index: 100;
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #999;
  font-size: 12px;
  padding: 4px 12px;
}
.tab-item.active { color: #4CAF50; }
.tab-icon { font-size: 22px; }
.tab-label { margin-top: 2px; }
.tab-btn-record {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #4CAF50;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 2px;
}
</style>
