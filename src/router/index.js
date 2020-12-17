import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const loginPage = () => import('../views/login')
const recorderPage = () => import('../views/recorder')

const routes = [
  {
    path: '/',
    component: recorderPage
  },
  {
    path: '/recorder',
    component: loginPage
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
