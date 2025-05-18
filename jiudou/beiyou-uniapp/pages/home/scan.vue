<template>
	<view class="wrap">

	</view>
</template>

<script>
	import {
		mixin
	} from "@/common/mixin"
	
	var barcode = null;
	export default {
		mixins: [mixin],
		data() {
			return {
				name: '扫描图书背面条形码', //要在扫码界面自定义的内容
				flash: false, //是否打开摄像头
				type: '1', // 1 (认证 和 扫资源) 2 认证材料   用BYAF开头的是教材
			};
		},
		onLoad(d) {
			this.type = d.type;
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			// #ifdef APP-PLUS
			// plus.navigator.setFullscreen(true); //全屏
			var currentWebview = page.$getAppWebview();
			this.createBarcode(currentWebview); //创建二维码窗口
			this.createView(currentWebview); //创建操作按钮及tips界面
			// #endif
			
			// this.onmarked('', 'BYAFC0L746HJRX0003RT')
			// this.onmarked('', 'wR9q22Uxixw0eyHqE9Gh')
			// this.onmarked('', 'bafc9e9a-51e3-4c85-a91d-bd65fa6d3ff5')
			
			// this.onmarked('', 'https://api.buptpress.com/v3/resource/resource/r/NewQrCode-tsyDD7jzzBYpmTxW4Mhf')
			// this.add('NewQrCode-tsyDD7jzzBYpmTxW4Mhf')
		},
		onShow() {
			plus.navigator.setFullscreen(true); //全屏
		},
		onHide() {
			plus.navigator.setFullscreen(false);
		},
		methods: {
			// 扫码成功回调
			onmarked(type, result) {
				barcode.cancel();
				
				var text = '未知: ';
				switch (type) {
					case plus.barcode.QR:
						text = 'QR: ';
						break;
					case plus.barcode.EAN13:
						text = 'EAN13: ';
						break;
					case plus.barcode.EAN8:
						text = 'EAN8: ';
						break;
				}
				
				if (this.type == 1) {
					if (result.indexOf('ccourse') != -1) { // 云课详情
						let obj = {ccourseId: result.substring(7)}
						this.goto(`/pages/mall/yunkeDetail?obj=${JSON.stringify(obj)}`)
						setTimeout(() => {
							barcode.start();
						}, 2000)
					} else if (result.indexOf('JD') == 0 || result.indexOf('BY') == 0) { // 教材
						this.verify(result);
					} else {
						var code = result.split('/').pop();
						console.log(code);
						this.add(code);
					}
				} else {
					if (result.indexOf('JD') == 0 || result.indexOf('BY') == 0) { // 教材
						this.verify(result);
					} else {
						var code = result.split('/').pop();
						this.add(code);
					}
				}
			},
			verify(code) {
				const { platform } = uni.getSystemInfoSync()
				
				uni.showLoading({});
				this.$u.post('/book/bookVerify/bookVerifyV2', {
					qrCode: code,
					sysModel: platform === 'ios' ? 2 : 1
				}).then(response => {
					this.$u.toast('添加成功');
				
					plus.navigator.setFullscreen(false);
					uni.navigateBack({
						delta: 1
					});
					uni.$emit('update', {
						result: code
					});
					barcode.close();
				}).catch(error => {
					this.$u.toast(error.msg);
					setTimeout(() => {
						barcode.start()
					}, 2000)
				}).finally(() => {
					uni.hideLoading();
				})
			},
			add(code) {
				uni.showLoading({});
				let url = `/resource/resource/r/${code}`
				this.$u.get(url, {
					q: code
				}).then(response => {
					if (Array.isArray(response) && (response??[]).length != 0) {
						const obj = response[0];
						if (uni.getSystemInfoSync().platform == "android" && (obj.res_type == 1 || obj.res_type == 2)) {
							this.goto(`/pages/bookshelf/video?url=${obj.res_url}&title=${obj.res_name}`)
						} else if (uni.getSystemInfoSync().platform == "android" && obj.res_type == 9) {
							let url = `/hybrid/html/web/viewer.html?file=${encodeURIComponent(obj.res_url)}`;
							this.goto(`/pages/webview/webview?url=${url}`)
						} else if (obj.res_type == 14 || obj.res_type == 0) {
							this.goto(`/pages/webview/share?url=${obj.res_url}&title=${obj.res_name}`)
						} else {
							this.goto(`/pages/webview/webview?url=${obj.res_url}&title=${obj.res_name}`);
						}
					} else {
						console.log(response.data);
						uni.setStorageSync(code, response.data);
						this.goto(`/pages/bookshelf/test?type=1&key=${code}&answerkey=${code}_answer`);
					}
				}).catch(error => {
					console.log(error);
					this.$u.toast(error.msg);
					setTimeout(() => {
						barcode.start()
					}, 2000)
				}).finally(() => {
					uni.hideLoading();
				})
			},
			
			// 创建二维码窗口
			createBarcode(currentWebview) {
				barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
					top: '0',
					left: '0',
					width: '100%',
					height: '100%',
					position: this.type == 2 ? 'absolute' : 'static',
					scanbarColor: 'rgba(255,255,255, 0.99)',
					frameColor: 'rgba(255,255,255, 0.99)',
					background: 'rgba(255,255,255, 0.99)',
				});
				barcode.onmarked = this.onmarked;
				barcode.setFlash(this.flash);
				currentWebview.append(barcode);
				barcode.start();
			},
			// 创建操作按钮及tips
			createView(currentWebview) {
				// 创建返回原生按钮
				var backVew = new plus.nativeObj.View('backVew', {
						top: '40px',
						left: '10px',
						height: '40px',
						width: '100%'
					},
					[{
						tag: 'img',
						id: 'backBar',
						src: 'static/backBar.png',
						position: {
							top: '2px',
							left: '3px',
							width: '35px',
							height: '35px'
						}
					}]);
				// 创建打开手电筒的按钮
				var scanBarVew = new plus.nativeObj.View('scanBarVew', {
						top: '70%',
						left: '40%',
						height: '10%',
						width: '20%'
					},
					[{
							tag: 'img',
							id: 'scanBar',
							src: 'static/scanBar.png',
							position: {
								width: '28%',
								left: '36%',
								height: '30%'
							}
						},
						{
							tag: 'font',
							id: 'font',
							text: '轻触照亮',
							textStyles: {
								size: '10px',
								color: '#ffffff'
							},
							position: {
								width: '80%',
								left: '10%'
							}
						}
					]);
				// 创建展示类内容组件
				var content = new plus.nativeObj.View('content', {
						top: '40px',
						left: '0px',
						height: '100%',
						width: '100%',
					},
					[{
							tag: 'font',
							id: 'scanTitle',
							text: '扫一扫',
							textStyles: {
								size: '18px',
								color: '#ffffff'
							},
							position: {
								top: '0px',
								left: '0px',
								width: '100%',
								height: '40px'
							}
						},
						// {
						// 	tag: 'font',
						// 	id: 'scanTips',
						// 	text: this.name,
						// 	textStyles: {
						// 		size: '14px',
						// 		color: '#ffffff',
						// 		whiteSpace: 'normal',
						// 	},
						// 	position: {
						// 		top: '90px',
						// 		left: '10%',
						// 		width: '80%',
						// 		height: 'wrap_content'
						// 	}
						// }
					]);
					
				let that = this;
				var input = new plus.nativeObj.View('input', {
					top: '65%',
					// left: '40%',
					width: '100%',
					height: '35%'
				}, [{
						tag: 'font',
						id: 'tips1',
						text: '对准教材背面的二维码',
						textStyles: {
							size: '18px',
							color: '#ffffff'
							
						},
						position: {
							top: '0px',
							left: '0px',
							width: '100%',
							height: '30px'
						}
					},
					// {
					// 	tag: 'font',
					// 	id: 'tips2',
					// 	text: '找到教材背面二维码，刮开涂层',
					// 	textStyles: {
					// 		size: '18px',
					// 		color: '#ffffff',
					// 		align: 'left'
					// 	},
					// 	position: {
					// 		top: '50px',
					// 		left: '10%',
					// 		width: '80%',
					// 		height: '30px'
					// 	}
					// },
					{
						tag: 'font',
						id: 'tips3',
						text: '将取景框对准二维码进行扫描即可验证教材',
						textStyles: {
							size: '16px',
							color: '#ffffff',
							align: 'left'
						},
						position: {
							top: '50px',
							left: '10%',
							width: '80%',
							height: '30px'
						}
					},
					{
						tag: 'input',
						id: 'input',
						inputStyles: {
							type: 'text',
							placeholder: '输入激活码',
							fontSize: '18px',
							borderWidth: '0px',
							borderColor: '#FFFFFF',
							borderRadius: '3px',
							color: '#FFFFFF',
							textColor: '#FFFFFF',
							size: '10px',
							onComplete: function(e) {
								// e.text
								console.log(e);
								
								if (e.text.indexOf('JD') == 0 || e.text.indexOf('BY') == 0) { // 教材
									that.verify(result);
								} else {
									that.add(e.text);
								}
							}
						},
						position: {
							top: '90px',
							width: '80%',
							height: '40px',
							left: '10%'
						}
					}
				]);
				backVew.interceptTouchEvent(true);
				// scanBarVew.interceptTouchEvent(true);
				currentWebview.append(content);
				// currentWebview.append(scanBarVew);
				currentWebview.append(backVew);
				if (this.type == 2) {
					currentWebview.append(input);
				}

				backVew.addEventListener("click", function(e) { //返回按钮
					uni.navigateBack({
						delta: 1
					});
					barcode.close();
					plus.navigator.setFullscreen(false);
				}, false);
				var temp = this;
				scanBarVew.addEventListener("click", function(e) { //点亮手电筒
					temp.flash = !temp.flash;
					if (temp.flash) {
						scanBarVew.draw([{
								tag: 'img',
								id: 'scanBar',
								src: 'static/yellow-scanBar.png',
								position: {
									width: '28%',
									left: '36%',
									height: '30%'
								}
							},
							{
								tag: 'font',
								id: 'font',
								text: '轻触照亮',
								textStyles: {
									size: '10px',
									color: '#ffffff'
								},
								position: {
									width: '80%',
									left: '10%'
								}
							}
						]);
					} else {
						scanBarVew.draw([{
								tag: 'img',
								id: 'scanBar',
								src: 'static/scanBar.png',
								position: {
									width: '28%',
									left: '36%',
									height: '30%'
								}
							},
							{
								tag: 'font',
								id: 'font',
								text: '轻触照亮',
								textStyles: {
									size: '10px',
									color: '#ffffff'
								},
								position: {
									width: '80%',
									left: '10%'
								}
							}
						])
					}
					if (barcode) {
						barcode.setFlash(temp.flash);
					}
				}, false)
			}
		},
		onBackPress() {
			// #ifdef APP-PLUS
			// 返回时退出全屏
			barcode.close();
			plus.navigator.setFullscreen(false);
			// #endif
		},
		onUnload() {
			plus.navigator.setFullscreen(false);
		},
		onShow() {
			barcode.start()
		}
	}
</script>

<style lang="scss">
	.wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
