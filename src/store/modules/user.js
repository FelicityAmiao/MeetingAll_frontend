import { login } from '../../api/user';
import { getToken, removeToken, setToken } from '../../utils/auth';
import router from '../../router';
import MyMeeting from '../../views/MyMeeting/MyMeeting';
import MeetingRecords from '../../views/meetingRecords/MeetingRecords';
import Home from '../../views/Home';
const state = {
  token: getToken(),
  username: ''
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERNAME: (state, username) => {
    state.username = username;
  }
};

const actions = {
  // user login
  login ({ commit, dispatch }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(async response => {
        commit('SET_TOKEN', response.data.token);
        commit('SET_USERNAME', response.data.username);
        setToken(response.data);
        const accessRoutes = [{
          path: '/home',
          component: Home,
          children: [
            { path: 'myMeeting', component: MyMeeting },
            { path: 'meetingRecords', component: MeetingRecords }
          ]
        }];
        router.addRoutes(accessRoutes);
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  },
  // get user info
  getInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      resolve(['admin']);
    });
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '');
      removeToken();
      resolve();
    });
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      removeToken();
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
