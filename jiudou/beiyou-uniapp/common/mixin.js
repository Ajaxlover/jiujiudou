export const mixin = {
	data() {
		return {}
	},
	methods: {
		goto(url) {
			if(url.indexOf('switchTab:') != -1) {
				let string = url.substring(10);
				let query = this.query(string);
				getApp().globalData.current = query['current'] ?? 0;
				
				uni.switchTab({
					url: url.substring(10),
				})
			} else if(url.indexOf('reLaunch:') != -1) {
				uni.reLaunch({
					url: url.substring(9)	
				})
			} else {
				if (url.indexOf('webview/webview') != -1 && url.indexOf('mp.weixin.qq.com') != -1) {
					let query = this.query(url)
					let value = query['url'];
					// #ifdef APP-PLUS
					plus.runtime.openWeb(value);
					// #endif
				} else {
					uni.navigateTo({
						url: url
					})
				}
			}
		},
		query(string) {
			let query = {};
			if (string.indexOf("?") != -1) {
			    const str = string.substr(string.indexOf("?") + 1);
			    const pairs = str.split("&");
			    for(let i = 0; i < pairs.length; i ++) {
			         const pair = pairs[i].split("=");
			        query[pair[0]] = pair[1];
			    }
			}
			return query;
		},
		// 替换高亮
		replace(string, key, color="rgba(23, 203, 188, 0.2)") {
			var reg = new RegExp(`(${key})`, 'gm')
			var replace = `<span style="background-color:${color}">$1</span>`
			return string.replace(reg, replace);
		},
		// 分转元
		price(a){
		    var num = Number(a??0);
		    if(!num){//等于0
		        return num+'.00';
		    } else{//不等于0
		        num = Math.round((num)*100)/10000;
		        num = num.toFixed(2);
		        num+='';//转成字符串
		        var reg=num.indexOf('.') >-1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;//千分符的正则
		        return num.replace(reg, '$1,')//千分位格式化
		    }
		}
	}
}
