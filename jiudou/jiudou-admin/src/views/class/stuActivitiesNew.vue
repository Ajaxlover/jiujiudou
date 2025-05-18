<template>
  <div>
    <el-container class="stu-ac-new">
      <el-main>
        <div class="part-box">
          <div class="part-box-t">
            <div>
              <div class="part-box-t-name">
                <span>签到</span>
                <div>
                  <el-button
                    size="small"
                    type="plain"
                    :disabled="!signList.length"
                    @click="exportClazzSign"
                    >导出</el-button
                  >
                  <el-button size="small" type="plain" @click="toSign"
                    >发起签到</el-button
                  >
                </div>
              </div>
              <div class="part-box-t-times">
                <span>次数：{{ signTotal }}次</span>
              </div>
              <div class="part-box-t-num">
                <span style="border-left:17px solid #5087ec;padding-left:1px"
                  >签到人数</span
                >
                <span style="border-left:17px solid #68bbc4;padding-left:1px"
                  >未签到人数</span
                >
              </div>
            </div>
          </div>
          <div class="part-box-b">
            <div
              style="width:100%;height:100%;display:flex;justify-content:center;align-items: center;"
              v-if="signList.length == 0"
            >
              <span style="color:#909399">暂无数据</span>
            </div>
            <div v-else>
              <div
                class="part-box-b-item"
                v-for="(item, index) in signList"
                @click="signDetail(item)"
                :key="index"
              >
                <div class="part-box-b-item-bar" :title="item.timeStr">
                  <div class="part-box-b-item-bar-name">{{ item.timeStr }}</div>
                  <div class="part-box-b-item-bar-line"></div>
                  <div class="part-box-b-item-bar-bar">
                    <div class="part-box-b-item-bar-bar-l">
                      {{ item.signed }}
                    </div>
                    <div class="part-box-b-item-bar-bar-r">
                      {{ item.unSigned }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="part-box">
          <div class="part-box-t">
            <div>
              <div class="part-box-t-name">
                <span>作业</span>
                <div>
                  <el-button
                    size="small"
                    type="plain"
                    @click="exportClazzExercises"
                    :disabled="!exerciseList.length"
                    >导出</el-button
                  >
                  <el-button size="small" type="plain" @click="toAddExercise"
                    >发布作业</el-button
                  >
                </div>
              </div>
              <div class="part-box-t-times">
                <span>次数：{{ exerciseTotal }}次</span>
              </div>
              <div class="part-box-t-num">
                <span style="border-left:17px solid #5087ec;padding-left:1px"
                  >提交人数</span
                >
                <span style="border-left:17px solid #68bbc4;padding-left:1px"
                  >未提交人数</span
                >
              </div>
            </div>
          </div>
          <div class="part-box-b">
            <div
              style="width:100%;height:100%;display:flex;justify-content:center;align-items: center;"
              v-if="exerciseList.length == 0"
            >
              <span style="color:#909399">暂无数据</span>
            </div>
            <div v-else>
              <div
                class="part-box-b-item"
                v-for="(item, index) in exerciseList"
                @click="homeworkDetail(item)"
                :key="index"
              >
                <div class="part-box-b-item-bar" :title="item.timeStr">
                  <div class="part-box-b-item-bar-name">
                    {{ item.timeStr }}
                  </div>
                  <div class="part-box-b-item-bar-line"></div>
                  <div class="part-box-b-item-bar-bar">
                    <div class="part-box-b-item-bar-bar-l">
                      {{ item.submitStuQuantity }}
                    </div>
                    <div class="part-box-b-item-bar-bar-r">
                      {{ item.unSubmitStuQuantity }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="part-box-b-item">
                <div class="part-box-b-item-bar">
                  <div class="part-box-b-item-bar-name">7月19日</div>
                  <div class="part-box-b-item-bar-line"></div>
                  <div class="part-box-b-item-bar-bar">
                    <div class="part-box-b-item-bar-bar-l">100</div>
                    <div class="part-box-b-item-bar-bar-r">100</div>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
        <div class="part-box">
          <div class="part-box-t">
            <div>
              <div class="part-box-t-name">
                <span>应答</span>
                <div>
                  <el-button
                    size="small"
                    type="plain"
                    @click="exportClazzReply"
                    :disabled="!answerList.length"
                    >导出</el-button
                  >
                  <el-button size="small" type="plain" @click="toAnswer"
                    >发起应答</el-button
                  >
                </div>
              </div>
              <div class="part-box-t-times">
                <span>次数：{{ answerTotal }}次</span>
              </div>
              <div class="part-box-t-num">
                <span style="border-left:17px solid #5087ec;padding-left:1px"
                  >应答人数</span
                >
                <span style="border-left:17px solid #68bbc4;padding-left:1px"
                  >未应答人数</span
                >
              </div>
            </div>
          </div>
          <div class="part-box-b">
            <div
              style="width:100%;height:100%;display:flex;justify-content:center;align-items: center;"
              v-if="answerList.length == 0"
            >
              <span style="color:#909399">暂无数据</span>
            </div>
            <div v-else>
              <div
                class="part-box-b-item"
                v-for="(item, index) in answerList"
                @click="replyDetail(item)"
                :key="index"
              >
                <div class="part-box-b-item-bar" :title="item.timeStr">
                  <div class="part-box-b-item-bar-name">
                    {{ item.timeStr }}
                  </div>
                  <div class="part-box-b-item-bar-line"></div>
                  <div class="part-box-b-item-bar-bar">
                    <div class="part-box-b-item-bar-bar-l">
                      {{ item.submitNum }}
                    </div>
                    <div class="part-box-b-item-bar-bar-r">
                      {{ item.unSubmitNum }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-main>
      <!-- 签到弹框 -->
      <el-dialog
        :visible.sync="isSignShow"
        v-if="isSignShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="100%"
        top="0"
        :show-close="false"
        class="taskTk"
      >
        <startClaSign
          v-if="isSignShow"
          :data="taskData"
          @close="backClass"
        ></startClaSign>
      </el-dialog>
      <!-- 应答弹框 -->
      <el-dialog
        v-if="isAnswerShow"
        :visible.sync="isAnswerShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="100%"
        top="0"
        :show-close="false"
        class="taskTk"
      >
        <answer :answerNo="normalAnswerNo" @close="closeAnswerShow"></answer>
      </el-dialog>

      <!-- 预览应答 -->
      <el-dialog
        v-if="isCourseAnswerShow"
        :visible.sync="isCourseAnswerShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="100%"
        top="0"
        :show-close="false"
        class="taskTk"
      >
        <courseWareAnswer
          :data="courseWareAnswerList"
          @close="isCourseAnswerShow = false"
        ></courseWareAnswer>
      </el-dialog>

      <jdialog
        title="签到详情"
        :noFooter="true"
        :visible.sync="showDialog.signDetail"
        :isFull="isSignFull"
        width="800px"
      >
        <template slot="fullscreen">
          <button class="fullBtn" @click="isSignFull = !isSignFull">
            <i class="el-icon-full-screen"></i>
          </button>
        </template>
        <template slot="body">
          <div class="dialogHeader">
            <div>
              <span style="color:#333;font-size:16px;">
                {{ format(currentSign.createTime, "M月DD") }}签到</span
              >
              <span style="color:#666;font-size:14px;margin-left:17px;">
                {{ format(currentSign.createTime, "MM-DD H:mm") }}
              </span>
            </div>
            <div>
              <el-button
                size="small"
                type="primary"
                @click="exportSign"
                :disabled="!signStuList.length"
                >导出</el-button
              >
              <el-button size="small" type="primary" @click="deleteSign"
                >删除</el-button
              >
            </div>
          </div>
          <div class="dialogSummery">
            <span class="summary">签到率：{{ signSummary.signedRate }}</span>
            <span>已签到：{{ signSummary.signedStuQuantity }}</span>
            <span>迟到：{{ signSummary.lateStuQuantity }}</span>
            <span>病假：{{ signSummary.sickStuQuantity }}</span>
            <span>事假：{{ signSummary.personalStuQuantity }}</span>
            <span>缺勤：{{ signSummary.absenceStuQuantity }}</span>
          </div>
          <el-table
            class="dialogTable"
            :data="signStuList"
            :height="isSignFull ? '600' : '290'"
            stripe
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
              label="学号"
              align="center"
              prop="stuNum"
            ></el-table-column>
            <el-table-column
              label="姓名"
              align="center"
              prop="stuName"
            ></el-table-column>
            <el-table-column label="签到时间" align="center" prop="signTime">
              <div slot-scope="scope">
                {{
                  scope.row.signType == 2 || scope.row.signType == 0
                    ? "未签到"
                    : format(scope.row.signTime, "MM-DD HH:mm")
                }}
              </div>
            </el-table-column>
            <el-table-column label="签到情况" align="center" prop="signType">
              <div slot-scope="scope">{{ signType(scope.row.signType) }}</div>
            </el-table-column>
            <el-table-column label="签到距离" align="center" prop="distance">
              <div slot-scope="scope">
                {{ scope.row.distance ? scope.row.distance + "米" : "" }}
              </div>
            </el-table-column>
          </el-table>
        </template>
      </jdialog>

      <jdialog
        title="应答详情"
        :noFooter="true"
        :visible.sync="showDialog.replyDetail"
        width="800px"
        :isFull="isAnswerFull"
      >
        <template slot="fullscreen">
          <button class="fullBtn" @click="isAnswerFull = !isAnswerFull">
            <i class="el-icon-full-screen"></i>
          </button>
        </template>
        <template slot="body">
          <div class="dialogHeader">
            <div>
              <span style="color:#333;font-size:16px;">
                {{ format(currentReply.createTime, "M月DD") }}应答
              </span>
              <span style="color:#666;font-size:14px;margin-left:17px;">
                {{ format(currentReply.createTime, "MM-DD H:mm") }}
              </span>
            </div>
            <div>
              <el-button size="small" type="primary" @click="showAnswerDetail"
                >查看题目</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="exportReply"
                :disabled="!replyStuList.length"
                >导出</el-button
              >
              <el-button size="small" type="primary" @click="deleteReply"
                >删除</el-button
              >
            </div>
          </div>
          <div class="dialogSummery">
            <span class="summary">
              <span>提交率：{{ replySummary.totalSubmitRate }}</span>
              <span style="padding: 0 10px 0 45px"
                >正确率：{{ replySummary.totalCorrectRate }}</span
              >
            </span>
          </div>
          <el-table
            class="dialogTable"
            :data="replyStuList"
            :height="isAnswerFull ? '600' : '300'"
            stripe
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
              label="学号"
              align="center"
              prop="stuNum"
            ></el-table-column>
            <el-table-column
              label="姓名"
              align="center"
              prop="stuName"
            ></el-table-column>
            <el-table-column label="提交时间" align="center">
              <div slot-scope="scope">
                {{
                  scope.row.submitTime
                    ? format(scope.row.submitTime, "MM-DD HH:mm")
                    : "未提交"
                }}
              </div>
            </el-table-column>
            <!-- <el-table-column label="答案" align="center" prop="isCorrect">
              <div slot-scope="scope">{{ replyResult(scope.row) }}</div>
            </el-table-column> -->
            <!-- <template slot="append" v-if="showReplyDetail">
            <infinite-loading @infinite="loadReplyStuList" spinner="spiral" forceUseInfiniteWrapper=".el-table__body-wrapper">
              <loading></loading>
              <span slot="no-more"></span>
              <span slot="no-results"></span>
              <span slot="error"></span>
            </infinite-loading>
          </template> -->
          </el-table>
        </template>
      </jdialog>
      <jdialog
        title="作业详情"
        :noFooter="true"
        :visible.sync="showDialog.homeworkDetail"
        :isFull="isFull"
        width="800px"
      >
        <template slot="fullscreen">
          <button class="fullBtn" @click="isFull = !isFull">
            <i class="el-icon-full-screen"></i>
          </button>
        </template>
        <template slot="body">
          <div class="dialogHeader">
            <div>
              <span style="color:#333;font-size:16px;">{{
                currentHomework.exerciseName
              }}</span>
              <span style="color:#666;font-size:14px;margin-left:17px;">
                {{ format(currentHomework.startTime, "MM-DD HH:mm") }}到{{
                  format(currentHomework.endTime, "MM-DD HH:mm")
                }}
              </span>
            </div>
            <div>
              <el-button size="small" type="primary" @click="goSee"
                >查看题目</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="exportAllHomework"
                :disabled="!homeworkStuList.length"
                >下载作业</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="exportHomework"
                :disabled="!homeworkStuList.length"
                >导出</el-button
              >
              <el-button size="small" type="primary" @click="deleteHomework"
                >删除</el-button
              >
            </div>
          </div>
          <div class="dialogSummery">
            <span class="summary">
              <span>提交率：{{ homeworkSummary.totalSubmitRate }}</span>
              <span style="padding:0 10px 0 45px;"
                >平均分：{{ homeworkSummary.totalAverageScore }}</span
              >
            </span>
          </div>
          <el-table
            class="dialogTable"
            :data="homeworkStuList"
            :height="isFull ? '600' : '300'"
            stripe
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
              label="学号"
              align="center"
              prop="stuNum"
            ></el-table-column>
            <el-table-column
              label="姓名"
              align="center"
              prop="stuName"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="提交时间" align="center">
              <template slot-scope="scope">
                {{
                  scope.row.status == 0
                    ? "未提交"
                    : format(scope.row.submitTime, "MM-DD HH:mm")
                }}
              </template>
            </el-table-column>
            <el-table-column label="得分" align="center" prop="score">
              <template slot-scope="scope">
                {{ scope.row.status == 1 ? "待批阅" : scope.row.score }}
              </template>
            </el-table-column>
            <el-table-column
              label="答对题数"
              align="center"
              prop="correctQuantity"
            ></el-table-column>
            <el-table-column
              label="答错题数"
              align="center"
              prop="wrongQuantity"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="80">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="printHomewok(scope.row)"
                  v-if="scope.row.status !== 0"
                  >打印作业</el-button
                >
                <el-button
                  type="text"
                  @click="toCheck(scope.row)"
                  size="small"
                  v-if="scope.row.status == 1"
                  >去批阅</el-button
                >
                <el-button
                  type="text"
                  @click="toCheck(scope.row)"
                  size="small"
                  v-if="scope.row.status == 2"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </jdialog>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.stu-ac-new {
  .fullBtn {
    position: absolute;
    top: 20px;
    right: 60px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 16px;
  }
  .dialogHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dialogSummery {
    margin-top: 26px;
    background: #fbf8eb;
    color: #ac7427;
    font-size: 16px;
    border: 1px solid #e6d3b7;
    border-radius: 4px;
    .summary {
      background: #fbe265;
      padding-left: 31px;
      padding-right: 21px;
    }
  }
  .dialogSummery > span {
    padding: 13px 9px 18px 28px;
    display: inline-block;
  }
  .dialogTable {
    border-radius: 4px;
    border: 1px solid rgba(13, 67, 118, 0.2);
    margin-top: 22px;
  }

  .taskTk {
    /deep/ .el-dialog {
      height: 100%;
      margin-bottom: 0;
      border-radius: 0;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        height: 100%;
        padding: 0 !important;
      }
    }
  }
  .el-main {
    background: #ffffff;
    border-radius: 4px;
    min-height: 580px;
    display: flex;
    justify-content: space-between;
    .part-box {
      height: 100%;
      width: 33%;
      display: flex;
      flex-direction: column;
      .part-box-t {
        // flex: 1;
        .part-box-t-name {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            font-size: 24px;
          }
        }
        .part-box-t-times {
          span {
            font-size: 20px;
          }
        }
        .part-box-t-num {
          text-align: center;
        }
      }
      .part-box-b {
        width: 100%;
        height: 460px;
        border: 1px solid #becbd9;
        overflow-y: auto;
        .part-box-b-item {
          height: 50px;
          width: 100%;
          padding: 10px 0 10px 0;
          .part-box-b-item-bar {
            display: flex;
            height: 40px;
            .part-box-b-item-bar-name {
              width: 14%;
              line-height: 40px;
              font-size: 13px;
              text-align: right;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .part-box-b-item-bar-line {
              width: 2px;
              // height: 45px;
              border-top: 1px solid gray;
              border-bottom: 1px solid gray;
              border-right: 1px solid gray;
            }
            .part-box-b-item-bar-bar {
              display: flex;
              width: 82%;
              .part-box-b-item-bar-bar-l {
                width: 50%;
                background-color: #5087ec;
                text-align: center;
                line-height: 40px;
                color: #fff;
                cursor: pointer;
              }
              .part-box-b-item-bar-bar-r {
                width: 50%;
                background-color: #68bbc4;
                text-align: center;
                line-height: 40px;
                color: #fff;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import startClaSign from "@/views/claCourseware/startClaSign.vue";
import answer from "@/views/claCourseware/answer.vue";
import moment from "moment";
import common from "@/utils/common";
import courseWareAnswer from "@/views/claCourseware/answerSubject.vue";

// import { format } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
import printJS from "print-js";

// import cropper from "@/components/cropper";
export default {
  components: {
    jdialog,
    startClaSign,
    answer,
    courseWareAnswer
    // cropper
  },
  props: {
    className: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      isFull: false, // 作业详情弹窗是否全屏
      isSignFull: false, // 签到详情弹窗是否全屏
      isAnswerFull: false, // 应答详情弹窗是否全屏
      courseWareAnswerList: [], // 应答题目
      isCourseAnswerShow: false,
      isAnswerShow: false,
      normalAnswerNo: "",
      taskData: {
        signNo: "" //签到ID
        // coursewareId: this.$route.query.coursewareId
      },
      isSignShow: false, // 显示签到弹窗
      signTotal: 0,
      exerciseTotal: 0,
      answerTotal: 0,
      cls: {},
      signList: [],
      exerciseList: [],
      answerList: [],
      exerciseName: "作业一",
      showDialog: {
        signDetail: false,
        replyDetail: false,
        homeworkDetail: false,
        stuCount: false,
        subjectDetail: false,
        printHomewok: false
      },
      signStuList: [],
      currentSign: {},
      signSummary: {
        signedRate: "0%",
        signedStuQuantity: 0,
        lateStuQuantity: 0,
        sickStuQuantity: 0,
        personalStuQuantity: 0,
        absenceStuQuantity: 0
      },
      currentReply: {},
      replyStuList: [],
      replySummary: {
        totalSubmitRate: "0%",
        totalCorrectRate: "0%"
      },
      currentHomework: {},
      homeworkSummary: {
        totalSubmitRate: "0%",
        totalAverageScore: 0
      },
      homeworkStuList: []
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    // this.loadList();
    this.loadSignList();
    this.loadHomeworkList();
    this.loadReplyList();
  },
  methods: {
    showAnswerDetail() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/answer/queryInfoList",
          data: {
            answerId: this.currentReply.answerId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.courseWareAnswerList = ret.data;
            this.isCourseAnswerShow = true;
          }
        });
    },
    // 删除签到
    deleteSign() {
      axios
        .request({
          method: "post",
          url: "/v1/clazz/delSign",
          data: {
            signNo: this.currentSign.signNo
          }
        })
        .then(
          function(data) {
            let ret = data.data;
            if (ret.code === 200) {
              this.$message({
                type: "success",
                message: "删除签到成功"
              });
              this.showDialog.signDetail = false;
              this.loadSignList();
            } else {
              this.$message({
                type: "error",
                message: ret.msg
              });
            }
          }.bind(this)
        );
    },
    // 导出单次签到详情
    exportSign() {
      let url =
        process.env.BASE_URL +
        "/v1/clazz/exportSignDetail?signNo=" +
        this.currentSign.signNo +
        "&startTime=" +
        this.currentSign.createTime +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    signType(type) {
      let array = ["缺勤", "已签到", "缺勤", "病假", "事假", "迟到"];
      if (type < array.length) {
        return array[type];
      }
      return "缺勤";
    },
    // 格式化时间
    format(time, format) {
      if (time) {
        let iDate = parseInt(time);
        return moment(iDate).format(format);
      }
      return "";
    },
    // 格式化题目类型
    formatType(type) {
      return common.typeFormat(type);
    },
    closeAnswerShow() {
      this.isAnswerShow = false;
      this.normalAnswerNo = "";
      this.loadReplyList();
    },
    backClass() {
      this.isSignShow = false;
      this.taskData.signNo = "";
      this.loadSignList();
    },
    toAnswer() {
      this.getAnsweringNormal();
    },
    // 查询进行中的应答
    getAnsweringNormal() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/answer/queryAvailable",
          data: {
            classId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // this.courseWareAnswerList = ret.data;
            if (ret.data && ret.data.answerNo) {
              this.normalAnswerNo = ret.data.answerNo;
            }
            this.isAnswerShow = true;
          }
        });
    },
    toSign() {
      axios
        .request({
          method: "post",
          url: "/clazz/signV2/latestSignTea",
          data: {
            classId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.isSignShow = true;

            if (ret.data && ret.data.signId) {
              this.taskData.signNo = ret.data.signNo;
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.data.msg
            });
          }
        });
    },
    toAddExercise() {
      axios
        .request({
          method: "post",
          url: "/v1/ware/addExercise",
          data: {
            exerciseName: this.exerciseName,
            type: 2 // 教学活动作业
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$router.push({
              path: "/claCourseware/editTask",
              query: {
                exerciseId: ret.data.exerciseId,
                classId: this.cls.classId
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 签到列表
    loadSignList() {
      axios
        .request({
          method: "post",
          url: "/v1/clazz/selSigns",
          data: {
            clazzId: this.cls.classId,
            pageNum: 1,
            pagesize: 9999
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data.data && ret.data.data.length > 0) {
              this.signList = ret.data.data;
            }
            this.signTotal = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.data.msg
            });
          }
        });
    },
    // 作业列表
    loadHomeworkList() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/exercise/selExercisesByClazzId",
          data: {
            clazzId: this.cls.classId,
            pageNum: 1,
            pagesize: 9999
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data && ret.data.data.length > 0) {
              this.exerciseList = ret.data.data;
            }
            this.exerciseTotal = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.data.msg
            });
          }
        });
    },
    // 应答列表
    loadReplyList() {
      axios
        .request({
          method: "post",
          url: "/clazz/f1/answer/selAnswersByClazzId",
          data: {
            clazzId: this.cls.classId,
            pageNum: 1,
            pagesize: 9999
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.answerList = ret.data.data;
            this.answerTotal = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.data.msg
            });
          }
        });
    },
    // 导出班级签到
    exportClazzSign() {
      let url =
        process.env.BASE_URL +
        "/v1/clazz/exportSignXlsxV2?clazzId=" +
        this.cls.classId +
        "&clazzName=" +
        this.cls.classname +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 导出班级作业
    exportClazzExercises() {
      let url =
        process.env.BASE_URL +
        "/clazz/v4/exercise/exportExercisesXlsxByClazzIdV2?clazzId=" +
        this.cls.classId +
        "&clazzName=" +
        this.cls.classname +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 导出班级应答
    exportClazzReply() {
      let url =
        process.env.BASE_URL +
        "/clazz/f1/answer/exportAnswerXlsxV2?clazzId=" +
        this.cls.classId +
        "&clazzName=" +
        this.cls.classname +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    loadList() {
      this.loading.list = true;
      axios
        .request({
          method: "post",
          url: "/clazz/evaluate/memberEvaluate",
          data: {
            conditions: this.conditions,
            page: this.listPage.page,
            pageSize: this.listPage.pageSize,
            classId: this.cls.classId
          }
        })
        .then(res => {
          this.loading.list = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.list = ret.data.data;
            this.listPage.total = ret.data.total;
          }
        })
        .catch(() => {
          this.loading.list = false;
        });
    },
    // 签到详情
    signDetail(row) {
      console.log(row);
      this.currentSign = row;
      // this.page.signDetail = 1;
      // this.signStuList = [];
      this.showDialog.signDetail = true;
      this.loadSignSummary();
      this.loadSignStuList();
    },
    // 单次签到汇总
    loadSignSummary() {
      axios
        .request({
          method: "post",
          url: "v1/clazz/selSignDetailSummary",
          data: {
            signNo: this.currentSign.signNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.signSummary = ret.data;
          }
        });
    },
    // 单次签到学生列表
    loadSignStuList() {
      axios
        .request({
          method: "post",
          url: "v1/clazz/selSignDetail",
          data: {
            signNo: this.currentSign.signNo,
            pageNum: 1,
            pagesize: 9999
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.signStuList = ret.data;
            // if (ret.data.length) {
            //   this.page.signDetail++;
            //   this.signStuList.push(...ret.data);
            // } else {
            // }
          } else {
          }
        })
        .catch(() => {});
    },
    // 应答详情
    replyDetail(row) {
      this.currentReply = row;
      this.loadReplySummary();
      this.loadReplyStuList();
      this.showDialog.replyDetail = true;
    },
    // 单次应答汇总
    loadReplySummary() {
      axios
        .request({
          method: "post",
          url: "clazz/f1/answer/selAnswerDetailSummary",
          data: {
            answerNo: this.currentReply.answerNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.replySummary = ret.data;
          }
        });
    },
    // 单次应答学生列表
    loadReplyStuList() {
      axios
        .request({
          method: "post",
          url: "clazz/f1/answer/selAnswerDetail",
          data: {
            answerNo: this.currentReply.answerNo,
            pageNum: 1,
            pagesize: 9999
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.replyStuList = ret.data;
            // if (ret.data.length) {
            //   this.page.replyDetail++;
            //   this.replyStuList.push(...ret.data);
            // } else {
            // }
          } else {
          }
        })
        .catch(() => {});
    },
    // 导出单次应答详情
    exportReply() {
      let url =
        process.env.BASE_URL +
        "/clazz/f1/answer/exportAnswerDetailXlsx?answerNo=" +
        this.currentReply.answerNo +
        "&createTime=" +
        this.currentReply.createTime +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    replyResult(row) {
      if (row.submitTime) {
        if (row.isCorrect == 2) {
          return "正确";
        }
        return "错误";
      } else {
        return "--";
      }
    },
    exportAllHomework() {
      let url =
        process.env.BASE_URL +
        "/tiku/exerciseStu/exportExerciseStuZip?exerciseId=" +
        this.currentHomework.exerciseId +
        "&exerciseName=" +
        this.currentHomework.exerciseName +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 导出作业详情
    exportHomework() {
      let url =
        process.env.BASE_URL +
        "/clazz/v4/exercise/exportExerciseDetaiXlsxByExerciseId?exerciseId=" +
        this.currentHomework.exerciseId +
        "&exerciseName=" +
        this.currentHomework.exerciseName +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 删除应答
    deleteReply() {
      axios
        .request({
          method: "post",
          url: "clazz/v4/answer/delAnswerByAnswerNo",
          data: {
            answerNo: this.currentReply.answerNo
          }
        })
        .then(
          function(data) {
            let ret = data.data;
            if (ret.code === 200) {
              this.$message({
                type: "success",
                message: "删除应答成功"
              });
              this.showDialog.replyDetail = false;
              this.loadReplyList();
            } else {
              this.$message({
                type: "error",
                message: ret.msg
              });
            }
          }.bind(this)
        );
      // this.$confirm(
      //   "你是否确定要删除本次应答？删除应答数据后不可恢复",
      //   "提示",
      //   {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     closeOnClickModal: false,
      //     closeOnPressEscape: false,
      //     type: "warning"
      //   }
      // )
      //   .then(() => {

      //   })
      //   .catch(() => {});
    },
    // 删除作业
    deleteHomework() {
      axios
        .request({
          method: "post",
          url: "clazz/v4/exercise/delExerciseByExerciseIdAndCreatorId",
          data: {
            exerciseId: this.currentHomework.exerciseId
          }
        })
        .then(
          function(data) {
            let ret = data.data;
            if (ret.code === 200) {
              this.$message({
                type: "success",
                message: "删除作业成功"
              });
              this.showDialog.homeworkDetail = false;
              this.loadHomeworkList();
            } else {
              this.$message({
                type: "error",
                message: ret.msg
              });
            }
          }.bind(this)
        );
    },
    // 打印作业
    printHomewok(row) {
      // axios.request({
      //   method: 'post',
      //   url: '/tiku/exerciseStu/exerciseInfoStuPC',
      //   data: {
      //     exerciseId: this.currentHomework.exerciseId,
      //     uid: this.$store.state.user.userId,
      //     sUid: row.stuId
      //   }
      // }).then(res => {
      //   // let ret = res.data
      //   this.printHomewokData = res.data.data
      //   console.log(this.printHomewokData)
      //   this.showDialog.printHomewok = true
      // }).catch(() => {
      // })
      let newUrl = this.$router.resolve({
        path: "/class/printHomework",
        query: {
          exerciseId: this.currentHomework.exerciseId,
          sUid: row.stuId
        }
      });
      window.open(newUrl.href, "_blank");
    },
    //格式化图片大图预览
    previewSrcList(item) {
      console.log(item);
      let imgSrc = [];
      if (item) {
        imgSrc.push(item);
      }
      return imgSrc;
    },
    // 格式化时间
    // format(time, format) {
    //   if (time) {
    //     let iDate = parseInt(time);
    //     return moment(iDate).format(format);
    //   }
    //   return "";
    // },
    // 格式化题目类型
    // formatType(type) {
    //   return common.typeFormat(type);
    // },
    getAnswer(answerList) {
      let answer = "无";
      let list = [];
      if (answerList) {
        answerList.forEach(element => {
          if (element.isCorrect == 2) {
            list.push(element.option);
          }
        });
        if (list.length) {
          answer = list.join(",");
        }
      }
      return answer;
    },
    print(obj) {
      var newWindow = window.open("打印窗口", "_blank");
      var docStr = obj.innerHTML;
      newWindow.document.write(
        "<lin" +
          "k hr" +
          'ef="//frontend.mofangchuxing.com/element-ui/index.css?print" re' +
          'l="stylesheet">'
      );
      newWindow.document.write(
        "<lin" + "k hr" + 'ef="ent.css?print" re' + 'l="stylesheet">'
      );
      newWindow.document.write(docStr);
      newWindow.document.close();
      newWindow.print();
      newWindow.close();
    },
    printCheckoutDetail() {
      // var f = document.getElementById('printiframe')
      let subOutputRankPrint = document.getElementById("printCons"); // 要打印区域的元素id
      console.log(subOutputRankPrint.innerHTML);
      let newContent = subOutputRankPrint.innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      document.body.innerHTML = oldContent;
      window.location.reload();
      return false;
    },
    goPrint() {
      console.log("打印");
      const style =
        "@page { size:auto;margin: 0cm 1cm 0cm 1cm; } " +
        "@media print { body { font-size: 40px } }";
      printJS({
        printable: "printCons",
        type: "html",
        targetStyles: ["*"],
        ignoreElements: ["no-print", "bc", "gb"],
        style: style //去除页眉页脚
      });
    },
    // 作业详情
    homeworkDetail(row) {
      this.currentHomework = row;
      this.loadHomeworkSummary();
      this.showDialog.homeworkDetail = true;
      this.loadHomeworkStuList();
    },
    // 单次作业汇总
    loadHomeworkSummary() {
      axios
        .request({
          method: "post",
          url: "clazz/v4/exercise/selExerciseDetaiSummaryByExerciseId",
          data: {
            exerciseId: this.currentHomework.exerciseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.homeworkSummary = ret.data;
          }
        });
    },
    loadHomeworkStuList() {
      axios
        .request({
          method: "post",
          url: "clazz/v4/exercise/selExerciseDetailByExerciseId",
          data: {
            exerciseId: this.currentHomework.exerciseId,
            pageNum: 1,
            pagesize: 9999
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.homeworkStuList = ret.data;
          } else {
          }
        })
        .catch(() => {});
    },
    toCheck(row) {
      // 跳转作业详情
      this.$router.push({
        path: "/topic/stuHomeWorkDetail",
        query: {
          exerciseId: this.currentHomework.exerciseId,
          classId: this.cls.classId,
          suid: row.stuId,
          startTime: this.currentHomework.startTime,
          endTime: this.currentHomework.endTime,
          score: row.score
        }
      });
    },
    goSee() {
      this.$router.push({
        path: "/topic/topicDetail",
        query: {
          exerciseId: this.currentHomework.exerciseId,
          exerciseName: this.currentHomework.exerciseName,
          classId: this.cls.classId
        }
      });
    }
  }
};
</script>
