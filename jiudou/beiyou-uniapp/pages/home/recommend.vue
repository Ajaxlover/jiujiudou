<template>
	<view class="page">
		<u-search placeholder="书名/课程名/关键词" v-model="keyword" :show-action="false" bg-color="#ffffff" @search="search" @blur="search" @clear="search">
		</u-search>
		<view class="wrap u-flex-col u-col-center">
			<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
				<view class="page_box u-flex-col">
					<view class="u-flex-col" v-for="(item, index) in dataList" :key="index" @click="didSelectAtIndex(item)">
						<view class="goods-item1 u-flex" v-if="item.type === 1 || item.type === 2">
							<view>
								<u-image width="149" height="215" borderRadius="8" :src="item.coverPic" shape="square">
									<u-loading slot="loading"></u-loading>
									<image slot="error" :src="require('@/static/images/img_error@2x.png')" style="width: 104rpx; height: 92rpx;;"></image>
								</u-image>
							</view>
							<view class="u-flex-col u-row-between" style="margin-left: 22rpx; height: 200rpx">
								<view class="">
									<rich-text v-if="searching" class="u-line-2" :nodes="item.title || item.name"></rich-text>
									<text v-else>{{ item.name }}</text>
									<view style="margin-top: 18rpx; height: 40rpx">
										<u-tag v-for="(tag, idx) in split(item.tags)" :text="tag" mode="dark" bg-color="#F6F6F6" color="#888888" :key="idx" />
									</view>
								</view>
								<view style="margin-top: 30rpx">
									<text class="price">{{price(item.price || 0)}}</text>
								</view>
							</view>
						</view>
						<yunke-item-cell v-else :obj="item" :line-visiable="false" />
						<u-line color="#EEEEEE" length="646" margin="0 26rpx" />
					</view>
					<u-loadmore v-if="dataList.length > 0" :status="status" margin-bottom="10" />
				</view>
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
		computed: {
			searching() {
				return this.keyword.length !== 0;
			}
		},
		methods: {
			split(tags) {
				if ((tags ?? "") === "") return []
				return tags.split(',')
			},
			fetchData() {
				this.$u.post('/ebook/ebRecommend/listRecommend', {
						pageNo: this.page,
						keyword: this.keyword,
						pageSize: 10
					})
					.then(response => {
						response.map((each, idx) => {
							if (each.name.includes(this.keyword)) each.title = this.replace(each
								.name, this.keyword)
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
			didSelectAtIndex(item) {
				if (item.type === 1) { // 电子书
					if (item.hasOwnProperty('linkId')) {
						item.id = item.linkId;
						item.tname = item.name;
					}
					this.goto(`/pages/mall/ebookDetail?obj=${JSON.stringify(item)}`)
				} else if (item.type === 2) { // 教材
					if (item.hasOwnProperty('linkId')) {
						item.textbookId = item.linkId;
						item.textbookName = item.name;
					}
					this.goto(`/pages/mall/textbookDetail?obj=${JSON.stringify(item)}`)
				}
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
