<template>
  <el-tabs v-model="current" class="income">
    <el-tab-pane label="我的收益" name="first">
      <earnings></earnings>
    </el-tab-pane>
    <el-tab-pane label="订单管理" name="second">
      <order></order>
    </el-tab-pane>
    <el-tab-pane label="结算记录" name="third">
      <settlement></settlement>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss">
.income {
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

<script>
import Earnings from './earnings'
import Order from './order'
import Settlement from './settlement'
export default {
  components: {
    'earnings': Earnings,
    'order': Order,
    'settlement': Settlement
  },
  data() {
    return {
      current: 'first',
    }
  }
}
</script>
