<template>
  <div style="background: #000000;">
    <div class="printHomework">
      <div id="printCons" class="contentPrint" style="font-size: 15px">
        <div style="text-align:center">
          <p>
            <strong style="font-size:24px">{{
              printHomewokData.exercisename
            }}</strong>
          </p>
          <p>{{ format(printHomewokData.exercisetime, "YYYY-MM-DD H:mm") }}</p>
          <p>
            <span>班级：{{ printHomewokData.classname }}</span
            ><span style="margin:0 30px"
              >学号：{{ printHomewokData.stuNumber }}</span
            ><span>姓名：{{ printHomewokData.stuName }}</span>
          </p>
        </div>
        <div v-for="(item, index) in printHomewokData.subjects" :key="index">
          <el-divider></el-divider>
          <div>
            <span style="line-height: 60px;"
              ><el-tag size="small">{{ formatType(item.tSubject) }}</el-tag
              ><strong> {{ index + 1 }}.</strong></span
            >
            <jmath
              class="title"
              style="line-height: 60px;"
              :data="item.title"
            ></jmath>
          </div>
          <div style="text-indent:50px" v-if="item.sonSubList.length > 0">
            <div v-for="(i, idx) in item.sonSubList" :key="idx">
              <div>
                <span style="line-height: 60px;">
                  <!-- <el-tag size="small">{{ formatType(i.tSubject) }}</el-tag> -->
                  <strong> {{ index + 1 }}.{{ idx + 1 }}</strong></span
                >
                <jmath
                  class="title"
                  style="line-height: 60px;"
                  :data="i.title"
                ></jmath>
              </div>
              <div style="margin-left:20px">
                <div v-for="(iAnswers, idxtwo) in i.answers" :key="idxtwo">
                  <div
                    :style="{
                      color: iAnswers.isCorrect == 2 ? 'green' : '#333'
                    }"
                  >
                    <span>{{ iAnswers.option }}.</span>
                    <jmath
                      class="title"
                      style="line-height: 40px;"
                      :data="iAnswers.text"
                    ></jmath>
                  </div>
                </div>
                <div
                  v-if="i.tSubject == 1 || i.tSubject == 2 || i.tSubject == 3"
                >
                  <div>
                    <span style="color:red">学生答案：</span>
                    <jmath
                      class="title"
                      style="line-height: 50px;"
                      :data="i.stuAnswer"
                    ></jmath>
                  </div>
                  <div>
                    <span style="color:red">批改结果：</span>
                    <span>{{ i.status == 2 ? "正确" : "错误" }}</span>
                  </div>
                </div>
                <div v-else>
                  <div style="margin-bottom:10px">
                    <span style="color:red">学生答案：</span>
                    <el-image
                      v-if="i.stuAnswer && isUrl(i.stuAnswer)"
                      :src="i.stuAnswer"
                      :preview-src-list="previewSrcList(i.stuAnswer)"
                    >
                    </el-image>
                    <jmath
                      v-else-if="!isUrl(i.stuAnswer)"
                      :data="i.stuAnswer"
                    ></jmath>
                    <span v-else>暂无</span>
                  </div>
                  <div>
                    <span style="color:red;">批改结果：</span>
                    <el-image
                      v-if="i.answerRemark"
                      :src="i.answerRemark"
                      :preview-src-list="previewSrcList(i.answerRemark)"
                    >
                    </el-image>
                    <span v-else>暂无</span>
                  </div>
                  <div v-if="i.remark">
                    <span style="color:red;">评语：</span>
                    <span v-if="i.remark">{{ i.remark }}</span>
                    <span v-else>暂无</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="item.sonSubList.length == 0" style="margin-left:20px">
            <div
              v-for="(itemAnswers, indextwo) in item.answers"
              :key="indextwo"
            >
              <div
                :style="{
                  color: itemAnswers.isCorrect == 2 ? 'green' : '#333'
                }"
              >
                <span>{{ itemAnswers.option }}.</span>
                <jmath
                  class="title"
                  style="line-height: 40px;"
                  :data="itemAnswers.text"
                ></jmath>
              </div>
            </div>
            <div
              v-if="
                item.tSubject == 1 || item.tSubject == 2 || item.tSubject == 3
              "
            >
              <div>
                <span style="color:red">学生答案：</span>
                <jmath
                  class="title"
                  style="line-height: 50px;"
                  :data="item.stuAnswer"
                ></jmath>
              </div>
              <div>
                <span style="color:red">批改结果：</span>
                <span>{{ item.status == 2 ? "正确" : "错误" }}</span>
              </div>
            </div>
            <div v-else>
              <div style="margin-bottom:10px">
                <span style="color:red">学生答案：</span>
                <el-image
                  v-if="item.stuAnswer && isUrl(item.stuAnswer)"
                  :src="item.stuAnswer"
                  :preview-src-list="previewSrcList(item.stuAnswer)"
                >
                </el-image>
                <jmath
                  v-else-if="!isUrl(item.stuAnswer)"
                  :data="item.stuAnswer"
                ></jmath>
                <span v-else>暂无</span>
              </div>
              <div>
                <span style="color:red;">批改结果：</span>
                <el-image
                  v-if="item.answerRemark"
                  :src="item.answerRemark"
                  :preview-src-list="previewSrcList(item.answerRemark)"
                >
                </el-image>
                <span v-else>暂无</span>
              </div>
              <div v-if="i.remark">
                <span style="color:red;">评语：</span>
                <span v-if="i.remark">{{ i.remark }}</span>
                <span v-else>暂无</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-button
        type="primary"
        @click="printCheckoutDetail"
        class="printButton"
        icon="el-icon-printer"
        >打印作业</el-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
body {
  background: #eef3f6;
}
.printHomework {
  width: 1200px;
  margin: 10px auto;
  padding: 20px 20px;
  background: #ffffff;
  min-height: 920px;
}
.printButton {
  position: absolute;
  right: 0;
  bottom: 30%;
  .el-icon-printer {
    display: block;
    font-size: 30px;
    margin-bottom: 10px;
  }
}
.el-image-viewer__close {
  color: #ffffff;
}
.el-image {
  width: 100px;
  height: 100px;
}

@media print {
  .el-image {
    width: 350px;
    height: 100%;
  }
  .el-divider {
    display: none;
  }
}
</style>
<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 0cm 1cm;
}
body {
  font-size: 14px;
}
</style>

<script>
import axios from "@/libs/api.request";
import moment from "moment";
import common from "@/utils/common";
import jmath from "@/components/jmath";
// import printJS from 'print-js'
export default {
  data() {
    return {
      printHomewokData: {}
    };
  },
  components: {
    jmath
  },
  mounted() {
    this.printHomewok();
  },
  methods: {
    // 打印作业
    printHomewok() {
      axios
        .request({
          method: "post",
          url: "/tiku/exerciseStu/exerciseInfoStuPC",
          data: {
            exerciseId: this.$route.query.exerciseId,
            uid: this.$store.state.user.userId,
            sUid: this.$route.query.sUid
          }
        })
        .then(res => {
          // let ret = res.data
          this.printHomewokData = res.data.data;
        })
        .catch(() => {});
    },
    printCheckoutDetail() {
      let subOutputRankPrint = document.getElementById("printCons"); // 要打印区域的元素id
      console.log(subOutputRankPrint.innerHTML);
      let newContent = subOutputRankPrint.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      return false;
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
    //格式化图片大图预览
    previewSrcList(item) {
      console.log(item);
      let imgSrc = [];
      if (item) {
        imgSrc.push(item);
      }
      return imgSrc;
    },
    isUrl(str) {
      return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(
        str
      );
    }
  }
};
</script>
