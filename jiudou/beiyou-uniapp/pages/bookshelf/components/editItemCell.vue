<template>
	<view class="wrap">
		<view class="item u-flex-col u-col-center" v-for="(each, idx) in items" :key="idx" @click="didSelect(each)">
			<u-image width="186" height="270" :src="each.cover_pic" border-radius="8">
				<u-loading slot="loading"></u-loading>
				<image slot="error" :src="require('@/static/images/img_error@2x.png')"
					style="width: 104rpx; height: 92rpx;;"></image>
			</u-image>
			<view class="icon" v-if="editing" >
				<u-icon v-if="items[idx].check" width="36" height="38" :name="require('@/static/images/bookshelf_selected@2x.png')"/>
				<u-icon v-else width="36" height="38" :name="require('@/static/images/bookshelf_unselected@2x.png')"/>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	  mixin
	} from "@/common/mixin"
	export default {
		name: "editItemCell",
		mixins: [mixin],
		props: {
		  items: {
		    type: Array,
		    required: true,
		    default: function() {
		      return [];
		    }
		  },
		  editing: {
		  	type: Boolean,
		  	default: false
		  }
		},
		data() {
			return {
				
			};
		},
		methods: {
			didSelect(item) {
				this.$emit('ok', item);
			}
		}
	}
</script>

<style lang="scss">

.wrap {
  display: flex !important;
  flex-direction: row !important;
  height: 378rpx !important;
  padding: 46rpx 0 60rpx 0;
  width: 650rpx !important;
  margin: 0 50rpx 0 50rpx;
  border-bottom: 2rpx solid #EEEEEE;

  .item {
    height: 100%;
    width: calc(650rpx / 3);
  }
  
  .icon {
  	position: absolute;
  	margin-left: 142rpx;
  	margin-top: 220rpx;
  }
}

</style>
