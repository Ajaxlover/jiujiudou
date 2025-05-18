<template>
	<view class="page wrap u-flex-col">
		<u-navbar :is-back="true" :title="datas.tname" :background="{background: '#F8F8F7'}" title-color="black" title-size="32" :border-bottom="false">
			<view class="navbar-right" slot="right">
				<view class="dot-box right-item" @click="didTappedAction">
					<u-icon :name="require('@/static/images/bookshelf_more@2x.png')" size="46"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="wrap-head u-flex u-row-between">
			<view class="bd1 u-flex-col">
				<view class="bd2 u-flex u-row-between" @click="goto(`/pages/bookshelf/test?type=1&key=testGZip_${uid}_list&answerkey=testGZip_${uid}_answer`)">
					<view class="TextGroup1 u-flex-col u-row-between">
						<text class="info1">自测题目</text>
						<text class="txt4">{{alreadyDone}}/{{testing.length}}题</text>
					</view>
				</view>
			</view>
			<view class="bd3 u-flex-col">
				<view class="block2 u-flex u-row-between" @click="show = true">
					<view class="TextGroup2 u-flex-col u-row-between">
						<text class="word2">课件包</text>
						<text class="word3">教师专用</text>
					</view>
					<view class="mod2 u-flex-col"></view>
				</view>
			</view>
		</view>
		<view class="wrap-content">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in tabbar" :key="index" class="u-tab-item" :class="[current===index ? 'u-tab-item-active' : '']" :data-current="index"
					@tap.stop="swichMenu(index)">
					<text class="u-line-1">{{ item.catelogContent }}</text>
				</view>
			</scroll-view>
			<block v-for="(item, index) in tabbar" :key="index">
				<scroll-view scroll-y class="right-box" v-if="current===index">
					<view class="page-view">
						<view class="class-item u-flex-col" v-for="(each, idx) in item.cataList" :key="idx" @tap.stop="didSelectItem(each)">
							<text class="item-title">{{ each.matchPicName }}</text>
							<image style="width: 38rpx; height: 36rpx; margin-bottom: 38rpx" :src="fileType(each.res_type)"></image>
							<view class="u-flex u-row-between">
								<text class="item-subtitle-left">第{{ each.res_page}}页</text>
								<text class="item-subtitle-right">{{ each.read_num }}</text>
							</view>
						</view>
					</view>
					<u-empty text="暂无数据" mode="data" :show="item.cataList.length === 0"></u-empty>
				</scroll-view>
			</block>
		</view>

		<u-modal v-model="show" title="请输入邮箱" :show-cancel-button="true" :mask-close-able="true" @confirm="confirm">
			<u-input v-model="email" :border="false" placeholder="请输入电子邮箱" :placeholder-style="placeholderStyle"></u-input>
		</u-modal>
	</view>
</template>

<script>
	import {
		mixin
	} from "@/common/mixin"
	export default {
		mixins: [mixin],
		data() {
			return {
				placeholderStyle: "",
				textbookId: '',
				datas: null,
				testing: [], // 自测题

				tabbar: [],
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度

				alreadyDone: 0,
				show: false,
				email: '',
			};
		},
		computed: {
			// 资源类型 1音频 2视频 3AR 4excel 5H5 6PPT 7Word 9PDF 10图片 11 文件夹 12语音评测 13 链接 14压缩包
			fileType() {
				return function(idx) {
					let returnValue;
					switch (idx) {
						case 1:
							returnValue = require('@/static/images/type_audio@2x.png');
							break;
						case 2:
							returnValue = require('@/static/images/type_video@2x.png');
							break;
						case 4:
							returnValue = require('@/static/images/type_excel@2x.png');
							break;
						case 5:
							returnValue = require('@/static/images/type_h5@2x.png');
							break;
						case 6:
							returnValue = require('@/static/images/type_ppt@2x.png');
							break;
						case 7:
							returnValue = require('@/static/images/type_word@2x.png');
							break;
						case 9:
							returnValue = require('@/static/images/type_pdf@2x.png');
							break;
						case 10:
							returnValue = require('@/static/images/type_png@2x.png');
							break;
						case 13:
							returnValue = require('@/static/images/type_link@2x.png');
							break;
						case 14:
						case 0:
							returnValue = require('@/static/images/type_zip@2x.png');
							break;
						default:
							returnValue = require('@/static/images/type_pdf@2x.png');
							break;
					}
					return returnValue;
				}
			},
			uid() {
				return uni.getStorageSync('uid');
			}
		},
		methods: {
			confirm() {
				if (this.email?.length === 0) {
					this.$u.toast('请输入邮箱地址');
					return
				}

				uni.showLoading({});
				this.$u.post('/resource/tbMatchPic/getResEmail', {
					textbookId: this.textbookId,
					type: 0,
					isUpdateEmail: 2,
					email: this.email
				}).then(response => {
					this.$u.toast('发送成功');
				}).catch(error => {
					this.$u.toast(error.msg);
				}).finally(() => {
					uni.hideLoading();
				})
			},
			didTappedAction() {
				let that = this;
				uni.showActionSheet({
					itemList: ["分享到微信好友", "分享到微信朋友圈"],
					success: (obj) => {
						console.log(this.datas.cover_pic);
						uni.share({
							provider: "weixin",
							scene: obj.tapIndex === 0 ? "WXSceneSession" : "WXSceneTimeline",
							type: 0,
							href: `https://static.buptpress.com/bookDetail/index.html?bookId=${this.datas.textbookId}`,
							title: this.datas.tname,
							summary: this.datas.pubName,
							imageUrl: this.datas.cover_pic,
							success: function(res) {
								console.log("success:" + JSON.stringify(res));
								that.$u.toast('分享成功');
							},
							fail: function(err) {
								console.log("fail:" + JSON.stringify(err));
								that.$u.toast('分享失败');
							}
						});
					}
				})
			},
			didSelectItem(obj) {
				console.log(obj);
				if (uni.getSystemInfoSync().platform == "android" && (obj.res_type == 4 || obj.res_type == 6 || obj.res_type == 7)) {
					this.goto(`/pages/webview/webview?url=${encodeURI(`http://view.officeapps.live.com/op/view.aspx?src=${obj.res_url}`)}`)
				} else if (uni.getSystemInfoSync().platform == "android" && (obj.res_type == 1 || obj.res_type == 2)) {
					this.goto(`/pages/bookshelf/video?url=${obj.res_url}&title=${obj.matchPicName}`)
				} else if (uni.getSystemInfoSync().platform == "android" && obj.res_type == 9) {
					let url = `/hybrid/html/web/viewer.html?file=${encodeURIComponent(obj.res_url)}`;
					this.goto(`/pages/webview/webview?url=${url}&title=${obj.matchPicName}`)
				} else if (obj.res_type == 14 || obj.res_type == 0) {
					this.goto(`/pages/webview/share?url=${obj.res_url}&title=${obj.matchPicName}`)
				} else {
					this.goto(`/pages/webview/webview?url=${obj.res_url}&title=${obj.matchPicName}`)
				}
				
				this.$u.get('/book/bookVerify/read', {
					textbookId: this.textbookId,
					resourceId: obj.resourceId
				}).then(response => {
					obj.read_num = (obj.read_num??0) + 1;
				})
			},
			getImg() {
				return Math.floor(Math.random() * 35);
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if (index === this.current) return;

				if (this.tabbar[index].cataList.length === 0) {
					this.fetchData(this.tabbar[index].catalogId, index)
				}

				this.current = index;
				// 如果为0，意味着尚未初始化
				if (this.menuHeight === 0 || this.menuItemHeight === 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},
			fetchData(cid, index = 0) {
				this.$u.post('/resource/resource/resourcesV2', {
					textbookId: this.textbookId,
					page: 1,
					pagesize: 1000,
					c_id: cid
				}).then(response => {
					this.tabbar[index].cataList = response;
				})
			}
		},
		onLoad(option) {
			const uid = uni.getStorageSync('uid');
			this.textbookId = option.textbookId;
			const array = uni.getStorageSync(`bookshelf_datas_${uid}_0`)
			let obj = array.find(item => item.textbookId === this.textbookId);
			this.datas = obj;
			this.tabbar = obj?.catalogInfo ?? [];
			console.log(this.datas);

			if (this.tabbar.length > 0) {
				this.fetchData(this.tabbar[this.current].catalogId);
			}

			const key = `testGZip_${uid}_update`
			const valueKey = `testGZip_${uid}_list`
			const updated = uni.getStorageSync(key) ?? 0;
			this.$u.post('/selftest/updateSelfTestWithGZip', {
					updated
				})
				.then(response => {
					if (response?.list?.length > 0) {
						uni.setStorageSync(key, response.currentTime)
						uni.setStorageSync(valueKey, response.list)
						this.testing = response.list;
					} else {
						this.testing = uni.getStorageSync(valueKey);
					}
				})

			this.$u.post('/book/v1/textbook/read', {
				textbookId: this.textbookId
			})

			uni.setNavigationBarTitle({
				title: obj.tname
			})
		},
		onShow() {
			const uid = uni.getStorageSync('uid');
			const valueKey = `testGZip_${uid}_list`;
			console.log(uni.getStorageSync(`testGZip_${uid}_answer`));
			let array = uni.getStorageSync(`testGZip_${uid}_answer`)?.length === 0 ? [] : JSON.parse(uni.getStorageSync(`testGZip_${uid}_answer`));
			this.alreadyDone = array.length;
		}
	}
</script>

<style lang="scss">
	::v-deep uni-page-body {
		height: 100%;
	}

	::v-deep .menu-scroll-view {
		.uni-scroll-view {
			background: #FFFFFF;
			box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.05);
			border-radius: 0rpx 24rpx 24rpx 0rpx;
		}
	}

	::v-deep .u-input {
		margin: 0 40rpx;
		width: initial;
	}

	.wrap {

		//padding-bottom: env(safe-area-inset-bottom);
		.wrap-head {
			width: 698rpx;
			margin: 20rpx 26rpx 40rpx 20rpx;

			.bd1 {
				box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05);
				background-color: rgba(255, 255, 255, 1);
				border-radius: 12px;
				height: 164rpx;
				width: 338rpx;

				.bd2 {
					width: 266rpx;
					height: 100rpx;
					margin: 34rpx 0 0 28rpx;

					.TextGroup1 {
						width: 128rpx;
						height: 88rpx;
						margin-top: 8rpx;

						.info1 {
							width: 128rpx;
							height: 44rpx;
							overflow-wrap: break-word;
							color: rgba(14, 134, 198, 1);
							font-size: 32rpx;
							font-family: PingFangSC-Semibold;
							text-align: right;
							white-space: nowrap;
							line-height: 44rpx;
							display: block;
						}

						.txt4 {
							font-size: 24rpx;
							font-weight: 400;
							color: rgba(14, 134, 198, 0.5);
							line-height: 34rpx;
						}
					}

					.block1 {
						background-color: red;
						width: 102rpx;
						height: 102rpx;
						background: url(@/static/images/bookshelf_detail_test@2x.png) no-repeat;
						background-size: 102rpx 102rpx;
					}
				}
			}

			.bd3 {
				box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05);
				background-color: rgba(255, 255, 255, 1);
				border-radius: 12px;
				height: 164rpx;
				width: 338rpx;

				.block2 {
					width: 268rpx;
					height: 90rpx;
					margin: 40rpx 0 0 44rpx;

					.TextGroup2 {
						width: 96rpx;
						height: 88rpx;
						margin-top: 2rpx;

						.word2 {
							width: 96rpx;
							height: 44rpx;
							overflow-wrap: break-word;
							color: rgba(14, 134, 198, 1);
							font-size: 32rpx;
							font-family: PingFangSC-Semibold;
							text-align: left;
							white-space: nowrap;
							line-height: 44rpx;
							display: block;
						}

						.word3 {
							width: 96rpx;
							height: 34rpx;
							overflow-wrap: break-word;
							color: rgba(14, 134, 198, 0.5);
							font-size: 24rpx;
							text-align: left;
							white-space: nowrap;
							line-height: 34rpx;
							margin-top: 10rpx;
							display: block;
						}
					}

					.mod2 {
						width: 102rpx;
						height: 102rpx;
						background: url(@/static/images/bookshelf_detail_package@2x.png) no-repeat;
						background-size: 102rpx 102rpx;
					}
				}
			}
		}

		.wrap-content {
			// flex: 1;
			display: flex;
			overflow: hidden;
			//padding: 0;
			// height: calc(100vh - var(--window-top) - 224rpx - 82rpx - env(safe-area-inset-bottom));
			height: calc(100vh - env(safe-area-inset-top) - 224rpx - 88rpx - env(safe-area-inset-bottom));
		}

		.wrap-foot {
			//margin-top: 42rpx;
			background-color: white;
			height: calc(82rpx + env(safe-area-inset-bottom));
			opacity: 1;
			width: 100%;
			position: fixed;
			bottom: 0;

			.layer16 {
				width: 608rpx;
				height: 40rpx;
				margin: 24rpx 0 0 70rpx;
				opacity: 1;

				.ImageText13 {
					width: 108rpx;
					height: 40rpx;
					opacity: 1;

					.TextGroup16 {
						height: 40rpx;
						width: 56rpx;

						.word28 {
							width: 56rpx;
							height: 40rpx;
							overflow-wrap: break-word;
							color: rgba(0, 0, 0, 1);
							font-size: 28rpx;
							text-align: right;
							white-space: nowrap;
							line-height: 40rpx;
							display: block;
						}
					}
				}

				.ImageText14 {
					width: 104rpx;
					height: 40rpx;
					opacity: 1;

					.TextGroup17 {
						height: 40rpx;
						width: 56rpx;

						.word29 {
							width: 56rpx;
							height: 40rpx;
							overflow-wrap: break-word;
							color: rgba(0, 0, 0, 1);
							font-size: 28rpx;
							text-align: right;
							white-space: nowrap;
							line-height: 40rpx;
							display: block;
						}
					}
				}

				.ImageText15 {
					width: 104rpx;
					height: 40rpx;
					opacity: 1;

					.TextGroup18 {
						height: 40rpx;
						width: 56rpx;

						.info9 {
							width: 56rpx;
							height: 40rpx;
							overflow-wrap: break-word;
							color: rgba(0, 0, 0, 1);
							font-size: 28rpx;
							text-align: right;
							white-space: nowrap;
							line-height: 40rpx;
							display: block;
						}
					}
				}
			}
		}
	}

	.u-tab-view {
		width: 226rpx;
		//height: 100%;
	}

	.u-tab-item {
		padding: 0 20rpx;
		height: 80rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #999999;
		font-weight: 400;
		line-height: 40rpx;
		border-bottom: 2rpx solid rgba(238, 238, 238, 0.5);
	}

	.u-tab-item-active {
		position: relative;
		color: #fff !important;
		font-size: 28rpx;
		font-weight: 500 !important;
		background: #99C0F9;
	}

	.right-box {}

	.page-view {
		padding-left: 32rpx;
		padding-right: 26rpx;
	}

	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 20rpx 26rpx 22rpx 26rpx;
		box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.05);
		border-radius: 24rpx;

		.item-title {
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: black;
		}

		.item-subtitle-left {
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
		}

		.item-subtitle-right {
			font-size: 20rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;

			&::before {
				width: 22rpx;
				height: 16rpx;
				content: '';
				display: inline-block;
				background: url("@/static/images/bookshelf_look@2x.png");
				background-size: 22rpx 16rpx;
				margin-right: 4rpx;
			}
		}
	}

	.navbar-right {
		margin-right: 24rpx;
		display: flex;
	}

	.right-item {
		margin: 0 16rpx;
		position: relative;
		display: flex;
	}
</style>
