<template>
	<view class="page">
		<view class="wrap u-flex-col u-col-center">
			<view class="head u-flex-col">
				<text class="title">{{obj.title}}</text>
				<text class="head-content">{{obj.content}}</text>
				<view class="head-bottom u-flex u-row-between">
					<text class="name">{{obj.memberName + "  "}}
						<uni-dateformat :date="obj.createTime" format="MM-dd hh-mm" />
					</text>
					<view class="u-flex u-row-center">
						<text :class="[obj.isLike === 1 ? 'zan-h': 'zan']"
							@tap.stop="reportB(obj)">{{ obj.likeNum }}</text>
						<image :src="require('@/static/images/mall_reply@2x.png')"
							style="width: 20rpx; height: 22rpx; margin-left: 38rpx;"></image>
						<text class="reply">{{ obj.replyNum }}</text>
					</view>
				</view>
			</view>
			<view class="content u-flex-col">
				<scroll-view scroll-y style="width: 100%; height: 100%;" @scrolltolower="reachBottom">
					<view class="page-box u-flex-col u-col-center">
						<view class="discuss-item u-flex u-col-top" v-for="(item, index) in dataList" :key="item.id">
							<u-image width="68" height="68" :src="item.memberPic" shape="circle">
								<image slot="error" :src="require('@/static/images/mall_avatar_error@2x.png')" style="width: 104rpx; height: 92rpx;"></image>
							</u-image>
							<view class="discuss-item-right u-flex-col" style="margin-left: 16rpx">
								<text class="name">{{ item.memberName }}</text>
								<text class="discuss-content">{{ item.content }}</text>
								<view class="u-flex u-row-between" style="width: 560rpx" @click="reportA(item)">
									<uni-dateformat class="date" :date="item.createTime" format="MM-dd hh-mm" />
									<view class="u-flex u-col-center">
										<view class="u-flex-col u-col-center" @tap.stop="reportC(item)">
											<image :src="require('@/static/images/mall_more@2x.png')"
												style="width: 32rpx; height: 8rpx; margin-right: 16rpx"></image>
										</view>
										<text :class="[item.isLike === 1 ? 'zan-h': 'zan']"
											@tap.stop="reportB(item)">{{ item.likeNum }}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="bottom u-flex-col u-col-center">
							<u-button class="bottom-button u-flex u-row-left" :hair-line="false"
								@click="goto(`/pages/mall/yunkeComment?obj=${JSON.stringify(obj)}`)">
								<image style="width: 34rpx; height: 34rpx; margin-right: 28rpx;"
									:src="require('@/static/images/mall_comment@2x.png')"></image>
								<text>说点什么吧…</text>
							</u-button>
						</view>
						<u-loadmore v-if="dataList && dataList.length !== 0" :status="status" bgColor="#fff">
						</u-loadmore>
					</view>
					<u-empty text="暂无任何评论~" :src="require('@/static/images/mall_discuss_empty@2x.png')" icon-size="398"
						:show="dataList.length === 0"></u-empty>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import UniDateformat from "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat";
	import {
		mixin
	} from "@/common/mixin"
	export default {
		components: {
			UniDateformat,
		},
		mixins: [mixin],
		data() {
			return {
				obj: null,
				headHeight: 0,
				dataList: [],
				page: 0,
				status: 'nomore'
			};
		},
		methods: {
			fetchData() {
				this.$u.post('/openccourse/openDiscuss/listSecondDiscuss', {
					courseId: this.obj.courseId,
					replyId: this.obj.id,
					typeId: this.obj.typeId,
					pageSize: 10,
					pageNo: this.page + 1,
				}).then(response => {
					if (response.current === 1) {
						this.dataList = response.records;
					} else this.dataList.push(...response.records)
					
					this.page = response.current;
					this.status = response.size * response.current < response.total ? "loading" : "nomore";
				})
			},
			reachBottom() {
				// this.fetchData();
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
			// 举报
			reportC(obj) {
				let that = this;
				if (obj.uid === uni.getStorageSync('uid')) {
					uni.showActionSheet({
						itemList: ['删除'],
						success: function(res) {
							if (res.tapIndex === 0) {
								uni.showLoading()
								that.$u.post('/openccourse/openDiscuss/delete', {
									id: obj.id
								}).then(response => {
									that.page = 0;
									that.fetchData()
									
									uni.showToast({
										title: "删除成功"
									})
								}).finally(() => {
									uni.hideLoading()
								})
							}
						},
					})
				} else {
					uni.showActionSheet({
						itemList: ['举报'],
						success: function(res) {
							console.log(res)
							if (res.tapIndex === 0) {
								that.goto(`/pages/mall/report?obj=${JSON.stringify(obj)}`)
							}
						},
					})
				}
			}
		},
		onLoad(option) {
			this.obj = JSON.parse(option.obj);
			console.log(this.obj);
			uni.$on('commit', () => {
				this.fetchData()
			})
		},
		onUnload() {
			uni.$off('commit');
		}
	}
</script>

<style lang="scss">
	.wrap {
		height: calc(100vh - var(--window-top) - 124rpx - env(safe-area-inset-bottom));

		.head {
			margin-top: 10rpx;
			width: 698rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			padding: 30rpx 26rpx;

			&-content {
				font-size: 26rpx;
				font-weight: 400;
				color: #666666;
				line-height: 36rpx;
			}

			&-bottom {
				margin-top: 14rpx;

				.name {
					font-size: 22rpx;
					font-weight: 400;
					color: #999999;
					line-height: 32rpx;
				}
			}
		}

		.title {
			font-size: 28rpx;
			font-weight: 500;
			color: #000000;
			line-height: 40rpx;
		}

		.content {
			width: 100%;
			flex: 1;
			margin-top: 12rpx;

			.page-box {
				width: 700rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				margin-left: 25rpx;
				overflow: hidden;

				.discuss-item {
					padding: 38rpx 26rpx 26rpx 26rpx;
					background-color: white;
					width: 100%;

					.discuss-item-right {
						width: 560rpx;
						.name {
							font-size: 28rpx;
							font-weight: 500;
							color: #000000;
							line-height: 40rpx;
						}

						.discuss-content {
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

				}
			}
		}

		.bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			background: white;
			width: 100%;
			height: calc(124rpx + env(safe-area-inset-bottom));

			.bottom-button {
				width: 700rpx;
				height: 80rpx;
				background: #F7F8F9;
				border-radius: 12rpx;
				margin-top: 20rpx;
				border: 0 !important;
			}
		}

		.zan {
			font-size: 22rpx;
			font-weight: 400;
			color: #666666;
			line-height: 32rpx;

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
			line-height: 32rpx;

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
</style>
