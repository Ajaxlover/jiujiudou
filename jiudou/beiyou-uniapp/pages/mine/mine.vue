<template>
	<view class="wrap u-flex-col">
		<u-navbar :is-back="true" :custom-back="didTappedBack" title="北邮智信" :background="{background: 'rgba(0,0,0,0)'}" title-color="black" title-size="32" :border-bottom="false">
			<view class="navbar-right" slot="right">
				<view class="dot-box right-item" @click="didTappedAction">
					<u-icon :name="require('@/static/images/bookshelf_more@2x.png')" size="46"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="section1 u-flex-col">
			<view class="group3 u-flex">
				<view class="group3 u-flex u-row-between">
					<u-avatar :src="pic" shape="circle" size="140"></u-avatar>
					<view class="TextGroup1 u-flex-col">
						<text class="txt2">{{username}}</text>
						<view class="u-flex" @click="goto('/pages/mine/edit')">
							<text class="info2">编辑资料</text>
							<u-icon :size="14" name="/static/images/arrow@2x.png"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="section2 u-flex-col">
			<u-grid :col="4" :border="false" @click="didTapped">
				<u-grid-item v-for="(item, index) in list" :key="index" :index="item.index">
					<u-icon :size="item.size" :name="item.icon"></u-icon>
					<view class="grid-text">{{item.text}}</view>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="wrap_edge">
			<u-cell-group :border="false">
				<u-cell-item title="客服与帮助" isLink :border-bottom="false" @click="goto('/pages/mine/help')">
				</u-cell-item>
			</u-cell-group>
			<u-cell-group :border="false">
				<u-cell-item title="系统设置" isLink :border-bottom="false" @click="goto('/pages/mine/setting')">
				</u-cell-item>
			</u-cell-group>
		</view>
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
				constants: {},
				list: [{
						index: 0,
						size: 40,
						text: '书架',
						icon: require('@/static/images/mine_ebook@2x.png')
					},
					{
						index: 1,
						size: 60,
						text: '云课',
						icon: require('@/static/images/mine_class@2x.png')
					},
					{
						index: 4,
						size: 48,
						text: '收藏',
						icon: require('@/static/images/mine_collect@2x.png')
					},
					{
						index: 5,
						size: 46,
						text: '反馈',
						icon: require('@/static/images/mine_feedback@2x.png')
					},
					// {
					// 	index: 6,
					// 	size: 46,
					// 	text: '发票管理',
					// 	icon: require('@/static/images/mine_invoice@2x.png')
					// }
				],
			};
		},
		computed: {
			username() {
				const info = uni.getStorageSync('info');
				return info.username;
			},
			pic() {
				const info = uni.getStorageSync('info');
				return info.pic || require('@/static/default-avatar@2x.png');
			}
		},
		methods: {
			didTappedBack() {
				this.goto('switchTab:/pages/home/home');
				// let url = 'https://static.buptpress.com/resourceDown/index.html?url=https://test.guangyiedu.com/202209/4698291663837007766.zip'
				// this.goto(`/pages/webview/share?url=${url}&title=测试`)
			},
			didTappedAction() {
				let that = this;
				uni.showActionSheet({
					itemList: ["分享到微信好友", "分享到微信朋友圈"],
					success: (obj) => {
						uni.share({
							provider: "weixin",
							scene: obj.tapIndex === 0 ? "WXSceneSession" : "WXSceneTimeline",
							type: 0,
							href: 'https://app.buptpress.com/',
							title: '北邮智信',
							summary: '',
							imageUrl: '',
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
			},
			didTapped(e) {
				switch (e) {
					case 0:
						this.goto('switchTab:/pages/bookshelf/bookshelf')
						// this.goto('/pages/epubLocal/epubLocal')
						// this.goto(`/pages/epub/epub`)
						break;
					case 1:
						this.goto('/pages/mine/ccourse')
						break;
					case 3:
						this.goto('/pages/mine/account')
						break;
					case 4:
						this.goto('/pages/mine/collect')
						break;
					case 5:
						this.goto('/pages/mine/feedback')
						break;
					case 6:
						this.goto('/pages/mine/invoice')
						break;
				}
			},
			// 导航栏按钮
			onNavigationBarButtonTap(val) {
				if (val.index == 0) {
					uni.redirectTo({
						url: 'Home'
					});
				}
			},
		},
		onLoad() {
			// const {
			// 	platform
			// } = uni.getSystemInfoSync();
			// if (platform === 'ios') {
			// 	this.list.splice(3, 0, {
			// 		index: 3,
			// 		size: 48,
			// 		text: '账户',
			// 		icon: require('@/static/images/mine_account@2x.png')
			// 	})
			// 	console.log(this.list);
			// }
		}
	}
</script>

<style lang="scss">
	::v-deep .u-cell-item-box {
		margin-top: 10px;
		border-radius: 12px;
		background-color: white;
		overflow: hidden;
	}

	::v-deep .u-avatar__img {
		background-color: #EFEFEF;
	}

	::v-deep .u-cell {
		height: 96rpx;
	}

	::v-deep .u-cell_title {
		font-weight: 400;
		color: black;
		font-size: 24rpx;
	}

	.wrap {
		background-color: rgba(249, 249, 249, 1);
		//background-color: white;
		position: relative;
		width: 750rpx;
		height: 100%;
		overflow: hidden;
		padding-bottom: var(--window-bottom);

		&_edge {
			margin: 0 26rpx;
		}

		.section1 {
			height: 386rpx;
			background: url("../../static/images/mine_header@2x.png") no-repeat;
			background-size: 100% 100%;
			width: 750rpx;
			background-color: white;
			margin-top: -176rpx;

			.group3 {
				width: 350rpx;
				height: 140rpx;
				margin: 196rpx 0 90rpx 0;

				.group3 {
					height: 140rpx;
					margin: 58rpx 0 90rpx 40rpx;

					.TextGroup1 {
						margin-left: 26rpx;
						width: 184rpx;

						.txt2 {
							width: 184rpx;
							height: 50rpx;
							overflow-wrap: break-word;
							color: rgba(0, 0, 0, 1);
							font-size: 36rpx;
							font-family: PingFangSC-Medium;
							text-align: left;
							white-space: nowrap;
							line-height: 50rpx;
							display: block;
						}

						.info2 {
							width: 88rpx;
							height: 32rpx;
							overflow-wrap: break-word;
							color: rgba(102, 102, 102, 1);
							font-size: 22rpx;
							text-align: center;
							white-space: nowrap;
							line-height: 32rpx;
							display: block;
							margin-right: 10rpx;
						}
					}
				}
			}
		}

		.section2 {
			padding-top: 18rpx;
			z-index: 1.1;
			position: relative;
			width: 750rpx;
			background-color: white;

			.grid-text {
				margin-top: 18rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #0E86C6;
				font-size: 22rpx;
			}
		}
	}

	.navbar-right {
		margin-right: 24rpx;
		display: flex;
	}

	.right-item {
		margin: 0 16rpx;
		position: relative;
		display: flex;
	}
</style>
