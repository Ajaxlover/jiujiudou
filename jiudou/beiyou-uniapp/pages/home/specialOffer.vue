<template>
	<view class="page u-flex-col">
		<u-search placeholder="书名/课程名/关键词" v-model="keyword" :show-action="false" bg-color="#ffffff" @search="search" @change="change" @clear="search"></u-search>
		<view class="wrap">
			<scroll-view scroll-y style="height: 100%; width: 100%;" @scrolltolower="reachBottom">
				<view class="goods-item1 u-flex-col" v-for="(item, index) in dataList" :key="index" @click="goto(`/pages/mall/ebookDetail?obj=${JSON.stringify(item)}`)">
					<view class="u-flex u-col-center">
						<view>
							<u-image width="140" height="184" borderRadius="8" :src="item.coverPic" shape="square">
								<u-loading slot="loading"></u-loading>
								<image slot="error" :src="require('@/static/images/img_error@2x.png')"
									style="width: 104rpx; height: 92rpx;;"></image>
							</u-image>
						</view>
						<view class="u-flex-col" style="margin-left: 26rpx; height: 184rpx; flex: 1">
							<rich-text class="u-line-2" :nodes="item.title"></rich-text>
							<text style="flex: 1; margin-top: 14rpx;">{{ item.publishname }}</text>
							<view style="margin-bottom: 0rpx;" class="u-flex">
								<view class="">
									<text class="price">{{price(item.discountPrice || 0)}}</text>
									<text class="coin"></text>
								</view>
								<view class="oldPrice">
									<text>{{price(item.price)}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore v-if="dataList.length > 0" :status="status"></u-loadmore>
				<u-empty text="暂无数据" mode="data" :show="dataList.length === 0"></u-empty>
			</scroll-view>
		</view>
		<view class="u-flex bottom u-col-top">
			<view class="item u-flex-col u-col-center" v-for="(item, idx) in list" :key="idx" @tap.stop="didSelect(item)">
				<u-icon :name="selected === idx ? item.selectedIconPath : item.iconPath" size="36"></u-icon>
				<text :class="{'active': selected === idx}" class="normal">{{item.text}}</text>
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
				dataList: [],
				current: 1,
				pages: 0,
				keyword: '',
				status: 'loading',
				selected: 0,
				
				list: [{
						"pagePath": "/pages/home/home",
						"text": "首页",
						"iconPath": require('@/static/images/tabbar-home-normal@2x.png'),
						"selectedIconPath": require('@/static/images/tabbar-home-selected@2x.png')
					},
					{
						"pagePath": "/pages/bookshelf/bookshelf",
						"text": "书架",
						"iconPath": require('@/static/images/tabbar-bookshelf-normal@2x.png'),
						"selectedIconPath": require('@/static/images/tabbar-bookshelf-selected@2x.png')
					},
					{
						"pagePath": "/pages/mall/mall",
						"text": "商城",
						"iconPath": require('@/static/images/tabbar-mall-normal@2x.png'),
						"selectedIconPath": require('@/static/images/tabbar-mall-selected@2x.png')
					},
					{
						"pagePath": "/pages/mine/mine",
						"text": "我的",
						"iconPath": require('@/static/images/tabbar-mine-normal@2x.png'),
						"selectedIconPath": require('@/static/images/tabbar-mine-selected@2x.png')
					}
				]
			};
		},
		methods: {
			didSelect(item) {
				this.goto(`switchTab:${item.pagePath}`)
			},
			fetchData() {
				this.$u.post('/ebook/ebook/salePriceList', {pageNo: this.current, pageSize: 10, 'keyword': this.keyword})
					.then(response => {
						response.records.map((each, idx) => {
							if (each.tname.includes(this.keyword)) each.title = this.replace(each
								.tname, this.keyword)
						})
						this.dataList = response.records ?? [];
						this.current = response.current;
						this.pages = response.pages;
						this.status = this.current >= this.pages ? 'nomore' : 'loading';
					})
			},
			search(value) {
				console.log(value);
				this.page = 1;
				this.fetchData();
			},
			change(val) {
				console.log(val);
				this.page = 1;
				this.fetchData();
			},
			reachBottom() {
				this.fetchData()
			}
		},
		onLoad() {
			this.fetchData();
		}
	}
</script>

<style lang="scss">
	::v-deep .u-search {
		padding: 10rpx 26rpx 10rpx 26rpx !important;
	}
	::v-deep .uni-tabbar__item {
		height: 100rpx;
	}
	::v-deep .uni-tabbar__icon {
		width: 38rpx;
		height: 38rpx;
	}
	::v-deep .uni-tabbar__label {
		margin-top: 10rpx;
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top) - 84rpx - 100rpx - env(safe-area-inset-bottom));
		// flex: 1;
		width: 100%;
		
		.goods-item1 {
			padding: 25rpx 28rpx 25rpx 28rpx;
			width: 700rpx;
			margin: 15rpx 25rpx 15rpx 25rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.05);
			border-radius: 24rpx;

			text:first-child {
				font-size: 28rpx;
				font-weight: 500;
				// color: #121212;
				line-height: 40rpx;
			}

			text:nth-child(2) {
				font-size: 24rpx;
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
				margin-left: 4rpx;
				font-size: 24rpx !important;
				color: #0E86C6 !important;
			}
			.oldPrice {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
				line-height: 34rpx;
				margin-left: 28rpx;
				text-decoration:line-through
			}
		}
	}
	
	.item {
		flex: 1;
		height: 100rpx;
		padding-top: 20rpx;
		
		.normal {
			margin-top: 10rpx;
			font-size: 20rpx;
			font-weight: 400;
			color: #8A8A8F;
			line-height: 28rpx;
		}
		.active {
			color: #1374CB !important;
		}
	}
	
	.bottom {
		position: fixed;
		// bottom: env(safe-area-inset-bottom);
		bottom: 0;
		height: calc(100rpx + env(safe-area-inset-bottom)); 
		width: 100%; 
		background: white;
	}
</style>
