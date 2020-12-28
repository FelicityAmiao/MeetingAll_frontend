<template>
  <el-container>
    <el-header>
      <el-row>
        <label style='float: left;font-size: 18px'>{{title}}</label>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        :data='tableData'
        :default-sort = '{prop: "date", order: "descending"}'
        border
        style='width: 100%'>
        <el-table-column
          v-for='item in tableHeader'
          :prop='item.key'
          :key='item.key'
          :label='item.value'>
        </el-table-column>
        <el-table-column
          prop='status'
          label='状态'>
          <template slot-scope='scope'>
            <el-tag v-if='scope.row.finished' type='danger'>已结束</el-tag>
            <el-tag v-else type='success'>未开始</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop='operation'
          label='操作'>
          <template slot-scope='scope'>
            <el-button @click='downloadReport(scope.row)' type='text' size='small'>下载报告</el-button>
            <el-button @click='downloadAudio(scope.row)' type='text' size='small'>下载录音</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class='block'>
        <el-pagination
          @size-change='handleSizeChange'
          @current-change='handleCurrentChange'
          :current-page='currentPage'
          :page-sizes='[10, 20, 30]'
          :page-size='pageSize'
          layout='total, sizes, prev, pager, next, jumper'
          :total='total'>
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { get } from '../../utils/http';
import { formatterRoomNum } from '../../utils/room';
import { formatterLanguage } from '../../utils/language';
export default {
  name: 'MeetingRecords',
  methods: {
    downloadReport (row) {
      let url = row.reportAddress;
      console.log(url);
    },
    downloadAudio (row) {
      let url = row.audioAddress;
      console.log(url);
    },
    handleSizeChange (val) {
      this.pageSize = val;
      this.tableData = [];
      let count = this.total < this.pageSize * val ? this.total : this.pageSize * this.currentPage;
      for (let i = this.pageSize * (this.currentPage - 1); i < count; i++) {
        this.tableData.push(this.allData[i]);
      }
    },
    handleCurrentChange: function (val) {
      this.currentPage = val;
      this.tableData = [];
      let count = this.total < this.pageSize * val ? this.total : this.pageSize * val;
      for (let i = this.pageSize * (val - 1); i < count; i++) {
        this.tableData.push(this.allData[i]);
      }
    },
    loadMeetingRecords: function () {
      let that = this;
      let userId = 1;
      let url = `/myMeeting/meetingrecords/${userId}`;
      get(url).then(response => {
        that.allData = response.data;
        that.total = response.data.length;
        let count = this.total < this.pageSize * this.currentPage ? this.total : this.pageSize * this.currentPage;
        for (let i = this.pageSize * (this.currentPage - 1); i < count; i++) {
          this.tableData.push({
            audioAddress: this.allData[i].audioAddress,
            startDate: this.allData[i].startDate,
            language: formatterLanguage(this.allData[i].language),
            reportAddress: this.allData[i].reportAddress,
            room: formatterRoomNum(this.allData[i].room),
            status: this.allData[i].status,
            subject: this.allData[i].subject,
            startTime: this.allData[i].startTime,
            endTime: this.allData[i].endTime,
            duration: this.allData[i].duration
          });
        }
      });
    }
  },

  data () {
    return {
      title: '会议记录',
      currentPage: 1,
      tableData: [],
      allData: [],
      total: 0,
      pageSize: 10,
      tableHeader: [
        { key: 'room', value: '会议室' },
        { key: 'subject', value: '会议主题' },
        { key: 'language', value: '语言' },
        { key: 'startDate', value: '会议日期' },
        { key: 'startTime', value: '开始时间' },
        { key: 'endTime', value: '结束时间' },
        { key: 'duration', value: '耗时' }
      ]
    };
  },

  mounted () {
    this.loadMeetingRecords();
  }
};
</script>
