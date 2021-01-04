<template>
  <el-dialog
    title='请先登录注册'
    :visible.sync='showLoginDialog'
    :before-close='closeDialog'
    center
  >
    <div slot='footer'>
      <el-button type='primary' @click='GoToLogin'>去登录</el-button>
      <el-button plain @click='closeDialog'>继续浏览</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'LoginDialog',
  props: ['showLoginDialog'],
  data () {
    return {
      redirect: undefined,
      otherQuery: {} };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
        }
      },
      immediate: true
    }
  },
  methods: {
    closeDialog: function () {
      this.$emit('closeLoginDialog');
    },
    GoToLogin: function () {
      // console.log('path', this.$route.path);
      // console.log('params', this.$route.params);
      // console.log('query', this.$route.query);
      this.$router.push(`/login?redirect=meetingRoom`);
    }
  }
};
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 10px;
  }
</style>
