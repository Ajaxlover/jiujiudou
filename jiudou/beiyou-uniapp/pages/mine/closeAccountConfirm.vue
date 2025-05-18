<template>
	<view class="wrap">
		<view class="title">请完成身份验证</view>

		<view class="code">
			<u-field class="input" placeholder="请输入验证码" v-model="code" placeholder-style="color: #C4C4C4; font-size: 36rpx; font-weight: 400;" label-width="0">
				<u-button size="mini" slot="right" :custom-style="info" @click="fetchCode">{{ codeText }}</u-button>
			</u-field>
			<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange"></u-verification-code>
		</view>

		<u-button type="primary" shape="square" class="custom-style" :disabled="disabled" @click="confirm">确认</u-button>
	</view>
</template>

<script>
import { mixin } from '@/common/mixin';
import md5 from 'md5';
export default {
	mixins: [mixin],
	data() {
		return {
			code: '',
			codeText: null,
			seconds: 60,
			info: {
				display: 'inline-flex',
				border: 'none'
			}
		};
	},
	methods: {
		end() {},
		start() {},
		codeChange(text) {
			this.codeText = text;
		},
		fetchCode() {
			if (this.$refs.uCode.canGetCode) {
				uni.showLoading({ title: '正在获取验证码' });
				this.$u
					.post('sms/preSmsMsg')
					.then(response => {
						console.log(response);
						this.$u
							.post('/sms/unregister', {
								preMsg: response,
								smsCode: md5(response.substr(4, 18))
							})
							.then(res => {
								uni.hideLoading();
								// 这里此提示会被this.start()方法中的提示覆盖
								this.$u.toast('验证码已发送');
								// 通知验证码组件内部开始倒计时
								this.$refs.uCode.start();
							}).catch(error => {
								this.$u.toast(error.msg)
							});
					})
					.catch(error => {
						console.log(error);
						this.$u.toast(error.msg);
						uni.hideLoading();
					});
			}
		},
		confirm() {
			uni.showLoading({});
			this.$u
				.post('login/unregister', {
					code: this.code
				})
				.then(response => {
					uni.removeStorageSync('token');
					uni.removeStorageSync('uid');
					this.goto('reLaunch:/pages/login/login');
					this.$u.toast('注销账号成功');
				})
				.catch(error => {
					this.$u.toast(error.msg);
				})
				.finally(() => {
					uni.hideLoading();
				});
		}
	},
	computed: {
		disabled() {
			return this.code.length === 0;
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep .u-field {
	padding: 11px 0px;

	.fild-body {
		margin-left: -10rpx;
	}
}
.wrap {
	margin: 20rpx 40rpx;
	.title {
		width: 208rpx;
		height: 74rpx;
		overflow-wrap: break-word;
		color: rgba(0, 0, 0, 1);
		font-size: 52rpx;
		font-family: PingFangSC-Medium;
		text-align: left;
		white-space: nowrap;
		line-height: 74rpx;
		display: block;
	}
	.code {
		margin-top: 40rpx;

		.u-hairline-border::after {
			border: none;
		}

		.u-size-mini {
			font-size: 24rpx;
			color: #999999;
			padding-right: 0;
			margin-right: 0;
		}
	}

	.custom-style {
		margin-top: 200rpx;
		width: 680rpx;
		height: 90rpx;
		font-size: 36rpx;
		font-weight: 500;
		background-color: #1374cb;
	}
}
</style>
