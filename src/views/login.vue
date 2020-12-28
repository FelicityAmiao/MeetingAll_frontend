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
        />
      </el-form-item>
      <el-form-item prop='password'>
        <el-input
          size='normal'
          type='password'
          v-model='loginForm.password'
          auto-complete='off'
          placeholder='Pls input password'
        />
      </el-form-item>
      <el-button
        size='normal'
        type='primary'
        style='width: 100%;'
        @click='submitLogin'
        >Login</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      loginForm: {
        username: 'admin',
        password: '123',
        code: ''
      },
      checked: true,
      rules: {
        username: [
          { required: true, message: 'Pls input username', trigger: 'blur' }
        ],
        password: [{ required: true, message: 'Pls input password', trigger: 'blur' }]
      }
    };
  },
  methods: {
    submitLogin () {

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
