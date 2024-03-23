# NuxtFlux

## 介绍

我是一名Vue开发者, 在开发这个项目前, 我的技术栈为 Vite + Vue3 + Pinia + UnoCSS + Typescript + NaiveUI + VueUse. 也就是说, 我是一个Vue3的忠实拥趸. 为了了解 Nuxt 3 这个框架, 我需要一个玩具项目来帮助我在编码实践中学习 Nuxt 3.

至于为什么选择做Miniflux的Web套壳: 某一天, 我在刷 X 的时候发现了 [ReactFlux](https://github.com/electh/ReactFlux) 作者的帖子, 刚好, 我在此之前刚刚给自己的 Homelab Server 部署了 Miniflux 和 RSSHub.

## Feature

- **Typescript** - 我习惯了 VSCode 的 Intellisense, 所以我选择了 Typescript. 尽管在开发时, 由于 Volar 正在切换大版本, 导致在编写 SFC 时编辑器会有一些小问题.

- **OpenAPI** Nuxt Plugin - 我采取了Nuxt的一个社区插件来解析 OpenAPI 的文档, 用来生成 API 的接口的类型提示.

  - OpenAPI 文档, 我没有找到 Miniflux 官方提供的文档, 因此, 我用 GPT4 生成了一份. 导入到 ApiFox 中进行编辑.

- **UnoCSS** - Antfu 的很多预设, 提供了符合我审美的样式预设, 也提供了很多方便的工具, 非常适合做这些玩具项目, 所以我选择了 UnoCSS 作为样式方案.

- **NaiveUI** - 由于我在 Vue3 的项目中使用了 NaiveUI, 所以我选择了 NaiveUI.

  - 实际上, 这并不是一个明智的选择, 这让我不得不关闭 SSR , 因为 NaiveUI 的样式方案的在 SSR 会影响包的体积. (但是, 当前也没有一个需要 SSR 的场景.)

- **i18n** - Nuxt 3 的i18n模块, 搭配 VSCode 的 [i18n Ally](https://github.com/lokalise/i18n-ally) 插件, 让我在编写多语言的时候, 有了很好的体验.

- **Responsive** - 由于我在开发时, 我希望在手机上也可以使用这个网页.

## 使用方法

**node**

```bash
node -v
# v18.19.

corepack enable
pnpm install
pnpm run build
node ./.output/server/index.mjs
```

**docker**

```bash
docker build -t nuxtflux .
docker run -p 3000:3000 nuxtflux

# or use docker-compose
docker compose up -d # edit docker-compose.yml to change port
```

## 截图

<div style="max-width: 80ch; margin: 1rem auto">

![pc-light.png](./screenshots/pc-light.png)

![pc-dark.png](./screenshots/pc-dark.png)

![pc-i18n.png](./screenshots/pc-i18n.png)

![pc-login.png](./screenshots/pc-login.png)

![iphone-next-page.png](./screenshots/iphone-next-page.png)

![iphone.png](./screenshots/iphone.png)

![iphone-responsive.png](./screenshots/iphone-responsive.png)

</div>

## TODO

1. 引入LLM, 用于总结文章或者视频.
2. 接入笔记软件, 接入notion或者思源笔记.
