<template>
	<view class="wrap">
		<view class="u-tabs-box">
			<u-tabs-swiper ref="tabs" :current="current" :list="dataList" :is-scroll="false" :bar-style="barStyle"
				:bar-height="38" :bar-width="50" font-size="28" inactive-color="#999"
				:active-item-style="activeItemStyle" swiper-width="750" bg-color="#fff" @change="change">
			</u-tabs-swiper>
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(each, idx) in dataList" :key="idx">
				<scroll-view scroll-y style="width: 100%; height: 100%;" @scrolltolower="reachBottom">
					<view class="page-box u-flex-col u-col-center">
						<view class="discuss-item u-flex-col" v-for="(item, index) in each.dataList":key="item.id" @click="reportA(item)">
							<text class="name">{{ item.title }}</text>
							<text class="content">{{ item.content }}</text>
							<view class="u-flex u-row-between" style="width: 100%; margin-top: 14rpx;">
								<uni-dateformat class="date" :date="item.createTime" format="MM-dd hh-mm" />
								<view class="u-flex u-col-center">
									<text :class="[item.isLike === 1 ? 'zan-h': 'zan']" @tap.stop="reportB(item)">{{ item.likeNum }}</text>
									<view class="u-flex u-row-center">
										<image :src="require('@/static/images/mall_reply@2x.png')" style="width: 20rpx; height: 22rpx; margin-left: 38rpx;"></image>
										<text class="reply">{{ item.replyNum }}</text>
									</view>
								</view>
							</view>
						</view>
						<u-loadmore v-if="each.dataList && each.dataList.length !== 0" :status="each.status" bgColor="#fff"></u-loadmore>
					</view>
					<u-empty text="说出你的见解一起讨论吧~" :src="require('@/static/images/mall_discuss_empty@2x.png')" icon-size="398" :show="each.dataList && each.dataList.length === 0"></u-empty>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="discuss-bottom u-flex-col u-col-center">
			<u-button class="discuss-bottom-button u-flex u-row-left" :hair-line="false"
				@click="goto(`/pages/mall/topical?list=${JSON.stringify(dataList)}&idx=${current}&courseId=${courseId}`)">
				<image style="width: 34rpx; height: 34rpx; margin-right: 28rpx;"
					:src="require('@/static/images/mall_comment@2x.png')"></image>
				<text>说点什么吧…</text>
			</u-button>
		</view>
	</view>
</template>

<script>
	import {
		mixin
	} from "@/common/mixin"
	export default {
		name: "discuss",
		mixins: [mixin],
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

				dataList: [],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],
				menu: []
			}
		},
		methods: {
			reachBottom() {
				// 此tab为空数据
				if (this.current != 2) {
					this.loadStatus.splice(this.current, 1, "loading")
					setTimeout(() => {
						this.fetchData(this.current);
					}, 1200);
				}
			},
			// 页面数据
			fetchData(idx) {
				let params = {
					courseId: this.courseId,
					typeId: this.dataList[idx].id,
					pageSize: 10,
					pageNo: 1
				}
				console.log(params)
				this.$u.post('/openccourse/openDiscuss/listDiscuss', params).then(response => {
					// this.dataList[idx] =
					// 当前已选答案
					// let selctedValue = this.swiperList[this.swiperIndex].answers[index].option;
					this.$set(this.dataList[idx], "dataList", response.records);
					this.$set(this.dataList[idx], "current", response.current);
					this.$set(this.dataList[idx], "status", response.current * response.total >= response.total ? 'nomore' : 'loading');
					console.log(this.dataList)
				})

				this.loadStatus.splice(this.current, 1, "loadmore")
			},
			reportA(obj) {
				this.goto(`/pages/mall/topicalDetail?obj=${JSON.stringify(obj)}`)
			},
			// 点赞
			reportB(obj) {
				uni.showLoading()
				this.$u.post('/openccourse/openDiscuss/praise', {
					discussId: obj.id
				}).then(response => {
					console.log(obj);
					obj.isLike = (obj.isLike || 0) === 0 ? 1 : 0;
					if (obj.isLike === 1) {
						obj.likeNum += 1; 
					} else {
						obj.likeNum -= 1;
					}
					uni.showToast({
						title: obj.isLike === 1 ? "点赞成功" : "点赞取消成功"
					})
				}).finally(() => {
					uni.hideLoading()
				})
				//
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				this.fetchData(index);
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			}
		},
		watch: {
			courseId: {
				immediate: true,
				handler(newVal, oldVal) {
					if (newVal === oldVal) return;

					this.$u.post('/openccourse/openDiscussType/list', {
						courseId: newVal
					}).then(response => {
						// this.$set(this, "dataList", response.records);
						// console.log(this.dataList)
						this.dataList = response.records;
						this.dataList.forEach((each, idx) => {
							this.fetchData(idx)
						})
					})
				}
			}
		},
		props: {
			courseId: {
				type: Number,
				required: true
			}
		},
		onShow() {
			console.log('1212');
		},
		onLoad() {
			this.fetchData(this.swiperCurrent);
			uni.$on('ok', (data) => {
				this.fetchData(this.swiperCurrent);
			})
		},
		onUnload() {
			uni.$off('ok');
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-scroll-bar {
		background: url(@/static/images/bookshelf_check@2x.png) no-repeat -2rpx -12rpx;
		background-size: 46rpx 36rpx;
		background-color: rgba(220, 20, 60, 0.0) !important;
	}

	::v-deep .u-search {
		padding: 10rpx 26rpx 0 26rpx !important;
	}

	::v-deep .u-tabs-item {
		font-weight: bold !important;
	}

	::v-deep .u-image__image {
		background: #D8D8D8;
		overflow: hidden;
	}

	::v-deep .u-size-default {
		padding: 4rpx 16rpx !important;
		line-height: 34rpx !important;
	}

	.wrap {
		display: flex;
		flex-direction: column;
		// height: calc(100vh - var(--window-top) - 500rpx) !important;
		height: calc(100vh - var(--window-top) - 680rpx) !important;
		width: 100%;
		margin-top: 30rpx;
		
		box-shadow: 0px 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
		border-radius: 24rpx;
		overflow: hidden;
		background-color: white;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	.discuss-item {
		padding: 38rpx 26rpx 26rpx 26rpx;
		background-color: white;
		width: 100%;

		.name {
			font-size: 28rpx;
			font-weight: 500;
			color: #000000;
			line-height: 40rpx;
		}
		
		.content {
			margin-top: 8rpx;
			font-size: 26rpx;
			font-weight: 400;
			color: #666666;
			line-height: 36rpx;
		}
		
		.date {
			font-size: 22rpx;
			font-weight: 400;
			color: #999999;
			line-height: 32rpx;
			margin-top: 14rpx;
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
		.reply {
			margin-left: 6rpx;
			font-size: 22rpx;
			font-weight: 400;
			color: #666666;
			line-height: 32rpx;
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
</style>
