<template>
	<view class="page u-flex-col">
		<view class="wrap">
			<scroll-view scroll-y style="height: 100%; width: 100%;" @scrolltolower="reachBottom">
				<view class="item u-flex-col u-row-center" v-for="(item, index) in dataList" :key="index" @click="didSelected(item)">
					<view class="u-flex">
						<view>
							<u-icon v-if="status(item.orderId)" :name="require('@/static/order-selectd@2x.png')" size="32"></u-icon>
							<u-icon v-else :name="require('@/static/order-unselectd@2x.png')" size="32"></u-icon>
						</view>
						<view class="u-flex-col" style="margin-left: 26rpx; flex: 1">
							<text class="title" style="flex: 1; margin-top: 14rpx;">{{ item.goods[0].bookName }}</text>
							<text class="subtitle">{{ item.payTime }}</text>
						</view>
						<view>
							<text class="price-flag">￥</text>
							<text class="price">{{ price(item.orderPrice) }}</text>
						</view>
					</view>
				</view>
				<!-- <u-loadmore v-if="dataList.length > 0" :status="status"></u-loadmore> -->
				<u-empty text="暂无数据" mode="data" :show="dataList.length === 0"></u-empty>
			</scroll-view>
		</view>
		<u-button class="next" type="primary" shape="square" :custom-style="info" :hair-line="false" :disabled="disabled" @click="next">下一步</u-button>
	</view>
</template>

<script>
import { mixin } from '@/common/mixin';

export default {
	mixins: [mixin],
	data() {
		return {
			dataList: [],
			selected: [],
			info: {
				display: 'inline-flex',
				border: 'none',
				backgroundColor: '#0e86c6'
			}
		};
	},
	methods: {
		status(id) {
			return this.selected.indexOf(id) !== -1;
		},
		didSelected(item) {
			const obj = this.selected.find(each => item.orderId === each);
			if (obj) {
				this.selected = this.selected.filter(each => item.orderId != each);
			} else {
				this.selected.push(item.orderId);
			}
		},
		fetchData() {
			this.$u.post('/order/orderList', {orderStatus: 10}).then(response => {
				this.dataList = response;
			});
		},
		reachBottom() {
			this.fetchData();
		},
		next() {
			this.goto(`/pages/mine/invoiceConfirm?orderIds=${this.selected.join(',')}`)
		}
	},
	computed: {
		disabled() {
			return (this.selected ?? []).length === 0;
		}
	},
	onLoad() {
		this.fetchData();
	}
};
</script>

<style lang="scss">
::v-deep .u-btn--default--disabled {
	// background-color: rgba(14, 134, 198, 0.4) !important;
}

::v-deep .u-btn--default {
	// background-color: rgb(14,134,198);
}

.wrap {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: calc(100vh - var(--window-top) - 100rpx - env(safe-area-inset-bottom));
}

.next {
	background-color: #0e86c6;
	border-radius: 22px;
	height: 90rpx;
	width: 660rpx;
	color: white !important;
	padding-bottom: env(safe-area-inset-bottom);
}

.item {
	margin: 10rpx 26rpx;
	padding: 26rpx 24rpx;
	background: #ffffff;
	box-shadow: 0rpx 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
	border-radius: 24rpx;

	.title {
		font-size: 32rpx;
		font-weight: 500;
		color: #0e86c6;
		line-height: 44rpx;
	}
	.subtitle {
		margin-top: 10rpx;
		font-size: 22rpx;
		font-weight: 400;
		color: #999999;
		line-height: 32rpx;
	}
	.price-flag {
		font-size: 24rpx;
		color: #0e86c6;
		line-height: 34rpx;
	}
	.price {
		font-size: 52rpx;
		font-weight: 500;
		color: #0e86c6;
		line-height: 34rpx;
	}
}
</style>
