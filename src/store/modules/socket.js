import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import _ from 'lodash';

const state = {
  socketClient: null,
  updatedRoom: {},
  updatedMeetingRecord: {}
};

const getters = {
  SOCKET_CLIENT: state => state.socketClient,
  GET_UPDATED_ROOM: state => state.updatedRoom,
  GET_UPDATED_MEETING_RECORD: state => state.updatedMeetingRecord
};

const mutations = {
  SET_UPDATED_ROOM: (state, updatedRoom) => {
    state.updatedRoom = updatedRoom;
  },
  SET_UPDATE_MEETING_RECORD: (state, updateRecord) => {
    state.updatedMeetingRecord = updateRecord;
  },
  SET_SOCKET_CLIENT: (state, client) => {
    state.socketClient = client;
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
      state.socketClient.subscribe('/queue/reportGeneration', function (record) {
        const updatedRecord = _.get(record, 'body', {});
        state.commit('SET_UPDATE_MEETING_RECORD', updatedRecord);
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
