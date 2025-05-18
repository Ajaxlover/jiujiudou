<template>
	<view class="menu-bar">
		<transition name="slide-up">
			<view class="menu-wrapper" :class="{'hide-box-shadow': isSettingShow || !ifTitleAndMenuShow}"
				v-show="ifTitleAndMenuShow">
				<view class="icon-wrapper">
					<span class="icon icon-menu" @click="showSetting(3)"></span>
				</view>
				<view class="icon-wrapper">
					<span class="icon icon-progress" @click="showSetting(2)"></span>
				</view>
				<view class="icon-wrapper">
					<span class="icon icon-bright" @click="showSetting(1)"></span>
				</view>
				<view class="icon-wrapper">
					<span class="icon icon-a" @click="showSetting(0)">A</span>
				</view>
			</view>
		</transition>
		<transition name="slide-up">
			<view class="setting-wrapper" v-show="isSettingShow">
				<view class="setting-font-size" v-if="showTag === 0">
					<view class="preview" :style="{fontSize:fontSizeList[0].fontSize+'px'}">A</view>
					<view class="select">
						<view class="select-wrapper" v-for="(item,index) in fontSizeList" :key="index"
							@click="setFontSize(item.fontSize)">
							<view class="line"></view>
							<view class="point-wrapper">
								<view class="point" v-show="defaultFontSize === item.fontSize">
									<view class="small-point"></view>
								</view>
							</view>
							<view class="line"></view>
						</view>
					</view>
					<view class="preview" :style="{fontSize:fontSizeList[fontSizeList.length-1].fontSize+'px'}">A</view>
				</view>
				<view class="setting-theme" v-else-if="showTag === 1">
					<view class="setting-theme-item" v-for="(item,index) in themeList" :key="index"
						@click="setTheme(index)">
						<view class="preview" :style="{background: item.style.body.background}"
							:class="{'no-border': item.style.body.background !== '#fff'}"></view>
						<view class="text" :class="{'selected': defaultTheme === index}">{{item.name}}</view>
					</view>
				</view>
				<view class="setting-progress" v-else-if="showTag === 2">
					<view class="progress-wrapper">
						<slider style="width: 100%;" :value="progress" step="1" min="0" max="100" @change="onProgressChange"></slider>
						<!-- <input class="progress" type="range" max="100" min="0" step="1"
							@change="onProgressChange($event.target.value)"
							@input="onProgressInput($event.target.value)" :value="progress" :disabled="!bookAvailable"
							ref="progress"> -->
					</view>
					<view class="text-wrapper">
						<span>{{bookAvailable ? progress + '%' : '加载中...'}}</span>
					</view>
				</view>
			</view>
		</transition>
		<content-view :ifShowContent="ifShowContent" v-show="ifShowContent" :navigation="navigation"
			:bookAvailable="bookAvailable" @jumpTo="jumpTo"></content-view>
		<transition name="fade">
			<view class="content-mask" v-show="ifShowContent" @click="hideContent">
			</view>
		</transition>
	</view>
</template>

<script>
	import contentView from './contentView.vue'
	export default {
		components: {
			contentView
		},
		methods: {
			hideContent() {
				this.ifShowContent = false
			},
			jumpTo(target) {
				this.$emit('jumpTo', target)
			},
			onProgressInput(v) {
				this.progress = v
				this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
			},
			onProgressChange(e) {
				this.progress = e.detail.value;
				this.$emit('onProgressChange', e.detail.value)
			},
			setTheme(index) {
				this.$emit('setTheme', index)
			},
			setFontSize(fontSize) {
				this.$emit('setFontSize', fontSize)
			},
			showSetting(tag) {
				this.showTag = tag
				if (this.showTag === 3) {
					this.isSettingShow = false
					this.ifShowContent = true
				} else {
					this.isSettingShow = true
				}
			},
			hiddenSetting() {
				this.isSettingShow = false
			}
		},
		props: {
			ifTitleAndMenuShow: {
				type: Boolean,
				default: false
			},
			fontSizeList: Array,
			defaultFontSize: Number,
			themeList: Array,
			defaultTheme: Number,
			bookAvailable: Boolean,
			navigation: Object
		},
		data() {
			return {
				isSettingShow: false,
				showTag: 0,
				progress: 0,
				ifShowContent: false
			};
		}
	}
</script>

<style lang="scss">
	.menu-wrapper {
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 101;
		display: flex;
		width: 100%;
		height: 90rpx;
		background: white;
		box-shadow: 0 -16rpx 16rpx rgba(0, 0, 0, .15);

		&.hide-box-shadow {
			box-shadow: none;
		}

		.icon-wrapper {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 40rpx;

			.icon-progress {
				font-size: 56rpx;
			}

			.icon-bright {
				font-size: 48rpx;
			}
		}
	}

	.setting-wrapper {
		position: absolute;
		bottom: 90rpx;
		left: 0;
		z-index: 101;
		width: 100%;
		height: 120rpx;
		background: white;
		box-shadow: 0 -16rpx 16rpx rgba(0, 0, 0, .15);

		.setting-font-size {
			display: flex;
			height: 100%;

			.preview {
				flex: 0 0 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.select {
				flex: 1;
				display: flex;

				.select-wrapper {
					flex: 1;
					display: flex;
					align-items: center;

					&:first-child {
						.line {
							&:first-child {
								border-top: none;
							}
						}
					}

					&:last-child {
						.line {
							&:last-child {
								border-top: none;
							}
						}
					}

					.line {
						flex: 1;
						height: 0;
						border-top: 1rpx solid #ccc;
					}

					.point-wrapper {
						position: relative;
						flex: 0 0 0;
						width: 0;
						height: 14rpx;
						border-left: 1rpx solid #ccc;

						.point {
							position: absolute;
							top: -14rpx;
							left: -10rpx;
							width: 42rpx;
							height: 42rpx;
							border-radius: 50%;
							background: white;
							border: 2rpx solid #ccc;
							box-shadow: 0 8rpx 8rpx rgba(0, 0, 0, .15);
							display: flex;
							justify-content: center;
							align-items: center;

							.small-point {
								width: 10rpx;
								height: 10rpx;
								border-radius: 50%;
								background: black;
							}
						}
					}
				}
			}
		}

		.setting-theme {
			display: flex;
			height: 100%;

			.setting-theme-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 10rpx;
				box-sizing: border-box;

				.preview {
					flex: 1;
					border: 1rpx solid #ccc;
					box-sizing: border-box;

					&.no-border {
						border: none;
					}
				}

				.text {
					flex: 0 0 20rpx;
					font-size: 28rpx;
					color: #ccc;
					display: flex;
					justify-content: center;
					align-items: center;

					&.selected {
						color: #000;
					}
				}
			}
		}

		.setting-progress {
			position: relative;
			width: 100%;
			height: 100%;

			.progress-wrapper {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 10rpx;
				box-sizing: border-box;

				.progress {
					width: 100%;
					-webkit-appearance: none;
					height: 2rpx;
					background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
					background-size: 0 100%;

					&:focus {
						outline: none;
					}

					&::-webkit-slider-thumb {
						-webkit-appearance: none;
						height: 20rpx;
						width: 20rpx;
						border-radius: 50%;
						background: white;
						box-shadow: 0 4rpx 4rpx rgba(0, 0, 0, .15);
						border: 1rpx solid #ddd;
					}
				}
			}

			.text-wrapper {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				color: #333;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 24rpx;
			}
		}
	}

	.content-mask {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 101;
		display: flex;
		width: 100%;
		height: 100%;
		background: rgba(51, 51, 51, .8)
	}
</style>
