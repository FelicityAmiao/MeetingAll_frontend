<template>
  <div>
    <el-form
      :rules='rules'
      ref='loginForm'
      v-loading='loading'
      element-loading-text='Login...'
      element-loading-spinner='el-icon-loading'
      element-loading-background='rgba(0, 0, 0, 0.8)'
      :model='loginForm'
      class='loginContainer'
    >
      <h3 class='loginTitle'>Login</h3>
      <el-form-item prop='username'>
        <el-input
          size='normal'
          type='text'
          v-model='loginForm.username'
          auto-complete='off'
          placeholder='Pls input username'
          clearable
        />
      </el-form-item>
      <el-form-item prop='password' style='margin-bottom: 40px'>
        <el-input
          size='normal'
          type='password'
          v-model='loginForm.password'
          auto-complete='off'
          placeholder='Pls input password'
          clearable
          @keyup.enter.native='submitLogin'
        />
      </el-form-item>
      <el-form-item>
        <el-button type='text' @click='goToRegister'>没有账号？注册一个</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type='text' @click='AsVisitor'>游客访问</el-button>
      </el-form-item>
      <el-button
        size='normal'
        type='primary'
        style='width: 100%;'
        @click='submitLogin'
      >Login
      </el-button
      >
    </el-form>
  </div>
</template>

<script>
import { validateUsername } from '../utils/validate';
import md5 from 'js-md5';

export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      loginForm: {
        username: 'liujo5@oocl.com',
        password: 'Password1',
        code: ''
      },
      checked: true,
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  methods: {
    submitLogin () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          let password = md5(this.loginForm.password);
          this.$store.dispatch('user/login', {
            username: this.loginForm.username,
            password: password
          })
            .then(() => {
              if (this.redirect !== undefined) {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery });
              } else {
                this.$router.push('/meetingRoom');
              }
              this.loading = false;
            })
            .catch((error) => {
              this.$message.error(error.response.data);
              this.loading = false;
            });
        }
      });
    },
    goToRegister: function () {
      this.$router.push('register');
    },
    AsVisitor: function () {
      this.$router.push('/meetingRoom');
    },
    getOtherQuery (query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
  }
};
</script>

<style scoped>
  .loginContainer {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 15px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .loginTitle {
    margin: 15px auto 20px auto;
    text-align: center;
    color: #505458;
  }

  .loginRemember {
    text-align: left;
    margin: 0px 0px 15px 0px;
  }

  .el-form-item__content {
    display: flex;
    align-items: center;
  }

</style>
