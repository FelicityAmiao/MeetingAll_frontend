<template>
  <div class='meeting-room-panel'>
    <el-carousel :interval='4000' type='card' height='420px'>
      <el-carousel-item v-for='(item, index) in officeList' :key='index'>
        <div @click='selectMeetingRoom(item.office)'>
         <div class='office-label'>{{item.office}}</div>
          <el-image style='width: 100%;height: 420px' :src='item.image' fit='fit'/>
        </div>
      </el-carousel-item>
    </el-carousel>
<!--    <el-col class='card-group' :span='8' v-for='(item, index) in officeList' :key='index'>-->
<!--      <el-card class='meeting-room-card' :body-style='{padding: "0px"}'>-->
<!--        <div class='card-body' @click='selectMeetingRoom(item)'>-->
<!--          <div class='card-label'>{{item}}</div>-->
<!--          <img class='meeting-room-img' src='https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png'>-->
<!--        </div>-->
<!--      </el-card>-->
<!--    </el-col>-->
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
        this.genOfficeList(_.keys(this.meetingRoomGroup));
      }
    },
    genOfficeList (keys) {
      _.forEach(keys, key => {
        let office = { office: key };
        switch (key) {
          case 'B5-5F-1':
            office.image = require('../../assets/china.png');
            break;
          case 'B5-5F-2':
            office.image = require('../../assets/ocean.png');
            break;
          case 'B6-3F':
            office.image = require('../../assets/digit.png');
            break;
          case 'B6-5F':
            office.image = require('../../assets/planet.png');
            break;
        }
        this.officeList.push(office);
      });
    },
    selectMeetingRoom (office) {
      const meetingRoomDetail = this.meetingRoomGroup[office];
      localStorage.setItem('meetingRoomDetail', JSON.stringify(meetingRoomDetail));
      this.$router.push({
        path: '/meetingRoomDetail'
      });
    }
  }
};
</script>

<style scoped>
  .meeting-room-panel {
    padding: 180px 180px;
  }
  .office-label {
    position: fixed!important;
    padding: 30px;
    color: white;
    font-weight: bolder;
    font-size: 30px;
    z-index: 3;
    width: 100%;
    height: 100%;
    background-color: rgba(77, 79, 82, 0.08);
    border: rgba(0, 21, 41, 0.08);
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
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
    position: relative;
    width: 100%;
    top: -240px;
    transition: all 0.2s linear;
  }
  .meeting-room-img:hover {
    transform: scale(1.1, 1.1);
    filter: contrast(130%);
  }
</style>
