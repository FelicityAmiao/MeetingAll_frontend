<template>
  <div style='width: 100%'>
    <div id='worldMap' style='width: 1000px ,height: 909px'></div>
  </div>
</template>
<script>
import _ from 'lodash';
import { WORLD_MAP, SEA_MEETING_ROOM } from '../../constant/worldMap.constant';
import elementResizeDetectorMaker from 'element-resize-detector';

export default {
  name: 'WorldMapChart',
  props: {
    meetingRoomList: {
      type: Array,
      defaults: () => []
    }
  },
  data () {
    return {
      chart: null
    };
  },
  mounted () {
    const _this = this;
    const erd = elementResizeDetectorMaker();
    erd.listenTo(document.getElementById('homePage'), element => {
      _this.resetWidth(element);
    });

    erd.listenTo(document.getElementById('worldMap'), element => {
      if (_this.chart) {
        _this.chart.resize();
      }
    });
    this.genChart();
  },
  methods: {
    getRoomCoords () {
      let dataList = [];
      _.forEach(this.meetingRoomList, it => {
        let data = _.find(SEA_MEETING_ROOM, { name: it.room });
        if (_.isEmpty(data)) {
          return;
        }
        dataList.push(Object.assign(data, it));
      });
      return dataList;
    },
    genChart () {
      let doc = document.getElementById('worldMap');
      this.chart = this.$echarts.init(doc);
      const width =
        _.get(document.getElementById('homePage'), 'offsetWidth') || '';
      const height =
        _.get(document.getElementById('homePage'), 'offsetHeight') || '';
      doc.style.width = `${width}px`;
      doc.style.height = `${height}px`;
      this.chart.clear();

      this.$echarts.registerMap('world', WORLD_MAP);

      let series = [];

      SEA_MEETING_ROOM.forEach((value, index) => {
        series.push({
          name: value.name,
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: {
            period: 3,
            scale: 3,
            brushType: 'stroke'
          },
          label: {
            normal: {
              show: true,
              padding: 15,
              position: 'bottom',
              formatter: '{b}',
              color: '#c4cbcf',
              fontSize: 18,
              fontWeight: 'bold'
            }
          },
          symbolSize: function (val) {
            return 20;
          },
          itemStyle: {
            normal: {
              color: function (params) {
                return _.isEqual(params.data.currentStatus, '0') ? 'green' : 'red';
              }
            }
          },
          data: this.getRoomCoords()
        });
      });

      let option = {
        backgroundColor: '#000f1e',
        title: {
          text: 'B5-5F-2',
          left: 'left',
          padding: [90, 0, 0, 20],
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'world',
          label: {
            emphasis: {
              show: false
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: 'rgba(0,255,255,.02)',
              borderColor: '#1cccff'
            },
            emphasis: {
              areaColor: '#0b1c2d'
            }
          }
        },
        series: series,
        tooltip: {
          trigger: 'item',
          formatter: this.toolTipFormatter
        }
      };
      this.$nextTick(() => {
        this.chart.setOption(option);
        this.chart.on('click', params => {
          const room = _.find(this.meetingRoomList, { room: params.name }) || {};
          if (_.isEmpty(room)) {
            return;
          }
          this.$emit('select-room', room);
        });
      });
    },
    resetWidth (element) {
      let doc = document.getElementById('worldMap');
      if (_.isEmpty(doc)) {
        return;
      }
      doc.style.width = element.offsetWidth + 'px';
    },
    toolTipFormatter (params) {
      let statusMarker = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.data.status ? 'red' : 'green'};"></span>`;
      let roomMarker = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color: #0f59a4;};"></span>`;
      let htmlStr = '';
      htmlStr += roomMarker;
      htmlStr += '会议室名：' + params.data.room;
      htmlStr += '<br/>';
      htmlStr += ' ';
      htmlStr += statusMarker;
      htmlStr += '状态：';
      htmlStr += params.data.status ? '占用' : '空闲';
      return htmlStr;
    }
  }
};
</script>
<style scoped></style>
