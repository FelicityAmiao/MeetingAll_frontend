import router from './router';
import { getToken } from './utils/auth'; // get token from cookie

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
      if (confirm('该功能需登陆操作，是否登录?')) {
        next(`/login?redirect=meetingRoom`);
      }
    }
  } else {
    next();
  }
});
