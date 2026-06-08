import type { Component } from 'vue'
import { createApp } from 'vue'
import Table from '@renderer/components/base/table.vue'
import Type from '@renderer/components/base/type.vue'
import directives from '@renderer/directives'
import router from '@renderer/router'
import store from '@renderer/stores'
import App from './App.vue'

import 'virtual:uno.css'
import '@renderer/assets/scss/index.scss'
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
