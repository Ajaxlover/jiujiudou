<template>
	<view>
		<web-view :webview-styles="webviewStyles" :update-title="updateTitle" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#0E86C6'
					}
				},
				url: "",
				updateTitle: true
			};
		},
		onLoad(option) {
			this.url = option.url;
			console.log(option);
			
			//#ifdef H5
			window.location.href = this.url;
			//#endif
			// #ifdef APP-PLUS
			// plus.runtime.openWeb(this.url);
			if ((this.url.indexOf('.pdf') > -1 || this.url.indexOf('.mp4') > -1) && option.title) {
				this.updateTitle = false;
				uni.setNavigationBarTitle({
					title: option.title
				})
			}
			// #endif
		}
	}
</script>

<style lang="scss">

</style>
