<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
import 'animate.css'
import 'vfonts/FiraCode.css'
import 'vfonts/FiraSans.css'

definePageMeta({
  title: import.meta.env.VITE_TITLE,
})

const { load, theme, themeOverrides, locale, dateLocale } = useTheme()
onMounted(() => {
  load()
})

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
  title: import.meta.env.VITE_TITLE,
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
