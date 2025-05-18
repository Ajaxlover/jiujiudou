<template>
	<view class="page">
		<view class="head u-flex" v-if="!ebook">
			<!-- 云课 -->
			<view class="wrap-left u-flex-col u-col-center">
				<u-image width="240" height="180" borderRadius="8" :src="obj.ccourseCover" shape="square">
					<u-loading slot="loading"></u-loading>
					<image slot="error" :src="require('@/static/images/img_error@2x.png')"
						style="width: 104rpx; height: 92rpx;"></image>
				</u-image>
			</view>
			<view class="wrap-right u-flex-col">
				<rich-text class="u-line-2 title" :nodes="obj.ccourseName"></rich-text>
				<text class="subtitle">老师：{{ obj.ccourseTeacherName }}</text>
				<view class="wrap-right-bottom u-flex u-col-bottom">
					<view class="u-flex u-row-between u-row-center" style="width: 100%">
						<view class="tips" style="margin-top: 30rpx">
							<text>{{price(paymentInfo.orderPrice)}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="head u-flex" v-else>
			<!-- 电子书 -->
			<u-image width="208" height="300" border-radius="8" :src="obj.coverPic"
				style="width: 208rpx; height: 300rpx">
				<u-loading slot="loading"></u-loading>
				<image slot="error" :src="require('@/static/images/img_error@2x.png')"
					style="width: 104rpx; height: 92rpx;"></image>
			</u-image>
			<view class="info u-flex-col">
				<text class="title u-line-2">{{obj.tname}}</text>
				<text class="author">作 者：{{obj.author}}</text>
				<!-- <text class="publish">版权方：{{detail.publishname || ''}}</text> -->
				<view class="price">价格：<text>{{price(paymentInfo.orderPrice)}}</text></view>
			</view>
		</view>

		<view class="content">
			<view class="content-title">请选择支付方式</view>
			<u-radio-group v-model="value" :wrap="true" active-color="#0076D2">
				<u-radio :name="item.value" v-for="(item, index) in types" :key="index">
					<u-icon :name="item.icon" :width="item.width" :height="item.height" />
					{{item.name}}
					<view class="infos u-flex u-row-center" v-if="item.value == 3">
						<text>{{price(userVirtualMoneyIOS)}}</text>
						<text :style="{color: paymentInfo.orderPrice > userVirtualMoneyIOS ? 'red': '#999999'}">{{paymentInfo.orderPrice > userVirtualMoneyIOS ? '(余额不足)': `(-${price(userVirtualMoneyIOS)})`}}</text>
					</view>
				</u-radio>
				<!-- <u-radio name="1">
					<u-icon :name="require('@/static/images/alipay@2x.png')" width="60" height="62" />
					支付宝
				</u-radio>
				<u-line></u-line>
				<u-radio name="2">
					<u-icon :name="require('@/static/images/wechat@2x.png')" width="60" height="54" />
					微信支付
				</u-radio> -->
			</u-radio-group>
		</view>
		<view class="foot">
			<view class="tips-title">温馨提示</view>
			<view class="tips-info">
				1、本课程为付费产品，自购买之日起1年有效；
				<br>
				2、课程为虚拟产品，一经购买成功概不退款，也不支持退换
				或转让，请您理解。
			</view>
		</view>

		<u-button class="commit" :custom-style="info" :hair-line="false" @click="commit">立即支付</u-button>
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
				obj: {},
				paymentInfo: {},
				value: 1,	 // 1：支付宝  2：微信 3:苹果余额支付
				info: {
					display: 'inline-flex',
					border: 'none'
				},
				ebook: true, // true 电子书; false 云课
				userVirtualMoneyIOS: 0, // 苹果余额
				types: [
					{
						value: 1,
						name: '支付宝',
						icon: require('@/static/images/alipay@2x.png'),
						width: "60",
						height: "62"
					},
					{
						value: 2,
						name: '微信支付',
						icon: require('@/static/images/wechat@2x.png'),
						width: "60",
						height: "54"
					}
				]
			};
		},
		methods: {
			commit() {
				if (this.value == 3 && this.paymentInfo.orderPrice > this.userVirtualMoneyIOS) {
					this.$u.toast('余额不足，请先充值');
					return;
				}
				
				let that = this;
				if (this.value === '1') {
					uni.showLoading({title: '支付处理中...'});
					this.$u.get('/cloudCourse/preAliPay', {
						orderCode: this.paymentInfo.orderCode
					}).then(response => {
						console.log(response);
						
						uni.requestPayment({
						    "provider": "alipay", 
						    "orderInfo": response.alipayBody,
						    success(res) {
								uni.$emit('buy');
								console.log('成功:'+JSON.stringify(res));
								// that.$u.toast('支付成功')
								that.goto(`/pages/mall/paymentDetail?paymentInfo=${JSON.stringify(that.paymentInfo)}`)
							},
						    fail(e) {
								console.log('失败:'+JSON.stringify(e));
								// that.$u.toast(`支付失败:+${JSON.stringify(e)}`)
								that.$u.toast('支付失败');
							}
						})
					}).finally(() => {
						uni.hideLoading()
					})
				} else if (this.value == 2) {
					uni.showLoading({title: '支付处理中...'});
					
					this.$u.get('/cloudCourse/preWxPay', {
						orderCode: this.paymentInfo.orderCode
					}).then(response => {
						response['package'] = response['pkgstr']
						console.log(response);
						
						uni.requestPayment({
						    "provider": "wxpay", 
						    "orderInfo": response,
						    success(res) {
								uni.$emit('buy');
								console.log('成功:'+JSON.stringify(res));
								// that.$u.toast('支付成功')
								that.goto(`/pages/mall/paymentDetail?paymentInfo=${JSON.stringify(that.paymentInfo)}`)
							},
						    fail(e) {
								console.log('失败:'+JSON.stringify(e));
								// that.$u.toast(`支付失败:+${JSON.stringify(e)}`)
								that.$u.toast('支付失败');
							}
						})
					}).finally(() => {
						uni.hideLoading()
					})
				} else {
					uni.showLoading({title: '支付处理中...'});
					this.$u.get('/cloudCourse/virtualPay', {
						orderCode: this.paymentInfo.orderCode,
						os: 'iOS'
					}).then(response => {
						uni.$emit('buy');
						that.goto(`/pages/mall/paymentDetail?paymentInfo=${JSON.stringify(that.paymentInfo)}`)
					}).finally(() => {
						uni.hideLoading()
					})
				}
			},
			fetchData() {
				this.$u.get('/user/memberExtra/myInfo', {
					
				}).then(response => {
					this.userVirtualMoneyIOS = response.userVirtualMoneyIOS;
					console.log(response);
					
					this.value = 3;
					this.types.splice(0, 2, {
						value: 3,
						name: '余额支付',
						icon: require('@/static/images/wallet@2x.png'),
						width: "56",
						height: "56"
					});
					// this.types.push({
					// 	value: 3,
					// 	name: '余额支付',
					// 	icon: require('@/static/images/wallet@2x.png'),
					// 	width: "56",
					// 	height: "56"
					// })
				})
			}
		},
		onLoad(option) {
			this.obj = JSON.parse(option.obj);
			this.paymentInfo = JSON.parse(option.paymentInfo);
			this.ebook = option.ebook == '1';
			console.log(this.obj);
			console.log(this.paymentInfo);
			console.log(this.ebook);
			
			const info = uni.getSystemInfoSync()
			if (info.platform === 'ios') {
				this.fetchData();
			}
		}
	}
</script>

<style lang="scss">
	::v-deep .u-radio-group {
		width: 100%;
		margin-top: 10rpx;
	}

	::v-deep .u-radio {
		height: 110rpx;
	}

	::v-deep .u-radio__label {
		font-size: 32rpx;
		font-weight: 400;
		color: #333333;
		line-height: 44rpx;
		margin-left: 0 !important;
		width: 100% !important;

		display: flex;
		flex-direction: row;
		align-items: center;

		.u-icon__img {
			margin-right: 28rpx;
		}
	}

	::v-deep .u-radio__icon-wrap {
		position: absolute;
		right: 60rpx;
		width: 42rpx;
		height: 42rpx;
	}

	::v-deep .u-radio__icon-wrap--circle {
		opacity: 0;
	}

	::v-deep .u-radio__icon-wrap--checked {
		opacity: 1 !important;
	}

	// u-radio__icon-wrap--circle u-radio__icon-wrap--checked

	.head {
		margin: 0 32rpx;

		.info {
			margin: 8rpx 24rpx;
			flex: 1;
			height: 284rpx;

			.title {
				width: 100%;
				flex: 1;
				font-size: 32rpx;
				font-weight: 500;
				color: #121212;
				line-height: 44rpx;
			}

			.author {
				margin-top: 20rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				line-height: 44rpx;
			}

			.publish {
				margin-top: 10rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				line-height: 44rpx;
			}

			.price {
				margin-top: 30rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				line-height: 44rpx;

				text:nth-child(1) {
					font-size: 44rpx;
					font-weight: 500;
					color: #0E86C6;
					line-height: 60rpx;
				}

				text:nth-child(2) {
					font-size: 24rpx;
					font-weight: 400;
					color: #0E86C6;
					line-height: 34rpx;
				}
			}

			.pubDate {
				margin-top: 10rpx;
				font-size: 20rpx;
				font-weight: 400;
				color: #999999;
				line-height: 28rpx;
			}
		}

		.wrap-left {
			margin: 34rpx 0 34rpx 20rpx;
		}

		.wrap-right {
			height: 100%;
			width: 390rpx;
			margin: 0rpx 0rpx 0rpx 30rpx;

			.title {
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #000000;
				line-height: 32rpx;
			}

			.subtitle {
				margin-top: 24rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
				line-height: 24rpx;
			}

			.wrap-right-bottom {
				flex: 1;

				.tips {
					text:nth-child(1) {
						font-size: 44rpx;
						font-weight: 500;
						color: #0E86C6;
						line-height: 60rpx;
					}
					text:nth-child(2) {
						font-size: 24rpx;
						font-weight: 400;
						color: #0E86C6;
						line-height: 34rpx;
					}
				}

				.underway {
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					border: 1px solid #0E86C6;
					overflow: hidden;
					height: 36rpx;

					.flag {
						height: 100% !important;
						font-size: 20rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #FFFFFF;
						background-color: #0E86C6;
						padding: 0rpx 12rpx;
					}

					text:nth-child(2) {
						font-size: 20rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #0E86C6;
						line-height: 28rpx;
						padding: 0rpx 22rpx;
					}
				}

				.number {
					font-size: 20rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #8A8A8F;
					line-height: 20rpx;
				}
			}
		}
	}

	.content {
		margin: 54rpx 32rpx 44rpx 32rpx;
		background: #FFFFFF;
		box-shadow: 0px 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.05);
		border-radius: 24rpx;
		padding: 42rpx 26rpx 0 26rpx;

		.content-title {
			font-size: 28rpx;
			font-weight: 400;
			color: #999999;
			line-height: 32rpx;
		}
	}

	.foot {
		margin: 0 48rpx;

		.tips-title {
			font-size: 24rpx;
			font-weight: 500;
			color: #333333;
			line-height: 58rpx;
		}

		.tips-info {
			font-size: 24rpx;
			color: #333333;
			line-height: 58rpx;
		}
	}

	.commit {
		background-color: #0E86C6 !important;
		border-radius: 22px;
		height: 90rpx;
		width: 660rpx;
		margin: 180rpx 46rpx 0 46rpx;
		color: white !important;
	}
	.infos {
		text:nth-child(1) {
			margin-left: 30rpx;
			font-size: 44rpx;
			font-weight: 500;
			color: #333333;
			line-height: 60rpx;
		}
		text:nth-child(2) {
			margin-left: 20rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
			line-height: 34rpx;
		}
	}
</style>
