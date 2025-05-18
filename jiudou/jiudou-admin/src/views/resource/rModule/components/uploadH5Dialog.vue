<template>
  <div>
    <el-dialog
      :visible.sync="richEditor.dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      style="width: 100%;height: 100%"
      :show-close="false"
      center
    >
      <!-- <Ueditor @ready="editorReady" /> -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary">确 定</el-button>
        <el-button size="small" @click="richEditor.dialogVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import jdialog from "@/components/jdialog";

export default {
  components: {
    jdialog
  }
};
</script>

<style></style>
