<template>
	<view class="u-flex-col u-col-center">
		<u-icon name="warning-fill" size="100" style="margin-top: 90rpx;"></u-icon>
		<view class="title">注销说明</view>
		<view class="subtitle">注销账号后，您在北邮智信App中的所有设置将被清空，您确认要注销吗</view>
		<u-button type="primary" class="custom-style" @click="confirm">确认</u-button>
	</view>
</template>

<script>
import { mixin } from '@/common/mixin';
export default {
	mixins: [mixin],
	data() {
		return {};
	},
	methods: {
		confirm() {
			this.goto('/pages/mine/closeAccountConfirm');
		}
	}
};
</script>

<style lang="scss" scoped>
.title {
	font-size: 36rpx;
	color: black;
	margin-top: 40rpx;
}
.subtitle {
	font-size: 30rpx;
	color: #666;
	margin: 20rpx 80rpx 40rpx 80rpx;
	text-align: center;
}
.custom-style {
	// color: #606266;
	width: 680rpx;
	height: 90rpx;
	font-size: 36rpx;
	font-weight: 500;
	background-color: #1374cb;
}
</style>
