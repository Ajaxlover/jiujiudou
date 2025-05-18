<template>
	<view class="page">
		<u-cell-group :border="false">
			<u-cell-item :title="list[current].name"
				@click="goto(`/pages/mall/topicalTypeSelect?list=${JSON.stringify(list)}&idx=${current}`)">
			</u-cell-item>
		</u-cell-group>

		<u-form :model="form" ref="uForm" :rules="rules" style="margin-top: 20rpx;">
			<u-form-item prop="name">
				<u-input v-model="form.name" placeholder="标题(最多输入30个字)" />
			</u-form-item>
			<u-form-item prop="intro">
				<u-input v-model="form.intro" placeholder="正文内容" type="textarea" />
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="添加图片" prop="photo" label-width="150">
				<u-upload :action="action" :file-list="fileList" :form-data="formData" width="160" height="160" :custom-btn="true">
					<view slot="addBtn" class="u-flex-col u-col-center u-row-center"
						style="width: 160rpx; height: 160rpx; background: #FFFFFF; border-radius: 12rpx; border: 2rpx solid #EDEDED;">
						<image :src="require('@/static/images/mall_topical_addfile@2x.png')"
							style="width: 50rpx; height: 50rpx;"></image>
					</view>
				</u-upload>
			</u-form-item>
		</u-form>
	</view>
</template>

<script>
	import {
		mixin
	} from "@/common/mixin"
	export default {
		mixins: [mixin],
		data() {
			return {
				action: 'https://tfapi2.guangyiedu.com/v3/openccourse/openDiscuss/uploadImage',
				fileList: [],
				list: [],
				current: 0,
				formData: {uid: uni.getStorageSync('uid'), token: uni.getStorageSync('token'), client: 4},
				labelPosition: 'top',
				courseId: '',
				form: {
					name: '',
					intro: '',
					photo: '’',
				},
				rules: {
					name: [{
						min: 1,
						max: 30,
						message: '最多输入30个字',
						trigger: ['change', 'blur'],
					}],
					intro: [{
						min: 1,
						max: 300,
						message: '最多输入300个字',
						trigger: ['change', 'blur'],
					}]
				}
			};
		},
		methods: {
			onNavigationBarButtonTap: function(e) {
				let that = this;
				uni.showLoading()
				this.$u.post('/openccourse/openDiscuss/insert', {
					title: that.form.name,
					content: that.form.intro,
					typeId: that.list[that.current].id,
					courseId: that.courseId
				}).then(response => {
					uni.$emit('ok', {obj: response});
					uni.navigateBack({
						delta: 1
					});
					this.$u.toast('提交成功');
				}).finally(() => {
					uni.hideLoading()
				})
			}
		},
		onLoad(option) {
			this.list = JSON.parse(option.list);
			this.current = Number(option.idx);
			this.courseId = option.courseId;

			let that = this;
			uni.$on('change', function(data) {
				console.log(data);
				that.current = data['value'];
			});
		},
		onUnload() {
			uni.$off('change');
		}
	}
</script>

<style lang="scss">
	::v-deep .u-cell_title {
		font-size: 32rpx;
		font-weight: 500;
		color: #000000;
		line-height: 44rpx;

		&::before {
			width: 12rpx;
			height: 12rpx;
			content: '';
			background-color: #1374CB;
			border-radius: 50%;
			display: inline-block;
			margin-right: 10rpx;
			margin-bottom: 6rpx;
		}
	}

	::v-deep .u-form-item {
		background-color: white;
	}

	::v-deep .uni-textarea-placeholder {
		font-size: 28rpx;
		font-weight: 400;
		color: #999999;
		line-height: 40rpx;
	}

	::v-deep .uni-input-placeholder {
		font-size: 28rpx;
		font-weight: 400;
		color: #999999;
		line-height: 40rpx;
	}

	::v-deep .u-form-item__body {
		margin: 0rpx 52rpx;
	}

	::v-deep .u-form-item--left__content__label {
		font-size: 28rpx;
		font-weight: 400;
		color: #999999;
		line-height: 40rpx;
	}

	::v-deep .u-form-item {
		margin-top: 20rpx;
	}
</style>
