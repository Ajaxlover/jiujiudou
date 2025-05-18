<template>
	<view class="page wrap u-flex-col u-col-center">
		<u-image :src="require('@/static/dclogo@2x.png')" width=120 height=120></u-image>
		<text>北邮智信</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.wrap {
		padding-top: 100rpx;
		
		text {
			margin-top: 40rpx;
			font-size: 28rpx;
		}
	}

</style>
