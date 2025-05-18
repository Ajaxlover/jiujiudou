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
			<u-image width="208" height="300" border-radius="8" :src="obj.coverPic" style="width: 208rpx; height: 300rpx">
				<u-loading slot="loading"></u-loading>
				<image slot="error" :src="require('@/static/images/img_error@2x.png')" style="width: 104rpx; height: 92rpx;"></image>
			</u-image>
			<view class="info u-flex-col">
				<text class="title u-line-2">{{detail.tname}}</text>
				<text class="author">作 者：{{detail.author}}</text>
				<text class="publish">版权方：{{detail.publishname || ''}}</text>
				<view class="price">价格：<text>{{price(detail.discountPrice)}}</text></view>
				<view class="u-flex u-row-between">
					<text class="pubDate">上传时间：
						<uni-dateformat :date="Number(detail.updated)" format="yyyy-MM-dd hh:mm" />
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
								<text class="title">基本信息</text>
								<u-parse :html="detail.bookIntro"></u-parse>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item" style="background-color: white">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col u-col-center">
							<view class="collapse">
								<u-collapse :head-style="headStyle">
									<u-collapse-item :title="item.catelogcontent" v-for="(item, index) in detail.catalog" :key="index">
										<view class="collapse-item" v-for="(each, idx) in item.cataList" :key="idx" @click="didSelect(each)">
											{{ each.catelogcontent || each.resName }}</view>
									</u-collapse-item>
								</u-collapse>
							</view>
						</view>
						<u-empty text="暂无数据" mode="data" :show="detail && detail.catalog && detail.catalog.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<view class="wrap-bottom" v-if="detail.isBuy == 0">
			<view class="u-flex u-row-center u-row-between" style="height: 97rpx; width: 100%; padding: 0 44rpx">
				<view class="price">
					<text>{{ price(detail.discountPrice) }}</text>
				</view>
				<u-button class="button" :custom-style="info" :hair-line="false" @click="buy">{{detail.price === 0 ? '免费获取': '立即购买'}}</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import UniDateformat from "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat";
	import UImage from "../../uview-ui/components/u-image/u-image";
	import UTag from "../../uview-ui/components/u-tag/u-tag";
	import Test from "./test";
	import {
		mixin
	} from "@/common/mixin"
	export default {
		components: {
			Test,
			UTag,
			UImage,
			UniDateformat
		},
		mixins: [mixin],
		data() {
			return {
				obj: null,
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
						name: '简介',
						dataList: []
					},
					{
						name: '目录',
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
			didTappedAction() {
				let that = this;
				uni.showActionSheet({
					itemList: ["分享到微信好友", "分享到微信朋友圈"],
					success: (obj) => {
						uni.share({
							provider: "weixin",
							scene: obj.tapIndex === 0 ? "WXSceneSession" : "WXSceneTimeline",
							type: 0,
							href: `https://static.buptpress.com/ebookDetail/index.html?bookId=${this.obj.id}`,
							title: this.detail.tname,
							summary: this.detail.publishname,
							imageUrl: this.detail.coverPic,
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
			fetchData() {
				this.$u.post('/ebook/ebookApp/preRead', {
					ebookId: this.obj.id
				}).then(response => {
					this.detail = response;
					this.reset(this.detail.catalog)
					console.log(this.detail);
				})
			},
			fetchReply() {
				this.$u.post('/cloudCourse/discuss/listWithReplyByPage', {
					cCourseUuid: this.obj.ccourseUuid,
					catalogUuid: this.obj.id,
					page: this.list[2].page,
					pageSize: 10
				}).then(response => {
					if (this.list[2].page === 1) this.list[2].dataList = response.data;
					else this.list[2].dataList.push(...response.data);

					this.list[2].page += 1;
					this.list[2].status = (response.data ?? []).length < 10 ? 'nomore' : 'loading'
				})
			},
			// 点赞、取消
			report() {
				let url;
				if (this.detail.isCollect == 1) url = '/user/collection/cancelCollect';
				else url = '/user/collection/addCollection';

				uni.showLoading();
				this.$u.post(url, {
					resId: this.detail.id,
					type: 7
				}).then(response => {
					this.detail.isCollect = this.detail.isCollect == 1 ? 0 : 1;
					console.log(this.detail);
					this.$forceUpdate()
				}).finally(() => {
					uni.hideLoading()
				})
			},
			buy() {
				const info = uni.getSystemInfoSync()
				if (info.platform === 'ios' && this.detail.price > 0) {
					this.$u.toast('请使用安卓手机购买');
					return;
				}

				uni.showLoading({});
				let url = '/nOrder/buyEbook'
				if (this.detail.price === 0) url = '/ebook/ebookUser/addEbook'

				this.$u.post(url, {
					ebookId: this.obj.id,
					returnType: 1,
					osType: info.platform === 'ios' ? 'iOS' : 'android',
					os: info.platform === 'ios' ? 'iOS' : 'android',
					price: this.detail.price
				}).then(response => {
					console.log(response);
					if (this.detail.price === 0) {
						this.detail.isBuy = 1;
						this.$u.toast('购买成功');
					} else {
						this.goto(`/pages/mall/payment?obj=${JSON.stringify(this.obj)}&paymentInfo=${JSON.stringify(response)}&ebook=1`);
					}
				}).catch(error => {
					this.$u.toast(error.msg)
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
				if (this.detail.isBuy == 0) {
					this.$u.toast('请购买后学习');
					return;
				}

				console.log(this.detail.catalog)
				console.log(item)
				if (item.hasOwnProperty('cataList') && item?.cataList?.length > 0) {
					const obj = item?.cataList[0];
					let suffix = obj.name.substring(obj.name.lastIndexOf(".") + 1);
					console.log(suffix);
					const array = ['png', 'jpg', 'jpeg'];
					if (array.includes(suffix)) {
						this.goto(
							`/pages/mall/album?obj=${JSON.stringify(item.cataList)}&ebookId=${this.obj.id}&catalogId=${item.catalogid}`
						)
					} else if (suffix === 'epub') {
						this.goto(`/pages/epub/epub?url=${obj.catalogUrl}&name=${obj.name}`)
						// this.goto(`/pages/epub/ebook?url=${item.catalogUrl}&name=${item.name}`)
					} else if (suffix === 'pdf' && uni.getSystemInfoSync().platform == "android") {
						let url = `/hybrid/html/web/viewer.html?file=${encodeURIComponent(obj.catalogUrl)}`;
						this.goto(`/pages/webview/webview?url=${url}`)
					} else {
						this.goto(`/pages/webview/webview?url=${obj.catalogUrl}`)
					}
				} else {
					let suffix = item.name.substring(item.name.lastIndexOf(".") + 1);
					const array = ['png', 'jpg', 'jpeg'];
					if (array.includes(suffix)) {
						this.goto(
							`/pages/mall/album?obj=${JSON.stringify([item])}&ebookId=${this.obj.id}&catalogId=${item.id}`
						)
					} else if (suffix === 'epub') {
						this.goto(`/pages/epub/epub?url=${item.catalogUrl}&name=${item.name}`)
						// this.goto(`/pages/epub/ebook?url=${item.catalogUrl}&name=${item.name}`)
					} else if (suffix === 'pdf' && uni.getSystemInfoSync().platform == "android") {
						let url = `/hybrid/html/web/viewer.html?file=${encodeURIComponent(item.catalogUrl)}`;
						this.goto(`/pages/webview/webview?url=${url}`)

						// this.goto(`/pages/webview/webview?url=${'https://www.gjtool.cn/pdfh5/pdf.html?file='+item.catalogUrl}`)
					} else {
						this.goto(`/pages/webview/webview?url=${item.catalogUrl}`)
					}
				}
			},
			reachBottom() {
				// 此tab为空数据
				if (this.swiperCurrent === 2) {
					this.fetchReply();
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
			this.obj = JSON.parse(option.obj)
			console.log(this.obj)
			this.fetchData()
			// this.fetchReply()
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
			height: 284rpx;

			.title {
				width: 100%;
				flex: 1;
				font-size: 32rpx;
				font-weight: 500;
				color: #121212;
				line-height: 44rpx;
			}

			.author {
				margin-top: 20rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				line-height: 44rpx;
			}

			.publish {
				margin-top: 10rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				line-height: 44rpx;
			}

			.price {
				margin-top: 30rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				line-height: 44rpx;

				text:nth-child(1) {
					font-size: 44rpx;
					font-weight: 500;
					color: #0E86C6;
					line-height: 60rpx;
				}

				text:nth-child(2) {
					font-size: 24rpx;
					font-weight: 400;
					color: #0E86C6;
					line-height: 34rpx;
				}
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
		height: calc(100vh - var(--window-top) - 428rpx - 50rpx);

		.page_box {
			background-color: #F8F8F7;

			.introduce {
				padding: 42rpx 30rpx;
				background-color: white;
				border-radius: 0rpx 0rpx 24rpx 24rpx;

				.title {
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
					font-size: 26rpx;
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
		// position: fixed;
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
		width: 433rpx;
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
