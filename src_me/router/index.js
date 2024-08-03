import Vue from 'vue'
import VueRouter from 'vue-router'

// import Loading from 'quasar'
// import { LoadingBar } from 'quasar/dist/quasar.esm'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  // Router.beforeResolve((to, from, next) => {
  // // If this isn't an initial page load.
  //   if (to.name) {
  //     // this.$q.loadingBar.start()
  //     LoadingBar.start()
  //   }
  //   next()
  // })

  // Router.afterEach((to, from) => {
  //   // this.$q.loadingBar.hide()
  //   // LoadingBar.hide()
  // })
  return Router
}
