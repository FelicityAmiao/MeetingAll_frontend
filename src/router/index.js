import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const helloPage = () => import('../components/HelloWorld')

const routes = [
  {
    path: '/',
    component: helloPage
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
