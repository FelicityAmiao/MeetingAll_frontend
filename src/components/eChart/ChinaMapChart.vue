<template>
  <div style='width: 100%'>
    <div id='chinaMapChart' style='height: 909px'/>
  </div>
</template>

<script>
import elementResizeDetectorMaker from 'element-resize-detector';
import { CHINA_MAP, CHINA_MEETING_ROOMS } from '../../constant/eChart.constant';
import _ from 'lodash';

export default {
  name: 'ChinaMapChart',
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

    erd.listenTo(document.getElementById('chinaMapChart'), element => {
      if (_this.chart) {
        _this.chart.resize();
      }
    });
    this.genChart();
  },
  methods: {
    genChart () {
      let doc = document.getElementById('chinaMapChart');
      this.chart = this.$echarts.init(doc);
      const width = _.get(document.getElementById('homePage'), 'offsetWidth') || '';
      const height = _.get(document.getElementById('homePage'), 'offsetHeight') || '';
      doc.style.width = `${width}px`;
      doc.style.height = `${height}px`;
      this.chart.clear();

      this.$echarts.registerMap('chinaMap', CHINA_MAP);

      let option = {
        backgroundColor: '#000f1e',
        title: {
          text: 'B5-5F-1',
          left: 'left',
          padding: [90, 0, 0, 20],
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'chinaMap',
          aspectScale: 0.85,
          roam: true,
          layoutCenter: ['50%', '50%'], // 地图位置
          layoutSize: '100%',
          zoom: 2,
          itemStyle: {
            normal: {
              areaColor: 'rgba(0,255,255,.02)',
              borderColor: '#1cccff',
              borderWidth: 0.5,
              shadowColor: '#00ffff',
              shadowOffsetX: 0,
              shadowOffsetY: 4,
              shadowBlur: 10
            },
            emphasis: {
              areaColor: {
                type: 'linear-gradient',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(45,68,121,0.15)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(45,68,121,0.18)' // 100% 处的颜色
                }
                ],
                global: true // 缺省为 false
              }
            }
          },
          label: {
            emphasis: {
              show: false,
              textStyle: {
                color: '#fff'
              }
            }
          }
        },
        series: [
          // 常规地图
          {
            type: 'map',
            mapType: 'china',
            aspectScale: 0.85,
            layoutCenter: ['50%', '50%'], // 地图位置
            layoutSize: '100%'
          },
          // 区域散点图
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            symbolSize: 20,
            rippleEffect: { // 坐标点动画
              period: 3,
              scale: 3,
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: true,
                position: 'bottom',
                formatter: '{b}',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 13
              }
            },
            data: this.getRoomCoords(),
            itemStyle: {
              normal: {
                show: true,
                color: function (params) {
                  return _.isEqual(params.data.currentStatus, '0') ? 'green' : 'red';
                },
                shadowBlur: 20,
                shadowColor: '#fff'
              }
            }
          }
        ],
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
    getRoomCoords () {
      let dataList = [];
      _.forEach(this.meetingRoomList, it => {
        let data = _.find(CHINA_MEETING_ROOMS, { name: it.room });
        if (_.isEmpty(data)) {
          return;
        }
        dataList.push(Object.assign(data, it));
      });
      return dataList;
    },
    resetWidth (element) {
      let doc = document.getElementById('chinaMapChart');
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
  },
  watch: {
    meetingRoomList: {
      deep: true,
      handler: function (val) {
        this.genChart();
      }
    }
  }
};
</script>

<style scoped>

</style>
