<template>
  <el-container>
    <el-aside class='aside-bar collapsible'
              :style='`width: ${isCollapse ? 67 : 200}px; height: ${height}px;background-color: rgb(84, 92, 100)`'>
      <Nav :is-collapse='isCollapse'/>
    </el-aside>
    <el-container>
      <el-header class='header-container'>
        <el-row class='icon-group'>
          <el-col :span='4'>
            <div @click='isCollapse = !isCollapse' >
              <i :class='` ${isCollapse ? "el-icon-s-fold" : "el-icon-s-unfold"}`'/>
            </div>
          </el-col>
          <el-col :span='20'>
            <div>Meeting All</div>
          </el-col>
        </el-row>
        <div class='right-top-menu'>
          <el-dropdown @command='handleCommand'>
            <span class='el-dropdown-link'>
              {{username}}<i class='el-icon-arrow-down el-icon--right'></i>
            </span>
            <el-dropdown-menu slot='dropdown'>
              <el-dropdown-item command='changePassword'>修改密码</el-dropdown-item>
              <el-dropdown-item command='logout'>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main id='mainContainer' style='padding: 0'>
        <keep-alive>
          <router-view/>
        </keep-alive>
      </el-main>
    </el-container>
    <el-dialog title='修改密码' :visible.sync='changePasswordFormVisible'>
      <el-form :model='changePasswordForm' :rules='changePasswordRules' status-icon>
        <el-form-item label='旧密码' :label-width='changePasswordFormLabelWidth' prop='originPassword'>
          <el-input type='password' v-model='changePasswordForm.originPassword' clearable></el-input>
        </el-form-item>
        <el-form-item label='新密码' :label-width='changePasswordFormLabelWidth' prop='newPassword'>
          <el-input type='password' v-model='changePasswordForm.newPassword' clearable></el-input>
        </el-form-item>
        <el-form-item label='确认密码' :label-width='changePasswordFormLabelWidth' prop='confirmPassword'>
          <el-input type='password' v-model='changePasswordForm.confirmPassword' clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='changePasswordFormVisible = false'>取 消</el-button>
        <el-button type='primary' @click='changePasswordFormVisible = false'>确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import Nav from '../components/Nav.vue';
import { validatePwd } from '../utils/validate';

export default {
  name: 'Home',
  components: { Nav },
  data () {
    let validatePwd2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.changePasswordForm.newPassword) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      isCollapse: false,
      height: '',
      username: sessionStorage.getItem('username'),
      changePasswordFormVisible: false,
      changePasswordFormLabelWidth: '100px',
      changePasswordForm: {
        originPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      changePasswordRules: {
        originPassword: [{ validator: validatePwd, trigger: 'blur' }],
        newPassword: [{ validator: validatePwd, trigger: 'blur' }],
        confirmPassword: [{ validator: validatePwd2, trigger: 'blur' }]
      }
    };
  },
  mounted () {
    this.height = window.innerHeight;
    window.addEventListener('resize', () => {
      this.height = window.innerHeight;
    });
    this.connectWebSocket();
  },
  methods: {
    connectWebSocket () {
      this.$store.dispatch('socket/connect');
    },
    handleCommand (command) {
      if (command === 'changePassword') {
        this.changePasswordFormVisible = true;
      } else {
        this.$confirm('您是否要退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('user/logout').then(() => {
            this.$router.push('/login');
          });
        });
      }
    }
  }
};
</script>

<style scoped>
.header-container {
  box-shadow: rgba(0, 21, 41, 0.08) 0 1px 4px;
  overflow: hidden;
  background: rgb(255, 255, 255);
  display: flex;
  width: 100%;
}
.collapsible {
  transition: 0.38s;
}
.icon-group {
  margin-top: 10px;
  width: 200px;
  padding: 10px 10px;
  font-size: 18px;
}
>>> .el-menu {
  border-right: none!important;
}
.right-top-menu {
  position: absolute;
  right: 20px;
  display: flex;
  height: 60px;
  vertical-align: middle;
  margin-top: 20px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
