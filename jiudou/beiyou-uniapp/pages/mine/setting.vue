<template>
	<view class="page wrap__edge">
		<!-- 	<u-cell-group :border="false">
			<u-cell-item title="账号与绑定" isLink :border="true"></u-cell-item>
			<u-cell-item title="消息通知" isLink :border="false"></u-cell-item>
		</u-cell-group>
		<u-cell-group :border="false">
			<u-cell-item title="下载管理" isLink :border="false"></u-cell-item>
		</u-cell-group> -->
		<u-cell-group :border="false">
			<u-cell-item title="服务协议" isLink :border-bottom="true" @click="goto('/pages/webview/webview?url=https://app.buptpress.com/BYfwxy/')"></u-cell-item>
			<u-cell-item title="隐私政策" isLink :border-bottom="true" @click="goto('/pages/webview/webview?url=https://app.buptpress.com/BYxieyi/')"></u-cell-item>
			<u-cell-item title="关于北邮智信" isLink :border-bottom="false" @click="goto('/pages/mine/about')"></u-cell-item>
		</u-cell-group>
		<u-cell-group :border="false"><u-cell-item title="清除缓存" isLink :border-bottom="false" :value="fileSizeString" @click="clearStorage"></u-cell-item></u-cell-group>
		<u-cell-group :border="false"><u-cell-item title="注销账号" isLink :border-bottom="false" @click="closeAccount"></u-cell-item></u-cell-group>
		<view class="u-flex u-flex-center">
			<u-button class="custom-style" :custom-style="info" :plain="true" :hair-line="false" shape="circle" @click="logout">退出账号</u-button>
		</view>
		<view class="wrap__subtitle u-flex-col u-col-center">
			<text>www.buptpress.com</text>
			<!-- <text>网上有害信息举报:www.12377.c</text> -->
			<!-- <text>违法及不良信息举报电话:010-5858</text>
			<text>举报邮箱:beiyou_jubao@bj</text> -->
		</view>
	</view>
</template>

<script>
import { mixin } from '@/common/mixin';

export default {
	mixins: [mixin],
	data() {
		return {
			fileSizeString: '',
			info: {
				display: 'inline-flex',
				border: '2px solid #0E86C6'
			}
		};
	},
	methods: {
		logout() {
			uni.removeStorageSync('token');
			uni.removeStorageSync('uid');
			this.goto('reLaunch:/pages/login/login');
		},
		getStorageSize() {
			let that = this;
			plus.cache.calculate(function(size) {
				let sizeCache = parseInt(size);
				if (sizeCache == 0) {
					that.fileSizeString = '0B';
				} else if (sizeCache < 1024) {
					that.fileSizeString = sizeCache + 'B';
				} else if (sizeCache < 1048576) {
					that.fileSizeString = (sizeCache / 1024).toFixed(2) + 'K';
				} else if (sizeCache < 1073741824) {
					that.fileSizeString = (sizeCache / 1048576).toFixed(2) + 'M';
				} else {
					that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + 'G';
				}
			});
		},
		// 清理缓存
		clearStorage() {
			let that = this;
			let os = plus.os.name;
			if (os == 'Android') {
				let main = plus.android.runtimeMainActivity();
				let sdRoot = main.getCacheDir();
				let files = plus.android.invoke(sdRoot, 'listFiles');
				let len = files.length;
				for (let i = 0; i < len; i++) {
					let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径
					plus.io.resolveLocalFileSystemURL(
						filePath,
						function(entry) {
							if (entry.isDirectory) {
								entry.removeRecursively(
									function(entry) {
										//递归删除其下的所有文件及子目录
										uni.showToast({
											title: '缓存清理完成',
											duration: 2000
										});
										that.getStorageSize(); // 重新计算缓存
									},
									function(e) {
										console.log(e.message);
									}
								);
							} else {
								entry.remove();
							}
						},
						function(e) {
							console.log('文件路径读取失败');
						}
					);
				}
			} else {
				// ios
				plus.cache.clear(function() {
					uni.showToast({
						title: '缓存清理完成',
						duration: 2000
					});
					that.getStorageSize();
				});
			}
		},
		// 注销账号
		closeAccount() {
			this.goto('/pages/mine/closeAccount')
		}
	},
	onLoad() {
		this.getStorageSize();
	}
};
</script>

<style lang="scss">
::v-deep .u-cell-item-box {
	//margin-top: 10px;
	margin: 24rpx 26rpx;
	border-radius: 12px;
	background-color: white;
	overflow: hidden;
}

::v-deep .u-cell {
	height: 96rpx;
}

::v-deep .u-cell_title {
	font-weight: 400;
	color: black;
	font-size: 28rpx;
}

.custom-style {
	height: 80rpx;
	width: 620rpx;
	margin-top: 118rpx;
	font-size: 32rpx;
	font-weight: 600;
	color: #0e86c6 !important;
}

.wrap {
	&__edge {
		height: 100vh;
	}

	&__group-title {
		margin-top: 28px;
		margin-bottom: 15px;
		font-size: 14px;
		font-weight: 600;
		color: black;
		line-height: 100px;
	}

	&__subtitle {
		font-size: 22rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		line-height: 50rpx;

		text:first-child {
			margin-top: 60rpx;
		}
	}
}
</style>
