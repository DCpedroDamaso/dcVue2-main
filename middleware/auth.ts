export default defineNuxtRouteMiddleware((to, from) => {
    const auth=false;
    if (!auth) {
      return navigateTo('/compras')
    }
    // else{
    //      return navigateTo(to.path)
    // }

    // In a real app you would probably not redirect every route to `/`
    // however it is important to check `to.path` before redirecting or you
    // might get an infinite redirect loop

  })
