<template>
  <el-container class="classTest">
    <el-header>
      <span class="backBtn" type="text" @click="back"
        ><i class="el-icon-back"></i>返回PPT</span
      >
    </el-header>
    <el-container style="padding:0 200px;height:100%">
      <el-aside width="326px">
        <div
          style="font-size:34px;font-weight:bold;margin-bottom:26px;text-align:center"
        >
          发布作业
        </div>
        <div v-if="!data.exerciseId">
          <div v-if="subjects.length > 0">
            <div style="margin-bottom:16px">
              作业名：{{ data.exerciseName }}
            </div>
            <div style="margin-bottom:16px">
              作业分值：100分（共{{ subjects.length }}题）
            </div>
            <div style="margin-bottom:32px">开始时间：现在</div>
            <div class="deadlineContainer">
              <div>结束时间</div>
              <el-date-picker
                ref="datePicker"
                v-model="deadline"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                placeholder="请选择"
                :prefix-icon="
                  datePickShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                "
                :editable="false"
                :clearable="false"
                @focus="datePickShow = true"
                @blur="datePickShow = false"
              ></el-date-picker>
            </div>
            <el-button
              :loading="releaseLoading"
              type="primary"
              style="width:100%;height:50px;font-size:18px;"
              @click="release"
              >发布作业</el-button
            >
          </div>
          <div v-else style="line-height:32px">
            本课件下未设置作业，请先前往课件列表添加作业
          </div>
        </div>
        <div v-else style="text-align:center;">
          <img
            src="@/assets/images/icon_success.png"
            style="margin:58px 0 15px;"
          />
          <div style="text-align:center;margin-bottom:44px;">
            作业发布成功！
          </div>
          <!-- <el-button :loading="releaseLoading" @click="release" type="primary" style="width:100%;height:50px;font-size:18px;background:none;border-color:#979797;">重新发布</el-button> -->
        </div>
      </el-aside>
      <el-main v-loading="loading">
        <div class="head">
          <span class="type">{{ formatType(subjects.tSubject) }}</span>
          <span class="tihao" v-if="subjects.length > 0"
            >{{ index + 1 }}/{{ subjects.length }}</span
          >
          <span class="score">{{ subjects.score }}分</span>
          <div><jmath class="title" :data="subjects.title"></jmath></div>
        </div>
        <div
          class="options"
          v-if="subjects.answerList && subjects.answerList.length"
        >
          <div
            class="option"
            v-for="(option, index) in subjects.answerList"
            :key="index"
          >
            <div class="aOption">{{ option.aOption }}</div>
            <jmath class="aText" :data="option.aText"></jmath>
          </div>
        </div>
        <el-button type="text" @click="showAnswer(subjects)"
          >答案和解析&nbsp;<img
            src="@/assets/images/arrow_double_down.png"
            style="width:14px;"
        /></el-button>
        <el-collapse-transition>
          <div class="bm" v-show="subject.showAnalyse">
            <div class="tp">【答案】</div>
            <div class="tp">
              【解析】<jmath :data="subject.analyse"></jmath>
            </div>
          </div>
        </el-collapse-transition>
        <div
          style="margin-top:20px;padding:3px 24px 9px;background:white;"
          v-for="(sonSubject, index) in subjects.sonSubList"
          :key="index"
        >
          <span style="color:#10C4EE;font-size:36px">{{ index + 1 }}</span>
          <span style="color:#666;font-size:22px;"
            >/{{ subjects.sonSubList.length }}</span
          >
          <jmath class="title" :data="sonSubject.title"></jmath>
          <div
            class="options"
            style="padding:10px 8px;;margin:0;"
            v-if="sonSubject.answerList && sonSubject.answerList.length"
          >
            <div
              class="option"
              v-for="(option, index) in sonSubject.answerList"
              :key="index"
            >
              <div class="aOption">{{ option.aOption }}</div>
              <jmath class="aText" :data="option.aText"></jmath>
            </div>
          </div>
          <div class="bm" style="padding:0;" v-show="subjects.showAnalyse">
            <div class="tp">【答案】</div>
            <div class="tp">
              【解析】<jmath :data="sonSubject.analyse"></jmath>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import jmath from "@/components/jmath";
import common from "@/utils/common";
import axios from "@/libs/api.request";
export default {
  name: "classTest",
  props: {
    data: Object
  },
  components: {
    jmath
  },
  data() {
    return {
      datePickShow: false,
      loading: false,
      deadline: "",
      subjects: {},
      releaseLoading: false
    };
  },
  mounted() {
    if (this.data.paperId > 0) {
      this.loadList();
    }
  },
  methods: {
    // 获取题目
    loadList() {
      this.loading = true;
      axios
        .request({
          method: "post",
          url: "/tiku/paperItem/listAll",
          data: {
            paperId: this.data.paperId
          }
        })
        .then(res => {
          this.loading = false;
          let ret = res.data;
          if (ret.code == 200) {
            ret.data.forEach(element => {
              element.showAnalyse = false;
            });
            this.subjects = ret.data[0];
          }
        });
    },
    // 格式化题目类型
    formatType(type) {
      return common.typeFormat(type);
    },
    // 显示/隐藏答案
    showAnswer(row) {
      row.showAnalyse = !row.showAnalyse;
    },
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
    }
  }
};
</script>

<style lang="scss">
.classTest {
  background: #1c272e;
  height: 100%;
  .el-header {
    background: #0e1317;
    line-height: 60px;
    color: white;
    display: flex;
    align-items: center;
  }
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
  .el-aside {
    background: #203f53;
    height: 100%;
    padding: 44px 28px 44px 27px;
    color: white;
    font-size: 18px;
    font-weight: 400;
    .deadlineContainer {
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 44px;
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 4px;
      padding: 4px 12px;
      .el-date-editor {
        width: 70%;
        input {
          cursor: pointer;
          background: none;
          border: none;
          font-size: 16px;
          padding-right: 15px;
          padding-left: 0;
          text-align: right;
          color: #fff;
        }
        .el-input__prefix {
          left: 87%;
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
</style>
