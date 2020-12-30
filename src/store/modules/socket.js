import SockJS from '@/utils/sockjs-0.3.4.js';
import Stomp from '@/utils/stomp.js';

const state = {
  socketClient: null
};

const getters = {
  socket: state => state.socket.socketClient
};

const mutations = {
};

const actions = {
  // connect
  connect (state) {
    var socket = new SockJS('/hello');
    state.socketClient = Stomp.over(socket);
    state.socketClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      state.socketClient.subscribe('/topic/subscribeMeetingStatus', function (greeting) {
        console.log(greeting);
      });
    });
  },

  // disconnect
  disconnect (state) {
    if (state.socketClient != null) {
      state.socketClient.disconnect();
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
