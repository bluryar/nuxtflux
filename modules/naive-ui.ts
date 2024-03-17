import { addComponent, addImports, defineNuxtModule, extendViteConfig } from 'nuxt/kit'
import RAW_NAIVE from 'naive-ui'

const MODULE_NAME = 'nuxt-module-naive-ui'
const NAIVE_COMPONENT_RE = /^N[A-Z]\w*/

export default defineNuxtModule({
  meta: {
    name: MODULE_NAME,
    configKey: MODULE_NAME,
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: '^3.0.0',
    },
  },

  setup(resolvedOptions, nuxt) {
    const naiveComponents = Object.keys(RAW_NAIVE).filter(key =>
      NAIVE_COMPONENT_RE.test(key),
    )

    // register naive components
    for (const name of naiveComponents) {
      addComponent({
        name,
        export: name,
        filePath: 'naive-ui',
        mode: 'all',
      })
    }

    const naiveComposables = [
      'useDialog',
      'useMessage',
      'useNotification',
      'useLoadingBar',
      'useDialogReactiveList',
      'useThemeVars',
      'useModal',
    ]

    // register naive composables
    for (const name of naiveComposables) {
      addImports({
        name,
        as: name,
        from: 'naive-ui',
      })
    }

    if (import.meta.env.DEV) {
      extendViteConfig((config) => {
        config.optimizeDeps ||= {}
        config.optimizeDeps.include ||= []
        config.optimizeDeps.include.push('naive-ui')
      })
    }

    if (import.meta.env.PROD)
      nuxt.options.build.transpile.push('naive-ui')
  },
})
