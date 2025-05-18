<template>
	<view class="page u-flex-col">
		<u-navbar :is-back="true" title="图书详情" :background="{background: '#F8F8F7'}" title-color="black" title-size="32" :border-bottom="false">
			<view class="navbar-right" slot="right">
				<view class="dot-box right-item" @click="didTappedAction">
					<u-icon :name="require('@/static/images/bookshelf_more@2x.png')" size="46"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="head u-flex">
			<u-image width="152" height="218" border-radius="8" :src="detail.cover_pic">
				<u-loading slot="loading"></u-loading>
				<image slot="error" :src="require('@/static/images/img_error@2x.png')" style="width: 104rpx; height: 92rpx;"></image>
			</u-image>
			<view class="info u-flex-col">
				<text class="title u-line-2">{{obj.textbookName}}</text>
				<text class="publish">{{detail.pubName || ''}}</text>
				<view class="u-flex u-row-between">
					<text class="pubDate">上传时间：
						<uni-dateformat :date="Number(obj.updated)" format="yyyy-MM-dd hh:mm" />
					</text>
					<image v-if="detail.isCollect == 1" :src="require('@/static/images/fav_hig@2x.png')" style="width: 38rpx; height: 38rpx" @tap.stop="report"></image>
					<image v-else :src="require('@/static/images/fav_nor@2x.png')" style="width: 38rpx; height: 38rpx" @tap.stop="report"></image>
				</view>
			</view>
		</view>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper ref="uTabs" :current="current" :list="list" :is-scroll="false" :bar-style="barStyle" :bar-height="6" :bar-width="60" font-size="30"
					inactive-color="#121212" :active-item-style="activeItemStyle" swiper-width="750" bg-color="#fff" @change="change">
				</u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%; width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col">
							<view class="introduce u-flex-col">
								<view class="info">
									<view>中文名：</view>
									<text>{{detail.tname}}</text>
								</view>
								<view class="info">
									<view>作者：</view>
									<text>{{detail.author}}</text>
								</view>
								<view class="info">
									<view>出版社：</view>
									<text>{{detail.pubName}}</text>
								</view>
								<view class="info">
									<view>出版日期：</view>
									<text>{{detail.pub_date}}</text>
								</view>
								<text class="title">内容简介</text>
								<u-parse :html="detail.book_intro"></u-parse>

								<text class="catalog">图书目录</text>
								<u-parse :html="detail.bookCatalogIntro"></u-parse>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item" style="background-color: white">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col u-col-center">
							<view class="collapse">
								<u-collapse :head-style="headStyle">
									<u-collapse-item :title="item.catelogContent" v-for="(item, index) in detail.catalog" :key="index">
										<view class="collapse-item u-line-1" v-for="(each, idx) in item.matchPicInfos" :key="idx" @click="didSelect(each)">{{ each.matchpicname }}
										</view>
									</u-collapse-item>
								</u-collapse>
							</view>
						</view>
						<u-empty text="暂无数据" mode="data" :show="detail && detail.catalog && detail.catalog.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<view class="wrap-bottom" v-if="detail.bookStoreUrl && detail.bookStoreUrl.length > 0">
			<view class="u-flex u-row-center u-col-center" style="height: 97rpx; width: 100%; padding: 0 44rpx;">
				<u-button class="button" :custom-style="info" :hair-line="false" @click="goto(`/pages/webview/webview?url=${detail.bookStoreUrl}`)">立即购买</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import UniDateformat from "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat";
	import UImage from "../../uview-ui/components/u-image/u-image";
	import UTag from "../../uview-ui/components/u-tag/u-tag";
	import {
		mixin
	} from "@/common/mixin"
	export default {
		components: {
			UTag,
			UImage,
			UniDateformat
		},
		mixins: [mixin],
		data() {
			return {
				obj: {},
				detail: {},

				barStyle: {
					"z-index": '-1',
					"background-color": '#1374CB',
					"border-radius": '4rpx'
				},
				activeItemStyle: {
					"font-size": "30rpx",
					"color": "#1374CB",
					"font-weight": "500"
				},
				// collapse
				headStyle: {
					'height': '86rpx',
					'background': '#F7F8FC',
					'border-radius': '20rpx',
					'margin': '10rpx 0',
					'padding': '0 22rpx',
					'color': 'black',
					'font-weight': 'bold',
					'font-size': '28rpx'
				},
				info: {
					display: 'inline-flex',
					border: 'none'
				},
				list: [{
						name: '基本信息',
						dataList: []
					},
					{
						name: '电子资源',
						dataList: []
					}
				],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
			};
		},
		methods: {
			fetchData() {
				this.$u.post('/book/bookApp/detail', {
					textBookId: this.obj.textbookId
				}).then(response => {
					console.log(response);
					this.detail = response;
				})
			},
			// 点赞、取消
			report() {
				let url;
				if (this.detail.isCollect == 1) url = '/user/collection/cancelCollect';
				else url = '/user/collection/addCollection';

				uni.showLoading({});
				this.$u.post(url, {
					resId: this.obj.textbookId,
					type: 1
				}).then(response => {
					this.detail.isCollect = this.detail.isCollect == 1 ? 0 : 1;
					console.log(this.detail);
					this.$forceUpdate()
				}).finally(() => {
					uni.hideLoading()
				})
			},
			reset(array) {
				array.forEach(item => {
					item.name = item.catelogcontent;
					if (item.cataList.length > 0) {
						item.open = false;
						this.reset(item.cataList);
					} else {
						item.cataList = this.detail.ebook.filter(each => each.nodeId === item.catalogid);
						if (item.cataList.length > 0) {
							item.open = false;
							item.cataList.forEach(i => {
								i.name = i.resName;
								i.catalogUrl = i.resUrl;
							})
						}
					}
				})
			},
			// 目录选中
			didSelect(item) {
				if (this.obj.isVerified !== 1) {
					this.$u.toast('教材未验证, 请扫描本书封底验证码');
					return;
				}
				let url = item.resUrl;
				if (uni.getSystemInfoSync().platform == "android" && (item.resType == 4 || item.resType == 6 || item.resType == 7)) {
					this.goto(`/pages/webview/webview?url=${encodeURI(`http://view.officeapps.live.com/op/view.aspx?src=${item.resUrl}`)}`)
				} else if (uni.getSystemInfoSync().platform == "android" && (item.resType == 1 || item.resType == 2)) {
					this.goto(`/pages/bookshelf/video?url=${item.resUrl}&title=${item.resName}`)
				} else if (uni.getSystemInfoSync().platform == "android" && item.resType == 9) {
					let url = `/hybrid/html/web/viewer.html?file=${encodeURIComponent(item.resUrl)}`;
					this.goto(`/pages/webview/webview?url=${url}`)
				} else if (item.resType == 14 || item.resType == 0) {
					this.goto(`/pages/webview/share?url=${item.resUrl}&title=${item.resName}`)
				} else {
					this.goto(`/pages/webview/webview?url=${item.resUrl}&title=${item.resName}`)
				}
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
							href: `https://static.buptpress.com/bookDetail/index.html?bookId=${this.obj.textbookId}`,
							title: this.detail.tname,
							summary: this.detail.pubName,
							imageUrl: this.detail.cover_pic,
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
			reachBottom() {
				// 此tab为空数据
				if (this.swiperCurrent === 2) {
					// this.fetchReply();
				}
				// if (this.current === 4) {
				//   if (this.list[this.current].current === this.list[this.current].pages) return;
				//
				//   setTimeout(() => {
				//     this.fetchData(this.current, this.list[this.current].current + 1);
				//   }, 1200);
				// }
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				// this.fetchData(index);
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.uTabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			}
		},
		onLoad(option) {
			this.obj = JSON.parse(option.obj);
			this.fetchData();
			console.log(this.obj)
		}
	}
</script>

<style lang="scss">
	::v-deep .u-btn--default--disabled {
		background-color: rgba(14, 134, 198, 0.4) !important;
	}

	::v-deep .u-size-default {
		font-size: 20rpx;
		font-weight: 400;
		color: #888888;
		line-height: 28rpx;
		background: #F6F6F6;
		border-radius: 8rpx;
		padding: 0 12rpx;
	}

	::v-deep .u-mode-light-primary {
		border: initial;
	}

	::v-deep .u-tabs-scroll-box {
		border-bottom: solid 2rpx #E7EBF2;
		margin: 0 28rpx;
	}

	.head {
		margin: 0 32rpx;

		.info {
			margin: 8rpx 24rpx;
			flex: 1;
			height: 218rpx;

			.title {
				width: 100%;
				flex: 1;
				font-size: 36rpx;
				font-weight: 500;
				color: #121212;
				line-height: 44rpx;
			}

			.publish {
				margin-top: 10rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #666666;
				line-height: 44rpx;
			}

			.pubDate {
				margin-top: 10rpx;
				font-size: 20rpx;
				font-weight: 400;
				color: #999999;
				line-height: 28rpx;
			}
		}
	}

	.wrap {
		margin: 46rpx 32rpx 0 32rpx;
		border-radius: 24rpx;
		overflow: hidden !important;
		display: flex;
		flex-direction: column;
		height: calc(100vh - env(safe-area-inset-top) - 97rpx - env(safe-area-inset-bottom) - 218rpx - 88rpx);

		.page_box {
			background-color: #F8F8F7;

			.introduce {
				padding: 42rpx 30rpx;
				background-color: white;
				border-radius: 0rpx 0rpx 24rpx 24rpx;

				.info {
					display: flex;

					view:nth-child(1) {
						font-size: 28rpx;
						font-weight: 400;
						color: #888888;
						line-height: 56rpx;
						width: 148rpx;
					}

					text:nth-child(2) {
						font-size: 28rpx;
						font-weight: 400;
						color: #000000;
						line-height: 56rpx;
					}
				}

				.title {
					margin-top: 34rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #121212;
					line-height: 42rpx;
					margin-bottom: 10rpx;
				}

				.catalog {
					margin-top: 40rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #121212;
					line-height: 42rpx;
					margin-bottom: 10rpx;
				}
			}

			.collapse {
				width: 698rpx;
				background: white;
				padding: 34rpx 24rpx;

				.title {
					font-size: 36rpx;
					font-weight: 400;
					color: #666666;
					line-height: 36rpx;
					margin-bottom: 16rpx;
				}

				.collapse-item {
					margin: 0 22rpx;
					height: 78rpx;
					font-size: 26rpx;
					font-weight: 400;
					color: #333333;
					border-bottom: 2rpx solid #E7EBF2;
					line-height: 78rpx;
				}
			}
		}
	}

	.wrap-bottom {
		position: fixed;
		bottom: env(safe-area-inset-bottom);
		width: 100%;
		background-color: white;
		height: calc(97rpx);
	}

	.price {
		margin-top: 20rpx;

		text:nth-child(1) {
			font-size: 36rpx;
			font-weight: 500;
			color: #0E86C6;
			line-height: 50rpx;
		}

		text:nth-child(2) {
			margin-left: 6rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #0E86C6;
			line-height: 34rpx;
		}
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	.button {
		background-color: #0E86C6 !important;
		border-radius: 37rpx;
		height: 74rpx;
		width: 100%;
		color: white !important;
		font-size: 28rpx;
		font-weight: bold;
		border: 0;
		margin-right: 0rpx;
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
