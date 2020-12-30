<template>
  <el-container>
    <el-main>
      <el-row class='demo-autocomplete'>
        <el-col :span='20'>
          <label style='float: left;font-size: 18px'>{{title}}</label>
        </el-col>
        <el-col :span='4'>
          <el-input
            placeholder='主题、语言或状态'
            prefix-icon='el-icon-search'
            v-model='search'
            size='small'
            style='float: left;font-size: 14px;margin-bottom: 5px'
            @input='filter'>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        :data='tableData'
        :default-sort = '{prop: "startDate", order: "descending"}'
        border
        style='width: 100%'>
        <el-table-column
          v-for='item in tableHeader'
          :prop='item.key'
          :key='item.key'
          :sortable='item.key == "startDate"'
          :label='item.value'>
        </el-table-column>
        <el-table-column
          prop='status'
          label='状态'>
          <template slot-scope='scope'>
            <el-tag type='success'>{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop='operation'
          label='操作'>
          <template slot-scope='scope'>
            <el-button @click='download(scope.row.reportAddress)' icon='el-icon-document' type='text' size='small' :disabled='scope.row.reportAddress == null' v-if='scope.row.reportAddress != null  || scope.row.status == "正在生成报告"'>下载报告</el-button>
            <el-button @click='generateReport(scope.row.meetingId)' icon='el-icon-document' type='text' size='small' :disabled='scope.row.audioAddress == null' v-if='scope.row.reportAddress == null && scope.row.status != "正在生成报告"'>生成报告</el-button>
            <el-button @click='download(scope.row.audioAddress)' icon='el-icon-service' type='text' size='small' :disabled='scope.row.audioAddress == null'>下载录音</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class='block' style='margin-top: 5px'>
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
    generateReport: function (value) {
      get(`/myMeeting/report/${value}`).then((response) => {
        this.$message.success('正在生成报告！');
      }).catch(() => {
        this.$message.error('生成报告发生错误，请重试！', 1);
      });
    },
    download (address) {
      let url = 'https://www.meetingall.info:8077/api/files/download/' + address;
      window.open(url);
    },
    convertTableRecord (record) {
      return {
        audioAddress: record.audioAddress,
        startDate: record.startDate,
        language: formatterLanguage(record.language),
        reportAddress: record.reportAddress,
        room: formatterRoomNum(record.room),
        status: record.status,
        subject: record.subject,
        startTime: record.startTime,
        endTime: record.endTime,
        duration: record.duration
      };
    },
    filter () {
      if (this.search == null || this.search === '') {
        this.handleCurrentChange(this.currentPage);
      } else {
        this.tableData = [];
        let count = 0;
        for (let i = 0; i < this.allData.length; i++) {
          let record = this.allData[i];
          if (count < this.pageSize &&
            (record.subject.toLowerCase().includes(this.search.toLowerCase()) ||
              formatterLanguage(record.language).toLowerCase().includes(this.search.toLowerCase()) ||
              record.status.toLowerCase().includes(this.search.toLowerCase()))) {
            this.tableData.push(this.convertTableRecord(record));
          }
        }
      }
    },
    handleSizeChange (val) {
      this.pageSize = val;
      this.tableData = [];
      let count = this.total < this.pageSize * val ? this.total : this.pageSize * this.currentPage;
      for (let i = this.pageSize * (this.currentPage - 1); i < count; i++) {
        this.tableData.push(this.convertTableRecord(this.allData[i]));
      }
    },
    handleCurrentChange: function (val, filter) {
      this.currentPage = val;
      this.tableData = [];
      let count = this.total < this.pageSize * val ? this.total : this.pageSize * val;
      for (let i = this.pageSize * (val - 1); i < count; i++) {
        this.tableData.push(this.convertTableRecord(this.allData[i]));
      }
    },
    loadMeetingRecords: function () {
      let that = this;
      let url = `/myMeeting/meetingrecords`;
      get(url).then(response => {
        this.tableData = [];
        that.allData = response.data;
        that.total = response.data.length;
        let count = this.total < this.pageSize * this.currentPage ? this.total : this.pageSize * this.currentPage;
        for (let i = this.pageSize * (this.currentPage - 1); i < count; i++) {
          this.tableData.push(this.convertTableRecord(this.allData[i]));
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
      search: '',
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
    if (this.$store.getters.token !== undefined) {
      this.loadMeetingRecords();
    }
  },
  beforeRouteEnter (to, from, next) {
    next(async (vm) => {
      await vm.loadMeetingRecords();
    });
  }
};
</script>
