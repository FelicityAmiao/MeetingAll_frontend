<template>
  <div class='block'>
    <el-container>
      <el-header>
        <el-row>
          <el-button icon='el-icon-circle-plus' type='primary' @click='openDialog'>新建会议</el-button>
        </el-row>
      </el-header>
      <el-main>
        <el-card style='width: 50%;margin: auto;'>
          <div slot='header' style='margin: auto;width: fit-content;'>
            <span>{{meeting.subject}}</span>
          </div>
          <!--            <el-form-item label='会议主题'>-->
          <!--              {{meeting.subject}}-->
          <!--            </el-form-item>-->
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
            <el-button v-show='meeting.status==="新建"' type='primary' @click='startRecord' icon='el-icon-caret-right'>
              录音
            </el-button>
            <el-button v-show='meeting.status==="已录音"' type='success' @click='generateReport'>生成报告</el-button>
          </div>
        </el-card>
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
  </div>
</template>

<script>
import { get, post } from '../../utils/http';
import _ from 'lodash';
import { formatterLanguage, languageTypes } from '../../utils/language';
import { formatterRoomNum, roomOptions } from '../../utils/room';
import recorder from '../recorder';

export default {
  name: 'MyMeeting',
  components: { recorder },
  data () {
    return {
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
        meetingId: '',
        room: [],
        roomStr: '',
        language: '',
        languageStr: '',
        createTime: '',
        status: ''
      },
      languageTypes: languageTypes,
      roomOptions: roomOptions
    };
  },
  mounted () {
    this.loadMeeting();
  },
  methods: {
    loadMeeting: function () {
      let userId = '1';
      let url = `/myMeeting/${userId}`;
      get(url).then((response) => {
        if (response.data !== '') {
          this.formatterMeeting(response.data);
          this.showMeeting = true;
        }
      });
    },
    formatterMeeting: function (res) {
      this.meeting = res;
      this.meeting.languageStr = formatterLanguage(this.meeting.language);
      this.meeting.roomStr = formatterRoomNum(this.meeting.room);
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
      this.showAddDialog = true;
      this.dialogTitle = '添加会议';
    },
    resetForm: function () {
      this.showAddDialog = false;
      this.$refs['newMeeting'].resetFields();
    },
    saveMeeting: function () {
      let currMeeting = {};
      _.assign(currMeeting, this.newMeeting);
      currMeeting.userId = '1';
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
    startRecord: function (value) {
      console.log(value);
    },
    generateReport: function (value) {
      get(`/myMeeting/report/${this.meeting.meetingId}`).then((response) => {
        this.formatterMeeting(response.data);
      }).catch(() => {
        this.errMessage('Failed!');
      });
      console.log(value);
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
    }
  }
};
</script>

<style scoped>
  .el-row {
    margin-bottom: 10px;
  }
</style>
