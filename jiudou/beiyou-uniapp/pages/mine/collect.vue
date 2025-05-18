<template>
	<view class="page">
		<view class="wrap u-flex-col u-col-center">
			<scroll-view scroll-y enable-back-to-top style="height: 100%; width: 100%;" @scrolltolower="reachBottom">
				<view class="u-flex" v-for="(item, index) in dataList" :key="index" @click="didSelectedItem(item)">
					<view v-if="editing" class="select-normal u-flex-col u-col-center u-row-center" :class="{'select-active': 1 }">
						<u-icon v-if="includes(item.collectId)" :name="require('@/static/select@2x.png')" size="38"></u-icon>
						<u-icon v-else :name="require('@/static/unselect@2x.png')" size="38"></u-icon>
					</view>
					<view class="goods-item1 u-flex">
						<view class="u-flex u-col-center" v-if="item.type === 6">
							<view>
								<u-image width="240" height="180" borderRadius="8" :src="item.ccourseModel.ccourseCover"
									shape="square">
									<u-loading slot="loading"></u-loading>
									<image slot="error" :src="require('@/static/images/img_error@2x.png')"
										style="width: 104rpx; height: 92rpx;;"></image>
								</u-image>
							</view>
							<view class="u-flex-col" style="margin-left: 26rpx; height: 184rpx;">
								<text class="u-line-2" style="margin-top: 0;">{{ item.ccourseModel.ccourseName }}</text>
							</view>
						</view>
						<view class="u-flex u-col-center" v-else-if="item.type === 7">
							<view>
								<u-image width="140" height="184" borderRadius="8" :src="item.ebookModel.coverPic"
									shape="square">
									<u-loading slot="loading"></u-loading>
									<image slot="error" :src="require('@/static/images/img_error@2x.png')"
										style="width: 104rpx; height: 92rpx;;"></image>
								</u-image>
							</view>
							<view class="u-flex-col" style="margin-left: 26rpx; height: 184rpx;">
								<text class="u-line-2" style="margin-top: 0;">{{ item.ebookModel.tname }}</text>
								<text style="flex: 1; margin-top: 14rpx;">{{ item.pubName }}</text>
							</view>
						</view>
						<view class="u-flex u-col-center" v-else-if="item.type === 1">
							<view>
								<u-image width="140" height="184" borderRadius="8" :src="item.bookModel.cover"
									shape="square">
									<u-loading slot="loading"></u-loading>
									<image slot="error" :src="require('@/static/images/img_error@2x.png')"
										style="width: 104rpx; height: 92rpx;;"></image>
								</u-image>
							</view>
							<view class="u-flex-col" style="margin-left: 26rpx; height: 184rpx;">
								<text class="u-line-2" style="margin-top: 0;">{{ item.bookModel.textbookName }}</text>
								<text style="flex: 1; margin-top: 14rpx;">{{ item.bookModel.pubName }}</text>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore v-if="dataList.length > 0" :status="status"></u-loadmore>
				<u-empty text="暂无数据" mode="data" :show="dataList.length === 0"></u-empty>
			</scroll-view>
			<view class="bottom u-flex-col" v-if="editing">
				<view class="tips">已选<text>{{selectedIds.length}}</text>项</view>
				<view class="u-flex u-row-between">
					<view class="u-flex select-all u-row-center" @click.stop="selectAll">
						<u-icon v-if="selectedIds.length === dataList.length" :name="require('@/static/select@2x.png')" mode="" width="36" height="36"></u-icon>
						<u-icon v-else :name="require('@/static/unselect@2x.png')" mode="" width="36" height="36"></u-icon>
						<text>全选</text>
					</view>
					<view class="button" @click.stop="commit">取消收藏</view>
				</view>
			</view>
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
				// 类型，0收藏资源 1收藏书籍 2收藏习题 3 收藏发现文章 6 云课 7 电子书
				dataList: [],
				status: 'loading',
				page: 1,
				editing: false,
				selectedIds: [],	// 
			};
		},
		methods: {
			onNavigationBarButtonTap: function(e) {
				console.log('点击了右上角按钮')
				if (e.index === 0) {
					this.editing = !this.editing;
					
					// #ifdef APP-PLUS
					const currentWebview = this.$mp.page.$getAppWebview();
					currentWebview.setTitleNViewButtonStyle(e.index, {
						text: this.editing ? '完成' : '管理'
					});
					// #endif
				}
			},
			fetchData() {
				this.$u.post('/nUser/collections', {
					page: this.page,
					pageSize: 10
				}).then(response => {
					if (this.page === 1) this.dataList = response;
					else this.dataList.push(...response);

					this.status = response.length >= 10 ? 'loading' : 'nomore';
					this.page += 1;
				})
			},
			commit() {
				if (this.selectedIds.length === 0) {
					return;
				}
				
				uni.showLoading({});
				this.$u.post('/nUser/cancelCollect', {
					collectIds: this.selectedIds.toString()
				}).then(response => {
					this.page = 1
					this.fetchData()
				}).finally(() => {
					uni.hideLoading()
				})
			},
			includes(val) {
				return this.selectedIds.includes(val)
			},
			reachBottom() {
				this.fetchData()
			},
			selectAll() {
				if (this.selectedIds.length === this.dataList.length) this.selectedIds = []
				else {
					let array = []
					this.dataList.forEach(item => {
						array.push(item.collectId)
					});
					this.selectedIds = array;
				}
			},
			didSelectedItem(item) {
				if (this.editing) {
					if (this.selectedIds.includes(item.collectId))  {
 						var index = this.selectedIds.indexOf(item.collectId)
						if (index > -1) this.selectedIds.splice(index, 1);
					} else this.selectedIds.push(item.collectId)
					return;
				}
				switch(item.type) {
					case 1:
					this.goto(`/pages/mall/textbookDetail?obj=${JSON.stringify(item.bookModel)}`)
					break;
					case 6:
					// 数据太多，传不过去
					delete item.ccourseModel.ccourseIntroText;
					this.goto(`/pages/mall/yunkeDetail?obj=${JSON.stringify(item.ccourseModel)}`)
					break;
					case 7:
					this.goto(`/pages/mall/ebookDetail?obj=${JSON.stringify(item.ebookModel)}`)
					break;
				}
			}
		},
		onShow() {
			this.page = 1;
			this.fetchData()
		}
	}
</script>

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top) - env(safe-area-inset-bottom));
		width: 100%;
		
		.select-normal {
			margin-left: 20rpx;
			width: 100rpx;
			height: 100rpx;
		}
		.select-active {
			
		}

		.goods-item1 {
			padding: 25rpx 28rpx 25rpx 28rpx;
			margin: 15rpx 25rpx;
			width: 700rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.05);
			border-radius: 24rpx;

			text:first-child {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 500;
				color: #121212;
				line-height: 40rpx;
			}

			text:nth-child(2) {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #888888;
				line-height: 34rpx;
				margin-top: 8rpx;
			}

			.price {
				font-size: 36rpx !important;
				font-weight: bold !important;
				color: #0E86C6 !important;
			}

			.coin {
				font-size: 24rpx !important;
				color: #0E86C6 !important;
			}
		}
	}
	.bottom {
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0px -2rpx 10rpx 0px rgba(0, 0, 0, 0.05);
		backdrop-filter: blur(5rpx);
		
		width: 100%;
		height: calc(144rpx + env(safe-area-inset-bottom));
		padding: 24rpx 26rpx;
		position: fixed;
		bottom: 0;
		
		.tips {
			font-size: 24rpx;
			font-weight: 400;
			color: #666666;
			line-height: 34rpx;
			
			text {
				color: #0E86C6 !important;
			}
		}
		
		.select-all {
			text {
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				line-height: 34rpx;
				margin-left: 20rpx;
			}
		}
		
		.button {
			width: 390rpx;
			height: 74rpx;
			border-radius: 44rpx;
			border: 2rpx solid #0E86C6;
			
			text-align: center;
			font-size: 28rpx;
			font-weight: 500;
			color: #0E86C6;
			line-height: 74rpx;
		}
	}
</style>
