import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const loginPage = () => import('../views/Login')
const highFrequencyWordPage = () => import('../views/HighFrequencyWord')

const routes = [
  {
    path: '/',
    component: loginPage
  }, {
    path: '/highfrequencyword',
    component: highFrequencyWordPage
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
