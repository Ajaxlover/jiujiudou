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
    <jd-math @click="del" :data="data.title"></jd-math>
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
        【答案】：<jd-math
          style="font-size:14px"
          :data="data.correctAnswer"
        ></jd-math>
      </div>
      <div>
        【解析】：<jd-math
          style="font-size:14px"
          :data="data.analyse"
        ></jd-math>
      </div>
    </div>
    <!-- <div style="margin-top:12px;">
      设置阅卷老师：<el-button @click="addTeacher(data)" type="text"
        >添加老师</el-button
      >
      <div class="phone-list">
        <el-tag v-for="(tag, index) in 10" :key="index" closable>
          18711685400
        </el-tag>
      </div>
    </div>
    <div style="margin-top:12px;">
      阅卷方式：<el-input-number
        style="width:100px"
        size="small"
        v-model="checkNum"
        controls-position="right"
        @change="handleCheckNumChange"
        :min="1"
        :max="10"
      ></el-input-number>
      <el-button size="small" type="primary">确定</el-button>
    </div> -->
    <div class="set-score">
      <div
        v-if="showSetScore == 1"
        style="display:flex;flex-direction:column;justify-content:space-between;
        height:100%"
      >
        <el-button
          size="mini"
          @click="del(data)"
          style="border-color: #2ba1f4;"
          type="plain"
          >设置分值</el-button
        >
        <!-- @change="handleChange" -->
        <el-input-number
          :controls="false"
          size="small"
          placeholder="分值"
          style="width:100px;height:32px"
          v-model="data.originScore"
          @input="onInput"
          :min="0"
        ></el-input-number>
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
      timuSonScore: "0",
      checkNum: 1
    };
  },
  mounted() {
    // console.log(this.$refs[this.data.parentId]);
    // console.log(document.getElementById("46816"));
    // this.del(this.data);
    // console.log(this.bus);
  },
  methods: {
    addTeacher(data) {
      this.$emit("addTeacher", data);
    },
    handleCheckNumChange(value) {
      console.log(value);
    },
    onInput(val) {
      console.log("i", val);
      this.timuSonScore = val || "0";
    },
    handleTimuMouseenter(e) {
      e.target.lastChild.style.display = "block";
      e.target.lastChild.style.backgroundColor = "#fff";
      // e.target.style.boxShadow = "0 2px 12px 0 rgba(0, 0, 0, 0.1)";
    },
    handleTimuMouseleave(e) {
      // e.target.style.boxShadow = "none";
      e.target.lastChild.style.display = "none";
    },
    handleChange(val) {
      console.log(val);
    },
    del(data) {
      console.log("设置分值");
      this.$emit("setScore", {
        data,
        score: this.timuSonScore
      });
      // document.getElementById(`${data.bankId}`).onclick = () => {
      //   console.log("11111");
      // };
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
  .phone-list {
    width: 100%;
    // background-color: red;
    // padding-left: 20px;
    margin-bottom: 10px;
    .el-tag {
      margin-right: 10px;
    }
  }
  .set-score {
    background-color: #f5f5f5;
    width: 100px;
    height: 70px;
    display: none;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
