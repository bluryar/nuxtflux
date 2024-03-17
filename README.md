# Nuxt 3 Minimal Starter

FEATURES:

1. Nuxt 3
2. OpenAPI To Typescript
3. UnoCSS

- TODO 补充文档
- 这是一个 Nuxt 3 联系项目，在 x 上看到有人开发了一个 Miniflux 的 WebUI，一时兴起就写了一个类似的。由于刚接触 RSSHub 和 Miniflux , 因此对这块的使用需求不是很大， 很多UI都是模仿的 x友开源的[ReactFlux](https://github.com/electh/ReactFlux)。
- 选择使用Nuxt 3仅仅是为了学习这个框架，而选择NaiveUI作为组件库，也许是这个仓库最不理智的决定，只能关闭SSR后使用，因为SSR构建后的包太大了。

## 重构计划

1. Naive UI -> TDesign Or Arco Design Vue + shadcn-vue
2. UnoCSS -> TailwindCSS
3. NuxtOpenFetch -> openapi-typescript

起初，我尝试使用 shadcn-vue + TailwindCSS 来开发， 但是由于使用习惯的问题， 我需要耗费比较多的心智去学习区别于传统后台管理系统技术栈的东西，因此我决定改回 NaiveUI + UnoCSS 的技术栈， 但是由于 SSR 构建后的包太大，我决定关闭SSR，使用SPA的方式来开发。

总的来说， 这是一个练手的项目，确实起到了让我体验到了 Nuxt 3 的开发体验。
