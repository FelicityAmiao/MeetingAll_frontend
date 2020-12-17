import Vue from 'vue'
import VueRouter from 'vue-router'
import ASR from '../components/ASR'

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
