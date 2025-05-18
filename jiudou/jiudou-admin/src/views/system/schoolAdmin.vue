<template>
  <el-container class="myResource">
    <el-main>
      <div class="tabelHeader">
        <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="searchForm.mobile"
              placeholder="请输入完整手机号"
              style="width: 200px"
              size="medium"
              @keyup.enter.native="loadData"
            ></el-input>
            <!-- <el-select
              style="width:110px;"
              v-model="searchForm.status"
              size="medium"
              @change="loadData"
            >
              <el-option value="" label="全部"></el-option>
              <el-option value="0" label="未审核"></el-option>
              <el-option value="1" label="已通过"></el-option>
              <el-option value="2" label="未通过"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="loadData"
              size="medium"
            ></el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        border
        row-key="id"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          prop="teacherName"
          label="教师姓名"
          align="center"
        ></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center">
        </el-table-column>
        <el-table-column prop="school" label="学校" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              v-if="scope.row.status === 1"
              @click="passAttestation(scope.row)"
              >同意</el-button
            >
            <el-button
              v-if="scope.row.isManager == 0 && scope.row.status == 2"
              type="text"
              size="medium"
              @click="addChildTea(scope.row)"
              >新增下属</el-button
            >
            <el-button
              v-if="scope.row.status == 2"
              type="text"
              size="medium"
              @click="refuseAttestation(scope.row)"
              >删除</el-button
            >
            <el-button
              type="text"
              size="medium"
              v-if="scope.row.status === 1"
              @click="refuseAttestation(scope.row)"
              >拒绝</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="tableData.length" class="right-footer-first">
          从{{ (page.currentPage - 1) * page.pagesize + 1 }}到{{
            (page.currentPage - 1) * page.pagesize + tableData.length
          }}记录，共{{ page.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="page.total"
          :page-size="page.pagesize"
          :current-page.sync="page.currentPage"
          background
          @current-change="loadData"
        ></el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
export default {
  data() {
    return {
      searchForm: {
        mobile: "",
        teacherName: "",
        status: ""
      },
      tableData: [],
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      }
    };
  },
  computed: {},
  methods: {
    arryWay(string) {
      let arry = [];
      arry.push(string);
      return arry;
    },
    //时间格式化
    dateFormat(row) {
      return format(row);
    },
    loadData() {
      let params = {};
      params.page = this.page.currentPage;
      params.pagesize = this.page.pagesize;
      params.phone = this.searchForm.mobile;

      // if (this.searchForm.mobile) {
      // }
      axios
        .request({
          method: "post",
          url: "/clazz/clazzManager/listClassManager",
          data: params
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.tableData = ret.data.data;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: `${ret.msg}`
            });
          }
        });
    },
    passAttestation(row) {
      axios
        .request({
          method: "post",
          url: "/clazz/clazzManager/update",
          data: {
            id: row.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadData();
            this.$message({
              type: "success",
              message: "同意成功!"
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    addChildTea(row) {
      this.$prompt("请输入下属教师手机号", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
        inputErrorMessage: "手机号格式不正确"
      })
        .then(({ value }) => {
          axios
            .request({
              method: "post",
              url: "clazz/clazzManager/addsubordinate",
              data: {
                phone: value,
                type: 2,
                managerUid: row.managerUid
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: "新增成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: `${ret.msg}`
                });
              }
            });
        })
        .catch(() => {});
    },
    refuseAttestation(row) {
      let params = {
        id: row.id
      };
      if (row.isManager === 0) {
        params.managerUid = row.managerUid;
      }
      this.$confirm("是否确定删除?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/clazz/clazzManager/delete",
              data: params
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: `${ret.msg}`
                });
              }
            });
        })
        .catch(() => {});
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
      .el-form {
        float: left;
        .el-form-item {
          margin-bottom: 13px;
          .el-form-item__content {
            line-height: 32px;
          }
        }
      }
      .operateBtn {
        float: right;
      }
    }
  }
}
</style>
