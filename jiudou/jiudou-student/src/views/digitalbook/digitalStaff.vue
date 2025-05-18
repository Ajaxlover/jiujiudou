<template>
  <div>
    <div class="digital-staff" v-loading="loading">
      <el-container>
        <el-container style="padding: 0 200px; height: 100%">
          <el-aside width="326px">
            <div
              class="side-top"
              style="font-size: 34px; font-weight: bold; text-align: center"
            >
              习题
            </div>
            <div class="side-middle">
              <ul>
                <li
                  :class="[index == tiIdx ? 'current-check' : '']"
                  @click="changeTi(index)"
                  v-for="(i, index) in bankList"
                  :key="i.id"
                >
                  {{ index + 1 }}
                </li>
              </ul>
            </div>
            <!-- <div class="side-bottom"></div> -->
          </el-aside>
          <el-main
            v-for="(t, tIdx) in bankList"
            :key="t.id"
            v-show="tiIdx == tIdx"
          >
            <div class="head">
              <span class="type">{{
                formatType(t.subjectBankInfo.tSubject)
              }}</span
              >({{ tIdx + 1 }}/{{ bankList.length }})
              <div>
                <jmath class="title" :data="t.subjectBankInfo.title"></jmath>
              </div>
            </div>
            <div v-if="t.subjectBankInfo.answerList.length > 0" class="options">
              <div
                class="option"
                v-for="(option, j) in t.subjectBankInfo.answerList"
                :key="j"
              >
                <div class="aOption">{{ option.aOption }}</div>
                <jmath class="aText" :data="option.aText"></jmath>
              </div>
            </div>
            <div
              v-if="
                t.subjectBankInfo.sonSubList &&
                t.subjectBankInfo.sonSubList.length > 0
              "
              class="options"
            >
              <div
                v-for="(a, aIndex) in t.subjectBankInfo.sonSubList"
                :key="a.id"
              >
                <div class="sub-head">
                  <span class="type">{{ formatType(a.tSubject) }}</span
                  >({{ aIndex + 1 }}/{{ t.subjectBankInfo.sonSubList.length }})
                  <div>
                    <jmath class="title" :data="a.title"></jmath>
                  </div>
                </div>
                <div v-if="a.answerList.length > 0" class="options">
                  <div
                    class="option"
                    v-for="(option, j) in a.answerList"
                    :key="j"
                  >
                    <div class="aOption">{{ option.aOption }}</div>
                    <jmath class="aText" :data="option.aText"></jmath>
                  </div>
                </div>
                <div>
                  <el-button type="text" @click="showAnswerSub(t, a)"
                    >答案和解析&nbsp;<img
                      src="@/assets/image/arrow_double_down.png"
                      style="width: 14px"
                  /></el-button>
                  <el-collapse-transition>
                    <div class="bm" v-show="a.showAnalyse">
                      <div class="tp">
                        【答案】
                        <jmath :data="getAnswer(a)"> </jmath>
                      </div>
                      <div class="tp">
                        【解析】
                        <jmath v-if="a.analyse" :data="a.analyse"></jmath>
                        <span v-else>无</span>
                      </div>
                    </div>
                  </el-collapse-transition>
                </div>
              </div>
            </div>
            <div v-if="t.subjectBankInfo.sonSubList.length == 0">
              <el-button type="text" @click="showAnswer(t)"
                >答案和解析&nbsp;<img
                  src="@/assets/image/arrow_double_down.png"
                  style="width: 14px"
              /></el-button>
              <el-collapse-transition>
                <div class="bm" v-show="t.subjectBankInfo.showAnalyse">
                  <div class="tp">
                    【答案】
                    <jmath :data="getAnswer(t.subjectBankInfo)"> </jmath>
                  </div>
                  <div class="tp">
                    【解析】
                    <jmath
                      v-if="t.subjectBankInfo.analyse"
                      :data="t.subjectBankInfo.analyse"
                    ></jmath>
                    <span v-else>无</span>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<script>
/* eslint-disable prettier/prettier */

// @ is an alias to /src
import axios from "@/libs/api.request"
import common from "@/libs/common"

// import store from "@/store";
import jmath from "@/components/jmath"

// eslint-disable-next-line no-unused-vars

export default {
  name: "digital-staff",
  components: {
    jmath,
  },
  data() {
    return {
      loading: false,
      tiIdx: 0,
      idx: 0,
      uuid: this.$route.query.uuid,
      showAnalyse: false,
      bankList: [],
    }
  },
  methods: {
    getAnswer(subjectBankInfo) {
      let answer = "无"
      if (subjectBankInfo.answer) {
        answer = String(subjectBankInfo.answer).split("^*").join("或")
      } else {
        let list = []
        if (subjectBankInfo.answerList) {
          subjectBankInfo.answerList.forEach((element) => {
            if (element.isCorrect == 2) {
              list.push(element.aOption)
            }
          })
          if (list.length) {
            answer = list.join(",")
          }
        }
      }
      return answer
    },
    // 格式化题目类型
    formatType(type) {
      return common.typeFormat(type)
    },
    // 显示/隐藏答案
    showAnswer(subjectBankInfo) {
      this.bankList.forEach((item) => {
        if (subjectBankInfo.bankId == item.bankId) {
          item.subjectBankInfo.showAnalyse = !item.subjectBankInfo.showAnalyse
        }
      })
    },
    // 显示/隐藏答案(小题)
    showAnswerSub(t, a) {
      this.bankList.forEach((item) => {
        if (t.bankId == item.bankId) {
          item.subjectBankInfo.sonSubList.forEach((i) => {
            if (a.id == i.id) {
              i.showAnalyse = !i.showAnalyse
            }
          })
        }
      })
    },
    changeTi(index) {
      this.tiIdx = index
    },
    loadData() {
      this.loading = true
      axios
        .request({
          method: "post",
          url: `/ebook/dTbookSubjectBank/detail`,
          data: {
            uuid: this.uuid,
            pageNo: 1,
            pageSize: 999,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            let bankListTemp = []
            ret.data.records.forEach((item) => {
              item.subjectBankInfo.showAnalyse = false
              item.subjectBankInfo.sonSubList.forEach((k) => {
                k.showAnalyse = false
              })
              bankListTemp.push(item)
            })
            this.bankList = bankListTemp
            setTimeout(() => {
              this.loading = false
            }, 800)
          } else {
            this.$message({
              type: "warning",
              message: `${ret.msg}`,
            })
          }
        })
    },
  },
  created() {},
  mounted() {
    this.loadData()
    console.log(process.env.NODE_ENV)
  },
}
</script>
<style lang="less" scoped>
.digital-staff {
  background-color: #1c272e;
  height: 100vh;
  .el-container {
    height: 100%;
    .el-aside {
      background: #203f53;
      height: 100%;
      padding: 30px 0px 20px 0px;
      color: white;
      font-size: 18px;
      font-weight: 400;
      display: flex;
      flex-direction: column;
      .side-top {
        height: 6%;
      }
      .side-middle {
        height: 92%;
        overflow-y: auto;
        .current-check {
          background-color: rgb(57, 188, 249);
          color: #fff;
        }
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
      .sub-head {
        background: #ffffff;
        margin-bottom: 10px;
        padding: 10px 20px;
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
        background-image: url("../../assets/image/img_1.png");
        background-position: center;
      }
    }
  }
}
</style>
