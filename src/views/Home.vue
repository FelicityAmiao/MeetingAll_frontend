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
      </el-header>
      <el-main>
        <router-view/>
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
      console.log(this.height);
    });
  }
};
</script>

<style scoped>
h1{
  margin-top: 14px;
}
.header-container {
  box-shadow: rgba(0, 21, 41, 0.08) 0 1px 4px;
  overflow: hidden;
  background: rgb(255, 255, 255);
  height: 50px;
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
</style>
