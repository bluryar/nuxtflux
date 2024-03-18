import { StorageSerializers, syncRef, useLocalStorage, useSessionStorage, watchPausable } from '@vueuse/core'
import { createDiscreteApi } from 'naive-ui'
import { User } from '~/models/User'

export type LoginType = 'basic' | 'token'

interface BasicLoginForm {
  username: string
  type: LoginType
  baseUrl: string
  password: string
}
interface TokenLoginForm {
  token: string
  type: LoginType
  baseUrl: string
}
const { message } = createDiscreteApi(['message'])

export const useUserStore = defineStore('user', () => {
  const basicLoginForm = useLocalStorage<BasicLoginForm>('BasicLoginForm', initBasicLoginForm())
  const tokenLoginForm = useLocalStorage<TokenLoginForm>('TokenLoginForm', initTokenLoginForm())

  const loginType = useLocalStorage<LoginType>('user.login-type', 'basic')
  const token = useSessionStorage<string>('user.token', '')
  const rememberStorage = useLocalStorage<BasicLoginForm | TokenLoginForm | null>('user.login-remember', null, { serializer: StorageSerializers.object })
  const isRemember = useLocalStorage('user.login-is-remember', false)

  const {
    execute: executeUserInfo,
    data: userInfo,
    status,
  } = useLazyMinifluxFetch('/v1/me', {
    immediate: false,
    watch: false,
    transform: data => new User(data),
  })

  const app = useNuxtApp()
  const basicToken = computed(() => `basic ${btoa(`${toValue(basicLoginForm).username}:${toValue(basicLoginForm).password}`)}`)
  const tokenToken = computed(() => `${toValue(tokenLoginForm).token}`)
  const getToken = () => loginType.value === 'basic' ? basicToken.value : tokenToken.value
  const loginForm = computed(() => loginType.value === 'basic' ? basicLoginForm.value : tokenLoginForm.value)
  const baseUrl = computed(() => loginForm.value.baseUrl)
  const hasLogin = computed(() => !!token.value && token.value !== btoa(':'))

  const loginLoading = computed(() => status.value === 'pending')

  const login = async () => {
    await nextTick()
    token.value = getToken()

    await executeUserInfo()

    if (status.value === 'success') {
      if (isRemember.value)
        rememberStorage.value = loginForm.value
      else
        rememberStorage.value = null

      message.success(app.$i18n.t('deng_lu_cheng_gong_huan_ying_hui_lai'))

      navigateTo('/')
    }
  }

  const logout = async () => {
    basicLoginForm.value = initBasicLoginForm()
    tokenLoginForm.value = initTokenLoginForm()

    loginType.value = 'basic'
    token.value = ''

    await nextTick()
    await navigateTo('/login')
  }

  const syncRememberUser = () => {
    if (isRemember.value) {
      if (loginType.value === 'basic')
        basicLoginForm.value = rememberStorage.value as BasicLoginForm
      else
        tokenLoginForm.value = rememberStorage.value as TokenLoginForm
    }
    else {
      basicLoginForm.value = initBasicLoginForm()
      tokenLoginForm.value = initTokenLoginForm()
    }
    token.value = ''
  }

  return {
    userInfo,
    hasLogin,
    loginType,
    basicLoginForm,
    tokenLoginForm,
    baseUrl,
    token,
    loginLoading,
    isRemember,
    rememberStorage,
    login,
    logout,
    executeUserInfo,
    syncRememberUser,
  }
})

function initTokenLoginForm(): TokenLoginForm {
  return {
    type: 'token',
    baseUrl: '',
    token: '',
  }
}

function initBasicLoginForm(): BasicLoginForm {
  return {
    type: 'basic',
    baseUrl: '',
    username: '',
    password: '',
  }
}
