<template>
	<view class="u-flex-col">
		<u-form :model="form" ref="uForm1" label-width="240">
			<u-form-item label="抬头类型">
				<u-input :border="border" type="select" placeholder="请选择抬头类型" :select-open="actionSheetShow" v-model="form.type" @click="actionSheetShow = true"></u-input>
			</u-form-item>
		</u-form>

		<u-form :rules="rules" :model="form" ref="uForm2" label-width="240">
			<u-form-item label="发票抬头" prop="title"><u-input v-model="form.title" /></u-form-item>
			<u-form-item v-if="form.type === '企业'" label="纳税人识别号"><u-input v-model="form.dutyNo" /></u-form-item>
		</u-form>

		<text></text>
		<u-form :rules="rules" :model="form" ref="uForm3" label-width="240">
			<u-form-item label="接收邮箱" prop="email"><u-input v-model="form.email" placeholder="填写有效邮箱地址" /></u-form-item>
		</u-form>

		<view class="section" v-if="form.type === '企业'">
			<text>选填项</text>

			<u-form :model="form" ref="uForm4" label-width="240">
				<u-form-item label="开户银行"><u-input placeholder="开户许可证上的开户银行" v-model="form.bankName" /></u-form-item>
				<u-form-item label="开户账号"><u-input placeholder="开户许可证上的银行账号" v-model="form.bankNo" /></u-form-item>
				<u-form-item label="注册地址"><u-input placeholder="注册地址" v-model="form.address" /></u-form-item>
				<u-form-item label="注册电话"><u-input placeholder="有效的联系电话" v-model="form.mobile" /></u-form-item>
			</u-form>
		</view>
		<u-action-sheet :list="actionSheetList" :safe-area-inset-bottom="true" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
		<u-button class="submit" :custom-style="info" :hair-line="false" @click="submit">下一步</u-button>
	</view>
</template>

<script>
import { mixin } from '@/common/mixin';

export default {
	mixins: [mixin],
	data() {
		return {
			orderIds: '',
			rules: {
				email: [
					{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					},
					{
						// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return this.$u.test.email(value);
						},
						message: '请输入正确的邮箱地址',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change', 'blur']
					}
				],
				name: [
					{
						required: true,
						message: '请输入发票抬头',
						trigger: 'blur' ,
					}
				],
			},
			info: {
				display: 'inline-flex',
				border: 'none'
			},
			border: false,
			form: {
				name: '',
				intro: '',
				bankName: '',
				bankNo: '',
				address: '',
				mobile: '',
				email: '',
				dutyNo: '',
				title: '',
				type: '个人'
			},
			actionSheetShow: false,
			actionSheetList: [
				{
					text: '个人'
				},
				{
					text: '企业'
				}
			]
		};
	},
	methods: {
		// 点击actionSheet回调
		actionSheetCallback(index) {
			uni.hideKeyboard();
			this.form.type = this.actionSheetList[index].text;
		},
		submit() {
			this.$refs.uForm3.validate(valid => {
				console.log(valid);
				if (valid) {
					uni.showLoading({});
					this.$u.post('/order/invoice/add', {...this.form, orderIds: this.orderIds}).then(response => {
						console.log(this.dataList);
					})
					.then(response => {
						uni.navigateBack({
							delta: 2
						})
						this.$u.toast('操作成功');
					})
					.catch(error => {
						this.$u.toast(error.msg);
					}).finally(() => {
						uni.hideLoading()
					});
				} else {
					console.log('验证失败');
				}
			});
		}
	},
	onReady() {
		// this.$refs.uForm1.setRules(this.rules);
		this.$refs.uForm2.setRules(this.rules);
		this.$refs.uForm3.setRules(this.rules);
	},
	onLoad(option) {
		this.orderIds = option.orderIds;
	}
};
</script>

<style lang="scss">
::v-deep .u-form {
	margin: 0 38rpx 24rpx 38rpx;
	background: #ffffff;
	border-radius: 16rpx;
}
::v-deep .u-form-item {
	// height: 98rpx;
	// padding: inherit;
	// justify-content: center;
	padding: 10rpx 0 !important;
}
::v-deep .u-form-item--left__content__label {
	margin-left: 24rpx;
	font-size: 28rpx;
	font-weight: 500;
	color: #000000;
}
::v-deep .input-placeholder {
	font-size: 28rpx;
	font-weight: 400;
	color: #bfbfbf;
	line-height: 40rpx;
}
::v-deep .u-input__right-icon {
	margin-right: 20rpx;
}
::v-deep .u-btn--default--disabled {
	background-color: rgba(14, 134, 198, 0.4) !important;
}
.section {
	text {
		margin-left: 68rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #000000;
		line-height: 80rpx;
	}
}
.submit {
	background-color: #0e86c6 !important;
	border-radius: 22px;
	height: 90rpx;
	width: 660rpx;
	color: white !important;
}
</style>
