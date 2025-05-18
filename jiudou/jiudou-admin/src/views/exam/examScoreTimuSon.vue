<template>
  <div
    style="color:#333;font-size:15px;font-weight:400;margin-bottom:20px;word-wrap: break-word;"
    class="timu"
  >
    <!-- <span v-if="type != 1" style="margin-right:5px;">{{data.timuNum + 1}} 、 <span v-if="data.pitemId">({{data.score}}分)</span></span> -->
    <span style="margin-right:5px;" v-if="data.timuNum >= 0"
      >{{ data.timuNum + 1 }} 、 <span>({{ data.score }}分)</span></span
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
    <!-- <el-button
      size="mini"
      :ref="data.bankId"
      :id="data.bankId"
      @click="del(data)"
      style="border-color: #2ba1f4;"
      type="plain"
      >删除</el-button
    > -->
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
    name: Number
  },
  mounted() {
    // console.log(this.$refs[this.data.parentId]);
    // console.log(document.getElementById("46816"));
    // this.del(this.data);
    // console.log(this.bus);
  },
  methods: {
    del() {
      console.log("点击小题删除");
      // document.getElementById(`${data.bankId}`).onclick = () => {
      //   console.log("11111");
      // };
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
