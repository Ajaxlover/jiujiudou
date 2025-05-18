<template>
	<view class="page flex-col">
		<view class="wrap flex-col">
			<view class="group1 flex-col">
				<view class="TextGroup1 flex-col">
					<view class="section5 flex-col justify-between">
						<text class="word2">忘记密码</text>
					</view>
				</view>

				<view class="u-flex-col" style="margin-top: 42rpx;">
					<u-field class="input" placeholder="请输入手机号" v-model="mobile"
						placeholder-style="color: #C4C4C4; font-size: 36rpx; font-weight: 400;" label-width="0" />
					<view class="code">
						<u-field class="input" placeholder="请输入验证码" v-model="code"
							placeholder-style="color: #C4C4C4; font-size: 36rpx; font-weight: 400;" label-width="0">
							<u-button size="mini" slot="right" :custom-style="info" :disabled="fetchCodeDisabled" @click="fetchCode">{{codeText}}
							</u-button>
						</u-field>
						<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode"
							@change="codeChange"></u-verification-code>
					</view>
					<u-field class="input" placeholder="8~14位，数字、字母或符号组合" type="password" v-model="password"
						placeholder-style="color: #C4C4C4; font-size: 36rpx; font-weight: 400;" label-width="0" />
					<u-field class="input" placeholder="再次输入新密码" type="password" v-model="confirm"
						placeholder-style="color: #C4C4C4; font-size: 36rpx; font-weight: 400;" label-width="0" />
				</view>

				<u-button class="login" :custom-style="info" :hair-line="false" :disabled="disabled" @click="commit">确认提交
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import md5 from "md5";
	export default {
		data() {
			return {
				mobile: null,
				password: null,
				confirm: null,
				code: null,
				codeText: null,
				info: {
					display: 'inline-flex',
					border: 'none'
				},
				checked: false, // 是否同意登录协议
				seconds: 60
			};
		},
		computed: {
			fetchCodeDisabled() {
				return ((this.mobile?.length??0) === 0);
			},
			disabled() {
				return !(this.mobile?.length > 0 && this.code?.length> 0 && this.password?.length > 0 && this.confirm?.length > 0);
			}
		},
		methods: {
			end() {
			
			},
			start() {
			
			},
			codeChange(text) {
				this.codeText = text;
			},
			fetchCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					this.$u.post('sms/preSmsMsg')
						.then(response => {
							this.$u.post('sms/fopass', {
								mobile: this.mobile,
								preMsg: response,
								smsCode: md5(response.substr(4, 18))
							}).then(res => {
								// 这里此提示会被this.start()方法中的提示覆盖
								this.$u.toast('验证码已发送');
								// 通知验证码组件内部开始倒计时
								this.$refs.uCode.start();
							}).catch(error => {
								this.$u.toast(error.msg)
							}).finally(() => {
								uni.hideLoading()
							})
						}).catch(error => {
							this.$u.toast(error.msg)
							uni.hideLoading();
						})
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			commit() {
				if (this.password !== this.confirm) {
					this.$u.toast('您两次输入的密码不一致，请重新输入');
					return;
				}
				
				uni.showLoading({})
				this.$u.post('login/fopass', {
					mobile: this.mobile,
					password: this.password,
					code: this.code
				}).then(response => {
					this.$u.toast('操作成功');
					uni.navigateBack({
						delta: 1
					});
				}).finally(() => {
					uni.hideLoading()
				})
			}
		},
	}
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
				color: #1374CB;
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
				color: #1374CB;
				margin-left: 0;
				padding-left: 24rpx;
				margin-right: 0;
				padding-right: 24rpx;
			}

			.u-info-hover {
				overflow-wrap: break-word;
				color: #1374CB;
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
				background-color: #0E86C6;
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

	.u-field {
		padding: 11px 0px;

		.fild-body {
			margin-left: -30rpx;
		}
	}
</style>
