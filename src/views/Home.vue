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
          <p>user</p>
        </div>
      </el-header>
      <el-main id='mainContainer' style='padding: 0'>
        <keep-alive>
          <router-view/>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Nav from '../components/Nav.vue';

export default {
  name: 'Home',
  components: { Nav },
  data () {
    return {
      isCollapse: false,
      height: ''
    };
  },
  mounted () {
    this.height = window.innerHeight;
    window.addEventListener('resize', () => {
      this.height = window.innerHeight;
    });
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
}
</style>
