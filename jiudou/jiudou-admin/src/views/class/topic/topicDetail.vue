<template>
  <el-container
    v-loading.fullscreen.lock="fullscreenLoading"
    class="editCourseTask"
  >
    <el-header>
      <span class="returnBtn" @click="goBack"
        ><i class="el-icon-back" style="margin-right:5px"></i>返回</span
      >
      <div class="editTitle">查看题目</div>
    </el-header>
    <el-main>
      <div class="contentBox">
        <div class="leftList">
          <div class="countTitle">
            题目统计<span>{{ timuNum }}题</span>
          </div>
          <div class="showResovle" style="padding-left:30px;margin-bottom:5px">
            <el-checkbox v-model="isShowResovle" @change="showResovle"
              >显示答案和解析</el-checkbox
            >
          </div>
          <div class="timuNumList" v-if="timuListData.length > 0">
            <div v-for="(item, index) in timuListData" :key="index">
              <span style="font-size:14px"
                >{{ convert(index + 1) }}、{{ formatType1(item.type) }}（{{
                  item.score
                }}
                分）</span
              >
              <ul>
                <li
                  class="leftTihao"
                  v-for="i in item.children"
                  @click="toTimuPosition(i.id)"
                  :key="i.index"
                >
                  {{ i.timuNum + 1 }}
                </li>
              </ul>
            </div>
          </div>
          <!-- <div class="paperBtn">
            <el-button type="danger">批阅</el-button>
          </div> -->
        </div>
        <div class="rightList">
          <ul class="timuList">
            <li v-for="(item, index) in timuListData" :key="index">
              <span class="timuType"
                >{{ convert(index + 1) }}、{{ formatType1(item.type) }} （共{{
                  item.children.length
                }}
                小题，共{{ item.score }} 分）</span
              >

              <ul v-if="item.children.length > 0">
                <li
                  v-for="(i, index) in item.children"
                  :id="i.id"
                  :key="i.index"
                  @mouseenter="handleTimuMouseenter($event)"
                  @mouseleave="handleTimuMouseleave($event)"
                >
                  <timu :tNum="index" :data="i" :type="showResovleType"></timu>
                  <bintu :data="i.optionNumber" :footTabs="i.footTabs"></bintu>
                  <div class="timuBtn">
                    <el-button
                      v-if="item.type == 2 || item.type == 1 || item.type == 3"
                      size="mini"
                      @click="openDrawer(i)"
                      >查看</el-button
                    >
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <stuAnswerDrawer
        title="学生答案"
        :data="stuAnswerList"
        :direction="direction"
        @close="closeDrawer"
        :drawer="drawer"
      ></stuAnswerDrawer>
    </el-main>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import math from "@/components/jmath";
import timu from "./timu";
import stuAnswerDrawer from "./stuAnswerDrawer";
import bintu from "./bintu";

export default {
  name: "topicDetail",
  components: {
    "jd-math": math,
    timu,
    stuAnswerDrawer,
    bintu
  },
  data() {
    return {
      typeNum: 0, //总题型数
      timuNum: 0, //总题目数
      timuTotalScore: 0,
      drawer: false,
      direction: "ltr",
      exerciseId: this.$route.query.exerciseId,
      exerciseName: this.$route.query.exerciseName,
      timuListData: [],
      bingTuData: [],
      isShowResovle: true, // 是否显示答案和解析
      showResovleType: 1,
      stuAnswerList: [],
      fullscreenLoading: false
    };
  },
  async mounted() {
    this.loadData();
  },
  computed: {
    timuListLength() {
      return this.timuListData.length;
    }
  },
  methods: {
    //鼠标进入每一道题显示操作按钮
    handleTimuMouseenter(e) {
      e.target.lastChild.style.display = "block";
    },
    handleTimuMouseleave(e) {
      e.target.lastChild.style.display = "none";
    },
    // 判断题目是否为主观题
    checkTimu(item) {
      if (item.tSubject == 1 || item.tSubject == 2 || item.tSubject == 3) {
        return true;
      } else {
        return false;
      }
    },
    openDrawer(item) {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/exercise/selExerciseStuAnswer",
          data: {
            subjectId: item.id,
            classId: this.$route.query.classId,
            exercisesId: this.exerciseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.stuAnswerList = ret.data;
            this.drawer = true;
          }
        });
    },
    closeDrawer() {
      this.drawer = false;
    },
    showResovle() {
      if (this.isShowResovle) {
        this.showResovleType = 1;
      } else {
        this.showResovleType = 0;
      }
    },
    //加载试题列表
    loadData() {
      this.fullscreenLoading = true;
      axios
        .request({
          method: "post",
          url: "/clazz/v4/exercise/selObjectiveStatistical",
          data: {
            exercisesId: this.exerciseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            setTimeout(() => {
              this.fullscreenLoading = false;
            }, 600);
            //请求成功进循环以前先清空数据
            this.timuListData = [];
            this.timuTotalScore = 0;
            this.typeNum = 0;
            this.timuNum = 0;
            ret.data.subjectInfos.forEach(element => {
              let flag = 0;
              let footTabs = [];
              if (this.checkTimu(element)) {
                footTabs = [
                  {
                    title: "正确率",
                    percent: `${element.rightPencent}%`
                  },
                  {
                    title: "答对",
                    percent: `${element.correct}人`
                  },
                  {
                    title: "答错",
                    percent: `${element.error}人`
                  },
                  {
                    title: "未答",
                    percent: `${element.unAnswer}人`
                  }
                ];
              } else {
                footTabs = [
                  {
                    title: "平均分",
                    percent: `${element.averageScore.toFixed(1)}`
                  },
                  {
                    title: "最多人",
                    percent: `${element.maxNumber}`
                  },
                  {
                    title: "最高分",
                    percent: `${element.maxNum}`
                  },
                  {
                    title: "最低分",
                    percent: `${element.minNum}`
                  }
                ];
              }
              for (let i = 0; i < this.timuListData.length; i++) {
                let temp = this.timuListData[i];
                if (temp.type == element.tSubject) {
                  element.timuNum = this.timuNum++;
                  temp.score += element.score;
                  element = Object.assign({ footTabs }, element);
                  temp.children.push(element);
                  flag = 1;
                  break;
                }
              }

              if (flag == 0) {
                element.timuNum = this.timuNum++;
                element = Object.assign({ footTabs }, element);
                this.timuListData.push({
                  type: element.tSubject,
                  index: this.typeNum++,
                  score: element.score,
                  children: [element]
                });
              }
            });
            this.timuListData.forEach(element => {
              this.timuTotalScore += element.score;
            });
          }
        });
    },
    //跳转到指定题目位置
    toTimuPosition(pitemId) {
      document.getElementById(pitemId).scrollIntoView();
      let arr = document.getElementsByClassName("timuBtn");
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        element.style.display = "none";
      }
      document.getElementById(pitemId).lastElementChild.style.display = "block";
    },
    goBack() {
      this.$router.push({
        path: "/class/classReport"
      });
    },
    // 类型
    formatType(row) {
      return common.typeFormat(row.tSubject);
    },
    formatType1(type) {
      return common.typeFormat(type);
    },
    convert(textIndex) {
      let newString = "";
      let newTextIndex = textIndex + "";
      function sum(value, index) {
        var newValue = "";
        if (textIndex === 9) {
          return !index ? "十" : "";
        }
        let isSeat = ~~textIndex > 9 && ~~textIndex < 19;
        switch (~~value) {
          case 1:
            newValue = !index ? (isSeat ? "" : "一") : "十一";
            break;
          case 2:
            newValue = !index ? (isSeat ? "" : "二") : "十二";
            break;
          case 3:
            newValue = !index ? (isSeat ? "" : "三") : "十三";
            break;
          case 4:
            newValue = !index ? (isSeat ? "" : "四") : "十四";
            break;
          case 5:
            newValue = !index ? (isSeat ? "" : "五") : "十五";
            break;
          case 6:
            newValue = !index ? (isSeat ? "" : "六") : "十六";
            break;
          case 7:
            newValue = !index ? (isSeat ? "" : "七") : "十七";
            break;
          case 8:
            newValue = !index ? (isSeat ? "" : "八") : "十八";
            break;
          case 9:
            newValue = !index ? (isSeat ? "" : "九") : "九十";
            break;
          case 0:
            newValue = "十";
            break;
          default:
            break;
        }
        return newValue;
      }
      for (let i = 0; i < newTextIndex.length; i++) {
        newString += sum(newTextIndex.substring(i, i + 1), i);
      }
      return newString;
    }
  }
};
</script>

<style lang="scss">
.editCourseTask {
  height: 100%;
  .el-header {
    background: rgba(13, 67, 118, 1);
    text-align: center;
    color: #fff;
    overflow: hidden;
    font-size: 15px;
    line-height: 60px;
    padding: 0;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    .returnBtn {
      position: absolute;
      top: 13px;
      left: 0;
      z-index: 2;
      color: #fff;
      border: 1px solid #979797;
      width: 100px;
      height: 34px;
      line-height: 34px;
      font-size: 14px;
      border-radius: 17px;
      cursor: pointer;
      margin-left: 45px;
    }
    .editTitle {
      box-sizing: border-box;
      z-index: 1;
      position: absolute;
      font-size: 20px;
      width: 100%;
      text-align: center;
    }
  }
  .el-dialog {
    .subject-title {
      text-align: left;
      max-height: 23px;
      overflow: hidden;
    }
  }
  .el-main {
    background: #f0f1f5;
    margin-top: 80px;
    height: 100%;
    padding: 0;
    overflow-y: scroll;
    padding-bottom: 16px;
    .contentBox {
      width: 1034px;
      height: 100%;
      margin: 0 auto;
      .leftList {
        position: fixed;
        top: 0;
        bottom: 16px;
        transition: padding-top 0.3s;
        width: 283px;
        margin-top: 80px;
        padding-left: 0;
        background: #fff;
        z-index: 1;
        max-height: 100%;
        overflow-y: auto;
        padding-bottom: 180px;
        .countTitle {
          background-color: #e4e4e4;
          padding: 0 30px;
          height: 45px;
          line-height: 45px;
          color: #666666;
          font-size: 16px;
          span {
            float: right;
          }
        }
        .setScore {
          padding: 0 30px;
          font-size: 15px;
          height: 45px;
          line-height: 45px;
          color: #333333;
          .el-button {
            float: right;
          }
        }
        .scoreTotleContent {
          padding: 0 30px;
          font-size: 12px;
          color: #999999;
          margin-top: -5px;
          margin-bottom: 12px;
          i {
            color: #2ba1f4;
            font-size: 14px;
            margin-right: 2px;
          }
        }
        .timuNumList {
          padding: 25px 25px 15px;
          border-top: 1px solid #dddddd;
          ul {
            list-style: none;
            overflow: hidden;
            padding-left: 0;
            margin: 0;
            margin-top: 14px;
            li {
              float: left;
              width: 36px;
              height: 36px;
              line-height: 36px;
              border: 1px solid #e4e4e4;
              text-align: center;
              margin-right: 13px;
              margin-bottom: 15px;
              border-radius: 5px;
              cursor: pointer;
            }
          }
        }
        .paperBtn {
          width: 283px;
          height: 150px;
          padding: 20px 0 20px 0;
          position: fixed;
          bottom: 16px;
          border-radius: 4px;
          background: #ffffff;
          border-top: 1px solid #e4e4e4;
          text-align: center;
          div {
            font-size: 12px;
            text-align: center;
            color: #999999;
          }
          .el-button {
            margin-top: 15px;
          }
        }
      }
      .rightList {
        width: 100%;
        padding-left: 324px;
        height: calc(100% - 66px);
        position: relative;
        .exerciseName {
          font-size: 24px;
          color: #000000;
          background: #fff;
          text-align: center;
          padding: 20px 0 15px;
          i {
            color: #2ba1f4;
            font-size: 16px;
            cursor: pointer;
          }
        }
        .timuList {
          list-style: none;
          margin: 0;
          background: #fff;
          min-height: 100%;
          padding: 20px 20px 40px;
          .timuContent {
            border: 1px solid #dddddd;
            padding: 22px;
            margin-top: 9px;
            word-wrap: break-word;
          }
          .delectButton {
            color: #2ba1f4;
            border: 1px solid #2ba1f4;
            padding-top: 7px;
            padding-bottom: 7px;
            padding-left: 13px;
            padding-right: 13px;
            font-size: 14px;
            border-radius: 5px;
            cursor: pointer;
            float: right;
          }
          li {
            margin-bottom: 20px;
            .timuType {
              font-size: 16px;
              color: #222222;
              font-weight: 600;
            }
          }
          ul {
            list-style: none;
            padding-left: 10px;
            padding-right: 10px;
            li {
              margin-top: 10px;
              position: relative;
              padding: 20px;
              cursor: pointer;
              margin-bottom: 0;
              .timuBtn {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                border-radius: 5px;
                padding: 20px 20px;
                background: rgba(245, 247, 250, 0);
                display: none;
                .el-input-number,
                .el-button {
                  float: right;
                  margin-left: 5px;
                  border-color: #2ba1f4;
                }
              }
            }
          }
        }
        .emptyTs {
          position: absolute;
          top: 300px;
          width: 710px;
          text-align: center;
          .el-button {
            margin-top: 15px;
          }
        }
      }
      .leftList::-webkit-scrollbar {
        width: 3px;
        height: 2px;
        // background:#ccc;
        border-radius: 5px;
      }
      .leftList::-webkit-scrollbar-thumb {
        display: block;
        width: 2px;
        margin: 0 auto;
        border-radius: 5px;
        background: rgba(43, 161, 244, 0.6);
      }
    }
  }
  .el-main::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background: rgba(240, 241, 245, 1);
    border-radius: 5px;
    border: 1px solid rgba(214, 220, 222, 1);
  }
  .el-main::-webkit-scrollbar-thumb {
    display: block;
    width: 7px;
    margin: 0 auto;
    border-radius: 5px;
    background: rgba(196, 201, 205, 1);
  }
  .scoreList {
    padding: 15px 25px;
    ul {
      list-style: none;
      overflow: hidden;
      padding-left: 0;
      margin: 0;
      margin-top: 14px;
      .noLittle {
        float: left;
        width: 36px;
        text-align: center;
        margin-right: 15px;
        margin-bottom: 15px;
        .tihao {
          height: 36px;
          line-height: 36px;
          border: 1px solid #e4e4e4;
          // border-radius: 5px;
          margin-bottom: 5px;
        }
        .el-input {
          input {
            text-align: center;
            color: #2ba1f4;
            padding: 0;
            font-weight: 600;
          }
        }
      }
      .hasLittle {
        width: 100%;
        float: left;
        .tihao {
          width: 36px;
          height: 36px;
          line-height: 36px;
          border: 1px solid #e4e4e4;
          // border-radius: 5px;
          margin-bottom: 5px;
          text-align: center;
        }
        ul {
          list-style: none;
          overflow: hidden;
          padding-left: 0;
          margin: 0;
          margin-top: 14px;
          li {
            float: left;
            width: 36px;
            text-align: center;
            margin-right: 15px;
            margin-bottom: 15px;
            .tihao {
              height: 36px;
              line-height: 36px;
              border: 1px solid #e4e4e4;
              // border-radius: 5px;
              margin-bottom: 5px;
            }
            .el-input {
              input {
                text-align: center;
                color: #2ba1f4;
                padding: 0;
                font-weight: 600;
              }
            }
          }
        }
      }
    }
  }
  :focus {
    outline: 0;
  }
  .el-drawer__header {
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 15px;
  }
  .el-drawer__body {
    overflow-y: scroll;
    padding-bottom: 150px;
  }
  .el-drawer__body::-webkit-scrollbar {
    width: 8px;
    height: 2px;
    // background:#ccc;
    border-radius: 5px;
  }
  .el-drawer__body::-webkit-scrollbar-thumb {
    display: block;
    width: 8px;
    margin: 0 auto;
    border-radius: 5px;
    background: rgba(43, 161, 244, 0.6);
  }
  .showAnswer {
    float: right;
    margin-left: 20px;
  }
}
</style>
