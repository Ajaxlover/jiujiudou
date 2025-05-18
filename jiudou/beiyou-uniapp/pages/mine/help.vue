<template>
	<view class="page wrap__edge">
		<u-cell-group :border="false">
			<u-cell-item title="帮助中心" isLink :border="true" @click="goto('/pages/mine/helpCenter')"></u-cell-item>
			<u-cell-item title="意见反馈" isLink :border="false" @click="goto('/pages/mine/feedback')"></u-cell-item>
		</u-cell-group>
		<u-cell-group :border="false">
			<u-cell-item title="客服QQ" isLink :border="false" @click="goto('/pages/webview/webview?url=https://app.buptpress.com/BYQQ/')"></u-cell-item>
			<!-- <u-cell-item title="购课与充值咨询" isLink :border="false"></u-cell-item> -->
		</u-cell-group>
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

			};
		}
	}
</script>

<style lang="scss">
	::v-deep .u-cell-item-box {
		//margin-top: 10px;
		margin: 24rpx 26rpx;
		border-radius: 12px;
		background-color: white;
		overflow: hidden;
	}

	::v-deep .u-cell {
		height: 96rpx;
	}

	::v-deep .u-cell_title {
		font-weight: 400;
		color: black;
		font-size: 28rpx;
	}

	.wrap {
		&__edge {}

		&__group-title {
			margin-top: 28px;
			margin-bottom: 15px;
			font-size: 14px;
			font-weight: 600;
			color: black;
			line-height: 20px;
		}
	}
</style>
