import Vue from 'vue'
import VueRouter from 'vue-router'
import ASR from '../components/ASR'

Vue.use(VueRouter)
const loginPage = () => import('../views/Login')

const routes = [
  {
    path: '/',
    component: loginPage
  },
  {
    path: '/ASR',
    component: ASR
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
