<template>
  <el-popover
    ref="popover"
    placement="right"
    width="40"
    trigger="hover"
    class="jd-popover"
  >
    <el-menu style="border-right: none" v-on:select="selected">
      <el-menu-item v-if="noAdd === false" index="1">新建子库</el-menu-item>
      <el-menu-item index="2">修改</el-menu-item>
      <el-menu-item v-if="noShare" index="3">分享</el-menu-item>
      <el-menu-item index="4">删除</el-menu-item>
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
    noAdd: Boolean,
    noShare: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    selected(index) {
      if (this.$refs.popover) {
        this.$refs.popover.doClose();
      }
      this.$emit("onSelected", index, this.bank);
    },
    sure() {
      this.showDeleteDialog = false;
    }
  }
};
</script>
