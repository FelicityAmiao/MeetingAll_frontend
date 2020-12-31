<template>
  <div class='background'>
    <el-container>
      <el-main style='margin: 120px auto'>
        <h1 align='center' class='title'>Meeting All</h1>
        <h1 align='center' class='subTitle'>All in your hands</h1>
        <el-card shadow='always' class='loginContainer'>
          <h1 class='loginTitle'>Login</h1>
          <el-form
            :rules='rules'
            ref='loginForm'
            v-loading='loading'
            element-loading-text='Login...'
            element-loading-spinner='el-icon-loading'
            :model='loginForm'
          >
            <el-form-item prop='username'>
              <el-input
                size='normal'
                type='text'
                v-model='loginForm.username'
                auto-complete='off'
                placeholder='请输入邮箱'
                clearable
              />
            </el-form-item>
            <el-form-item prop='password' style='margin-bottom: 10px'>
              <el-input
                size='normal'
                type='password'
                v-model='loginForm.password'
                auto-complete='off'
                placeholder='请输入密码'
                clearable
                @keyup.enter.native='submitLogin'
              />
            </el-form-item>
            <el-row justify='space-between' style='margin-bottom: 10px;'>
              <el-col :span='12'>
                <el-button type='text' @click='AsVisitor'>游客访问</el-button>
              </el-col>
              <el-col :span='12'>
                <el-button type='text' style='float: right' @click='goToRegister'>没有账号？注册一个</el-button>
              </el-col>
            </el-row>
            <el-button
              size='normal'
              type='primary'
              style='width: 100%;'
              @click='submitLogin'
            >Login
            </el-button
            >
          </el-form>
        </el-card>
      </el-main>
    </el-container>
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
          this.loading = true;
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
  .background {
    background-image: url("../assets/login_background.jpg");
    background-attachment: fixed;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    height: 100%;
  }

  .loginContainer {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 10px auto;
    width: 350px;
    padding: 0 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #2b2828;
  }

  .title {
    font-size: 5em;
    color: white;
    font-family: cursive;
    margin: auto;
  }

  .subTitle {
    font-size: 2em;
    color: white;
    font-family: cursive;
    margin: auto;
  }

  .loginTitle {
    margin: 10px auto 20px auto;
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

  .el-button--text:focus, .el-button--text:hover {
    color: #505458;
  }

</style>
