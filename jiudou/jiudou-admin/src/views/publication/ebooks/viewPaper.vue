<template>
  <el-container>
    <el-main class="timuBox">
      <!-- <img
        src="@/assets/images/paperInfoImg.png"
        alt=""
        class="paperInfoImg"
        v-if="loadWordForm.radio3 == 1"
      /> -->
      <div class="paperName">
        <!-- <div :title="examInfo.examName">
          {{ examInfo.examName }}
        </div> -->
      </div>
      <div style="text-align:center;font-size:12px;color:#666666;">
        <!-- （满分{{
          Number.isInteger(timuTotalScore)
            ? Number(timuTotalScore)
            : Number(timuTotalScore).toFixed(2)
        }}分） -->
      </div>
      <ul class="timuList">
        <li v-for="item in timuListData" :key="item.index">
          <timu :data="item" :showSubjectType="1" :type="1"></timu>
        </li>
      </ul>
      <div class="paperEmpty" v-if="!(timuListData.length > 0)">
        <img src="@/assets/images/empty.png" alt="" />
        <p>暂无题目</p>
        <!-- <el-button type="primary" @click="handleAddTimu">添加试题</el-button> -->
      </div>
      <el-backtop target=".timuBox"></el-backtop>
    </el-main>
  </el-container>
</template>

<script>
// import axios from "@/libs/api.request";
import timu from "./timu.vue";
import common from "@/utils/common";

export default {
  name: "viewPaper",
  props: {
    timuTotalScore: Number,
    timuListData: {
      type: Array,
      required: true
    },
    examInfo: Object
  },
  components: {
    timu
  },
  data() {
    return {};
  },
  methods: {
    //题型
    formatType(type) {
      return common.typeFormat(type);
    },
    //小写转换为大写
    convert(num) {
      var nums = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
      var unit = [
        "",
        "十",
        "百",
        "千",
        "万",
        "十",
        "百",
        "千",
        "亿",
        "十",
        "百",
        "千",
        "万亿"
      ];
      var result = "";
      for (var i = 0; i < num.toString().length; i++) {
        var c = num.toString()[i];
        if (c != 0) {
          result += nums[c] + unit[num.toString().length - i - 1];
        } else {
          result += nums[c];
        }
      }
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  // overflow: auto;
  .el-main {
    background: #ffffff;
    border-radius: 4px;
    height: 100%;
    overflow-y: auto;
    // padding: 13px 13px 13px 50px;
    position: relative;
    .paperInfoImg {
      position: absolute;
      top: 30px;
      left: 10px;
      height: 700px;
      width: 40px;
    }
    .paperName {
      font-size: 24px;
      color: #000000;
      text-align: center;
      margin-bottom: 15px;
      i {
        color: #2ba1f4;
        font-size: 16px;
        cursor: pointer;
      }
    }
    .paperNumTableBox {
      text-align: center;
      font-size: 12px;
      margin-top: 20px;
      .paperNumTable {
        overflow: hidden;
        margin: 0 auto;
        display: inline-block;
        .firstDiv {
          float: left;
          div {
            width: 60px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border: 1px solid #333333;
            border-right: none;
          }
          div:first-child {
            border-bottom: none;
          }
        }
        .firstDiv:last-child {
          div {
            border-right: 1px solid #333333;
          }
        }
      }
    }
    .papaerSimpleInfo {
      text-align: center;
      font-size: 18px;
      margin-bottom: 15px;
      margin-top: 20px;
      span {
        display: inline-block;
        width: 120px;
        border-bottom: 1px solid #8f8f8f;
        margin-right: 10px;
      }
    }
    .caution {
      font-size: 12px;
      color: #999999;
      margin: 20px 0 0 20px;
    }
    .timuList {
      list-style: none;
      padding-left: 0;
      margin-left: 20px;
      li {
        margin-bottom: 20px;
        .timuType {
          font-size: 16px;
          color: #222222;
          font-weight: 600;
        }
      }
      ul {
        list-style: none;
        padding-left: 10px;
        padding-right: 10px;
        li {
          margin-top: 10px;
          position: relative;
          padding: 20px;
          cursor: pointer;
          margin-bottom: 0;
          .timuBtn {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            padding: 20px 20px;
            display: none;
            .el-button {
              float: right;
              margin-left: 5px;
              border-color: #2ba1f4;
            }
          }
        }
      }
    }
    .paperEmpty {
      margin-top: 80px;
      text-align: center;
    }
  }
  .el-main::-webkit-scrollbar {
    width: 8px;
    height: 2px;
    // background:#ccc;
    border-radius: 5px;
  }
  .el-main::-webkit-scrollbar-thumb {
    display: block;
    width: 8px;
    margin: 0 auto;
    border-radius: 5px;
    // background: rgba(43, 161, 244, 0.6);
    background: #bfbfbf;
  }
}
</style>
