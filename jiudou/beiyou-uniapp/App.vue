<script>
	export default {
		globalData: {
			current: -1, // switchTab 时候，带的参数
		},
		methods: {
			doUpdate(download) {
				uni.showLoading({
					title: '更新中……'
				})
				uni.downloadFile({ //执行下载
					url: download, //下载地址
					success: downloadResult => { //下载成功
						uni.hideLoading();
						if (downloadResult.statusCode == 200) {
							uni.showModal({
								title: '',
								content: '更新成功，确定现在重启吗？',
								confirmText: '重启',
								confirmColor: '#EE8F57',
								success: function(res) {
									if (res.confirm == true) {
										plus.runtime.install( //安装
											downloadResult.tempFilePath, {
												force: true
											},
											function(res) {
												utils.showToast('更新成功，重启中');
												plus.runtime.restart();
											}
										);
									}
								}
							});
						}
					}
				});
			}
		},
		onLaunch: function() {
			console.log('App Launch')

			// #ifdef APP-PLUS
			// 获取APP信息
			plus.runtime.getProperty(plus.runtime.appid, (info) => {
				console.log(info);
				// this.version = info.version; // 版本号

				this.$u.post('/platform/v4/apk/checkUpdate', {
					appVersion: info.versionCode
				}).then(response => {
					uni.showModal({
						title: response.appName,
						content: response.newAppUpdateDesc,
						showCancel: response.isForceUpdate !== 1,
						success: (res) => {
							if (res.confirm) {
								const info = uni.getSystemInfoSync()
								if (info.platform === 'android') {
									this.doUpdate(response.newAppUrl)
								} else {
									// 跳转AppStore
									let appleId = '1417109478';
									plus.runtime.launchApplication({
										action: `itms-apps://itunes.apple.com/cn/app/id${appleId}`,
									})
								}
							}
						}
					})
				})
			})

			// 锁定横屏
			// plus.screen.lockOrientation("landscape-primary");  
			// 锁定竖屏   
			plus.screen.lockOrientation("portrait-primary");
			// #endif

			// 启动页停留4秒， 最多设置6秒
			setTimeout(() => {
				const value = uni.getStorageSync('launchFlag');
				if ((value ?? '') !== '') {
					const token = uni.getStorageSync('token');
					if ((token ?? '') === '') {
						// 不存在则跳转至登录页
						uni.reLaunch({
							url: '/pages/login/login',
							success: () => {
								// #ifdef APP-PLUS
								plus.navigator.closeSplashscreen();
								// #endif
							}
						})
					} else {
						//存在则关闭启动页进入首页
						uni.reLaunch({
							url: '/pages/home/home',
							success: () => {
								// #ifdef APP-PLUS
								plus.navigator.closeSplashscreen();
								// #endif
							}
						})
					}
				} else {
					// #ifdef APP-PLUS
					plus.navigator.closeSplashscreen();
					// #endif
				}
			}, 4000)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import '@/common/icon.scss';
	@import '@/common/iconfont.css';

	/*每个页面公共css */
	page {
		width: 750rpx;
		height: 100%;
		background-color: #F8F8F7;
	}

	::v-deep .u-load-more-wrap {
		margin: 10rpx 0 !important;

		.u-line {
			opacity: 0;
		}

		.u-more-text {
			padding: 25rpx 0rpx;
			font-size: 24rpx;
			font-weight: 500;
			color: #666666;
			line-height: 24rpx;
		}
	}
</style>
