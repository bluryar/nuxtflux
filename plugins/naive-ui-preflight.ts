export default defineNuxtPlugin({
  name: 'nuxt-plugin-naive-ui',

  setup(app) {
    app.hook('app:mounted', () => {
      const meta = document.createElement('meta')
      meta.name = 'naive-ui-style'
      document.head.appendChild(meta)
    })
  },
})
