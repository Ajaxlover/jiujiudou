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
          :data="data.correctAnswer | getAnswer"
        ></jd-math>
      </div>
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
      <div
        v-if="data.tSubject != 1 && data.tSubject != 2 && data.tSubject != 3"
        style="margin-top:12px;"
      >
        设置阅卷老师：<el-button
          @click="addTeacher(data)"
          :disabled="data.isAppointReader == 1"
          type="text"
          >添加老师</el-button
        >
        <div class="phone-list">
          <el-tag
            @close="closeTag(data, tag)"
            v-for="(tag, index) in data.readerList"
            :key="index"
            :closable="data.isAppointReader == 0"
          >
            {{ tag.mobile }}
          </el-tag>
        </div>
      </div>
      <div
        v-if="data.tSubject != 1 && data.tSubject != 2 && data.tSubject != 3"
        style="margin-top:12px;"
      >
        阅卷方式：<el-input-number
          style="width:100px"
          size="small"
          :disabled="data.readerList.length == 0"
          v-model="checkNum"
          controls-position="right"
          @change="handleChange"
          :min="1"
          :max="data.readerList.length"
        ></el-input-number>
        <!-- <el-input
          size="small"
          style="width:60px"
          v-model.trim="checkNum"
          oninput="value=value.replace(/[^\d.]/g,'')"
          placeholder=""
        ></el-input> -->
        <el-button
          :disabled="data.readerList.length == 0"
          @click="divideSubject(data)"
          size="small"
          type="primary"
          >确定</el-button
        >
        <span
          >（选择几人，则一份试卷由几人批阅，最终取平均分，添加老师才可输入，且输入人数不能超过阅卷老师人数）</span
        >
      </div>
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
        @setScore="setScore"
        v-for="(item, index) in data.sonSubList"
        :key="index"
        :name="index"
        :type="1"
        @addTeacher="addTeacher(item)"
        :data="sonSubject(index, item)"
      ></TimuSon>
    </div>
  </div>
</template>

<script>
import math from "@/components/jmath";
import TimuSon from "./setCheckTimuSon.vue";

export default {
  name: "timu",
  components: {
    "jd-math": math,
    TimuSon
  },
  props: {
    showSetScore: 0,
    data: {
      type: Object,
      required: true
    },
    type: Number
  },
  data() {
    return {
      checkNum: this.data.readTimes ? this.data.readTimes : 1
    };
  },
  filters: {
    getAnswer(value) {
      if (!value) {
        return "无";
      }
      if (String(value).split("^*").length > 0) {
        return String(value)
          .split("^*")
          .join("或");
      } else {
        return value;
      }
    }
  },
  computed: {
    isUrl() {
      return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(
        this.data.stuAnswer
      );
    }
  },
  methods: {
    closeTag(data, tag) {
      let obj = Object.assign(data, tag);
      this.$emit("closeTag", obj);
    },
    handleChange(value) {
      console.log(value);
    },
    sonSubject(index, item) {
      item.timuNum = index;
      return item;
    },
    setScore(data) {
      this.$emit("setScore", data);
    },
    addTeacher(data) {
      this.$emit("addTeacher", data);
    },
    divideSubject(data) {
      let obj = Object.assign(data, { checkNum: this.checkNum });
      this.$emit("divideSubject", obj);
    }
  }
};
</script>

<style lang="scss" scoped>
.timu {
  .isWrong {
    color: red;
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
  .optionImg img {
    min-width: 70% !important;
  }
}
</style>
