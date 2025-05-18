<template>
	<view class="page wrap u-flex-col">
		<view class="swiper-box">
			<swiper class="swiper" :duration="duration" :current="swiperIndex" :disable-programmatic-animation="true" @change="onChange" @animationfinish="onAnimationfinish">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<scroll-view scroll-y="true" class="swiper-scroll">
						<view class="swiper-item u-flex-col" @touchstart="clearAutoNextTopicTime">
							<view class="topic-content">
								<view class="u-flex-col">
									<view style="padding-right: 20rpx;" class="u-flex u-row-between u-row-center">
										<text class="type-label">
											{{topicIndex + 1}}/{{dataList.length}}{{item.tSubject | topicType}}
										</text>
										<view class="type-card u-flex u-row-center" @click="showPopup = true">
											<image :src="require('@/static/images/mall_test_card@2x.png')" style="height: 34rpx; width: 34rpx;"></image>
											<text class="type-card" style="margin-left: 10rpx;">答题卡</text>
										</view>
									</view>
									<u-parse class="title" :html="item.title"></u-parse>
								</view>
							</view>
							<view class="answer-sheet">
								<view class="item u-flex" v-for="(sheetItem,sheetIndex) in item.answerList" :key="sheetIndex" @tap="onAnswerSheet(sheetIndex)" :class="{
												'success':!item.testing && item.stuAnswer && (item.correctAnswer.indexOf(sheetItem.aOption) > -1),
												'error': !item.testing && item.stuAnswer && (item.stuAnswer == sheetItem.aOption) && (item.correctAnswer.indexOf(sheetItem.aOption) === -1),
												'active': item.testing && (item.stuAnswer == sheetItem.aOption)
											}">
									<u-parse :html="`${sheetItem.aOption}.${sheetItem.aText}`"></u-parse>
								</view>
							</view>
							<view class="answer-result" v-if="!item.testing && item.stuAnswer">
								<view>
									<text>标准答案：</text>
									<text style="color: black;">{{item.correctAnswer}}</text>
								</view>
								<view style="margin-top: 34rpx">
									<text>题目解析：</text>
									<text style="color: black;">{{item.analyse || '无'}}</text>
								</view>
							</view>
							<u-button v-else :custom-style="info" :hair-line="false" class="commit" @click="commit">提交</u-button>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<view class="panel-bottom">
			<view class="content">
				<u-popup v-model="showPopup" mode="bottom">
					<scroll-view class="topic-list" style="height: 700rpx;" border-radius="24" scroll-y="">
						<view class="list-box u-flex u-flex-wrap ">
							<view class="list-item" v-for="(item,index) in dataList" :key="index" @tap="pickerTopic(index)">
								<view class="u-flex u-row-center" :class="{
									'active':index == topicIndex,
									'done': item.testing ? ('stuAnswer'in item) : 0,
									'success': !item.testing && item.stuAnswer && (item.correctAnswer == item.stuAnswer),
									'error': !item.testing && item.stuAnswer && (item.correctAnswer != item.stuAnswer)
								}">{{index+1}}</view>
							</view>
						</view>
					</scroll-view>
				</u-popup>
			</view>
		</view>
	</view>
</template>

<script>
	import UPopup from "../../uview-ui/components/u-popup/u-popup";
	import UButton from "../../uview-ui/components/u-button/u-button";
	export default {
		components: {
			UButton,
			UPopup
		},
		// components: {uniIcons},
		data() {
			return {
				obj: null,
				dataList: [], // 数据源
				swiperList: [], // 轮播图数据列表
				swiperIndex: 0, // 轮播图当前位置
				isChange: false, // 是否切换
				topicIndex: 0, // 题目位置
				duration: 200, // 动画过渡时长
				showPopup: false, //弹窗是否显示
				answer: [], // 答案
				type: 1, // 1书架，2云课
				info: {
					display: 'inline-flex',
					border: 'none'
				},
				answerkey: null
			}
		},
		computed: {
			// 结果统计
			countResult() {
				let [success, error] = [0, 0];
				this.dataList.forEach((item) => {
					if (item.stuAnswer) {
						if (item.stuAnswer == item.correctAnswer) {
							success++;
						} else {
							error++;
						}
					}
				})
				return {
					success,
					error
				}
			},
			// 是否收藏
			isFavorite() {
				let item = this.dataList[this.topicIndex];
				if (item && item.favorite) {
					return true;
				}
				return false;
			}
		},
		filters: {
			topicType(type) {
				if (type == 1) {
					return '判断题';
				}
				if (type == 2) {
					return '单选题';
				}
				if (type == 3) {
					return '多选题';
				}
				return ''
			}
		},
		onLoad(option) {
			this.type = Number(option.type ?? 1);
			if (this.type === 1) {
				this.answerkey = option.answerkey;
				const valueKey = option.key;
				console.log(uni.getStorageSync(valueKey));
				this.answer = uni.getStorageSync(this.answerkey)?.length === 0 ? [] : JSON.parse(uni.getStorageSync(this.answerkey));

				this.dataList = uni.getStorageSync(valueKey);
				this.dataList.forEach(item => {
					let obj = item.answerList.find(item => item.isCorrect === 2);
					if (obj) {
						item.correctAnswer = obj.aOption;
						item.testing = true;
					} else {
						console.log(item);
					}

					if (this.answer.length > 0) {
						let obj = this.answer.find(each => each.subjectId === item.id)
						if (obj) item.stuAnswer = obj.stuAnswer;
						item.testing = (obj?.stuAnswer ?? '').length === 0;
					}
				})
				this.renderSwiper(0)
			} else { // 云课
				this.obj = JSON.parse(option.obj);
				this.$u.post('/cloudCourse/items', {
						catalogId: this.obj.id
					})
					.then(response => {
						this.dataList = response;
						this.dataList.forEach(item => {
							// let obj = item.answerList.find(item => item.isCorrect === 2);
							// item.answer = obj.aOption;
							item.testing = (item.stuAnswer ?? '').length === 0;
						})
						console.log(this.dataList)
						this.renderSwiper(0)
					})
			}
		},
		methods: {
			// 渲染 swiper
			renderSwiper(index) {
				let list = [];
				let current = 1;
				if (this.dataList[index - 1]) {
					list.push(this.dataList[index - 1]);
				} else {
					current = 0;
				}

				list.push(this.dataList[index])

				if (this.dataList[index + 1]) {
					list.push(this.dataList[index + 1]);
				}

				this.duration = 0;

				setTimeout(() => {
					this.swiperList = list;
					this.swiperIndex = current;

					setTimeout(() => {
						this.duration = 200;
					}, 100)
				}, 50)
			},
			// 轮播图切换
			onChange(e) {
				// 非触摸事件不做轮播图状态更新
				if (e.detail.source != "touch") return;

				// 标识已切换
				this.isChange = true;
				// 轮播图当前位置大于原来时则表示为下一题
				if (e.detail.current > this.swiperIndex) {
					this.topicIndex++;
				} else {
					// 轮播图当前位置小于原来时则表示为上一题
					this.topicIndex--;
				}

				// 更新轮播图位置数值，为更新时让 Vue 能监听到数据有改变
				this.swiperIndex = e.detail.current;
			},
			// 轮播图动画结束
			onAnimationfinish(e) {
				if (!this.isChange) return;

				this.isChange = false;
				setTimeout(() => {
					this.renderSwiper(this.topicIndex);
				}, 10);

			},
			// 选择题目
			pickerTopic(index) {
				this.topicIndex = index;
				this.renderSwiper(index);
				this.showPopup = false;
			},
			// 监听答题
			onAnswerSheet(index) {
				// if (this.type === 1 && !this.obj) {
					
				// } else if (this.swiperList[this.swiperIndex].stuAnswer) {
				// 	// 不能重复答题
				// 	return;
				// }
				// console.log(index,this.topicIndex,this.swiperIndex)
				let obj = this.swiperList[this.swiperIndex];
				let val = {
					subjectId: obj.id
				}
				console.log(obj);
				if (obj.tSubject === 3) {
					// 当前已选答案
					let array = obj.stuAnswer.split(',')
					let selectedValue = this.swiperList[this.swiperIndex].answerList[index].aOption;
					if (array.includes(selectedValue)) {
						array = array.pop(selectedValue);
					}

					this.$set(this.swiperList[this.swiperIndex], "stuAnswer", array.toString());
					val.stuAnswer = array.toString();
				} else {
					// 当前已选答案
					let selectedValue = this.swiperList[this.swiperIndex].answerList[index].aOption;
					this.$set(this.swiperList[this.swiperIndex], "stuAnswer", selectedValue);
					val.stuAnswer = selectedValue;
				}
			},
			// 清除自动跳到下一页延时器
			clearAutoNextTopicTime() {
				clearTimeout(this.autoNextTopicTime);
			},
			commit() {
				const item = this.swiperList[this.swiperIndex];
				if (this.type !== 1 && this.obj) {
					uni.showLoading()
					云课提交测验
					this.$u.get('/cloudCourse/submitAnswer', {
						catalogId: this.obj.id,
						catalogUuid: this.obj.catalogUuid,
						bankId: item.id,
						stuAnswer: item.stuAnswer
					}).then(response => {
						item.testing = false;
						this.$forceUpdate()
						this.$u.toast('提交成功');
					}).finally(() => {
						uni.hideLoading()
					})
				} else {
					let val = {
						subjectId: item.id,
						stuAnswer: item.stuAnswer
					}
					
					this.answer.push(val)
					uni.setStorageSync(this.answerkey, JSON.stringify(this.answer));
					
					item.testing = false;
					this.$forceUpdate()
				}
			}
		}
	}
</script>

<style lang="scss">
	// @import "@/lib/helang-flex.scss";
	::v-deep .u-drawer-bottom {
		border-radius: 24rpx;
	}

	page {
		height: 100%;
		background-color: #F8F8F7;
	}

	// 容器
	.wrap {
		height: 100%;
		background-color: #fff;
		position: relative;
		color: #333;
		font-size: 28rpx;
	}

	// 轮播盒子
	.swiper-box {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 100rpx;
		height: auto;
		width: auto;
		z-index: 1;
	}

	.swiper {
		height: 100%;
		background-color: #F8F8F7;

		.swiper-scroll {
			height: 100%;
		}

		.swiper-item {
			box-sizing: border-box;
			height: 100%;

			.topic-content {
				box-shadow: 0px 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
				background-color: white;
				border-radius: 24rpx;
				font-size: 32rpx;
				color: #333;
				line-height: 1.6;
				padding: 50rpx 42rpx 50rpx 42rpx;
				margin: 20rpx 26rpx 10rpx 26rpx;

				// 题目类型标签
				.type-label {
					font-size: 32rpx;
					font-weight: 400;
					color: #999999;
					line-height: 44rpx;
				}

				.type-card {
					font-size: 24rpx;
					font-weight: 400;
					color: #0E86C6;
					line-height: 34rpx;
					height: 34rpx;
				}

				.title {
					font-size: 32rpx;
					font-weight: 500;
					color: #000000;
					line-height: 44rpx;
					margin-top: 28rpx;
				}
			}

			// 答题卡
			.answer-sheet {
				box-shadow: 0px 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
				background-color: white;
				border-radius: 24rpx;
				margin: 20rpx 26rpx;
				padding: 38rpx 42rpx;

				.item {
					padding: 0 28rpx;
					margin: 24rpx 0;
					height: 100rpx;
					background: #F7F8FC;
					border-radius: 16rpx;

					&:active {
						background-color: #f3f3f3;
					}

					+.item {
						margin-top: 0;
					}
				}

				.success {
					background-color: #F7F8FC !important;
					color: #1374CB !important;
					background: url('@/static/images/test_success@2x.png') no-repeat;
					background-size: 34rpx 26rpx;
					background-position: 94% 50%;
				}

				.error {
					background-color: #FDF3F2 !important;
					color: #FF7972 !important;
					background: url('@/static/images/test_error@2x.png') no-repeat;
					background-size: 28rpx 30rpx;
					background-position: 94% 50%;
				}

				.active {
					border: 2rpx solid #1374CB !important;
				}
			}

			// 答题结果
			.answer-result {
				box-shadow: 0px 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
				background-color: white;
				padding: 50rpx 42rpx;

				border-radius: 24rpx;
				margin: 20rpx 26rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #999;
			}

			// 题目解析
			.answer-doubt {
				box-shadow: 0px 4rpx 16rpx 0px rgba(0, 0, 0, 0.05);
				background-color: white;
				border-radius: 24rpx;
				margin: 20rpx 26rpx;

				font-size: 28rpx;
				color: #8a6d3b;
				padding: 20rpx 30rpx;
				word-break: break-all
			}
		}
	}



	// 底部面板
	.panel-bottom {
		position: absolute;
		left: 0;
		bottom: 0;
		height: auto;
		width: 100%;
		z-index: 2;

		// 内容
		.content {
			position: absolute;
			z-index: 10;
			bottom: 0;
			left: 0;
			width: 100%;
			height: auto;
			background-color: #fff;
		}

		// 操作栏
		.action-bar {
			height: 100rpx;
			margin-bottom: env(safe-area-inset-bottom);
			width: 100%;
			box-sizing: border-box;
			border-top: #ddd solid 1px;
			font-size: 28rpx;
			padding: 0 20rpx;

			.success-num {
				color: #0089ff;
			}

			.error-num {
				color: #f84d27;
			}
		}

		// 题目列表
		.topic-list {
			height: 600rpx;

			.list-box {
				padding: 42rpx 35rpx 0 35rpx;
				font-size: 28rpx;
				color: #666;

				.list-item {
					padding-bottom: 20rpx;
					width: calc(100%/6);

					>view {
						width: 80rpx;
						height: 80rpx;
						background-color: #EEEEEE;
						border-radius: 50%;
						margin: 0 auto;
						font-size: 44rpx;
						color: #666666;

						&.active {
							border: 3rpx solid #0E86C6;
						}

						&.done {
							background-color: #0E86C6;
							color: white;
							font-size: 44rpx;
							font-weight: bold;
							line-height: 60rpx;
						}

						&.success {
							background-color: #dbf2ff;
							color: #0089ff;
							border: none;

							&.active {
								border: #0089ff solid 1px;
							}
						}

						&.error {
							background-color: #ffeceb;
							color: #f84d27;
							border: none;

							&.active {
								border: #f84d27 solid 1px;
							}
						}
					}
				}
			}
		}
	}

	.commit {
		background-color: #0E86C6 !important;
		border-radius: 22px;
		height: 90rpx;
		width: 660rpx;
		margin: 70rpx 45rpx 0 45rpx;
		color: white !important;
	}
</style>
