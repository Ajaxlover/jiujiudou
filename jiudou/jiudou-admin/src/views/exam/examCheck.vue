<template
  ><div class="exam-check">
    <el-container>
      <el-header style="height: 50px">
        <span @click="toExamManage" style="cursor:pointer;color:#2BA1F4;"
          >考试列表</span
        >
        <i class="el-icon-arrow-right"></i> <span>成绩批改</span>
      </el-header>
      <el-main>
        <div class="top-part">
          <span class="exam-name">考试名称：{{ examInfo.examName }}</span>
          <span class="exam-time"
            >考试时间：{{ dateFormat(examInfo.startTime) }} -
            {{ dateFormat(examInfo.endTime) }}</span
          >
        </div>
        <div>
          <div class="top-btn">
            <div style="float:left">
              <el-input
                size="small"
                placeholder="请输入学生姓名/学号/手机号"
                style="width: 300px"
                v-model.trim="keyWord"
                @keyup.enter.native="searchStuList"
              ></el-input>
              <el-button
                size="small"
                icon="el-icon-search"
                type="primary"
                @click="searchStuList"
              ></el-button>
            </div>
            <el-button
              @click="exportStuResultList"
              style="float:right"
              size="small"
              type="primary"
              :disabled="isAble"
              >成绩导出</el-button
            >
            <el-button
              :loading="exportStuPaperZipLoading"
              @click="exportStuPaperZip"
              style="float:right;margin-right:10px"
              size="small"
              type="primary"
              :disabled="isAble"
              >答卷导出</el-button
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
              :data="stuList"
              border
              :row-style="{ height: '60px' }"
            >
              <el-table-column
                prop="stuName"
                label="姓名"
                align="center"
                min-width="100"
              >
              </el-table-column>
              <el-table-column
                prop="stuNumber"
                label="学号"
                align="center"
                min-width="100"
              >
              </el-table-column>
              <el-table-column
                prop="mobile"
                label="手机号"
                align="center"
                min-width="120"
              >
              </el-table-column>
              <el-table-column
                prop="userScore"
                label="分数"
                align="center"
                min-width="60"
              >
              </el-table-column>
              <el-table-column
                prop="passFlag"
                label="是否及格"
                align="center"
                min-width="60"
              >
                <template slot-scope="scope">
                  {{ scope.row.passFlag == 1 ? "及格" : "不及格" }}
                </template>
              </el-table-column>
              <el-table-column
                prop="forceSubmitTimes"
                label="强制交卷(次数)"
                align="center"
                min-width="60"
              >
              </el-table-column>
              <el-table-column
                prop="startTime"
                label="开始时间"
                align="center"
                min-width="120"
              >
                <template slot-scope="scope">
                  {{ dateFormat(scope.row.startTime) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="endTime"
                label="交卷时间"
                align="center"
                min-width="120"
              >
                <template slot-scope="scope">
                  {{ dateFormat(scope.row.endTime) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="doTime"
                label="答题时长（分钟）"
                align="center"
                min-width="80"
              >
              </el-table-column>
              <el-table-column
                prop="isRead"
                label="是否已批阅"
                align="center"
                min-width="60"
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
              <el-table-column label="操作" align="center" min-width="120">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.isRead == 1"
                    type="text"
                    @click="toExamScore(scope.row)"
                    size="small"
                    style="margin-left:0"
                    >查看</el-button
                  >
                  <el-button
                    v-if="scope.row.isRead == 0"
                    @click="toExamScore(scope.row)"
                    type="text"
                    size="small"
                    style="margin-left:0"
                    >批阅</el-button
                  >
                  <el-button
                    type="text"
                    @click="exportSingleExam(scope.row)"
                    size="small"
                    style="margin-left:0"
                    >答卷导出</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="tabelFooter">
              <div class="right-footer-first">
                从
                {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }}
                到
                {{
                  (this.page.currentPage - 1) * this.page.pagesize +
                    this.stuList.length
                }}
                记录，共 {{ page.total }} 条
              </div>
              <el-pagination
                layout="prev, pager, next, jumper"
                background
                :total="page.total"
                :current-page.sync="page.currentPage"
                :page-size="page.pagesize"
                @current-change="getStuList"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import { formatSS } from "@/utils/datetime";

export default {
  components: {},
  data() {
    return {
      examId: this.$route.query.examId,
      examInfo: {},
      stuList: [],
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      keyWord: "",
      exportStuPaperZipLoading: false
    };
  },
  computed: {
    isAble() {
      return this.stuList.length === 0;
    }
  },
  methods: {
    exportSingleExam(row) {
      let { examResultId } = row;
      let url =
        process.env.BASE_URL +
        "/exam/exam/result/exportWord?examId=" +
        this.examId +
        "&examResultId=" +
        examResultId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    exportStuPaperZip() {
      let url =
        process.env.BASE_URL +
        "/exam/exam/result/exportWordZip?examId=" +
        this.examId +
        "&token=" +
        this.$store.state.user.token;
      this.exportStuPaperZipLoading = true;
      fetch(url).then(res =>
        res
          .blob()
          .then(blob => {
            let elemIF = window.document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            window.document.body.appendChild(elemIF);

            // var a = document.createElement("a");
            // // 用 blob 对象来创建一个 object URL
            // var url = window.URL.createObjectURL(blob);
            // // var filename = "what-you-want.txt";
            // a.href = url;
            // // a.download = filename;
            // a.click();
            // // 使用完object URL 之后手动撤销以释放掉内存优化性能
            // window.URL.revokeObjectURL(url);
          })
          .then(() => {
            this.exportStuPaperZipLoading = false;
          })
      );
    },
    exportStuResultList() {
      let url =
        process.env.BASE_URL +
        "/exam/exam/result/exportStuResultList?examId=" +
        this.examId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    getExamInfo() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/getExamInfo",
          data: {
            examId: this.examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.examInfo = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    searchStuList() {
      this.page.currentPage = 1;
      this.getStuList();
    },
    getStuList() {
      let data = {};
      data.examId = this.examId;
      data.pageNo = this.page.currentPage;
      data.pageSize = this.page.pagesize;
      if (this.keyWord) {
        data.searchWord = this.keyWord;
      }
      axios
        .request({
          method: "post",
          url: "/exam/exam/result/getList",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.stuList = ret.data.records;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    toExamManage() {
      this.$router.push({
        path: "/exam/examManage"
      });
    },
    toExamScore(row) {
      let { examId, examResultId } = row;
      this.$router.push({
        path: "/exam/examScore",
        query: {
          examId,
          examResultId
        }
      });
    },
    dateFormat(row) {
      return formatSS(row);
    }
  },
  mounted() {
    this.getExamInfo();
    this.getStuList();
  }
};
</script>

<style lang="scss" scoped>
.exam-check {
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

    .top-part {
      width: 100%;
      margin-bottom: 30px;
      font-size: 18px;
      .exam-name {
      }
      .exam-time {
        margin-left: 200px;
      }
    }
    .top-btn {
      margin-bottom: 30px;
      overflow: hidden;
    }
  }
}
</style>
