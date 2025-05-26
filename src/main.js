import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
const app = createApp(App)

import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './styles/base.css'
import i18n from './locales'
import { globalT } from '@/composables/useGlobalI18n'

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 添加全局属性
app.config.globalProperties.$t = globalT

// 使用 i18n
app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
