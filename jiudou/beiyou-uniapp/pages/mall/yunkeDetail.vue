<template>
	<view class="page u-flex-col">
		<u-image width="750" height="498" :src="detail.ccourseCover">
			<u-loading slot="loading"></u-loading>
			<image slot="error" :src="require('@/static/images/img_error@2x.png')" style="width: 104rpx; height: 92rpx;"></image>
		</u-image>
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
							<view class="info u-flex-col">
								<view class="u-flex u-row-between">
									<text class="title">{{ detail.ccourseName }}</text>
									<image v-if="detail.isCollect == 1" :src="require('@/static/images/fav_hig@2x.png')" style="width: 38rpx; height: 38rpx" @tap.stop="report">
									</image>
									<image v-else :src="require('@/static/images/fav_nor@2x.png')" style="width: 38rpx; height: 38rpx" @tap.stop="report"></image>
								</view>
								<text class="subtitle">讲师：{{ detail.ccourseTeacherName }}</text>
								<view class="tag">
									<u-tag v-for="(tag, idx) in split(detail.ccourseTags)" :text="tag" mode="dark" bg-color="#F6F6F6" color="#888888" :key="idx" />
								</view>
								<view class="price">
									<text>{{ price(detail.ccoursePrice) }}</text>
								</view>
							</view>
							<view class="introduce u-flex-col">
								<text class="title">课程介绍</text>
								<u-parse :html="detail.ccourseIntroText"></u-parse>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item" style="background-color: white">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col u-col-center" v-if="detail && detail.catalog && detail.catalog.length !== 0">
							<view class="collapse">
								<three-choose :mulunum="detail.catalog" :fatherToInfo='fatherToInfo' @didSelect="didSelect"></three-choose>
							</view>
						</view>
						<u-empty text="暂无数据" mode="data" :show="detail && detail.catalog && detail.catalog.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: calc(100% - 124rpx); width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col u-col-center" v-if="list[2].dataList.length !== 0">
							<view class="evaluate u-flex-col">
								<view class="evaluate-item u-flex u-col-top" v-for="(item, index) in list[2].dataList" :key="index">
									<u-image width="68" height="68" :src="item.userPic" shape="circle">
										<u-icon slot="error" width="34" height="26" :name="require('@/static/images/mall_avatar_error@2x.png')" />
									</u-image>
									<view class="evaluate-item-right u-flex-col">
										<text class="name">{{ item.userName }}</text>
										<text class="content">{{ item.discussContent }}</text>
										<view class="u-flex u-row-between" style="width: 560rpx">
											<uni-dateformat class="date" :date="item.createTime" format="MM-dd hh-mm" />
											<view class="u-flex u-col-center">
												<view class="u-flex-col u-col-center" @click="reportA(item)">
													<image :src="require('@/static/images/mall_more@2x.png')" style="width: 32rpx; height: 8rpx; margin-right: 16rpx"></image>
												</view>
												<text :class="[item.isLike === 1 ? 'zan-h': 'zan']" @click="reportB(item)">{{ item.likeNum }}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<u-empty text="暂无数据" mode="data" :show="list[2].dataList.length === 0"></u-empty>
					</scroll-view>
					<view class="evaluate-bottom u-flex-col u-col-center" v-if="detail.isEnroll == 1">
						<u-button class="evaluate-bottom-button u-flex u-row-left" :hair-line="false"
							@click="goto(`/pages/mall/comment?discuss=0&obj=${JSON.stringify(obj)}&catalogUuid=${detail.catalog[0].catalogId}`)">
							<image style="width: 34rpx; height: 34rpx; margin-right: 28rpx;" :src="require('@/static/images/mall_comment@2x.png')"></image>
							<text>说点什么吧…</text>
						</u-button>
					</view>
				</swiper-item>
			</swiper>
			<view class="wrap-bottom" v-if="detail.isEnroll == 0">
				<view class="u-flex u-row-center u-row-between" style="height: 97rpx; width: 100%; padding: 0 44rpx">
					<view class="price">
						<text>{{ price(detail.ccoursePrice) }}</text>
					</view>
					<u-button class="button" :custom-style="info" :hair-line="false" @click="buy">
						{{detail.ccoursePrice === 0 ? '免费获取': '立即购买'}}
					</u-button>
				</view>
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
				fatherToInfo: {
					defaultIcon: "../../static/images/catalog_open@2x.png", //展开后图标
					currentIcon: "../../static/images/catalog_close@2x.png", //恢复后图标
					shoufenq: false, //一级下拉是否需要手风琴效果
					twoshoufenq: false, //二级下拉是否需要手风琴效果
				},
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
				info: {
					display: 'inline-flex',
					border: 'none'
				},
				list: [{
						name: '课程介绍',
						dataList: []
					},
					{
						name: '课程目录',
						dataList: []
					},
					{
						name: '评价',
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
			split(tags) {
				if ((tags ?? "") === "") return []
				return tags.split(',')
			},
			fetchData() {
				this.$u.post('/cloudCourse/detail', {
					cCourseId: this.obj.ccourseId
				}).then(response => {
					this.reset(response.catalog)
					this.detail = response;

					this.fetchReply()
				})
			},
			fetchReply() {
				if (this.detail?.catalog?.length === 0) return;

				this.$u.post('/cloudCourse/discuss/listWithReplyByPage', {
					cCourseUuid: this.obj.ccourseUuid,
					catalogUuid: this.detail.catalog[0].catalogId,
					page: this.list[2].page,
					pageSize: 10
				}).then(response => {
					if (this.list[2].page === 1) this.list[2].dataList = response.data;
					else this.list[2].dataList.push(...response.data);

					this.list[2].page += 1;
					this.list[2].status = (response.data ?? []).length < 10 ? 'nomore' : 'loading'
				})
			},
			// 评价举报
			reportA(obj) {
				console.log(obj);
				let that = this;
				uni.showActionSheet({
					itemList: ['举报'],
					success: function(res) {
						console.log(res)
						if (res.tapIndex === 0) {
							obj.id = obj.discussId;
							obj.content = obj.discussContent;
							that.goto(`/pages/mall/report?obj=${JSON.stringify(obj)}&type=14`)
						}
					},
				})
			},
			// 点赞
			reportB(obj) {
				console.log(obj);
				uni.showLoading()
				this.$u.post('/cloudCourse/discuss/like', {
					discussId: obj.discussId
				}).then(response => {
					if (obj.isLike === 1) {
						obj.likeNum -= 1;
						obj.isLike = 0;
					} else {
						obj.likeNum += 1;
						obj.isLike = 1;
					}
				}).finally(() => {
					uni.hideLoading()
				})
			},
			// 收藏
			report() {
				let url;
				if (this.detail.isCollect == 1) url = '/user/collection/cancelCollect';
				else url = '/user/collection/addCollection';

				uni.showLoading({});
				this.$u.post(url, {
					resId: this.obj.ccourseId,
					type: 6
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
				if (info.platform === 'ios' && this.detail.ccoursePrice > 0) {
					this.$u.toast('请使用安卓手机购买');
					return;
				}

				uni.showLoading({});
				this.$u.post('/nOrder/buyCCourse', {
					cCourseUuid: this.obj.ccourseUuid,
					os: info.platform === 'ios' ? 'iOS' : 'android'
				}).then(response => {
					console.log(response);
					if (this.detail.ccoursePrice > 0) {
						this.goto(
							`/pages/mall/payment?obj=${JSON.stringify(this.obj)}&paymentInfo=${JSON.stringify(response)}&ebook=0`
						)
					} else {
						this.detail.isEnroll = 1;
						this.$u.toast('购买成功');
					}
				}).finally(() => {
					uni.hideLoading()
				})
			},
			reset(array) {
				array.forEach(item => {
					if (item.hasOwnProperty('catalogUrl') && item.catalogUrl.length === 0 && (item.catalog ?? [])
						.length > 0) {
						item.open = false;
						item.cataList = item.catalog;
						this.reset(item.catalog);
					}
				})
			},
			// 目录选中
			didSelect(item) {
				// catalogSubType 1音频 2视频 8测试任务 9pdf
				if (this.detail.isEnroll == 0) {
					this.$u.toast('请购买后学习');
					return;
				}

				if (item.catalogSubType === 8) {
					let params = {
						id: item.catalogId,
						catalogUuid: item.catalogUuid
					};
					this.goto(`/pages/bookshelf/test?obj=${JSON.stringify(params)}&type=2`)
				} else if (item.catalogSubType === 2) {
					this.goto(`/pages/mall/video?url=${item.catalogUrl}&catalogUuid=${item.catalogUuid}&cCourseUuid=${this.detail.ccourseUuid}&title=${item.catalogName}`);
				} else {
					this.goto(`/pages/webview/webview?url=${item.catalogUrl}`)
				}

				this.$u.get('/cloudCourse/startStudy', {
					cCourseUuid: this.detail.ccourseUuid,
					catalogUuid: item.catalogUuid,
				}).then(response => {
					this.$u.toast('学习成功');
				}).catch(error => {
					// this.$u.toast(error.msg);
				})
			},
			reachBottom() {
				// 此tab为空数据
				if (this.swiperCurrent === 2 && this.list[2].status === 'loading') {
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
			if (!this.obj.hasOwnProperty('ccourseId')) {
				this.obj.ccourseId = this.obj.linkId;
				this.obj.ccourseCover = this.obj.coverPic;
			}
			this.fetchData()
			// this.fetchReply()

			uni.$on('commit', () => {
				this.list[2].page = 1;
				this.fetchReply()
			});
			uni.$on('buy', () => {
				this.detail.isEnroll = 1;

				this.$u.get('/cloudCourse/startStudy', {
					cCourseUuid: this.detail.ccourseUuid,
					catalogUuid: this.detail.catalog[0].catalogUuid,
				})
			})
		},
		onUnload() {
			uni.$off('commit');
			uni.$off('buy');
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

	::v-deep .u-scroll-bar {
		bottom: 0 !important;
	}

	::v-deep .u-mode-light-primary {
		border: initial;
	}

	::v-deep .u-tabs-scroll-box {
		border-bottom: solid 2rpx #E7EBF2;
		margin: 0 28rpx;
	}

	.wrap {
		display: flex;
		flex-direction: column;
		// height: calc(100vh - var(--window-top) - 498rpx);
		height: calc(100vh - 498rpx - env(safe-area-inset-bottom));
		width: 100%;

		.page_box {
			background-color: #F8F8F7;

			.info {
				background-color: white;
				width: 100%;
				padding: 40rpx 48rpx;

				.title {
					font-size: 36rpx;
					font-weight: 600;
					color: #000000;
					line-height: 32rpx;
				}

				.subtitle {
					margin-top: 14rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #666666;
					line-height: 34rpx;
				}

				.tag {
					margin-top: 12rpx;
				}
			}

			.introduce {
				margin-top: 16rpx;
				padding: 20rpx 48rpx;
				background-color: white;

				.title {
					font-size: 30rpx;
					font-weight: 500;
					color: #121212;
					line-height: 42rpx;
					margin-bottom: 22rpx;
				}
			}

			.collapse {
				background-color: white;
				width: 100%;
				padding: 20rpx 25rpx;
			}

			// 评论
			.evaluate {
				margin: 30rpx 0;
				background: #FFFFFF;
				box-shadow: 0px 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
				border-radius: 24rpx;

				.evaluate-item {
					padding: 38rpx 26rpx 26rpx 26rpx;
					border-bottom: solid 1rpx #E7EBF2;

					.evaluate-item-right {
						flex: 1;
						margin-left: 16rpx;

						.name {
							font-size: 28rpx;
							font-weight: 500;
							color: #666666;
							line-height: 40rpx;
						}

						.content {
							margin-top: 8rpx;
							font-size: 26rpx;
							font-weight: 400;
							color: #333333;
							line-height: 36rpx;
						}

						.date {
							font-size: 22rpx;
							font-weight: 400;
							color: #999999;
							line-height: 32rpx;
						}

						.zan {
							font-size: 22rpx;
							font-weight: 400;
							color: #666666;

							&::before {
								width: 20rpx;
								height: 22rpx;
								content: '';
								display: inline-block;
								background: url("@/static/images/mall_zan@2x.png");
								background-size: 20rpx 22rpx;
								margin-right: 6rpx;
							}
						}

						.zan-h {
							font-size: 22rpx;
							font-weight: 400;
							color: #666666;

							&::before {
								width: 20rpx;
								height: 22rpx;
								content: '';
								display: inline-block;
								background: url("@/static/images/mall_zan_heightlight@2x.png");
								background-size: 20rpx 22rpx;
								margin-right: 6rpx;
							}
						}
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

	.evaluate-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		background: white;
		width: 100%;
		height: calc(124rpx);

		.evaluate-bottom-button {
			width: 700rpx;
			height: 80rpx;
			background: #F7F8F9;
			border-radius: 12rpx;
			margin-top: 20rpx;
			border: 0 !important;
		}
	}
</style>
