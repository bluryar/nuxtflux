// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default defineNuxtRouteMiddleware(async () => {
  const user = useUserStore()

  if (!user.hasLogin)
    return navigateTo('/login')

  if (user.hasLogin && !user.userInfo)
    return await user.executeUserInfo()
})
