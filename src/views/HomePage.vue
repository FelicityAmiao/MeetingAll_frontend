<template>
  <div id='homePage' class='home-page'>
    <div class='header'>
      <el-col :span='8'>
        <div class='system-icon' @click='$router.push({path: "/meetingRoom"})'>Meeting All</div>
      </el-col>
      <el-col :span='16'>
        <div class='right-top-menu' v-if='username !== "" && username != null'>
        <el-dropdown @command='handleCommand'>
          <span class='el-dropdown-link'>
            <i class='el-icon-s-custom'></i> {{username}}<i class='el-icon-arrow-down el-icon--right'></i>
          </span>
          <el-dropdown-menu slot='dropdown'>
            <el-dropdown-item command='changePassword'>修改密码</el-dropdown-item>
            <el-dropdown-item command='logout'>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
      </el-col>
    </div>
    <div>
      <div class='tool-bar' v-if='!isDefaultRoute'>
        <el-button class='circle-btn' icon='el-icon-s-home' circle @click='$router.push({path: "/meetingRoom"})'/>
      </div>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
    <div class='menu-btn-group' v-if='isDefaultRoute'>
      <el-col :span='8'>
        <el-dropdown>
          <el-button class='menu-btn' icon='el-icon-location'>
            会议室
            <i class='el-icon-arrow-down el-icon--right'></i>
          </el-button>
          <el-dropdown-menu slot='dropdown'>
            <el-dropdown-item v-for='(item, index) in officeList' :key='index' @click.native='selectMeetingRoom(item)'>{{item}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span='8'>
        <el-button class='menu-btn' icon='el-icon-service' @click='$router.push({path: "/myMeeting"})'>开会</el-button>
      </el-col>
      <el-col :span='8'>
        <el-button class='menu-btn' icon='el-icon-document' @click='$router.push({path: "/meetingRecords"})'>会议记录</el-button>
      </el-col>
    </div>
    </div>
</template>

<script>
import { validatePwd } from '../utils/validate';
import md5 from 'js-md5';
import { post } from '../utils/http';
import { queryMeetingRoomList } from '../service/meetingRoom/index';
import _ from 'lodash';

export default {
  name: 'HomePage',
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
      showClose: false,
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
      },
      officeList: [],
      meetingRoomGroup: {}
    };
  },
  created () {
    this.queryMeetingRoomList();
  },
  computed: {
    isDefaultRoute () {
      const active = this.$route.path;
      return _.isEqual(active, '/meetingRoom');
    }
  },
  mounted () {
    this.connectWebSocket();
  },
  methods: {
    changePassword () {
      this.$refs['changePasswordForm'].validate((valid) => {
        if (valid) {
          let originPwd = md5(this.changePasswordForm.originPassword);
          let newPwd = md5(this.changePasswordForm.newPassword);
          let url = 'user/password';
          post(url, {
            username: this.username,
            originPassword: originPwd,
            newPassword: newPwd
          }).then((res) => {
            if (res.data.success) {
              this.$message.success('密码重设成功，请重新登录！');
              this.$store.dispatch('user/logout').then(() => {
                this.$router.push('/login');
              });
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(() => {
            this.$message.error('密码重设失败，请重试！');
          });
        } else {
          return false;
        }
      });
    },
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
    },
    async queryMeetingRoomList () {
      let result = await queryMeetingRoomList();
      if (result) {
        this.meetingRoomGroup = _.groupBy(result, 'office');
        this.officeList = _.keys(this.meetingRoomGroup);
      }
    },
    selectMeetingRoom (office) {
      const meetingRoomDetail = this.meetingRoomGroup[office];
      this.$router.push({
        path: '/meetingRoomDetail',
        query: {
          meetingRoomDetail: JSON.stringify(meetingRoomDetail)
        }
      });
    }
  }
};
</script>

<style scoped>
  .home-page {
    background-image: url("../assets/login_background.jpg");
    background-attachment: fixed;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    height: 100%;
  }

  .header {
    width: 100%;
    height: 65px;
    color: white;
    box-shadow: rgba(0, 21, 41, 0.08) 0 1px 4px;
    overflow: hidden;
    background: rgba(116, 137, 158, 0.3);
    position: fixed;
    z-index: 9999;
  }

  .menu-btn-group {
    text-align: center;
    padding: 10px 36%;
    /*width: 30%;*/
  }

  .menu-btn {
    background: rgba(116, 137, 158, 0.8);
    border: rgba(0, 21, 41, 0.08);
    width: 150px;
    color: white;
  }

  .menu-btn:hover {
    background-color: white;
    color: rgba(116, 137, 158, 0.8);
  }

  .office-label {
    position: fixed;
    padding: 10px;
    color: white;
    font-size: 18px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: white;
  }

  .right-top-menu {
    position: absolute;
    right: 20px;
    height: 60px;
    vertical-align: middle;
    margin-top: 20px;
    color: white;
  }

  .system-icon {
    position: absolute;
    left: 20px;
    height: 60px;
    vertical-align: middle;
    margin-top: 20px;
    font-size: 18px;
    font-style: revert;
    cursor: pointer;
  }

  .tool-bar {
    position: absolute;
    padding: 10px;
    z-index: 9999;
    bottom: 10px;
  }

  .circle-btn {
    background: rgba(116, 137, 158, 0.8);
    border: rgba(0, 21, 41, 0.08);
    color: white;
    margin-bottom: 20px;
    margin-left: 20px;
  }

  .circle-btn:hover {
    background-color: white;
    color: rgba(116, 137, 158, 0.8);
  }

</style>
