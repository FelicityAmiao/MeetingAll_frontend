<template>
  <div style='width: 100%'>
    <div id='chinaMapChart' style='width:100%;height: 909px'/>
  </div>
</template>

<script>
import elementResizeDetectorMaker from 'element-resize-detector';
// eslint-disable-next-line no-unused-vars
import { CHINA_MAP, CHINA_MEETING_ROOMS, CHINA_MEETING_ROOMS_LABEL } from '../../constant/eChart.constant';
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
    erd.listenTo(document.getElementById('mainContainer'), element => {
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
      const width = _.get(document.getElementById('mainContainer'), 'offsetWidth') || '';
      const height = _.get(document.getElementById('mainContainer'), 'offsetHeight') || '';
      doc.style.width = `${width}px`;
      doc.style.height = `${height}px`;
      this.chart.clear();

      this.$echarts.registerMap('chinaMap', CHINA_MAP);

      let option = {
        backgroundColor: '#000f1e',
        geo: {
          map: 'chinaMap',
          aspectScale: 0.85,
          layoutCenter: ['50%', '55%'], // 地图位置
          layoutSize: '100%',
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
            layoutCenter: ['50%', '55%'], // 地图位置
            layoutSize: '100%',
            zoom: 1
          },
          // 区域散点图
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            symbolSize: 5,
            rippleEffect: { // 坐标点动画
              period: 3,
              scale: 5,
              brushType: 'fill'
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter: '{b}',
                color: '#b3e2f2',
                fontWeight: 'bold',
                fontSize: 18
              }
            },

            data: CHINA_MEETING_ROOMS,
            itemStyle: {
              normal: {
                show: true,
                color: 'green',
                shadowBlur: 20,
                shadowColor: '#fff'
              }
              // emphasis: {
              //   areaColor: '#fff'
              // }
            }
          }
          // {
          //   type: 'lines',
          //   zlevel: 3,
          //   symbol: 'circle',
          //   symbolSize: [5, 5],
          //   color: '#ffff',
          //   opacity: 1,
          //   label: {
          //     show: true,
          //     padding: [10, 20],
          //     color: '#fff',
          //     backgroundColor: '#1a3961',
          //     borderColor: '#aee9fb',
          //     borderWidth: 1,
          //     borderRadius: 6,
          //     formatter (params) {
          //       console.log(params);
          //       let arr = [params.name, '上行：' + params.value[1] + 'G/s', '下行：' + params.value[0] + 'G/s'];
          //       return arr.join('\n');
          //     },
          //     textStyle: {
          //       align: 'left',
          //       lineHeight: 20
          //     }
          //   },
          //   lineStyle: {
          //     type: 'solid',
          //     color: '#fff',
          //     width: 0.5,
          //     opacity: 1
          //
          //   },
          //   data: CHINA_MEETING_ROOMS_LABEL
          //
          // }
        ]
      };

      this.$nextTick(() => {
        this.chart.setOption(option);
      });
    },
    resetWidth (element) {
      let doc = document.getElementById('chinaMapChart');
      if (_.isEmpty(doc)) {
        return;
      }
      doc.style.width = element.offsetWidth + 'px';
    }
  }
};
</script>

<style scoped>

</style>
