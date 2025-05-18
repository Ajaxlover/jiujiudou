<template>
  <div
    style="color:#333;font-size:15px;font-weight:400;margin-bottom:20px;word-wrap: break-word;"
    class="timu"
  >
    <!-- <span v-if="type != 1" style="margin-right:5px;">{{data.timuNum + 1}} 、 <span v-if="data.pitemId">({{data.score}}分)</span></span> -->
    <span style="margin-right:5px;" v-if="data.timuNum >= 0"
      >{{ data.timuNum + 1 }} 、
      <span v-if="data.subjectId">({{ data.score }}分)</span></span
    >
    <jd-math :data="data.title"></jd-math>
    <div
      v-for="(option, index) in data.answerList"
      :key="index"
      style="display:flex;margin:14px 0 14px 30px;font-size:14px"
    >
      <span style="margin-right:10px;line-height:20px">{{
        option.aOption
      }}</span>
      <jd-math :data="option.aText" class="optionImg"></jd-math>
    </div>
    <div v-if="type == 1" style="margin-top:12px;">
      <div style="margin-bottom:14px;color:">
        【答案】：<jd-math style="font-size:14px" :data="getAnswer()"></jd-math>
      </div>
      <div>
        【解析】：<jd-math
          style="font-size:14px"
          :data="data.analyse"
        ></jd-math>
      </div>
    </div>
  </div>
</template>

<script>
import math from "@/components/jmath";

export default {
  name: "timuSon",
  components: {
    "jd-math": math
  },
  // inject: ["load"],
  props: {
    data: {
      type: Object,
      required: true
    },
    type: Number
  },
  mounted() {},
  methods: {
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

<style lang="scss">
.timu {
  .optionImg img {
    min-width: 70% !important;
  }
}
</style>
