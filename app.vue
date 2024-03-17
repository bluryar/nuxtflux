<script setup lang="ts">
import 'animate.css'

import('vfonts/FiraCode.css')
import('vfonts/FiraSans.css')

const { load, theme, themeOverrides, locale, dateLocale } = useTheme()
onMounted(() => {
  load()
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
