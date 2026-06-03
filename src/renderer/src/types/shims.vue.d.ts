declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const Component: ReturnType<typeof DefineComponent>
  export default Component
}
