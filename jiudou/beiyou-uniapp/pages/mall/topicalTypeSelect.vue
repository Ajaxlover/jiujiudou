<template>
	<view class="page u-flex-col u-col-center">
		<u-radio-group v-model="value" @change="radioGroupChange" :wrap="true">
			<u-radio @change="radioChange" v-for="(item, index) in list" :key="index" :name="index" :disabled="item.disabled">
				<view class="u-flex-col">
					<text class="name">{{item.name}}</text>
					<text class="remark">{{item.remark}}</text>
				</view>
			</u-radio>
		</u-radio-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				current: 0,
				value: 0
			};
		},
		methods: {
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				// console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				// console.log(e);
			},
			onNavigationBarButtonTap: function(e) {
				console.log('点击了右上角按钮')
				uni.$emit('change', {value: this.value});
				uni.navigateBack({
					delta: 1
				});
			}
		},
		onLoad(option) {
			this.list = JSON.parse(option.list);
			this.current = Number(option.idx);
			this.value = this.current;
		}
	}
</script>

<style lang="scss">
	::v-deep .u-radio-group {
		width: 700rpx !important;
	}
	::v-deep .u-radio {
		background: #FFFFFF;
		border-radius: 24rpx;
		margin-top: 24rpx;
		padding: 26rpx 24rpx;
	}
	.name {
		font-size: 32rpx;
		font-weight: 500;
		color: #000000;
		line-height: 44rpx;
	}
	.remark {
		margin-top: 6rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #999999;
		line-height: 40rpx;
	}

</style>
