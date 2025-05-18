<template>
	<view class="page">
		<u-navbar :is-back="true" :background="background" title="" :border-bottom="false">
			<view class="slot-wrap">
				<u-search placeholder="书名/课程名/关键词" v-model="keyword" :show-action="false" @search="search" @change="searchChange" @blur="search"></u-search>
			</view>
		</u-navbar>
		<view class="wrap u-flex-col" style="margin: 0rpx 30rpx; padding: 30rpx 0" v-if="keyword.length === 0">
			<view class="history">
				<view class="u-flex u-row-between">
					<view class="head">搜索历史</view>
					<u-image width="24" height="26" :src="require('@/static/images/main_search_clean@2x.png')" @click="history = []"></u-image>
				</view>
				<view class="content">
					<u-tag v-for="(each, index) in history" :text="each" :key="index" @click="search(each)" />
				</view>
			</view>
			<view class="hotspots">
				<view class="u-flex u-row-between">
					<view class="head">大家都在搜</view>
				</view>
				<view class="content">
					<u-tag v-for="(each, index) in hotspots" :text="each.keyword" :key="index" @click="search(each.keyword)" />
				</view>
			</view>
			<view class="recommend">
				<view class="u-flex u-row-between">
					<view class="head">热门推荐</view>
				</view>
				<view class="content">
					<u-grid :col="4" :border="false">
						<u-grid-item v-for="(each, idx) in recommend" :key="idx" bg-color="#F8F8F7" @click="didSelectAtIndex(each)">
							<view class="item">
								<u-image width="142" height="202" :src="each.coverPic" shape="square" :border-radius="8">
									<u-loading slot="loading"></u-loading>
									<image slot="error" :src="require('@/static/images/img_error@2x.png')" style="width: 104rpx; height: 92rpx;"></image>
								</u-image>
							</view>
						</u-grid-item>
					</u-grid>
				</view>
			</view>
		</view>
		<view class="wrap u-flex-col" v-else>
			<view class="u-tabs-box">
				<u-tabs-swiper ref="uTabs" :current="current" :list="list" :is-scroll="false" :bar-style="barStyle" :bar-height="38" :bar-width="50" font-size="32"
					inactive-color="#666" :active-item-style="activeItemStyle" swiper-width="750" bg-color="#f9f9f9" @change="change">
				</u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item u-flex u-col-top">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<view class="page_box u-flex-col">
							<view class="goods-item1 u-flex-col" v-for="(each, ind) in list[0].dataList" :key="ind" @click="didSelect(each)">
								<view class="u-flex u-col-center">
									<view>
										<u-image width="140" height="184" borderRadius="8" :src="each.cover" shape="square">
											<u-loading slot="loading"></u-loading>
											<image slot="error" :src="require('@/static/images/img_error@2x.png')" style="width: 104rpx; height: 92rpx;;"></image>
										</u-image>
									</view>
									<view class="u-flex-col" style="margin-left: 26rpx; height: 184rpx;">
										<rich-text class="u-line-2" :nodes="each.title"></rich-text>
										<text style="flex: 1; margin-top: 14rpx;">{{ each.pubName }}</text>
										<!-- 	<view style="margin-bottom: 0rpx;">
                        <text class="price">26.10</text>
                        <text class="coin">学币</text>
                      </view> -->
									</view>
								</view>
							</view>
							<u-loadmore v-if="list[0].dataList.length > 0" status="nomore" margin-bottom="10" />
						</view>
						<u-empty text="暂无数据" mode="data" :show="list[0].dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<view class="page_box u-flex-col u-col-center">
							<ebook-item-cell v-for="(item, index) in list[1].dataList" :obj="item" :key="index" :search="true">
							</ebook-item-cell>
							<u-loadmore v-if="list[1].dataList.length > 0" status="nomore" margin-bottom="10" />
						</view>
						<u-empty text="暂无数据" mode="data" :show="list[1].dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<view class="page_box u-flex-col u-col-center">
							<yunke-item-cell v-for="(item, index) in list[2].dataList" :key="index" :obj=item :search="true" />
							<u-loadmore v-if="list[2].dataList.length > 0" status="nomore" margin-bottom="10" />
						</view>
						<u-empty text="暂无数据" mode="data" :show="list[2].dataList.length === 0"></u-empty>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import UGridItem from "../../uview-ui/components/u-grid-item/u-grid-item";
	import YunkeItemCell from "../mall/components/yunkeItemCell"
	import EbookItemCell from "./components/ebookItemCell";
	import {
		mixin
	} from "@/common/mixin"
	export default {
		mixins: [mixin],
		components: {
			UGridItem,
			YunkeItemCell,
			EbookItemCell
		},
		data() {
			return {
				background: {
					backgroundColor: '#F8F8F7',

					// 导航栏背景图
					// background: 'url(https://cdn.uviewui.com/uview/swiper/1.jpg) no-repeat',
					// 还可以设置背景图size属性
					// backgroundSize: 'cover',

					// 渐变色
					// backgroundImage: 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
				},
				keyword: '',
				history: [],
				hotspots: [],
				recommend: [],

				barStyle: {
					"z-index": '10'
				},
				activeItemStyle: {
					"font-size": "36rpx",
					"color": "#000",
					"font-weight": "500"
				},
				list: [{
						name: '教材',
						dataList: []
					},
					{
						name: '电子书',
						dataList: []
					},
					{
						name: '云课',
						dataList: []
					}
				],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
			};
		},
		methods: {
			didSelectAtIndex(item) {
				if (item.type === 1) { // 电子书
					if (item.hasOwnProperty('linkId')) {
						item.id = item.linkId;
						item.tname = item.name;
					}
					this.goto(`/pages/mall/ebookDetail?obj=${JSON.stringify(item)}`)
				} else if (item.type === 2) { // 教材
					if (item.hasOwnProperty('linkId')) {
						item.textbookId = item.linkId;
						item.textbookName = item.name;
					}
					this.goto(`/pages/mall/textbookDetail?obj=${JSON.stringify(item)}`)
				}
			},
			fetchData() {
				this.$u.post('/searchAll', {
					keyword: this.keyword,
					page: 1,
					pagesize: 1000
				}).then(response => {
					response.book.map((each, idx) => {
						if (each.textbookName.includes(this.keyword)) each.title = this.replace(each
							.textbookName, this.keyword)
						else each.title = each.textbookName;
					})
					response.ebook.map((each, idx) => {
						if (each.tname.includes(this.keyword)) each.title = this.replace(each
							.tname, this.keyword)
						else each.title = each.tname;
					})
					response.ccourses.map((each, idx) => {
						if (each.ccourseName.includes(this.keyword)) each.ccourseName = this.replace(each
							.ccourseName, this.keyword)
					})

					this.$set(this.list[0], 'dataList', response.book);
					this.$set(this.list[1], 'dataList', response.ebook);
					this.$set(this.list[2], 'dataList', response.ccourses);
				})
			},
			search(value) {
				this.keyword = value;
				if (!this.history.includes(value) && value.length > 0) this.history.push(value);
				this.fetchData();
			},
			searchChange(val) {

			},
			didSelect(item) {
				uni.navigateTo({
					url: `/pages/mall/textbookDetail?obj=${JSON.stringify(item)}`
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
		},
		onLoad() {
			let value = uni.getStorageSync('search_history') ?? JSON.stringify([])
			if (value.length > 0) this.history = JSON.parse(value);
			else this.history = []

			this.$u.post('/preSearch', {}).then(response => {
				console.log(response)
				this.hotspots = response.hotspots;
			}).catch(error => {
				console.log(error)
			})

			this.$u.post('/ebook/ebRecommend/listRecommend', {
				pageSize: 20,
				pageNo: 1
			}).then(response => {
				this.recommend = response;
			})
		},
		onUnload() {
			uni.setStorageSync('search_history', JSON.stringify(this.history));
		}
	}
</script>

<style lang="scss">
	::v-deep .u-scroll-bar {
		background: url(@/static/images/bookshelf_check@2x.png) -2rpx -2rpx;
		background-size: 52rpx 40rpx;
		background-color: rgba(220, 20, 60, 0.0) !important;
	}

	::v-deep .u-search {
		border: 3.5rpx solid rgba(14, 134, 198, 1);
		border-radius: 34rpx;
	}

	.slot-wrap {
		width: 100%;
		margin-right: 26rpx;
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 88rpx - env(safe-area-inset-top) - env(safe-area-inset-bottom));
		

		.head {
			font-size: 26rpx;
			font-weight: 500;
			color: #000000;
			line-height: 36rpx;
			margin-bottom: 38rpx;
		}

		.history {
			::v-deep .u-tag {
				height: 60rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #464649;
				line-height: 36rpx;
				margin-right: 20rpx;
			}

			::v-deep .u-mode-light-primary {
				background-color: #ECECEC;
				border-radius: 30rpx;
				border: initial;
			}
		}

		.hotspots {
			margin-top: 80rpx;

			::v-deep .u-tag {
				height: 60rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #464649;
				line-height: 36rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
			}

			::v-deep .u-mode-light-primary {
				background-color: white;
				border-radius: 18rpx;
				border: initial;
				box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05);
			}
		}

		.recommend {
			margin-top: 52rpx;

			::v-deep .u-grid-item-box {
				padding: 0 !important;
			}
		}
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
			border-bottom: solid 2rpx #EEEEEE;

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

	.item {
		margin-bottom: 38rpx;
	}
</style>
