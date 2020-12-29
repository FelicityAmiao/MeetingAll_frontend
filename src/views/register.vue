<template>
  <div class='background'>
    <el-container>
      <el-main>
        <el-card shadow='always' style='width: 600px;height: 540px;margin:auto;'>
          <h1 style='margin-top: 10px'>用户注册</h1>
          <el-form ref='newUserInfo' :model='newUserInfo' :rules='addUserRules' label-width='100px' status-icon>
            <el-form-item label='用户名' prop='username'>
              <el-input v-model='newUserInfo.username' placeholder='请输入用户名' clearable></el-input>
              <el-button type='text' :disabled='disableAuthCodeButton' @click='sendAuthCode'>发送验证码</el-button>
            </el-form-item>
            <el-form-item label='密码' prop='password'>
              <el-input type='password' v-model='newUserInfo.password' placeholder='请输入密码' clearable></el-input>
            </el-form-item>
            <el-form-item label='确认密码' prop='checkPwd'>
              <el-input type='password' v-model='newUserInfo.checkPwd' placeholder='请再次输入密码' clearable></el-input>
            </el-form-item>
            <el-form-item label='输入验证码' prop='authCode'>
              <el-input :disabled='disableAuthCodeInput' v-model='newUserInfo.authCode' placeholder='验证码' clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click='addUser' type='primary'>提交</el-button>
              <el-button @click='goBack' type='primary' plain>返回登录</el-button>
              <el-button @click='resetForm'>重置</el-button>
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
        callback(new Error('用户名不能为空'));
      } else {
        var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (!reg.test(value)) {
          callback(new Error('用户名格式不正确'));
        } else {
          let url = `user/${value}`;
          get(url).then((res) => {
            console.log('register:', res);
            if (!res.data) {
              callback(new Error('用户名已存在'));
            } else {
              this.disableAuthCodeButton = false;
            }
          });
        }
        callback();
      }
    };
    return {
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
            password: encryptedPwd
          }).then((res) => {
            if (res.data.data) {
              this.$message.success('注册成功，请登录！');
              this.$router.push('login');
            } else {
              this.$message.error(res.data.message);
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
      console.log('sendAuthCode');
      this.disableAuthCodeInput = false;
    }
  }
};
</script>

<style scoped>
  .background {
    background-image: url("https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png");
    background-size: 100% 100%;
    height: 700px;
  }
</style>
