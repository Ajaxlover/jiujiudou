<template>
  <div class="stuCount">
    <el-container>
      <el-header>
        <el-button @click="goBack" type="plain" icon="el-icon-back" round
          >返回</el-button
        >
        <div style="font-size:20px">{{ exercisesName }}</div>
        <el-button style="visibility: hidden" type="plain">返回</el-button>
      </el-header>
      <el-main>
        <el-card class="upCard">
          <div class="first">
            <!-- <span class="first-title">{{ exercisesName }}</span> -->
            <span>
              {{ format(startTime, "MM-DD HH:mm") }}到{{
                format(endTime, "MM-DD HH:mm")
              }}
            </span>
          </div>
          <div class="second">
            <span>已提交{{ alSwer }}人</span>
            <span>未提交{{ unSwer }}人</span>
          </div>
          <div class="third">
            <span class="third-title"> 提交率 </span>
            <el-progress
              :text-inside="true"
              :stroke-width="22"
              :percentage="commitPensent | percentFormat"
              status="success"
            ></el-progress>
          </div>
          <span> 平均分：{{ averageScore | numFormat }}分 </span>
        </el-card>
        <el-card>
          <el-table
            v-loading="loading"
            :data="stuCountList"
            border
            style="width: 100%"
          >
            <el-table-column
              align="center"
              prop="stuNum"
              label="学号"
              width="180"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="stuName"
              label="姓名"
              width="180"
            >
            </el-table-column>
            <el-table-column align="center" label="提交时间">
              <template slot-scope="scope">
                {{
                  scope.row.submitTime
                    ? format(scope.row.submitTime, "MM-DD HH:mm")
                    : "未提交"
                }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="得分">
              <template slot-scope="scope">
                {{ scope.row.score }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="teacherName"
              label="批阅人"
            ></el-table-column>
            <el-table-column
              prop="correctQuantity"
              align="center"
              label="答对题数"
            >
            </el-table-column>
            <el-table-column
              prop="wrongQuantity"
              align="center"
              label="答错题数"
            >
            </el-table-column>
            <el-table-column prop="status" align="center" label="批阅状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status == 0" type="danger"
                  >未提交</el-tag
                >
                <el-tag v-if="scope.row.status == 1" type="warning"
                  >待批阅</el-tag
                >
                <el-tag v-if="scope.row.status == 2" type="success"
                  >已批阅</el-tag
                >
                <el-tag v-if="scope.row.appealFlag == 1" type="warning"
                  >有申诉</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.submitTime"
                  @click="goStuHomeWorkDetail(scope.row)"
                  type="text"
                  size="small"
                  >详情</el-button
                >
                <el-button
                  v-if="scope.row.status === 2"
                  @click="printHomewok(scope.row)"
                  type="text"
                  size="small"
                  >打印</el-button
                >
                <!-- <el-button
                  type="text"
                  @click="goDownloadDetail(scope.row)"
                  size="small"
                  >下载</el-button
                > -->
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import moment from "moment";

export default {
  data() {
    return {
      alSwer: 0,
      unSwer: 0,
      exercisesName: "",
      commitPensent: 0,
      averageScore: 0,
      exercisesId: this.$route.query.exercisesId,
      classId: this.$route.query.classId,
      startTime: this.$route.query.startTime,
      endTime: this.$route.query.endTime,
      type: this.$route.query.type,
      stuCountList: [], //学生统计表格
      loading: false
    };
  },
  filters: {
    numFormat(num) {
      return (num * 1).toFixed(1);
    },
    percentFormat(percent) {
      let num = String(percent).replace(/\%/, "");
      return Number((num * 1).toFixed(1));
    }
  },
  mounted() {
    this.loadStuCountList();
  },
  methods: {
    // 打印作业
    printHomewok(row) {
      let newUrl = this.$router.resolve({
        path: "/class/printHomework",
        query: {
          exerciseId: this.exercisesId,
          sUid: row.stuId
        }
      });
      window.open(newUrl.href, "_blank");
    },
    loadStuCountList() {
      this.loading = true;
      axios
        .request({
          method: "post",
          url: "/clazz/v4/exercise/selPendNamesByExercisesId",
          data: {
            exercisesId: this.exercisesId,
            classId: this.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.stuCountList = ret.data.exerciseDetailVOList;
            this.alSwer = ret.data.alSwer || 0;
            this.unSwer = ret.data.unSwer || 0;
            this.exercisesName = ret.data.exercisesName;
            this.commitPensent = ret.data.commitPensent || 0;
            this.averageScore = ret.data.averageScore || 0;
            setTimeout(() => {
              this.loading = false;
            }, 500);
          }
        });
    },
    // 跳转详情
    goStuHomeWorkDetail(row) {
      if (!row.submitTime) {
        // 未提交
        this.$message({
          message: "该学生未提交作业",
          type: "warning"
        });
        return;
      }
      // 跳转作业详情
      this.$router.push({
        path: "/topic/stuHomeWorkDetail",
        query: {
          exerciseId: this.exercisesId,
          classId: this.classId,
          suid: row.stuId,
          startTime: this.startTime,
          endTime: this.endTime,
          score: row.score
        }
      });
    },
    // 去下载
    goDownloadDetail(row) {
      if (!row.submitTime) {
        // 未提交
        this.$message({
          message: "该学生未提交作业",
          type: "warning"
        });
        return;
      }
      // 跳转下载详情
      this.$router.push({
        path: "/topic/downloadDetail",
        query: {
          exerciseId: this.exercisesId,
          classId: this.classId,
          suid: row.stuId,
          startTime: this.startTime,
          endTime: this.endTime,
          score: row.score
        }
      });
    },
    // 格式化时间
    format(time, format) {
      if (time) {
        let iDate = parseInt(time);
        return moment(iDate).format(format);
      }
      return "";
    },
    goBack() {
      if (this.type) {
        this.$router.push({
          path: "/class/classReport"
        });
      } else {
        this.$router.push({
          path: "/class/classReport"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.stuCount {
  .el-header {
    background-color: rgba(13, 67, 118, 1);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    line-height: 60px;
    padding: 5px 20px;
  }
  .el-main {
    background-color: #e9eef3;
    color: #333;
    // line-height: 160px;
    .upCard {
      margin-bottom: 5px;
      display: flex;
      flex-direction: column;
      .first {
        margin-bottom: 5px;
        .first-title {
          margin-right: 20px;
        }
      }
      .second {
        margin-bottom: 5px;
      }
      .third {
        width: 500px;
        margin-bottom: 5px;
        /deep/ .el-progress-bar__innerText {
          color: #000;
        }
      }
    }
  }
}
</style>
