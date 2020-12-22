<template>
  <div class="block">
    <el-container>
      <el-aside>
        <el-row>
          <label style="float: left;font-size: 18px">状态</label>
        </el-row>
        <el-row>
          <el-col :span="spanNum">
            <el-badge :value="meetingCount.total">
              <el-tag>全部</el-tag>
            </el-badge>
          </el-col>
          <el-col :span="spanNum"></el-col>
        </el-row>
        <el-row>
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
        </el-row>
        <br>
        <br>
        <br>
        <el-row>
          <el-button icon="el-icon-circle-plus" type="primary" @click="openAddDialog">添加会议</el-button>
        </el-row>
      </el-aside>
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

export default {
  name: 'MyMetting',
  components: { MeetingInfo },
  data () {
    return {
      dialogTitle: '添加房间',
      spanNum: 9,
      showAddDialog: false,
      newMeeting: {
        meetingId: 1,
        room: [],
        language: '',
        time: '',
        status: 1
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
      meetings: [
        {
          room: [2, 1],
          language: 1,
          time: [new Date(2020, 10, 10, 10, 10), new Date(2020, 10, 10, 11, 10)],
          status: 0
        },
        {
          room: [1, 1],
          language: 2,
          time: [new Date(2020, 10, 10, 8, 0), new Date(2020, 10, 10, 10, 0)],
          status: 0
        },
        {
          room: [4, 2],
          language: 1,
          time: [new Date(2020, 12, 23, 10, 10), new Date(2020, 12, 23, 11, 10)],
          status: 1
        },
        {
          room: [3, 1],
          language: 3,
          time: [new Date(2020, 12, 25, 10, 10), new Date(2020, 12, 25, 11, 10)],
          status: 1
        }]
    }
  },
  computed: {
    meetingCount: function () {
      return {
        total: this.meetings.length,
        notBegin: _.filter(this.meetings, ['status', 1]).length,
        finished: _.filter(this.meetings, ['status', 0]).length
      }
    }
  },
  methods: {
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
      if (this.dialogTitle === '添加会议') {
        this.meetings.push(currMeeting)
      } else {
        this.meetings[this.newMeeting.index] = currMeeting
      }
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
      this.meetings.splice(row.index, 1)
    }
  }
}
</script>

<style scoped>

</style>
