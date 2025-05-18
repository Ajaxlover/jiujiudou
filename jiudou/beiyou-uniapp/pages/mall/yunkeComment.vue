<template>
	<view>
		<u-field type="textarea" :auto-height="true" v-model="value" :border-bottom="false" :focus=true :maxlength="800"
			placeholder="优质评论可以获得更多点赞哦~" label-width="0"></u-field>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				obj: {}
			};
		},
		methods: {
			onNavigationBarButtonTap: function(e) {
				console.log('点击了右上角按钮')
		
				uni.showLoading({title: '提交中'})
				let params = {
					content: this.value,
					courseId: this.obj.courseId,
					memberId: this.obj.uid,
					replyId: this.obj.id
				}
				let url = "/openccourse/openDiscuss/insert";
				this.$u.post(url, params).then(response => {
					uni.$emit('commit');
					this.$u.toast('提交成功');
					uni.navigateBack({
						delta: 1
					})
				}).catch(error => {
					this.$u.toast(error.msg);
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

<style lang="scss">
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
