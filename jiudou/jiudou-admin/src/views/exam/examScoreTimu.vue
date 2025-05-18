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
            <img style="width:300px;" :src="data.stuAnswer" alt="" />
            <img
              v-if="data.answerRemark"
              style="width:300px;"
              :src="data.answerRemark"
              alt=""
            />
            <!-- <el-image
              style="width: 300px"
              :preview-src-list="imgList"
              :src="data.stuAnswer"
            >
            </el-image> -->
          </div>
          <div v-else>【学生答案】：{{ data.stuAnswer }}</div>
        </div>
        <!-- <div v-if="data.answerRemark" style="margin-bottom:14px;color:">
          【批阅结果】：<img
            style="width:300px;"
            :src="data.answerRemark"
            alt=""
          />
        </div> -->
        <!-- <div v-if="data.stuScore" style="margin-bottom:14px;color:">
          【批阅结果】：{{ data.stuScore }}分
        </div>
        <div v-if="data.stuScore === 0" style="margin-bottom:14px;color:">
          【批阅结果】：0分
        </div> -->
      </div>
      <div class="isWrong" v-if="!data.stuAnswer && data.tSubject != 11">
        【学生答案】：未答
      </div>
      <div v-if="data.correctAnswer" style="margin-bottom:14px;color:">
        【答案】：<jd-math
          style="font-size:14px"
          :data="data.correctAnswer | getAnswer"
        ></jd-math>
      </div>
      <div>
        【解析】：<jd-math
          style="font-size:14px"
          :data="data.analyse"
        ></jd-math>
      </div>
      <div
        v-if="data.readerList && data.readerList.length > 0"
        style="margin-top:12px;color:rgb(57, 188, 249)"
      >
        <div
          v-for="(item, idx) in data.readerList"
          @click="toResult(data, item)"
          :key="idx"
        >
          <span>阅卷老师：{{ item.mobile }}</span>
          <span v-if="item.status == 1">批阅分数：{{ item.score }}</span>
          <span style="color:red" v-else>未批阅</span>
        </div>
      </div>
    </div>
    <div
      v-if="data.sonSubList && data.sonSubList.length > 0"
      style="margin:20px 0;padding-left:30px"
    >
      <div
        v-for="(data, idx) in data.sonSubList"
        :key="idx"
        style="color:#333;font-size:15px;font-weight:400;margin-bottom:20px;word-wrap: break-word;background-color:#f7f7f7"
        class="timuSon"
        @mouseenter="handleTimuMouseenter($event)"
        @mouseleave="handleTimuMouseleave($event)"
      >
        <div class="timuOpt">
          <div v-if="data.tSubject == 11" class="option-box-t11">
            <el-form>
              <el-form-item label="得分">
                <!-- <el-input
                          style="width:60px"
                          placeholder="人数"
                          size="small"
                          v-model="form.stuNum"
                          disabled
                        ></el-input> -->
                <span>{{ data.stuScore }}</span>
              </el-form-item>
            </el-form>
          </div>
          <div
            v-else-if="data.tSubject == 4 || data.tSubject == 5"
            class="option-box-t45"
          >
            <el-form>
              <el-form-item label="">
                <el-button type="plain" @click="toCheck(data)" size="small"
                  >批阅</el-button
                >
              </el-form-item>
              <el-form-item label="得分">
                <span>{{ data.stuScore }}</span>
              </el-form-item>
            </el-form>
          </div>
          <div v-else class="option-box">
            <el-form @submit.native.prevent>
              <el-form-item label="判题">
                <div class="opt-btn">
                  <el-button
                    type="plain"
                    icon="el-icon-check"
                    :class="[{ 'right-active': data.status == 2 }]"
                    @click="doRight(data, 1)"
                    size="small"
                  ></el-button>
                  <el-button
                    @click="doRight(data, 0)"
                    type="plain"
                    icon="el-icon-close"
                    :class="[{ 'wrong-active': data.status != 2 }]"
                    size="small"
                  ></el-button>
                </div>
              </el-form-item>
              <!-- @input="handleInput"
                  v-model="i.settingScore" -->
              <el-form-item label="得分">
                <!-- <el-input
                  style="width:60px"
                  placeholder="得分"
                  @input="handleInput"
                  v-model="data.settingScore"
                  size="small"
                ></el-input> -->
                <span>{{ data.stuScore }}</span>
              </el-form-item>
              <el-form-item label="满分">
                <!-- <el-input
                          style="width:60px"
                          placeholder="人数"
                          size="small"
                          v-model="form.stuNum"
                          disabled
                        ></el-input> -->
                <span>{{ data.score }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span style="margin-right:5px;" v-if="idx >= 0"
          >{{ idx + 1 }} 、 <span>({{ data.score }}分)</span></span
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
          <div
            :class="{ isWrong: data.status === 3 }"
            style="margin-bottom:14px;"
          >
            <div
              v-if="
                data.tSubject === 1 ||
                  data.tSubject === 2 ||
                  data.tSubject === 3
              "
            >
              【学生答案】：{{ data.stuAnswer ? data.stuAnswer : "未答" }}
            </div>
            <!-- :preview-src-list="srcList" -->
            <div v-else-if="isUrlSon(data)">
              【学生答案】：
              <img style="width:300px;" :src="data.stuAnswer" alt="" />
              <img
                v-if="data.answerRemark"
                style="width:300px;"
                :src="data.answerRemark"
                alt=""
              />
              <!-- <el-image style="width: 300px" :src="data.stuAnswer"> </el-image> -->
            </div>
            <div v-else>
              【学生答案】：
              <jd-math style="font-size:14px" :data="data.stuAnswer"></jd-math>
            </div>
          </div>
          <!-- <div v-if="data.answerRemark" style="margin-bottom:14px;color:">
            【批阅结果】：<img
              style="width:300px;"
              :src="data.answerRemark"
              alt=""
            />
          </div> -->
          <div v-if="data.correctAnswer" style="margin-bottom:14px;color:">
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
          <!-- <div
            v-if="data.readerList && data.readerList.length > 0"
            style="margin-top:12px;color:rgb(57, 188, 249)"
          >
            <div v-for="(item, idx) in data.readerList" :key="idx">
              阅卷老师：{{ item.mobile }} 批阅分数：{{ item.score }}
            </div>
          </div> -->
        </div>
      </div>

      <!-- <timu
        v-for="(item, index) in data.sonSubList"
        :key="index"
        :data="sonSubject(index, item)"
      >
      </timu> -->
      <!-- <TimuSon
        v-for="(item, index) in data.sonSubList"
        :key="index"
        :name="index"
        :data="sonSubject(index, item)"
      ></TimuSon> -->
    </div>
  </div>
</template>

<script>
import math from "@/components/jmath";
import axios from "@/libs/api.request";

// import TimuSon from "./timuSon";

export default {
  name: "timu",
  components: {
    "jd-math": math
    // TimuSon
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    type: Number,
    examResultId: Number
  },
  data() {
    return {
      settingScore: "0"
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
    isUrlSon(val) {
      return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(
        val.stuAnswer
      );
    },
    toResult(data, item) {
      let obj = Object.assign(data, item);
      this.$emit("toResult", obj);
    },
    toCheck(data) {
      this.$emit("toCheck", data);
    },
    doRight(i, flag) {
      let arr = [
        {
          bankId: i.bankId,
          parentId: i.parentId,
          score: flag === 1 ? i.score : 0
        }
      ];
      axios
        .request({
          method: "post",
          url: "/exam/exam/result/review",
          data: {
            reviewListJson: JSON.stringify(arr),
            examResultId: this.examResultId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.settingScore = "0";
            this.$emit("reviewSuccess");
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    sonSubject(index, item) {
      item.timuNum = index;
      return item;
    },
    handleInput(val) {
      console.log("input", val);
      this.settingScore = val || "0";
    },
    handleTimuMouseenter(e) {
      e.target.firstChild.style.display = "block";
    },
    handleTimuMouseleave(e) {
      e.target.firstChild.style.display = "none";
    }
  }
};
</script>

<style lang="scss" scoped>
.timu {
  .isWrong {
    color: red;
  }
  .optionImg img {
    min-width: 70% !important;
  }
}

.timuSon {
  position: relative;
  .isWrong {
    color: red;
  }
  .optionImg img {
    min-width: 70% !important;
  }
  .timuOpt {
    position: absolute;
    top: 0;
    right: 0;
    // width: 100%;
    // height: 100%;
    border-radius: 5px;
    padding: 20px 20px;
    display: none;
    .option-box-t11 {
      float: right;
      width: 120px;
      height: 40px;
      background-color: #f5f5f5;
      padding: 5px;
    }
    .option-box-t45 {
      float: right;
      width: 100px;
      height: 70px;
      background-color: #f5f5f5;
      padding: 5px;
      .el-form {
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
    .option-box {
      float: right;
      width: 120px;
      height: 100px;
      background-color: #f5f5f5;
      padding: 5px;
      .el-form {
        .el-form-item {
          margin-bottom: 0;
        }
      }
      .opt-btn {
        display: flex;
        .el-button {
          width: 30px;
          height: 30px;
        }
        .right-active {
          background-color: #67c23a;
          color: #fff;
        }
        .wrong-active {
          background-color: red;
          color: #fff;
        }
        .el-button--small {
          padding: 0 5px;
        }
      }
    }
    // .el-button {
    //   float: right;
    //   margin-left: 5px;
    //   border-color: #2ba1f4;
    // }
  }
}
</style>
