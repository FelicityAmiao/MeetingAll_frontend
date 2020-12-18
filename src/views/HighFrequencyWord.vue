<template>
  <div>
    <el-upload
      class="upload-demo"
      ref="upload"
      :limit=limit
      action="http://localhost:8077/api/files"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :on-success="onSuccess"
      :on-error="onError"
      name="file"
      :file-list="fileList"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">File</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
    </el-upload>
    <el-input v-model="count" placeholder="高频词个数"></el-input>
    <el-button style="margin-left: 10px;" size="small" type="primary" @click="getHighFrequencyWord" :disabled="disabled">获取高频词</el-button>
    <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4}"
      placeholder="高频词显示"
      v-model="highFrequencyWords">
    </el-input>
  </div>
</template>
<script>
import { get } from '../utils/http'
export default {
  name: 'HighFrequencyWord',
  data () {
    return {
      fileList: [],
      limit: 1,
      fileName: '',
      disabled: true,
      count: 1,
      highFrequencyWords: ''
    }
  },
  methods: {
    onSuccess (response, file, fileList) {
      this.$message({
        message: '文件上传成功',
        type: 'success'
      })
      this.$data.disabled = false
      this.$data.fileName = file.name
    },
    onError () {
      this.$message({
        message: '文件上传失败',
        type: 'error'
      })
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    getHighFrequencyWord () {
      let url = 'http://localhost:8077/api/sentence/' + this.$data.fileName.substring(0, this.$data.fileName.indexOf('.')) + '/' + this.$data.fileName.substr(this.$data.fileName.indexOf('.') + 1) + '/' + this.$data.count
      this.$data.highFrequencyWords = ''
      get(url).then((response) => {
        let data = response.data
        for (let record of data) {
          if (this.$data.highFrequencyWords !== '') {
            this.$data.highFrequencyWords += ', '
          }
          this.$data.highFrequencyWords += record.word
        }
      })
    },
    handleChange (file, fileList) {
      if (fileList.length > 0) {
        this.$data.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择的csv文件
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    }
  }
}
</script>
