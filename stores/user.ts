import { StorageSerializers, useLocalStorage, watchPausable } from '@vueuse/core'
import { createDiscreteApi } from 'naive-ui'
import { User } from '~/models/User'

export type LoginType = 'basic' | 'token'

interface BasicLoginForm {
  username: string
  type: LoginType
  remember: boolean
  baseUrl: string
  password: string
}
interface TokenLoginForm {
  token: string
  type: LoginType
  remember: boolean
  baseUrl: string
}
const { message } = createDiscreteApi(['message'])

export const useUserStore = defineStore('user', () => {
  const loginType = ref<LoginType>('basic')

  const basicLoginForm = ref<BasicLoginForm>(initBasicLoginForm())
  const tokenLoginForm = ref<TokenLoginForm>(initTokenLoginForm())

  const {
    execute: executeUserInfo,
    data: userInfo,
    status,
  } = useLazyMinifluxFetch('/v1/me', {
    immediate: false,
    watch: false,
    transform: data => new User(data),
  })

  const basicToken = computed(() => `basic ${btoa(`${toValue(basicLoginForm).username}:${toValue(basicLoginForm).password}`)}`)
  const tokenToken = computed(() => `${toValue(tokenLoginForm).token}`)
  const token = computed(() => loginType.value === 'basic' ? basicToken.value : tokenToken.value)
  const isRemember = computed(() => loginType.value === 'basic' ? toValue(basicLoginForm).remember : toValue(tokenLoginForm).remember)
  const rememberStorage = useLocalStorage<BasicLoginForm | TokenLoginForm | null>('login_remember', null, { serializer: StorageSerializers.object })
  const loginForm = computed(() => loginType.value === 'basic' ? basicLoginForm.value : tokenLoginForm.value)
  const baseUrl = computed(() => loginForm.value.baseUrl)
  const hasLogin = computed(() => !!token.value)

  const loginLoading = computed(() => status.value === 'pending')

  // const { t } = useI18n()
  const app = useNuxtApp()

  const syncRemember = (data: BasicLoginForm | TokenLoginForm | null) => {
    if (!data)
      return

    const _loginType = data.type
    loginType.value = _loginType
    if (loginType.value === 'basic')
      basicLoginForm.value = data as BasicLoginForm

    else
      tokenLoginForm.value = data as TokenLoginForm
  }
  const {
    pause,
    resume,
  } = watchPausable(rememberStorage, syncRemember, {
    immediate: !!1,
  })

  const login = async () => {
    await nextTick()

    if (isRemember.value) {
      pause()
      rememberStorage.value = loginForm.value
      await nextTick()
      resume()
    }

    await executeUserInfo()

    if (status.value === 'success') {
      message.success(app.$i18n.t('deng_lu_cheng_gong_huan_ying_hui_lai'))

      navigateTo('/')
    }
  }

  const logout = () => {
    basicLoginForm.value = initBasicLoginForm()
    tokenLoginForm.value = initTokenLoginForm()

    loginType.value = 'basic'
    syncRemember(rememberStorage.value)
    navigateTo('/login')
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
    login,
    logout,
    executeUserInfo,
  }
})

function initTokenLoginForm(): TokenLoginForm {
  return {
    type: 'token',
    remember: false,
    baseUrl: '',
    token: '',
  }
}

function initBasicLoginForm(): BasicLoginForm {
  return {
    type: 'basic',
    remember: false,
    baseUrl: '',
    username: '',
    password: '',
  }
}
