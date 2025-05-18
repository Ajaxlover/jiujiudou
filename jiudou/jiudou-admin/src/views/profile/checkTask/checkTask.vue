<template
  ><div class="task-check">
    <el-container>
      <el-header style="height: 50px">
        <span @click="toExamManage" style="cursor:pointer;color:#2BA1F4;"
          >返回</span
        >
        <i class="el-icon-arrow-right"></i> <span>批阅列表</span>
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
                prop="order"
                label="学生序号"
                align="center"
                min-width="100"
              >
              </el-table-column>
              <el-table-column
                prop="score"
                label="分数"
                align="center"
                min-width="100"
              >
              </el-table-column>

              <el-table-column
                prop="passFlag"
                label="是否批阅"
                align="center"
                min-width="60"
              >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status == 1" type="success"
                    >已批阅</el-tag
                  >
                  <el-tag v-else type="warning">未批阅</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="passFlag"
                label="操作"
                align="center"
                min-width="60"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.status == 0"
                    @click="toCheckPaper(scope.row)"
                    type="text"
                    size="small"
                    style="margin-left:0"
                    >批阅</el-button
                  >
                  <el-button
                    v-else
                    @click="toCheckPaper(scope.row)"
                    type="text"
                    size="small"
                    style="margin-left:0"
                    >查看</el-button
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
      bankId: this.$route.query.bankId,
      examInfo: {},
      stuList: [],
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      }
    };
  },
  computed: {
    isAble() {
      return this.stuList.length === 0;
    }
  },
  methods: {
    toCheckPaper(row) {
      let { resultReadId } = row;
      this.$router.push({
        path: "/exam/examRepeatScore",
        query: {
          resultReadId,
          examId: this.examId,
          bankId: this.bankId
        }
      });
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
    getStuList() {
      let data = {};
      data.examId = this.examId;
      data.bankId = this.bankId;
      data.pageNo = this.page.currentPage;
      data.pageSize = this.page.pagesize;
      axios
        .request({
          method: "post",
          url: "/exam/exam/result/readOver/findStuPage",
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
      this.$router.back();
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
.task-check {
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
