<template>
  <el-container class="xieyiManager">
    <el-main>
      <div class="tabelHeader">
        <el-row class="operateBtn">
          <el-button type="primary" size="small" @click="addVersion"
            >添加</el-button
          >
        </el-row>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading.listLoading"
        border
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          prop="protocolVersion"
          label="协议版本"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="protocolCreateTime"
          label="添加时间"
          align="center"
        >
          <template slot-scope="scope">{{
            formatDate(scope.row.protocolCreateTime)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="deleteVersion(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div class="right-footer-first">
          从 {{ (page.page - 1) * page.pageSize + 1 }} 到
          {{ (page.page - 1) * page.pageSize + tableData.length }} 记录，共
          {{ page.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :total="page.total"
          :page-size="page.pageSize"
          :current-page.sync="page.page"
          @current-change="loadData"
        ></el-pagination>
      </div>
      <el-dialog
        title=""
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>添加</div>
          </div>
        </template>
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="100px"
          label-position="left"
          style="margin:0 40px;"
          size="small"
        >
          <el-form-item label="版本号" prop="version">
            <el-input
              placeholder="请输入数字和英文符号，如4.3.0"
              v-model="form.version"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button
            type="primary"
            @click="addSure"
            size="small"
            :loading="loading.addSureLoading"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<style lang="scss">
.xieyiManager {
  width: 100%;
  padding: 20px;
  .el-main {
    background: #ffffff;
    border-radius: 4px;
    min-height: 638px;
    padding: 13px;
    .tabelHeader {
      overflow: hidden;
      margin-bottom: 13px;
      .operateBtn {
        float: right;
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      loading: {
        listLoading: false,
        addSureLoading: false
      },
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      form: {
        version: ""
      },
      rules: {
        version: [{ required: true, message: "请输入版本号", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading.listLoading = true;
      axios
        .request({
          method: "post",
          url: "/platform/v4/protocol/listByPage",
          data: this.page
        })
        .then(res => {
          this.loading.listLoading = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.page.total = ret.data.total;
            this.tableData = ret.data.data;
          }
        })
        .catch(() => {
          this.loading.listLoading = false;
        });
    },
    addVersion() {
      this.form.version = "";
      this.loading.addSureLoading = false;
      if (this.$refs["form"]) {
        this.$refs["form"].clearValidate();
      }
      this.dialogVisible = true;
    },
    addSure() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading.addSureLoading = true;
          axios
            .request({
              method: "post",
              url: "platform/v4/protocol/create",
              data: this.form
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.dialogVisible = false;
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                this.loadData();
              } else {
                this.$message({
                  type: "error",
                  message: ret.msg
                });
              }
            });
        }
      });
    },
    deleteVersion(row) {
      this.$confirm("是否确定删除" + row.protocolVersion + "版本。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "platform/v4/protocol/remove",
              data: { protocolId: row.protocolId }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                this.loadData();
              } else {
                this.$message({
                  type: "error",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    formatDate(time) {
      return format(time);
    }
  }
};
</script>
