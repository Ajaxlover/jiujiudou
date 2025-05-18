<template>
  <el-container class="codeSearch">
    <el-header height="50px">
      <span></span>
      <span class="code" @click="toCode">防伪码管理</span>
      <i class="el-icon-arrow-right"></i> <span>查询</span>
    </el-header>
    <el-main>
      <el-form
        :inline="true"
        class="demo-form-inline"
        size="small"
        @submit.native.prevent
      >
        <el-form-item label="书名">
          <el-input
            placeholder="请输入书名"
            @keyup.enter.native="search"
            v-model.trim="searchForm.bookName"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="search"
            size="small"
          ></el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button @click="toCodeSearch" size="small">返回</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-table
        :data="dataList"
        v-loading="tableLoading"
        :tree-props="{ children: 'bookPici' }"
        row-key="id"
        style="margin-top:15px;"
        border
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column label="书号" prop="bookNumber"> </el-table-column>
        <el-table-column
          label="书名"
          prop="bookName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="批次"
          prop="pici"
          align="center"
        ></el-table-column>
        <el-table-column
          label="开始序号"
          prop="minNum"
          align="center"
        ></el-table-column>
        <el-table-column
          label="结束序号"
          prop="maxNum"
          align="center"
        ></el-table-column>
      </el-table>
      <!-- <div class="tabelFooter">
        <div class="right-footer-first">
          从 {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
          {{
            (this.page.currentPage - 1) * this.page.pagesize +
              this.dataList.length
          }}
          记录，共 {{ page.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :total="page.total"
          :current-page.sync="page.currentPage"
          :page-size="page.pagesize"
          @current-change="loadData"
        ></el-pagination>
      </div> -->
      <el-dialog
        style="margin-top:12vh"
        :modal-append-to-body="true"
        :modal="false"
        title="扫码详情"
        height="200px"
        :visible.sync="dialogTableVisible"
      >
        <el-table border :data="gridData" :show-header="false">
          <el-table-column prop="uName" width="200"></el-table-column>
          <el-table-column prop="uPhone"></el-table-column>
          <el-table-column
            prop="scanTime"
            :formatter="formatDate"
            width="200"
          ></el-table-column>
        </el-table>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
export default {
  components: {},
  data() {
    return {
      keyword: this.$route.query.keyWord,
      dialogTableVisible: false,
      gridData: [],
      dataList: [],
      piciData: [], //批次的List
      tableLoading: false,
      searchForm: {
        pici: "",
        beginNum: "1",
        endNum: "1",
        codeStatus: "",
        searchWords: "",
        searchType: "1",
        sortType: "1",
        bookName: this.$route.query.keyWord
      },
      multiscan: "", //设置扫描次数
      page: {
        total: 0,
        currentPage: 1,
        pagesize: 10
      }
    };
  },
  methods: {
    cellClick(row, column, cell, event) {
      console.log(column);
      if (row.scanedUserList.length > 0 && column.label == "扫码用户") {
        this.gridData = row.scanedUserList;
        this.dialogTableVisible = true;
      }
    },
    toCode() {
      this.$router.push({
        path: "/publication/code"
      });
    },
    toCodeSearch() {
      this.$router.push({
        path: "/publication/codeSearch"
      });
    },
    //加载table列表
    loadData() {
      this.tableLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/qrCode/selOrgCodeRecord",
          data: {
            keyword: this.searchForm.bookName
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.tableLoading = false;
            if (ret.data) {
              this.dataList = ret.data.data[0].books;
              ret.data.data[0].books.forEach(element => {
                element.id = this.generateRandomBase64Id();
                element.bookPici.forEach(v => {
                  v.id = this.generateRandomBase64Id();
                });
              });
              // this.page.total = ret.data.total;
            } else {
              this.dataList = [];
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
            this.dataList = [];
            this.tableLoading = false;
          }
        });
    },
    generateRandomBase64Id() {
      let randomId = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
      }

      const base64Id = btoa(randomId);

      return base64Id;
    },
    sortChange(row) {
      if (row.prop == "pici") {
        if (row.order == "ascending") {
          this.searchForm.sortType = 1;
        } else {
          this.searchForm.sortType = 2;
        }
      }
      this.loadData();
    },
    //批次变化时查询数据
    piciChangeSearch(pici) {
      let currentObj = {};
      currentObj = this.piciData.find(item => {
        //这里的userRoleList就是上面遍历的数据源
        return item.pici === pici; //筛选出匹配数据
      });
      this.searchForm.beginNum = currentObj.minNum;
      this.searchForm.endNum = currentObj.maxNum;
      this.search();
    },
    // 查询btn
    search() {
      // this.page.currentPage = 1;
      this.loadData();
    },
    // 加载 批次列表
    loadPici() {
      axios
        .request({
          method: "post",
          url: "/v1/qrCode/selPicisByOrgId"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.piciData = ret.data;
          }
        });
    },
    // 日期
    formatDate(row) {
      return format(row.scanTime);
    },
    // 作废
    handleZuofei(row) {
      this.$confirm("确定作废此防伪码吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/v1/qrCode/invalidCodes",
              data: {
                codeIds: row.codeId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                row.codeStatus = 2;
                this.$message({
                  type: "success",
                  message: "成功!"
                });
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    // 处理点击二维码修改次数
    handleScanTime() {
      this.$message({
        message: "防伪码已失效，无法修改",
        type: "warning"
      });
    },
    //确定设置有效次数
    doSetMultiscan(row) {
      axios
        .request({
          method: "post",
          url: "/v1/qrCode/updCanScanAmountByAntiFakeCodeId",
          data: {
            canScanAmount: this.multiscan,
            codeId: row.codeId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            row.canScanTimes = this.multiscan;
            this.$refs.scanTimePopover.click();
            this.$message({
              type: "success",
              message: ret.msg
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style lang="scss" scoped>
.el-dialog__body {
  max-height: 48vh;
  overflow: auto;
}
.codeSearch {
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .code {
      cursor: pointer;
      color: #2ba1f4;
    }
  }
  .el-main {
    margin: 22px 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding: 18px 18px 70px;
    .el-divider--horizontal {
      margin: 0px 0 30px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }
}
</style>
