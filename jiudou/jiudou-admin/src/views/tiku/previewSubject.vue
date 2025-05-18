<template>
  <div style="color:#333;font-size:15px;font-weight:400" class="previewSubject">
    <div v-if="data.parentId == 0">
      <span>{{ formatType() }}</span>
      <span style="color:#999;font-size:12px;float:right;margin-top:2px;">
        <span style="margin-right:10px"
          >ID：{{ data.id ? data.id : data.sbId }}</span
        >
        <span style="margin-right:10px">标签：{{ data.uniqueId }}</span>
        <!-- <span>日期：{{ formatDate() }}</span> -->
      </span>
    </div>
    <div
      v-if="data.parentId == 0"
      style="margin-top:14px;margin-bottom:6px;color:#999;font-size:14px"
    >
      <span style="margin-right:15px;">难度：{{ formatDiff() }}</span>
      <!-- <span>{{data.learnPort?data.learnPort:'无'}}</span> -->
      知识点：<span v-html="data.learnPort ? data.learnPort : '无'"></span>
    </div>
    <jd-math :data="data.title"></jd-math>
    <div
      v-for="(option, index) in data.answerList"
      :key="index"
      style="display:flex;margin:14px 0;font-size:14px"
    >
      <span style="margin-right:10px;line-height:20px">{{
        option.aOption
      }}</span>
      <jd-math :data="option.aText" class="optionImg"></jd-math>
    </div>
    <div style="margin-bottom:14px;color:" v-if="data.answer">
      【答案】：<jd-math
        style="font-size:14px"
        :data="getAnswer()"
        v-if="data.answer"
      >
      </jd-math>
    </div>
    <div style="margin-bottom:14px;color:" v-else>
      【答案】：{{ getAnswer() }}
    </div>
    <div>
      【解析】：<jd-math
        style="font-size:14px"
        :data="data.analyse"
        v-if="data.analyse"
      ></jd-math>
    </div>
    <div
      v-if="data.sonSubList && data.sonSubList.length > 0"
      style="margin:20px 0;padding-left:30px"
    >
      <preview
        v-for="(item, index) in data.sonSubList"
        :key="index"
        :data="item"
      ></preview>
    </div>
  </div>
</template>

<style lang="scss">
.previewSubject {
  .optionImg img {
    width: 70% !important;
  }
}
</style>

<script>
import common from "@/utils/common";
import { formatYMD } from "@/utils/datetime";
import math from "@/components/jmath";
export default {
  name: "preview",
  props: {
    data: Object
  },
  components: {
    "jd-math": math
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
    formatDate() {
      if (this.data.getTime) {
        return formatYMD(this.data.getTime);
      }
      return formatYMD(this.data.createTime);
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
    }
  }
};
</script>
