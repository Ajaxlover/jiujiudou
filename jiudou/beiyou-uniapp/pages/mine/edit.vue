<template>
	<view class="page wrap">
		<view class="u-flex-col u-col-center">
			<u-upload :custom-btn="true" ref="uUpload" :max-count="1" :action="action" :file-list="fileList"
				@on-success="success" @on-error="error">
				<view slot="addBtn" class="slot-btn u-flex-col u-col-center" hover-class="slot-btn__hover"
					hover-stay-time="150">
					<u-image v-if="userInfo.pic" :src="userInfo.pic" width="132" height="132"
						border-radius="50%"></u-image>
					<image v-else :src="require('@/static/images/img_error@2x.png')" mode="aspectFit"
						style="width:132rpx; height: 132rpx; border-radius: 50%"></image>
					<!--          <u-icon name="photo" size="60" color="#c0c4cc"></u-icon>-->
					<text class="wrap__notice">更换头像</text>
				</view>
			</u-upload>
		</view>

		<view class="wrap__edge">
			<view class="wrap__edge__group-title">账号信息</view>
			<u-form labelPosition="left" :model="userInfo" :rules="rules" ref="form1">
				<u-form-item label="昵称" prop="username" labelWidth="160">
					<u-input v-model="userInfo.username" :border="false" placeholder="请输入账号昵称"
						:placeholder-style="placeholderStyle"></u-input>
				</u-form-item>
			</u-form>


			<view class="wrap__edge__group-title">个人信息</view>
			<u-form labelPosition="left" :model="userInfo" :rules="rules" ref="form2">
				<u-form-item label="姓名" prop="realName" borderBottom labelWidth="160">
					<u-input v-model="userInfo.realName" :border="false" placeholder="请输入真实姓名"
						:placeholder-style="placeholderStyle"></u-input>
				</u-form-item>
				<u-form-item label="学校/机构" prop="school" borderBottom labelWidth="160">
					<u-input v-model="userInfo.school" :border="false" placeholder="请输入学校/机构"
						:placeholder-style="placeholderStyle"></u-input>
				</u-form-item>
				<u-form-item label="学号/工号" prop="number" borderBottom labelWidth="160">
					<u-input v-model="userInfo.number" :border="false" placeholder="请输入学号/工号"
						:placeholder-style="placeholderStyle"></u-input>
				</u-form-item>
				<u-form-item label="邮箱" prop="email" borderBottom labelWidth="160">
					<u-input v-model="userInfo.email" :border="false" placeholder="请输入电子邮箱"
						:placeholder-style="placeholderStyle"></u-input>
				</u-form-item>
			<!-- 	<u-form-item label="手机号" prop="mobile" labelWidth="160">
					<u-input v-model="userInfo.mobile" :border="false" placeholder="请输入常用手机号码"
						:placeholder-style="placeholderStyle"></u-input>
				</u-form-item> -->
			</u-form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				action: "https://tfapi2.guangyiedu.com/v3/openccourse/openDiscuss/uploadImage", // 服务器上传地址
				fileList: [],
				placeholderStyle: "'color': '#999999'; 'font-size': '28rpx'",
				userInfo: {
					username: null,
					realName: null,
					school: null,
					number: null,
					email: null,
					mobile: null,
					pic: null
				},
				rules: {
					realName: [{
							type: 'string',
							required: true,
							message: '请填写姓名',
							trigger: ['blur', 'change']
						}
					],
					mobile: [{
							required: false,
							trigger: ['blur', 'change']
						}
					]
				},
			};
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.form1.setRules(this.rules)
			this.$refs.form2.setRules(this.rules)
		},
		methods: {
			onNavigationBarButtonTap: function(e) {
				console.log('点击了右上角按钮')
				this.commit();
			},
			success(data, index, lists, name) {
				console.log(lists, data);
			},
			error(data, index, lists, name) {
				console.log('上传失败');
				console.log(data);
			},
			commit() {
				console.log(this.userInfo);
				this.$refs.form2.validate(valid => {
					if (valid) {
						uni.showLoading({});
						this.$u.post('/oauth/v4/user/changeInfo', {
							...this.userInfo
						}).then(response => {
							uni.navigateBack({
								delta: 1
							});
							this.$u.toast("修改成功");
							uni.setStorageSync('info', response);
						}).finally(() => {
							uni.hideLoading();
						})
					} else {
						console.log('验证失败');
					}
				});
			}
		},
		onLoad() {
			const info = uni.getStorageSync('info');
			this.userInfo.username = info.username;
			this.userInfo.realName = info.realName;
			this.userInfo.school = info.school;
			this.userInfo.email = info.email;
			this.userInfo.mobile = info.mobile;
			this.userInfo.pic = info.pic;
			this.userInfo.number = info.number;
		}
	}
</script>

<style lang="scss">
	::v-deep .u-preview-wrap {
		overflow: hidden;
		border-radius: 50%;
		background-color: white;
	}

	::v-deep .u-preview-image {
		overflow: hidden;
		border-radius: 50%;
	}

	::v-deep .u-delete-icon {
		margin-right: 25rpx;
		margin-top: 15rpx;
	}

	::v-deep .u-form {
		background-color: white;
		border-radius: 8px;
	}

	::v-deep .u-form-item--left__content__label {
		font-size: 14px;
		color: black;
		margin-left: 12px;
	}

	.wrap {
		&__notice {
			margin-top: 10px;
			margin-bottom: 25px;
			font-size: 12px;
			font-weight: 400;
			color: #999999;
			line-height: 17px;
		}

		&__edge {
			margin: 50rpx 38rpx 0 38rpx;

			&__group-title {
				margin: 40rpx 24rpx 20rpx 24rpx;
				font-size: 12px;
				color: #999999;
				line-height: 17px;
			}
		}
	}
</style>
