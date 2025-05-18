<template>
	<view class="page wrap u-flex-col">
		<scroll-view scroll-y style="height: 100%; width: 100%;" @scrolltolower="reachBottom">
			<edit-item-cell style="height: 378rpx;" :editing="editing" v-for="(item, index) in dataList" :key="index" :items="item" @ok="didSelect"></edit-item-cell>
			<u-empty text="暂无数据" mode="data" :show="dataList.length === 0"></u-empty>
		</scroll-view>
		<view class="float-bottom u-flex" v-if="editing">
			<view class="item">取消</view>
			<u-line class="line" color="#EEEEEE" direction="col" length="50" />
			<view class="item" @click="commit">放回书架</view>
		</view>
	</view>
</template>

<script>
	import EditItemCell from './components/editItemCell'
	export default {
		components: {
			EditItemCell
		},
		data() {
			return {
				dataList: [],
				editing: false,
				selected: []
			};
		},
		methods: {
			onNavigationBarButtonTap: function(e) {
				console.log('点击了右上角按钮')
				if (e.index === 0) {
					this.editing = !this.editing;
					
					// #ifdef APP-PLUS
					const currentWebview = this.$mp.page.$getAppWebview();
					currentWebview.setTitleNViewButtonStyle(e.index, {
						text: this.editing ? '完成' : '管理'
					});
					// #endif
				}
			},
			fetchData() {
				this.$u.post('book/v1/textbook/delList', {}).then(response => {
					this.dataList = this.arr1to2(response, 3)
					console.log(this.dataList);
				})
			},
			// 放回书架
			commit() {
				uni.showLoading({});
				let books = this.selected.map(item => {
					return {id: item.textbookId, type: Number(item.textbookId) > 0 ? 1 : 2};
				});
				this.$u.post('book/v1/textbook/resumeBook', {
					books: JSON.stringify(books)
				}).then(response => {
					this.fetchData();
					uni.$emit('update')
				}).finally(() => {
					uni.hideLoading();
				})
			},
			reachBottom() {
				
			},
			arr1to2(arr, number) {
				var arr2 = [];
				let len = arr.length;
				for (let i = 0, j = 0; i < len; i += number, j++) {
					arr2[j] = arr.splice(0, number);
				}
				return arr2;
			},
			didSelect(item) {
				if (!this.editing) return;
				
				var index = this.selected.indexOf(item);
				if (index > -1) this.selected.splice(index, 1);
				else this.selected.push(item);
				
				this.$set(item, 'check', !item.check);
			}
		},
		onLoad() {
			this.fetchData()
		}
	}
</script>

<style lang="scss">
	
	.wrap {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		height: calc(100% - var(--window-top));
	}
	
	.float-bottom {
		height: calc(71rpx);
		margin-bottom: env(safe-area-inset-bottom);
		position: fixed;
		bottom: 0;
		
		width: 750rpx;
		background-color: white;
		
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
		.line {
			
		}
	}

</style>
