<template
  ><div class="exam-analysis">
    <el-container>
      <el-header style="height: 50px">
        <span @click="toExamManage" style="cursor:pointer;color:#2BA1F4;"
          >考试列表</span
        >
        <i class="el-icon-arrow-right"></i> <span>统计分析</span>
      </el-header>
      <el-main>
        <el-tabs
          class="parentTab"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane label="成绩统计" name="first">
            <div class="top-part">
              <div class="exam-title">{{ baseInfo.examName }}</div>
              <div class="exam-info">
                <div class="exam-info-l">
                  <span>应考人数：{{ baseInfo.shouldStuNum }}</span>
                  <span>总分：{{ baseInfo.score }}</span>
                  <span>及格分：{{ baseInfo.passScore }}</span>
                  <span>答题时长：{{ baseInfo.doTime }}分钟</span>
                </div>
                <div class="exam-info-r">
                  <span>平均分：{{ baseInfo.avgScore }}</span>
                  <span>最高分：{{ baseInfo.maxScore }}</span>
                  <span>最低分：{{ baseInfo.minScore }}</span>
                  <span
                    >考试时间：{{ dateFormat(baseInfo.startTime) }} -
                    {{ dateFormat(baseInfo.endTime) }}</span
                  >
                </div>
              </div>
              <div>
                <el-tabs
                  class="childTab"
                  v-model="childTabName"
                  @tab-click="handleChildTabClick"
                >
                  <el-tab-pane label="成绩分析" name="first">
                    <div class="top-btn">
                      <el-button
                        @click="exportClassResult"
                        style="float:right"
                        size="small"
                        type="primary"
                        :disabled="isAchieveAble"
                        >导出</el-button
                      >
                    </div>
                    <div>
                      <el-table
                        :header-cell-style="{
                          'background-image':
                            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                          color: '#333333',
                          height: '40px',
                          padding: '0'
                        }"
                        :data="achieveList"
                        border
                        :row-style="{ height: '60px' }"
                        v-loading="loading.tableLoading"
                      >
                        <el-table-column
                          prop="className"
                          label="班级名称"
                          align="center"
                          min-width="120"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="shouldStuNum"
                          label="应考人数"
                          align="center"
                          min-width="120"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="takeStuNum"
                          label="实考人数"
                          align="center"
                          min-width="120"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="takeRate"
                          label="参考率"
                          align="center"
                          min-width="120"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="passRate"
                          label="及格率"
                          align="center"
                          min-width="120"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="maxScore"
                          label="最高分"
                          align="center"
                          min-width="60"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="minScore"
                          label="最低分"
                          align="center"
                          min-width="60"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="avgDoTime"
                          label="平均时长"
                          align="center"
                          min-width="60"
                        >
                        </el-table-column>
                      </el-table>
                      <div class="tabelFooter">
                        <div class="right-footer-first">
                          从
                          {{
                            (this.page.currentPage - 1) * this.page.pagesize + 1
                          }}
                          到
                          {{
                            (this.page.currentPage - 1) * this.page.pagesize +
                              this.achieveList.length
                          }}
                          记录，共 {{ page.total }} 条
                        </div>
                        <el-pagination
                          layout="prev, pager, next, jumper"
                          background
                          :total="page.total"
                          :current-page.sync="page.currentPage"
                          :page-size="page.pagesize"
                        ></el-pagination>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="分数段统计" name="second">
                    <div class="top-btn">
                      <el-button
                        @click="exportScoreSegment"
                        style="float:right"
                        size="small"
                        type="primary"
                        :disabled="isScoreAnalysisAble"
                        >导出</el-button
                      >
                    </div>
                    <div>
                      <div
                        class="chart-box"
                        style="height:280px;width:800px"
                        ref="mainBox"
                        id="main"
                      ></div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="学生信息" name="third">
                    <div class="top-btn">
                      <el-input
                        v-model.trim="stuName"
                        placeholder="请输入学生姓名"
                        style="width: 240px"
                        size="small"
                        @keyup.enter.native="searchStuInfo"
                      ></el-input>
                      <el-button
                        type="primary"
                        icon="el-icon-search"
                        size="small"
                        @click="searchStuInfo"
                      ></el-button>
                      <el-button
                        @click="exportStuResult"
                        style="float:right"
                        size="small"
                        type="primary"
                        :disabled="isStuAble"
                        >导出</el-button
                      >
                    </div>
                    <div>
                      <el-table
                        @row-click="handleRowClick"
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
                          prop="userScore"
                          label="成绩"
                          align="center"
                          min-width="120"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="result"
                          label="结果"
                          align="center"
                          min-width="120"
                        >
                        </el-table-column>
                      </el-table>
                      <div class="tabelFooter">
                        <div class="right-footer-first">
                          从
                          {{
                            (this.stuInfoPage.currentPage - 1) *
                              this.stuInfoPage.pagesize +
                              1
                          }}
                          到
                          {{
                            (this.stuInfoPage.currentPage - 1) *
                              this.stuInfoPage.pagesize +
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
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="试题分析" name="second">
            <div class="top-btn">
              <div style="float:right">
                <el-input
                  size="small"
                  v-model.trim="subjecNum"
                  placeholder="请输入题号/标题"
                  style="width: 300px"
                  @keyup.enter.native="searchSubjectAnalysis"
                ></el-input>
                <el-button
                  size="small"
                  icon="el-icon-search"
                  type="primary"
                  @click="searchSubjectAnalysis"
                ></el-button>
              </div>
            </div>
            <div>
              <el-table
                :header-cell-style="{
                  'background-image':
                    'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                  color: '#333333',
                  height: '40px',
                  padding: '0'
                }"
                :data="subjectAnalysisList"
                border
                :row-style="{ height: '60px' }"
              >
                <el-table-column
                  prop="type"
                  label="题型"
                  align="center"
                  min-width="90"
                  :formatter="formatType"
                >
                </el-table-column>
                <!-- <el-table-column
                  prop="learnPort"
                  label="知识点"
                  align="center"
                  min-width="50"
                >
                </el-table-column> -->
                <el-table-column
                  prop="briefTitle"
                  label="题目内容"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="correctStuNum"
                  label="正确人次"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="answerStuNum"
                  label="答题人次"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="correctRate"
                  label="正确率"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="errorStuNum"
                  label="错题人次"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="errorRate"
                  label="错误率"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
              </el-table>
              <div class="tabelFooter">
                <div class="right-footer-first">
                  从
                  {{
                    (this.subjectPage.currentPage - 1) *
                      this.subjectPage.pagesize +
                      1
                  }}
                  到
                  {{
                    (this.subjectPage.currentPage - 1) *
                      this.subjectPage.pagesize +
                      this.subjectAnalysisList.length
                  }}
                  记录，共 {{ subjectPage.total }} 条
                </div>
                <el-pagination
                  layout="prev, pager, next, jumper"
                  background
                  :total="subjectPage.total"
                  :current-page.sync="subjectPage.currentPage"
                  :page-size="subjectPage.pagesize"
                  @current-change="getSubjectAnalysisList"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
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
        pagesize: 5,
        currentPage: 1
      },
      loading: {
        tableLoading: false
      },
      option: {
        tooltip: {
          show: true,
          trigger: "item"
        },
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
      axios
        .request({
          method: "post",
          url: "/exam/exam/statistics/getStuResultList",
          data: {
            examId: this.examId,
            searchWord: this.stuName,
            pageNo: this.stuInfoPage.currentPage,
            pageSize: this.stuInfoPage.pagesize
          }
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
    this.getBaseInfo();
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
