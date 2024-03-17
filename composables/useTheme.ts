import { type GlobalThemeOverrides, darkTheme, lightTheme } from 'naive-ui'
import { createSharedComposable, useDark, useStyleTag } from '@vueuse/core'
import { kebabCase, merge, omit } from 'lodash-es'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui'
import { generate } from '@arco-design/color'

const dark = generate('rgb(255, 112, 13)', { dark: true, list: true })
const light = generate('rgb(234, 88, 12)', { list: true })

const darkThemeOverrides = {
  common: {
    primaryColor: dark[6],
    primaryColorHover: dark[5],
    primaryColorPressed: dark[7],
    primaryColorSuppl: dark[5],
  },
} as GlobalThemeOverrides
const lightThemeOverrides = {
  common: {
    primaryColor: light[6],
    primaryColorHover: light[5],
    primaryColorPressed: light[7],
    primaryColorSuppl: light[5],

    bodyColor: '#f5f7f9',
  },
} as GlobalThemeOverrides

export const useTheme = createSharedComposable(
  () => {
    const isDark = useDark({
      attribute: 'class',
      valueDark: 'dark',
      valueLight: 'light',
      selector: 'html',
      initialValue: 'auto',
      disableTransition: false,
    })

    const {
      load,
    } = useStyleTag(
  `
html.light {
${genCssVars(lightTheme, lightThemeOverrides)}
}

html.dark {
${genCssVars(darkTheme, darkThemeOverrides)}
}
  `,
  {
    immediate: false,
    manual: true,
    id: 'naive-ui-theme-css-vars',
  },
    )

    const theme = computed(() => isDark.value ? darkTheme : lightTheme)
    const themeOverrides = computed<GlobalThemeOverrides>(() => {
      return isDark.value
        ? darkThemeOverrides
        : lightThemeOverrides
    })

    const { $i18n } = useNuxtApp()
    const locale = computed(() => toValue($i18n.locale) === 'zh' ? zhCN : enUS)
    const dateLocale = computed(() => toValue($i18n.locale) === 'zh' ? dateZhCN : dateEnUS)

    return {
      load,
      isDark,
      locale,
      dateLocale,
      theme,
      themeOverrides,
    }
  },
)
function genCssVars(theme: BuiltInGlobalTheme, overrides: GlobalThemeOverrides) {
  return Object.entries(omit(merge({}, theme.common, overrides.common), 'name')).map(([key, value]) => `${`--${kebabCase(key)}`}: ${value};`).join('\n')
}
