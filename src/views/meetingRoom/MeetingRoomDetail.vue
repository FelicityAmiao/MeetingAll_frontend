<template>
  <div id='meetingRoomDetail'>
  <!-- <el-drawer
      size='300px'
      :visible.sync='isShowDrawer'
      :show-close='false'
      :modal='true'
    >
      <div slot='title'>
        <span>{{ selectedRoom.room }}</span>
      </div>
      <div>
        <el-form label-width='100px'>
          <el-form-item label='位置：'>
            <span>{{ selectedRoom.office }}</span>
          </el-form-item>
          <el-form-item label='人数：'>
            <span>{{ selectedRoom.size }}</span>
          </el-form-item>
          <el-form-item label='电源控制：'>
            <el-switch v-model='selectedRoom.isDeviceStarted' active-color='#3AA329' @change='updateDeviceStatus'/>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer> -->
    <div class='status-tool-bar'>
      <el-card v-if='selectedRoom !== null' shadow='hover'>
        <div slot='header'>
          <span>{{selectedRoom.office}}</span>
        </div>
        <div class='status-bar-body'>
          <el-row type='flex'>
            <el-col :span='6' style='text-align: right'>会议室: </el-col>
            <el-col :span='8' style='text-align: center'>{{selectedRoom.room}}</el-col>
          </el-row>
          <el-row type='flex'>
            <el-col :span='6' style='text-align: right'>状态: </el-col>
            <el-col :span='8' style='text-align: center'><div :class='`status-icon ${isBusyStatus(selectedRoom.currentStatus) ? "icon-background-red" : "icon-background-green"}`'/></el-col>
          </el-row>
          <el-row type='flex'>
            <el-col :span='6' style='text-align: right'>电源控制: </el-col>
            <el-col :span='8' style='text-align: center'>
              <li :class='`el-icon-switch-button tool-bar-icon  ${selectedRoom.isDeviceStarted ? "power-on" : ""}`' @click='updateDeviceStatus'/>
<!--              <el-switch v-model='selectedRoom.isDeviceStarted' active-color='#3AA329' @change='updateDeviceStatus'/>-->
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
    <div v-if='isSeaMeetingRoom'>
      <keep-alive>
        <world-map-chart :meeting-room-list='meetingRoomDetail' @select-room='selectRoom'/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import SolarSystemChart from '../../components/eChart/SolarSystemChart';
import ChinaMapChart from '../../components/eChart/ChinaMapChart';
import WorldMapChart from '../../components/eChart/WorldChart';
import { updateDevicePowerStatus } from '../../service/meetingRoom/index';
import _ from 'lodash';
import LoginDialog from '../LoginDialog';
export default {
  name: 'MeetingRoomDetail',
  components: { SolarSystemChart, LoginDialog, ChinaMapChart, WorldMapChart },
  data () {
    return {
      visible: false,
      dialogVisible: false,
      showLoginDialog: false,
      meetingRoomDetail: [],
      selectedRoom: {},
      isShowCard: false
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
    },
    isSeaMeetingRoom () {
      return !_.isEmpty(this.meetingRoomDetail) && _.isEqual('B5-5F-2', _.get(this.meetingRoomDetail[0], 'office', ''));
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
      if (this.selectedRoom.isDeviceStarted) {
        return;
      }
      if (this.$store.getters['user/token'] === undefined || this.$store.getters['user/token'] === '') {
        this.showLoginDialog = true;
        return;
      }
      let result = await updateDevicePowerStatus(this.selectedRoom);
      if (result.status !== 200) {
        this.$message.error('Device failed to start');
        return;
      }
      let index = _.findIndex(this.meetingRoomDetail, { id: this.selectedRoom.id });
      if (index === -1) {
        return;
      }
      this.$message.error('Device started successfully');
      this.$set(this.meetingRoomDetail, index, this.selectedRoom);
    },
    updateRoomStatus (value) {
      const index = _.findIndex(this.meetingRoomDetail, { id: value.id });
      if (index === -1) {
        return;
      }
      this.selectedRoom = value;
      this.$set(this.meetingRoomDetail, index, value);
      this.$route.query.meetingRoomDetail = JSON.stringify(this.meetingRoomDetail);
    }
  },
  watch: {
    '$route.query.meetingRoomDetail': {
      immediate: true,
      handler: function (value) {
        this.selectedRoom = null;
        this.meetingRoomDetail = _.isEmpty(value) ? [] : JSON.parse(value);
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
    margin-top: 110px;
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
  .power-on {
    color: #ffd008;
    cursor: not-allowed!important;
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
  /* >>>.el-drawer:focus {
    outline: none;
  }
  .drawer-font {
    color: '#606266' !important;
  }
  >>>.el-drawer__container {
    height: 300px !important;
  }
  >>>.el-drawer.rtl {
    border-radius: 5px !important;
    top: 33px;
    background: rgba(116, 137, 158, 0.3);
  } */
</style>
