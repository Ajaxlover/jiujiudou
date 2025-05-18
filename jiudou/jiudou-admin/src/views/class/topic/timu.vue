<template>
  <div
    style="color:#333;font-size:15px;font-weight:400;margin-bottom:20px;word-wrap: break-word;"
    class="timu"
  >
    <!-- <span v-if="type != 1" style="margin-right:5px;">{{data.timuNum + 1}} 、 <span v-if="data.pitemId">({{data.score}}分)</span></span> -->
    <span style="margin-right:5px;"
      >{{ tNum + 1 }} 、 <span>({{ data.score }}分)</span></span
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
      <div v-if="data.rightAnswer" style="margin-bottom:14px;">
        【答案】：<jd-math
          style="font-size:14px"
          :data="data.rightAnswer"
        ></jd-math>
      </div>
      <div v-if="data.analyse">
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
        <!-- :preview-src-list="srcList" -->
        <div v-else-if="isUrl">
          【学生答案】：
          <!-- <img style="width:300px;" :src="data.stuAnswer" alt="" /> -->
          <el-image
            style="width: 300px"
            :preview-src-list="imgList"
            :src="data.stuAnswer"
          >
          </el-image>
        </div>
        <div v-else>【学生答案】：{{ data.stuAnswer }}</div>
      </div>
      <div v-if="data.stuScore" style="margin-bottom:14px;color:">
        【批阅结果】：{{ data.stuScore }}分
      </div>
      <div v-if="data.stuScore === 0" style="margin-bottom:14px;color:">
        【批阅结果】：0分
      </div>
      <div
        v-if="data.tSubject !== 11 && data.appealStatus >= 1"
        style="margin-bottom:14px;color:"
      >
        【申诉内容】：{{ data.stuAppealContent
        }}<el-image style="width: 300px" :src="data.stuAppealPicUrl"></el-image>
      </div>
    </div>
    <!-- <bintu :timuType="true"></bintu> -->
    <div
      v-if="data.sonSubList && data.sonSubList.length > 0"
      style="margin:20px 0;padding-left:30px"
    >
      <TimuSon
        @teaReply="teaReply"
        :type="type"
        v-for="(item, index) in data.sonSubList"
        :key="index"
        :data="sonSubject(index, item)"
      ></TimuSon>
    </div>
  </div>
</template>

<script>
import math from "@/components/jmath";
import TimuSon from "./timuSon";

export default {
  name: "timu",
  components: {
    "jd-math": math,
    TimuSon
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    bingTuData: Array,
    type: Number,
    tNum: Number,
    imgList: Array
  },
  mounted() {},
  computed: {
    isUrl() {
      return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(
        this.data.stuAnswer
      );
    }
  },
  methods: {
    teaReply(data) {
      this.$emit("teaReply", data);
    },
    sonSubject(index, item) {
      item.timuNum = index;
      return item;
    }
    // isUrl(str) {
    //   return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(
    //     str
    //   );
    // }
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
