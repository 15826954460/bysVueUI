import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "about" */ '@/views/index.vue')
    },
    {
      path: '/',
      name: 'touchprogress',
      component: () => import(/* webpackChunkName: "about" */ '@/demos/TouchProgress/index.vue')
    }
  ]
})
