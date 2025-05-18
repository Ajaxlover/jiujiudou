<template>
  <div
    style="color:#333;font-size:15px;font-weight:400;margin-bottom:20px;word-wrap: break-word;"
    class="timu"
  >
    <!-- <span v-if="type != 1" style="margin-right:5px;">{{data.timuNum + 1}} 、 <span v-if="data.pitemId">({{data.score}}分)</span></span> -->
    <span style="margin-right:5px;" v-if="data.timuNum >= 0"
      >{{ data.timuNum + 1 }} 、
      <span v-if="showSubjectType == 1">({{ formatType(data) }})</span
      ><span v-else>({{ data.score }}分)</span></span
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
    <div
      v-if="data.sonSubList && data.sonSubList.length > 0"
      style="margin:20px 0;padding-left:30px"
    >
      <!-- <timu
        v-for="(item, index) in data.sonSubList"
        :key="index"
        :data="sonSubject(index, item)"
      >
      </timu> -->
      <TimuSon
        :showSetScore="showSetScore"
        :showSubjectType="showSubjectType"
        @setScore="setScore"
        v-for="(item, index) in data.sonSubList"
        :key="index"
        :name="index"
        :data="sonSubject(index, item)"
      ></TimuSon>
    </div>
    <div v-if="type == 1" style="margin-top:12px;">
      <div style="margin-bottom:14px;color:">【答案】：{{ getAnswer() }}</div>
      <!-- <div style="margin-top:12px;">
        <div
          v-if="data.stuAnswer"
          :class="{ isWrong: data.status === 3 }"
          style="margin-bottom:14px;"
        >
          <div
            v-if="
              data.tSubject === 1 || data.tSubject === 2 || data.tSubject === 3
            "
          >
            【学生答案】：{{ data.stuAnswer }}
          </div>
          <div v-else-if="isUrl">
            【学生答案】：
            <el-image
              style="width: 300px"
              :preview-src-list="imgList"
              :src="data.stuAnswer"
            >
            </el-image>
          </div>
          <div v-else>【学生答案】：{{ data.stuAnswer }}</div>
        </div>
      </div> -->
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
import TimuSon from "./timuSon";
import common from "@/utils/common";

export default {
  name: "timu",
  components: {
    "jd-math": math,
    TimuSon
  },
  props: {
    showSubjectType: 0,
    showSetScore: 0,
    data: {
      type: Object,
      required: true
    },
    type: Number
  },
  filters: {
    // getAnswer(value) {
    //   if (!value) {
    //     return "无";
    //   }
    //   if (String(value).split("^*").length > 0) {
    //     return String(value)
    //       .split("^*")
    //       .join("或");
    //   } else {
    //     return value;
    //   }
    // }
  },
  computed: {
    isUrl() {
      return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(
        this.data.stuAnswer
      );
    }
  },
  methods: {
    formatType(row) {
      return common.typeFormat(row.tSubject);
    },
    sonSubject(index, item) {
      item.timuNum = index;
      return item;
    },
    setScore(data) {
      this.$emit("setScore", data);
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

<style lang="scss">
.timu {
  .isWrong {
    color: red;
  }
  .optionImg img {
    min-width: 70% !important;
  }
}
</style>
