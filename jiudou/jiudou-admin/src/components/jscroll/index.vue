<template>
  <div class="my-scroll prohibit" ref="myScroll" 
    @scroll="onScroll($event)" 
    @touchstart="touchStart($event)" 
    @touchmove="touchMove($event)" 
    @touchend="touchEnd($event)"  >
    <div class="scroll-top" :style="{height:top+'px'}">
    </div>
    <!-- top -->
    <div class="scroll-list" :style="{ transform: 'translate3d(0, ' + top + 'px, 0)'}">
      <slot name='scrollList'></slot>
      <div class="scroll-bottom">
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
// import tween from '@/plugins/tween'
export default {
  name: 'myScroll',
  props: {
    //加载回调
    onPull: {
      type: Function,
      require: true
    }
  },
  data() {
    return {
      top: 0,
      myScroll: null,
      myScrollList: null,
    }
  },
  created() {
  },
  methods: {
    onScroll(e) {
      let listHeight = this.myScrollList.offsetHeight //列表总高度
      let listScrollTop = e.target.scrollTop + this.myScroll.offsetHeight //当前滚动条位置
      if(listHeight <= listScrollTop) {
        this.bottomCallback()
      }
    },
    bottomCallback() { //加载回调
      this.onPull()
    },
  },
  mounted() {
    this.myScroll = this.$refs.myScroll //获取滑条dom
    this.myScrollList = this.myScroll.children[1] //获取列表dom
  }
}
</script>
<style lang="scss" scoped>
.prohibit{
  max-width: 100%;
  max-height: 100%;
  height: 100%;
  overflow:hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  will-change: transform;
  transition: all 450ms;
  backface-visibility: hidden;
  // perspective: 1000;
}
</style>