import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/example',
    component: resolve => require(['@/view/example'], resolve)
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
