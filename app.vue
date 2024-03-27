<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
import { useEventListener } from '@vueuse/core'
import 'animate.css'
import 'vfonts/FiraCode.css'
import 'vfonts/FiraSans.css'

const { load, theme, themeOverrides, locale, dateLocale } = useTheme()
onMounted(() => {
  load()
})

// TODO extract a hook for this, provide renderless component and vue directive, and return element attrs for use
useEventListener(document, 'keydown', (event) => {
  // 检查是否按下了 Ctrl+A （对于 Mac 是 Cmd+A）
  const isCtrlA = (event.ctrlKey || event.metaKey) && event.key === 'a'

  if (isCtrlA) {
    // 阻止默认的全选行为
    event.preventDefault()

    // 获取您希望用户选择的元素
    const list = document.querySelectorAll('.ctrl-a-selectable')

    for (const ele of list) {
      // 创建一个范围对象，包括您希望选择的内容
      const range = document.createRange()
      range.selectNodeContents(ele)

      // 获取当前的选择，并移除它，然后添加上面创建的范围
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }
})
</script>

<template>
  <NConfigProvider
    abstract
    :locale="locale"
    :date-locale="dateLocale"
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <NMessageProvider>
      <NGlobalStyle />
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>
