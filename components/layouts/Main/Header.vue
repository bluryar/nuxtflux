<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core'
import FloatAside from './FloatAside.vue'
import { useInjectLayoutStore } from './store'
import ThemeToggle from '@/components/icon/ThemeToggle.vue'
import TranlationToggle from '@/components/icon/TranlationToggle.vue'
import LogoURL from '@/assets/icon/Logo.svg?url'

const {
  logoSize,
  isScreenSmall,
  isShowFloatAside,
} = useInjectLayoutStore()

const user = useUserStore()

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
        <div v-if="isScreenSmall" class="flex gap2">
          <img :src="LogoURL" class="logo hover:animate-jello" @click="tryShowFloatAside">
        </div>
      </Transition>
      <a @click="$router.back()">
        <div class="flex gap2 text-text2 hover:animate-jello">
          <div class="i-ph:arrow-arc-left-fill text-3xl" />
        </div>
      </a>
    </div>

    <div pointer-events-auto class="capsule">
      <div class="flex gap2">
        <TranlationToggle />
        <ThemeToggle hover />
      </div>
      <NDivider vertical />
      <div class="i-lucide:power cursor-pointer text-error" @click="user.logout" />
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
  @apply flex items-center;
  @apply text-18px;
}
</style>
