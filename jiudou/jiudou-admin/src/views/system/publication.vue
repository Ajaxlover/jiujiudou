<template>
  <el-container class="myResource">
    <el-main>
      <div class="tabelHeader">
        <el-row class="operateBtn">
          <el-button type="primary" size="small" @click="addPublication"
            >添加</el-button
          >
        </el-row>
      </div>
      <el-table
        :data="tableData"
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
          prop="pubName"
          label="出版社名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="shortCode"
          label="简称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="qrPrefix"
          label="验证码前缀"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="managerMobile"
          label="管理员电话"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="tel"
          label="电话"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editApi(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="deleteApi(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div class="right-footer-first">
          从 {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
          {{
            (this.page.currentPage - 1) * this.page.pagesize +
              this.tableData.length
          }}
          记录，共 {{ page.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :total="page.total"
          :page-size="page.pagesize"
          :current-page.sync="page.currentPage"
          @current-change="loadData"
        ></el-pagination>
      </div>
      <el-dialog
        title=""
        :visible.sync="dialogFormVisible"
        :modal-append-to-body="false"
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>{{ pubForm.pubId ? "修改出版社" : "添加出版社" }}</div>
          </div>
        </template>
        <el-form
          :model="pubForm"
          :rules="rules"
          ref="pubForm"
          label-width="100px"
          style="margin:0 40px;"
          size="small"
        >
          <el-form-item label="出版社名称" prop="pubName">
            <el-input v-model="pubForm.pubName"></el-input>
          </el-form-item>
          <el-form-item label="简称">
            <el-input v-model="pubForm.shortCode"></el-input>
          </el-form-item>
          <el-form-item label="验证码前缀">
            <el-input v-model="pubForm.qrPrefix"></el-input>
          </el-form-item>
          <el-form-item label="管理员电话" prop="managerMobile">
            <el-input
              v-model="pubForm.managerMobile"
              :change="checkMobile()"
              :maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="pubForm.tel" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="pubForm.email"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="pubForm.address"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm" size="small"
            >确定</el-button
          >
          <el-button @click="dialogFormVisible = false" size="small"
            >取 消</el-button
          >
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      searchForm: {},
      tableData: [],
      dialogFormVisible: false,
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      pubForm: {
        pubId: "",
        pubName: "",
        shortCode: "",
        qrPrefix: "",
        address: "",
        email: "",
        tel: "",
        managerMobile: ""
      },
      rules: {
        pubName: [
          { required: true, message: "请输入出版社名称", trigger: "blur" }
        ],
        managerMobile: [
          { required: true, message: "请输入管理员电话", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确手机号码", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["hasButton"])
  },
  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property];
      return format(date);
    },
    loadData() {
      axios
        .request({
          method: "post",
          url: "/book/publishHouse/listWithCount",
          data: {
            page: this.page.currentPage,
            pagesize: this.page.pagesize
          }
        })
        .then(res => {
          this.tableData = res.data.data.data;
          this.page.total = res.data.data.total;
        });
    },
    submitForm() {
      this.$refs["pubForm"].validate(valid => {
        if (valid) {
          let url = "/book/publishHouse/insert";
          if (this.pubForm.pubId != 0) {
            url = "/book/publishHouse/update";
          }
          axios
            .request({
              method: "post",
              url: url,
              data: this.pubForm
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.dialogFormVisible = false;
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
    // 添加出版社事件
    addPublication() {
      this.pubForm.pubId = "";
      this.pubForm.pubName = "";
      this.pubForm.shortCode = "";
      this.pubForm.qrPrefix = "";
      this.pubForm.managerMobile = "";
      this.pubForm.address = "";
      this.pubForm.tel = "";
      this.pubForm.email = "";
      this.dialogFormVisible = true;
    },
    editApi(row) {
      this.pubForm.pubId = row.pubId;
      this.pubForm.pubName = row.pubName;
      this.pubForm.shortCode = row.shortCode;
      this.pubForm.qrPrefix = row.qrPrefix;
      this.pubForm.managerMobile = row.managerMobile;
      this.pubForm.address = row.address;
      this.pubForm.tel = row.tel;
      this.pubForm.email = row.email;
      this.dialogFormVisible = true;
    },
    deleteApi(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/book/publishHouse/delete",
              data: {
                pubId: row.pubId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  center: true,
                  message: "删除成功!"
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
    checkMobile() {
      this.pubForm.managerMobile = this.pubForm.managerMobile.replace(
        /[^0-9]/g,
        ""
      );
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style scoped lang="scss">
.myResource {
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
