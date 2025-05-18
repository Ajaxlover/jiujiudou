<template>
  <el-popover
    ref="popover"
    placement="right"
    width="40"
    trigger="hover"
    class="jd-popover"
  >
    <el-menu style="border-right: none" v-on:select="selected">
      <el-menu-item index="1">修改</el-menu-item>
      <el-menu-item index="3" v-if="hasShare">分享</el-menu-item>
      <el-menu-item index="2">删除</el-menu-item>
    </el-menu>
    <el-button slot="reference" class="listMoreBtn">
      <img
        src="@/assets/images/moreBtn.png"
        style="height:14px;margin-top:-2px"
      />
    </el-button>
  </el-popover>
</template>
<script>
export default {
  name: "EditPopover",
  props: {
    bank: Object,
    hasShare: Boolean
  },
  methods: {
    selected(index) {
      if (this.$refs.popover) {
        this.$refs.popover.doClose();
      }
      this.$emit("onSelected", index, this.bank);
    }
  },
  mounted() {
    // console.log(this.bank)
  }
};
</script>
