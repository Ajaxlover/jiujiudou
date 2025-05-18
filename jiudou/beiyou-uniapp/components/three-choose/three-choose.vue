<template>
	<view class="class_mulu">
		<view class="tree_mulu">
			<view v-for="(index,ind) in mulunum">
				<view class="mulu_frist" @click="fristZhankai(ind)">
					<text>{{index.name || index.catalogName}}</text>
					<image v-if='index.open==false' class="fristjiantou" :src="fatherToInfo.defaultIcon" mode="">
					</image>
					<image v-if='index.open' class="fristjiantou" :src="fatherToInfo.currentIcon" mode=""></image>
				</view>
				<view v-if='index.open'>
					<view class="mulu_second" v-for="(index2,ind2) in mulunum[ind].cataList" :key="ind2">
						<view class="mulu_second_view" @click="muluSecond(ind,ind2)">
							<text>{{index2.name || index2.catalogName}}</text>
							<image v-if="index2.open==false" class="fristjiantou" :src="fatherToInfo.defaultIcon" mode=""></image>
							<image v-if="index2.open==true" class="fristjiantou" :src="fatherToInfo.currentIcon" mode=""></image>
						</view>
						<view v-if="index2.open==true" class="mulu_third" v-for="(index3,ind3) in index2.cataList" :key="ind3" @click="choosedVideofn(ind,ind2,ind3)">
							<view class="third_title u-line-1">{{index3.name || index3.catalogName}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// mulunum:[]
			}
		},
		onLoad() {

		},
		methods: {
			// 下拉
			fristZhankai(ind) {
				if (this.fatherToInfo.shoufenq) {
					this.mulunum.forEach((index, xb) => {
						if (ind == xb) {
							this.$set(index, 'open', true)
						} else {
							this.$set(index, 'open', false)
						}
					})
				} else {
					if (this.mulunum[ind].open == true) {
						this.$set(this.mulunum[ind], 'open', false)
					} else {
						this.$set(this.mulunum[ind], 'open', true)
					}
					this.$forceUpdate();
				}
			},
			// 二级下拉
			muluSecond(ind, ind2) {
				// if(this.fatherToInfo.twoshoufenq){
				// 	this.mulunum[ind].cataList.forEach((index2,xb2)=>{
				// 		if(ind2==xb2){
				// 			this.$set(index2, 'open', true)
				// 		}else{
				// 			this.$set(index2, 'open', false)
				// 		}
				// 	})
				// }else{
				// 	if (this.mulunum[ind].cataList[ind2].open == true) {
				// 		this.mulunum[ind].cataList[ind2].open = false;
				// 	} else {
				// 		this.mulunum[ind].cataList[ind2].open = true;
				// 	}
				// }
				
				if (this.mulunum[ind].cataList[ind2].hasOwnProperty("open")) {
					if (this.mulunum[ind].cataList[ind2].open == true) {
						this.mulunum[ind].cataList[ind2].open = false;
					} else {
						this.mulunum[ind].cataList[ind2].open = true;
					}
					this.$forceUpdate();
				} else {
					this.$emit('didSelect', this.mulunum[ind].cataList[ind2]);
				}
			},
			choosedVideofn(ind, ind2, ind3) {
				let that = this;
				that.mulunum.forEach((arr, xiab) => {
					arr.cataList.forEach((arr2, xiab2) => {
						if (arr2 instanceof Array) {
							arr2.cataList.forEach((arr3, xiab3) => {
								that.$set(arr3, 'thirdOpen', false)
							})
						}
					})
				});
				that.$set(that.mulunum[ind].cataList[ind2].cataList[ind3], 'thirdOpen', true);
				console.log('标志代码', that.mulunum[ind].cataList[ind2].cataList[ind3]);

				this.$emit('didSelect', this.mulunum[ind].cataList[ind2].cataList[ind3]);
			}
		},
		props: ["mulunum", "fatherToInfo"],
	}
</script>

<style lang="scss">
	.class_mulu {
		width: 100%;

		.jieshao_class {
			width: 100%;
			height: 84rpx;
			line-height: 84rpx;
			padding: 0 20rpx;
			box-sizing: border-box;

			.jieshao_title {
				font-size: 26rpx;
				color: #333333;
				font-weight: bold;
				margin-left: 75rpx;
			}

			.jieshao_time {
				font-size: 24rpx;
				color: #333333;
				float: right;
			}
		}

		.tree_mulu {
			width: 100%;
			padding: 20rpx 0;

			.mulu_frist {
				padding: 0 20rpx;
				margin: 20rpx 0;
				box-sizing: border-box;
				position: relative;

				//width: 652rpx;
				width: 100%;
				height: 86rpx;
				background: #F7F8FC;
				border-radius: 20rpx;

				text {
					font-size: 28rpx;
					font-weight: 500;
					color: #000000;
					line-height: 86rpx;
				}

				.fristImg {
					width: 24rpx;
					height: 24rpx;
					position: absolute;
					top: 0;
					bottom: 0;
					left: 36rpx;
					margin: auto;
				}

				.fristjiantou {
					width: 24rpx;
					height: 16rpx;
					position: absolute;
					top: 0;
					bottom: 0;
					right: 44rpx;
					margin: auto;
				}
			}

			.mulu_second {
				width: 100%;

				.mulu_second_view {
					width: 100%;
					// padding: 20rpx 20rpx 20rpx 40rpx;
					box-sizing: border-box;
					position: relative;
					height: 72rpx;
					border-bottom: 1rpx solid #E7EBF2;

					text {
						font-size: 26rpx;
						font-weight: 400;
						color: #333333;
						line-height: 72rpx;
					}
				}

				.fristImg {
					width: 24rpx;
					height: 24rpx;
					position: absolute;
					top: 0;
					bottom: 0;
					left: 50rpx;
					margin: auto;
				}

				text {
					font-size: 28rpx;
					font-weight: bold;
					color: #333333;
					margin-left: 22rpx;
				}

				.fristjiantou {
					width: 24rpx;
					height: 16rpx;
					position: absolute;
					top: 0;
					bottom: 0;
					right: 44rpx;
					margin: auto;
				}
			}

			.mulu_third {
				width: 100%;
				// padding: 0 40rpx;
				padding: 0 20rpx 0 50rpx;
				box-sizing: border-box;
				position: relative;
				height: 80rpx;

				text {
					font-size: 26rpx;
					font-weight: 400;
					color: #333333;
					line-height: 36rpx;
				}

				.third_title {
					font-size: 26rpx;
					color: #666;
					margin-left: 0;
					line-height: 80rpx;
					border-bottom: 2rpx solid #E7EBF2;
				}

				.third_time {
					font-size: 24rpx;
					color: #666;
					line-height: 70rpx;
					float: right;
				}

				.choosedvideo {
					color: #3c87ca;
				}
			}
		}
	}
</style>
