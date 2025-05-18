<template>
	<view class="page wrap u-flex-col">
		<view class="content u-flex-col">
			<u-swiper :list="obj" :autoplay="false" height="1000" :current="current" @change="change" name="resUrl" />
		</view>
		<view class="foot u-flex u-row-between">
			<view class="item" @click="showCatalog = true">
				<image src="../../static/images/bookshelf_fav@2x.png"
					style="width: 36rpx; height: 36rpx; margin-right: 6rpx"></image>
				<view class="TextGroup16 u-flex-col">
					<text class="word28">目录</text>
				</view>
			</view>
			<view class="item" @click="popupComment">
				<image src="../../static/images/mall_viewer_pen@2x.png"
					style="width: 36rpx; height: 36rpx; margin-right: 6rpx"></image>
				<view class="TextGroup16 u-flex-col">
					<text class="word28">笔记</text>
				</view>
			</view>
		</view>

		<u-popup width="500" v-model="showCatalog">
			<view class="catalog u-flex-col" v-if="detail && detail.catalog">
				<view class="title">目录</view>
				<u-collapse :head-style="headStyle">
					<u-collapse-item :title="item.name" v-for="(item, index) in detail.catalog" :key="index">
						<view class="collapse-item" v-for="(each, idx) in item.cataList" :key="idx"
							@click="didSelect(each)">{{ each.name}}</view>
					</u-collapse-item>
				</u-collapse>
			</view>
		</u-popup>
		<u-popup border-radius="24" mode='bottom' closeable v-model="showComment">
			<view class="comment u-flex-col">
				<view class="head">读书笔记</view>
				<view class="content">
					<scroll-view scroll-y style="height: 100%; width: 100%;" @scrolltolower="reachBottom">
						<view>
							<view class="item" v-for="(each, index) in commentList" :key="index">
								{{each.content}}
							</view>
							<u-loadmore v-if="commentList.length > 0" :status="commentStatus"></u-loadmore>
						</view>
					</scroll-view>
				</view>
				<u-empty text="当前暂无笔记~" icon-size="312" :src="require('@/static/images/mall_ebook_nomore@2x.png')"
					margin-top="30" :show="commentList.length === 0"></u-empty>
				<view class="foot u-flex u-col-center">
					<view class="u-flex u-col-center" style="height: 80rpx"
						@click="goto(`/pages/mall/note?ebookId=${ebookId}&catalogId=${catalogId}&page=${current}`)">
						<image :src="require('@/static/images/mall_comment@2x.png')"
							style="width: 34rpx; height: 34rpx; margin-left: 32rpx; margin-right: 30rpx"></image>
						<text>说点什么吧</text>
					</view>
				</view>
			</view>
		</u-popup>
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
				ebookId: '',
				catalogId: null,
				obj: [],
				detail: null,
				current: 0,
				showCatalog: false,
				showComment: false,
				commentList: [],
				commentPage: 1,
				commentStatus: 'loading',

				headStyle: {
					'height': '86rpx',
					'background': '#F6F6F6',
					'border-radius': '20rpx',
					'margin': '10rpx 0',
					'padding': '0 22rpx',
					'color': 'black',
					'font-weight': 'bold',
					'font-size': '28rpx'
				},
			};
		},
		methods: {
			getArrayIndex(arr, obj) {
				var i = arr.length;
				while (i--) {
					if (arr[i].id === obj.id) {
						return i;
					}
				}
				return -1;
			},
			popupComment() {
				this.showComment = true;
				this.fetchNotes()
			},
			didSelect(item) {
				this.current = this.getArrayIndex(this.obj, item);
				console.log(this.current);
				// this.obj = item.cataList;
				this.updateTitle()
				this.$forceUpdate()
				this.showCatalog = false
			},
			updateTitle() {
				uni.setNavigationBarTitle({
					title: (this.current + 1) + '/' + this.obj.length
				})
			},
			fetchData() {
				this.$u.post('/ebook/ebookApp/preRead', {
					ebookId: this.ebookId
				}).then(response => {
					this.detail = response;
					this.reset(this.detail.catalog)
					console.log(this.detail);
				})
			},
			// 查看笔记列表
			fetchNotes() {
				this.$u.post('ebook/ebNotes/list', {
					ebookId: this.ebookId,
					catalogId: this.catalogId,
					pageNo: this.commentPage,
					pageSize: 10
				}).then(response => {
					this.commentStatus = this.commentPage >= response.pages ? 'nomore' : 'loading';
					if (this.commentPage === 1) this.commentList = response.records;
					else this.commentList.push(...response.records);

					this.commentPage += 1;
				})
			},
			reset(array) {
				array.forEach(item => {
					item.name = item.catelogcontent;
					if (item.cataList.length > 0) {
						item.open = false;
						this.reset(item.cataList);
					} else {
						item.cataList = this.detail.ebook.filter(each => each.nodeId === item.catalogid);
						if (item.cataList.length > 0) {
							item.open = false;
							item.cataList.forEach(i => {
								i.name = i.resName;
								i.catalogUrl = i.resUrl;
							})
						}
					}
				})
			},
			change(idx) {
				uni.setNavigationBarTitle({
					title: idx + 1 + '/' + this.obj.length
				})
			},
			reachBottom() {
				this.fetchNotes()
			}
		},
		onLoad(option) {
			this.ebookId = option.ebookId;
			this.catalogId = option.catalogId;
			this.obj = JSON.parse(option.obj)
			console.log(this.obj);
			console.log(this.catalogId);
			this.fetchData()
			this.fetchNotes()

			uni.setNavigationBarTitle({
				title: 1 + '/' + this.obj.length
			})

			uni.$on('commit', () => {
				this.commentPage = 1;
				this.fetchNotes();
			})
		},
		onUnload() {
			uni.$off('commit');
		}
	}
</script>

<style lang="scss">
	::v-deep .uni-swiper {
		height: 200px !important;
	}
	::v-deep .u-swiper-indicator {
		margin-bottom: 10rpx !important;
	}
	::v-deep .u-indicator-item-round {
		width: 8rpx !important;
		height: 8rpx !important;
	}
	::v-deep .u-indicator-item-round-active {
		width: 18rpx !important;
	}
	
	.wrap {
		display: flex;
		flex-direction: column;
		height: 100%;

		.content {
			flex: 1;
			justify-content: center;
		}

		.foot {
			width: 100%;
			bottom: env(safe-area-inset-bottom);
			height: calc(82rpx);

			.item {
				height: 82rpx;
				background-color: white;
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				.word28 {
					font-size: 28rpx;
					font-weight: 400;
					color: #000000;
					line-height: 40rpx;
				}
			}
		}
	}

	.catalog {
		padding: 20rpx 26rpx;
		//height: 100%;
		height: auto;

		.title {
			font-size: 28rpx;
			font-weight: 400;
			color: #333333;
			line-height: 40rpx;
			margin-bottom: 30rpx;
		}

		.collapse-item {
			margin: 0 22rpx;
			height: 78rpx;
			font-size: 26rpx;
			font-weight: 400;
			color: #333333;
			border-bottom: 2rpx solid #E7EBF2;
			line-height: 78rpx;
		}
	}

	.comment {
		height: calc(750rpx + env(safe-area-inset-bottom));
		padding: 34rpx 26rpx;
		//background-color: #F9F9F9;
		background-color: white;

		.head {
			font-size: 28rpx;
			font-weight: 500;
			color: #000000;
			line-height: 40rpx;
		}

		.content {
			flex: 1;
			padding: 20rpx 0;

			.item {
				padding: 24rpx;
				border-radius: 24rpx;
				box-shadow: 0px 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.05);
				background-color: white;
				margin: 10rpx 0;
			}
		}

		.foot {
			height: calc(80rpx);
			background-color: #F7F8F9;
			border-radius: 12rpx;
			bottom: env(safe-area-inset-bottom);
		}
	}
</style>
