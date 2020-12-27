<template>
  <div class='meeting-room-detail'>
    <el-col class='card-group' :span='5' v-for='(item, index) in meetingRoomDetail' :key='index'>
      <el-card class='meeting-room-card' :body-style='{padding: "0px"}'>
        <div slot='header' class='card-header'>
          <el-row>
            <el-col :span='20'><span>{{item.room}}</span></el-col>
            <el-col :span='4' class='meeting-room-status'><div :class='`status-icon ${isBusyStatus(item.currentStatus) ? "icon-background-red" : "icon-background-green"}`'/></el-col>
          </el-row>
        </div>
        <div class='card-body' @mouseenter='visible = true' @mouseleave='visible = false'>
          <transition name='el-fade-in-linear'>
            <el-row class='card-tool-bar' v-show='visible'>
              <el-col :span='2' class='tool-bar-icon'><i class='el-icon-switch-button'/></el-col>
            </el-row>
          </transition>
        </div>
      </el-card>
    </el-col>
    <el-dialog
      title='New Meeting'
      :visible.sync='dialogVisible'
      width='30%'>
      <el-date-picker
        v-model='value1'
        type='datetime'
        placeholder='select time'>
      </el-date-picker>
      <span slot='footer'>
    <el-button @click='dialogVisible = false'>Cancel</el-button>
    <el-button type='primary' @click='dialogVisible = false'>Save</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'MeetingRoomDetail',
  data () {
    return {
      visible: false,
      dialogVisible: false,
      meetingRoomDetail: []
    }
  },
  methods: {
    isBusyStatus (status) {
      return _.isEqual(status, '1')
    },
    newMeeting () {
      this.dialogVisible = true
    }
  },
  watch: {
    '$route.query.meetingRoomDetail': {
      immediate: true,
      handler: function (value) {
        this.meetingRoomDetail = value
        console.log(value)
      }
    }
  }
}
</script>

<style scoped>
  .meeting-room-detail {
    padding: 30px 30px;
  }
  .card-header {
    height: 35px!important;
  }
  .card-group {
    padding: 10px 0;
  }
  .card-tool-bar {
    position: absolute;
    width: 100%;
    height: 30px;
    bottom: 0;
    padding: 5px;
    background: rgba(51, 51, 51, 0.08);
  }
  .meeting-room-card {
    width: 90%;
  }
  .meeting-room-status {
    float: right;
  }
  .meeting-time-range {
    font-size: 12px;
  }
  .card-body {
    position: relative;
    width: 100%;
    height: 150px;
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
</style>
