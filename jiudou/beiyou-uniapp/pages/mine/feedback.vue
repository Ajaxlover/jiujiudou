<template>
	<view class="page">
		<view class="wrap__edge">
			<u-field type="textarea" :auto-height="true" v-model="value" :border-bottom="false" placeholder="请写下您的问题和建议，如:充值未到账、重复购课等，
	我们预计在7~15日内给您邮件反馈。" label-width="0"></u-field>
		</view>
		<!-- <view class="wrap__input u-flex u-flex-items-center">
			<u-field type="text" :border-bottom="false" v-model="email" placeholder="请输入联系邮箱" label-width="0" />
		</view> -->
	</view>
</template>

<script>
	import UField from "../../uview-ui/components/u-field/u-field";
	export default {
		components: {
			UField
		},
		data() {
			return {
				value: '',
				email: ''
			};
		},
		methods: {
			onNavigationBarButtonTap: function(e) {
				console.log('点击了右上角按钮')
				const info = uni.getSystemInfoSync()
				console.log(info);

				const {
					model,
					system,
					platform
				} = info;
				uni.showLoading({
					title: '提交中'
				})
				this.$u.post('/nUser/feedback', {
					type: 0,
					content: this.value,
					os: platform === 'ios' ? 'iOS' : 'android',
					mode: model
				}).then(response => {
					uni.navigateBack({
						delta: 1
					})
					this.$u.toast('提交成功');
				}).catch(error => {
					this.$u.toast(error.msg);
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		&__edge {
			margin-top: 10rpx;
			height: 242rpx;

			::v-deep .u-field {
				padding: 11px 0px;

				background-color: white;
				width: 100%;
				height: 242rpx;
			}

			::v-deep .uni-textarea-textarea {
				height: 220rpx;
			}
		}

		&__input {
			background-color: white;
			margin-top: 24rpx;

			.u-field {
				//padding: 11px 0px;
				background-color: white;
				width: 100% //.fild-body {
				//  margin-left: -30rpx;
				//}
			}
		}
	}
</style>
