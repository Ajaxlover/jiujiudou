<template>
	<view class="page">
		<u-search placeholder="书名/课程名/关键词" v-model="keyword" :show-action="false" bg-color="#ffffff" @search="search" @blur="search" @clear="search">
		</u-search>
		<view class="wrap u-flex-col u-col-center">
			<scroll-view scroll-y style="height: 100%; width: 100%;" @scrolltolower="reachBottom">
				<view class="goods-item1 u-flex-col" v-for="(item, idx) in dataList" :key="idx"
					@tap.stop="didSelect(item)">
					<view class="u-flex u-col-center">
						<view>
							<u-image width="140" height="184" borderRadius="8" :src="item.cover" shape="square">
								<u-loading slot="loading"></u-loading>
								<image slot="error" :src="require('@/static/images/img_error@2x.png')"
									style="width: 104rpx; height: 92rpx;;"></image>
							</u-image>
						</view>
						<view class="u-flex-col" style="margin-left: 26rpx; height: 184rpx;">
							<rich-text class="u-line-2" :nodes="item.title"></rich-text>
							<text style="flex: 1; margin-top: 14rpx;">{{ item.pubName }}</text>
							<view style="margin-bottom: 0rpx;" class="u-flex">
								<view v-if="keyword.length === 0" class="u-flex" style="margin-right: 34rpx;">
									<u-icon v-if="idx <= 2" width="108" height="36" :name="require(`@/static/images/home_ranking_top${idx + 1}@2x.png`)"/>
									<view class="index" v-else><text>{{idx + 1}}</text></view>
								</view>
								<view class="look">{{item.readNum || 0}}人阅读</view>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore v-if="dataList.length > 0" :status="status"></u-loadmore>
				<u-empty text="暂无数据" mode="data" :show="dataList.length === 0"></u-empty>
			</scroll-view>
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
				status: 'loading',
				keyword: '',
				page: 1
			};
		},
		methods: {
			fetchData() {
				this.$u.post('/book/v1/textbook/rankingList', {
						page: this.page,
						keyword: this.keyword,
						pagesize: 10
					})
					.then(response => {
						response.map((each, idx) => {
							if (each.textbookName.includes(this.keyword)) each.title = this.replace(each
								.textbookName, this.keyword)
						})
						if (this.page === 1) this.dataList = response;
						else this.dataList.push(...response);

						this.status = (response.length >= 10) ? 'loading' : 'nomore';
					})
			},
			search(value) {
				this.page = 1;
				this.keyword = value;
				this.fetchData()
			},
			change(val) {
				console.log(val);
				this.page = 1;
				this.fetchData();
			},
			reachBottom() {
				if (this.status === 'nomore') return;
				
				this.page += 1;
				this.fetchData()
			},
			didSelect(item) {
				console.log(item);
				this.$u.get('/book//v1/textbook/read', {
					textbookId: item.textbookId
				}).then(response => {
					// this.fetchData()
					item.readNum += 1;
				})
				this.goto(`/pages/mall/textbookDetail?obj=${JSON.stringify(item)}`)
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

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top) - 84rpx);
		width: 100%;

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
			.index {
				background: url('@/static/images/home_ranking_top@2x.png') no-repeat;
				background-size: 108rpx 36rpx;
				width: 108rpx;
				height: 36rpx;
				
				::v-deep uni-text {
					position: absolute;
					font-size: 18rpx;
					font-weight: 500;
					color: #617CF6;
					line-height: 36rpx;
					margin-left: 80rpx;
				}
			}
			.look {
				font-size: 20rpx;
				font-weight: 400;
				color: #8A8A8F;
				line-height: 20rpx;
			}
		}
	}
</style>
