<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core'
import FloatAside from './FloatAside.vue'
import { useInjectLayoutStore } from './store'
import ThemeToggle from '@/components/icon/ThemeToggle.vue'
import TranlationToggle from '@/components/icon/TranlationToggle.vue'
import LogoURL from '@/assets/icon/Logo.svg?url'

const {
  locale,
  locales,
} = useI18n()

const {
  logoSize,
  isScreenSmall,
  isShowFloatAside,
} = useInjectLayoutStore()

const storagedLocale = useLocalStorage('locale', locale)

const user = useUserStore()

const { isDark } = useTheme()

const i18nSelectOptions = computed(() => {
  return toValue(locales).map(({ name, code }) => ({
    label: name,
    value: code,
  }))
})

function tryShowFloatAside() {
  if (!isScreenSmall.value)
    return

  isShowFloatAside.value = true
}
</script>

<template>
  <header pointer-events-none class="relative flex items-center justify-between overflow-x-hidden px-4">
    <div pointer-events-auto class="flex cursor-pointer items-center gap4">
      <Transition
        name="custom" mode="out-in" appear
        enter-active-class="animate__animated animate__fadeIn animate__faster"
        leave-active-class="animate__animated animate__fadeOut animate__faster"
      >
        <img v-if="isScreenSmall" :src="LogoURL" class="logo hover:animate-jello" @click="tryShowFloatAside">
      </Transition>
      <a @click="$router.back()">
        <div class="flex gap2 text-text2 hover:animate-jello">
          <div class="i-ph:arrow-arc-left-fill text-3xl" />
        </div>
      </a>
    </div>
    <div pointer-events-auto class="capsule">
      <NPopselect v-model:value="storagedLocale" trigger="hover" :options="i18nSelectOptions">
        <div class="icon">
          <TranlationToggle />
        </div>
      </NPopselect>

      <ThemeToggle v-model="isDark" class="icon" hover />
      <NDivider vertical />
      <div class="icon i-lucide:power text-error" @click="user.logout" />
    </div>
    <Teleport to="body">
      <FloatAside v-if="isScreenSmall" v-model:visible="isShowFloatAside" />
    </Teleport>
  </header>
</template>

<style scoped>
.logo {
  font-size: v-bind(logoSize);

  @apply h-1em w-1em block;
}

.capsule {
  @apply bg-[var(--aside-background-color)] dark:(shadow-gray-700) rounded-full shadow-lg py-2 px-4;
  @apply flex items-center gap-4;
  @apply text-18px;

  .icon {
    @apply h-1em w-1em cursor-pointer origin-center scale-110 transform-gpu;
  }
}
</style>
