import { setup } from '@css-render/vue3-ssr'

export default defineNuxtPlugin({
  name: 'nuxt-plugin-naive-ui-server',

  enforce: 'pre',

  setup(app) {
    const { collect } = setup(app.vueApp)
    app.ssrContext!.head.push({
      style: () => collect()
        .split('</style>')
        .map((block) => {
          const id = block.match(/cssr-id="(.+?)"/)?.[1]
          const style = (block.match(/>(.*)/s)?.[1] || '').trim()
          return {
            'cssr-id': id,
            'innerHTML': style,
          }
        }),
    })
  },
})
