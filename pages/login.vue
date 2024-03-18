<script lang="tsx" setup>
import { useLocalStorage } from '@vueuse/core'
import type { FormInst } from 'naive-ui'
import LogoURL from '@/assets/icon/Logo.svg?url'
import TranlationToggle from '@/components/icon/TranlationToggle.vue'
import ThemeToggle from '@/components/icon/ThemeToggle.vue'

const title = import.meta.env.VITE_TITLE

const user = useUserStore()

const basicFormRef = ref<FormInst>()
const tokenFormRef = ref<FormInst>()

onMounted(() => {
  user.syncRememberUser()
})

async function onSubmit() {
  let promise
  if (user.loginType === 'basic')
    promise = basicFormRef.value?.validate()
  else if (user.loginType === 'token')
    promise = tokenFormRef.value?.validate()

  const res = await promise!
  if (res.warnings)
    return

  await user.login()
}
</script>

<template>
  <div class="h-100vh w-100vw flex flex-col items-center justify-center px-2xl">
    <div class="fixed right-0 top-0 m-xl mr-2xl flex gap2 text-xl">
      <TranlationToggle />
      <ThemeToggle hover />
    </div>
    <div>
      <div class="my-xl flex items-center justify-center gap2">
        <img :src="LogoURL" class="h-1em w-1em text-5xl">
        <div class="text-3xl">
          {{ title }}
        </div>
      </div>
      <div class="flex flex-col items-center justify-center text-2xl">
        <div>{{ $t('lian_jie_miniflux_fu_wu_qi') }}</div>
      </div>
    </div>

    <div class="mt-xl w-350px rounded bg-card p-2xl shadow-2xl lt-sm:w-80vw">
      <NForm v-if="user.loginType === 'basic'" ref="basicFormRef" :model="user.basicLoginForm">
        <NFormItem :rule="{ required: !!1 }" path="baseUrl" required :label="$t('fu_wu_qi_di_zhi')">
          <NInput v-model:value="user.basicLoginForm.baseUrl" clearable @keyup.enter="onSubmit" />
        </NFormItem>
        <NFormItem :rule="{ required: !!1 }" path="username" required :label="$t('yong_hu_ming')">
          <NInput v-model:value="user.basicLoginForm.username" clearable @keyup.enter="onSubmit" />
        </NFormItem>
        <NFormItem :rule="{ required: !!1 }" path="password" required :label="$t('mi_ma')">
          <NInput v-model:value="user.basicLoginForm.password" show-password-on="click" clearable type="password" @keyup.enter="onSubmit" />
        </NFormItem>
      </NForm>
      <NForm v-else-if="user.loginType === 'token'" ref="tokenFormRef" :model="user.tokenLoginForm">
        <NFormItem :rule="{ required: !!1 }" path="baseUrl" required :label="$t('fu_wu_qi_di_zhi')">
          <NInput v-model:value="user.tokenLoginForm.baseUrl" clearable @keyup.enter="onSubmit" />
        </NFormItem>
        <NFormItem :rule="{ required: !!1 }" path="token" required :label="$t('api_ling_pai')">
          <NInput v-model:value="user.tokenLoginForm.token" show-password-on="click" clearable type="password" @keyup.enter="onSubmit" />
        </NFormItem>
      </NForm>

      <div class="mb4 flex justify-end">
        <NCheckbox v-model:checked="user.isRemember">
          {{ $t('ji_zhu_mi_ma') }}
        </NCheckbox>
      </div>

      <NButton
        type="primary"
        :style="{
          width: '100%',
        }"
        :loading="user.loginLoading"
        @click="onSubmit"
      >
        {{ $t('deng_lu') }}
      </NButton>

      <NDivider>{{ $t('deng_lu_fang_shi') }}</NDivider>

      <NButton
        :style="{
          width: '100%',
        }"
        @click="() => {
          user.loginType = user.loginType === 'basic' ? 'token' : 'basic'
        }"
      >
        {{ user.loginType === 'basic' ? $t('shi_yong_api_token_deng_lu') : $t('shi_yong_zhang_hao_mi_ma_deng_lu') }}
      </NButton>
    </div>
  </div>
</template>
