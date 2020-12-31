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
        backgroundColor: '#000f1e',
        title: {
          text: _.get(this.getSunRoom(), 'room', ''),
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
            hoverAnimation: true,
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
                color: 'rgba(255,130,14,0.1)'
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
            tooltip: {},
            ribbonType: true,
            layout: 'circular',
            hoverAnimation: false,
            z: 0,
            width: '75%',
            height: '75%',
            circular: {
              rotateLabel: true
            },
            // 这里可以调出不同效果
            symbolSize: 4,
            data: this.roundData(100),
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                color: '#e3e3e3'
              },
              emphasis: {
                label: {
                  show: false
                }
              }
            } },
          {
            type: 'graph',
            ribbonType: true,
            layout: 'circular',
            width: '75%',
            height: '75%',
            circular: {
              rotateLabel: true
            },
            symbolSize: 80,
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
                  color: '#8b8d90'
                }, {
                  offset: 1,
                  color: 'rgba(0,0,0,0.21)'
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
          if (_.startsWith(params.name, 'circle')) {
            const sunRoom = _.find(this.meetingRoomList, { room: '太阳' }) || {};
            this.$emit('select-room', sunRoom);
          }
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
      _.forEach(_.reject(this.meetingRoomList, { room: '太阳' }), it => {
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
    },
    getSunRoom () {
      return _.find(this.meetingRoomList, { room: '太阳' });
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
