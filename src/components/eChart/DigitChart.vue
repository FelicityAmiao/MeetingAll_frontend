<template>
  <div class='meeting-room-panel'>
    <el-col class='card-group' :span='4' v-for='(item, index) in roomList' :key='index'>
      <el-card class='meeting-room-card'>
        <div>
          <div class='box'  :class='flip[index] ? "flipped" : "" '>
            <div class='card front'>
              <span :class='`status-icon-front ${isBusyStatus(item.currentStatus) ? "icon-background-red" : "icon-background-green"}`'></span>
              <div :class='flip[index] ?"" : "roomFont" '><i>{{getRoomDescriptionByRoomName(item.room)}}</i></div>
            </div>
            <div class='card back'>
              <el-row class='meeting-room-detail'>
                <div class='meeting-room-name'><i>{{getRoomDescriptionByRoomName(item.room)}}</i></div>
                <el-row>
                  <el-col :span='8'>Room:</el-col>
                  <el-col :span='12'>{{item.room}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span='8'>Status:</el-col>
                  <el-col :span='12'>
                    <div :class='`status-icon ${isBusyStatus(item.currentStatus) ? "icon-background-red" : "icon-background-green"}`'/>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span='15'>Power Control:</el-col>
                  <el-col :span='6'>
                    <el-switch v-model='item.isDeviceStarted' active-color='#3AA329'
                               @change='updateDeviceStatus(item)' :disabled='item.isDeviceStarted'/>
                  </el-col>
                </el-row>
              </el-row>
            </div>
          </div>
        </div>
      </el-card>
      <login-dialog :showLoginDialog='showLoginDialog' @closeLoginDialog='closeLoginDialog'></login-dialog>
    </el-col>
  </div>
</template>

<script>
import { queryMeetingRoomList, updateDevicePowerStatus } from '../../service/meetingRoom';

import LoginDialog from '../../views/LoginDialog';
import _ from 'lodash';

export default {
  name: 'MeetingRoomPage',
  components: { LoginDialog },
  props: {
    meetingRoomList: {
      type: Array,
      defaults: () => []
    }
  },
  data () {
    return {
      roomList: this.meetingRoomList,
      flip: [],
      showLoginDialog: false,
      meetingRoomDetail: [],
      meetingRoomGroup: {},
      meetingRoomNameMap: [
        {
          room: '1',
          description: '意'
        },
        {
          room: '2',
          description: '耳'
        }, {
          room: '3',
          description: '叁'
        }, {
          room: '4',
          description: '思'
        }, {
          room: '5',
          description: '悟'
        }, {
          room: '6',
          description: '溜'
        }, {
          room: '7',
          description: '奇'
        }, {
          room: '8',
          description: '霸'
        }, {
          room: '9',
          description: '就'
        }, {
          room: '10',
          description: '實'
        }
      ]
    };
  },
  created () {
    this.queryMeetingRoomList();
  },
  methods: {
    async queryMeetingRoomList () {
      let result = await queryMeetingRoomList();
      if (result) {
        this.meetingRoomGroup = _.groupBy(result, 'office');
        this.roomList = this.meetingRoomGroup['B6-3F'];
      }
    },
    closeLoginDialog () {
      this.showLoginDialog = false;
    },
    flipCard (currentStatus, index) {
      if (currentStatus === '0') {
        this.$set(this.flip, index, !this.flip[index]);
      }
    },
    init () {
      this.roomList.forEach((room, index) => {
        room.currentStatus === '1' ? this.flip[index] = false : this.flip[index] = true;
      });
    },
    isBusyStatus (status) {
      return _.isEqual(status, '1');
    },
    async updateDeviceStatus (room) {
      if (room.isDeviceStarted) {
        if (this.$store.getters['user/token'] === undefined || this.$store.getters['user/token'] === '') {
          room.isDeviceStarted = !room.isDeviceStarted;
          this.showLoginDialog = true;
          return;
        }
        await updateDevicePowerStatus(room);
        this.$message.success('Device started successfully');
      }
    },
    getRoomDescriptionByRoomName (roomName) {
      let result = this.meetingRoomNameMap.filter(val => {
        return val.room === roomName;
      });
      if (result[0]) {
        return result[0].description;
      }
    },
    updateRoomStatus (value) {
      const index = _.findIndex(this.roomList, { id: value.id });
      if (index === -1) {
        return;
      }
      this.$emit('select-room');
      this.$set(this.roomList, index, value);
    }
  },
  computed: {
    updatedRoom () {
      return this.$store.getters['socket/GET_UPDATED_ROOM'];
    }
  },
  watch: {
    updatedRoom: {
      deep: true,
      handler: function (value) {
        this.updateRoomStatus(value);
      }
    },
    roomList: {
      deep: true,
      handler: function (value) {
        this.init();
      }
    }
  }
};
</script>

<style scoped>
  .meeting-room-panel {
    padding: 30px 30px;
  }

  .card-group {
    padding: 10px 0px;
    margin-top: 60px;
    margin-left: 60px;
  }

  .room-circle-outer {
    position: relative;
    top: 22%;
    left: 16%;
    width: 100px;
    height: 100px;
    padding: 18px 20px 20px 18px;
    border: 2px solid white;
    border-radius: 70px;
    text-align: center;
    vertical-align: center;
  }

  .room-circle-inner {
    width: 100px;
    height: 100px;
    border: 2px solid white;
    border-radius: 50px;
    color: rgb(84, 92, 100);
    background: green;
  }

  .meeting-room-card {
    margin-left: 5px;
    width: 95%;
  }

  .meeting-room-name {
    text-align: center;
    position: fixed;
    font-size: 80px;
    font-family: SimSun;
    top: 240px;
    left: 160px;
  }

  .meeting-room-detail {
    padding: 25px;
  }

  .status-icon-front {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: inline-block;
    margin-left: 180px;
    margin-bottom: 20px;
  }

  .status-icon {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: inline-block;
    margin-bottom: -2px;
  }

  .icon-background-red {
    background: #F90000;
  }

  .icon-background-green {
    background: #3AA329;
  }

  .box {
    padding: 0 0 0 10px;
    width: 250px;
    height: 300px;
    transform-style: preserve-3d;
    transition: transform 1s;
  }

  .card {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 20px;
  }

  .front {
    font-weight: bold;
    color: white;
    line-height: 100px;
    text-align: center;
    background-image: url('../../assets/background.png');
    width: 88%;
    height: 100%;
    background-position: center 0;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
  }

  .back {
    transform: rotateY(180deg);
    /*background-image: url('../../assets/222.png');*/
    /*background-position: -287px -23px;*/
    font-size: 15px;
    line-height: 30px;
  }

  .flipped {
    transform: rotateY(180deg);
  }

  .roomFont {
    font-size: 80px;
    font-family: SimSun;
    top: 105px;
    left: 50px;
    color: #7b6755;
    position: relative;
  }
</style>
