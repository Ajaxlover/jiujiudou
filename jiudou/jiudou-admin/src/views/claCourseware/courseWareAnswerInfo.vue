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
            课件应答
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
            <!-- <div>
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
            </div> -->
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
      <el-container style="padding:0 0 0 150px;height:100%">
        <el-aside width="326px">
          <div
            class="side-top"
            style="font-size:34px;font-weight:bold;margin-bottom:26px;text-align:center"
          >
            应答进行时
          </div>
          <div class="side-middle">
            2222
          </div>
          <div class="side-bottom">
            333
          </div>
        </el-aside>
        <el-main>
          <div class="head">
            <span class="type">单选题</span>
            <!-- <div><jmath class="title" :data="subjects.title"></jmath></div> -->
            <div>题干</div>
          </div>
          <div class="options">
            <div class="option" v-for="(option, index) in 4" :key="index">
              <div class="aOption">A</div>
              <jmath class="aText" :data="option.text"></jmath>
            </div>
          </div>
          <el-button type="text" @click="showAnswer"
            >答案和解析&nbsp;<img
              src="@/assets/images/arrow_double_down.png"
              style="width:14px;"
          /></el-button>
          <el-collapse-transition>
            <div class="bm" v-show="showAnalyse">
              <!-- <div class="tp">【答案】{{ currentAnswer.answerRight }}</div>
              <div class="tp">
                【解析】<jmath :data="subjects.analyse"></jmath>
              </div> -->
            </div>
          </el-collapse-transition>
        </el-main>
        <el-main>
          <div class="head">
            <span class="type">单选题</span>
            <!-- <div><jmath class="title" :data="subjects.title"></jmath></div> -->
            <div>题干</div>
          </div>
          <div class="options">
            <div class="option" v-for="(option, index) in 4" :key="index">
              <div class="aOption">A</div>
              <jmath class="aText" :data="option.text"></jmath>
            </div>
          </div>
          <el-button type="text" @click="showAnswer"
            >答案和解析&nbsp;<img
              src="@/assets/images/arrow_double_down.png"
              style="width:14px;"
          /></el-button>
          <el-collapse-transition>
            <div class="bm" v-show="showAnalyse">
              <!-- <div class="tp">【答案】{{ currentAnswer.answerRight }}</div>
              <div class="tp">
                【解析】<jmath :data="subjects.analyse"></jmath>
              </div> -->
            </div>
          </el-collapse-transition>
        </el-main>
      </el-container>
    </el-container>
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
    data: Array
  },
  components: {
    jmath,
    addAnswerTest
  },
  data() {
    return {
      tiIdx: 0,
      selectAnswerTime: "300", // 选择发布应答的时长
      idx: 0, // 课件应答下标
      isShowResult: false, // 显示应答进行时
      isConctrol: false,
      isShowStartAnswer: true,
      selectTime: "300", // 应答时长
      drawer: false,
      isloading: false,
      classId: this.$route.query.classId,
      datePickShow: false,
      loading: false,
      deadline: "",
      subjects: {},
      releaseLoading: false,
      isShowList: true,
      answerListData: [],
      currentAnswer: {},
      answerTime: "180",
      rightAnswer: [],
      showAnalyse: false,
      answerInfo: {
        answered: 0,
        totalAnswer: 0,
        report: []
      },
      answerInfoIng: {
        answered: 0,
        totalAnswer: 0,
        countDown: 0
      },
      min: 0,
      sec10: 0,
      sec100: "0",
      _interval: ""
    };
  },
  mounted() {
    // this.loadList();
  },
  beforeDestroy() {
    clearInterval(this._interval);
  },
  computed: {
    comRightAnswer() {
      return this.rightAnswer[0].option;
    }
  },
  methods: {
    // 切换应答
    nextCourseAnswer() {
      this.idx++;
      this.tiIdx = 0;
      if (this.idx == this.data.length) {
        this.idx = 0;
      }
    },
    changeTi(index) {
      this.tiIdx = index;
    },
    doPublishAnswer() {
      this.isShowResult = true;
    },
    openList() {
      this.isShowList = true;
      this.isConctrol = true;
      this.isShowStartAnswer = false;
    },
    prevList() {
      this.isConctrol = false;
      this.isShowStartAnswer = true;
    },
    answerSuccess() {
      this.drawer = false;
      this.isShowStartAnswer = false;
      this.isShowList = false;
      this.loadList();
    },
    openDrawer() {
      this.drawer = true;
    },
    // 关掉选题抽屉
    handleCloseDrawer() {
      this.drawer = false;
    },
    toCloseDrawer() {
      this.handleCloseDrawer(); // 关闭抽屉
      // this.loadData(); // 重新加载题目列表
    },
    getAnswerData() {
      axios
        .request({
          method: "post",
          url: "/clazz/answer/answerInfoTea",
          data: {
            answerNo: this.currentAnswer.answerNo,
            classId: this.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.answerInfo.report = ret.data.report;
          }
        });
    },

    // 获取应答详情
    loadAnswerDetail() {
      axios
        .request({
          method: "post",
          url: "/clazz/Api/Answer/answerInfoTea",
          data: {
            answerNo: this.currentAnswer.answerNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.answerInfo.answered = ret.data.answered;
            this.answerInfo.totalAnswer = ret.data.totalAnswer;
            // this.answerInfo.report = ret.data.report;
            this.getAnswerData();
            this.answerInfoIng.answered = ret.data.answered;
            this.answerInfoIng.totalAnswer = ret.data.totalAnswer;
            this.answerInfoIng.countDown = ret.data.countDown;
            this.$nextTick(() => {
              this.countdown(this.answerInfoIng.countDown);
            });
          }
        });
    },
    // 倒计时事件
    countdown(countDown) {
      const that = this;
      that._interval = setInterval(() => {
        if (countDown == 0) {
          // 计时结束，清除缓存
          clearInterval(that._interval);
        } else {
          countDown--;
          this.min = parseInt((countDown / 60) % 60);
          let sec = parseInt(countDown % 60);
          let str = String(sec);
          if (sec < 10) {
            str = "0" + str;
          }
          this.sec10 = str.charAt(0);
          this.sec100 = str.charAt(1) ? str.charAt(1) : 0;
          // if (Number(str.charAt(0)) % 10 < 1) {
          //   this.sec10 = 0;
          //   this.sec100 = Number(this.sec10);
          // }
        }
      }, 1000);
    },
    // 获取应答列表
    loadList() {
      this.loading = true;
      this.isloading = true;
      axios
        .request({
          method: "post",
          url: "/clazz/Api/Answer/answerListTea",
          data: {
            classId: this.classId,
            page: 1,
            pagesize: 10
          }
        })
        .then(res => {
          this.loading = false;
          this.isloading = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.answerListData = ret.data;
            this.currentAnswer = ret.data[0];
            this.loadAnswerDetail();
            axios
              .request({
                method: "post",
                url: "/subject/subjectBank/info2",
                data: {
                  answerNo: this.currentAnswer.answerNo,
                  classId: this.$route.query.classId,
                  answerFrom: this.currentAnswer.answerFrom,
                  bankId: this.currentAnswer.answerBankId
                }
              })
              .then(res => {
                let ret = res.data;
                if (ret.code == 200) {
                  this.subjects = ret.data;
                  this.rightAnswer = this.subjects.answers.filter(
                    el => el.isCorrect === 2
                  );
                }
              });
            this.answerListData.forEach(ele => {
              let str = ele.answerTitle.split("<br/>")[0];
              this.$set(ele, "splitTitle", str);
            });
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
    //返回ppt
    back() {
      this.$emit("close");
    },
    release() {
      if (!this.deadline) {
        this.$message({
          type: "warning",
          message: "请选择结束时间"
        });
        return;
      }
      let now = new Date();
      if (now.getTime() >= this.deadline.getTime()) {
        this.$message({
          type: "warning",
          message: "结束时间小于当前时间"
        });
        return;
      }
      this.releaseLoading = true;
      axios
        .request({
          method: "post",
          url: "/clazz/v4/courseware/publishExercises",
          data: {
            coursewareId: this.data.coursewareId,
            classId: this.$route.query.classId,
            endTime: this.deadline.getTime()
          }
        })
        .then(res => {
          this.releaseLoading = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.data.exerciseId = 100;
          }
        });
    },
    //详情返回列表
    backList() {
      this.$emit("close");
    },
    toAnswerDetail(item) {
      this.currentAnswer = item;
      this.loadAnswerDetail();
      this.isShowList = false;
      axios
        .request({
          method: "post",
          url: "/subject/subjectBank/info2",
          data: {
            answerNo: item.answerNo,
            classId: this.$route.query.classId,
            answerFrom: item.answerFrom,
            bankId: item.answerBankId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.subjects = ret.data;
            this.rightAnswer = this.subjects.answers.filter(
              el => el.isCorrect === 2
            );
          }
        });
    },
    //发起应答
    creatAnswer() {
      axios
        .request({
          method: "post",
          url: "/clazz/Api/Answer/createAnswer",
          data: {
            classId: this.$route.query.classId,
            answerFrom: this.currentAnswer.answerFrom,
            answerBankId: this.currentAnswer.answerBankId,
            answerTitle: this.currentAnswer.answerTitle,
            picFile: {},
            answerRight: this.currentAnswer.answerRight,
            answerType: this.currentAnswer.answerType,
            answerDuration: this.currentAnswer.answerDuration,
            x: this.currentAnswer.x,
            y: this.currentAnswer.y
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            console.log("发起应答成功");
            this.isShowList = true;
            this.loadList();
          }
        });
    },
    // 结束应答
    endAnswer() {
      axios
        .request({
          method: "post",
          url: "/clazz/Api/Answer/finishAnswer",
          data: {
            classId: this.$route.query.classId,
            answerNo: this.currentAnswer.answerNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            clearInterval(this._interval);
            // this.isShowList = true;
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.loadList();
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
            classId: this.$route.query.classId,
            answerNo: this.currentAnswer.answerNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            clearInterval(this._interval);
            // this.isShowList = true;
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.loadList();
            this.$emit("close");
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
      background: #1c272e;
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
