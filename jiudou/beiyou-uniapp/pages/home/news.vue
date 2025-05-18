<template>
	<view classs="page u-flex-col">
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper ref="uTabs" :current="current" :list="dataList" name="channelName" :is-scroll="false" :bar-style="barStyle" :bar-height="38" :bar-width="50"
					font-size="26" inactive-color="#666" :active-item-style="activeItemStyle" swiper-width="750" bg-color="#fff" @change="change">
				</u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(item, idx) in dataList" :key="idx">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page-box u-flex-col" v-if="item.type === 0">
							<view class="item-type-0 u-flex-col" v-for="(each, index) in item.dataList" :key="index"
								@tap.stop="didSelectItem(each)">
								<view class="top u-flex u-row-between">
									<view class="left u-flex-col u-row-between"><text class="title">{{each.contentExt.extTitle}}</text></view>
									<u-image width="210" height="142" style="border-radius: 24rpx; overflow: hidden;" :src="each.contentExt.extCoverImg" shape="square">
										<u-loading slot="loading"></u-loading>
										<image slot="error" :src="require('@/static/images/img_error@2x.png')" style="width: 104rpx; height: 92rpx;;"></image>
									</u-image>
								</view>
								<view class="bottom u-flex u-row-between">
									<text class="subtitle">{{each.contentExt.extAuthor}}</text>
									<uni-dateformat class="date" :date="Number(each.contentExt.extReleaseTime)" format="yyyy-MM-dd" />
								</view>
							</view>
						</view>
						<view class="page-box u-flex-col" v-else>
							<view class="item-type-1 u-flex u-row-between" v-for="(each, index) in item.dataList" :key="index"
								@tap.stop="goto(`/pages/webview/webview?url=${each.contentExt.extOriginUrl}`)">
								<view class="left">
									<view class="title u-line-2">{{each.contentExt.extTitle}}</view>
									<u-line margin="10rpx 0" color="#EEEEEE" />
									<view class="bottom u-flex u-row-between">
										<uni-dateformat class="date" :date="Number(each.contentExt.extReleaseTime)" format="yyyy-MM-dd" />
										<view class="">
											<u-icon width="22" height="16" :name="require('@/static/images/bookshelf_look@2x.png')" />
											<text class="subtitle" style="margin-left: 6rpx;">{{each.viewsTotal}}</text>
										</view>
									</view>
								</view>
								<image :src="require('@/static/images/arrow@2x.png')" style="width: 14rpx; height: 24rpx;"></image>
							</view>
						</view>
						<u-loadmore v-if="item.dataList.length > 0" :status="item.status"></u-loadmore>
						<u-empty text="暂无数据" mode="data" :show="item.dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import UniDateformat from "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat";
	import {
		mixin
	} from "@/common/mixin"
	export default {
		mixins: [mixin],
		components: {
			UniDateformat
		},
		data() {
			return {
				barStyle: {
					"z-index": '10'
				},
				activeItemStyle: {
					"font-size": "28rpx",
					"color": "#0E86C6",
					"font-weight": "500"
				},
				dataList: [{
						name: '新闻中心',
						type: 0,
						page: 1,
						status: 'loading',
						dataList: []
					},
					{
						name: '通知公告',
						type: 1,
						page: 1,
						status: 'loading',
						dataList: []
					}
				],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0
			};
		},
		methods: {
			didSelectItem(obj) {
				// #ifdef APP-PLUS
				plus.runtime.openWeb(obj.contentExt.extOriginUrl);
				// #endif
			},
			fetchData(obj, idx) {
				console.log(obj);
				this.$u.post('/platform/content/channelContent', {
					type: obj.type,
					page: obj.page,
					pagesize: 10,
					refreshTime: 0,
					status: 1
				}).then(response => {
					console.log(response.list);
					var array = this.dataList[idx].dataList || [];
					console.log(array);
					if (obj.page === 1) array = response.list;
					else array.push(...response.list);

					this.$set(this.dataList[idx], 'dataList', array);
					this.$set(this.dataList[idx], 'status', (response.list ?? []).length >= 10 ? "loading" : "nomore");
					this.$set(this.dataList[idx], 'page', obj.page + 1);
					console.log(this.dataList);
				})
			},
			reachBottom() {
				if (this.dataList[this.current].status === 'loading') {
					this.fetchData(this.dataList[this.current], this.current)
				}
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
		onLoad() {
			// this.$u.post('/platform/content/channeList', {}).then(response => {
			// 	this.dataList = response.data;
			// 	this.dataList.forEach((each, idx) => {
			// 		this.fetchData(each, idx);
			// 	})
			// })

			this.dataList.forEach((each, idx) => {
				this.fetchData(each, idx);
			})
		}
	}
</script>

<style lang="scss">
	::v-deep .u-scroll-bar {
		background: url(@/static/images/bookshelf_check@2x.png) no-repeat 50% 16rpx;
		background-size: 22rpx 18rpx;
		background-color: rgba(220, 20, 60, 0.0) !important;
	}

	::v-deep .u-load-more-wrap {
		.u-line {
			opacity: 0;
		}

		.u-more-text {
			padding: 25rpx 0rpx;
		}
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;

		.page-box {
			.item-type-0 {
				background: #FFFFFF;
				box-shadow: 0px 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
				border-radius: 24rpx;
				width: 700rpx;
				margin-left: 25rpx;
				padding: 25rpx;
				background-color: white;
				margin-top: 20rpx;

				.top {
					.left {
						flex: 1;
						min-height: 142rpx;

						.title {
							font-size: 32rpx;
							font-weight: 400;
							color: #000000;
							line-height: 44rpx;
						}
					}

					.right {
						margin-left: 16rpx;
					}
				}

				.bottom {
					margin-top: 22rpx;

					text {
						font-size: 20rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
						line-height: 28rpx;
					}
				}
			}

			.item-type-1 {
				width: 700rpx;
				background: #FFFFFF;
				box-shadow: 0px 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
				border-radius: 24rpx;
				padding: 20rpx 24rpx 18rpx 22rpx;
				margin-top: 20rpx;
				margin-left: 25rpx;

				.left {
					flex: 1;
					margin-right: 34rpx;

					.title {
						font-size: 26rpx;
						font-weight: 400;
						color: #000000;
						line-height: 36rpx;
					}

					.bottom {
						font-size: 20rpx;
						font-weight: 400;
						color: #999999;
						line-height: 28rpx;
						margin-top: 12rpx
					}
				}

				;
			}
		}
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}
</style>
