import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const state = {
  socketClient: null,
  updatedRoom: {}
};

const getters = {
  socketClient: state => state.socketClient
};

const mutations = {
};

const actions = {
  // connect
  connect (state) {
    var socket = new SockJS('/api/connect');
    state.socketClient = Stomp.over(socket);
    state.socketClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      state.socketClient.subscribe('/topic/subscribeMeetingStatus', function (room) {
        state.updatedRoom = room;
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
