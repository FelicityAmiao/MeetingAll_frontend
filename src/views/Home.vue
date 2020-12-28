<template>
  <el-container>
    <el-header>
      <h1>Meeting All</h1>
    </el-header>
    <el-container>
      <el-aside>
        <Nav/>
      </el-aside>
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
  components: { Nav }
};
</script>

<style scoped>
h1{
  margin-top: 14px;
}
.el-header {
  background-color: rgba(30, 44, 76, 0.93);
  color: white;
  text-align: left;
}
.el-aside {
  height: 700px;
  background-color: rgba(30, 44, 76, 0.93);
}
</style>
