<template>
	<view class="page wrap">
    <u-collapse>
      <u-collapse-item :item-style="headStyle" :title="item.head" v-for="(item, index) in list" :key="index">
        <view class="text">{{item.body}}</view>
      </u-collapse-item>
    </u-collapse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        headStyle: {
          'font-size': '28rpx',
          'font-weight': '400',
          'color': '#000000',
          'line-height': '40rpx'
        },
        list: [
          {
            head: '1、怎么修改密码',
            body: '进入我的-设置-密码设置，点击获取验证码，平台会给登录手机号发送验证码，输入验证码后，输入新密码即修改成功。'
          },
          {
            head: '2、怎么修改手机号',
            body: '进入我的-设置-更改手机号，输入新手机号，获取验证码后即修改成功。'
          }
        ]
			};
		},
    methods: {
      // fetchData() {
      //   this.$u.post('/platform/content/channelContent', {type: 4})
      //   .then(response => {
      //     this.list = response.list;
      //     console.log(response)
      //   })
      // }
    },
    onLoad() {
      // this.fetchData()
    }
	}
</script>

<style lang="scss">

::v-deep .u-collapse-head {
  height: 96rpx;
  padding: 0 24rpx;
}

::v-deep .u-collapse-title {
  padding: 0 24rpx;
}

.wrap {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 20rpx 36rpx;

  .text {
    margin: 20rpx 36rpx 20rpx 68rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.5);
    line-height: 40rpx;
  }
}

</style>
