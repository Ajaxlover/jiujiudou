<template>
  <el-container class="cloudCourse">
    <el-header style="height: 50px">
      竞赛管理
    </el-header>
    <el-main>
      <div class="top">
        <div class="left-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            @submit.native.prevent
          >
            <el-form-item>
              <el-input
                v-model.trim="searchForm.examName"
                placeholder="请输入竞赛名称"
                style="width: 200px"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                size="small"
                v-model="searchForm.startTime"
                placeholder="选择开始时间"
                type="datetime"
                clearabletype="date"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                :style="{ width: '100%' }"
              >
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                size="small"
                v-model="searchForm.endTime"
                placeholder="选择结束时间"
                type="datetime"
                clearabletype="date"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                :style="{ width: '100%' }"
              >
                >
              </el-date-picker>
            </el-form-item>
            <!-- popper-class="popper-select" -->
            <el-form-item label="状态">
              <el-select
                :popper-append-to-body="false"
                style="width: 120px"
                size="small"
                v-model="searchForm.status"
                placeholder="请选择状态"
                @change="searchExam"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="未发布" value="0"></el-option>
                <el-option label="已发布" value="1"></el-option>
                <el-option label="进行中" value="2"></el-option>
                <el-option label="已结束" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchExam"
                size="small"
              ></el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="operateBtn">
          <el-button
            @click="toCreateExam"
            size="small"
            type="primary"
            icon="el-icon-plus"
            >创建竞赛</el-button
          >
          <!-- <el-button size="small" @click="transExam" type="primary"
            >试卷转发</el-button
          >
          <el-button size="small" @click="shareExam" type="primary"
            >试卷分享</el-button
          > -->
        </div>
      </div>
      <div class="main">
        <el-table
          :data="examList"
          row-key="id"
          :tree-props="{ children: 'competeList' }"
          border
          default-expand-all
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
          :row-style="{ height: '60px' }"
          v-loading="loading.tableLoading"
        >
          <el-table-column prop="name" label="竞赛名称" min-width="120">
          </el-table-column>

          <el-table-column
            prop="startTime"
            label="开始时间"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.startTime == 0">-</span>
              <span v-else>{{ dateFormat(scope.row.startTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束时间"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.endTime == 0">-</span>
              <span v-else>{{ dateFormat(scope.row.endTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.createTime">{{
                dateFormat1(scope.row.createTime)
              }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            min-width="60"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.masterheadId">{{
                statusFormat(scope.row)
              }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="auto">
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.status > 0"
                v-if="scope.row.masterheadId && scope.row.isMock === 0"
                @click="toContestInfo(scope.row)"
                type="text"
                size="small"
                style="margin-left:0"
                >编辑</el-button
              >
              <!-- :disabled="scope.row.status > 0" -->
              <!-- :disabled="scope.row.status > 0" -->
              <el-button
                v-else
                v-show="!scope.row.masterheadId"
                type="text"
                @click="toEditContest(scope.row)"
                size="small"
                style="margin-left:0"
                >编辑</el-button
              >

              <el-button
                :disabled="scope.row.status > 0"
                v-if="scope.row.masterheadId && scope.row.isMock === 0"
                type="text"
                @click="toViewScore(scope.row)"
                size="small"
                style="margin-left:0"
                >查看</el-button
              >
              <el-button
                v-else
                v-show="!scope.row.masterheadId"
                type="text"
                @click="toViewContest(scope.row)"
                size="small"
                style="margin-left:0"
                >报名列表</el-button
              >
              <el-button
                v-if="!scope.row.masterheadId"
                type="text"
                @click="toSetHonor(scope.row)"
                size="small"
                style="margin-left:0"
                >奖项设置</el-button
              >
              <!-- <el-button
                v-show="!scope.row.masterheadId"
                type="text"
                @click="toViewSetting(scope.row)"
                size="small"
                style="margin-left:0"
                >查看</el-button
              > -->
              <el-button
                :disabled="scope.row.status > 0"
                v-if="!scope.row.masterheadId && scope.row.status != 2"
                type="text"
                size="small"
                @click="deleteExam(scope.row)"
                style="margin-left:0"
                >删除</el-button
              >

              <!-- <el-button
                type="text"
                size="small"
                @click="toViewSetting(scope.row)"
                style="margin-left:0"
                >预览</el-button
              >
              
              <el-button
                v-if="scope.row.status == 3"
                type="text"
                size="small"
                @click="toExamAnalysis(scope.row)"
                style="margin-left:0"
                >统计分析</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从 {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
            {{
              (this.page.currentPage - 1) * this.page.pagesize +
                this.examList.length
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
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import { formatSS } from "@/utils/datetime";

export default {
  components: {
    // courseProtocol
  },
  data() {
    return {
      shareModal2: false,
      isShareShow: false,
      isTransPaperShow: false, // 转发
      shareLink: "",
      radioSelect: "",
      radioCheck: {},
      searchForm: {
        examName: "",
        startTime: null,
        endTime: null,
        status: ""
      },
      examList: [],
      isBigImageShow: false,
      isAgreeShow: false,
      lockBook: false,
      bookAdded: false,
      keyWord: "",
      loading: {
        tableLoading: false,
        loadingChangePrice: false
      },
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      isChangePriceShow: false,
      priceForm: {
        oldPrice: "",
        newPrice: ""
        // effectiveTime: '',
      },
      pickerOptions: {
        // 时间不让选择今天以前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      // historyPrice: [],
      currentCourse: {},
      classList: [],
      classPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      selectedClass: [],
      classKeyWord: "" // 班级名称
    };
  },
  computed: {
    isAbleTrans() {
      return this.selectedClass.length === 0;
    }
  },
  methods: {
    toEditContest(row) {
      let { id, status } = row;
      if (status >= 1) {
        this.$router.push({
          path: "/operation/viewContest",
          query: {
            id
          }
        });
      } else {
        this.$router.push({
          path: "/operation/editContest",
          query: {
            id
          }
        });
      }
    },
    toContestInfo(row) {
      this.$router.push({
        path: "/operation/contestInfo",
        query: {
          id: row.id,
          masterheadId: row.masterheadId
        }
      });
    },
    //  奖项设置
    toSetHonor(row) {
      this.$router.push({
        path: "/operation/honorSetting",
        query: {
          competeId: row.id
        }
      });
    },
    toViewContest(row) {
      // 查看竞赛报名列表
      this.$router.push({
        path: "/operation/contestJoinList",
        query: {
          competeId: row.id
        }
      });
    },
    toViewSetting(row) {
      // 查看竞赛设置
      let { id } = row;
      this.$router.push({
        path: "/operation/viewContest",
        query: {
          id
        }
      });
    },
    toViewScore(row) {
      // 查看竞赛报名列表
      this.$router.push({
        path: "/operation/contestUpgrade",
        query: {
          competeId: row.id,
          masterheadId: row.masterheadId,
          isLast: row.isLast
        }
      });
    },
    // 转发试卷
    handleCloseTransPaper() {
      this.classKeyWord = "";
      this.classPage.currentPage = 1;
      this.selectedClass = [];
      this.isTransPaperShow = false;
    },
    transExam() {
      if (!this.radioSelect) {
        this.$message({
          type: "warning",
          message: "请先选择考试"
        });
        return;
      }
      this.getClassList();
    },
    handleSelectionChange(val) {
      this.selectedClass = val;
    },
    // 撤回考试
    examBack(row) {
      this.$confirm("是否撤销该考试?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/exam/exam/withdraw",
              data: {
                examId: row.examId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "撤销成功!"
                });
                this.loadData();
              } else {
                this.$message({
                  type: "info",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    // 确定转发考试
    doTransPaper() {
      let classIds = [];
      this.selectedClass.forEach(item => {
        classIds.push(item.classId);
      });
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/relay",
          data: {
            examId: this.radioSelect,
            classIds: classIds.join(",")
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: "转发成功"
            });
            this.handleCloseTransPaper();
            this.radioSelect = "";
            this.radioCheck = {};
            this.loadData();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    shareExam() {
      if (!this.radioSelect) {
        this.$message({
          type: "warning",
          message: "请先选择考试"
        });
        return;
      }
      this.isShareShow = true;
    },
    toCreateShareLink() {
      this.tsCode = "";
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/createShareCode",
          data: {
            examId: this.radioSelect
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.shareModal2 = true;
            this.tsCode = ret.data.code;
            this.shareLink =
              process.env.THIS_URI + "/index?type=5&shareCode=" + this.tsCode;
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
    },
    resetLink() {},

    //复制链接
    copyShareLink() {
      if (this.shareLink.split(" ").join("").length == 0) {
        return false;
      }
      //let Url2 = 'https://tfwww.jiudou123.com/index?type=2&shareCode=' + this.shareLink;  //每一行的某个值，如选中的当前行的url
      var oInput = document.createElement("input"); //创建一个隐藏input（重要！）
      oInput.value = this.shareLink; //赋值
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },
    loadData() {
      this.loading.tableLoading = true;
      let data = {};
      // data.uid = 661605;
      data.pageNo = this.page.currentPage;
      data.pageSize = this.page.pagesize;
      if (this.searchForm.examName) {
        data.name = this.searchForm.examName;
      }
      if (this.searchForm.startTime) {
        data.startTime = this.searchForm.startTime;
      }
      if (this.searchForm.endTime) {
        data.endTime = this.searchForm.endTime;
      }
      if (this.searchForm.status) {
        data.status = this.searchForm.status;
      }
      axios
        .request({
          method: "post",
          url: "/exam/masterHead/list",
          data: data
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.examList = ret.data.records;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    searchClass() {
      this.classPage.currentPage = 1;
      this.getClassList();
    },
    getClassList() {
      let data = {};
      data.pageNo = this.classPage.currentPage;
      data.pageSize = this.classPage.pagesize;
      if (this.classKeyWord) {
        data.className = this.classKeyWord;
      }
      axios
        .request({
          method: "post",
          url: "/clazz/clazz/myAllClassPage",
          data: data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isTransPaperShow = true;
            this.classList = ret.data.data;
            this.classPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    searchExam() {
      this.page.currentPage = 1;
      this.loadData();
    },
    toCreateExam() {
      this.$router.push({
        path: "/operation/createContest"
      });
    },
    toExamAnalysis(row) {
      this.$router.push({
        path: "/exam/examAnalysis",
        query: {
          examId: row.examId,
          isAdmin: 1
        }
      });
    },
    dateFormat(row) {
      return formatSS(row);
    },
    dateFormat1(row) {
      let d = new Date(row);
      return formatSS(d.getTime());
    },
    statusFormat(row) {
      let statusText = "";
      switch (row.status) {
        case 0:
          statusText = "未发布";
          break;
        case 1:
          statusText = "已发布";

          break;
        case 2:
          statusText = "进行中";

          break;
        default:
          statusText = "已结束";

          break;
      }
      return statusText;
    },
    //删除
    deleteExam(row) {
      this.$confirm("是否删除该竞赛活动?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/exam/masterHead/delete",
              data: {
                id: row.id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.loadData();
              } else {
                this.$message({
                  type: "warning",
                  message: "服务器错误"
                });
              }
            });
        })
        .catch(() => {});
    },
    // 去发布考试
    toPublishExam(row) {
      this.$router.push({
        path: "/exam/examPublish",
        query: {
          examId: row.examId
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
/deep/ .popper-select {
  position: absolute !important;
  top: 25px !important;
  left: 0px !important;
}
.cloudCourse {
  .el-header {
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
    div {
      float: right;
      font-size: 14px;
      color: #666666;
      cursor: pointer;
    }
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding-top: 12px;
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 12px;
    .top {
      .left-form {
        float: left;
      }
      .operateBtn {
        float: right;
      }
    }
    .main {
      margin-top: 13px;

      .info {
        padding: 0px 10px;
        overflow: hidden;
        text-align: left;
        .left {
          float: left;
          img {
            width: 157.4px;
            height: 86px;
            display: block;
          }
        }
        .middle {
          margin-left: 18px;
          float: left;
          .name {
            font-weight: bold;
            font-size: 14px;
            color: #333333;
            span:first-child {
              // border:1px solid #2BA1F4;
              // color:#2BA1F4;
              // font-weight:normal;
              // padding: 2px 5px;
              // font-size: 12px;
              // border-radius: 10px;
              // margin-right: 10px;
              cursor: pointer;
            }
            // span:nth-child(2){
            //   cursor: pointer;
            // }
          }
          .cloudId {
            margin-top: 5px;
            font-size: 14px;
            color: #666666;
          }
          .price {
            color: #ff783d;
            margin-top: 6px;
            font-weight: 600;
          }
        }
        .courseTime {
          float: right;
          font-size: 14px;
          margin-right: 20px;
          color: #999999;
          line-height: 86px;
        }
        .right {
          float: right;
          line-height: 86px;
          margin-right: 50px;
          color: #2ba1f4;
        }
      }
    }
  }
  .el-date-editor .el-range-separator {
    width: auto;
  }
}
</style>
