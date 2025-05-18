<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    :direction="direction"
    :before-close="handleClose"
    :modal="false"
    size="30%"
  >
    <div class="main">
      <div class="main-title">
        <span>题型：{{ formatType() }}</span>
        <span>分值：{{ data.score }}分</span>
        <!-- <el-button style="color:red" type="text">我要纠错</el-button> -->
        <div>
          <el-popover
            placement="bottom"
            trigger="click"
            title="错误类型"
            v-model="reportPover1"
            width="400"
          >
            <el-checkbox-group
              v-model="reportType1"
              style="margin-top:20px;color:#333;font-size:13px;"
            >
              <el-checkbox style="margin-bottom:10px" label="0"
                >题干错误</el-checkbox
              >
              <el-checkbox style="margin-bottom:10px" label="3"
                >题型错误</el-checkbox
              >
              <el-checkbox style="margin-bottom:10px" label="1"
                >答案错误</el-checkbox
              >
              <el-checkbox style="margin-bottom:10px" label="2"
                >解析错误</el-checkbox
              >
              <el-checkbox style="margin-bottom:10px" label="4"
                >知识点错误</el-checkbox
              >
              <el-checkbox style="margin-bottom:10px" label="5"
                >其他问题</el-checkbox
              >
            </el-checkbox-group>
            <textarea
              placeholder="请输入错误描述，不大于200字"
              v-model="reportDes1"
              maxlength="200"
              show-word-limit
              style="margin-top:10px;width:100%;border-radius:5px;border-color:#ccc;height:100px;padding:5px 15px;"
            ></textarea>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="reportPover1 = false"
                >取消</el-button
              >
              <el-button type="primary" size="mini" @click="doSureToReport"
                >确定</el-button
              >
            </div>
            <!-- <el-button slot="reference" type="text" style="color:red;"
              >我要纠错</el-button
            > -->
          </el-popover>
        </div>
      </div>
      <div class="main-content">
        <div class="main-content-title">
          <jd-math :data="data.title"></jd-math>
        </div>
        <div v-if="data.analyse">
          【解析】：<jd-math
            style="font-size:14px"
            :data="data.analyse"
          ></jd-math>
        </div>
        <div v-if="data.rightAnswer">
          【答案】：<jd-math
            style="font-size:14px"
            :data="data.rightAnswer"
          ></jd-math>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import common from "@/utils/common";
import { formatYMD } from "@/utils/datetime";
import math from "@/components/jmath";
import axios from "@/libs/api.request";

export default {
  name: "showAnswerDrawer",
  components: {
    "jd-math": math
  },
  props: {
    drawer: Boolean,
    direction: String,
    title: String,
    data: Object
  },
  data() {
    return {
      reportPover1: false,
      reportType1: [],
      reportDes1: ""
    };
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("close");
    },
    // 类型
    formatType() {
      return common.typeFormat(this.data.tSubject);
    },
    // 难度
    formatDiff() {
      return common.diffFormat(this.data.difficultyLevel);
    },
    formatDate() {
      if (this.data.getTime) {
        return formatYMD(this.data.getTime);
      }
      return formatYMD(this.data.createTime);
    },
    // 提交纠错
    doSureToReport() {
      if (this.reportType1.length == 0) {
        this.$message({
          message: "请选择错误类型",
          type: "warning"
        });
        return;
      }
      axios
        .request({
          method: "post",
          url: "/v1/subjectBank/feedbackTKExercise",
          data: {
            type: 12,
            content: `${this.reportDes1}(${this.data.subjectId})`, // 纠错描述
            sbId: this.data.subjectId, // 纠错题目id
            subTypes: this.reportType1.join(",")
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.reportPover1 = false;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "服务器异常",
            type: "warning"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  border-top: 1px solid rgb(211, 220, 230);
  padding: 20px;
  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .main-content {
    .main-content-title {
      margin-bottom: 10px;
    }
  }
}
/deep/ #el-drawer__title {
  margin-bottom: 15px;
}
</style>
