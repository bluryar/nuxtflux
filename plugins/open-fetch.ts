import {
  createDefu,
} from 'defu'
import { createDiscreteApi } from 'naive-ui'
import { useUserStore } from '~/stores/user'

const merge = createDefu((obj, key, val) => {
  // 遇到函数时，创建一个列表进行合并， 然后用一个新的函数来执行这个列表
  if (typeof obj[key] === 'function' && typeof val === 'function') {
    return function (...args: any) {
      const res1 = obj[key](args)
      const res2 = val(args)
      if (res1 instanceof Promise || res2 instanceof Promise)
        return Promise.resolve()
    }
  }
})

const { message } = createDiscreteApi(['message'])

export default defineNuxtPlugin({
  // enforce: 'pre', // clients will be ready to use by other plugins, Pinia stores etc.
  setup() {
    const { public: { openFetch: clients } } = useRuntimeConfig()

    return {
      provide: Object.fromEntries(Object.entries(clients).map(([name, options]) => [
        [`${name}Fetch`],
        createOpenFetch((localOptions) => {
          return merge(
            {
              onRequest(ctx) {
                const user = useUserStore()

                ctx.options.baseURL = user.baseUrl
                ctx.options.headers = {
                  ...ctx.options.headers,
                  ...user.loginType === 'basic'
                    ? { Authorization: user.token }
                    : { 'X-Auth-Token': user.token },
                }
              },
              onRequestError() {
                message.error('请求失败')
              },

              onResponseError(ctx) {
                if (ctx.response.status === 401) {
                  message.error('登录失效')
                  useUserStore().logout()
                  return
                }
                else if (ctx.response.status >= 400) {
                  message.error('请求失败')
                  return
                }
                else if (ctx.error) {
                  message.error(ctx.error.message)
                  return
                }
                message.error('响应失败')
              },
            },
            options,
            localOptions,
          )
        }),
      ])),
    }
  },
})
