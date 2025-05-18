<template>
	<view class="wrap">
		<view class="item u-flex-col u-col-center" v-for="(each, idx) in items" :key="idx"
			@tap.stop="didSelectItem(each)">
			<view class="top">
				<u-image width="186" height="270" :src="each.coverPic" border-radius="8">
					<u-loading slot="loading"></u-loading>
					<image slot="error" :src="require('@/static/images/img_error@2x.png')"
						style="width: 104rpx; height: 92rpx;;"></image>
				</u-image>
			</view>
			<view class="bottom u-flex-col">
				<rich-text class="u-line-2" :nodes="each.tname"></rich-text>
				<view class="new">
					<text>{{price(each.discountPrice)}}</text>
				</view>
				<view class="old">{{price(each.price)}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mixin
	} from "@/common/mixin"

	export default {
		name: "ebookItemCell",
		mixins: [mixin],
		props: {
			items: {
				type: Array,
				required: true,
				default: function() {
					return [];
				}
			}
		},
		methods: {
			didSelectItem(item) {
				delete item.authorIntroduction;
				delete item.bookIntro;
				delete item.bookCatalogIntro;
				this.goto(`/pages/mall/ebookDetail?obj=${JSON.stringify(item)}`)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.wrap {
		display: flex !important;
		flex-direction: row !important;
		height: 482rpx !important;
		padding: 32rpx 24rpx;
		border-bottom: 2rpx solid #EEEEEE;

		.item {
			height: 100%;
			width: calc(100% / 3);

			.top {}

			.bottom {
				width: 186rpx;
				margin-top: 24rpx;

				.title {
					font-size: 28rpx;
					font-weight: 500;
					color: #121212;
					line-height: 32rpx;
				}

				.new {
					text:nth-child(1) {
						font-size: 36rpx;
						font-weight: 500;
						color: #0E86C6;
						line-height: 50rpx;
					}

					text:nth-child(2) {
						font-size: 24rpx;
						font-weight: 400;
						color: #0E86C6;
						line-height: 34rpx;
					}
				}

				.old {
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
					line-height: 34rpx;
					text-decoration: line-through;
				}
			}
		}
	}
</style>
