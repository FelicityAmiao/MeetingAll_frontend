import { login } from '../../api/user';
import { getToken, removeToken, setToken } from '../../utils/auth';
import router from '../../router';
import MyMeeting from '../../views/MyMeeting/MyMeeting';
import MeetingRecords from '../../views/meetingRecords/MeetingRecords';
import Home from '../../views/Home';
const state = {
  token: getToken(),
  name: ''
};

const getters = {
  token: state => state.user.token
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  }
};

const actions = {
  // user login
  login ({ commit, dispatch }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(async response => {
        commit('SET_TOKEN', response.data);
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
  getters,
  state,
  mutations,
  actions
};
