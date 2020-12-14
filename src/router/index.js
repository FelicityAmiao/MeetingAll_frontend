import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const loginPage = () => import('../views/Login');

const routes = [
  {
    path: '/',
    component: loginPage
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
