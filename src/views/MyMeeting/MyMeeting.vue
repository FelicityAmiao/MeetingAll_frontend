<template>
  <div class='block'>
    <el-container>
      <el-header>
        <el-row>
          <el-button icon='el-icon-circle-plus' type='primary' @click='openDialog'>新建会议</el-button>
        </el-row>
      </el-header>
      <el-main>
        <el-card style='width: 50%;margin: auto;' v-show='this.showMeeting'>
          <div slot='header' style='margin: auto;width: fit-content;'>
            <span>{{meeting.subject}}</span>
          </div>
          <div>
            <el-row type='flex' class='row-bg' justify='center'>
              <el-col :span='6'>会议室</el-col>
              <el-col :span='6'>{{meeting.roomStr}}</el-col>
            </el-row>
            <el-row type='flex' class='row-bg' justify='center'>
              <el-col :span='6'>语言类型</el-col>
              <el-col :span='6'>{{meeting.languageStr}}</el-col>
            </el-row>
            <el-row type='flex' class='row-bg' justify='center'>
              <el-col :span='6'>日期</el-col>
              <el-col :span='6'>{{meeting.startDate}}</el-col>
            </el-row>
            <el-row type='flex' class='row-bg' justify='center'>
              <el-col :span='6'>会议时间</el-col>
              <el-col :span='6'>{{meeting.time}}</el-col>
            </el-row>
            <el-row type='flex' class='row-bg' justify='center'>
              <el-col :span='6'>耗时</el-col>
              <el-col :span='6'>{{meeting.duration}}</el-col>
            </el-row>
            <el-row type='flex' class='row-bg' justify='center'>
              <el-col :span='6'>状态</el-col>
              <el-col :span='6'>
                <el-tag v-if='meeting.status==="新建"' type='success'>{{meeting.status}}</el-tag>
                <el-tag v-else-if='meeting.status==="正在录音"||meeting.status==="正在生成报告"' type='warning'>
                  {{meeting.status}}
                </el-tag>
                <el-tag v-else>{{meeting.status}}</el-tag>
              </el-col>
            </el-row>
          </div>
          <div style='float: right;margin: 10px'>
            <el-button v-show='meeting.status==="新建"' type='warning' @click='openEditDialog'>编辑</el-button>
            <el-button type='primary' @click='startRecord' icon='el-icon-video-play' :disabled='showVoiceWave || [`已录音`, `已结束`].includes(meeting.status)'>开始录音
            </el-button>
            <el-button type='danger' @click='stopRecord' icon='el-icon-video-pause' :disabled='!showVoiceWave'>结束录音
            </el-button>
            <el-button type='success' @click='finishMeeting'>结束会议</el-button>
          </div>
          <div
            v-if='showVoiceWave'
            style='height:100px;width:100%;border:1px solid #ccc;box-sizing: border-box;display:inline-block;vertical-align:bottom'
            class='ctrlProcessWave'
          ></div>
        </el-card>
        <div class='mainBox'>
          <!-- <div
            style='height:40px;width:300px;display:inline-block;background:#999;position:relative;vertical-align:bottom'
          >
            <div
              class='ctrlProcessX'
              style='height:40px;background:#0B1;position:absolute;'
              :style='{ width: powerLevel + "%" }'
            ></div>
            <div
              class='ctrlProcessT'
              style='padding-left:50px; line-height:40px; position: relative;'
            >
              {{ duration + "/" + powerLevel }}
            </div>
          </div> -->
        </div>
      </el-main>
    </el-container>
    <el-dialog :title='dialogTitle' :visible.sync='showAddDialog' :before-close='resetForm' center>
      <el-form :model='newMeeting' label-width='100px' ref='newMeeting'>
        <el-form-item label='会议主题' prop='subject'>
          <el-input type='textarea' :rows='2' v-model='newMeeting.subject' style='width: 400px'></el-input>
        </el-form-item>
        <el-form-item label='会议室' prop='room'>
          <el-cascader
            v-model='newMeeting.room'
            :options='roomOptions'></el-cascader>
        </el-form-item>
        <el-form-item label='语言类型' prop='language'>
          <el-select v-model='newMeeting.language'>
            <el-option v-for='type in languageTypes' :key='type.value' :label='type.name' :value='type.value'>
              <span style='float: left'>{{ type.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot='footer'>
        <el-button type='primary' @click='saveMeeting'>保存</el-button>
        <el-button plain @click='resetForm'>取消</el-button>
      </div>
    </el-dialog>
    <login-dialog :showLoginDialog='showLoginDialog' @closeLoginDialog='closeLoginDialog'></login-dialog>
  </div>
</template>

<script>
import { get, post } from '../../utils/http';
import _ from 'lodash';
import { formatterLanguage, languageTypes } from '../../utils/language';
import { formatterRoomNum } from '../../utils/room';

import Recorder from 'recorder-core';
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/wav';
import 'recorder-core/src/engine/mp3-engine';
import 'recorder-core/src/extensions/waveview';
import { recording, uploadAudio } from '../../repository/meetingRoom/index';
import LoginDialog from '../LoginDialog';
import { loadRoomOption } from '../../utils/global_func';
export default {
  name: 'MyMeeting',
  components: { LoginDialog },
  data () {
    return {
      showLoginDialog: false,
      dialogTitle: '会议信息',
      spanNum: 6,
      showAddDialog: false,
      showMeeting: false,
      newMeeting: {
        meetingId: '',
        room: [],
        language: '',
        subject: ''
      },
      meeting: {
        id: '',
        meetingId: '',
        room: [],
        roomStr: '',
        language: '',
        languageStr: '',
        createTime: '',
        status: ''
      },
      languageTypes: languageTypes,
      roomOptions: [],
      dialogInt: null,
      wave: null,
      Rec: Recorder,
      type: 'wav',
      bitRate: 16,
      sampleRate: 16000,
      rec: 0,
      duration: 0,
      powerLevel: 0,
      recOpenDialogShow: 0,
      voiceRecord: null,
      showVoiceWave: false
    };
  },
  mounted () {
    if (this.$store.getters.token !== undefined) {
      loadRoomOption().then(response => {
        this.roomOptions = response.data;
      });
      this.loadMeeting();
    }
  },
  methods: {
    closeLoginDialog () {
      this.showLoginDialog = false;
    },
    loadMeeting: function () {
      let url = `/myMeeting`;
      get(url).then((response) => {
        if (response.data !== '') {
          this.formatterMeeting(response.data);
          this.showMeeting = true;
        } else {
          this.showMeeting = false;
        }
      });
    },
    formatterMeeting: function (res) {
      this.meeting = res;
      this.meeting.languageStr = formatterLanguage(this.meeting.language);
      this.meeting.roomStr = formatterRoomNum(this.roomOptions, this.meeting.room);
      this.meeting.time = this.formatterMeetingTime(this.meeting);
    },
    formatterMeetingTime: function (meeting) {
      let val = '';
      if (meeting.startTime !== null) {
        val += meeting.startTime;
      }
      if (meeting.endTime !== null) {
        val += ' - ';
        val += meeting.endTime;
      }
      return val;
    },
    openDialog: function () {
      if (this.$store.getters.token === undefined) {
        this.showLoginDialog = true;
        return;
      }
      this.showAddDialog = true;
      this.dialogTitle = '添加会议';
    },
    resetForm: function () {
      this.showAddDialog = false;
      this.$refs['newMeeting'].resetFields();
    },
    finishMeeting: function () {
      this.$confirm('是否结束会议?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = `/myMeeting/${this.meeting.meetingId}`;
        post(url).then((response) => {
          if (response.data) {
            if (this.meeting.status === '已录音') {
              //    询问是否生成报告
              this.$confirm(`是否生成${this.meeting.languageStr}报告?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.generateReport();
                this.$message({
                  type: 'info',
                  message: '报告生成中，请至会议记录查看详情。'
                });
              });
            } else {
              this.$message({
                type: 'info',
                message: '已结束会议，请至会议记录查看详情。'
              });
            }
            this.showMeeting = false;
          }
          // this.formatterMeeting(response.data);
        }).catch(() => {
          this.errMessage('Finish meeting failed!');
        });
      });
    },
    saveMeeting: function () {
      let currMeeting = {};
      _.assign(currMeeting, this.newMeeting);
      let url = '/myMeeting';
      post(url, currMeeting).then((response) => {
        let a = response.data;
        if (a !== '') {
          this.formatterMeeting(response.data);
          this.showMeeting = true;
        } else {
          this.errMessage('Update meeting failed!');
        }
      }).catch(() => {
        this.errMessage('Update meeting failed!');
      });
      this.showAddDialog = false;
      this.$refs['newMeeting'].resetFields();
    },
    generateReport: function () {
      get(`/myMeeting/report/${this.meeting.meetingId}`).then((response) => {
        this.formatterMeeting(response.data);
      }).catch(() => {
        this.errMessage('Failed!');
      });
    },
    openEditDialog: function () {
      this.showAddDialog = true;
      this.dialogTitle = '修改会议';
      this.newMeeting = this.meeting;
    },
    errMessage: function (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      });
    },
    startRecord: function () {
      var _this = this;
      var rec = (this.rec = Recorder({
        type: _this.type,
        bitRate: _this.bitRate,
        sampleRate: _this.sampleRate,
        onProcess: function (buffers, powerLevel, duration, sampleRate) {
          _this.duration = duration;
          _this.powerLevel = powerLevel;
          _this.wave.input(buffers[buffers.length - 1], powerLevel, sampleRate);
        }
      }));
      _this.dialogInt = setTimeout(function () {
        _this.$message.error('录音需要获取录音权限');
      }, 8000);
      rec.open(
        function () {
          clearInterval(_this.dialogInt);
          _this.showVoiceWave = true;
          _this.$nextTick(() => {
            _this.wave = Recorder.WaveView({ elem: '.ctrlProcessWave' });
          });
          if (!_this.rec) {
            this.reclog('未打开录音', 1);
            return;
          }
          _this.rec.start();
          let set = _this.rec.set;
          _this.$message.success(
            '录制中：' +
                                    set.type +
                                    ' ' +
                                    set.sampleRate +
                                    'hz ' +
                                    set.bitRate +
                                    'kbps'
          );
          _this.meeting.status = '录音中';
          recording(_this.meeting);
        },
        function (msg, isUserNotAllow) {
          clearInterval(_this.dialogInt);
          _this.$message.error(
            (isUserNotAllow ? 'UserNotAllow，' : '') + '打开失败：' + msg,
            1
          );
        }
      );
      _this.waitDialogClickFn = function () {
        clearInterval(_this.dialogInt);
        _this.$message.error('打开失败：权限请求被忽略，用户主动点击的弹窗', 1);
      };
    },
    stopRecord: function () {
      var _this = this;
      var rec = _this.rec;
      _this.rec = null;
      if (!rec) {
        _this.$message.error('未打开录音', 1);
        return;
      }
      rec.stop(
        function (blob, duration) {
          _this.voiceRecord = {
            blob: blob,
            duration: duration,
            rec: rec
          };
          _this.$message.info('已录制！');
          _this.meeting.status = '已录音';
          // _this.recDown();
          _this.uploadFile(blob);
          _this.showVoiceWave = false;
        },
        function (s) {
          _this.$message.error('结束出错：' + s);
        },
        true
      ); // 自动close
    },
    recDown: function () {
      if (this.voiceRecord) {
        var name = 'rec-' + this.voiceRecord.duration + 'ms-' + (this.voiceRecord.rec.set.bitRate || '-') + 'kbps-' + (this.voiceRecord.rec.set.sampleRate || '-') + 'hz.' + (this.voiceRecord.rec.set.type || (/\w+$/.exec(this.voiceRecord.blob.type) || [])[0] || 'unknown');
        let downA = document.createElement('A');
        downA.href = window.URL.createObjectURL(this.voiceRecord.blob);
        downA.download = name;
        downA.click();
      }
    },
    uploadFile: async function (fileBlob) {
      let fd = new FormData();
      fd.append('attachmentFile', fileBlob);
      fd.append('meetingId', this.meeting.id);
      fd.append('meetingSubject', this.meeting.subject);
      try {
        await uploadAudio(fd);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
  .el-row {
    margin-bottom: 10px;
  }
</style>
