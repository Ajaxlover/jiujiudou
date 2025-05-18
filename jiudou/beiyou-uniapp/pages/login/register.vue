<template>
	<view class="page u-flex-col">
		<view class="wrap u-flex-col">
			<view class="bd1 u-flex-col">
				<view class="TextGroup1 u-flex-col">
					<view class="section1 u-flex-col u-row-between">
						<view class="group5">
							<text class="info2">欢迎注册</text>
							<text class="word1">北邮智信</text>
							<text class="info3">账号</text>
						</view>
						<text class="info4">若该手机号未注册，我们将为您注册</text>
					</view>
				</view>
				<u-field
					class="input"
					v-model="mobile"
					placeholder="请输入手机号"
					placeholder-style="color: #C4C4C4; font-size: 36rpx; font-weight: 400;"
					label-width="0"
				></u-field>
				<view class="code">
					<u-field class="input" v-model="code" placeholder="验证码" placeholder-style="color: #C4C4C4; font-size: 36rpx; font-weight: 400;" label-width="0">
						<u-button size="mini" slot="right" :custom-style="info" @click="fetchCode()">{{ codeText }}</u-button>
					</u-field>
					<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange"></u-verification-code>
				</view>
				<u-field
					class="input"
					v-model="password"
					placeholder="设置密码,要求8~16位"
					placeholder-style="color: #C4C4C4; font-size: 36rpx; font-weight: 400;"
					label-width="0"
				></u-field>
				<view class="tip">*密码长度8~16位，包含数字、大小写字母、特殊字符两种。</view>
				<u-button class="register" :custom-style="info" :hair-line="false" :disabled="disabled" @click="register">立即注册</u-button>

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
import md5 from 'md5';
import { mixin } from '@/common/mixin';
export default {
	mixins: [mixin],
	data() {
		return {
			info: {
				display: 'inline-flex',
				border: 'none'
			},
			seconds: 60,
			codeText: '',
			mobile: '',
			code: '',
			password: '',
			checked: false // 是否同意登录协议
		};
	},
	computed: {
		disabled() {
			return !(this.checked && (this.mobile ?? '').length > 0 && (this.password ?? '').length > 0 && (this.code ?? '').length > 0);
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
		register() {
			uni.showLoading();
			this.$u
				.post('login/register', {
					mobile: this.mobile,
					password: this.password,
					code: this.code
				})
				.then(response => {
					this.$u.toast('注册成功');
					uni.navigateBack({
						delta: 1
					});
				})
				.catch(error => {
					this.$u.toast(error.msg);
				})
				.finally(() => {
					uni.hideLoading();
				});
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
							.post('sms/register', {
								mobile: this.mobile,
								preMsg: response,
								smsCode: md5(response.substr(4, 18))
							})
							.then(res => {
								setTimeout(() => {
									uni.hideLoading();
									// 这里此提示会被this.start()方法中的提示覆盖
									this.$u.toast('验证码已发送');
									// 通知验证码组件内部开始倒计时
									this.$refs.uCode.start();
								}, 2000);
							})
							.catch(error => {
								this.$u.toast(error.msg);
							});
					})
					.catch(error => {
						this.$u.toast(error.msg);
					})
					.finally(() => {
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
::v-deep .u-btn--default--disabled {
	opacity: 0.2;
}

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

	.bd1 {
		width: 662rpx;
		height: 606rpx;
		margin: 62rpx 0 0 44rpx;

		.TextGroup1 {
			height: 110rpx;
			width: 520rpx;
			margin: 0 0 36rpx 2rpx;

			.section1 {
				width: 520rpx;
				height: 110rpx;

				.group5 {
					width: 520rpx;
					height: 74rpx;
					overflow-wrap: break-word;
					font-size: 0;
					font-family: PingFangSC-Medium;
					text-align: left;
					white-space: nowrap;
					line-height: 74rpx;

					.info2 {
						width: 520rpx;
						height: 74rpx;
						overflow-wrap: break-word;
						color: rgba(0, 0, 0, 1);
						font-size: 52rpx;
						font-family: PingFangSC-Medium;
						text-align: left;
						white-space: nowrap;
						line-height: 74rpx;
					}

					.word1 {
						width: 520rpx;
						height: 74rpx;
						overflow-wrap: break-word;
						color: rgba(14, 134, 198, 1);
						font-size: 52rpx;
						font-family: PingFangSC-Medium;
						text-align: left;
						white-space: nowrap;
						line-height: 74rpx;
					}

					.info3 {
						width: 520rpx;
						height: 74rpx;
						overflow-wrap: break-word;
						color: rgba(0, 0, 0, 1);
						font-size: 52rpx;
						font-family: PingFangSC-Medium;
						text-align: left;
						white-space: nowrap;
						line-height: 74rpx;
					}
				}

				.info4 {
					width: 352rpx;
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
			height: 92rpx !important;
			font-size: 36rpx;
			color: black;
			text-align: left;
			white-space: nowrap;
			display: block;
			margin-top: 8rpx;
			font-weight: 500;
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

		.tip {
			color: #999999;
			font-size: 22rpx;
			margin-top: 12rpx;
		}

		.register {
			background-color: #0e86c6;
			border-radius: 22px;
			height: 90rpx !important;
			width: 660rpx;
			margin: 70rpx 0 0 4rpx;
			color: white;
		}

		.Button1 {
			background-color: rgba(14, 134, 198, 0.2);
			border-radius: 22px;
			height: 90rpx;
			width: 660rpx;
			margin: 64rpx 0 0 2rpx;

			.word3 {
				width: 112rpx;
				height: 40rpx;
				overflow-wrap: break-word;
				color: rgba(255, 255, 255, 1);
				font-size: 28rpx;
				font-family: PingFangSC-Semibold;
				text-align: left;
				white-space: nowrap;
				line-height: 40rpx;
				display: block;
				margin: 26rpx 0 0 274rpx;
			}
		}

		.ImageText1 {
			height: 64rpx;
			width: 650rpx;
			margin: 36rpx 0 0 10rpx;

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

		.txt4 {
			width: 196rpx;
			height: 34rpx;
			overflow-wrap: break-word;
			color: rgba(19, 116, 203, 1);
			font-size: 24rpx;
			text-align: left;
			white-space: nowrap;
			line-height: 34rpx;
			display: block;
			margin: 72rpx 0 0 232rpx;
		}
	}
}

::v-deep .u-field {
	padding: 11px 0 !important;

	.fild-body {
		margin-left: -10rpx !important;
	}
}
</style>
