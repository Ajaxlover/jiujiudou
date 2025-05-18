<template>
  <el-container class="dt-do-test">
    <el-header>{{ title }}</el-header>
    <el-main>
      <div class="dt-test-subjects">
        <div
          class="subject-item"
          v-for="(item, index) in question"
          :key="index"
          v-show="index === idx"
        >
          <div class="subject-type">
            <span>第{{ index + 1 }}题</span>
            <span>丨</span>
            <span
              class="subject-type-item"
              v-if="item.subjectBankInfo.tSubject == 3"
              >多选题</span
            >
            <span
              class="subject-type-item"
              v-if="item.subjectBankInfo.tSubject == 2"
              >单选题</span
            >
            <span
              class="subject-type-item"
              v-if="item.subjectBankInfo.tSubject == 1"
              >判断题</span
            >
            <span
              class="subject-type-item"
              v-if="item.subjectBankInfo.tSubject == 5"
              >问答题</span
            >
            <span
              class="subject-type-item"
              v-if="item.subjectBankInfo.tSubject == 4"
              >填空题</span
            >
            <span
              class="subject-type-item"
              v-if="item.subjectBankInfo.tSubject == 11"
              >组合题</span
            >
          </div>
          <div class="subject-title">
            <JaxMath :data="item.subjectBankInfo.title"></JaxMath>
          </div>
          <div
            v-if="
              item.subjectBankInfo.tSubject === 5 ||
                item.subjectBankInfo.tSubject === 4
            "
            class="subject-options"
          >
            <div class="zg"></div>
            <!-- <div class="upload-icon-pic" @click="handleUpload(item)"></div>
          <div v-if="item.stuAnswer" class="upload-icon-img">
            <img :src="item.stuAnswer" alt="" />
          </div> -->
          </div>
          <div
            v-if="item.subjectBankInfo.tSubject === 11"
            class="subject-options"
          >
            <div class="zh">
              <div v-for="(a, b) in item.subjectBankInfo.sonSubList" :key="b">
                <div class="son-subject-title">
                  {{ b + 1 }}、<span v-if="a.tSubject == 3">(多选题)</span
                  ><span v-if="a.tSubject == 2">(单选题)</span
                  ><span v-if="a.tSubject == 1">(判断题)</span
                  ><span v-if="a.tSubject == 5">(问答题)</span
                  ><span v-if="a.tSubject == 4">(填空题)</span>
                  <JaxMath :data="a.title"></JaxMath>
                </div>
                <div class="son-subject-options">
                  <div
                    v-for="(e, f) in a.answerList"
                    :key="f"
                    class="option-item"
                    @click="handleSonClick(e, f, b)"
                  >
                    <span :class="e.checked ? 'hasCheck' : 'unCheck'"></span>
                    {{ e.aOption }}.<JaxMath :data="e.aText"></JaxMath>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- :class="i.checked ? 'bgc' : ''" -->
          <div class="subject-options">
            <div
              v-for="(i, j) in item.subjectBankInfo.answerList"
              :key="j"
              class="option-item"
              @click="handleClick(i, j)"
            >
              <span :class="i.checked ? 'hasCheck' : 'unCheck'"></span>
              {{ i.aOption }}.<JaxMath :data="i.aText"></JaxMath>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <el-footer>
      <div>
        <el-button type="text" @click="toShowDrawer">
          <template>
            <div style="display:flex;">
              <i class="iconfont icon-datiqia" style="font-size:18px;"></i>
              <span style="color:#666;font-size:16px;margin-left:4px"
                >答题卡</span
              >
            </div>
          </template>
        </el-button>
      </div>
      <div>
        <el-button type="primary" :disabled="idx === 0" @click="pre"
          >上一题</el-button
        >
        <el-button
          type="primary"
          :disabled="idx === question.length - 1"
          @click="next"
          style="margin-left:15px;"
          >下一题</el-button
        >
      </div>
      <div>
        <el-button type="primary">提交</el-button>
      </div>
    </el-footer>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      size="45%"
    >
      <span style="text-align: center;" slot="title">答题卡</span>
      <div style="padding:0 30px;">
        <div class="dt-drawer-content">
          <div v-for="(item, idx) in 100" :key="idx" class="list-item">
            <div class="item" @click="changeIdx(idx)">{{ idx + 1 }}</div>
          </div>
        </div>
      </div>
    </el-drawer>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import JaxMath from "@/components/jmath";

// import common from "@/utils/common";
export default {
  components: {
    JaxMath
  },
  data() {
    return {
      drawer: false,
      direction: "btt",
      // dtBookId: this.$route.query.dtBookId,
      dtBookId: 36,
      // chapterNodeId: this.$route.query.chapterNodeId,
      chapterNodeId: 27,
      // pointId: this.$route.query.pointId,
      pointId: "111",
      // versionCode: this.$route.query.versionCode
      versionCode: "1",
      question: [],
      title: "",
      idx: 0
    };
  },
  methods: {
    changeIdx(i) {
      this.idx = i;
      this.drawer = false;
    },
    handleSonClick(info, idx, b) {
      console.log(info, idx, b);
      const question = this.question[this.idx].subjectBankInfo.sonSubList[b]; // 每题选项
      const option = this.question[this.idx].subjectBankInfo.sonSubList[b]
        .answerList; // 每一题题目的选项
      console.log(option);
      // 选中添加样式
      option.forEach((item, ix) => {
        if (ix === idx) {
          // 如果选中的与数据里面的相等就改变他的样式
          item.checked = !item.checked; // 是否选中，取反
        } else if (question.tSubject !== 3) {
          // 如果不是多选 只能选中一个 其他的都为false
          item.checked = false;
        }
      });

      let isAnswer = ""; // 选中的答案
      if (info.checked) {
        isAnswer = info.aOption; // 选中的答案
      }

      // 如果是多选
      if (question.tSubject === 3) {
        this.ismultipleAnswer = [];
        option.forEach(item => {
          if (item.checked) {
            // 将选中的push到 ismultipleAnswer 数组中
            this.ismultipleAnswer.push(item.aOption);
          }
        });
        isAnswer = this.ismultipleAnswer.join(",");
      }

      console.log("选中的答案", isAnswer);
      // console.log('题目的答案', answer)
      // this.question[this.idx].subjectBankInfo.sonSubList[
      //   b
      // ].stuAnswer = isAnswer;
    },
    handleClick(info, idx) {
      const question = this.question[this.idx].subjectBankInfo; // 每题选项
      const option = this.question[this.idx].subjectBankInfo.answerList; // 每一题题目的选项

      // 选中添加样式
      option.forEach((item, ix) => {
        if (ix === idx) {
          // 如果选中的与数据里面的相等就改变他的样式
          item.checked = !item.checked; // 是否选中，取反
        } else if (question.tSubject !== 3) {
          // 如果不是多选 只能选中一个 其他的都为false
          item.checked = false;
        }
      });

      let isAnswer = ""; // 选中的答案
      if (info.checked) {
        isAnswer = info.aOption; // 选中的答案
      }

      // 如果是多选
      if (question.tSubject === 3) {
        this.ismultipleAnswer = [];
        option.forEach(item => {
          if (item.checked) {
            // 将选中的push到 ismultipleAnswer 数组中
            this.ismultipleAnswer.push(item.aOption);
          }
        });
        isAnswer = this.ismultipleAnswer.join(",");
      }

      // console.log("选中的答案", isAnswer);
      // console.log('题目的答案', answer)
      this.question[this.idx].subjectBankInfo.stuAnswer = isAnswer; // 记录学生答案
      // 缓存作答记录
      // Storage.setExamRecord(`contest-${this.examId}`, this.question)
    },
    pre() {
      if (this.idx == 0) {
        return;
      }
      this.idx--;
    },
    next() {
      if (this.idx === this.question.length - 1) {
        return;
      }
      this.idx++;
    },
    toShowDrawer() {
      this.drawer = true;
    },
    handleClose(done) {
      done();
    },
    // 加载题目列表
    loadSubjects() {
      let data = {};
      data.dtbookId = this.dtBookId;
      data.chapterId = this.chapterNodeId;
      data.pointId = this.pointId;
      data.versionCode = this.versionCode;
      axios
        .request({
          method: "post",
          url: "/ebook/dTbookSubjectBank/queryBankList",
          data
        })
        .then(data => {
          let ret = data.data;
          if (ret.code == 200) {
            this.question = ret.data.bankList;
            this.title = ret.data.title;
          } else {
          }
        });
    }
  },
  mounted() {
    this.loadSubjects();
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-drawer {
  overflow-y: auto;
  .dt-drawer-content {
    // padding: 0 20px 20px 20px;
    // background-color: red;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .list-item {
      width: 10%;
      height: 100px;
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      .item {
        width: 70px;
        height: 70px;
        border: 1px solid #aaa;
        color: #333;
        border-radius: 50%;
        text-align: center;
        line-height: 70px;
      }

      .answered-bgc {
        color: #00a400;
        border: 1px solid #00a400;
        background: rgba(0, 164, 0, 0.17);
      }
    }
  }
}
.dt-do-test {
  .el-header {
    background: #fff;
    line-height: 60px;
    padding: 0 43px;
    text-align: center;
  }
  .el-footer {
    background: #fff;
    line-height: 60px;
    padding: 0 43px;
    display: flex;
    justify-content: space-between;
    .el-button {
      border-radius: 10px;
    }
  }
  // .demo-drawer {
  //   /deep/ .el-drawer__body {
  //     padding: 0 20px 20px 20px;

  //   }
  // }

  .el-main {
    margin: 22px 20px;
    background: #ffffff;
    border-radius: 4px;
    height: 600px;
    overflow-y: auto;
    padding: 12px 18px 70px;
    .dt-test-subjects {
      .subject-type {
        margin-bottom: 15px;
        .subject-type-item {
          border: 1px solid #2ba1f4;
          color: #2ba1f4;
          font-weight: normal;
          padding: 2px 5px;
          font-size: 14px;
          border-radius: 10px;
        }
      }
      .subject-title {
        margin-bottom: 15px;
      }
      .subject-options {
        .option-item {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          min-height: 60px;
          .unCheck {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid #ccc;
            margin-right: 5px;
          }
          .hasCheck {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid #00a400;
            margin-right: 5px;
            background-color: #00a400;
          }
        }
        .zg {
        }
        .zh {
          // 组合题
          height: 400px;
          // border: 1px solid #000;
          overflow-y: auto;
          overflow-x: auto;
          padding-left: 20px;
          .son-subject-title {
            margin-bottom: 15px;
          }

          .son-subject-options {
            .option-item {
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              min-height: 60px;
              .unCheck {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 1px solid #ccc;
                margin-right: 5px;
              }
              .hasCheck {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 1px solid #00a400;
                margin-right: 5px;
                background-color: #00a400;
              }
            }
          }
        }
      }
    }
  }
}
</style>
