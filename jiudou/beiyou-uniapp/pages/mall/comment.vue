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
				value: null,
				courseId: '',
				typeId: '',
				replyId: '',
				
				catalogUuid: '', //云课
				obj: {}
			};
		},
		methods: {
			onNavigationBarButtonTap: function(e) {
				console.log('点击了右上角按钮')

				uni.showLoading({
					title: '提交中'
				})
				let params = {}
				let url = "";
				if (this.discuss === 1) {
					url = '/openccourse/openDiscuss/insert';
					params = {
						content: this.value,
						courseId: this.courseId,
						typeId: this.typeId,
						replyId: this.replyId
					}
				} else {
					url = '/cloudCourse/discuss/release'
					params = {
						catalogUuid: this.catalogUuid,
						cCourseUuid: this.obj.ccourseUuid,
						content: this.value
					}
				}

				this.$u.post(url, params).then(response => {
					uni.$emit('commit');
					this.$u.toast('提交成功');
					uni.navigateBack({
						delta: -1
					})
				}).catch(error => {
					this.$u.toast(error.msg);
				}).finally(() => {
					uni.hideLoading()
				})
			}
		},
		onLoad(option) {
			// discuss = 1讨论  0 评论
			this.obj = JSON.parse(option.obj);
			this.courseId = this.obj.id;
			if (option.discuss == 1) {
				this.typeId = this.obj.typeId;
				this.replyId = this.obj.id;
			} else {
				this.catalogUuid = option.catalogUuid;
			}
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
