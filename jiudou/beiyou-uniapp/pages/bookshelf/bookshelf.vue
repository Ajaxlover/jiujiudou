<template>
	<view classs="page u-flex-col">
		<u-navbar :is-back="true" :custom-back="didTappedBack" title="我的书架" :background="{background: '#F8F8F7'}" title-color="black" title-size="32" :border-bottom="false">
			<view class="navbar-right" slot="right">
				<view class="message-box right-item" @click="scanCode">
					<u-icon :name="require('@/static/images/main_scan@2x.png')" size="36"></u-icon>
				</view>
				<view class="dot-box right-item" @click="show = true">
					<u-icon :name="require('@/static/images/bookshelf_more@2x.png')" size="46"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="u-flex u-col-center">
			<!-- <u-icon v-if="keyword.length !== 0" :name="require('@/static/nav-back@2x.png')" width="20" height="36" style="margin-left: 30rpx; margin-right: 10rpx; padding-top: 10rpx" @click="reload" /> -->
			<u-search placeholder="书名/课程名/关键词" v-model="keyword" :show-action="false" bg-color="#ffffff" @search="search" @clear="search" />
		</view>
		<!-- <u-search placeholder="书名/课程名/关键词" v-model="keyword" :show-action="false" bg-color="#ffffff" @search="search" /> -->
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper ref="uTabs" :current="current" :list="list" :is-scroll="false" :bar-style="barStyle"
					:bar-height="140" :bar-width="50" font-size="32" inactive-color="#666"
					:active-item-style="activeItemStyle" swiper-width="750" bg-color="#f9f9f9" @change="change">
				</u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" duration="0"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<bookshelf-item style="height: 388rpx" :editing="editing" :obj="each"
							v-for="(each, idx) in list[0].dataList" :key="idx" @detail="didSelect" :search="searching">
						</bookshelf-item>
						<u-empty text="暂无数据" mode="data" :show="list[0].dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<bookshelf-item style="height: 388rpx" :editing="editing" :obj="each"
							v-for="(each, idx) in list[1].dataList" :key="idx" @detail="didSelect" :search="searching">
						</bookshelf-item>
						<u-empty text="暂无数据" mode="data" :show="list[1].dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<bookshelf-item style="height: 388rpx" :editing="editing" :obj="each"
							v-for="(each, idx) in list[2].dataList" :key="idx" @detail="didSelect" :search="searching">
						</bookshelf-item>
						<u-empty text="暂无数据" mode="data" :show="list[2].dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
			</swiper>
			<view class="float-bottom u-flex" v-if="editing">
				<view class="item" @click="editing = false">取消</view>
				<u-line color="#EEEEEE" direction="col" length="50" />
				<view class="item" @click="remove">移出书架</view>
			</view>
		</view>

		<u-popup mode="center" v-model="show" width="164" duration="0">
			<view class="content u-flex-col u-col-bottom">
				<view class="menu-item" @click="scanCode">添加</view>
				<view class="menu-item" @click="didManager">管理</view>
				<view class="menu-item" @click="didHistory">历史</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import BookshelfItem from "./components/bookshelfItem";
	import {
		mixin
	} from "@/common/mixin"
	export default {
		mixins: [mixin],
		components: {
			BookshelfItem
		},
		data() {
			return {
				barStyle: {
					// background: "url(../../static/images/bookshelf_check@2x.png) -2rpx -2rpx",
					// background: "url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng4cb6c3ff051a2b30d3a35fec85a938cf9d21af51a356a8000d4b098bcd4fbe6d) -2rpx -2rpx",
					"z-index": '10'
				},
				activeItemStyle: {
					"font-size": "36rpx",
					"color": "#000",
					"font-weight": "500"
				},
				editing: false,
				selected: [], // 待编辑的项

				keyword: "",
				list: [{
						name: '全部',
						dataList: []
					},
					{
						name: '教材',
						dataList: []
					},
					{
						name: '电子书',
						dataList: []
						// count: 12
					}
				],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				show: false,
				searching: false
			};
		},
		onLoad() {
			this.loadLocalDatas()
			this.fetchData(0)
			this.fetchData(1)
			this.fetchData(2)
			
			uni.$on('update', () => {
				this.removeAllLocalDatas()
				
				this.fetchData(0)
				this.fetchData(1)
				this.fetchData(2)
			});
		},
		onHide() {
			this.editing = false;
		},
		onUnload() {
			uni.$off('update');
		},
		methods: {
			didTappedBack() {
				this.search("")
				this.goto('switchTab:/pages/home/home');
			},
			removeAllLocalDatas() {
				let uid = uni.getStorageSync('uid');
				let key = `bookshelf_time_${uid}_0`
				uni.setStorageSync(key, null)
				uni.setStorageSync(`bookshelf_datas_${uid}_0`, [])
				key = `bookshelf_time_${uid}_1`
				uni.setStorageSync(key, null)
				uni.setStorageSync(`bookshelf_datas_${uid}_1`, [])
				key = `bookshelf_time_${uid}_2`
				uni.setStorageSync(key, null)
				uni.setStorageSync(`bookshelf_datas_${uid}_2`, [])
			},
			loadLocalDatas() {
				let uid = uni.getStorageSync('uid');
				let tmp = uni.getStorageSync(`bookshelf_datas_${uid}_0`) ?? []
				let array = this.arr1to2(tmp, 2);
				this.list[0].dataList = array;
				
				tmp = uni.getStorageSync(`bookshelf_datas_${uid}_1`) ?? []
				array = this.arr1to2(tmp, 2);
				this.list[1].dataList = array;
				
				tmp = uni.getStorageSync(`bookshelf_datas_${uid}_2`) ?? []
				array = this.arr1to2(tmp, 2);
				this.list[2].dataList = array;
			},
			scanCode() {
				this.goto('/pages/home/scan?type=2')
			},
			reload() {
				this.search("")
			},
			search(value) {
				this.keyword = value;
				this.fetchData(0, true);
				this.fetchData(1, true);
				this.fetchData(2, true);
			},
			openMenu() {
				this.show = true;
			},
			didManager() {
				this.editing = !this.editing;
				this.show = false;
			},
			didHistory() {
				this.goto('/pages/bookshelf/deleteList')
				this.show = false;
			},
			didSelect(item) {
				if (this.editing) {
					// this.selected.push()
					var index = this.selected.indexOf(item);
					if (index > -1) this.selected.splice(index, 1)
					else this.selected.push(item)

					this.$set(item, 'check', !item.check)
				} else {
					if (Number(item.textbookId) > 0) {
						this.goto(`/pages/mall/ebookDetail?obj=${JSON.stringify(item)}`)
					} else {
						this.goto(`/pages/bookshelf/bookDetail?textbookId=${item.textbookId}`)
					}
				}
			},
			// 移除书架
			remove() {
				uni.showLoading({});
				let books = this.selected.map(item => {
					return {
						id: item.textbookId,
						type: Number(item.textbookId) > 0 ? 1 : 2
					};
				});
				this.$u.post('book/v1/textbook/removeBook', {
					books: JSON.stringify(books)
				}).then(response => {
					this.removeAllLocalDatas()
					
					this.fetchData(0)
					this.fetchData(1)
					this.fetchData(2)
				}).finally(() => {
					uni.hideLoading();
				})
			},
			arr1to2(arr, number) {
				var arr2 = [];
				let len = arr.length;
				for (let i = 0, j = 0; i < len; i += number, j++) {
					arr2[j] = arr.splice(0, number);
				}
				return arr2;
			},
			reachBottom() {
				// 此tab为空数据
				// if (this.current !== 2) {
				// 	setTimeout(() => {
				// 		this.fetchData(this.current);
				// 	}, 1200);
				// }
			},
			fetchData(idx, search = false) {
				this.searching = search;
				let uid = uni.getStorageSync('uid');
				let key = `bookshelf_time_${uid}_${idx}`
				let updated = search ? 0 : uni.getStorageSync(key) || 0;
				this.$u.post('/book/v1/textbook/updateBookShelf', {
					updated: 0, //idx === 0 ? 0 : updated,
					type: idx === 0 ? 3 : idx,
					keyword: this.keyword
				}).then(response => {
					if (!search) {
						if (response.bookUpdate.length > 0) {
							uni.setStorageSync(key, (new Date().getTime()));
							// if (idx === 1) {
							// 	let array = uni.getStorageSync(`bookshelf_datas_${uid}_${idx}`) === '' ? [] : uni.getStorageSync(`bookshelf_datas_${uid}_${idx}`)
							// 	array.push(...response.bookUpdate);
							// 	uni.setStorageSync(`bookshelf_datas_${uid}_${idx}`, array)
							// } else {
								uni.setStorageSync(`bookshelf_datas_${uid}_${idx}`, response.bookUpdate)
							// }
						}
					} else {
						response.bookUpdate.forEach((each, idx) => {
							if (each.tname.includes(this.keyword)) each.title = this.replace(each
								.tname, this.keyword)
						})
						console.log(response.bookUpdate);
					}
					
					let tmp = search ? (response.bookUpdate??[]) : (uni.getStorageSync(`bookshelf_datas_${uid}_${idx}`) ?? [])
					let array = this.arr1to2(tmp, 2);
					this.list[idx].dataList = array;
				})
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				// this.fetchData(index);
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.uTabs.setDx(dx);
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
	};
</script>

<style>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #F8F8F7;
	}

	/* #endif */
</style>

<style lang="scss" scoped>
	::v-deep .u-title {
		font-weight: 700 !important;
	}
	::v-deep .u-scroll-bar {
		background: url(@/static/images/bookshelf_check@2x.png) -2rpx 65rpx no-repeat;
		background-size: 52rpx 40rpx;
		background-color: rgba(220, 20, 60, 0.0) !important;
	}

	::v-deep .u-search {
		padding: 10rpx 26rpx 0 26rpx !important;
	}
	::v-deep .u-drawer {
		top: 88rpx !important;
	}
	::v-deep .u-mask {
		// top: var(--window-top) !important;
		top: 88rpx !important;
	}

	::v-deep .u-tabs-item {
		font-weight: bold !important;
	}

	::v-deep .u-drawer-center {
		justify-content: initial;
		align-items: flex-end !important;
	}
	
	::v-deep .u-tabs-scorll-flex {
		height: 140rpx;
		align-items: center;
	}
	::v-deep .u-drawer__scroll-view {
		.uni-scroll-view-content {
			width: 180rpx;
			height: 342rpx;
			background: url('@/static/images/bookshelf_menu@2x.png') no-repeat;
			background-size: 180rpx 342rpx;
		}
	}
	::v-deep .u-mode-center-box {
		background-color: initial;
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

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top) - 88rpx - 78rpx - 88rpx);
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	.float-bottom {
		position: fixed;
		width: 750rpx;
		height: 71rpx;
		background-color: white;
		bottom: var(--window-bottom);

		.item {
			width: 375rpx;
			height: 100%;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #000000;
			line-height: 71rpx;
			text-align: center;
		}
	}

	.content {
		padding: 36rpx 0;
	}

	.menu-item {
		font-size: 28rpx;
		font-weight: 400;
		color: #000000;
		line-height: 88rpx;
		height: 96rpx;
		width: 160rpx;
		text-align: center;
		padding-right: 10rpx;
		border-bottom: solid rgba(238, 238, 238, 0.5) 2rpx;
	}
</style>
