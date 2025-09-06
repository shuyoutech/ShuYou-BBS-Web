import VWave from 'v-wave'
import VxeUI from 'vxe-pc-ui'
import VxeUITable from 'vxe-table'

// 加载 iconify 图标
import { downloadAndInstall } from '@/iconify'
import icons from '@/iconify/index.json'
import App from './App.vue'
import Editor from '@tinymce/tinymce-vue'
import i18n from './locales'
import router from './router'
import pinia from './store'
import uiProvider from './ui/provider'
import '@/utils/storage'
import 'vxe-table/lib/style.css'
import 'vxe-pc-ui/lib/style.css'

// 加载 svg 图标
import 'virtual:svg-icons-register'
// UnoCSS
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
// 全局样式
import '@/assets/styles/globals.css'

const app = createApp(App)
app.use(VWave, {})
app.use(VxeUI).use(VxeUITable)
app.use(pinia)
app.use(router)
app.use(uiProvider)
app.use(i18n)
app.component("TinyMCE", Editor)

if (icons.isOfflineUse) {
  for (const info of icons.collections) {
    downloadAndInstall(info)
  }
}

app.mount('#app')
