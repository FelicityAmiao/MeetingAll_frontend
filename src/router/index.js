import Vue from 'vue'
import VueRouter from 'vue-router'
import ASR from '../components/ASR'
import MeetingRoom from '../views/meetingRoom/MeetingRoomPage'
import MeetingRoomDetail from '../views/meetingRoom/MeetingRoomDetail';

Vue.use(VueRouter)
const loginPage = () => import('../views/login')
const highFrequencyWordPage = () => import('../views/HighFrequencyWord')
const recorderPage = () => import('../views/recorder')

const routes = [
  {
    path: '/',
    component: recorderPage
  },
  {
    path: '/recorder',
    component: loginPage
  }, {
    path: '/highfrequencyword',
    component: highFrequencyWordPage
  },
  {
    path: '/ASR',
    component: ASR
  },
  {
    path: '/meetingRoom',
    component: MeetingRoom
  },
  {
    path: '/meetingRoomDetail',
    component: MeetingRoomDetail
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
