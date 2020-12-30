<template>
  <el-row>
    <el-menu
      router
      background-color='#545c64'
      text-color='#fff'
      active-text-color='#ffd04b'
      :default-active='defaultActive'
      :collapse='collapse'>
      <el-menu-item index='/meetingRoom'>
        <i class='el-icon-location'/>
          <span slot='title'>会议室</span>
      </el-menu-item>
      <el-menu-item index='/myMeeting'>
        <i class='el-icon-date'/>
          <span slot='title'>开会</span>
      </el-menu-item>
      <el-menu-item index='/meetingRecords'>
        <i class='el-icon-document'/>
          <span slot='title'>历史会议记录</span>
      </el-menu-item>
    </el-menu>
  </el-row>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'Nav',
  props: {
    isCollapse: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    collapse () {
      return this.isCollapse;
    },
    defaultActive: function () {
      let active = this.$route.path;
      if (!_.isEqual(active, '/meetingRoom') && _.isEqual(active, '/meetingRoomDetail')) {
        return '/meetingRoom';
      }
      return active;
    }
  },
  methods: {
  }
};
</script>

<style scoped>
</style>
