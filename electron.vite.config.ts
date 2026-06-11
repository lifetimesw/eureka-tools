import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { presetIcons, presetAttributify } from 'unocss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import AutoImport from 'unplugin-auto-import/vite'

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
            @use '@renderer/assets/styles/mixins' as *;
            @use '@renderer/assets/styles/variables' as *;
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
      AutoImport({
        vueTemplate: true,
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            vue: ['render', 'createVNode', 'isVNode'],
          },
          {
            dayjs: [['default', 'dayjs']],
          },
        ],
        dts: 'src/types/auto-imports.d.ts',
        defaultExportByFilename: false,
      }),
    ],
  },
})
