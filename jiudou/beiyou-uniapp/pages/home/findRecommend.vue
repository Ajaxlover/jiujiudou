<template>
	<view class="page wrap">
		<view class="u-flex-col u-col-center" v-if="dataList.length > 0">
			<scroll-view scroll-y style="height: 100%; width: 100%;" @scrolltolower="reachBottom">
				<view class="page-box u-flex-col">
					<view class="item u-flex u-col-center" v-for="(item, idx) in dataList" :key="idx"
						@click="goto(`/pages/webview/webview?url=${item.contentExt.extOriginUrl}`)">
						<image style="width: 20rpx; height: 20rpx" src="@/static/images/home_dot@2x.png"></image>
						<text class="u-line-1">{{ item.contentExt.extTitle }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<u-empty text="暂无数据" mode="data" :show="dataList.length === 0"></u-empty>
	</view>
</template>

<script>
	import UImage from "../../uview-ui/components/u-image/u-image";
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
				this.$u.post('/platform/content/channelContent', {
						page: this.page,
						pagesize: 1000,
						type: 2,
						status: 1
					})
					.then(response => {
						if (this.page === 1) this.dataList = response.list;
						else this.dataList.push(...response.list);

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
		// height: calc(100vh - var(--window-top) - 84rpx);
		height: calc(100vh - var(--window-top));
		width: 100%;

		.page-box {
			width: 700rpx;
			margin-left: 25rpx;
			background: #FFFFFF;
			box-shadow: 0px 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
			border-radius: 24rpx;
			padding: 20rpx 10rpx;
		}

		.item {
			margin: 10rpx 20rpx 10rpx 20rpx;
			padding: 14rpx 0 14rpx 0;

			text {
				max-width: 600rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: #333333;
				line-height: 32rpx;
				margin-left: 20rpx
			}
		}
	}
</style>
