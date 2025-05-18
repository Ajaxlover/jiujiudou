<template
  ><div class="exam-analysis">
    <el-container>
      <el-header style="height: 50px">
        <span @click="toExamManage" style="cursor:pointer;color:#2BA1F4;"
          >考试列表</span
        >
        <i class="el-icon-arrow-right"></i> <span>提交记录</span>
      </el-header>
      <el-main>
        <div style="margin-bottom: 15px;">
          <el-select
            :popper-append-to-body="false"
            style="width: 120px"
            size="small"
            v-model="searchForm.isCommit"
            placeholder="请选择状态"
            @change="searchExam"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未提交" value="0"></el-option>
            <el-option label="已提交" value="1"></el-option>
          </el-select>
          <el-select
            :popper-append-to-body="false"
            style="width: 120px"
            size="small"
            v-model="searchForm.isRead"
            placeholder="请选择状态"
            @change="searchExam"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未批阅" value="0"></el-option>
            <el-option label="已批阅" value="1"></el-option>
          </el-select>
        </div>
        <el-table
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
          :data="stuInfoList"
          border
          :row-style="{ height: '60px' }"
        >
          <el-table-column
            prop="stuName"
            label="姓名"
            align="center"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="stuNumber"
            label="学号"
            align="center"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="doTime"
            label="答题时长"
            align="center"
            min-width="50"
          >
          </el-table-column>
          <el-table-column
            prop="endTimeStr"
            label="交卷时间"
            align="center"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="isCommit"
            label="是否提交"
            align="center"
            min-width="120"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isCommit == 0" type="warning"
                >未提交</el-tag
              >
              <el-tag v-if="scope.row.isCommit == 1" type="success"
                >已提交</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="isRead"
            label="是否批阅"
            align="center"
            min-width="120"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isRead == 0" type="warning"
                >待批阅</el-tag
              >
              <el-tag v-if="scope.row.isRead == 1" type="success"
                >已批阅</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从
            {{
              (this.stuInfoPage.currentPage - 1) * this.stuInfoPage.pagesize + 1
            }}
            到
            {{
              (this.stuInfoPage.currentPage - 1) * this.stuInfoPage.pagesize +
                this.stuInfoList.length
            }}
            记录，共 {{ stuInfoPage.total }} 条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            background
            :total="stuInfoPage.total"
            :current-page.sync="stuInfoPage.currentPage"
            :page-size="stuInfoPage.pagesize"
            @current-change="getStuInfoList"
          ></el-pagination>
        </div>

        <!-- <div class="top-part"></div>
        <div class="bottom-part"></div> -->
      </el-main>
      <!-- 查看多次作答 -->
      <el-dialog
        top="6vh"
        v-if="isMoreShow"
        :visible.sync="isMoreShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="handleClose"
        width="1000px"
        center
      >
        <template slot="title">
          <div>
            <div></div>
            <div>多次作答记录</div>
          </div>
        </template>

        <el-table
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
          :data="moreList"
          border
          :row-style="{ height: '60px' }"
        >
          <el-table-column
            prop="stuName"
            label="姓名"
            align="center"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="doTime"
            label="答题时长"
            align="center"
            min-width="50"
          >
          </el-table-column>
          <el-table-column
            prop="endTimeStr"
            label="交卷时间"
            align="center"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="userScore"
            label="成绩"
            align="center"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="isRead"
            label="结果"
            align="center"
            min-width="120"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isRead == 0" type="warning"
                >待批阅</el-tag
              >
              <el-tag v-if="scope.row.isRead == 1" type="success"
                >已批阅</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从
            {{ (this.morePage.currentPage - 1) * this.morePage.pagesize + 1 }}
            到
            {{
              (this.morePage.currentPage - 1) * this.morePage.pagesize +
                this.moreList.length
            }}
            记录，共 {{ morePage.total }} 条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            background
            :total="morePage.total"
            :current-page.sync="morePage.currentPage"
            :page-size="morePage.pagesize"
            @current-change="getMoreList"
          ></el-pagination>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import { formatSS } from "@/utils/datetime";
import common from "@/utils/common";

export default {
  components: {},
  data() {
    return {
      searchForm: {
        isCommit: "",
        isRead: ""
      },
      examId: this.$route.query.examId,
      isAdmin: this.$route.query.isAdmin,
      isMoreShow: false,
      stuName: "", // 学生信息搜索关键字
      baseInfo: {}, // 成绩统计
      subjecNum: "", // 试题分析关键字
      activeName: "first",
      childTabName: "first",
      subjectAnalysisList: [], // 试题分析
      achieveList: [], // 成绩分析
      scoreAnalysisList: [], // 分数段统计
      stuInfoList: [], // 学生信息
      moreList: [],
      morePage: {
        total: 0,
        pagesize: 5,
        currentPage: 1
      },
      subjectPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      page: {
        total: 0,
        pagesize: 5,
        currentPage: 1
      },
      scoreAnalysisPage: {
        total: 0,
        pagesize: 5,
        currentPage: 1
      },
      stuInfoPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      loading: {
        tableLoading: false
      },
      option: {
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value",
          minInterval: 1
        },
        series: [
          {
            data: [],
            type: "bar",
            showBackground: false,
            backgroundStyle: {
              color: "rgba(112, 162, 252, 0.2)"
            },
            itemStyle: {
              normal: {
                color: "#00A3E0"
              }
            }
          }
        ]
      },
      currentRow: {}
    };
  },
  computed: {
    isAchieveAble() {
      return this.achieveList.length === 0;
    },
    isScoreAnalysisAble() {
      return this.scoreAnalysisList.length === 0;
    },
    isStuAble() {
      return this.stuInfoList.length === 0;
    }
  },
  methods: {
    searchExam() {
      this.stuInfoPage.currentPage = 1;
      this.getStuInfoList();
    },
    // 类型
    formatType(row) {
      return common.typeFormat(row.tSubject);
    },
    handleClose() {
      this.isMoreShow = false;
    },
    handleRowClick(row, column, event) {
      this.currentRow = row;
      this.getMoreList();
    },
    getMoreList() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/statistics/getStuAllResultList",
          data: {
            examId: this.examId,
            stuUid: this.currentRow.stuUid,
            pageNo: this.morePage.currentPage,
            pageSize: this.morePage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;

          if (ret.code === 200) {
            this.isMoreShow = true;
            this.moreList = ret.data.records;
            this.morePage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    init() {
      var chartDom = this.$refs.mainBox;
      // eslint-disable-next-line no-undef
      // var myChart = this.$echarts.init(chartDom);
      var myChart = this.$echarts(chartDom);
      myChart.setOption(this.option);
    },
    handleClick(tab, event) {
      if (tab.name == "second") {
        // 试题分析
        this.getSubjectAnalysisList();
      }
    },
    handleChildTabClick(tab, event) {
      if (tab.name == "second") {
        // 分数段统计
        this.getScoreAnalysisList();
        // this.init();
      } else if (tab.name == "third") {
        // 学生信息
        this.getStuInfoList();
      }
    },
    toExamManage() {
      if (this.isAdmin == 1) {
        this.$router.push({
          path: "/exam/examManageAdmin"
        });
      } else {
        this.$router.push({
          path: "/exam/examManage"
        });
      }
    },
    // 成绩统计
    getBaseInfo() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/statistics/getClassResult",
          data: {
            examId: this.examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.baseInfo = ret.data;
            if (ret.data.examId) {
              this.achieveList = [ret.data];
              this.page.total = 1;
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 导出班级成绩分析
    exportClassResult() {
      let url =
        process.env.BASE_URL +
        "/exam/exam/statistics/exportClassResult?examId=" +
        this.examId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 试题分析
    getSubjectAnalysisList() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/statistics/subjectAnalysis",
          data: {
            examId: this.examId,
            searchWord: this.subjecNum,
            pageNo: this.subjectPage.currentPage,
            pageSize: this.subjectPage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.subjectAnalysisList = ret.data.records;
            this.subjectPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    searchSubjectAnalysis() {
      this.subjectPage.currentPage = 1;
      this.getSubjectAnalysisList();
    },
    // 成绩分析
    getAchieveList() {
      this.loading.tableLoading = true;
      axios
        .request({
          method: "post",
          url: "/exam/exam/statistics/classResultList",
          data: {
            examId: "",
            pageNo: this.page.currentPage,
            pageSize: this.page.pagesize
          }
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.achieveList = ret.data.records;
            // this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 分数段统计
    getScoreAnalysisList() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/statistics/getScoreResult",
          data: {
            examId: this.examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.scoreAnalysisList = ret.data;
            let xdata = [];
            let ydata = [];
            this.scoreAnalysisList.forEach(item => {
              xdata.push(item.scoreSegment);
              ydata.push(item.stuNum);
            });
            this.option.xAxis.data = xdata;
            this.option.series[0].data = ydata;
            this.init();
            // this.scoreAnalysisPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 导出分数段统计
    exportScoreSegment() {
      let url =
        process.env.BASE_URL +
        "/exam/exam/statistics/exportScoreSegment?examId=" +
        this.examId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 学生信息
    getStuInfoList() {
      let data = {
        examId: this.examId,
        pageNo: this.stuInfoPage.currentPage,
        pageSize: this.stuInfoPage.pagesize
      };
      if (this.searchForm.isCommit) {
        data.isCommit = this.searchForm.isCommit;
      }
      if (this.searchForm.isRead) {
        data.isRead = this.searchForm.isRead;
      }
      axios
        .request({
          method: "post",
          url: "/exam/exam/result/getStuCommitResultPage",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.stuInfoList = ret.data.records;
            this.stuInfoPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 导出学生信息
    exportStuResult() {
      let url =
        process.env.BASE_URL +
        "/exam/exam/statistics/exportStuResult?examId=" +
        this.examId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    searchStuInfo() {
      this.stuInfoPage.currentPage = 1;
      this.getStuInfoList();
    },
    dateFormat(row) {
      return formatSS(row);
    }
  },
  mounted() {
    this.getStuInfoList();
    // this.getBaseInfo();
  }
};
</script>

<style lang="scss" scoped>
.exam-analysis {
  position: relative;
  // /deep/.el-dialog {
  //     margin: 5vh auto !important;
  //   }

  /deep/ .el-dialog__body {
    height: 75vh;
    overflow: hidden;
    overflow-y: auto;
  }

  .el-header {
    width: 100%;
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 720px;
    padding-top: 12px;
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 12px;
    .parentTab {
      .top-btn {
        margin-bottom: 15px;
        overflow: hidden;
      }
      .top-part {
        width: 100%;
        // height: 300px;
        // background-color: red;
        margin-bottom: 40px;
        // display: flex;
        .exam-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 40px;
          border-left: 4px solid #2ba1f4;
          padding-left: 6px;
        }
        .exam-info {
          display: flex;
          height: 200px;
          margin-bottom: 40px;
          .exam-info-l {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-right: 200px;
          }
          .exam-info-r {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }
        .childTab {
          /deep/ .el-tabs__nav-wrap::after {
            width: 60%;
          }
          /deep/ .el-tabs__content {
            width: 60%;
            .top-btn {
              margin-bottom: 15px;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
}
</style>
