import type { App } from 'vue'
import { vDrag } from './drag'
import { vTitle } from './title'

const directives = {
  drag: vDrag,
  title: vTitle,
}

export default {
  install(app: App) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key as keyof typeof directives])
    })
  },
}

export { vDrag, vTitle }
