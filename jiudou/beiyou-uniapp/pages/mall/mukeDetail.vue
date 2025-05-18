<template>
	<view classs="page u-flex-col">
		<u-image width="750" height="420" :src="obj.cover">
			<u-loading slot="loading"></u-loading>
			<image slot="error" :src="require('@/static/images/img_error@2x.png')" style="width: 104rpx; height: 92rpx;"></image>
		</u-image>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper ref="uTabs" :current="current" :list="list" :is-scroll="false" :bar-style="barStyle"
					:bar-height="80" :bar-width="150" font-size="30" inactive-color="#666"
					:active-item-style="activeItemStyle" swiper-width="750" bg-color="#fff" @change="change">
				</u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%; width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col u-col-center">
							<view class="info u-flex-col">
								<text class="title">{{ obj.name }}</text>
								<text class="subtitle">老师：{{ obj.teacherName }}</text>
								<text class="date">
									课程时间：
									<uni-dateformat :date="obj.startTime" format="yyyy-MM-dd "></uni-dateformat>至
									<uni-dateformat :date="obj.startTime" format=" yyyy-MM-dd"></uni-dateformat>
								</text>
							</view>
							<view class="introduce u-flex-col">
								<text class="title">课程介绍</text>
								<u-parse :html="obj.introText"></u-parse>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col u-col-center">
							<view class="collapse">
								<text class="title">目录（共{{ list[1].dataList.length }}章）</text>
								<three-choose :mulunum="list[1].dataList" :fatherToInfo='fatherToInfo'
									@didSelect="didSelect"></three-choose>
							</view>
						</view>
						<u-empty text="暂无数据" mode="data" :show="list[1].dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col u-col-center">
							<view class="collapse">
								<text class="title">测验目录（共{{ list[2].dataList.length }}项测验）</text>
								<view class="test u-flex-col u-row-center" v-for="(item, index) in list[2].dataList"
									:key="index" @click="goto(`/pages/mall/testDetail?obj=${JSON.stringify(item)}`)">
									<view class="u-flex u-col-center u-row-between">
										<text>{{ item.name }}</text>
										<image style="width: 14rpx; height: 24rpx"
											:src="require('@/static/images/arrow@2x.png')"></image>
									</view>
								</view>
							</view>
						</view>
						<u-empty text="暂无数据" mode="data" :show="list[2].dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col u-col-center">
							<discuss :key="timer" :course-id="obj.id"></discuss>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: calc(100% - 124rpx); width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col u-col-center">
							<view class="evaluate">
								<view class="evaluate-item u-flex u-col-top" v-for="(item, index) in list[4].dataList"
									:key="index">
									<u-image width="68" height="68" :src="item.memberPic" shape="circle">
										<u-icon slot="error" width="34" height="26" :name="require('@/static/images/mall_avatar_error@2x.png')" />
									</u-image>
									<view class="evaluate-item-right u-flex-col">
										<text class="name">{{ item.memberName }}</text>
										<text class="content">{{ item.content }}</text>
										<view class="u-flex u-row-between" style="width: 560rpx">
											<uni-dateformat class="date" :date="item.createTime" format="MM-dd hh-mm" />
											<view class="u-flex u-col-center">
												<view class="u-flex-col u-col-center" @click="reportA(item)">
													<image :src="require('@/static/images/mall_more@2x.png')"
														style="width: 32rpx; height: 8rpx; margin-right: 16rpx"></image>
												</view>
												<text :class="[item.isLike === 1 ? 'zan-h': 'zan']"
													@click="reportB(item)">{{ item.likeNum }}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<u-empty text="暂无数据" mode="data" :show="list[4].dataList.length === 0"></u-empty>
					</scroll-view>
					<view class="evaluate-bottom u-flex-col u-col-center">
						<u-button class="evaluate-bottom-button u-flex u-row-left" :hair-line="false"
							@click="goto(`/pages/mall/comment?discuss=0&obj=${JSON.stringify(obj)}`)">
							<image style="width: 34rpx; height: 34rpx; margin-right: 28rpx;"
								:src="require('@/static/images/mall_comment@2x.png')"></image>
							<text>说点什么吧…</text>
						</u-button>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import UImage from "../../uview-ui/components/u-image/u-image";
	import UniDateformat from "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat";
	import UButton from "../../uview-ui/components/u-button/u-button";
	import discuss from "./components/discuss";
	import {
		mixin
	} from "@/common/mixin"
	import UPopup from "../../uview-ui/components/u-popup/u-popup";
	export default {
		components: {
			UPopup,
			UButton,
			UniDateformat,
			UImage,
			discuss
		},
		mixins: [mixin],
		data() {
			return {
				timer: '',
				fatherToInfo: {
					defaultIcon: "../../static/images/catalog_open@2x.png", //展开后图标
					currentIcon: "../../static/images/catalog_close@2x.png", //恢复后图标
					shoufenq: false, //一级下拉是否需要手风琴效果
					twoshoufenq: false, //二级下拉是否需要手风琴效果
				},

				obj: null,
				barStyle: {
					"font-weight": "500",
					"z-index": '-1',
					"background-color": '#99C0F9',
					"border-radius": '0'
				},
				activeItemStyle: {
					"font-size": "30rpx",
					"color": "#fff",
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
				subheadStyle: {
					'height': '78rpx',
					'margin': '0 22rpx',
					'font-size': '26rpx',
					'font-weight': '400',
					'color': '#333333',
					'border-bottom': '2rpx solid #E7EBF2',
					'line-height': '78rpx’'
				},

				keyword: "",
				list: [{
						name: '课程介绍',
						dataList: []
					},
					{
						name: '课程目录',
						dataList: []
					},
					{
						name: '测验',
						dataList: []
						// count: 12
					},
					{
						name: '讨论',
						dataList: [],
						status: 'loading'
						// count: 12
					},
					{
						name: '评价',
						dataList: [],
						status: 'loading'
						// count: 12
					}
				],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0
			};
		},
		onLoad(option) {
			this.obj = JSON.parse(option.obj)
			// this.fetchData(0)
			this.fetchData(1)
			this.fetchData(2)
			this.fetchData(4)
			uni.$on('commit', () => {
				this.fetchData(4)
			});
			uni.$on('ok', () => {
				this.timer = new Date().getTime()
			});
		},
		onUnload() {
			uni.$off('commit');
			uni.$off('ok');
		},
		computed: {

		},
		methods: {
			reachBottom() {
				// 此tab为空数据
				if (this.current === 4) {
					if (this.list[this.current].current === this.list[this.current].pages) return;

					setTimeout(() => {
						this.fetchData(this.current, this.list[this.current].current + 1);
					}, 1200);
				}
			},
			// idx 为tab序号
			fetchData(idx, page = 1) {
				let url;
				let params;
				switch (idx) {
					case 1:
					case 2:
						url = '/openccourse/ccourseCatalog/listCatalog';
						params = {
							courseId: this.obj.id
						};
						if (idx === 2) {
							params.subType = 3;
						}
						break;
					case 4:
						url = '/openccourse/openDiscuss/list';
						params = {
							courseId: this.obj.id,
							pageNo: 1,
							pageSize: 10
						};
						break;
				}
				this.$u.post(url, params).then(response => {
					if (idx === 4) {
						this.list[idx].current = response.current;
						this.list[idx].pages = response.pages;
						if (response.current === 1) {
							this.list[idx].dataList = response.records;
						} else {
							this.list[idx].dataList.push(...response.records)
						}

						this.list[idx].status = response.current === response.pages ? 'nomore' : 'loading';
					} else {
						if (idx === 1) {
							this.reset(response)
						}
						this.list[idx].dataList = response;
					}
				})
			},
			reset(array) {
				array.forEach(item => {
					if ((item.leafObj ?? '' === '') && (item.cataList ?? []).length > 0) {
						item.open = false;
						this.reset(item.cataList);
					}
				})
			},
			// 评价举报
			reportA(obj) {
				let that = this;
				uni.showActionSheet({
					itemList: ['举报'],
					success: function(res) {
						console.log(res)
						if (res.tapIndex === 0) {
							that.goto(`/pages/mall/report?obj=${JSON.stringify(obj)}`)
						}
					},
				})
			},
			// 目录选中
			didSelect(item) {
				// 子类型  1音频 2视频 3测试任务 9PDF
				switch (item.subType){
					case 1:
					case 2:
					case 9:
						this.goto(`/pages/webview/webview?url=${item.leafObj}`)
						break;
					default:
						break;
				}
				console.log(item)
			},
			// 点赞
			reportB(obj) {
				uni.showLoading()
				this.$u.post('/openccourse/openDiscuss/praise', {
					discussId: obj.id
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
			collapseTapped(obj) {
				// uni.navigateTo({
				// 	url: '/pages/mall/video'
				// });
			},
			collapseChange() {
				// this.$forceUpdate();
				this.$nextTick(() => this.$refs.collapse.init())
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
	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top) - 420rpx);
		width: 100%;
		//padding-bottom: env(safe-area-inset-bottom);

		.page_box {
			background-color: #F8F8F7;
			margin: 0rpx 26rpx;

			.info {
				margin-top: 30rpx;
				width: 698rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.05);
				border-radius: 24rpx;
				padding: 36rpx 24rpx;

				.title {
					font-size: 36rpx;
					font-weight: 600;
					color: #000000;
				}

				.subtitle {
					font-size: 24rpx;
					font-weight: 400;
					color: #666666;
					margin-top: 10rpx;
				}

				.date {
					margin-top: 18rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #666666;
				}
			}

			.introduce {
				color: black;
				font-size: 32rpx;
				line-height: 1.8;
				margin-top: 18rpx;
				padding: 32rpx 24rpx;

				width: 698rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.05);
				border-radius: 24rpx;
			}

			.collapse {
				margin-top: 30rpx;
				width: 698rpx;
				background: white;
				box-shadow: 0 4rpx 16rpx 0 rgba(0, 0, 0, 0.05);
				border-radius: 24rpx;
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

			.discuss-bottom {
				position: fixed;
				bottom: 0;
				left: 0;
				background: white;
				width: 100%;
				height: calc(124rpx + env(safe-area-inset-bottom));

				.discuss-bottom-button {
					width: 700rpx;
					height: 80rpx;
					background: #F7F8F9;
					border-radius: 12rpx;
					margin-top: 20rpx;
					border: 0 !important;
				}
			}

			.test {
				height: 86rpx;
				background: #F7F8FC;
				border-radius: 20rpx;
				margin: 10rpx 0;
				padding: 0 22rpx;
				color: black;
				font-weight: bold;
				font-size: 28rpx;
			}

			// 评论
			.evaluate {
				margin: 30rpx 0;
				background: #FFFFFF;
				box-shadow: 0px 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
				border-radius: 24rpx;
				overflow: hidden;

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
	}
	
	.evaluate-bottom {
		position: fixed;
		bottom: env(safe-area-inset-bottom);
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

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	.more {
		height: 112rpx;
	}

	.pop {
		.head {
			height: 110rpx;
			margin: 0 38rpx;

			text:nth-child(2) {
				font-size: 36rpx;
				font-weight: 500;
				color: #121212;
				line-height: 50rpx;
			}

			text:nth-child(3) {
				font-size: 32rpx;
				font-weight: 500;
				color: #367AE7;
				line-height: 44rpx;
			}
		}

		.content {
			width: 700rpx;
			height: 132rpx;
			background: #F7F8F9;
			border-radius: 12rpx;
			margin-left: 25rpx;
		}
	}

	::v-deep .u-field {
		padding: 11px 0px;

		.u-label {
			flex: 0 0 0 !important;
		}
	}
</style>
