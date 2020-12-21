<template>
  <div id="asr">
    <h3>Automatic Speech Recognition</h3>
    <div id="operation">
      <div id="inputPath">
        <el-input v-model="input" placeholder="请输入文件路径"></el-input>
      </div>
      <div id="trigger">
        <el-button type="primary" v-on:click=startConvert
          >点击开始生成报告<i class="el-icon-upload el-icon--right"></i
        ></el-button>
      </div>
    </div>
    <div id="result">
      右边文字高亮后请点击获取转换后的文档：<el-link type="primary" :disabled=this.$store.state.ASR.disabled :href=this.$store.state.ASR.href>点击下载</el-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ASR',
  data () {
    return {
      input: ''
    }
  },
  methods: {
    startConvert () {
      this.$store.commit('ASR/updateDisabledStatusAndHerf', { disabled: true, downloadLink: '' })
      this.$store.dispatch('ASR/startConvert')
    }
  }
}
</script>

<style scoped>
h3 {
    margin: 10px;
    color:lime;
}
#asr {
  border: 1px solid black;
  width: 600px;
  height: 400px;
  margin: auto;
}
#inputPath {
  width: 300px;
  float: left;
  margin-left: 64px;
  margin-top: 100px;
}
#trigger {
  width: 100px;
  float: left;
  margin-top: 100px;
}
#operation {
  height: 150px;
}
#result {
  margin-left: 64px;
}
</style>
