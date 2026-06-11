import Table from '@renderer/components/base/table.vue'
import Type from '@renderer/components/base/type.vue'
import directives from '@renderer/directives'
import router from '@renderer/router'
import store from '@renderer/stores'
import App from './App.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

import 'virtual:uno.css'
import '@renderer/assets/styles/index.scss'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

const app = createApp(App)

app.use(directives)
app.component('StoneTable', Table as Component)
app.component('StoneType', Type as Component)
app.use(store)
app.use(router)
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
