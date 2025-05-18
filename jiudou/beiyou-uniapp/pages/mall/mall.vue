<template>
	<view classs="page u-flex-col">
		<u-navbar :is-back="true" :custom-back="didTappedBack" title="书城" :background="{background: '#F8F8F7'}" title-color="black" title-size="32" :border-bottom="false" />
		<view class="u-flex u-col-center">
			<!-- <u-icon v-if="keyword.length !== 0" :name="require('@/static/nav-back@2x.png')" width="20" height="36" style="margin-left: 30rpx; margin-right: 10rpx; padding-top: 10rpx"
				@click="reload" /> -->
			<u-search placeholder="书名/课程名/关键词" v-model="keyword" :show-action="false" bg-color="#ffffff" @search="search" @blur="search" @clear="search" />
		</view>
		<!-- <u-search placeholder="书名/课程名/关键词" v-model="keyword" :show-action="false" bg-color="#ffffff" @search="search" /> -->
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper ref="uTabs" :current="current" :list="list" :is-scroll="false" :bar-style="barStyle" :bar-height="38" :bar-width="150" font-size="32"
					inactive-color="#666" :active-item-style="activeItemStyle" swiper-width="750" bg-color="#f9f9f9" @change="change">
				</u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" duration="0" @animationfinish="animationfinish">
				<swiper-item class="swiper-item u-flex u-col-top">
					<view class="u-flex u-col-top" style="height: 100%; width: 100%;" v-if="!searching">
						<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
							<view v-for="(item,index) in tabbar" :key="index" class="u-tab-item" :class="[idx===index ? 'u-tab-item-active' : '']" :data-current="index"
								@tap.stop="swichMenu(index)">
								<text class="u-line-1">{{ item.sname }}</text>
							</view>
						</scroll-view>
						<block v-for="(item, index) in tabbar" :key="index">
							<scroll-view scroll-y class="right-box" v-if="idx===index" @scrolltolower="reachBottom">
								<view class="page_box u-flex-col" style="margin: 0">
									<view class="goods-item1 u-flex-col" v-for="(each, ind) in item.dataList" :key="ind" @click="didSelect(each)">
										<view class="u-flex u-col-center">
											<view>
												<u-image width="140" height="184" borderRadius="8" :src="each.cover" shape="square">
													<u-loading slot="loading"></u-loading>
													<image slot="error" :src="require('@/static/images/img_error@2x.png')" style="width: 104rpx; height: 92rpx;;"></image>
												</u-image>
											</view>
											<view class="u-flex-col" style="margin-left: 26rpx; height: 184rpx;">
												<rich-text v-if="searching" class="u-line-2 title" :nodes="each.title"></rich-text>
												<text v-else class="u-line-2" style="margin-top: 0;">{{ each.textbookName }}</text>
												<text style="flex: 1; margin-top: 14rpx;">{{ each.pubName }}</text>
											</view>
										</view>
										<u-line color="#EEEEEE" length="484" margin="32rpx 32rpx 0 10rpx" />
									</view>
									<u-loadmore v-if="item.dataList.length > 0" :status="item.status" margin-bottom="10" />
								</view>
								<u-empty text="暂无数据" mode="data" :show="item.dataList.length === 0"></u-empty>
							</scroll-view>
						</block>
					</view>
					<scroll-view v-else scroll-y class="right-box" style="border-radius: 0 !important;">
						<view class="page_box u-flex-col" style="margin: 0; border-radius: 0 !important;">
							<view class="goods-item1 u-flex-col" v-for="(each, ind) in list[0].dataList" :key="ind" @click="didSelect(each)">
								<view class="u-flex u-col-center">
									<view>
										<u-image width="140" height="184" borderRadius="8" :src="each.cover" shape="square">
											<u-loading slot="loading"></u-loading>
											<image slot="error" :src="require('@/static/images/img_error@2x.png')" style="width: 104rpx; height: 92rpx;;"></image>
										</u-image>
									</view>
									<view class="u-flex-col" style="margin-left: 26rpx; height: 184rpx;">
										<rich-text v-if="searching" class="u-line-2 title" :nodes="each.title"></rich-text>
										<text v-else class="u-line-2" style="margin-top: 0;">{{ each.textbookName }}</text>
										<text style="flex: 1; margin-top: 14rpx;">{{ each.pubName }}</text>
									</view>
								</view>
								<u-line color="#EEEEEE" margin="32rpx 32rpx 0 10rpx" />
							</view>
							<u-loadmore v-if="list[0].dataList.length > 0" :status="list[1].status" margin-bottom="10" />
						</view>
						<u-empty text="暂无数据" mode="data" :show="list[0].dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col u-col-center">
							<ebook-item-cell v-for="(item, index) in list[1].datas" :items="item" :key="index" />
						</view>
						<u-empty text="暂无数据" mode="data" :show="list[1].dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col u-col-center">
							<yunke-item-cell v-for="(item, index) in list[2].dataList" :key="index" :line-visiable="false" :obj=item :search="searching" />
							<u-loadmore v-if="list[2].dataList.length > 0" :status="list[2].status" margin-bottom="10" />
						</view>
						<u-empty text="暂无数据" mode="data" :show="list[2].dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page_box u-flex-col u-col-center">
							<muke-item-cell v-for="(item, index) in list[3].dataList" :key="index" :obj=item :search="searching" />
							<u-loadmore v-if="list[3].dataList.length > 0" :status="list[3].status" margin-bottom="10" />
						</view>
						<u-empty text="暂无数据" mode="data" :show="list[3].dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import LoadMore from "./components/loadMore";
	import UImage from "../../uview-ui/components/u-image/u-image";
	import MukeItemCell from "./components/mukeItemCell";
	import YunkeItemCell from "./components/yunkeItemCell";
	import EbookItemCell from "./components/ebookItemCell";
	import {
		mixin
	} from "@/common/mixin"

	export default {
		mixins: [mixin],
		components: {
			EbookItemCell,
			YunkeItemCell,
			MukeItemCell,
			UImage,
			LoadMore
		},
		data() {
			return {
				barStyle: {
					"z-index": '10'
				},
				activeItemStyle: {
					"font-size": "36rpx",
					"color": "#000",
					"font-weight": "500"
				},

				keyword: "",
				list: [{
						name: '教材',
						dataList: []
					},
					{
						name: '电子书',
						dataList: []
						// count: 12
					},
					{
						name: '云课',
						dataList: [],
						status: 'loading'
						// count: 12
					},
					{
						name: '慕课',
						dataList: [],
						status: 'loading'
						// count: 12
					}
				],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,

				// 教材
				tabbar: [],
				idx: 0, //
				scrollTop: 0, //tab标题的滚动条位置
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				searching: false
			};
		},
		onLoad(option) {
			this.fetchData(1)
			this.fetchData(2)
			this.fetchData(3)
			this.fetchCatalog();
		},
		onShow() {
			if (getApp().globalData.current !== -1) {
				this.swiperCurrent = getApp().globalData.current ?? 0;
				this.current = this.swiperCurrent;
				getApp().globalData.current = -1;
			}
		},
		computed: {

		},
		methods: {
			didTappedBack() {
				this.search("")
				this.goto('switchTab:/pages/home/home');
			},
			split(tags) {
				if ((tags ?? "") === "") return []
				return tags.split(',')
			},
			search(value) {
				console.log('搜索:' + value);
				this.keyword = value;
				this.searching = (value ?? '').length > 0;

				this.fetchDataAtIndex(this.tabbar[this.idx].id, this.idx, this.searching);
				this.fetchData(1, 1, this.searching)
				this.fetchData(2, 1, this.searching)
				this.fetchData(3, 1, this.searching)
			},
			reload() {
				this.search("");
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if (index === this.idx) return;

				if (this.tabbar[index].dataList?.length === 0) {
					this.fetchDataAtIndex(this.tabbar[index].id, index)
				}

				this.idx = index;
				// // 如果为0，意味着尚未初始化
				// if (this.menuHeight === 0 || this.menuItemHeight === 0) {
				// 	await this.getElRect('menu-scroll-view', 'menuHeight');
				// 	await this.getElRect('u-tab-item', 'menuItemHeight');
				// }
				// // 将菜单菜单活动item垂直居中
				// this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			didSelect(item) {
				this.goto(`/pages/mall/textbookDetail?obj=${JSON.stringify(item)}`)
			},
			reachBottom() {
				if (this.current === 0) {
					if (this.tabbar[this.idx].status === 'nomore') return;

					this.tabbar[this.idx].page += 1;
					this.fetchDataAtIndex(this.tabbar[this.idx].id, this.idx, this.searching)
				} else {
					if (this.list[this.current].status === 'nomore') return;

					this.fetchData(this.current, this.list[this.current].current + 1, this.searching);
				}
			},
			arr1to2(arr, number) {
				var arr2 = [];
				let len = arr.length;
				for (let i = 0, j = 0; i < len; i += number, j++) {
					arr2[j] = arr.splice(0, number);
				}
				return arr2;
			},
			fetchCatalog() {
				this.$u.post('/subject/subject/listAll', {})
					.then(response => {
						response.forEach(item => {
							item.status = 'loading'
							item.page = 1
							item.dataList = []
						})
						this.tabbar = response;

						if (this.tabbar.length > 0) this.fetchDataAtIndex(this.tabbar[0].id, 0)
					})
			},
			fetchDataAtIndex(subjectId, index, search = false) {
				let max = 20;
				let page = this.tabbar[index].page;
				this.$u.post('/book/bookApp/getRecoBooks', {
					page: page,
					pagesize: search ? 9999 : max,
					subjectId: !search ? subjectId : '',
					keyword: search ? this.keyword : ''
				}).then(response => {
					console.log(response);
					if (search) {
						response.forEach(each => {
							each.title = this.replace(each.textbookName, this.keyword)
						})
						this.list[0].dataList = response;
						this.list[0].status = 'nomore';
					} else {
						if (page === 1) this.tabbar[index].dataList = response;
						else this.tabbar[index].dataList.push(...response)

						this.tabbar[index].status = response.length >= max ? 'loading' : 'nomore';
					}
				}).catch(error => {
					console.log(error);
					this.$u.toast('网络请求失败')
				})
			},
			fetchData(idx, page = 1, search = false) {
				this.searching = search;
				let url;
				let params;
				switch (idx) {
					case 1:
						url = 'ebook/ebookApp/list';
						params = {
							pageNo: page,
							pageSize: 10
						}
						break;
					case 2:
						url = '/cloudCourse/list';
						params = {
							type: 3,
							pageSize: 10,
							pageNo: page
						};
						break;
					case 3:
						url = '/openccourse/openCcourse/listCcourse';
						params = {
							type: 1,
							pageSize: 10,
							pageNo: page
						};
						break;
				}

				if (this.searching) params['keyword'] = this.keyword;
				this.$u.post(url, params).then(response => {
					if (page === 1) this.list[idx].dataList = [];

					if (idx === 2) {
						if (this.searching) this.format(response, idx);

						this.list[idx].dataList.push(...response)
						this.list[idx].current = page;
						this.list[idx].status = (response ?? []).length < 10 ? 'nomore' : 'loading';
						this.list[idx].pages += ((response ?? []).length < 10 ? 0 : 1);

						console.log(response);
						console.log(this.list[idx]);
					} else {
						if (this.searching) this.format(response.records, idx);

						this.list[idx].current = response.current;
						this.list[idx].pages = response.pages;
						if (response.current === 1) {
							this.list[idx].dataList = response.records;
						} else {
							this.list[idx].dataList.push(...response.records)
						}
						if (idx === 1) {
							this.list[idx].datas = this.arr1to2([...this.list[idx].dataList], 3);
							this.list[idx].status = (response.records ?? []).length < 10 ? 'nomore' : 'loading';
							console.log(this.list[idx])
						} else {
							this.list[idx].status = response.current >= response.pages ? 'nomore' : 'loading';
						}
					}
				})
			},
			format(array, index) {
				array.forEach(each => {
					if (index === 1) each.title = this.replace(each
						.tname, this.keyword)
					else if (index === 2) each.title = this.replace(each
						.ccourseName, this.keyword)
					else if (index === 0 || index === 3) each.title = this.replace(each
						.name, this.keyword)
				})
			},
			// tab栏切换
			change(index) {
				console.log('change');
				this.swiperCurrent = index;

				this.searching = (this.keyword ?? '').length > 0;
				if (index !== 0) this.fetchData(index, 1, this.searching);
				else this.fetchDataAtIndex(this.tabbar[this.idx].id, this.idx, this.searching)
			},
			transition({
				detail: {
					dx
				}
			}) {
				// this.$refs.uTabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			}
		}
	}
</script>

<style>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #F8F8F7;
	}

	/* #endif */
</style>

<style lang="scss">
	::v-deep .u-empty {
		border-radius: 24rpx !important;
	}

	::v-deep .u-scroll-bar {
		height: 100% !important;
		overflow: initial;
		background: url(@/static/images/mall_selected@2x.png) 20rpx 40rpx no-repeat;
		background-size: 42rpx 40rpx;
		background-color: rgba(220, 20, 60, 0.0) !important;
	}

	::v-deep .u-search {
		padding: 10rpx 26rpx 0 26rpx !important;
	}

	::v-deep .u-tabs-item {
		font-weight: bold !important;
	}

	::v-deep .u-image__image {
		background: #D8D8D8;
		overflow: hidden;
	}

	::v-deep .u-size-default {
		padding: 4rpx 16rpx !important;
		line-height: 34rpx !important;
	}

	::v-deep .u-tabs-scorll-flex {
		height: 140rpx;
		align-items: center;
	}

	::v-deep .u-empty {
		background-color: #F8F8F7;
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - env(safe-area-inset-top) - var(--window-bottom) - 88rpx - 88rpx);
		// height: calc(100vh - var(--window-top) - 198rpx);
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	.page_box {
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.05);
		border-radius: 24rpx;
		//margin: 26rpx 26rpx 0rpx 28rpx;
		margin: 0rpx 26rpx;

		.goods-item1 {
			//padding: 34rpx 28rpx 0 28rpx;
			padding: 26rpx 26rpx 26rpx 18rpx;
			// border-bottom: solid 2rpx #EEEEEE;

			text:first-child {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: black;
				line-height: 40rpx;
			}

			text:nth-child(2) {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #888888;
				line-height: 34rpx;
				margin-top: 8rpx;
			}

			.price {
				font-size: 36rpx !important;
				font-weight: bold !important;
				color: #0E86C6 !important;
			}

			.coin {
				font-size: 24rpx !important;
				color: #0E86C6 !important;
			}
		}
	}

	.more {
		height: 112rpx;
	}

	// 教材
	.u-tab-view {
		width: 286rpx;
		height: 100%;
	}

	::v-deep .menu-scroll-view {
		.uni-scroll-view {
			// background: #FFFFFF;
		}
	}

	.u-tab-item {
		height: 106rpx;
		background: #F9F9F9;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #999999;
		font-weight: 400;
		line-height: 1;
	}

	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 28rpx;
		font-weight: 500;
		background-color: white !important;
		background: url('@/static/images/mall_tab_item_active@2x.png') no-repeat;
		background-position: 6rpx 50%;
		background-size: 8rpx 60rpx;

		// &::before {
		// 	width: 8rpx;
		// 	height: 56rpx;
		// 	content: '';
		// 	background-color: #99C0F9;
		// 	border-radius: 4rpx;
		// 	position: absolute;
		// 	margin-right: 160rpx;
		// 	margin-bottom: 6rpx;
		// }
	}

	.right-box {
		height: 100%;
		//border-radius: 0rpx 24rpx 24rpx 24rpx;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0px 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
		// background-color: white;
	}
</style>
