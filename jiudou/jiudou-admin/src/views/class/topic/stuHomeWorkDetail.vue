<template>
  <el-container class="editCourseTask">
    <el-header>
      <span class="returnBtn" @click="goBack"
        ><i class="el-icon-back" style="margin-right:5px"></i>返回</span
      >
      <div class="editTitle">学生作业详情</div>
    </el-header>
    <el-main v-loading.fullscreen.lock="fullscreenLoading">
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
                  :class="[i.appealStatus >= 1 ? 'appeal-check' : '']"
                  @click="toTimuPosition(i.subjectId)"
                  v-for="i in item.children"
                  :key="i.index"
                >
                  {{ i.timuNum + 1 }}
                </li>
              </ul>
            </div>
          </div>
          <div class="paperBtn">
            <el-button
              v-if="stuInfo.homeworkStatus == 2"
              @click="goCheck"
              :disabled="isDisable"
              type="danger"
              >批阅</el-button
            >
            <!-- <el-button
              v-if="stuInfo.homeworkStatus == 1"
              @click="goCheck"
              type="danger"
              >批阅</el-button
            > -->
          </div>
        </div>
        <div class="rightList">
          <ul class="timuList">
            <div class="timuList-title">
              <span class="homework-name">{{ stuInfo.exercisesName }}</span>
              <span class="homework-time"
                >{{ format(stuInfo.start, "MM-DD HH:mm") }}到{{
                  format(stuInfo.end, "MM-DD HH:mm")
                }}</span
              >
              <div class="stuInfo">
                <span>班级:{{ stuInfo.className }}</span>
                <span>学号:{{ stuInfo.stuNumber }}</span>
                <span>姓名:{{ stuInfo.stuName }}</span>
                <div class="homework-tag" v-if="stuInfo.homeworkStatus != 2">
                  <img src="@/assets/images/unchecked.png" alt="" />
                </div>
                <span
                  class="homework-tag"
                  v-if="stuInfo.homeworkStatus == 2 && score != 0"
                  >{{ score ? score : totalStuScore }}分</span
                >
                <span
                  class="homework-tag"
                  v-if="stuInfo.homeworkStatus == 2 && score == 0"
                  >0分</span
                >
              </div>
            </div>

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
                  :id="i.subjectId"
                  :key="i.index"
                  @mouseenter="handleTimuMouseenter($event)"
                  @mouseleave="handleTimuMouseleave($event)"
                >
                  <timu
                    @teaReply="teaReply"
                    :imgList="imgList"
                    :tNum="index"
                    :data="i"
                    :type="showResovleType"
                  ></timu>

                  <div class="timuBtn">
                    <el-button
                      @click="handleAppeal(i)"
                      v-if="
                        i.tSubject !== 11 &&
                          i.tSubject !== 1 &&
                          i.tSubject !== 2 &&
                          i.tSubject !== 3 &&
                          i.appealStatus >= 1
                      "
                      size="mini"
                      >回复申诉</el-button
                    >
                    <!-- <el-button
                      v-if="i.tSubject == 4 || i.tSubject == 5"
                      size="mini"
                      >查看申诉</el-button
                    >
                    <el-button
                      v-if="i.tSubject == 4 || i.tSubject == 5"
                      size="mini"
                      >批阅</el-button
                    > -->
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </el-main>
    <jd-dialog
      title="申诉回复"
      v-if="showReportDialog"
      :visible.sync="showReportDialog"
      @sure="reportSure"
    >
      <template slot="body">
        <div style="margin:0 5%">
          <div class="jc-pic">
            <el-input
              :rows="6"
              resize="none"
              type="textarea"
              v-model="reportDes"
            ></el-input>
            <el-upload
              :multiple="false"
              :with-credentials="true"
              class="avatar-uploader"
              :auto-upload="true"
              :before-upload="beforeAvatarUpload"
              :http-request="uploadSectionFile"
              action=""
              :show-file-list="false"
            >
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <!-- <el-button
                    v-if="form.honorPic"
                    @click="viewImg(form.honorPic)"
                    type="text"
                    size="small"
                    >预览</el-button
                  > -->
          </div>
        </div>
      </template>
    </jd-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import moment from "moment";
import common from "@/utils/common";
import math from "@/components/jmath";
import timu from "./timu";
import bintu from "./bintu";
import jdialog from "@/components/jdialog";

export default {
  name: "stuHomeWorkDetail",
  components: {
    "jd-dialog": jdialog,
    "jd-math": math,
    timu,
    bintu
  },
  data() {
    return {
      showReportDialog: false, // 回复申诉
      reportDes: "", // 申诉回复内容
      imgUrl: "", // 申诉回复图片
      score: this.$route.query.score,
      startTime: this.$route.query.startTime,
      endTime: this.$route.query.endTime,
      exerciseId: this.$route.query.exerciseId, // 作业id
      classId: this.$route.query.classId, // 班级id
      suid: this.$route.query.suid, // 学生id
      typeNum: 0, //总题型数
      timuNum: 0, //总题目数
      timuTotalScore: 0,
      drawer: false,
      direction: "ltr",
      timuListData: [],
      bingTuData: [],
      isShowResovle: true, // 是否显示答案和解析
      showResovleType: 1,
      stuAnswerList: [],
      stuInfo: {
        exercisesName: "",
        start: "",
        end: "",
        className: "",
        stuNumber: "",
        stuName: "",
        homeworkStatus: "", // 作业状态 0-未答 1-已答 2-已批阅
        score: ""
      },
      questionList: [],
      imgList: [],
      fullscreenLoading: false,
      currentTimu: null
    };
  },
  mounted() {
    this.loadData();
  },
  computed: {
    timuListLength() {
      return this.timuListData.length;
    },
    totalStuScore() {
      let total = 0;
      this.questionList.forEach(item => {
        total += item.stuScore;
      });
      return total;
    },
    isDisable() {
      let arr = [];
      this.questionList.forEach(item => {
        if (item.tSubject != 1 && item.tSubject != 2 && item.tSubject != 3) {
          arr.push(item);
        }
      });
      return arr.length == 0;
    }
  },
  methods: {
    teaReply(data) {
      this.currentTimu = data;
      this.reportDes = data.teaReplyContent;
      this.imgUrl = data.teaReplyPicUrl;
      this.showReportDialog = true;
    },
    handleAppeal(i) {
      this.currentTimu = i;
      this.reportDes = i.teaReplyContent;
      this.imgUrl = i.teaReplyPicUrl;
      this.showReportDialog = true;
    },
    beforeAvatarUpload(file) {
      let isPic = file.type.includes("image");
      if (!isPic) {
        this.$message({
          type: "warning",
          message: "只支持上传图片"
        });
        return;
      }

      return isPic;
    },
    uploadSectionFile(params) {
      // this.form.honorPicFile = params;
      axios
        .request({
          method: "post",
          url: `/exam/masterHead/getUploadCosPath`
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let { cosPath, dev } = ret.data;
            const form = new FormData();
            // 文件对象
            form.append("file", params.file);
            form.append("cosPath", cosPath);
            form.append("dev", dev);
            axios
              .request({
                method: "post",
                url: `${process.env.BASE_URL_V3}/common/feign/upload/uploadImg`,
                data: form
              })
              .then(res => {
                if (res.status === 200) {
                  let { accessUrl } = res.data;
                  this.imgUrl = accessUrl;
                } else {
                  this.$message({
                    type: "warning",
                    message: "上传失败"
                  });
                }
              });
          }
        });
    },
    // 回复申诉
    reportSure() {
      if (!this.reportDes && !this.imgUrl) {
        this.$message({
          message: "内容和图片不能同时为空",
          type: "warning"
        });
        return;
      }
      let formData = new FormData();
      formData.append("sUid", this.suid);
      formData.append("tUid", this.$store.state.user.userId);
      formData.append("exerciseId", this.exerciseId);
      formData.append("teaReplyContent", this.reportDes);
      formData.append("teaReplyPicUrl", this.imgUrl);
      formData.append("subjectId", this.currentTimu.subjectId);
      axios
        .request({
          method: "post",
          url: "/tiku/exerciseStu/handleAppeal",
          data: formData
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.$message({
                message: "回复申诉成功",
                type: "success"
              });
              this.showReportDialog = false;
              this.loadData();
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          }.bind(this)
        )
        .catch(() => {
          this.$message({
            message: "服务器异常",
            type: "warning"
          });
        });
    },
    isUrl(str) {
      return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(
        str
      );
    },
    //跳转到指定题目位置
    toTimuPosition(pitemId) {
      document.getElementById(pitemId).scrollIntoView();
      document.getElementById(pitemId).style.boxShadow =
        "0 2px 12px 0 rgba(0, 0, 0, 0.1)";
      let arr = document.getElementsByClassName("timuBtn");
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        element.style.display = "none";
      }
      document.getElementById(pitemId).lastElementChild.style.display = "block";
    },
    // 判断题目是否为客观题
    checkTimu(item) {
      if (item.tSubject == 1 || item.tSubject == 2 || item.tSubject == 3) {
        return true;
      } else {
        return false;
      }
    },
    showResovle() {
      if (this.isShowResovle) {
        this.showResovleType = 1;
      } else {
        this.showResovleType = 0;
      }
    },
    //鼠标进入每一道题显示操作按钮
    handleTimuMouseenter(e) {
      e.target.lastChild.style.display = "block";
      e.target.style.boxShadow = "0 2px 12px 0 rgba(0, 0, 0, 0.1)";
    },
    handleTimuMouseleave(e) {
      e.target.lastChild.style.display = "none";
      e.target.style.boxShadow = "none";
    },
    //加载试题列表
    loadData() {
      this.fullscreenLoading = true;
      axios
        .request({
          method: "post",
          url: "/clazz/v4/exercise/selExerciseFindAll",
          data: {
            exercisesId: this.exerciseId,
            classId: this.classId,
            suid: this.suid
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            setTimeout(() => {
              this.fullscreenLoading = false;
            }, 500);
            //请求成功进循环以前先清空数据
            // this.timuListData = ret.data.subjectInfos;
            this.timuListData = [];
            this.timuTotalScore = 0;
            // this.typeNum = 0;
            // this.timuNum = 0;
            let {
              exercisesName,
              className,
              stuName,
              stuNumber,
              start,
              end,
              status
            } = ret.data;
            this.stuInfo = {
              exercisesName,
              start,
              end,
              className,
              stuNumber,
              stuName,
              homeworkStatus: status
            };
            this.questionList = ret.data.list;
            // 处理学生带图片的主观题答案图片预览
            this.questionList.forEach(i => {
              if (!this.checkTimu(i) && i.stuAnswer) {
                // 主观题
                if (this.isUrl(i.stuAnswer)) {
                  this.imgList.push(i.stuAnswer);
                }
              }
            });
            ret.data.list.forEach(element => {
              let flag = 0;
              for (let i = 0; i < this.timuListData.length; i++) {
                let temp = this.timuListData[i];
                if (temp.type == element.tSubject) {
                  element.timuNum = this.timuNum++;
                  temp.score += element.score;
                  temp.children.push(element);
                  flag = 1;
                  break;
                }
              }
              if (flag == 0) {
                element.timuNum = this.timuNum++;
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
    goBack() {
      this.$router.push({
        path: "/topic/stuStatistics",
        query: {
          exercisesId: this.exerciseId,
          classId: this.classId,
          startTime: this.startTime,
          endTime: this.endTime
        }
      });
    },
    // 去批阅
    goCheck() {
      this.$router.replace({
        path: "/topic/check",
        query: {
          exerciseId: this.exerciseId,
          classId: this.classId,
          suid: this.suid,
          stuName: this.stuInfo.stuName,
          startTime: this.startTime,
          endTime: this.endTime
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
.appeal-check {
  background-color: #ffa340;
  color: #fff;
}
.editCourseTask {
  height: 100%;
  .jc-pic {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    padding-left: 2px;
    margin-top: 10px;
    .el-textarea__inner {
      border: none;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
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
      width: 1420px;
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
          .timuList-title {
            text-align: center;
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            .homework-name {
              font-size: 24px;
              margin-bottom: 5px;
            }
            .homework-time {
              font-size: 16px;
              margin-bottom: 5px;
            }
            .stuInfo {
              display: flex;
              justify-content: space-evenly;
              align-items: center;
              font-size: 18px;
              .homework-tag {
                color: red;
                font-size: 30px;
              }
            }
          }
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
                right: 0;
                // width: 100%;
                // height: 100%;
                // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
  }
}
</style>
