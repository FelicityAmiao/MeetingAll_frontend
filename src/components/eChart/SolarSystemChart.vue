<template>
  <div style='width: 100%'>
    <div id='solarSystemChart' style='height: 909px'/>
  </div>
</template>

<script>
import _ from 'lodash';
import elementResizeDetectorMaker from 'element-resize-detector';

export default {
  name: 'SolarSystemChart',
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

    erd.listenTo(document.getElementById('solarSystemChart'), element => {
      if (_this.chart) {
        _this.chart.resize();
      }
    });
    this.genChart();
  },
  methods: {
    genChart () {
      let doc = document.getElementById('solarSystemChart');
      this.chart = this.$echarts.init(doc);
      const width = _.get(document.getElementById('mainContainer'), 'offsetWidth') || '';
      const height = _.get(document.getElementById('mainContainer'), 'offsetHeight') || '';
      doc.style.width = `${width}px`;
      doc.style.height = `${height}px`;
      this.chart.clear();

      const option = {
        backgroundColor: '#181F4E',
        title: {
          text: 'Solar System',
          top: 'center',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#e3e3e3',
            fontWeight: '100'
          },
          subtextStyle: {
            fontSize: 24,
            color: '#e3e3e3',
            fontWeight: '100'
          }
        },

        series: [
          {
            type: 'graph',
            tooltip: {},
            ribbonType: true,
            layout: 'circular',
            hoverAnimation: false,
            z: 0,
            width: '60%',
            height: '10%',
            circular: {
              rotateLabel: true
            },
            symbolSize: 200,
            data: this.roundData(10),
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                borderColor: '#e3e3e3',
                borderWidth: '.1',
                color: 'rgba(0, 255, 255, .03)'
              },
              emphasis: {
                label: {
                  show: false
                }
              }
            }
          },
          {
            type: 'graph',
            ribbonType: true,
            layout: 'circular',
            width: '60%',
            height: '60%',
            circular: {
              rotateLabel: true
            },
            symbolSize: 30,
            label: {
              normal: {
                position: 'center',
                formatter: '{b}',
                normal: {
                  textStyle: {
                    fontFamily: '宋体'
                  }
                }
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 5,
                shadowColor: 'rgba(25, 100, 150, 0.5)',
                shadowOffsetY: 3,
                shadowOffsetX: 3,
                label: {
                  show: true,
                  formatter: '{b}',
                  color: '#e3e3e3'
                },
                labelLine: {
                  show: true,
                  length: 40,
                  lineStyle: {
                    color: '#0ff'
                  }
                },
                color: new this.$echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: '#fff'
                }, {
                  offset: 0.3,
                  color: '#1ffdfd'
                }, {
                  offset: 1,
                  color: '#096869'
                }])
              },
              emphasis: {
                label: {
                  show: false
                }
              }
            },
            data: this.genMeetingRoomItemList()
          }
        ]
      };
      this.$nextTick(() => {
        this.chart.setOption(option);
        this.chart.on('mouseover', params => {
          const room = _.find(this.meetingRoomList, { room: params.name }) || {};
          if (_.isEmpty(room)) {
            return;
          }
          this.$emit('select-room', room);
        });
      });
    },
    roundData (num) {
      let data = [];
      for (let i = 0; i < num; i++) {
        data.push({
          name: 'circle' + i
        });
      }
      return data;
    },
    genMeetingRoomItemList () {
      let meetingRoomItemList = [];
      _.forEach(this.meetingRoomList, it => {
        meetingRoomItemList.push({
          name: it.room,
          symbolSize: 40,
          value: 40
        });
      });
      return meetingRoomItemList;
    },
    resetWidth (element) {
      let doc = document.getElementById('solarSystemChart');
      if (_.isEmpty(doc)) {
        return;
      }
      doc.style.width = element.offsetWidth + 'px';
    }
  },
  watch: {
    meetingRoomList: {
      handler: function (val) {
        this.genChart();
      }
    }
  }
};
</script>

<style scoped>
</style>
