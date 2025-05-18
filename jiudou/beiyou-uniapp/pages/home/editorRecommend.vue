<template>
	<view>
		<view class="page">
			<view class="wrap u-flex-col u-col-center">
				<scroll-view scroll-y style="height: 100%; width: 100%;" @scrolltolower="reachBottom">
					<view class="item u-flex u-col-center" v-for="item in dataList" :key="item.ccourseUuid" @click="goto(`/pages/mall/yunkeDetail?obj=${JSON.stringify(item)}`)">
						<u-image width="240" height="180" :src="item.ccourseCover" border-radius="24"
							style="margin: 16rpx;">
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
					<u-loadmore v-if="dataList.length > 0" :status="status"></u-loadmore>
					<u-empty text="暂无数据" mode="data" :show="dataList.length === 0"></u-empty>
				</scroll-view>
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
				status: 'loading',
				keyword: '',
				page: 1
			};
		},
		methods: {
			fetchData() {
				this.$u.post('/cloudCourse/search', {
						page: this.page,
						pagesize: 10,
						keyword: this.keyword
					})
					.then(response => {
						if (this.page === 1) this.dataList = response;
						else this.dataList.push(...response);

						this.status = (response.length >= 10) ? 'loading' : 'nomore';
						this.page += 1;
					})
			},
			search(value) {

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

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;

		.item {
			background: #FFFFFF;
			box-shadow: 0rrpx 16rpx 0rpx rgba(0, 0, 0, 0.05);
			border-radius: 24rpx;
			margin: 0 25rpx 20rpx 25rpx;
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
	}
</style>
