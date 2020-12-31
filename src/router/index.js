import Vue from 'vue';
import VueRouter from 'vue-router';
import ASR from '../components/ASR';
import MeetingRoom from '../views/meetingRoom/MeetingRoomPage';
import MeetingRoomDetail from '../views/meetingRoom/MeetingRoomDetail';
import MyMeeting from '../views/MyMeeting/MyMeeting';
import Home from '../views/HomePage';
import Test from '../views/Test';
import MeetingRecords from '../views/meetingRecords/MeetingRecords';
import EChart from '../components/eChart/ChinaMapChart';

Vue.use(VueRouter);
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err);
};
const loginPage = () => import('../views/login');
const registerPage = () => import('../views/register');
const highFrequencyWordPage = () => import('../views/HighFrequencyWord');

const routes = [
  {
    path: '/login',
    component: loginPage
  },
  {
    path: '/register',
    component: registerPage
  },
  {
    path: '/highfrequencyword',
    component: highFrequencyWordPage
  },
  {
    path: '/ASR',
    component: ASR
  },
  {
    path: '/',
    component: Home,
    redirect: '/meetingRoom',
    children: [
      { path: '/meetingRoom', component: MeetingRoom },
      { path: '/meetingRoomDetail', component: MeetingRoomDetail },
      { path: '/myMeeting', component: MyMeeting },
      { path: '/meetingRecords', component: MeetingRecords }
    ]
  },
  {
    path: '/test',
    component: Test
  },
  {
    path: '/e-chart',
    component: EChart
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
