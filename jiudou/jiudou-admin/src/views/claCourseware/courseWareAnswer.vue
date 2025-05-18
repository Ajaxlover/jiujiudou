<template>
  <div class="course-ware-answer">
    <div class="answerList">
      <div class="answerListHeader">
        <span class="backBtn" type="text" @click="back"
          ><i class="el-icon-back"></i>返回</span
        >
      </div>
    </div>
    <div v-if="!isShowResult && data.length > 1" class="change-answer-arrow">
      <i
        style="color:#fff;font-size:50px;cursor: pointer;"
        class="el-icon-arrow-right"
        @click="nextCourseAnswer"
      ></i>
    </div>
    <el-container v-if="!isShowResult">
      <el-container
        v-for="(item, index) in data"
        :key="index"
        style="padding:0 200px;height:100%"
        v-show="index == idx"
      >
        <el-aside width="326px">
          <div
            class="side-top"
            style="font-size:34px;font-weight:bold;margin-bottom:26px;text-align:center"
          >
            {{ item.name }}
          </div>
          <div class="side-middle">
            <ul>
              <li
                @click="changeTi(index)"
                v-for="(i, index) in item.bankList"
                :key="index"
              >
                {{ index + 1 }}
              </li>
            </ul>
          </div>
          <div class="side-bottom">
            <div>
              应答时长：
              <el-select
                v-model="selectAnswerTime"
                size="small"
                style="width:100px;"
              >
                <el-option label="3分钟" value="180"></el-option>
                <el-option label="5分钟" value="300"></el-option>
                <el-option label="10分钟" value="600"></el-option>
              </el-select>
            </div>
            <div style="text-align:center;margin-top:10px">
              <el-button
                style="width:194px;"
                type="primary"
                @click="doPublishAnswer(item)"
                >发布应答</el-button
              >
            </div>
          </div>
          <!-- 进行中 -->
          <!-- <div class="answerStatus2">
            <div class="answerCountdown">
              <div>0</div>
              <div>10</div>
              <span>:</span>
              <div>20</div>
              <div>10</div>
            </div>
            <div class="answerSubmiteNum">
              <div>已提交</div>
              <div>
                <span class="answerRightNum">2222</span>/<span
                  class="answerTotalNum"
                  >15</span
                >
              </div>
            </div>
            <div class="answerBtn">
              <el-button plain class="cancelBtn" @click="cancelAnswer"
                >取消</el-button
              >
              <el-button type="warning" @click="endAnswer">结束</el-button>
            </div>
          </div> -->
          <!-- 已结束 -->
          <!-- <div class="answerStatus3">
            <div class="answerSubmiteNum">
              <div>已提交</div>
              <div>
                <span class="answerRightNum">10</span>/<span
                  class="answerTotalNum"
                  >15</span
                >
              </div>
            </div>
          </div> -->
        </el-aside>
        <el-main
          v-for="(t, tIdx) in item.bankList"
          :key="t.id"
          v-show="tiIdx == tIdx"
        >
          <div class="head">
            <span class="type">{{ formatType(t.tSubject) }}</span
            >({{ tIdx + 1 }}/{{ item.bankList.length }})
            <div><jmath class="title" :data="t.title"></jmath></div>
          </div>
          <div class="options">
            <div class="option" v-for="(option, j) in t.answerList" :key="j">
              <div class="aOption">{{ option.aOption }}</div>
              <jmath class="aText" :data="option.aText"></jmath>
            </div>
          </div>
          <el-button type="text" @click="showAnswer"
            >答案和解析&nbsp;<img
              src="@/assets/images/arrow_double_down.png"
              style="width:14px;"
          /></el-button>
          <el-collapse-transition>
            <div class="bm" v-show="showAnalyse">
              <div class="tp">【答案】{{ t.correctAnswer }}</div>
              <div class="tp">【解析】<jmath :data="t.analyse"></jmath></div>
            </div>
          </el-collapse-transition>
        </el-main>
      </el-container>
    </el-container>
    <el-container v-if="isShowResult">
      <el-container style="padding:0 0 0 0px;height:100%">
        <el-aside width="326px">
          <div
            class="side-top"
            style="font-size:34px;font-weight:bold;margin-bottom:26px;text-align:center"
          ></div>
          <div class="side-middle-answering">
            <ul>
              <li
                v-for="(i, index) in currentAnswering.reportBank"
                :key="index"
                @click="changeAnsweringTi(index)"
              >
                {{ index + 1 }}
              </li>
            </ul>
          </div>
        </el-aside>
        <div style="display:flex;flex-direction:column;background-color: #fff;">
          <el-main
            style="width:800px;height:600px"
            v-for="(t, tIdx) in currentAnswering.reportBank"
            :key="t.bankId"
            v-show="answeringTiIdx == tIdx"
          >
            <div class="head-ti-content">
              <span class="type">{{ formatType(t.bank.tSubject) }}</span
              >({{ tIdx + 1 }}/{{ currentAnswering.reportBank.length }})
              <div><jmath class="title" :data="t.bank.title"></jmath></div>
            </div>
            <div class="options">
              <div
                class="option"
                v-for="(option, j) in t.bank.answerList"
                :key="j"
              >
                <div class="aOption">{{ option.aOption }}</div>
                <jmath class="aText" :data="option.aText"></jmath>
              </div>
            </div>
            <el-button type="text" @click="showAnswer"
              >答案和解析&nbsp;<img
                src="@/assets/images/arrow_double_down.png"
                style="width:14px;"
            /></el-button>
            <el-collapse-transition>
              <div class="bm" v-show="showAnalyse">
                <div class="tp">【答案】{{ t.bank.correctAnswer }}</div>
                <div class="tp">
                  【解析】<jmath :data="t.bank.analyse"></jmath>
                </div>
              </div>
            </el-collapse-transition>
          </el-main>
          <div style="height:400px;background-color: #fff;padding-left:20px">
            <div>
              <el-button class="answered-data" type="text" @click="showChart"
                >应答分析&nbsp;<img
                  src="@/assets/images/arrow_double_down.png"
                  style="width:14px;"
              /></el-button>
              <el-collapse-transition>
                <div v-show="isShowChart">
                  <div class="bm" style="font-size:18px">
                    总人数：{{ analyseTotal }}人,{{ analyseAnswered }}人已答，{{
                      analyseRightNum
                    }}人正确
                  </div>
                  <div class="answer-chart">
                    <div
                      ref="myAnswerChart"
                      id="myAnswerChart"
                      style="height:280px;width:600px"
                    ></div>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </div>
        <el-main>
          <div class="head-answering">
            <div class="head-answering-l">
              <div class="word">应答</div>
              <div class="num">
                已完成：<span>{{ answered }}/{{ total }}</span>
              </div>
            </div>
            <div class="head-answering-r">
              <div v-if="currentAnswering.answerStatus == 1" class="time">
                <div
                  style="color:#1c272e;font-size:50px;text-align:center;with:100%"
                >
                  {{ minutes }} : {{ seconds }}
                </div>
              </div>
              <div class="btns" v-if="currentAnswering.answerStatus == 1">
                <el-button plain class="cancelBtn" @click="cancelAnswer"
                  >取消</el-button
                >
                <el-button plain @click="endAnswer">结束</el-button>
              </div>
            </div>
          </div>
          <div class="head-answering-table">
            <el-table
              :data="answeringList"
              height="550"
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
                prop="SNumber"
              ></el-table-column>
              <el-table-column
                label="姓名"
                align="center"
                prop="SRealName"
              ></el-table-column>
              <el-table-column label="完成时长" align="center" prop="duration">
                <template slot-scope="scope">
                  <span>{{ millisecondsToMMSS(scope.row.duration) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="正确率" align="center" prop="accuracy">
              </el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      v-if="isAnswerOptionShow"
      :visible.sync="isAnswerOptionShow"
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      width="600px"
      top="20vh"
      :show-close="true"
      :modal="false"
      class="option-show"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>选中{{ stuOption }}的学生</div>
        </div>
      </template>
      <div class="option-show-content">
        <div
          v-for="(item, idx) in optionAnswerList"
          class="option-show-content-item"
          :key="idx"
        >
          <div style="with: 70px; height: 60px">
            <img
              v-if="item.sPic"
              :src="item.sPic"
              alt=""
              class="stuPic"
              style="border-radius:50%;with: 60px; height: 60px;border:2px solid #fff;"
            />
            <img
              v-else
              src="@/assets/images/userPic.png"
              alt=""
              class="stuPic"
              style="border-radius:50%;with: 60px; height: 60px;border:2px solid #fff;"
            />
          </div>
          <span>{{ item.sRealName }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import jmath from "@/components/jmath";
import common from "@/utils/common";
import axios from "@/libs/api.request";
import addAnswerTest from "./addAnswerTest";

export default {
  name: "courseWareAnswer",
  props: {
    data: Array,
    answerNo: String
  },
  components: {
    jmath,
    addAnswerTest
  },
  data() {
    return {
      stuOption: "",
      optionAnswerList: [],
      isShowChart: false,
      answeringList: [],
      answered: 0,
      total: 0,
      analyseTotal: 0,
      analyseAnswered: 0,
      analyseRightNum: 0,
      option: {
        xAxis: {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true //类目轴中在 boundaryGap 为 true 的时候有效，
            //可以保证刻度线和标签对齐,不设置会出现柱状图不在刻度线中间
          },
          interval: 1
        },
        yAxis: {
          type: "value",
          minInterval: 1
        },
        series: [
          {
            data: [],
            type: "bar",
            barWidth: 40,
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
      answeringTiIdx: 0,
      currentAnswering: {},
      cls: {},
      tiIdx: 0,
      selectAnswerTime: "300", // 选择发布应答的时长
      idx: 0, // 课件应答下标
      isShowResult: false, // 显示应答进行时
      isAnswerChartShow: true, // 显示应答分析
      isAnswerOptionShow: false, // 选项数据弹窗
      selectTime: "300", // 应答时长
      datePickShow: false,
      loading: false,
      showAnalyse: false,
      minutes: 88,
      seconds: 88,
      time2: null,
      time1: null,
      countDown: 0
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.loadAnswerStatus();
  },
  beforeDestroy() {
    clearInterval(this.time2);
    clearInterval(this.time1);
  },
  computed: {},
  methods: {
    millisecondsToMMSS(milliseconds) {
      const seconds = Math.floor(milliseconds / 1000);
      const mm = Math.floor(seconds / 60);
      const ss = seconds % 60;
      return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    },
    showChart() {
      if (this.currentAnswering.answerStatus == 1) {
        this.$message({
          type: "warning",
          message: "当前应答未结束"
        });
        return;
      }
      this.isShowChart = !this.isShowChart;
    },
    init() {
      // let chartDom = this.$refs.myAnswerChart;
      let chartDom;
      this.$nextTick(() => {
        console.log(this.$refs.myAnswerChart);
        chartDom = document.getElementById("myAnswerChart");
        // eslint-disable-next-line no-undef
        var myChart = this.$echarts(chartDom);

        myChart.setOption(this.option);
        myChart.on("click", params => {
          // console.log("柱状图", params);
          this.isAnswerOptionShow = true;
          this.stuOption = params.name;
          this.queryAnswerStuByOption(params.name);
        });
      });
    },
    queryAnswerStuByOption(params) {
      let reportListJsonStr = [];
      reportListJsonStr = this.currentAnswering.reportBank[this.answeringTiIdx]
        .reportList;
      axios
        .request({
          method: "post",
          url: "/clazz/v4/answer/analysisAnswerStu",
          data: {
            reportListJsonStr: JSON.stringify(reportListJsonStr),
            name: params
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.optionAnswerList = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //获取应答状态
    loadAnswerStatus() {
      if (this.answerNo) {
        //有存在的应答
        this.isShowResult = true;
        axios
          .request({
            method: "post",
            url: "/clazz/Api/Answer/answerInfoTea",
            data: {
              classId: this.cls.classId,
              answerNo: this.answerNo
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              this.currentAnswering = ret.data;
              this.countDown = ret.data.countDown;
              if (this.countDown > 0) {
                this.isShowResult = true;
              }
              this.timer();
              let xdata = [];
              let ydata = [];
              this.currentAnswering.reportBank[0].reportList.forEach(item => {
                xdata.push(item.name);
                ydata.push(item.number);
              });
              this.option.xAxis.data = xdata;
              this.option.series[0].data = ydata;
              this.analyseAnswered = this.currentAnswering.reportBank[0].answered;
              this.analyseTotal = this.currentAnswering.reportBank[0].total;
              this.analyseRightNum = this.currentAnswering.reportBank[0].rightNum;

              this.init();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      } else {
        this.isShowResult = false;
      }
    },
    getSumbmitStuList() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/answer/querySubmitStuList",
          data: {
            answerNo: this.currentAnswering.answerNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.answeringList = ret.data.stuList;
            this.answered = ret.data.answered;
            this.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getAnsweringInfoByTime() {
      axios
        .request({
          method: "post",
          url: "/clazz/Api/Answer/answerInfoTea",
          data: {
            classId: this.cls.classId,
            answerNo: this.currentAnswering.answerNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.currentAnswering = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getAnsweringInfo(answerNo) {
      axios
        .request({
          method: "post",
          url: "/clazz/Api/Answer/answerInfoTea",
          data: {
            classId: this.cls.classId,
            answerNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.currentAnswering = ret.data;
            this.countDown = ret.data.countDown;
            if (this.countDown > 0) {
              this.isShowResult = true;
            }
            this.timer();
            let xdata = [];
            let ydata = [];
            this.currentAnswering.reportBank[0].reportList.forEach(item => {
              xdata.push(item.name);
              ydata.push(item.number);
            });
            this.option.xAxis.data = xdata;
            this.option.series[0].data = ydata;
            this.analyseAnswered = this.currentAnswering.reportBank[0].answered;
            this.analyseTotal = this.currentAnswering.reportBank[0].total;
            this.analyseRightNum = this.currentAnswering.reportBank[0].rightNum;
            this.init();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 切换应答
    nextCourseAnswer() {
      this.idx++;
      this.tiIdx = 0;
      if (this.idx == this.data.length) {
        this.idx = 0;
      }
    },
    changeAnsweringTi(index) {
      this.answeringTiIdx = index;
      let xdata = [];
      let ydata = [];
      this.currentAnswering.reportBank[index].reportList.forEach(item => {
        xdata.push(item.name);
        ydata.push(item.number);
      });
      this.option.xAxis.data = xdata;
      this.option.series[0].data = ydata;
      this.analyseAnswered = this.currentAnswering.reportBank[index].answered;
      this.analyseTotal = this.currentAnswering.reportBank[index].total;
      this.analyseRightNum = this.currentAnswering.reportBank[index].rightNum;
      this.init();
    },
    changeTi(index) {
      this.tiIdx = index;
    },
    doPublishAnswer(item) {
      // this.isShowResult = true;
      axios
        .request({
          method: "post",
          url: "/clazz/Api/Answer/createAnswerFromAnswer",
          data: {
            answerId: item.answerId,
            classId: this.cls.classId,
            // answerDuration: 60 * 40
            answerDuration: this.selectAnswerTime
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isShowResult = true;
            var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
            var cEvent = new CountEvent("publish_ware_answer");
            window.JAnalyticsInterface.onEvent(cEvent);
            this.$message({
              type: "success",
              message: "应答发布成功"
            });
            this.getAnsweringInfo(ret.data.answerNo);
          }
        });
    },
    // 格式化题目类型
    formatType(type) {
      return common.typeFormat(type);
    },
    // 显示/隐藏答案
    showAnswer() {
      this.showAnalyse = !this.showAnalyse;
    },
    // 显示应答分析
    showAnswerChart() {
      this.isAnswerChartShow = !this.isAnswerChartShow;
    },
    //返回ppt
    back() {
      this.$emit("close");
      clearInterval(this.time2);
      clearInterval(this.time1);
    },

    //轮询 更新列表
    num(n) {
      return n < 10 ? "0" + n : "" + n;
    },
    timer() {
      this.minutes = this.num(parseInt(this.countDown / 60));
      this.seconds = this.num(this.countDown % 60);
      this.timered();
      this.time1 = setInterval(() => {
        if (this.seconds == 0 && this.minutes != 0) {
          this.seconds = 59;
          this.minutes -= 1;
        } else if (this.minutes == 0 && this.seconds == 0) {
          this.seconds = 0;
          clearInterval(this.time2);
          clearInterval(this.time1);
        } else {
          this.seconds -= 1;
        }
        this.seconds = this.num(parseInt(this.seconds));
        this.minutes = this.num(parseInt(this.minutes));
      }, 1000);
    },
    timered() {
      this.time2 = setInterval(() => {
        this.getAnsweringInfoByTime();
        this.getSumbmitStuList();
      }, 1000);
    },
    // 结束应答
    endAnswer() {
      axios
        .request({
          method: "post",
          url: "/clazz/Api/Answer/finishAnswer",
          data: {
            classId: this.cls.classId,
            answerNo: this.currentAnswering.answerNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            clearInterval(this.time2);
            clearInterval(this.time1);
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.getAnsweringInfoByTime();
            this.getSumbmitStuList();
          }
        });
    },
    // 取消应答
    cancelAnswer() {
      axios
        .request({
          method: "post",
          url: "/clazz/Api/Answer/cancelAnswer",
          data: {
            classId: this.cls.classId,
            answerNo: this.currentAnswering.answerNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.$emit("close");
            clearInterval(this.time2);
            clearInterval(this.time1);
          }
        });
    }
  }
};
</script>

<style lang="scss">
.course-ware-answer {
  background: #1c272e;
  height: 100%;
  .option-show {
    .el-dialog {
      height: 400px !important;
      margin-bottom: 0 !important;
      border-radius: 0 !important;
      .el-dialog__header {
        display: block !important;
        height: 60px !important;
      }
      .el-dialog__body {
        height: 300px !important;
        overflow-y: auto !important;
      }
    }
    .option-show-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .option-show-content-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
  .el-drawer__header {
    margin-bottom: 8px;
  }
  .answerList {
    position: absolute;
    top: 0;
    left: 0;
    // width: 100%;
    // height: 100%;
    // background: rgba(240, 241, 245, 1);

    .answerListHeader {
      // background: #1c272e;
      background: transparent;
      height: 60px;
      line-height: 60px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      .backBtn {
        width: 100px;
        height: 34px;
        border-radius: 50px;
        border: 1px solid white;
        line-height: 34px;
        text-align: center;
        cursor: pointer;
        margin-left: 9px;
        font-size: 13px;
        i {
          margin-right: 5px;
        }
      }
    }
    // .answerContent {
    //   padding-top: 120px;
    //   // height: 100%;
    //   .setTime {
    //     font-size: 24px;
    //     color: #1c272e;
    //     text-align: center;
    //     margin: 61px auto;
    //   }
    //   .sendText {
    //     color: #1c272e;
    //     font-weight: bold;
    //     font-size: 34px;
    //     text-align: center;
    //     width: 100%;
    //   }
    //   .signRecord {
    //     text-align: center;
    //   }
    //   .startButton {
    //     width: 189px;
    //     height: 189px;
    //     font-size: 40px;
    //   }
    // }
    // .answerListBody {
    //   // display: none;
    //   padding: 44px 200px;
    //   // height: 100%;
    //   height: -webkit-calc(100% - 60px);
    //   height: -moz-calc(100% - 60px);
    //   height: calc(100% - 60px);
    //   overflow-y: auto;
    //   .el-col {
    //     margin-bottom: 15px;
    //     box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.1);
    //     padding: 21px;
    //     background: #fff;
    //     border-radius: 5px;
    //     .left {
    //       float: left;
    //       cursor: pointer;
    //       img {
    //         width: 100px;
    //         height: 60px;
    //       }
    //     }
    //     .middle {
    //       float: left;
    //       margin: 0;
    //       padding: 0;
    //       margin-left: 30px;
    //       text-align: left;
    //       max-width: 58%;
    //     }
    //     .right {
    //       float: right;
    //     }
    //   }
    // }
  }
  .change-answer-arrow {
    position: absolute;
    top: 50%;
    right: 0;
  }
  .el-container {
    height: 100%;
    .el-header {
      background: #0e1317;
      line-height: 60px;
      color: white;
      display: flex;
      align-items: center;
      .backBtn {
        width: 100px;
        height: 34px;
        border-radius: 50px;
        border: 1px solid white;
        line-height: 34px;
        text-align: center;
        cursor: pointer;
        margin-left: 9px;
        font-size: 13px;
        i {
          margin-right: 5px;
        }
      }
    }
    .el-aside {
      background: #203f53;
      height: 100%;
      padding: 44px 0px 44px 0px;
      color: white;
      font-size: 18px;
      font-weight: 400;
      display: flex;
      flex-direction: column;
      .side-top {
        height: 10%;
      }
      .side-middle {
        height: 70%;
        overflow-y: auto;
        ul {
          list-style: none;
          overflow: hidden;
          padding-left: 0;
          margin: 0;
          margin-top: 14px;
          padding-left: 40px;

          li {
            float: left;
            width: 50px;
            height: 50px;
            line-height: 50px;
            border: 1px solid #e4e4e4;
            background-color: #fff;
            text-align: center;
            margin-right: 15px;
            margin-bottom: 15px;
            border-radius: 5px;
            color: #000;
            cursor: pointer;
          }
        }
      }
      .side-middle-answering {
        height: 90%;
        overflow-y: auto;
        ul {
          list-style: none;
          overflow: hidden;
          padding-left: 0;
          margin: 0;
          margin-top: 14px;
          padding-left: 40px;

          li {
            float: left;
            width: 50px;
            height: 50px;
            line-height: 50px;
            border: 1px solid #e4e4e4;
            background-color: #fff;
            text-align: center;
            margin-right: 15px;
            margin-bottom: 15px;
            border-radius: 5px;
            color: #000;
            cursor: pointer;
          }
        }
      }
      .side-bottom {
        height: 20%;
        margin: 0 auto;
        padding-top: 50px;
      }
      .answerStatus1 {
        .setAnswerTime {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.4);
          height: 50px;
          line-height: 50px;
          border-radius: 4px;
          margin: 0 auto;
          font-size: 18px;
          color: rgba(255, 255, 255, 1);
          overflow: hidden;
          .answerTxt {
            float: left;
            margin-left: 30px;
            margin-right: 47px;
          }
          .el-select {
            float: left;
            width: 100px;
            height: 28px;
            input {
              background: transparent;
              border: none;
              font-size: 16px;
              color: rgba(255, 255, 255, 1);
            }
            .el-input__suffix {
              top: -3px;
              right: 8px;
              .el-select__caret {
                font-size: 18px;
                color: #fff;
              }
            }
          }
        }
        .el-button {
          width: 100%;
          height: 50px;
          font-size: 18px;
          border-radius: 5px;
          margin-top: 60px;
        }
      }
      .answerStatus2 {
        .answerCountdown {
          overflow: hidden;
          margin-top: 50px;
          div {
            width: 50px;
            height: 65px;
            line-height: 65px;
            font-size: 40px;
            color: #000;
            text-align: center;
            background: #ffffff;
            border-radius: 6px;
            float: left;
            margin-right: 9px;
          }
          span {
            float: left;
            height: 60px;
            line-height: 60px;
            width: 28px;
            text-align: center;
            color: rgba(255, 255, 255, 0.5);
            font-size: 40px;
          }
        }
        .answerSubmiteNum {
          color: #d8d8d8;
          div:first-child {
            font-size: 18px;
            margin-top: 30px;
            margin-bottom: 10px;
          }
          div:last-child {
            font-size: 40px;
          }
        }
        .answerBtn {
          margin-top: 50px;
          .cancelBtn {
            background: transparent;
            border: 1px solid rgba(151, 151, 151, 1);
            color: #fff;
          }
        }
      }
      .answerStatus3 {
        .answerSubmiteNum {
          color: #d8d8d8;
          div:first-child {
            font-size: 18px;
            margin-top: 30px;
            margin-bottom: 10px;
          }
          div:last-child {
            font-size: 40px;
          }
        }
        ul {
          padding: 0;
          width: 100%;
          background: rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-top: 24px;
          li {
            overflow: hidden;
            margin-bottom: 18px;
            height: 20px;
          }
          li:last-child {
            margin-bottom: 0;
          }
          li span {
            display: inline-block;
          }
          li span:first-child {
            font-size: 19px;
          }
          li span:nth-child(2) {
            height: 14px;
            width: 65%;
            margin-right: 10px;
            margin-left: 10px;
          }
          li span:last-child {
            font-size: 14px;
            vertical-align: top;
          }
        }
      }
    }
    .answered-data {
      width: 141px;
      height: 33px;
      color: white;
      margin-bottom: 10px;
      padding: 0;
      background-image: url("../../assets/images/img_1.png");
      background-position: center;
    }
    .el-main {
      background: #f9f9f9;
      height: 100%;
      margin: 0;
      overflow-y: auto;
      font-weight: 400;
      padding-bottom: 40px;
      font-size: 18px;
      background: #f9f9f9;
      .head {
        background: #ffffff;
        margin-bottom: 10px;
        padding: 25px 20px;
        .type {
          display: inline-block;
          background: #10c4ee;
          color: #ffffff;
          border-radius: 5px;
          padding: 5px 10px;
          margin-bottom: 15px;
        }
        .tihao {
          color: #10c4ee;
          margin-left: 10px;
        }
        .score {
          margin-left: 30px;
        }
        .title {
          text-align: justify;
          word-break: break-all;
        }
      }
      .head-ti-content {
        background: #ffffff;
        margin-bottom: 10px;
        padding: 25px 20px;
        // width: 700px;
        .type {
          display: inline-block;
          background: #10c4ee;
          color: #ffffff;
          border-radius: 5px;
          padding: 5px 10px;
          margin-bottom: 15px;
        }
        .tihao {
          color: #10c4ee;
          margin-left: 10px;
        }
        .score {
          margin-left: 30px;
        }
        .title {
          text-align: justify;
          word-break: break-all;
        }
      }
      .head-answering {
        background: #ffffff;
        height: 200px;
        margin-bottom: 10px;
        padding: 25px 20px;
        display: flex;
        .head-answering-l {
          width: 50%;
          font-size: 20px;
          .word {
            height: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 40px;
          }
          .num {
            display: flex;
            justify-content: center;
          }
        }
        .head-answering-r {
          width: 50%;
          .time {
            height: 50%;
          }
          .btns {
            display: flex;
            justify-content: center;
          }
        }
      }

      .head-answering-table {
        background: #ffffff;
        height: 600px;
        margin-bottom: 10px;
        padding: 25px 20px;
      }
      .options {
        background: #ffffff;
        margin-bottom: 10px;
        padding: 10px 20px;
        .option {
          overflow: hidden;
          margin: 15px 0;
          display: flex;
          .aOption {
            margin-right: 15px;
          }
        }
      }
      .answer-chart {
        margin-top: 15px;
        background: #ffffff;
        padding: 25px 20px 25px 12px;
      }
      .bm {
        overflow: hidden;
        background: #ffffff;
        padding: 25px 20px 25px 12px;
        .tp {
          margin-bottom: 15px;
          line-height: 25px;
        }
      }
      .el-button {
        width: 141px;
        height: 33px;
        color: white;
        margin-bottom: 10px;
        padding: 0;
        background-image: url("../../assets/images/img_1.png");
        background-position: center;
      }
    }
  }
}
</style>
