<template>
	<transition name="slide-down">
		<view class="title-wrapper" v-show="ifTitleAndMenuShow">
			<view class="left u-flex u-row-center u-col-center" @click="didSelect">
				<text class="icon-back icon" style="font-size: 40rpx;"></text>
			</view>
		</view>
	</transition>
</template>

<script>
	export default {
		props: {
			ifTitleAndMenuShow: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			didSelect() {
				uni.navigateBack({delta: 1})
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.title-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 101;
		display: flex;
		width: 100%;
		height: 90rpx;
		background: white;
		box-shadow: 0 16rpx 16rpx rgba(0, 0, 0, .15);

		.left {
			flex: 0 0 60rpx;
		}

		.right {
			flex: 1;
			display: flex;
			justify-content: flex-end;

			.icon-wrapper {
				flex: 0 0 80rpx;

				.icon-cart {
					font-size: 44rpx;
				}
			}
		}
	}
</style>
