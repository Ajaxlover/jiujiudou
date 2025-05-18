<template>
	<view class="wrap u-flex-col" @click="didSelect">
		<view class="u-flex">
			<view class="wrap-left u-flex-col u-col-center">
				<u-image width="240" height="180" borderRadius="8" :src="obj.cover" shape="square">
					<u-loading slot="loading"></u-loading>
					<image slot="error" :src="require('@/static/images/img_error@2x.png')"
						style="width: 104rpx; height: 92rpx;;"></image>
				</u-image>
			</view>
			<view class="wrap-right u-flex-col">
				<rich-text v-if="search" class="title u-line-1" :nodes="obj.title || obj.name" />
				<rich-text v-else class="title u-line-1" :nodes="obj.name" />
				<text class="subtitle">{{ obj.teacherName }}</text>
				<view class="wrap-right-bottom u-flex u-col-bottom">
					<view class="u-flex u-row-between u-row-center" style="width: 100%">
						<!--          <view class="underway u-flex">-->
						<!--            <view class="flag">进行中</view>-->
						<!--            <text>2天04:51</text>-->
						<!--          </view>-->
						<view class="tips" style="margin-top: 30rpx">
							<text>进行中</text>
						</view>
						<text style="margin-top: 30rpx" class="number">{{ obj.interestedNum || 0 }} 人参与</text>
					</view>
				</view>
			</view>
		</view>
		<u-line v-if="lineVisiable" color="#EEEEEE" length="646" margin="0 26rpx" />
	</view>
</template>

<script>
	export default {
		name: "mukeItemCell",
		props: {
			obj: {
				type: Object,
				required: true,
				default () {
					return {};
				}
			},
			lineVisiable: {
				type: Boolean,
				default: true
			},
			search: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			didSelect() {
				uni.navigateTo({
					url: `/pages/mall/mukeDetail?obj=${JSON.stringify(this.obj)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep uni-rich-text > div {
		overflow: hidden;
		    white-space: nowrap;
		    text-overflow: ellipsis;
	}
	
	.wrap {
		width: 696rpx !important;
		height: 250rpx !important;

		.wrap-left {
			margin: 34rpx 0 34rpx 20rpx;
		}

		.wrap-right {
			height: 160rpx;
			width: 390rpx;
			margin: 16rpx 0rpx 14rpx 32rpx;

			.title {
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #000000;
				line-height: 32rpx;
			}

			.subtitle {
				margin-top: 24rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
				line-height: 24rpx;
			}

			.wrap-right-bottom {
				flex: 1;

				.tips {
					text {
						background: #0E86C6;
						border-radius: 8rpx;

						font-size: 20rpx;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 28rpx;
						padding: 6rpx 12rpx;
					}
				}

				.underway {
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					border: 1px solid #0E86C6;
					overflow: hidden;
					height: 36rpx;

					.flag {
						height: 100% !important;
						font-size: 20rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #FFFFFF;
						background-color: #0E86C6;
						padding: 0rpx 12rpx;
					}

					text:nth-child(2) {
						font-size: 20rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #0E86C6;
						line-height: 28rpx;
						padding: 0rpx 22rpx;
					}
				}

				.number {
					font-size: 20rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #8A8A8F;
					line-height: 20rpx;
				}
			}
		}
	}
</style>
