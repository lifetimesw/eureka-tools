// uno.config.ts
import { defineConfig, presetIcons, presetWind3 } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

const iconsDir = './src/renderer/src/assets/svg/'

export default defineConfig({
  safelist: [
    'i-svg:market',
    'i-lucide:list-indent-increase',
    'i-lucide:list-indent-decrease',
    'i-lucide:cloud',
    'i-lucide:skull',
    'i-lucide:square-star',
    'i-lucide:clipboard-list',
    'i-lucide:sun-moon',
    'i-lucide:moon',
    'i-lucide:sun',
    'i-lucide:moon',
    'i-lucide:badge-question-mark',
  ],
  presets: [
    presetWind3(), // 样式预设方案
    presetIcons({
      collections: {
        lucide: () => import('@iconify-json/lucide/icons.json').then((i) => i.default),
        svg: FileSystemIconLoader(iconsDir, (svg) => (svg.includes('fill="') ? svg : svg.replace(/^<svg /, '<svg fill="currentColor" '))),
      },
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      customizations: {},
    }),
  ],
  rules: [
    [
      /^(?:(f|i-f|if))(?:-(start|center|end|stretch|baseline|unset))?(?:-(center|between|around|evenly|start|end|unset))?(?:-(row|col))?$/,
      ([, display, alignItems, justifyContent, direction]) => {
        const alignItemsMap: Record<string, string> = {
          start: 'flex-start',
          center: 'center',
          end: 'flex-end',
          stretch: 'stretch',
          baseline: 'baseline',
          unset: 'unset',
        }
        const justifyContentMap: Record<string, string> = {
          center: 'center',
          between: 'space-between',
          around: 'space-around',
          evenly: 'space-evenly',
          start: 'flex-start',
          end: 'flex-end',
          unset: 'unset',
        }
        const directionMap: Record<string, string> = {
          row: 'row',
          col: 'column',
        }
        const result: Record<string, string> = { display: display === 'f' ? 'flex' : 'inline-flex' }
        if (alignItems && alignItemsMap[alignItems]) {
          result['align-items'] = alignItemsMap[alignItems]
        }

        if (justifyContent && justifyContentMap[justifyContent]) {
          result['justify-content'] = justifyContentMap[justifyContent]
        }

        if (direction && directionMap[direction]) {
          result['flex-direction'] = directionMap[direction]
        }
        return result
      },
    ],
  ],
  shortcuts: {
    'win-btn': 'w-40px h-40px f-center-center b-none bg-transparent  cursor-pointer outline-none font-inherit lh-inherit [-webkit-app-region:none]',
    'win-min': 'win-btn hover:bg-gray-300',
    'win-max': 'win-btn hover:bg-gray-300',
    'win-close': 'win-btn hover:bg-red-500 hover:text-white text-red-500',

    'form-el-base': 'rounded c-inherit outline-none font-inherit lh-inherit',
    'normal-select': 'h-2em px-1 font-bold text-[0.875em] b-1 b-solid b-blue form-el-base',
    'normal-input': 'min-w-0 h-2em px-1 font-bold text-[0.875em] b-1 b-solid b-blue form-el-base',
    'normal-input-date': 'w-12em h-2em px-1 font-bold text-[0.875em] b-1 b-solid b-blue form-el-base',

    'button-base': 'font-bold rounded transition-colors  cursor-pointer font-inherit lh-inherit',
    'normal-button':
      'px-1em h-2em font-size-[0.875em] bg-blue text-white b-1 b-solid b-blue disabled:bg-gray-100 disabled:b-gray-100 disabled:text-black hover:bg-blue-500  hover:b-blue-500 button-base',
    'trigger-button': 'px-1em min-w-6em h-2em font-size-[0.875em] bg-#ecf3f9 text-#1f4662 b-1 b-solid b-gray-300 button-base',

    'divider': 'f-center h-2em w-full',
    'divider-line': 'flex-1 h-[2px] bg-[linear-gradient(90deg,transparent,#9ca3af,#6b7280,#9ca3af,transparent)] bg-[length:200%_100%]',
    'divider-text': 'px-5 text-base font-semibold tracking-[0.5px] text-gray-800 whitespace-nowrap transition-all duration-200',
    'divider-line-left': 'flex-1 h-[2px] bg-[linear-gradient(90deg,transparent,#9ca3af,#6b7280)]',
    'divider-line-right': 'flex-1 h-[2px] bg-[linear-gradient(90deg,#6b7280,#9ca3af,transparent)]',

    'active': 'text-blue',
    'badge': 'bg-#e6f0ec px-3 py-1 rounded-full text-3 text-#2c6e52 fw-500',
    'link': 'text-green-700 decoration-none b-b-1 b-b-green-600 b-b-dotted cursor-pointer hover:text-green-800 hover:b-b-solid',
  },
})
