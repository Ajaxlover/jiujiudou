<template>
  <div style="color:#333;font-size:15px;font-weight:400;margin-bottom:20px">
    <div style="color:#999;font-size:12px;margin-top:2px;margin:15px 0">
      <span v-if="index" style="margin-right:15px;">#{{ index }}</span>
      <span>题型：{{ formatType() }}</span>
      <span style="margin-left:15px;">难度：{{ formatDiff() }}</span>
      <span style="margin-left:15px;"
        >知识点：{{ data.learnPort ? data.learnPort : "无" }}</span
      >
      <span style="margin-left:15px">标签：{{ data.uniqueId }}</span>
      <el-button
        type="text"
        style="margin-left:50px"
        @click="viewSimilarSubject"
        v-if="data.isExistSimilarSubject"
        >查看相似题目</el-button
      >
    </div>
    <jd-math :data="data.title"></jd-math>
    <div
      v-for="(option, index) in data.answerList"
      :key="index"
      style="display:flex;margin:14px 0;font-size:14px"
    >
      <span style="margin-right:10px;line-height:20px">{{
        option.aOption ? option.aOption : option.sbOption
      }}</span>
      <jd-math
        :data="option.aText ? option.aText : option.optionText"
        class="optionImg"
      ></jd-math>
    </div>
    <div
      @click="viewAnswer"
      v-if="!answerShow"
      style="color:#2BA1F4;cursor: pointer;"
    >
      查看答案与解析
    </div>
    <div>
      <el-collapse-transition>
        <div v-if="answerShow">
          <div style="margin-bottom:14px;color:">
            【答案】：{{ getAnswer() }}
          </div>
          <div>
            【解析】：<jd-math
              style="font-size:14px"
              :data="data.analyse"
            ></jd-math>
          </div>
          <div
            @click="viewAnswer1"
            v-if="answerShow"
            style="color:#2BA1F4;cursor: pointer;margin-top:10px"
          >
            收起答案与解析
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div
      v-if="data.sonSubList && data.sonSubList.length > 0"
      style="margin:20px 0;padding-left:30px"
    >
      <importPreview
        v-for="(item, index) in data.sonSubList"
        :key="index"
        :data="item"
        :index="index + 1"
      ></importPreview>
    </div>
    <div
      v-if="data.belongList && data.belongList.length > 0"
      style="margin:20px 0;padding-left:30px"
    >
      <importPreview
        v-for="(item, index) in data.belongList"
        :key="index"
        :data="item"
        :index="index + 1"
      ></importPreview>
    </div>
    <el-dialog
      :visible.sync="similarShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="700px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>相似题目</div>
        </div>
      </template>
      <div style="text-align:center">
        <el-radio-group v-model="subjectId" @change="changeSubjectId">
          <el-radio-button
            :label="item"
            v-for="(item, index) in similarSubjectAarry"
            :key="index"
            >{{ index + 1 }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <el-scrollbar style="height:400px;">
        <importPreview
          :key="index"
          :data="similarData"
          :index="index + 1"
        ></importPreview>
      </el-scrollbar>

      <span slot="footer">
        <el-button size="small" type="primary" @click="similarShow = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import common from "@/utils/common";
import math from "@/components/jmath";
import axios from "@/libs/api.request";
export default {
  name: "importPreview",
  components: {
    "jd-math": math
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    index: Number
  },
  data() {
    return {
      answerShow: false,
      similarShow: false,
      subjectId: 0,
      similarData: {},
      similarSubjectAarry: []
    };
  },
  methods: {
    // 类型
    formatType() {
      return common.typeFormat(this.data.tSubject);
    },
    // 难度
    formatDiff() {
      return common.diffFormat(this.data.difficultyLevel);
    },
    getAnswer() {
      let answer = "无";
      if (this.data.answer) {
        answer = String(this.data.answer)
          .split("^*")
          .join("或");
      } else {
        let list = [];
        if (this.data.answerList) {
          this.data.answerList.forEach(element => {
            if (element.isCorrect == 2) {
              list.push(element.aOption);
            }
          });
          if (list.length) {
            answer = list.join(",");
          }
        }
      }
      return answer;
    },
    viewAnswer() {
      this.answerShow = true;
    },
    viewAnswer1() {
      this.answerShow = false;
    },
    viewSimilarSubject() {
      this.similarSubjectAarry = this.data.similarSubjectId.split(",");
      this.subjectId = this.similarSubjectAarry[0];
      this.changeSubjectId();
      this.similarShow = true;
    },
    changeSubjectId() {
      axios
        .request({
          method: "post",
          url: "/tiku/v4/subjectBank/selectById",
          data: {
            sbId: this.subjectId
          }
        })
        .then(res => {
          this.similarData = res.data.data;
        });
    }
  }
};
</script>

<style lang="scss">
.optionImg img {
  width: 70% !important;
}
</style>
