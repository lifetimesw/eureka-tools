import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { presetIcons, presetAttributify } from 'unocss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
      },
    },
    build: {
      externalizeDeps: {
        exclude: ['electron-store'],
      },
    },
  },
  preload: {
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use '@renderer/assets/scss/mixins' as *;
            @use '@renderer/assets/scss/variables' as *;
          `,
        },
      },
      postcss: {
        plugins: [
          autoprefixer(),
          cssnano(),
          // 开发环境不需要压缩
          // ...(isServe ? [cssnano({ preset: 'default' })] : []),
        ],
      },
    },
    plugins: [
      UnoCSS({
        presets: [presetAttributify(), presetIcons({ scale: 1.2, warn: true })],
      }),
      vue(),
    ],
  },
})
