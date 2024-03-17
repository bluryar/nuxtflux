import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  devServer: {
    // expose the server to the network, so I can access it from tailscale's client
    host: '0.0.0.0',
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        jsx: 'preserve',
        jsxImportSource: 'vue',
      },
    },
  },

  postcss: {
    plugins: {
      'postcss-nesting': {

      } satisfies import('postcss-nesting').pluginOptions,

      '@unocss/postcss': {
        configOrPath: resolve('./uno.config.ts'),
      } satisfies import('@unocss/postcss').UnoPostcssPluginOptions,
    },
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  imports: {
    dirs: [
      resolve('./composables/vueuse'),
    ],
  },

  components: [
    {
      prefix: 'Layout',
      path: resolve('./components/layouts'),
      global: true,
    },
  ],

  modules: [
    '@unocss/nuxt',
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/i18n',
    'nuxt-open-fetch',
    'nuxt-typed-router',
    '@pinia/nuxt',
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
      {
        code: 'zh',
        name: '中文',
        file: 'zh.json',
      },
    ],
    strategy: 'no_prefix',
    langDir: 'locales',
  },

  unocss: {
    preflight: true,
  },

  openFetch: {
    disableNuxtPlugin: true,

    clients: {
      miniflux: {
        schema: resolve('./openapi/miniflux.json'),
      },
    },
  },
})
