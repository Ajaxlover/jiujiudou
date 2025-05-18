<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<view>
				<video id="myVideo" 
				:autoplay="true" 
				:src="src" 
				:title="title"
				:show-mute-btn="true"
				@error="videoErrorCallback" 
				controls
				@fullscreenchange="fullscreenchange" 
				@ended="ended" 
				object-fit="contain" />
				<!-- direction="90" -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '',
				cCourseUuid: '',
				catalogUuid: '',
				title: ''
			};
		},
		onReady() {
			// #ifndef MP-ALIPAY || MP-TOUTIAO
			this.videoContext = uni.createVideoContext('myVideo')
			// #endif

			// 进入全屏状态
			// this.videoContext.requestFullScreen();
		},
		methods: {
			videoErrorCallback: function(e) {
				console.log(e);
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			fullscreenchange(e) {
				console.log('change');
				console.log(e);
				if (!e.detail.fullScreen) {
					console.log('暂停');
					this.videoContext.stop();
					// uni.navigateBack({
					// 	delta: 1
					// })
				}
			},
			ended() {
				this.$u.get('/cloudCourse/study', {
					cCourseUuid: this.cCourseUuid,
					catalogUuid: this.catalogUuid
				}).then(response => {
					this.$u.toast('学习成功');
				}).catch(error => {
					this.$u.toast(error.msg);
				})
			},
			getRandomColor: function() {
				const rgb = []
				for (let i = 0; i < 3; ++i) {
					let color = Math.floor(Math.random() * 256).toString(16)
					color = color.length == 1 ? '0' + color : color
					rgb.push(color)
				}
				return '#' + rgb.join('')
			}
		},
		onLoad(option) {
			this.src = option.url;
			this.cCourseUuid = option.cCourseUuid;
			this.catalogUuid = option.catalogUuid;
			this.title = option.title;
			console.log(this.src);
			
			uni.setNavigationBarTitle({
				title: this.title
			})
		},
		// //页面显示时切换为横屏配置
		// onShow() {
		// 	// #ifdef APP-PLUS
		// 	plus.screen.lockOrientation('landscape-primary');
		// 	// #endif
		// },
		//页面卸载时切换为竖屏配置
		onUnload() {
			console.log('onUnload');
			// // #ifdef APP-PLUS
			// plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏
			// // #endif
		}

	}
</script>

<style lang="scss">
	video {
		width: 100%;
		// height: 400px;
	}
	::v-deep .uni-video-bar {
		bottom: env(safe-area-inset-bottom);
	}

	// ::v-deep .uni-video-container {
	// 	width: 750rpx;
	// }

	// ::v-deep .uni-video-video {
	// 	width: 750rpx !important;
	// }
</style>
