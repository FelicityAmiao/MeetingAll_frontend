<template>
  <div class="block">
    <el-container>
      <el-header>
        <el-row>
          <label style="float: left;font-size: 18px">状态</label>
        </el-row>
        <el-row>
          <el-col :span="spanNum">
            <el-badge :value="meetingCount.total">
              <el-tag>全部</el-tag>
            </el-badge>
          </el-col>
          <el-col :span="spanNum">
            <el-badge :value="meetingCount.finished">
              <el-tag type="danger">已结束</el-tag>
            </el-badge>
          </el-col>
          <el-col :span="spanNum">
            <el-badge :value="meetingCount.notBegin">
              <el-tag type="success">未开始</el-tag>
            </el-badge>
          </el-col>
          <el-col :span="spanNum">
            <el-button icon="el-icon-circle-plus" type="primary" @click="openAddDialog">添加会议</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <meeting-info :meetings="meetings" @openEditDialog="openEditDialog($event)"
                      @deleteItem="deleteItem($event)"></meeting-info>
      </el-main>
    </el-container>
    <el-dialog :title="dialogTitle" :visible.sync="showAddDialog" :before-close="resetForm" center>
      <el-form :model="newMeeting" label-width="100px" ref="newMeeting">
        <el-form-item label="房间" prop="room">
          <el-cascader
            v-model="newMeeting.room"
            :options="roomOptions"
            @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="语言类型" prop="language">
          <el-select v-model="newMeeting.language">
            <el-option v-for="type in languageTypes" :key="type.value" :label="type.name" :value="type.value">
              <span style="float: left">{{ type.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议时间" prop="time">
          <el-date-picker
            v-model="newMeeting.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="['09:00:00', '12:00:00']">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="saveMeeting">保存</el-button>
        <el-button plain @click="resetForm">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MeetingInfo from './MeetingInfo'
import moment from 'moment'
import { _delete, get, post } from '../../utils/http'

export default {
  name: 'MyMetting',
  components: { MeetingInfo },
  data () {
    return {
      dialogTitle: '添加房间',
      spanNum: 6,
      showAddDialog: false,
      newMeeting: {
        meetingId: '',
        room: [],
        language: '',
        time: '',
        finished: false
      },
      languageTypes: [
        { name: '普通话', value: 1 },
        { name: '英文', value: 2 },
        { name: '普通话+英文', value: 3 }
      ],
      roomOptions: [
        {
          value: 1,
          label: 'B5-3F',
          children: [
            { value: 1, label: 'Room1' },
            { value: 2, label: 'Room2' }
          ]
        }, {
          value: 2,
          label: 'B5-5F',
          children: [
            { value: 1, label: 'Room1' },
            { value: 2, label: 'Room2' }
          ]
        }, {
          value: 3,
          label: 'B6-3F',
          children: [
            { value: 1, label: 'Room1' },
            { value: 2, label: 'Room2' }
          ]
        }, {
          value: 4,
          label: 'B6-5F',
          children: [
            { value: 1, label: 'Room1' },
            { value: 2, label: 'Room2' }
          ]
        }],
      meetings: []
    }
  },
  computed: {
    meetingCount: function () {
      return {
        total: this.meetings.length,
        notBegin: _.filter(this.meetings, ['finished', false]).length,
        finished: _.filter(this.meetings, ['finished', true]).length
      }
    }
  },
  mounted () {
    this.loadAllMeetings()
  },
  methods: {
    loadAllMeetings: function () {
      let userId = '1'
      let url = `http://localhost:8077/api/myMeeting/${userId}`
      get(url).then((response) => {
        this.meetings = response.data
      })
    },
    openAddDialog: function () {
      this.showAddDialog = true
      this.dialogTitle = '添加会议'
    },
    resetForm: function () {
      this.showAddDialog = false
      this.$refs['newMeeting'].resetFields()
    },
    saveMeeting: function () {
      let currMeeting = {}
      _.assign(currMeeting, this.newMeeting)
      currMeeting.startTime = moment(currMeeting.time[0]).format('YYYY-MM-DD HH:mm:ss')
      currMeeting.endTime = moment(currMeeting.time[1]).format('YYYY-MM-DD HH:mm:ss')
      currMeeting.userId = '1'
      let url = 'http://localhost:8077/api/myMeeting'
      post(url, currMeeting).then((response) => {
        let a = response.data
        if (a.length !== 0) {
          this.meetings = a
        } else {
          this.errMessage('Update meeting failed!')
        }
      }).catch(() => {
        this.errMessage('Update meeting failed!')
      })
      this.showAddDialog = false
      this.$refs['newMeeting'].resetFields()
    },
    handleChange: function (value) {
      console.log(value)
    },
    openEditDialog: function (row) {
      this.showAddDialog = true
      this.dialogTitle = '修改会议'
      this.newMeeting = row
    },
    deleteItem: function (row) {
      let userId = '1'
      let url = `http://localhost:8077/api/myMeeting/${userId}/${row.meetingId}`
      _delete(url).then((response) => {
        let a = response.data
        if (a.length !== 0) {
          this.meetings = a
        } else {
          this.errMessage('Delete meeting failed!')
        }
      }).catch(() => {
        this.errMessage('Delete meeting failed!')
      })
    },
    errMessage: function (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    }
  }
}
</script>

<style scoped>

</style>
