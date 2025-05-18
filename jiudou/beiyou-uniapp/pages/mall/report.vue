<template>
	<view class="page">
		<view class="wrap u-flex-col u-col-center">
			<view class="content">
				<u-radio-group v-model="value" :wrap="true" @change="radioGroupChange">
					<u-radio @change="radioChange" icon-size="26" v-for="(item, index) in list" :key="index"
						:name="item.idx" :disabled="item.disabled">
						{{item.name}}
					</u-radio>
				</u-radio-group>
			</view>
			<u-button class="commit" :custom-style="info" :hair-line="false" @click="commit">提交
			</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				obj: null,
				list: [{
						idx: 0,
						name: '违反相关法律法规或相关规定',
						disabled: false
					},
					{
						idx: 1,
						name: '广告或垃圾信息',
						disabled: false
					},
					{
						idx: 2,
						name: '与云课无关',
						disabled: false
					},
					{
						idx: 3,
						name: '低俗或色情',
						disabled: false
					},
					{
						idx: 4,
						name: '辱骂或不友善',
						disabled: false
					},
					{
						idx: 5,
						name: '其他原因',
						disabled: false
					}
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: '0',
				info: {
					display: 'inline-flex',
					border: 'none'
				}
			};
		},
		methods: {
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				console.log(e);
			},
			commit() {
				console.log(this.value);
				uni.getSystemInfo({
					success: (res) => {
						const { model,platform } = res;
						uni.showLoading({
							title: '提交中'
						})
						this.$u.post('/cloudCourse/discuss/report', {
							type: this.value,
							content: this.obj.content,
							mode: model,
							discussId: this.obj.id,
							os: platform === 'ios' ? 'iOS' : 'android'
						}).then(response => {
							this.$u.toast('提交成功');
							uni.navigateBack({
								delta: 1
							});
						}).catch(error => {
							this.$u.toast(error.msg);
						}).finally(() => {
							uni.hideLoading()
						})
					}
				});
			}
		},
		onLoad(option) {
			this.obj = JSON.parse(option.obj);
			console.log(this.obj)
		}
	}
</script>

<style lang="scss">
	::v-deep .u-radio {
		height: 116rpx;
		border-bottom: 2rpx solid #E7EBF2;

		&:nth-last-child(1) {
			border-bottom: initial;
		}
	}

	::v-deep .u-radio__label {
		font-size: 32rpx;
		font-weight: 400;
		color: #000000;
		line-height: 44rpx;
		margin-left: 24rpx;
	}

	.wrap {
		margin: 10rpx 25rpx 0 25rpx;

		.content {
			background: #FFFFFF;
			border-radius: 24rpx;
			padding: 18rpx 27rpx 18rpx 27rpx;
		}

		.commit {
			width: 612rpx;
			height: 90rpx;
			background: #0E86C6;
			border-radius: 45rpx;

			font-size: 28rpx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 40rpx;
			margin-top: 70rpx;
		}
	}
</style>
