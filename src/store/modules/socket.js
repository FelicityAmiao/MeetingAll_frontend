import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import _ from 'lodash';

const state = {
  socketClient: null,
  updatedRoom: {},
  updatedMeetingRecord: {}
};

const getters = {
  socketClient: state => state.socketClient,
  GET_UPDATED_ROOM: state => state.updatedRoom
};

const mutations = {
  SET_UPDATED_ROOM: (state, updatedRoom) => {
    state.updatedRoom = updatedRoom;
  }
};

const actions = {
  // connect
  connect (state) {
    var socket = new SockJS('/api/connect');
    state.socketClient = Stomp.over(socket);
    state.socketClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      state.socketClient.subscribe('/topic/subscribeMeetingStatus', function (frame) {
        const updatedRoom = JSON.parse(_.get(frame, 'body', {}));
        state.commit('SET_UPDATED_ROOM', updatedRoom);
      });
      state.socketClient.subscribe('/user/queue/reportGeneration', function (room) {
        state.updatedMeetingRecord = room;
      });
    });
  },

  sendMessage (state, msg) {
    state.socketClient.send('/app/updateMeeting', msg);
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
