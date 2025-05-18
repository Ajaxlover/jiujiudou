<template>
  <div>
    <el-container
      v-loading.fullscreen.lock="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="check-work"
    >
      <el-header>
        <el-button type="plain" @click="goBack">返回</el-button>
        <div class="head-title">
          <div>
            <span style="margin-right:300px">当前批阅{{ stuName }}作业</span>
            <span>总共{{ unCheckListLength }}题</span>
          </div>
        </div>
        <div class="head-buttons">
          <el-button @click="prevQuestion" type="plain">上一题</el-button>
          <el-button @click="nextQuestion" type="plain">下一题</el-button>
          <el-button type="primary" @click="openDrawer">标准答案</el-button>
        </div>
      </el-header>
      <el-container class="check-work-down">
        <el-aside width="1000px">
          <div v-show="!isUrl" class="answerText">
            <span>{{ currentTimu.stuAnswer }}</span>
          </div>
          <div v-show="isUrl" class="huabu">
            <div class="huabu-container" @mousemove="beginPath($event)">
              <canvas
                width="600"
                height="600"
                ref="ctxImg"
                id="imgCanvas"
              ></canvas>
              <canvas
                ref="canvas"
                id="canvas"
                width="600"
                height="600"
                @mousedown="canvasDown($event)"
                @mouseup="canvasUp($event)"
                @mousemove="canvasMove($event)"
                @mouseout="canvasOut($event)"
                @touchstart="canvasDown($event)"
                @touchend="canvasUp($event)"
                @touchmove="canvasMove($event)"
              >
              </canvas>
            </div>
            <div class="foot-icon" v-if="currentTimu.stuAnswer && isUrl">
              <el-button type="primary" @click="controlCanvas('prev')" round
                >撤销</el-button
              >
              <el-button type="primary" @click="controlCanvas('clear')" round
                >清空</el-button
              >
              <!-- <el-button type="primary" @click="getImage" round>保存</el-button> -->
            </div>
          </div>
        </el-aside>
        <el-main>
          <div class="main-right">
            <div class="main-right-score">
              本题总分{{ currentTimu.score }}分
            </div>
            <el-form
              :label-position="labelPosition"
              label-width="80px"
              :model="formLabelAlign"
            >
              <el-form-item
                class="score-item"
                prop="score"
                :rules="[
                  { required: true, message: '分数不能为空' },
                  { type: 'number', message: '分数必须为整数' }
                ]"
                label=""
              >
                <div class="score-item-text">得分</div>
                <el-input
                  v-model.number="formLabelAlign.score"
                  placeholder="请输入分数，只能为整数"
                ></el-input>
              </el-form-item>
              <el-form-item class="score-item" label="">
                <div class="score-item-text">评语</div>
                <el-input
                  type="textarea"
                  v-model="formLabelAlign.comment"
                  rows="8"
                  maxlength="140"
                  show-word-limit
                  placeholder="请输入评语"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="submitButton">
              <el-button type="primary" @click="submitCheck" round
                >提交</el-button
              >
            </div>
            <div style="display:none" ref="imgs" id="imgs"></div>
            <!-- <img
              ref="img"
              style="diplay:none"
              :src="imgUrl[imgUrl.length - 1]"
              alt=""
            /> -->
          </div>
        </el-main>
        <showAnswerDrawer
          title="标准答案"
          :direction="direction"
          @close="closeDrawer"
          :drawer="drawer"
          :data="data"
        ></showAnswerDrawer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import showAnswerDrawer from "./showAnswerDrawer.vue";
import Canvas2Image from "@/utils/canvas2image";

export default {
  components: {
    showAnswerDrawer
  },
  data() {
    return {
      startTime: this.$route.query.startTime,
      endTime: this.$route.query.endTime,
      stuName: this.$route.query.stuName, // 学生姓名
      data: {}, // 传入看答案的数据
      drawer: false,
      direction: "ltr",
      exerciseId: this.$route.query.exerciseId, // 作业id
      classId: this.$route.query.classId, // 班级id
      suid: this.$route.query.suid, // 学生id
      labelPosition: "top",
      formLabelAlign: {
        score: "",
        comment: ""
      },
      context: {},
      contextImg: {}, // 存放背景图的canvas
      imgUrl: [],
      canvasMoveUse: false,
      // 配置参数
      config: {
        lineWidth: 1,
        lineColor: "#f32f15",
        shadowBlur: 2
      },
      sonSubList: [], // 所有题目,
      contentList: [], // 主观题
      unCheckList: [], // 未批阅的主观题
      unCheckListIndex: 0, // 未批阅的主观题下标
      currentTimu: {},
      cancelList: [],
      cancelIndex: 0,
      loading: false,
      checkResPic: null // 批阅结果图片对象
    };
  },
  mounted() {
    // 防止浏览器后退
    history.pushState(null, null, document.URL);
    window.addEventListener("popstate", function() {
      history.forward(1);
    });
    this.loadData();
    if (this.$refs.canvas) {
      const canvas = this.$refs.canvas;
      this.context = canvas.getContext("2d");
      const ctxImg = this.$refs.ctxImg;
      this.contextImg = ctxImg.getContext("2d");
      this.setCanvasStyle();
    }
  },
  computed: {
    unCheckListLength() {
      return this.unCheckList.length;
    },
    isUrl() {
      return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(
        this.currentTimu.stuAnswer
      );
    }
  },
  methods: {
    // base64转file
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    // 加载试题列表
    loadData() {
      this.loading = true;
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
            this.sonSubList = ret.data.list;
            // 过滤出主观题
            this.contentList = this.sonSubList.filter(
              item =>
                item.tSubject != 1 && item.tSubject != 2 && item.tSubject != 3
            );
            // 过滤出未批阅的主观题
            //  &&
            //     item.status != 4 &&
            //     item.status != 3 &&
            //     item.status != 2
            this.unCheckList = this.sonSubList.filter(
              item =>
                item.tSubject != 1 && item.tSubject != 2 && item.tSubject != 3
            );
            this.$store.commit("setUnCheckList", this.unCheckList);
            if (this.unCheckList.length > 0) {
              this.initDraw(this.unCheckList[this.unCheckListIndex].stuAnswer);
              this.currentTimu = this.unCheckList[this.unCheckListIndex];
            }
            this.loading = false;
          }
        });
    },
    isPc() {
      const userAgentInfo = navigator.userAgent;
      const Agents = [
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod"
      ];
      let flag = true;
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    saveData() {
      this.cancelIndex = 0;
      // canvas转图片
      // let dataUrl = this.$refs.canvas.toDataURL();
      // this.cancelList.push(dataUrl);
      const canvas = this.$refs.canvas;
      let res = Canvas2Image.convertToImage(canvas, 600, 600, "jpg");
      this.cancelList.push(res.getAttribute("src"));
    },
    initDraw(currentImg) {
      var image = new Image();
      image.setAttribute("crossOrigin", "Anonymous");
      image.src = currentImg + `?t=${Date.now()}`;
      image.onload = () => {
        this.context.drawImage(
          image,
          0,
          0,
          this.context.canvas.width,
          this.context.canvas.width
        );
      };
    },
    canvasMove(e) {
      if (this.canvasMoveUse) {
        const t = e.target;
        let canvasX;
        let canvasY;
        if (this.isPc()) {
          canvasX = e.clientX - t.parentNode.offsetLeft;
          canvasY = e.clientY - t.parentNode.offsetTop;
        } else {
          canvasX = e.changedTouches[0].clientX - t.parentNode.offsetLeft;
          canvasY = e.changedTouches[0].clientY - t.parentNode.offsetTop;
        }
        this.context.lineTo(canvasX, canvasY);
        this.context.stroke();
      }
    },
    beginPath(e) {
      const canvas = this.$refs.canvas;
      if (e.target !== canvas) {
        console.log("beginPath");
        this.context.beginPath();
      }
    },
    // mouseup
    canvasUp(e) {
      this.canvasMoveUse = false;
      this.saveData();
    },
    // mousedown
    canvasDown(e) {
      this.canvasMoveUse = true;
      const canvasX = e.clientX - e.target.parentNode.offsetLeft;
      const canvasY = e.clientY - e.target.parentNode.offsetTop;
      this.setCanvasStyle();
      // 清除子路径
      this.context.beginPath();
      this.context.moveTo(canvasX, canvasY);
    },
    canvasOut(e) {
      this.canvasMoveUse = false;
    },
    // 设置颜色
    setColor(color) {
      this.config.lineColor = color;
    },
    // 设置笔刷大小
    setBrush(type) {
      this.config.lineWidth = type;
    },
    // 操作
    controlCanvas(action) {
      switch (action) {
        case "prev":
          if (this.cancelList.length - 1 < this.cancelIndex) {
            this.initDraw(this.unCheckList[this.unCheckListIndex].stuAnswer);
            return false;
          }
          this.cancelIndex++;
          var cImage = new Image();
          var index = this.cancelList.length - 1 - this.cancelIndex;
          if (index >= 0) {
            cImage.src = this.cancelList[index];
            cImage.onload = () => {
              this.context.drawImage(
                cImage,
                0,
                0,
                cImage.width,
                cImage.height,
                0,
                0,
                this.$refs.canvas.width,
                this.$refs.canvas.height
              );
            };
          }
          break;
        case "clear":
          this.context.clearRect(
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
          );
          this.cancelList = [];
          this.initDraw(this.unCheckList[this.unCheckListIndex].stuAnswer); // 清空之后，重新绘制，否则会连同图片一起清除
          break;
      }
    },
    // 生成图片
    getImage() {
      const canvas = this.$refs.canvas;
      // var image = new Image();
      // Canvas2Image.saveAsImage(canvas, 600, 600, "png");

      // eslint-disable-next-line no-unused-vars
      let res = Canvas2Image.convertToImage(canvas, 600, 600, "jpg");

      // this.$refs.imgs.appendChild(res);
      let date = new Date().getTime();
      this.checkResPic = this.dataURLtoFile(
        res.getAttribute("src"),
        `${date}.jpg`
      );
      // this.$message({
      //   message: "保存成功！",
      //   type: "success"
      // });
      if (!this.isPc()) {
        // window.open(`data:text/plain,${src}`);
        // window.location.href = src;
      }
    },
    // 设置绘画配置
    setCanvasStyle() {
      this.context.lineWidth = this.config.lineWidth;
      this.context.shadowBlur = this.config.shadowBlur;
      this.context.shadowColor = this.config.lineColor;
      this.context.strokeStyle = this.config.lineColor;
    },
    goBack() {
      this.$router.push({
        path: "/topic/stuHomeWorkDetail",
        query: {
          exerciseId: this.exerciseId,
          classId: this.classId,
          startTime: this.startTime,
          endTime: this.endTime,
          suid: this.suid
        }
      });
    },
    // 关闭drawer
    closeDrawer() {
      this.drawer = false;
    },
    openDrawer() {
      this.drawer = true;
      this.data = this.currentTimu;
    },
    // 提交批阅 ？？？
    submitCheck() {
      this.getImage();
      if (!this.checkResPic) {
        this.$message({
          message: "请先批阅答案并保存",
          type: "warning"
        });
        return;
      }
      if (!this.formLabelAlign.score && this.formLabelAlign.score != 0) {
        this.$message({
          message: "请输入分数",
          type: "warning"
        });
        return;
      }
      if (this.formLabelAlign.score < 0) {
        this.$message({
          message: "分数不能小于0分",
          type: "warning"
        });
        return;
      }
      if (this.formLabelAlign.score > this.currentTimu.score) {
        this.$message({
          message: "分数不能大于本题总分",
          type: "warning"
        });
        return;
      }

      let fd = new FormData();
      fd.append("exerciseId", this.exerciseId);
      fd.append("sUid", this.suid);
      fd.append("type", 0);
      fd.append("subjectId", this.currentTimu.subjectId);
      fd.append("remark", this.formLabelAlign.comment);
      fd.append("score", this.formLabelAlign.score);
      if (this.isUrl) {
        // 当前学生答案是图片链接
        fd.append("answerRemarkFile", this.checkResPic);
      }
      fd.append("audioRemarkFile", null);
      axios
        .request({
          method: "post",
          url: "/tiku/exerciseStu/remarkSubjectTea",
          data: fd
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              message: "批阅成功！",
              type: "success"
            });
            // 清空分数，评语输入框
            this.formLabelAlign.score = "";
            this.formLabelAlign.comment = "";
            // this.unCheckListIndex = 0;
            this.nextQuestion2();
            this.loadData();
            // if (this.$store.state.classRoom.unCheckList.length === 1) {
            //   // 主观题批阅完成,跳转学生统计
            //   this.$alert(
            //     `${this.stuName}作业批阅完成，查看学生成绩`,
            //     "提交成功！",
            //     {
            //       confirmButtonText: "确定",
            //       showClose: false,
            //       callback: () => {
            //         // 更改作业状态  4-作业批阅完成
            //         axios
            //           .request({
            //             method: "post",
            //             url: "/clazz/v4/exercise/changsClassExerciseStatus",
            //             data: {
            //               exercisesId: this.exerciseId,
            //               status: 4
            //             }
            //           })
            //           .then(res => {
            //             let ret = res.data;
            //             if (ret.code === 200) {
            //               this.$router.push({
            //                 path: "/topic/stuStatistics",
            //                 query: {
            //                   exercisesId: this.exerciseId,
            //                   classId: this.classId,
            //                   startTime: this.startTime,
            //                   endTime: this.endTime,
            //                   type: 1
            //                 }
            //               });
            //             }
            //           });
            //       }
            //     }
            //   );
            // }
          }
        });
    },
    // 上一题
    prevQuestion() {
      // 清空分数和评语输入框
      this.formLabelAlign.score = "";
      this.formLabelAlign.comment = "";
      if (this.unCheckListIndex == 0) {
        // this.unCheckListIndex = this.unCheckList.length - 1;
        this.$message({
          message: "当前是所有主观题的第一题",
          type: "warning"
        });
      } else {
        this.unCheckListIndex--;
      }
      this.controlCanvas("clear");
      this.initDraw(this.unCheckList[this.unCheckListIndex].stuAnswer);
      this.currentTimu = this.unCheckList[this.unCheckListIndex];
    },
    // 下一题
    nextQuestion() {
      // 清空分数和评语输入框
      this.formLabelAlign.score = "";
      this.formLabelAlign.comment = "";
      if (this.unCheckListIndex == this.unCheckList.length - 1) {
        // this.unCheckListIndex = 0;
        this.$message({
          message: "当前是所有主观题的最后一题",
          type: "warning"
        });
      } else {
        this.unCheckListIndex++;
      }
      this.controlCanvas("clear");
      this.initDraw(this.unCheckList[this.unCheckListIndex].stuAnswer);
      this.currentTimu = this.unCheckList[this.unCheckListIndex];
    },
    // 批阅最后一题时跳转到下一题
    nextQuestion2() {
      // 清空分数和评语输入框
      this.formLabelAlign.score = "";
      this.formLabelAlign.comment = "";
      if (this.unCheckListIndex == this.unCheckList.length - 1) {
        // this.unCheckListIndex = 0;
        // this.$message({
        //   message: "当前是所有主观题的最后一题",
        //   type: "warning"
        // });
        this.$alert(
          `当前是${this.stuName}作业所有主观题的最后一题，是否结束批阅？`,
          "提交成功！",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: true,
            showClose: false,
            callback: val => {
              if (val == "cancel") {
                return;
              }
              this.$router.push({
                path: "/topic/stuStatistics",
                query: {
                  exercisesId: this.exerciseId,
                  classId: this.classId,
                  startTime: this.startTime,
                  endTime: this.endTime,
                  type: 1
                }
              });
            }
          }
        );
      } else {
        this.unCheckListIndex++;
      }
      this.controlCanvas("clear");
      this.initDraw(this.unCheckList[this.unCheckListIndex].stuAnswer);
      this.currentTimu = this.unCheckList[this.unCheckListIndex];
    }
  }
};
</script>

<style lang="scss" scoped>
.check-work {
  height: 100%;
  display: flex;
  .el-header {
    background-color: #fff;
    color: #333;
    text-align: center;
    line-height: 88px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 20px;
    .head-title {
    }
    .head-buttons {
    }
  }
  .check-work-down {
    flex: 1;
    .el-aside {
      background-color: rgb(243, 244, 245);
      color: #333;
      text-align: center;
      display: flex;
      justify-content: center;
      .answerText {
        width: 600px;
        height: 600px;
        margin-top: 50px;
        font-size: 18px;
        line-height: 600px;
      }
      .huabu {
        width: 600px;
        padding-top: 50px;
        display: flex;
        .unAnswer {
          border: 1px solid rgb(243, 244, 245);
          width: 600px;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
          color: red;
        }
        .huabu-container {
          position: relative;
          canvas {
            border: 1px solid rgb(243, 244, 245);
            cursor: crosshair;
            position: absolute;
            left: 0;
            top: 50px;
            z-index: 0;
          }
        }

        .foot-icon {
          height: 40px;
        }
      }
    }

    .el-main {
      background-color: #fff;
      color: #333;
      .main-right {
        padding: 30px 300px 0 50px;
        .main-right-score {
          font-size: 24px;
        }
        .score-item {
          margin-top: 100px;
          margin-bottom: 100px;
          .score-item-text {
            font-size: 20px;
            margin-bottom: 5px;
          }
        }
        .submitButton {
          margin-top: 100px;
          text-align: center;
          .el-button {
            width: 300px;
            height: 60px;
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
