// uno.config.ts
import { fontFamily } from '@unocss/preset-mini/theme'

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import { breakpointsAntDesign } from '@vueuse/core'
import { darkTheme, lightTheme } from 'naive-ui'
import { kebabCase, splitSeparateNumbers } from 'change-case'

// import { kebabCase } from 'lodash-es'

// const kebabCase = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()

/** Create color palette vars */
function createColorPaletteVars() {
  const colors = ['primary', 'info', 'success', 'warning', 'error'] as const
  const colorPaletteString = ['hover', 'pressed', 'suppl'] as const

  const colorPaletteVar = {} as Record<string, string>

  colors.forEach((color) => {
    colorPaletteVar[color] = `var(--${color}-color)`

    colorPaletteString.forEach((str) => {
      colorPaletteVar[`${color}-${str}`] = `var(--${color}-color-${str})`
    })
  })

  const keys = Object.keys({
    ...lightTheme.common,
    ...darkTheme.common,
  })
    .map(key => kebabCase(key, {}))
    .filter(key => key.includes('-color'))
    .map(
      key => [key.replace('-color', ''), `var(--${splitSeparateNumbers(key).join('-')})`],
    )

  for (const [k, v] of keys)
    colorPaletteVar[k] = v

  return colorPaletteVar
}

const colorPaletteVars = createColorPaletteVars()

export default defineConfig({
  shortcuts: [
    // ...
  ],
  theme: {
    breakpoints: Object.fromEntries(Object.entries(breakpointsAntDesign).map(([key, value]) => [key, `${value}px`])),
    colors: {
      ...colorPaletteVars,

    },
    boxShadow: {
      header: 'var(--header-box-shadow)',
      sider: 'var(--sider-box-shadow)',
      tab: 'var(--tab-box-shadow)',
    },
    fontFamily: {
      sans: ['v-sans', fontFamily.sans].join(','),
      serif: ['v-serif', fontFamily.serif].join(','),
      mono: ['v-mono', fontFamily.mono].join(','),
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetScrollbar({
      scrollbarWidth: 'var(--scrollbar-width)',
      scrollbarHeight: 'var(--scrollbar-height)',
      scrollbarTrackRadius: 'var(--scrollbar-border-radius)',
      scrollbarThumbRadius: 'var(--scrollbar-border-radius)',
      scrollbarTrackColor: 'rgba(255,255,255,0)',
      scrollbarThumbColor: 'var(--scrollbar-color)',
      varPrefix: 'uno',
      prefix: 'uno-',
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        'prose-serif': ['Noto Serif SC', 'Source Han Serif SC', 'serif'],
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
