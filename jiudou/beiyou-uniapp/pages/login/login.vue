<template>
	<view class="page flex-col">
		<view class="wrap flex-col">
			<view class="group1 flex-col">
				<view class="TextGroup1 flex-col">
					<view class="section5 flex-col justify-between">
						<text class="word2">{{ type == 1 ? '密码登录' : '验证码登录' }}</text>
						<text class="info2">输入密码直接登录</text>
					</view>
				</view>

				<view class="u-flex-col" style="margin-top: 42rpx;">
					<u-field class="input" placeholder="请输入手机号" v-model="mobile" placeholder-style="color: #C4C4C4; font-size: 36rpx; font-weight: 400;" label-width="0" />
					<u-field v-if="type == 1" class="input" placeholder="请输入密码" type="password" v-model="password"
						placeholder-style="color: #C4C4C4; font-size: 36rpx; font-weight: 400;" label-width="0" />
					<view class="code" v-else>
						<u-field class="input" placeholder="请输入验证码" v-model="code" placeholder-style="color: #C4C4C4; font-size: 36rpx; font-weight: 400;" label-width="0">
							<u-button size="mini" slot="right" :custom-style="info" :disabled="fetchCodeDisabled" @click="fetchCode">{{ codeText }}</u-button>
						</u-field>
						<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange"></u-verification-code>
					</view>
				</view>

				<u-button class="info3" :custom-style="info" :hair-line="false" @click="forgetPassword">忘记密码</u-button>
				<u-button class="login" :custom-style="info" :hair-line="false" :disabled="disabled" @click="login">登录</u-button>
				<view class="u-flex u-row-center">
					<u-button class="info4" :custom-style="info" :hair-line="false" @click="register">注册</u-button>
					<u-line direction="col" :custom-style="info" color="#1374CB" border-style="solid" length="34rpx"></u-line>
					<u-button class="info4" :custom-style="info" :hair-line="false" @click="changeType">{{ type === 1 ? '验证码登录' : '密码登录' }}</u-button>
				</view>

				<u-checkbox-group @change="checkboxGroupChange">
					<u-checkbox shape="circle" @change="checkboxChange" v-model="checked">
						<view class="ImageText1 u-flex-col">
							<view class="outer3 u-flex u-row-between">
								<view class="hint u-flex u-row-center">
									<view class="box1">
										<text class="word4">登录即代表您同意</text>
										<text class="link" @click="goto('/pages/webview/webview?url=https://app.buptpress.com/BYfwxy/')">《用户协议》</text>
										<text class="word6">和</text>
										<text class="link" @click="goto('/pages/webview/webview?url=https://app.buptpress.com/BYxieyi/')">《隐私政策》</text>
										<text class="infoBox1">
											，未注册绑定的
											<br />
											手机号验证成功后将自动注册
										</text>
									</view>
								</view>
							</view>
						</view>
					</u-checkbox>
				</u-checkbox-group>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mixin
	} from '@/common/mixin';
	import md5 from 'md5';

	export default {
		mixins: [mixin],
		data() {
			return {
				type: 1, // 1：密码登录， 2：验证码登录
				mobile: null,
				password: null,
				code: null,
				codeText: null,
				seconds: 60,
				info: {
					display: 'inline-flex',
					border: 'none'
				},
				checked: false // 是否同意登录协议
			};
		},
		computed: {
			fetchCodeDisabled() {
				return (this.mobile?.length ?? 0) === 0;
			},
			disabled() {
				if (this.type === 1) return !(this.checked && (this.mobile ?? '').length > 0 && (this.password ?? '').length > 0);
				else return !(this.checked && (this.mobile ?? '').length > 0 && (this.code ?? '').length > 0);
			}
		},
		methods: {
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				this.checked = e.value;
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				// console.log(e);
			},
			forgetPassword() {
				this.goto('/pages/login/forget');
			},
			register() {
				this.goto('/pages/login/register');
			},
			login() {
				uni.showLoading({});
				let url = '/login/loginByPwd';
				let params = {};
				if (this.type === 1) {
					params.mobile = this.mobile;
					params.password = this.password;
					// mobile: '15115790313',
					// password: '123456'
				} else {
					url = 'login/loginBySms';
					params.mobile = this.mobile;
					params.code = this.code;
				}

				this.$u
					.post(url, params)
					.then(response => {
						uni.setStorageSync('token', response.token);
						uni.setStorageSync('uid', response.uid);
						uni.setStorageSync('info', response);

						uni.reLaunch({
							url: '/pages/home/home'
						});
					})
					.catch(error => {
						this.$u.toast(error.msg);
					})
					.finally(() => {
						uni.hideLoading();
					});
			},
			changeType() {
				this.type = this.type === 1 ? 2 : 1;
			},
			end() {},
			start() {},
			codeChange(text) {
				this.codeText = text;
			},
			fetchCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					});
					this.$u
						.post('sms/preSmsMsg')
						.then(response => {
							console.log(response);
							this.$u
								.post('/sms/join', {
									mobile: this.mobile,
									preMsg: response,
									smsCode: md5(response.substr(4, 18))
								})
								.then(res => {
									uni.hideLoading();
									// 这里此提示会被this.start()方法中的提示覆盖
									this.$u.toast('验证码已发送');
									// 通知验证码组件内部开始倒计时
									this.$refs.uCode.start();
								});
						})
						.catch(error => {
							console.log(error);
							this.$u.toast(error.msg);
							uni.hideLoading();
						});
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			}
		}
	};
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: white;
	}

	.wrap {
		z-index: 2;
		position: relative;
		width: 750rpx;
		height: 1306rpx;
		margin-bottom: 2rpx;
		overflow-y: auto;
		opacity: 1;

		.group1 {
			width: 664rpx;
			height: 606rpx;
			margin: 62rpx 0 0 42rpx;

			.TextGroup1 {
				height: 110rpx;
				margin-left: 2rpx;
				width: 208rpx;

				.section5 {
					width: 208rpx;
					height: 110rpx;

					.word2 {
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

					.info2 {
						width: 176rpx;
						height: 32rpx;
						overflow-wrap: break-word;
						color: rgba(153, 153, 153, 1);
						font-size: 22rpx;
						text-align: left;
						white-space: nowrap;
						line-height: 32rpx;
						display: block;
						margin: 4rpx 0 0 2rpx;
					}
				}
			}

			.input {
				height: 92rpx;
				font-size: 36rpx;
				font-weight: 500;
				color: black;
				margin-top: 5rpx;
			}

			.code {
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

			.word3 {
				width: 180rpx;
				height: 50rpx;
				overflow-wrap: break-word;
				color: rgba(196, 196, 196, 1);
				font-size: 36rpx;
				text-align: left;
				white-space: nowrap;
				line-height: 50rpx;
				display: block;
				margin: 28rpx 0 0 4rpx;
			}

			.group4 {
				background-color: rgba(242, 242, 242, 1);
				width: 662rpx;
				height: 2rpx;
				margin: 14rpx 0 0 2rpx;
			}

			.info3 {
				width: 88rpx;
				height: 32rpx;
				overflow-wrap: break-word;
				color: #1374cb;
				font-size: 22rpx;
				text-align: left;
				white-space: nowrap;
				line-height: 32rpx;
				display: block;
				margin: 16rpx 0 0 4rpx;
			}

			.info4 {
				display: block;
				font-size: 22rpx;
				color: #1374cb;
				margin-left: 0;
				padding-left: 24rpx;
				margin-right: 0;
				padding-right: 24rpx;
			}

			.u-info-hover {
				overflow-wrap: break-word;
				color: #1374cb;
				font-size: 22rpx;
				text-align: left;
				white-space: nowrap;
				line-height: 32rpx;
				display: block;
			}

			.u-btn--default--disabled {
				opacity: 0.2;
			}

			.login {
				background-color: #0e86c6;
				border-radius: 22px;
				height: 90rpx;
				width: 660rpx;
				margin: 70rpx 0 0 4rpx;
				color: white;

				.word4 {
					width: 56rpx;
					height: 40rpx;
					overflow-wrap: break-word;
					color: rgba(255, 255, 255, 1);
					font-size: 28rpx;
					font-family: PingFangSC-Semibold;
					text-align: left;
					white-space: nowrap;
					line-height: 40rpx;
					display: block;
					margin: 26rpx 0 0 302rpx;
				}
			}
		}

		.ImageText1 {
			height: 64rpx;
			width: 650rpx;
			margin: 16rpx 0 0 10rpx;

			.outer3 {
				width: 650rpx;
				height: 64rpx;

				.wrap1 {
					border-radius: 50%;
					width: 24rpx;
					height: 24rpx;
					border: 1px solid rgba(153, 153, 153, 1);
					margin-top: 4rpx;
				}

				.hint {
					height: 64rpx;
					width: 616rpx;

					.box1 {
						width: 616rpx;
						height: 70rpx;
						overflow-wrap: break-word;
						font-size: 0;
						text-align: center;
						line-height: 32rpx;
						white-space: nowrap;

						.word4 {
							width: 616rpx;
							height: 64rpx;
							overflow-wrap: break-word;
							color: rgba(153, 153, 153, 1);
							font-size: 22rpx;
							text-align: left;
							line-height: 32rpx;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.link {
							width: 616rpx;
							height: 64rpx;
							overflow-wrap: break-word;
							color: rgba(19, 116, 203, 1);
							font-size: 22rpx;
							text-align: left;
							line-height: 32rpx;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.word6 {
							width: 616rpx;
							height: 64rpx;
							overflow-wrap: break-word;
							color: rgba(153, 153, 153, 1);
							font-size: 22rpx;
							text-align: left;
							line-height: 32rpx;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.infoBox1 {
							width: 616rpx;
							height: 64rpx;
							overflow-wrap: break-word;
							color: rgba(153, 153, 153, 1);
							font-size: 22rpx;
							text-align: left;
							line-height: 32rpx;
							white-space: nowrap;
						}
					}
				}
			}
		}
	}

	::v-deep .u-field {
		padding: 11px 0px;

		.fild-body {
			margin-left: -30rpx;
		}
	}
</style>
