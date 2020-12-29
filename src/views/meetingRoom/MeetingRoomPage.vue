<template>
  <div class='meeting-room-panel'>
    <el-col class='card-group' :span='8' v-for='(item, index) in officeList' :key='index'>
      <el-card class='meeting-room-card' :body-style='{padding: "0px"}'>
        <div class='card-body' @click='selectMeetingRoom(item)'>
          <div class='card-label'>{{item}}</div>
          <img class='meeting-room-img' src='https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png'>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import { queryMeetingRoomList } from '../../service/meetingRoom/index';
import _ from 'lodash';

export default {
  name: 'MeetingRoomPage',
  data () {
    return {
      officeList: [],
      meetingRoomGroup: {}
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
        this.officeList = _.keys(this.meetingRoomGroup);
      }
    },
    selectMeetingRoom (office) {
      const meetingRoomDetail = this.meetingRoomGroup[office];
      this.$router.push({
        path: '/home/meetingRoomDetail',
        query: {
          meetingRoomDetail
        }
      });
    }
  }
};
</script>

<style scoped>
  .meeting-room-panel {
    padding: 30px 30px;
  }
  .card-group {
    padding: 10px 0;
  }
  .meeting-room-card {
    width: 90%;
  }
  .card-body {
    position: relative;
    width: 100%;
    height: 220px;
  }
  .card-label {
    position: fixed;
    font-size: 30px;
    font-weight: bold;
    padding: 10px 10px;
    color: white;
    z-index: 99999;
  }
  .status-bar {
    position: absolute;
    padding: 10px 10px;
    bottom: 0;
    right: 0;
    /*background: rgba(51, 51, 51, 0.7);*/
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
  .meeting-room-img {
    width: 100%;
    height: 100%;
    transition: all 0.2s linear;
  }
  .meeting-room-img:hover {
    transform: scale(1.1, 1.1);
    filter: contrast(130%);
  }
</style>
