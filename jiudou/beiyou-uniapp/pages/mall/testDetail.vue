<template>
	<view class="page wrap u-flex-col u-col-center">
		<view class="box u-flex-col">
			<text class="title">{{ obj.name }}</text>
			<text class="subtitle">本测验共{{ info.subjectAmount }}道选择题，每道题1分</text>
			<text class="info" style="margin-top: 30rpx;">题目数量<text
					class="number">{{info.subjectAmount || 0}}</text>道</text>
			<text class="info">提交次数<text class="number">{{info.answerAmount || 0}}</text>次</text>
			<text class="info">最终得分<text class="number">{{info.score || 0}}</text>分</text>
			<u-button :disabled="(info.subjectAmount || 0) === 0" class="button" :custom-style="info" :hair-line="false"
				@click="goto(`/pages/mall/test?obj=${JSON.stringify(obj)}&testing=1`)">再次检验</u-button>
			<text class="tips">课程结束后将无法测验，请关注课程状态</text>
		</view>
		<view class="box" v-if="list.length > 0">
			<text class="title" style="margin-bottom: 14rpx;">历史测验</text>
			<view class="u-flex" v-for="(item,index) in list" :key="index">
				<view class="item u-flex u-row-between">
					<uni-dateformat :date="item.createTime" format="yyyy-MM-dd hh:mm" />
					<text>{{item.score}}分</text>
				</view>
				<u-button class="button1" :hair-line="false" :custom-style="info" @click="goto(`/pages/mall/test?obj=${JSON.stringify(obj)}&testing=0&history=${item.answer}`)">查看答卷</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import UniDateformat from "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat";
	import {
		mixin
	} from "@/common/mixin"
	export default {
		components: {
			UniDateformat
		},
		mixins: [mixin],
		data() {
			return {
				obj: null,
				info: {
					display: 'inline-flex',
					border: 'none'
				},
				info: null,
				list: []
			};
		},
		methods: {
			fetchData() {
				this.$u.post('/openccourse/openPaperStu/getAnswer', {
					courseId: this.obj.courseId,
					catalogId: this.obj.id
				}).then(response => {
					this.info = response;
					this.list = this.info.stuAnswers ?? []
					this.list.forEach(item => {
						let array = JSON.parse(item.answer);
						var s = 0;
						array.forEach(function (value) {
							s += Number(value.score);
							});

						item.score = s;
					})
				})
			}
		},
		onLoad(option) {
			this.obj = JSON.parse(option.obj);
			console.log(this.obj);
		},
		onShow() {
			this.fetchData()
		}
	}
</script>

page {
height: 100%;
background-color: #F8F8F7;
}

<style>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #F8F8F7;
	}

	/* #endif */
</style>

<style lang="scss">
	::v-deep .u-btn--default--disabled {
		background-color: rgba(14, 134, 198, 0.4) !important;
	}
	
	.wrap {
		.box {
			background: #FFFFFF;
			box-shadow: 0px 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
			border-radius: 24rpx;
			width: 696rpx;
			margin-top: 20rpx;
			padding: 50rpx 42rpx 50rpx 42rpx;

			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #000000;
				line-height: 44rpx;

				&::before {
					width: 12rpx;
					height: 12rpx;
					content: '';
					background-color: #1374CB;
					border-radius: 50%;
					display: inline-block;
					margin-right: 10rpx;
					margin-bottom: 6rpx;
				}
			}

			.subtitle {
				margin-top: 10rpx;
				margin-left: 22rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
				line-height: 34rpx;
			}
		}

		.info {
			font-size: 32rpx;
			font-weight: 500;
			color: #000000;
			line-height: 66rpx;
			margin-left: 22rpx;
		}

		.number {
			font-size: 44rpx;
			font-weight: 600;
			color: #1374CB;
			line-height: 60rpx;
			margin-left: 20rpx;
			margin-right: 20rpx;
		}

		.button {
			background-color: #0E86C6;
			border-radius: 22px;
			height: 90rpx;
			width: 612rpx;
			margin-top: 48rpx;
			color: white;
			border: 0;
		}

		.tips {
			width: 100%;
			margin-top: 30rpx;
			text-align: center;
			font-size: 24rpx;
			font-weight: 400;
			color: #61B4FF;
			line-height: 34rpx;
		}

		.item {
			width: 444rpx;
			height: 86rpx;
			background: #F7F8FC;
			border-radius: 20rpx;
			padding-left: 22rpx;
			padding-right: 64rpx;
			margin: 10rpx 22rpx 10rpx 0rpx;
		}

		.button1 {
			background: #DEEEF7;
			border-radius: 20rpx;
			border: 0;
			font-size: 28rpx;
			font-weight: 500;
			color: #0E86C6;
			line-height: 40rpx;
		}
	}
</style>
