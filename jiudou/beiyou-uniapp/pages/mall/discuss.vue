<template>
	<view>
		<u-field type="textarea" :auto-height="true" v-model="value" :border-bottom="false" :focus=true :maxlength="800"
			placeholder="优质评论可以获得更多点赞哦~" label-width="0"></u-field>
	</view>
</template>

<script>
	export default {
		name: "discuss",
		data() {
			return {
				value: null,
				obj: {}
			};
		},
		methods: {
			onNavigationBarButtonTap: function(e) {
				console.log('点击了右上角按钮')

				uni.showLoading({
					title: '提交中'
				})
				this.$u.post('/openccourse/openDiscuss/insert', {
					content: this.value,
					courseId: this.obj.id,
					typeId: 1
				}).then(response => {
					uni.$emit('commit');
					uni.navigateBack({
						delta: 1
					})
					this.$u.toast('提交成功');
				}).finally(() => {
					uni.hideLoading()
				})
			}
		},
		onLoad(option) {
			this.obj = JSON.parse(option.obj);
			console.log(this.obj);
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-field {
		padding: 11px 0px;

		background-color: white;
		width: 100%;
		height: 242rpx;
	}

	::v-deep .uni-textarea-textarea {
		height: 220rpx;
	}
</style>
