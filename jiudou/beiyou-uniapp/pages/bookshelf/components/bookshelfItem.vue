<template>
	<view class="wrap bookshelf">
		<view class="wrap__item u-flex-col u-col-center" @click="didTapped0">
			<view class="image u-flex u-col-bottom">
				<view style="width: 190rpx; height: 254rpx; overflow: hidden; position: relative; border-radius: 8rpx;">
					<u-image width="190" height="254" :src="obj[0].cover_pic" shape="square" class="cover">
						<u-loading slot="loading"></u-loading>
						<u-icon slot="error" :name="require('@/static/images/img_error@2x.png')" width="104" height="92" />
					</u-image>
					<u-icon v-if="Number(obj[0].textbookId) > 1" width="134" height="28" class="wrap__item__flag"
						:name="require('@/static/images/bookshelf_ebook_flag@2x.png')" />
					<u-icon v-else width="118" height="28" class="wrap__item__flag"
						:name="require('@/static/images/bookshelf_book_flag@2x.png')" />
				</view>
				<image class="wrap__item__arrow" :src="require('@/static/images/bookshelf_arrow@2x.png')"
					shape="square" />
				<view class="icon" v-if="editing">
					<u-icon v-if="obj[0].check" width="36" height="38"
						:name="require('@/static/images/bookshelf_selected@2x.png')" />
					<u-icon v-else width="36" height="38"
						:name="require('@/static/images/bookshelf_unselected@2x.png')" />
				</view>
			</view>
			<rich-text v-if="search" class="u-line-2 title" :nodes="obj[0].title || obj[0].tname"></rich-text>
			<text v-else class="u-line-2 title">{{ obj[0].tname }}</text>
		</view>
		<view class="wrap__item u-flex-col u-col-center" v-if="obj && obj.length === 2" @click="didTapped1">
			<view class="image u-flex u-col-bottom">
				<view style="width: 190rpx; height: 254rpx; overflow: hidden; position: relative; border-radius: 8rpx;">
					<u-image width="190" height="254" :src="obj[1].cover_pic" shape="square">
						<u-loading slot="loading"></u-loading>
						<u-icon slot="error" :name="require('@/static/images/img_error@2x.png')" width="104" height="92" />
					</u-image>
					<u-icon v-if="Number(obj[0].textbookId) > 1" width="134" height="28" class="wrap__item__flag"
						:name="require('@/static/images/bookshelf_ebook_flag@2x.png')" />
					<u-icon v-else width="118" height="28" class="wrap__item__flag"
						:name="require('@/static/images/bookshelf_book_flag@2x.png')" />
				</view>
				<image class="wrap__item__arrow" :src="require('@/static/images/bookshelf_arrow@2x.png')"
					shape="square" />
				<view class="icon" v-if="editing">
					<u-icon v-if="obj[1].check" width="36" height="38"
						:name="require('@/static/images/bookshelf_selected@2x.png')" />
					<u-icon v-else width="36" height="38"
						:name="require('@/static/images/bookshelf_unselected@2x.png')" />
				</view>
			</view>
			<rich-text v-if="search" class="u-line-2 title" :nodes="obj[1].title || obj[1].tname"></rich-text>
			<text v-else class="u-line-2 title">{{ obj[1].tname }}</text>
		</view>
	</view>
</template>

<script>
	import UImage from "../../../uview-ui/components/u-image/u-image";
	export default {
		components: {
			UImage
		},
		data() {
			return {

			};
		},
		watch: {
			obj(val) {

			}
		},
		props: {
			obj: {
				type: Array,
				required: true,
				default: function() {
					return [];
				}
			},
			editing: {
				type: Boolean,
				default: false
			},
			search: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			didTapped0() {
				let tmp = this.obj[0];
				this.$emit('detail', tmp);
			},
			didTapped1() {
				let tmp = this.obj[1];
				this.$emit('detail', tmp);
			}
		}
	}
</script>

<style lang="scss">
	.cove {
		z-index: 1000 !important;
	}
	.wrap {
		display: flex !important;
		flex-direction: row !important;
		padding-left: 20rpx;
		padding-right: 20rpx;

		&__item {
			width: 50%;
			//flex: 1;
			padding-top: 20rpx;
			background: url("@/static/images/bookshelf_shadow@2x.png") no-repeat;
			background-size: 122rpx 284rpx;
			background-position: 190rpx 0;

			.title {
				margin-top: 40rpx;
				font-size: 24rpx;
				color: #333333;
				max-width: 210rpx;
				line-height: 34rpx;
				text-align: center;
			}

			&__flag {
				width: 134rpx;
				height: 28rpx;
				position: absolute;
				right: -18rpx;
				bottom: 0;
				// position: absolute;
				// left: 0;
				// top: -4rpx;
				// z-index: 2000
			}

			&__arrow {
				width: 40rpx;
				height: 16rpx;
				margin-left: -4rpx;
				z-index: -1;
			}
		}
	}

	.bookshelf {
		z-index: 2;
		position: relative;
		width: 698rpx;
		height: 54rpx;
		background: url("@/static/images/bookshelf_line@2x.png") no-repeat;
		background-size: 734rpx 80rpx;
		background-position: 50% 262rpx;
	}

	.icon {
		position: absolute;
		margin-left: 142rpx;
		// margin-bottom: 12rpx;
	}
</style>
