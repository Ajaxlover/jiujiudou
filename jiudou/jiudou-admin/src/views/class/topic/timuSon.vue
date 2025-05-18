<template>
  <div
    style="color:#333;font-size:15px;font-weight:400;margin-bottom:20px;word-wrap: break-word;"
    @mouseenter="handleTimuMouseenter($event)"
    @mouseleave="handleTimuMouseleave($event)"
    class="timu"
  >
    <!-- <span v-if="type != 1" style="margin-right:5px;">{{data.timuNum + 1}} 、 <span v-if="data.pitemId">({{data.score}}分)</span></span> -->
    <span style="margin-right:5px;" v-if="data.timuNum >= 0"
      >{{ data.timuNum + 1 }} 、 <span>({{ data.score }}分)</span></span
    >
    <jd-math :data="data.title"></jd-math>
    <div
      v-for="(option, index) in data.answers"
      :key="index"
      style="display:flex;margin:14px 0 14px 30px;font-size:14px"
    >
      <span style="margin-right:10px;line-height:20px">{{
        option.option
      }}</span>
      <jd-math :data="option.text" class="optionImg"></jd-math>
    </div>
    <div v-if="type == 1" style="margin-top:12px;">
      <div style="margin-bottom:14px;color:">
        【答案】：<jd-math
          style="font-size:14px"
          :data="data.rightAnswer"
        ></jd-math>
      </div>
      <div>
        【解析】：<jd-math
          style="font-size:14px"
          :data="data.analyse"
        ></jd-math>
      </div>
    </div>
    <div style="margin-top:12px;">
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
    </div>
    <div v-if="data.appealStatus >= 1" style="margin-bottom:14px;color:">
      【申诉内容】：{{ data.stuAppealContent
      }}<el-image
        v-if="data.stuAppealPicUrl"
        style="width: 300px"
        :src="data.stuAppealPicUrl"
      ></el-image>
    </div>
    <div class="set-score">
      <div
        style="display:flex;flex-direction:column;justify-content:space-between;
        height:100%"
      >
        <el-button
          v-if="
            data.tSubject !== 1 &&
              data.tSubject !== 2 &&
              data.tSubject !== 3 &&
              data.appealStatus >= 1
          "
          size="mini"
          @click="del(data)"
          style="border-color: #2ba1f4;"
          type="plain"
          >回复申诉</el-button
        >
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
    type: Number,
    name: Number,
    showSetScore: 0
  },
  data() {
    return {
      num: 1,
      timuSonScore: "0"
    };
  },
  mounted() {
    // console.log(this.$refs[this.data.parentId]);
    // console.log(document.getElementById("46816"));
    // this.del(this.data);
    // console.log(this.bus);
  },
  computed: {
    isUrl() {
      return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(
        this.data.stuAnswer
      );
    }
  },
  methods: {
    onInput(val) {
      console.log("i", val);
      this.timuSonScore = val || "0";
    },
    handleTimuMouseenter(e) {
      e.target.lastChild.style.display = "block";
      e.target.style.boxShadow = "0 2px 12px 0 rgba(0, 0, 0, 0.1)";

      e.target.lastChild.style.backgroundColor = "#fff";
    },
    handleTimuMouseleave(e) {
      e.target.style.boxShadow = "none";
      e.target.lastChild.style.display = "none";
    },
    handleChange(val) {
      console.log(val);
    },
    del(data) {
      console.log("hahh");
      this.$emit("teaReply", data);
    }
  }
};
</script>

<style lang="scss" scoped>
.timu {
  position: relative;
  // background-color: red;
  .optionImg img {
    min-width: 70% !important;
  }
  .set-score {
    // background-color: #f5f5f5;
    width: 100px;
    height: 70px;
    display: none;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
