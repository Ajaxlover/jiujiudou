<template>
	<view class="wrap" @click="goto(`/pages/mall/yunkeDetail?obj=${JSON.stringify(obj)}`)">
		<u-image width="268" height="146" :src="obj.ccourseCover" shape="square">
			<u-loading slot="loading"></u-loading>
			<image slot="error" :src="require('@/static/images/img_error@2x.png')"
				style="width: 104rpx; height: 92rpx;;"></image>
		</u-image>
		<view class="title u-line-1">{{obj.ccourseName}}</view>
		<view class="subtitle">{{obj.ccourseTeacherName}}</view>
	</view>
</template>

<script>
	import {
		mixin
	} from "@/common/mixin"
	export default {
		mixins: [mixin],
		data() {
			return {
				
			};
		},
		props: {
			obj: {
				type: Object,
				required: true,
				default () {
					return {};
				}
			}
		}
	}
</script>

<style lang="scss">

.wrap {
	display: inline-block;
	width: 268rpx;
	height: 252rpx;
	background: #FFFFFF;
	box-shadow: 0px 4prx 16rpx 0px rgba(0, 0, 0, 0.05);
	margin: 22rpx 14rpx 0 0;
	border-radius: 24rpx;
	overflow: hidden;
	
	.title {
		margin: 16rpx 22rpx 0 22rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: #000000;
		line-height: 36rpx;
	}
	.subtitle {
		font-size: 22rpx;
		font-weight: 400;
		color: #999999;
		line-height: 32rpx;
		margin: 4rpx 22rpx 0 22rpx;
	}
}

</style>
