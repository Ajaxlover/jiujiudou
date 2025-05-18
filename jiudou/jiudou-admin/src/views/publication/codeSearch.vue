<template>
  <el-container class="codeSearch">
    <el-header height="50px">
      <span></span>
      <span class="code" @click="toCode">防伪码管理</span>
      <i class="el-icon-arrow-right"></i> <span>查询</span>
    </el-header>
    <el-main>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="批次#序号">
          <el-select
            v-model="searchForm.pici"
            placeholder="请选择批次"
            @change="piciChangeSearch($event)"
            style="width: 150px;"
          >
            <el-option label="全部批次" value=""></el-option>
            <el-option
              v-for="item in piciData"
              :label="`第${item.pici}批次`"
              :value="item.pici"
              :key="item.pici"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="searchForm.pici">
          <el-input-number
            v-model="searchForm.beginNum"
            :min="1"
            controls-position="right"
            style="width: 120px;"
          ></el-input-number>
          -
          <el-input-number
            v-model="searchForm.endNum"
            :min="1"
            controls-position="right"
            style="width: 120px;"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.codeStatus"
            placeholder="请选择状态"
            @change="search"
            style="width: 100px;"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未绑定" value="0"></el-option>
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.searchWords"
            class="input-with-select"
            @keyup.enter.native="search"
          >
            <el-select
              v-model="searchForm.searchType"
              slot="prepend"
              placeholder="请选择"
              style="width: 100px;"
            >
              <el-option label="防伪码" value="1"></el-option>
              <el-option label="书名" value="2"></el-option>
              <el-option label="书号" value="4"></el-option>
              <el-option label="用户" value="3"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
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
          <el-button @click="toCode" size="small">返回</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-table
        @cell-click="cellClick"
        :data="dataList"
        v-loading="tableLoading"
        style="margin-top:15px;"
        border
        @sort-change="sortChange"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          label="批次#序号"
          prop="pici"
          align="center"
          sortable="custom"
        >
          <div slot-scope="scope">
            {{ scope.row.pici }}#{{ scope.row.codeNum }}
          </div>
        </el-table-column>
        <el-table-column
          label="防伪码内容"
          prop="codeContent"
          align="center"
        ></el-table-column>
        <el-table-column
          label="书名"
          prop="textbookName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="书号"
          prop="textbookNum"
          align="center"
        ></el-table-column>
        <el-table-column label="状态" prop="codeStatus" align="center">
          <div slot-scope="scope">
            <span v-if="scope.row.codeType == 1">万能码</span>
            <span v-else>
              <span v-if="scope.row.codeStatus == 0">未绑定</span>
              <span v-else-if="scope.row.codeStatus == 1">有效</span>
              <span v-else-if="scope.row.codeStatus == 2">失效</span>
            </span>
          </div>
        </el-table-column>
        <el-table-column label="有效次数" prop="canScanTimes" align="center">
          <div slot-scope="scope" ref="scanTimePopover">
            <el-popover
              placement="bottom"
              trigger="click"
              v-if="scope.row.codeStatus != 2"
            >
              <div>设置有效扫描次数</div>
              <el-input-number
                v-model="multiscan"
                :min="0"
                controls-position="right"
                size="small"
                style="margin:10px 0;width:150px"
              ></el-input-number>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" @click="doSetMultiscan(scope.row)"
                  >确定</el-button
                >
                <el-button
                  size="mini"
                  @click.native.prevent="$refs.scanTimePopover.click()"
                  >取消</el-button
                >
              </div>
              <el-button
                slot="reference"
                size="mini"
                type="text"
                @click="multiscan = scope.row.canScanTimes"
              >
                {{ scope.row.canScanTimes ? scope.row.canScanTimes : "0" }}
              </el-button>
            </el-popover>
            <span
              v-else
              @click="handleScanTime(scope.row.codeStatus)"
              style="cursor:pointer"
              >{{ scope.row.canScanTimes ? scope.row.canScanTimes : "0" }}</span
            >
          </div>
        </el-table-column>
        <el-table-column
          label="扫码用户"
          prop="scanedUserList"
          align="center"
          width="200px"
        >
          <div slot-scope="scope">
            <el-button
              v-if="scope.row.scanedUserList.length > 0"
              size="mini"
              type="text"
            >
              {{
                scope.row.scanedUserList.length > 1
                  ? scope.row.scanedUserList[0].uPhone +
                    "等" +
                    scope.row.scanedUserList.length +
                    "人"
                  : scope.row.scanedUserList[0].uPhone
              }}
            </el-button>
            <!-- <el-popover placement="bottom" trigger="click">
              <div>扫码详情</div>
              <el-table :data="scope.row.scanedUserList" :show-header="false">
                <el-table-column prop="uName" width="150"></el-table-column>
                <el-table-column prop="uPhone" width="150"></el-table-column>
                <el-table-column
                  prop="scanTime"
                  :formatter="formatDate"
                  width="150"
                ></el-table-column>
              </el-table>
              <el-button
                slot="reference"
                v-if="scope.row.scanedUserList.length > 0"
                size="mini"
                type="text"
              >
                {{
                  scope.row.scanedUserList.length > 1
                    ? scope.row.scanedUserList[0].uPhone +
                      "等" +
                      scope.row.scanedUserList.length +
                      "人"
                    : scope.row.scanedUserList[0].uPhone
                }}
              </el-button>
            </el-popover> -->
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.codeStatus != 2"
              size="mini"
              type="text"
              @click="handleZuofei(scope.row)"
              >作废</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
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
      </div>
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
        bookName: ""
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
        name: "code"
      });
    },
    //加载table列表
    loadData() {
      if (this.searchForm.beginNum > this.searchForm.endNum) {
        this.$message({
          type: "warning",
          message: "范围起始不能大于截止"
        });
        return;
      }
      this.tableLoading = true;
      let data = {};
      if (this.searchForm.pici) {
        data.pici = this.searchForm.pici;
        data.beginNum = this.searchForm.beginNum;
        data.endNum = this.searchForm.endNum;
      }
      data.sortType = this.searchForm.sortType;
      data.codeStatus = this.searchForm.codeStatus;
      data.searchType = this.searchForm.searchType;
      data.searchWords = this.searchForm.searchWords;
      data.pageNum = this.page.currentPage;
      data.pagesize = this.page.pagesize;
      axios
        .request({
          method: "post",
          url: "/v1/qrCode/selAntiFakeCodesWithScannedUser",
          data: data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.tableLoading = false;
            if (ret.data) {
              this.dataList = ret.data.data;
              this.page.total = ret.data.total;
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
      if (this.searchForm.bookName) {
        this.$router.push({
          path: "/publication/bookNameSearch",
          query: {
            keyWord: this.searchForm.bookName
          }
        });
      }
      this.page.currentPage = 1;
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
    this.loadPici();
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
