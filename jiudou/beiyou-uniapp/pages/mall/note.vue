<template>
	<view>
		<u-field type="textarea" :auto-height="true" v-model="value" :border-bottom="false" :focus=true :maxlength="800"
			placeholder="写点什么吧~" label-width="0"></u-field>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ebookId: '',
				catalogId: '',
				page: 0,
				value: ''
			};
		},
		methods: {
			onNavigationBarButtonTap: function(e) {
				console.log('点击了右上角按钮')
		
				uni.showLoading({
					title: '提交中'
				})
				this.$u.post('/ebook/ebNotes/insert', {
					content: this.value,
					ebookId: this.ebookId,
					page: this.page,
					catalogId: this.catalogId
				}).then(response => {
					uni.$emit('commit');
					this.$u.toast('提交成功')
					uni.navigateBack({
						delta: 1
					})
				}).finally(() => {
					uni.hideLoading()
				})
			}
		},
		onLoad(option) {
			this.ebookId = option.ebookId;
			this.catalogId = option.catalogId;
			this.page = option.page;
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
