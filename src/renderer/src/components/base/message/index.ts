import type { App } from 'vue'
import StoneMessage from './message'

StoneMessage.install = function (app: App) {
  app.config.globalProperties.$message = StoneMessage
}
export { StoneMessage }
export default StoneMessage
