import { login } from '../../api/user';
import { getToken, removeToken, setToken } from '../../utils/auth';
import router from '../../router';
import MyMeeting from '../../views/MyMeeting/MyMeeting';
import MeetingRecords from '../../views/meetingRecords/MeetingRecords';
import Home from '../../views/Home';
import { loadRoomOption } from '../../utils/global_func';
const state = {
  token: getToken(),
  roomOptions: []
};
const getters = {
  token: state => state.token,
  username: state => state.username,
  roomOptions: state => state.roomOptions
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ROOM_OPTION: (state, roomOptions) => {
    state.roomOptions = roomOptions;
  }
};

const actions = {
  // user login
  login ({ commit, dispatch }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(async response => {
        commit('SET_TOKEN', response.data.token);
        sessionStorage.setItem('username', response.data.username);
        setToken(response.data.token);
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

  loadSupportData ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      loadRoomOption().then(async response => {
        commit('SET_ROOM_OPTION', response.data);
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
      sessionStorage.removeItem('username');
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
  getters,
  mutations,
  actions
};
