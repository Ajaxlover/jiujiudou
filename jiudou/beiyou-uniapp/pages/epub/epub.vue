<template>
	<view><!-- <web-view :webview-styles="webviewStyles" :src="url"></web-view> --></view>
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
			url: ''
		};
	},
	onLoad(option) {
		let that = this;
		let url = option.url;
		const { platform, statusBarHeight } = uni.getSystemInfoSync();
		const timestamp = Date.now();

		this.url = '/hybrid/html/index.html?plat=' + platform + '&h=' + statusBarHeight+'&url='+encodeURIComponent(url)+'&tname='+encodeURI(option.name)+'&t='+timestamp;
		console.log(this.url);

		// #ifdef APP-PLUS
		var wv = plus.webview.create('', 'custom-webview', {

		});
		wv.loadURL(this.url);
		var currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
		currentWebview.append(wv); //一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
		// #endif
	},
	onUnload() {
		console.log('onUnload');
		this.url = null;
	}
};
</script>

<style lang="scss"></style>
