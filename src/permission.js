import router from './router';
import { getToken } from './utils/auth'; // get token from cookie
import context from './main';
router.beforeEach(async (to, from, next) => {
  // determine whether the user has logged in
  const hasToken = getToken();
  if (to.matched.some(record => record.meta.requireLogin)) {
    if (hasToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/myMeeting' });
      } else {
        // determine whether the user has obtained his permission roles through getInfo
        next();
      }
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      context.$confirm('该功能需登陆操作，是否登录?', '提示', {
        confirmButtonText: '登陆',
        cancelButtonText: '继续浏览',
        type: 'warning'
      }).then(() => {
        next(`/login?redirect=meetingRoom`);
      });
    }
  } else {
    next();
  }
});
