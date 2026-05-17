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
        <svg class="tab-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span class="tab-label">首页</span>
      </router-link>
      <router-link to="/record" class="tab-item tab-item--record" :class="{ active: $route.path === '/record' }">
        <span class="tab-btn-record">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>
        <span class="tab-label">记账</span>
      </router-link>
      <router-link to="/charts" class="tab-item" :class="{ active: $route.path === '/charts' }">
        <svg class="tab-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
        </svg>
        <span class="tab-label">图表</span>
      </router-link>
      <router-link to="/accounts" class="tab-item" :class="{ active: $route.path === '/accounts' }">
        <svg class="tab-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="2" y1="9" x2="22" y2="9"/>
          <line x1="6" y1="17" x2="6.01" y2="17"/>
          <line x1="10" y1="17" x2="10.01" y2="17"/>
        </svg>
        <span class="tab-label">账户</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.app-layout {
  max-width: var(--max-width);
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.app-header {
  padding: 16px 20px 12px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-bg);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}
.app-header.scrolled {
  border-bottom-color: var(--color-border);
  backdrop-filter: blur(12px);
  background: rgba(249, 247, 242, 0.92);
}
.app-title {
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 500;
  color: var(--color-text);
  letter-spacing: 0.02em;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--max-width);
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--color-border);
  padding: 8px 0 env(safe-area-inset-bottom, 8px);
  z-index: 100;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-muted);
  font-size: 11px;
  padding: 4px 16px;
  transition: color 0.2s;
  gap: 3px;
}
.tab-item.active { color: var(--color-accent); }

.tab-icon-svg {
  width: 24px;
  height: 24px;
}

.tab-label {
  line-height: 1;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.tab-item--record {
  margin-top: -20px;
}
.tab-btn-record {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--color-accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(58, 48, 66, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}
.tab-btn-record svg {
  width: 24px;
  height: 24px;
}
.tab-item--record:active .tab-btn-record {
  transform: scale(0.94);
  box-shadow: 0 2px 8px rgba(58, 48, 66, 0.25);
}
</style>
