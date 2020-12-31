<template>
  <div class='background'>
    <el-container>
      <el-main>
        <el-card shadow='always' class='registerContainer' >
          <h1 class='title'>用户注册</h1>
          <el-form ref='newUserInfo' :model='newUserInfo' :rules='addUserRules' label-position='right' label-width='100px' status-icon>
            <el-form-item label='邮箱' prop='username'>
              <el-row class='demo-autocomplete'>
                <el-col :span='20'>
                  <el-input v-model='newUserInfo.username' placeholder='请输入邮箱地址' clearable></el-input>
                </el-col>
                <el-col :span='4'>
                  <el-button v-if='show' type='text' :disabled='disableAuthCodeButton' @click='sendAuthCode' style='margin-left: 10px;'>发送验证码</el-button>
                  <el-button v-if='!show' type='text' :disabled='true'>发送验证码({{count}})</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label='邮箱验证码' prop='authCode'>
              <el-col :span='20'>
                <el-input :disabled='disableAuthCodeInput' v-model='newUserInfo.authCode' placeholder='验证码' clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label='密码' prop='password'>
              <el-col :span='20'>
                <el-input type='password' v-model='newUserInfo.password' placeholder='请输入密码' clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label='确认密码' prop='checkPwd'>
              <el-col :span='20'>
                <el-input type='password' v-model='newUserInfo.checkPwd' placeholder='请再次输入密码' clearable></el-input>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button @click='addUser' type='primary'>注册</el-button>
              <el-button @click='resetForm'>重置</el-button>
              <el-button @click='goBack' type='primary' plain>返回登录</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { validatePwd } from '../utils/validate';
import md5 from 'js-md5';
import { post, get } from '../utils/http';
export default {
  name: 'register',
  data () {
    let validatePwd2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.newUserInfo.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    let validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('邮箱不能为空'));
      } else {
        var reg = /^[a-zA-Z0-9_.-]+@(oocl|cargosmart)+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (!reg.test(value)) {
          callback(new Error('邮箱格式不正确，请使用oocl或cargosmart邮箱注册'));
        } else {
          let url = `user/${value}`;
          get(url).then((res) => {
            if (res.data) {
              this.disableAuthCodeButton = false;
            }
          }).catch(err => {
            this.$message.error(err.response.data);
          });
        }
        callback();
      }
    };
    return {
      show: true,
      count: '',
      timer: null,
      disableAuthCodeButton: true,
      disableAuthCodeInput: true,
      newUserInfo: {
        username: '', password: '', checkPwd: '', authCode: ''
      },
      addUserRules: {
        username: [{ validator: validateUsername, trigger: 'blur' }],
        password: [{ validator: validatePwd, trigger: 'blur' }],
        checkPwd: [{ validator: validatePwd2, trigger: 'blur' }]
      }
    };
  },
  methods: {
    addUser () {
      this.$refs['newUserInfo'].validate((valid) => {
        if (valid) {
          let encryptedPwd = md5(this.newUserInfo.password);
          let url = 'user/regist';
          post(url, {
            username: this.newUserInfo.username,
            password: encryptedPwd,
            authCode: this.newUserInfo.authCode
          }).then((res) => {
            if (res.data.success) {
              this.$message.success('注册成功，请登录！');
              this.$router.push('login');
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(() => {
            this.$message.error('注册失败，请重试！');
          });
        } else {
          return false;
        }
      });
    },
    resetForm: function () {
      this.$refs['newUserInfo'].resetFields();
      this.disableAuthCodeButton = true;
      this.disableAuthCodeInput = true;
    },
    goBack () {
      this.$router.push('/login');
    },
    sendAuthCode () {
      this.disableAuthCodeInput = false;
      let username = this.newUserInfo.username;
      let url = 'user/authcode';
      post(url, {
        username: username
      }).then(response => {
        if (response.data) {
          this.$message.success('验证码已发送，请查收！');
          const TIME_COUNT = 60;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000);
          }
        } else {
          this.$message.error('验证码发送失败，请重试！');
        }
      });
    }
  }
};
</script>

<style scoped>
  .background {
    background-image: url("https://images.wallpaperscraft.com/image/chip_circuit_processor_140251_1920x1080.jpg");
    background-attachment: fixed;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    height: 100%;
  }
  .title {
    margin: 15px auto 20px auto;
    text-align: center;
    color: #505458;
  }
  .registerContainer {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 550px;
    padding: 15px 25px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #2b2828;
  }
</style>
