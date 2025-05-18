<template>
	<view class="wrap u-flex-col">
		<view class="tips u-flex-col u-col-center">
			<u-icon :name="require('@/static/images/success@2x.png')" size="139"></u-icon>
			<text>支付成功</text>
		</view>
		<view class="infos">
			<view class="item u-flex">
				<text>订单名称：</text>
				<text>{{paymentInfo.orderName}}</text>
			</view>
			<view class="item u-flex">
				<text>订单号：</text>
				<text>{{paymentInfo.orderCode}}</text>
			</view>
			<view class="item u-flex">
				<text>支付金额：</text>
				<text>{{price(paymentInfo.orderPrice)}}</text>
			</view>
		</view>
		<u-button class="look" :custom-style="info" :hair-line="false" @click="look">立即查看</u-button>
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
				paymentInfo: {},
				info: {
					display: 'inline-flex',
					border: 'none'
				},
			};
		},
		methods: {
			onBackPress(e) {
				console.log(e);
				if (e.from == 'backbutton') {
					uni.navigateBack({
						delta: 2
					})
					return true;
				}
				return false;
			},
			look() {
				uni.navigateBack({
					delta: 2
				})
			}
		},
		onLoad(option) {
			this.paymentInfo = JSON.parse(option.paymentInfo)
		}
	}
</script>

<style lang="scss">
	::v-deep .u-icon {
		margin-top: 170rpx;
	}
	
	.wrap {
		.tips {
			margin-bottom: 52rpx;
			
			uni-text {
				margin-top: 36rpx;
				font-size: 36rpx;
				font-weight: 400;
				color: #000000;
				line-height: 50rpx;
			}
		}
		.infos {
			background: #FFFFFF;
			box-shadow: 0px 4rpx 16rpx 0rpx rgba(0,0,0,0.0500);
			border-radius: 24rpx;
			margin: 0 26rpx;
			padding: 40rpx 56rpx;
			
			.item {
				font-size: 26rpx;
				font-weight: 400;
				color: #666666;
				line-height: 50rpx;
				height: 50rpx;
			}
		}
		.look {
			background-color: #0E86C6 !important;
			border-radius: 22px;
			height: 90rpx;
			width: 660rpx;
			margin: 180rpx 46rpx 0 46rpx;
			color: white !important;
		}
	}

</style>
