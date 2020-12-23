import Vue from 'vue'
import VueRouter from 'vue-router'
import ASR from '../components/ASR'
import MeetingRoom from '../views/meetingRoom/MeetingRoomPage'
import MeetingRoomDetail from '../views/meetingRoom/MeetingRoomDetail'
import MyMeeting from '../views/MyMeeting/MyMetting'
import Home from '../views/Home'
import Test from '../views/Test'

Vue.use(VueRouter)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
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
  },
  {
    path: '/home',
    component: Home,
    children: [
      { path: 'meetingRoom', component: MeetingRoom },
      { path: 'myMeeting', component: MyMeeting }
    ]
  },
  {
    path: '/myMeeting',
    component: MyMeeting
  },
  {
    path: '/test',
    component: Test
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
