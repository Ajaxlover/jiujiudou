<template>
	<view class="wrap u-flex-col u-col-center">
		<!-- <view class="header">
			<!-- <view class="tips">点击右上角分享按钮分享</view> -->
		<!-- </view> -->
		<u-icon :name="require('@/static/tips@2x.png')" width="750" height="236"></u-icon>
		
		<u-icon :name="require('@/static/txt@2x.png')" width="451" height="171" style="margin-top: 208rpx;"></u-icon>
		<text style="margin-top: 184rpx;">{{title}}</text>
		<u-icon :name="require('@/static/folder@2x.png')" width="266" height="264"></u-icon>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#0E86C6'
					}
				},
				url: "",
				title: ''
			};
		},
		methods: {
			onNavigationBarButtonTap: function(e) {
				console.log('点击了右上角按钮')

				let that = this;
				uni.showActionSheet({
					itemList: ["分享到微信好友", "分享到微信朋友圈"],
					success: (obj) => {
						uni.share({
							provider: "weixin",
							scene: obj.tapIndex === 0 ? "WXSceneSession" : "WXSceneTimeline",
							type: 0,
							href: this.url,
							title: this.title,
							summary: '',
							imageUrl: 'https://static.buptpress.com/resourceDown/images/logo.png',
							success: function(res) {
								console.log("success:" + JSON.stringify(res));
								that.$u.toast('分享成功');
							},
							fail: function(err) {
								console.log("fail:" + JSON.stringify(err));
								that.$u.toast('分享失败');
							}
						});
					}
				})
			}
		},
		onLoad(option) {
			console.log(option);
			console.log(option.url);
			this.url = `https://static.buptpress.com/resourceDown/index.html?url=${encodeURI(option.url)}`
			this.title = option.title;

			// #ifdef APP-PLUS
			uni.setNavigationBarTitle({
				title: option.title
			})
			// #endif
		}
	}
</script>

<style lang="scss">
	.wrap {
		.header {
			width: 100%;
			// background: rgb(52, 52, 52);
			// margin-left: 0px;
			// margin-right: 0px;
			// padding-top: 30px;
			// padding-bottom: 30px;
			background-image: url('@/static/tips@2x.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			height: 236rpx;
			
			.tips {
				color:#7f7e7e;
				font-size: 28rpx;
				margin:0px 40rpx;
			}
		}

		height: 100vh;
		background-color: #A4C3FC;
		// background-image: url('@/static/bg.png');
		// background-size: 100% 100%;
		// background-repeat: no-repeat;

		span {
			margin-top: 50rpx;
			text-align: center;
			color: #1175CC;
			font-size: 36rpx;
			font-weight: 600;
			letter-spacing: 2px;
		}
	}
</style>
