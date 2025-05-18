<template>
	<view class="page wrap u-flex-col u-col-center">
		<!-- <u-swiper class="banner" data-ratio="698:260" :list="banner" mode="round" :border-radius="0" name="bannerCover" @click="didSelectBanner"> -->
		<u-swiper class="banner" :height="bannerHeight" :list="banner" data-ratio="375:200" mode="round" :border-radius="0" name="bannerCover" @click="didSelectBanner">
		</u-swiper>
		<view class="search u-flex u-col-center u-row-between" @click="goto(`/pages/home/search`)">
			<u-icon :name="require('@/static/images/main_search_flag@2x.png')" width="36" height="36"></u-icon>
			<text>书名/课程名/关键词</text>
			<image :src="require('@/static/images/main_scan@2x.png')" style="width: 36rpx; height: 32rpx;" @click.stop="scanCode"></image>
		</view>
		<view class="group1">
			<u-grid :col="4" :border="false" style="padding-top: 65rpx; padding-bottom: 20rpx;" @click="didSelectGrid">
				<u-grid-item :index="0">
					<u-icon :size="66" name="/static/images/home_recommend@2x.png"></u-icon>
					<view class="grid-text">推荐</view>
				</u-grid-item>
				<u-grid-item :index="1">
					<u-icon :size="66" name="/static/images/home_rank@2x.png"></u-icon>
					<view class="grid-text">排行</view>
				</u-grid-item>
				<u-grid-item :index="2">
					<u-icon :size="66" name="/static/images/home_offer@2x.png"></u-icon>
					<view class="grid-text">特价</view>
				</u-grid-item>
				<u-grid-item :index="3">
					<u-icon :size="68" name="/static/images/home_news@2x.png"></u-icon>
					<view class="grid-text">新闻</view>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="group2 u-flex">
			<view class="group2__item u-flex-col u-col-center" @click="goto('switchTab:/pages/mall/mall?current=0')">
				<text
					style="font-size: 40rpx; font-family: PingFangSC-Semibold, PingFang SC; font-weight: 600; color: #0E86C6; line-height: 56rpx;">“互联网+”教材</text>
				<text
					style="font-size: 24rpx; font-family: PingFangSC-Regular, PingFang SC; font-weight: 400; color: #0E86C6; line-height: 34rpx;">信息科技融合出版</text>
				<u-icon width="144" height="104" :custom-style="{'margin-top': '34rpx'}" :name="require('@/static/images/home_action1@2x.png')"></u-icon>
			</view>
			<view class="group2__item u-flex-col">
				<view class="group2__item__right u-flex" @click="goto('switchTab:/pages/mall/mall?current=1')">
					<view class="u-flex-col">
						<text style="font-size: 40rpx; font-weight: 600; color: #0E86C6; line-height: 56rpx;">电子书</text>
						<text
							style="font-size: 24rpx; font-weight: 400; color: #0E86C6; line-height: 34rpx;">丰富正版内容</text>
					</view>
					<u-icon width="88" height="90" :custom-style="{'margin-left': '64rpx'}" :name="require('@/static/images/home_action2@2x.png')"></u-icon>
				</view>
				<view class="group2__item__right u-flex" @click="goto('switchTab:/pages/mall/mall?current=2')">
					<view class="u-flex-col">
						<text style="font-size: 40rpx; font-weight: 600; color: #0E86C6; line-height: 56rpx;">云课</text>
						<text
							style="font-size: 24rpx; font-weight: 400; color: #0E86C6; line-height: 34rpx;">线上线下一体化</text>
					</view>
					<u-icon width="96" height="94" :custom-style="{'margin-left': '40rpx'}" :name="require('@/static/images/home_action3@2x.png')"></u-icon>
				</view>
			</view>
		</view>
		<view class="group3" v-if="find.length > 0">
			<view class="header u-flex u-row-between">
				<text style="font-size: 36rpx; font-weight: 500; color: #000000;">资源推荐</text>
				<view class="u-flex u-col-center" style="background: #F2F2F2; border-radius: 22rpx; height: 44rpx;"
					@tap.stop="goto(`/pages/home/findRecommend`)">
					<text
						style="font-size: 24rpx; font-weight: 500; color: #666666; line-height: 24rpx; margin-left: 24rpx">全部</text>
					<image class="flag" src="@/static/images/home_arrow@2x.png"></image>
				</view>
			</view>
			<view class="item u-flex u-col-center" v-for="(item, idx) in find" :key="idx" @click="didSelectFind(item)">
				<image style="width: 20rpx; height: 20rpx" src="@/static/images/home_dot@2x.png"></image>
				<text class="u-line-1">{{ item.contentExt.extTitle }}</text>
			</view>
		</view>
		<view class="group4" v-if="ccourse.length > 0">
			<view class="header u-flex u-row-between">
				<text style="font-size: 36rpx; font-weight: 500; color: #000000;">编辑精选</text>
				<view class="u-flex u-col-center" style="background: #F2F2F2; border-radius: 22rpx; height: 44rpx;"
					@tap.stop="goto(`/pages/home/editorRecommend`)">
					<text
						style="font-size: 24rpx; font-weight: 500; color: #666666; line-height: 24px; margin-left: 24rpx">全部</text>
					<image class="flag" src="@/static/images/home_arrow@2x.png"></image>
				</view>
			</view>
			<view class="item u-flex u-col-center" v-for="item in ccourse" :key="item.ccourseUuid" @click="goto(`/pages/mall/yunkeDetail?obj=${JSON.stringify(item)}`)">
				<u-image width="240" height="180" :src="item.ccourseCover" border-radius="24" style="margin: 16rpx;">
					<u-loading slot="loading"></u-loading>
					<image slot="error" :src="require('@/static/images/img_error@2x.png')"
						style="width: 104rpx; height: 92rpx;;"></image>
				</u-image>
				<view class="right u-flex-col">
					<text class="u-line-1">{{ item.ccourseName }}</text>
					<text>{{ item.ccourseTags }}</text>
					<view style="flex: 1;" class="u-flex u-col-bottom">
						<view class="u-flex u-row-between"
							style="align-items: baseline; padding-bottom: 0rpx; width: 100%">
							<text
								style="font-size: 20rpx; font-weight: 400; color: #8A8A8F; line-height: 20rpx;">{{ item.ccourseTotalNum }}人阅读</text>
							<view class="u-flex u-col-center u-row-center"><text>{{item.isEnroll === 1 ? '已购' : '去了解'}}</text></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-no-network @retry="fetchData"></u-no-network>
	</view>
</template>

<script>
	import UImage from "../../uview-ui/components/u-image/u-image";
	import {
		mixin
	} from "@/common/mixin"
	export default {
		mixins: [mixin],
		components: {
			UImage
		},
		data() {
			return {
				bannerHeight: 400,
				banner: [],
				ccourse: [], // 编辑精选
				find: [], // 资源推荐
			};
		},
		methods: {
			onPullDownRefresh() {
				this.fetchData();
			},
			fetchData() {
				this.$u.post('/index').then(response => {
					this.banner = response.banner;
					this.ccourse = response.ccourse;
					this.find = response.find;
				}).finally(() => {
					uni.stopPullDownRefresh()
				})
			},
			didSelectFind(obj) {
				// #ifdef APP-PLUS
				plus.runtime.openWeb(obj.contentExt.extOriginUrl);
				// #endif
			},
			didSelectBanner(index) {
				const obj = this.banner[index];
				if ((obj.bannerUrl??'').length === 0) return;
				
				if (obj.bannerUrl.indexOf('mp.weixin.qq.com') > -1) {
					// #ifdef APP-PLUS
					plus.runtime.openWeb(obj.bannerUrl);
					// #endif
				} else {
					this.goto(`/pages/webview/webview?url=${encodeURIComponent(obj.bannerUrl)}`)
				}
				
				// const obj = this.banner[index];
				// console.log(obj);
				// uni.navigateTo({
				// 	url: `/pages/webview/webview?url=${encodeURIComponent(obj.bannerUrl)}`
				// })
			},
			didSelectGrid(index) {
				switch (index) {
					case 0:
						// this.goto('switchTab:/pages/mall/mall?current=0');
						this.goto('/pages/home/recommend')
						break;
					case 1:
						this.goto('/pages/home/ranking');
						break;
					case 2:
						this.goto('/pages/home/specialOffer');
						break;
					case 3:
						this.goto('/pages/home/news');
						break;
				}
			},
			scanCode() {
				this.goto('/pages/home/scan?type=1')
				// uni.scanCode({
				// 	onlyFromCamera: true,
				// 	scanType: ['barCode'],
				// 	autoDecodeCharset: true,
				// 	hideAlbum: true,
				// 	success(response) {
				// 		console.log('条码类型：' + res.scanType);
				// 		console.log('条码内容：' + res.result);
				// 	},
				// 	complete() {
						
				// 	}
				// })
			}
		},
		onLoad() {
			const { screenWidth } = uni.getSystemInfoSync();
			this.bannerHeight = (screenWidth *200 / 375) * 2;
			// this.fetchData();
		},
		onShow() {
			this.fetchData();
		}
	}
</script>

<style>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #F8F8F7;
	}

	/* #endif */
</style>

<style lang="scss">
	::v-deep .uni-swiper {
		height: 200px !important;
	}
	::v-deep .u-swiper-indicator {
		margin-bottom: 50rpx !important;
	}
	::v-deep .u-indicator-item-round {
		width: 8rpx !important;
		height: 8rpx !important;
	}
	::v-deep .u-indicator-item-round-active {
		width: 18rpx !important;
	}
	::v-deep .uni-swiper {
		height: 100% !important;
	}

	.wrap {
		padding-bottom: var(--window-bottom);
		
		.banner {
			width: 750rpx;
			height: calc(750rpx *200 / 375) !important;
		}

		.search {
			padding: 0 64rpx 0 52rpx;
			// position: absolute;
			// top: 346rpx;
			position: relative;
			top: -54rpx;
			height: 108rpx;
			width: 100%;
			z-index: 2;
			background: url("@/static/images/main_search@2x.png") no-repeat;
			background-size: 718rpx 108rpx;
			background-position: 16rpx 0;

			text {
				margin-left: 10rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #A1A3AB;
				line-height: 34rpx;
				flex: 1;
			}
		}

		.group1 {
			width: 100%;
			background-color: white;
			margin-top: -108rpx;

			.grid-text {
				margin-top: 16rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #4D5891;
			}
		}

		.group2 {
			width: 100%;
			margin-top: 16rpx;
			background-color: white;

			&__item {
				width: 50%;

				&__right {
					height: 140rpx;
					margin-left: 30rpx;
				}
			}

			.group2__item:nth-child(1) {
				border-right: solid #F6F6F6 3rpx;
			}

			.group2__item__right:nth-child(2) {
				border-top: solid #F6F6F6 3rpx;
			}
		}

		.group3 {
			width: 686rpx;
			margin-top: 30rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			// padding-bottom: 10rpx;
			margin-bottom: 10rpx;

			.header {
				height: 104rpx;
				border-bottom: 1rpx solid #F2F2F2;
				margin: 0 34rpx 20rpx 18rpx;
				background: url("@/static/images/bookshelf_check@2x.png") no-repeat;
				background-size: 68rpx 52rpx;
				background-position: 38rpx 28rpx;
				z-index: 2;
			}

			.item {
				margin: 10rpx 20rpx 10rpx 20rpx;
				padding: 14rpx 0 14rpx 0;

				text {
					max-width: 600rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: #333333;
					line-height: 32rpx;
					margin-left: 20rpx
				}
			}

			.flag {
				width: 16rpx;
				height: 24rpx;
				margin-left: 6rpx;
				margin-right: 14rpx;
			}
		}

		.group4 {
			width: 686rpx;

			.header {
				height: 104rpx;
				margin: 0 34rpx 20rpx 18rpx;
				background: url("@/static/images/bookshelf_check@2x.png") no-repeat;
				background-size: 68rpx 52rpx;
				background-position: 38rpx 28rpx;
				z-index: 2;
			}

			.item {
				background: #FFFFFF;
				box-shadow: 0rrpx 16px 0rpx rgba(0, 0, 0, 0.05);
				border-radius: 24rpx;
				margin: 20rpx 0 20rpx 0;
				//display: -webkit-box;

				.right {
					height: 148rpx;
					width: 382rpx;
					margin: 16rpx 16rpx 0rpx 16rpx;

					text:nth-child(1) {
						font-size: 32rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #000000;
						line-height: 32rpx;
					}

					text:nth-child(2) {
						margin-top: 24rpx;
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #666666;
						line-height: 24rpx;
					}

					view {
						:nth-child(1) {

							view {
								width: 112rpx;
								height: 48rpx;
								background: #F6F6F6;
								border-radius: 28rpx;

								text {
									font-size: 24rpx;
									font-family: PingFangSC-Medium, PingFang SC;
									font-weight: 500;
									color: #267AFF;
									line-height: 48rpx;
								}
							}
						}
					}
				}
			}

			.flag {
				width: 16rpx;
				height: 24rpx;
				margin-left: 6rpx;
				margin-right: 14rpx;
			}
		}

	}
</style>
