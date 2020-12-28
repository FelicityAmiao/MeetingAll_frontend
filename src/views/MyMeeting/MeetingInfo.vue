<template>
  <el-table
    :data='meetings'
    style='width: 100%'
    border>
    <el-table-column
      label='会议室'
      width='180' prop='room'>
      <template slot-scope='scope'>
        <i class='el-icon-s-cooperation'></i>
        <span style='margin-left: 10px' v-html='formatterRoomNum(scope.row)'></span>
      </template>
    </el-table-column>
    <el-table-column
      label='语言'
      width='180'
      :formatter='formatterLanguage' prop='language'>
    </el-table-column>
    <el-table-column
      label='日期'
      min-width='180'
      :formatter='timeFormatter' prop='time'>
    </el-table-column>
    <el-table-column
      label='状态'
      width='180'>
      <template slot-scope='scope'>
        <el-tag v-if='scope.row.finished' type='danger'>已结束</el-tag>
        <el-tag v-else type='success'>未开始</el-tag>
      </template>
    </el-table-column>
    <el-table-column label='操作'>
      <template slot-scope='scope'>
        <el-button
          size='mini'
          @click='handleEdit(scope.$index, scope.row)'>编辑
        </el-button>
        <el-button v-show='!scope.row.finished'
                   size='mini' type='primary'
                   icon='el-icon-caret-right'
                   @click='handleRecord(scope.$index, scope.row)'>录音
        </el-button>
        <el-popover
          placement='top-start'
          title='Tips'
          trigger='hover'
          :content='scope.row.tipContent'>
          <el-button v-show='scope.row.finished' slot='reference'
                     size='mini'
                     type='success'
                     @click='handleReport(scope.$index, scope.row)'>报告
          </el-button>
        </el-popover>
        <el-button v-show='!scope.row.finished'
                   size='mini'
                   type='danger'
                   @click='handleDelete(scope.$index, scope.row)'>删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'NewMeetingDialog',
  props: {
    meetings: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      tipContent: '',
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
      languageTypes: [
        { name: '普通话', value: 1 },
        { name: '英文', value: 2 },
        { name: '普通话+英文', value: 3 }
      ]
    };
  },
  methods: {
    handleEdit (index, row) {
      row.index = index;
      this.$emit('openEditDialog', row);
    },
    handleDelete (index, row) {
      row.index = index;
      this.$emit('deleteItem', row);
    },
    handleRecord (index, row) {
      console.log(index, row);
    },
    handleReport (index, row) {
      console.log(index, row);
    },
    timeFormatter (row) {
      return row.startTime + '-' + row.endTime;
    },
    formatterLanguage (row) {
      let type = '';
      this.languageTypes.map((item) => {
        if (row.language === item.value) {
          type = item.name;
        }
      });
      row.tipContent = '即将生成' + type + '的文档报告';
      return type;
    },
    formatterRoomNum (row) {
      let val = '';
      this.roomOptions.map((item) => {
        if (item.value === row.room[0]) {
          val += item.label;
          val += '-';
          val += _.find(item.children, ['value', row.room[1]]).label;
        }
      });
      return val;
    }

  }
};
</script>

<style scoped>
.el-button{
  margin: 0 5px;
}
</style>
