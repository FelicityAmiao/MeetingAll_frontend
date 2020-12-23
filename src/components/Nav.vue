<template>
  <el-row>
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1" @click="locationView(1)">
          <i class="el-icon-location"></i>
          <span slot="title">会议室</span>
      </el-menu-item>
      <el-menu-item index="2" @click="locationView(2)">
          <i class="el-icon-date"></i>
          <span slot="title">我的会议</span>
      </el-menu-item>
      <el-menu-item index="3" @click="locationView(3)">
          <i class="el-icon-document"></i>
          <span slot="title">我的报告</span>
      </el-menu-item>
    </el-menu>
  </el-row>
</template>

<script>
export default {
  name: 'Nav',
  mounted () {
    this.$router.push('/home/meetingRoom')
  },
  methods: {
    locationView (index) {
      switch (index) {
        case 1:
          this.$router.push('/home/meetingRoom')
          break
        case 2:
          this.$router.push('/home/myMeeting')
          break
        case 3:
          break
      }
    }
  }
}
</script>

<style>
</style>
