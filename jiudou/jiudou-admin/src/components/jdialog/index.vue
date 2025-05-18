<template>
  <el-dialog
    :top="top"
    :fullscreen="isFull"
    :visible.sync="show"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :width="width"
    @close="close"
    v-on:open="$emit('open')"
  >
    <template slot="title">
      <div class="dialog-title-container">
        <div class="dialog-titile-line"></div>
        <div style="font-size:18px;color:#333;">{{ title }}</div>
        <div>
          <slot name="fullscreen"></slot>
        </div>
      </div>
    </template>
    <div>
      <slot name="body"></slot>
    </div>
    <div style="display:flex;justify-content:center">
      <slot name="my-footer"></slot>
    </div>
    <span v-if="noFooter === false" slot="footer">
      <el-button size="small" type="primary" :loading="loading" @click="sure"
        >确定</el-button
      >
      <el-button size="small" @click="close">取消</el-button>
    </span>
  </el-dialog>
</template>
<style>
.dialog-title-container {
  flex: 1;
  display: flex;
  align-items: center;
}
.dialog-titile-line {
  margin-right: 11px;
  background: #2ba1f4;
  width: 3px;
  height: 18px;
}
.el-dialog__header {
  border: 1px solid #eaeaea;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.el-dialog__footer {
  text-align: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.el-dialog__footer .el-button + .el-button {
  margin-left: 30px;
}
</style>
<script>
export default {
  name: "Jdialog",
  data() {
    return {
      show: this.visible,
      closed: this.close_on_click_modal
    };
  },
  props: {
    top: {
      type: String,
      default: "6vh"
    },
    visible: Boolean,
    title: String,
    close_on_click_modal: {
      type: Boolean,
      default: true
    },
    isFull: Boolean,
    noFooter: Boolean,
    width: {
      type: String,
      default: "600px"
    },
    loading: Boolean
  },
  watch: {
    visible() {
      this.show = this.visible;
    },
    close_on_click_modal() {
      this.closed = this.close_on_click_modal;
    }
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    sure() {
      this.$emit("sure");
    }
  }
};
</script>
