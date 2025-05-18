<template>
	<transition name="slide-right">
		<view class="content">
			<view class="content-wrapper" v-if="bookAvailable">
				<view class="content-item" v-for="(item,index) in navigation.toc" :key="index"
					@click="jumpTo(item.href)">
					<span class="text">{{item.label}}</span>
				</view>
			</view>
			<view class="empty u-flex u-row-center u-col-center" v-else>加载中...</view>
		</view>
	</transition>
</template>

<script>
	export default {
		methods: {
			jumpTo(target) {
				this.$emit('jumpTo', target)
			}
		},
		props: {
			ifShowContent: {
				type: Boolean,
				default: false
			},
			navigation: {
				type: Object,
				default: null
			},
			bookAvailable: {
				type: Boolean,
				default: false
			}
		},
	}
</script>

<style lang="scss">
	.content {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 102;
		width: 80%;
		height: 100%;
		background: white;

		.content-wrapper {
			width: 100%;
			height: 100%;
			overflow: auto;
			z-index: 102;

			.content-item {
				padding: 40rpx 30rpx;
				border-bottom: 1rpx solid #f4f4f4;

				.text {
					font-size: 28rpx;
					color: #333;
				}
			}
		}

		.empty {
			width: 100%;
			height: 100%;
			font-size: 32rpx;
			color: #333;
		}
	}
</style>
