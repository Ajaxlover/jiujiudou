<template>
  <view class="wrap u-flex u-row-center">
    <text>查看更多</text>
    <image class="flag" src="../../../static/images/arrow@2x.png"></image>
  </view>
</template>

<script>
export default {
  name: "loadMore"
}
</script>

<style lang="scss" scoped>

.wrap {
  display: flex;
  flex-direction: row !important;
  text {
    font-size: 24rpx;
    font-weight: 500;
    color: #666666;
    margin-right: 8rpx;
  }
}

.flag {
  width: 16rpx;
  height: 24rpx;
}

</style>
