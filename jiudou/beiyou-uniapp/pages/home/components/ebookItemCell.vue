<template>
	<view class="goods-item1 u-flex-col" @click="didSelect(each)">
		<view class="u-flex u-col-center">
			<view>
				<u-image width="140" height="184" borderRadius="8" :src="obj.coverPic" shape="square">
					<u-loading slot="loading"></u-loading>
					<image slot="error" :src="require('@/static/images/img_error@2x.png')"
						style="width: 104rpx; height: 92rpx;;"></image>
				</u-image>
			</view>
			<view class="u-flex-col" style="margin-left: 26rpx; height: 184rpx;">
				<rich-text v-if="search" class="u-line-2" :nodes="obj.title"></rich-text>
				<rich-text v-else class="u-line-2" :nodes="obj.tname"></rich-text>
				<text style="flex: 1; margin-top: 14rpx;">{{ obj.pubName }}</text>
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

			};
		},
		props: {
			obj: {
				type: Object,
				required: true,
				default () {
					return {};
				}
			},
			search: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			didSelect() {
				this.goto(`/pages/mall/ebookDetail?obj=${JSON.stringify(this.obj)}`)
			}
		}
	}
</script>

<style lang="scss">
	.goods-item1 {
		width: 666rpx;
		//padding: 34rpx 28rpx 0 28rpx;
		padding: 26rpx 26rpx 26rpx 18rpx;
		border-bottom: solid 2rpx #EEEEEE;

		text:first-child {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: black;
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
</style>
