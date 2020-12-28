<template>
  <div id='meetingRoomDetail' class='meeting-room-detail'>
    <solar-system-chart :meeting-room-list='meetingRoomDetail' :width='width' :height='height'/>
  </div>
</template>

<script>
import SolarSystemChart from '../../components/eChart/SolarSystemChart';
export default {
  name: 'MeetingRoomDetail',
  components: { SolarSystemChart },
  data () {
    return {
      visible: false,
      dialogVisible: false,
      meetingRoomDetail: [],
      width: 0,
      height: 0
    };
  },
  mounted () {
    this.initStyle();
    window.addEventListener('resize', () => {
      this.$nextTick(() => {
        this.initStyle();
      });
    });
  },
  methods: {
    initStyle () {
      let element = document.getElementById('mainContainer');
      if (element && element.style) {
        this.width = element.offsetWidth;
        this.height = element.offsetHeight;
      }
    },
    newMeeting () {
      this.dialogVisible = true;
    }
  },
  watch: {
    '$route.query.meetingRoomDetail': {
      immediate: true,
      handler: function (value) {
        this.meetingRoomDetail = value;
        console.log(value);
      }
    }
  }
};
</script>

<style scoped>
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
