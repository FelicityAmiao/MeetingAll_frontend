import router from './router';
import { getToken } from './utils/auth'; // get token from cookie

const whiteList = ['/login', '/register', '/meetingRoom', '/home/meetingRoomDetail', '/myMeeting', '/meetingRecords']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // determine whether the user has logged in
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/home/myMeeting' });
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      next();
    }
  } else {
    /* has no token */

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
    }
  }
});
