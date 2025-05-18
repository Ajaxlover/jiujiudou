<template>
  <el-tabs v-model="activeName" class="courseManage">
    <el-tab-pane label="云课管理" name="first">
      <manager></manager>
    </el-tab-pane>
    <el-tab-pane label="云课推荐" name="second">
      <recommend></recommend>
    </el-tab-pane>
    <el-tab-pane label="云课分析" name="third">
      <analyse></analyse>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import manager from './manager'
import recommend from './recommend'
import analyse from './analyse'
export default {
  components: {
    manager,
    recommend,
    analyse
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  mounted() {
    if(this.$route.query.courseManageType) {
      this.activeName = 'third'
    }
  }
};
</script>

<style lang="scss">
.courseManage{
  padding-top: 50px;
  height: 100%;
  .el-tabs__header{
    background-color: #ffffff;
    padding-left: 52px;
    padding-right: 52px;
    width: 100%;
    position: fixed;
    top:60px;
    .el-tabs__item {
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      font-weight: 400;
      // color: #222222;
      position: relative;
    }
  }
  .el-tabs__content{
    max-height: 100%;
    overflow-y: auto;
  }
}
</style>
