<template>
  <div id='meetingRoomDetail' class='meeting-room-detail'>
    <div class='status-tool-bar'>
      <el-card v-if='selectedRoom !== null' shadow='hover'>
        <div slot='header'>
          <span>{{selectedRoom.office}}</span>
        </div>
        <div class='status-bar-body'>
          <el-row type='flex'>
            <el-col :span='10'>Room: </el-col>
            <el-col :span='4' style='text-align: center'>{{selectedRoom.room}}</el-col>
          </el-row>
          <el-row type='flex'>
            <el-col :span='10'>Status: </el-col>
            <el-col :span='4' style='text-align: center'><div :class='`status-icon ${isBusyStatus(selectedRoom.currentStatus) ? "icon-background-red" : "icon-background-green"}`'/></el-col>
          </el-row>
          <el-row type='flex'>
            <el-col :span='10'>Power Control: </el-col>
            <el-col :span='4' style='text-align: center'>
              <el-switch v-model='selectedRoom.isDeviceStarted' active-color='#3AA329' @change='updateDeviceStatus'/>
            </el-col>
          </el-row>
        </div>
      </el-card>
    <login-dialog :showLoginDialog='showLoginDialog' @closeLoginDialog='closeLoginDialog'></login-dialog>
    </div>
    <div v-if='isPlanetMeetingRoom'>
      <keep-alive>
        <solar-system-chart :meeting-room-list='meetingRoomDetail' @select-room='selectRoom'/>
      </keep-alive>
    </div>
    <div v-if='isChinaMeetingRoom'>
      <keep-alive>
        <china-map-chart :meeting-room-list='meetingRoomDetail' @select-room='selectRoom'/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import SolarSystemChart from '../../components/eChart/SolarSystemChart';
import ChinaMapChart from '../../components/eChart/ChinaMapChart';
import { updateDevicePowerStatus } from '../../service/meetingRoom/index';
import _ from 'lodash';
import LoginDialog from '../LoginDialog';
export default {
  name: 'MeetingRoomDetail',
  components: { SolarSystemChart, LoginDialog, ChinaMapChart },
  data () {
    return {
      visible: false,
      dialogVisible: false,
      showLoginDialog: false,
      meetingRoomDetail: [],
      selectedRoom: null
    };
  },
  computed: {
    updatedRoom () {
      return this.$store.getters['socket/GET_UPDATED_ROOM'];
    },
    isChinaMeetingRoom () {
      return !_.isEmpty(this.meetingRoomDetail) && _.isEqual('B5-5F-1', _.get(this.meetingRoomDetail[0], 'office', ''));
    },
    isPlanetMeetingRoom () {
      return !_.isEmpty(this.meetingRoomDetail) && _.isEqual('B6-5F', _.get(this.meetingRoomDetail[0], 'office', ''));
    }
  },
  methods: {
    isBusyStatus (status) {
      return _.isEqual(status, '1');
    },
    selectRoom (room) {
      this.selectedRoom = room;
    },
    closeLoginDialog () {
      this.showLoginDialog = false;
    },
    async updateDeviceStatus () {
      if (this.$store.getters.token === undefined || this.$store.getters.token === '') {
        this.showLoginDialog = true;
        this.selectedRoom.isDeviceStarted = !this.selectedRoom.isDeviceStarted;
        return;
      }
      await updateDevicePowerStatus(this.selectedRoom);
      let index = _.findIndex(this.meetingRoomDetail, { id: this.selectedRoom.id });
      if (index === -1) {
        return;
      }
      this.$set(this.meetingRoomDetail, index, this.selectedRoom);
    },
    updateRoomStatus (value) {
      const index = _.findIndex(this.meetingRoomDetail, { id: value.id });
      if (index === -1) {
        return;
      }
      this.selectedRoom = value;
      this.$set(this.meetingRoomDetail, index, value);
    }
  },
  watch: {
    '$route.query.meetingRoomDetail': {
      immediate: true,
      handler: function (value) {
        this.meetingRoomDetail = value;
      }
    },
    updatedRoom: {
      deep: true,
      handler: function (value) {
        this.updateRoomStatus(value);
      }
    }
  }
};
</script>

<style scoped>
  .status-tool-bar {
    position: absolute;
    color: white;
    width: 20%;
    height: 10%;
    padding: 10px;
    z-index: 99999;
  }
  .status-tool-footer {
     position: absolute;
     width: 100%;
     height: 30px;
     bottom: 0;
     padding: 5px;
     background: rgba(51, 51, 51, 0.08);
   }
  .status-bar-body {
    position: relative;
    width: 100%;
    height: 60px;
  }
  .tool-bar-icon {
    cursor: pointer;
    float: right;
    margin-right: 10px;
  }
  .tool-bar-icon {
    cursor: pointer;
    float: right;
    margin-right: 10px;
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
  >>>.el-card {
    border: 1.5px solid #0e7393;
    background-color: rgba(45,68,121,0.15);
    color: white;
    transition: .3s;
  }
  >>>.el-card__header {
    padding: 18px 20px;
    border-bottom: 1.5px solid #0e7393;
    box-sizing: border-box;
  }
</style>
