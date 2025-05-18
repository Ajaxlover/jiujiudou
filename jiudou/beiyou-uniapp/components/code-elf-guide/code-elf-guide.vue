<template>
	<view class="content">
		<swiper class="swiper" :autoplay="autoplay" :duration="duration">
			<swiper-item>
				<view class="swiper-item">
					<view class="head"></view>
					<view class="swiper-item-img"><image :src="require('@/static/guide/icon_01.png')" mode="aspectFit"></image></view>
					<view class="title">北邮智信</view>
					<view class="subtitle">读北邮书，走信息路</view>
				</view>
				<view class="jump-over" @tap="launchFlag()">{{jumpover}}</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<view class="head"></view>
					<view class="swiper-item-img"><image src="../../static/guide/icon_02.png" mode="aspectFit"></image></view>
					<view class="title">电子书</view>
					<view class="subtitle">科目齐全，丰富的正版内容</view>
				</view>
				<view class="jump-over" @tap="launchFlag()">{{jumpover}}</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<view class="head"></view>
					<view class="swiper-item-img"><image src="../../static/guide/icon_03.png" mode="aspectFit"></image></view>
					<view class="title">云课</view>
					<view class="subtitle">课上课下，紧密结合</view>
				</view>
				<view class="experience" @tap="launchFlag()">{{experience}}</view>
			</swiper-item>
			<!-- <swiper-item>
				<view class="swiper-item">
					<view class="swiper-item-img"><image src="../../static/guide/title_04.png" mode="aspectFit"></image></view>
					<view class="swiper-item-img"><image src="../../static/guide/icon_04.png" mode="aspectFit"></image></view>
				</view>
				<view class="experience" @tap="launchFlag()">{{experience}}</view>
			</swiper-item> -->
		</swiper>
		<!-- <view class="uniapp-img"><image src="../../static/guide/uniapp4@2x.png" mode="aspectFit"></image></view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: ['color1', 'color2', 'color3'],
				autoplay: false,
				duration: 500,
				jumpover: '跳过',
				experience: '立即体验'
			}
		},
		methods: {
			launchFlag: function() {
				/**
				 * 向本地存储中设置launchFlag的值，即启动标识；
				 */
				uni.setStorage({
					key: 'launchFlag',
					data: true,
				});
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
		}
	}
</script>
<style>
	.content {
		width: 100%;
		height: 100%;
		background-size: 100% auto;
		padding: 0;
		background-color: white;
	}

	.swiper {
		width: 100%;
		height: 100%;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
		text-align: center;
		position: relative;
		display: flex;
		/* justify-content: center; */
		/* align-items: flex-end; */
		/* flex-direction: column-reverse */
		flex-direction: column;
	}
	.head {
		width: 100%;
		height: 400rpx;
		background-color: #F9FAFE;
	}

	.swiper-item-img {
		width: 100%;
		height: 50%;
		margin: 0 auto;
		background-color: #F9FAFE;
	}

	.swiper-item-img image {
		width: 80%;
	}
	
	.title {
		margin-top: 54rpx;
		font-size: 48rpx;
		font-weight: 600;
		color: #000000;
		line-height: 66rpx;
	}
	.subtitle {
		margin-top: 10rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #666666;
		line-height: 40rpx;
	}

	.uniapp-img {
		height: 20%;
		background: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.uniapp-img image {
		width: 40%;
	}

	.jump-over,
	.experience {
		position: absolute;
		height: 60upx;
		line-height: 60upx;
		padding: 0 40upx;
		border-radius: 30upx;
		font-size: 32upx;
		color: #454343;
		border: 1px solid #454343;
		z-index: 999;
	}

	.jump-over {
		right: 45upx;
		top: 125upx;
	}

	.experience {
		bottom: 80rpx;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		text-align: center;
		width: 642rpx;
		margin-left: 54rpx;
		background-color: #0E86C6;
		color: #FFFFFF;
		font-size: 28rpx;
		font-weight: 600;
		border: initial;
	}
</style>
