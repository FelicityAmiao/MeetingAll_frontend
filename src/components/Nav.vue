<template>
  <el-row>
    <el-menu
      default-active='1'
      background-color='#545c64'
      text-color='#fff'
      active-text-color='#ffd04b'
      :collapse='collapse'>
      <el-menu-item index='1' @click='locationView(1)'>
        <i class='el-icon-location'/>
          <span slot='title'>会议室</span>
      </el-menu-item>
      <el-menu-item index='2' @click='locationView(2)'>
        <i class='el-icon-date'/>
          <span slot='title'>开会</span>
      </el-menu-item>
      <el-menu-item index='3' @click='locationView(3)'>
        <i class='el-icon-document'/>
          <span slot='title'>会议记录</span>
      </el-menu-item>
    </el-menu>
  </el-row>
</template>

<script>
export default {
  name: 'Nav',
  props: {
    isCollapse: {
      type: Boolean,
      default: () => true
    }
  },
  mounted () {
    this.$router.push('/home/meetingRoom');
  },
  computed: {
    collapse () {
      return this.isCollapse;
    }
  },
  methods: {
    locationView (index) {
      switch (index) {
        case 1:
          this.$router.push('/home/meetingRoom');
          break;
        case 2:
          this.$router.push('/home/myMeeting');
          break;
        case 3:
          this.$router.push('/home/meetingRecords');
          break;
      }
    }
  }
};
</script>

<style scoped>
</style>
