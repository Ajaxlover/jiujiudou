<template>
	<view class="page wrap u-flex-col">
		<view class="section1 u-flex">
			<view class="item u-flex-col u-col-center">
				<text class="title">今日学习</text>
				<text class="number">{{obj.todayStudyNum || 0}}<text class="subtitle"> 节课</text></text>
			</view>
			<view class="item u-flex-col u-col-center">
				<text class="title">本周学习</text>
				<text class="number">{{obj.weekStudyNum || 0}}<text class="subtitle"> 节课</text></text>
			</view>
		</view>
		<view class="section2">
			<text class="head">最近学习</text>
			<scroll-view :scroll-x="true" scroll-left="120" class="scroll">
				<study-item-cell class="item" v-for="(item, index) in recent" :key="index" :obj="item " />
				<u-empty text="您还未购买任何课程，去商城看看吧~" icon-size="310"
					:src="require('@/static/images/mine_ccourse_ccourse@2x.png')" margin-top="30"
					:show="recent.length === 0"></u-empty>
			</scroll-view>
		</view>
		<view class="section3">
			<text class="head">已购课程</text>
			<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
				<yunke-item-cell class="item" v-for="(item, index) in cCourse" :key="index" :obj=item :search="false" />
				<u-empty text="您还未购买任何课程，去商城看看吧~" icon-size="310"
					:src="require('@/static/images/mine_ccourse_ccourse@2x.png')" margin-top="30"
					:show="cCourse.length === 0"></u-empty>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import YunkeItemCell from "./components/yunkeItemCell"
	import StudyItemCell from "./components/studyItemCell.vue"
	export default {
		components: {
			YunkeItemCell,
			StudyItemCell
		},
		data() {
			return {
				obj: {},
				recent: [],
				cCourse: [],
				released: []
			};
		},
		methods: {
			fetchData() {
				this.$u.post('/member/ccourse', {})
					.then(response => {
						console.log(response);
						this.obj = response;
						this.recent = response.recent ?? [];
						this.cCourse = response.cCourse ?? [];
						this.released = response.released ?? [];
					})
			},
			reachBottom() {
				// 此tab为空数据
				// if (this.current !== 2) {
				// 	if (this.list[this.current].current === this.list[this.current].pages) return;

				// 	setTimeout(() => {
				// 		this.fetchData(this.current, this.list[this.current].current + 1);
				// 	}, 1200);
				// }
			},
			didSelect() {

			}
		},
		onLoad() {
			this.fetchData()
		}
	}
</script>

<style lang="scss">
	.wrap {
		.section1 {
			margin: 10rpx 25rpx 10rpx 25rpx;
			width: 700rpx;
			height: 166rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.05);
			border-radius: 24rpx;

			.item {
				width: calc(100% / 2);

				.title {
					font-size: 22rpx;
					font-weight: 400;
					color: #999999;
					line-height: 32rpx;
				}

				.number {
					font-size: 64rpx;
					font-weight: 500;
					color: #000000;
					line-height: 90rpx;
				}

				.subtitle {
					font-size: 22rpx;
					font-weight: 400;
					color: #000000;
					line-height: 32rpx;
					margin-left: 4rpx;
				}
			}
		}

		.section2 {
			margin: 10rpx 25rpx 10rpx 25rpx;
			width: 700rpx;
			min-height: 362rpx;

			.item {
				
			}

			.scroll {
				white-space: nowrap;
			}
		}

		.section3 {
			margin: 10rpx 25rpx 10rpx 25rpx;
			width: 700rpx;
			min-height: 362rpx;

			.item {
				margin: 30rpx 0;
				background: #FFFFFF;
				box-shadow: 0px 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.05);
				border-radius: 24rpx;
			}
		}

		.head {
			font-size: 28rpx;
			font-weight: 600;
			color: #000000;
			line-height: 40rpx;
		}
	}
</style>
