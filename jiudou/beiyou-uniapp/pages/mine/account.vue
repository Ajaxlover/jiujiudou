<template>
	<view class="page wrap u-flex-col">
		<view class="background">
			<view class="infos">
				<text>账户余额</text>
				<view class="wallet">
					<text>{{price(userVirtualMoneyIOS)}}</text>
				</view>
			</view>
			<view class="title">充值</view>
			<u-grid :borde="false" :col="3" @click="click" hover-class="hover-class">
				<u-grid-item class="u-flex-col" v-for="(item, index) in infos" :index="index" :key="index">
					<view class="grid-item" :class="{'grid-active': active === index}">
						<view class="grid-title">
							<text>{{item.title}}</text>
						</view>
						<view class="grid-subtitle">
							<text>{{item.money}}</text><text>元</text>
						</view>
					</view>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="safe-area-inset-bottom bottom u-flex-col">
			<text>充值说明</text>
			
			<text>
				1、充值后可在iOS设备的北邮智信APP内使用，与非iOS终端的余额不通用；\n
				2、充值后没有使用期限，但无法提现、退款或转增他人；\n
				3、充值成功后，到账可能会有一定延迟，请耐心等待。若长时间未到账，您可以在“我的”-“意见反馈”中联系我们。\n
			</text>
			
			<u-button type="primary" shape="circle" class="button" @click="commit">立即充值</u-button>
		</view>
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
				active: 0,
				userVirtualMoneyIOS: 0, // 苹果余额
				infos: [{
						title: '6',
						money: 6,
						productid: 'product_1'
					},
					{
						title: '12',
						money: 12,
						productid: 'product_2'
					},
					{
						title: '18',
						money: 18,
						productid: 'product_3'
					},
					{
						title: '30',
						money: 30,
						productid: 'product_4'
					},
					{
						title: '98',
						money: 98,
						productid: 'product_5'
					},
					{
						title: '198',
						money: 198,
						productid: 'product_6'
					}
				]
			};
		},
		methods: {
			fetchData() {
				this.$u.get('/user/memberExtra/myInfo', {

				}).then(response => {
					this.userVirtualMoneyIOS = response.userVirtualMoneyIOS;
				})
			},
			click(index) {
				this.active = index;
			},
			commit() {
				uni.showLoading({})
				this.$u.post('/nOrder/charge', {
					money: this.infos[this.active].money
				}).then(response => {
					uni.requestPayment({
					    provider: 'appleiap',
					    orderInfo: {productid: this.infos[this.active].productid},
					    success: (e) => {
					      //  e 类型为 Transaction, 详见下面的描述
						  this.$u.post('/order/pay/iPayNotify', {
							  receipt: e.transactionReceipt,
							  orderCode: response.orderCode,
							  appVersion: '1.5.0'
						  }).then(response => {
							  this.$u.toast('充值成功');
							  this.fetchData();
						  }).finally(() => {
							  uni.hideLoading()
						  })
					    }
					})
				}).catch(error => {
					uni.hideLoading()
					this.$u.toast(error.msg);
				});
				
				// https://uniapp.dcloud.net.cn/api/plugins/payment.html#requestpayment
				// uni.requestPayment({
				//     provider: 'appleiap',
				//     orderInfo: {},
				//     success: (e) => {
				//       //  e 类型为 Transaction, 详见下面的描述
				//     }
				// })
			}
		},
		onLoad() {
			this.fetchData()
		}
	}
</script>

<style lang="scss">
	::v-deep .u-grid-item {
		background-color: #FFFFFF00 !important;
		padding: 0 10rpx;
	}
	::v-deep .u-grid-item-box {
		// background: #FFFFFF !important;
		// border-radius: 16rpx;	
		// padding: 10rpx 0 !important;
	}
	::v-deep .u-border-right::after {
		border-right-width: 0;
	}
	::v-deep .u-border-left::after {
		border-left-width: 0;
	}
	::v-deep .u-border-top::after {
		border-top-width: 0;
	}
	::v-deep .u-border-bottom::after {
		border-bottom-width: 0;
	}
	.wrap {
		width: 750rpx;
		height: 100vh;
		background: linear-gradient(180deg, #B5D3FA 0%, #F1F4F7 48%, #F8F8F7 100%);
		background-size: 750rpx 846rpx;
		background-repeat: no-repeat;
		// margin-top: 0 !important;

		.background {
			width: 750rpx;
			// height: 846rpx;
			height: 100vh;
			background-image: url('@/static/images/account_background@2x.png');
			padding: 0 32rpx;
			padding-top: env(safe-area-inset-top);
		}
		.bottom {
			position: fixed;
			bottom: 0;
			flex: 1;
			width: 100%;
			// height: 636rpx;
			background: white !important;
			border-radius: 32rpx 32rpx 0rpx 0rpx;
			padding: 40rpx 36rpx;
			
			text:nth-child(1) {
				font-size: 28rpx;
				font-weight: 600;
				color: #000000;
				line-height: 40rpx;
			}
			text:nth-child(2) {
				font-size: 24rpx;
				font-weight: 400;
				color: #333740;
				line-height: 34rpx;
			}
		}

		.infos {
			width: 686rpx;
			height: 200rpx;
			border-radius: 16rpx;
			background-color: white;
			margin-top: 120rpx;
			padding: 26rpx 42rpx;
			background-image: url('@/static/images/account_wallet@2x.png');
			background-size: 686rpx 200rpx;
			background-repeat: no-repeat;

			text {
				font-size: 24rpx;
				font-weight: 400;
				color: #333333;
				line-height: 34rpx;
			}

			.wallet {
				text:nth-child(1) {
					font-size: 88rpx;
					font-weight: 600;
					color: #0E86C6;
					line-height: 124rpx;
				}

				text:nth-child(2) {
					font-size: 22rpx;
					font-weight: 400;
					color: #121212;
					line-height: 32rpx;
					margin-left: 10rpx;
				}
			}
		}

		.title {
			margin-top: 44rpx;
			font-size: 28rpx;
			font-weight: 600;
			color: #000000;
			line-height: 40rpx;
		}
		.grid-title {
			text-align: left;
			font-size: 24rpx;
			font-weight: 500;
			color: #333333;
			line-height: 34rpx;
		}
		.grid-subtitle {
			margin-top: 10rpx;
			text-align: right;
			text:nth-child(1) {
				font-size: 56rpx;
				font-weight: 600;
				color: #0E86C6;
				line-height: 80rpx;
			}
			text:nth-child(2) {
				font-size: 22rpx;
				font-weight: 500;
				color: #000000;
				line-height: 32rpx;
			}
		}
		
		.grid-item {
			width: 100%;
			background: #FFFFFF !important;
			border-radius: 16rpx;	
			padding: 10rpx 14rpx !important;
		}
		.grid-active {
			border-radius: 16rpx;
			border: 4rpx solid #0E86C6;
		}
	}
	.button {
		width: 662rpx;
		height: 90rpx;
		margin-top: 80rpx;
		background-color: #0E86C6 !important;
	}
</style>
