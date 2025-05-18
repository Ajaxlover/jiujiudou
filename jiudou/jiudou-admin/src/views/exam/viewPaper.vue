<template>
  <el-container>
    <!-- <el-aside width="310px">
        <el-button type="primary" class="loadWord" @click="handleLoadWord"
          >下载Word</el-button
        >
        <div class="paperSetTitle">试卷结构设置</div>
        <div class="paperSetBody">
          <span class="banshi">版式</span>
          <el-radio-group v-model="loadWordForm.radio3">
            <el-radio :label="0">简易版(A4)</el-radio>
            <el-radio :label="1">正式版(A3)</el-radio>
          </el-radio-group>
        </div>
        <div class="showResovle" style="padding-left:30px;margin-bottom:5px">
          <el-checkbox v-model="isShowResovle" @change="showResovle"
            >显示答案和解析</el-checkbox
          >
        </div>
        <div class="countTitle">
          试题统计
          <div>{{ timuNum }}题</div>
        </div>
        <div class="setScore">
          分数：{{ timuTotalScore }}
          <el-button
            type="text"
            @click="handleSetScore"
            v-if="timuListData.length > 0"
            >设置分数</el-button
          >
        </div>
        <div class="timuNumList" v-if="timuListData.length > 0">
          <div v-for="item in timuListData" :key="item.index">
            <span
              >{{ convert(item.index + 1) }}、{{ formatType(item.type) }}</span
            >
            <ul>
              <li
                v-for="i in item.children"
                :key="i.pitemId"
                @click="toTimuPosition(i.pitemId)"
              >
                {{ i.timuNum + 1 }}
              </li>
            </ul>
          </div>
        </div>
        <div class="paperBtn">
          <div>
            <i class="el-icon-question" style="color:#2BA1F4;font-size:16px"></i
            >鼠标悬浮于右侧的题目上可调整题目顺序
          </div>
          <el-button @click="handleEmptyTimu" v-if="timuListData.length > 0"
            >清空试题</el-button
          >
          <el-button type="primary" @click="handleAddTimu">添加试题</el-button>
        </div>
      </el-aside> -->
    <el-main class="timuBox">
      <!-- <img
        src="@/assets/images/paperInfoImg.png"
        alt=""
        class="paperInfoImg"
        v-if="loadWordForm.radio3 == 1"
      /> -->
      <div class="paperName">
        <div :title="examInfo.examName">
          {{ examInfo.examName }}
          <!-- <i class="el-icon-edit-outline" @click="handleEditPaperName"></i> -->
        </div>
        <!-- <div v-if="paperNameVisible">
          <el-input
            v-model="editPaperName"
            size="mini"
            @keyup.enter.native="doEditPaperInfoSure"
            style="width:300px;"
          ></el-input>
          <el-button type="primary" size="mini" @click="doEditPaperInfoSure"
            >确定</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="paperNameVisible = !paperNameVisible"
            style="margin-left:0"
            >取消</el-button
          >
        </div> -->
      </div>
      <div style="text-align:center;font-size:12px;color:#666666;">
        （满分{{
          Number.isInteger(timuTotalScore)
            ? Number(timuTotalScore)
            : Number(timuTotalScore).toFixed(2)
        }}分）
      </div>
      <!-- <div class="paperNumTableBox" v-if="loadWordForm.radio3 == 1">
        <div class="paperNumTable">
          <div class="firstDiv">
            <div>题号</div>
            <div>得分</div>
          </div>
          <div class="firstDiv" v-for="item in timuListData" :key="item.index">
            <div>{{ convert(item.index + 1) }}</div>
            <div></div>
          </div>
          <div class="firstDiv">
            <div>总分</div>
            <div></div>
          </div>
        </div>
      </div> -->
      <!-- <div class="papaerSimpleInfo" v-if="loadWordForm.radio3 == 0">
        班级：<span></span>姓名：<span></span>学号：<span></span>
      </div> -->
      <!-- <div class="caution" v-if="loadWordForm.radio3 == 1">
        注意事项：答题前填写好自己的姓名、班级、学号等信息。保持卷面整洁。
      </div> -->
      <ul class="timuList">
        <li v-for="item in timuListData" :key="item.index">
          <span class="timuType"
            >{{ convert(item.index + 1) }}、{{ formatType(item.type) }} （共{{
              item.children.length
            }}
            小题，共{{
              Number.isInteger(item.score)
                ? Number(item.score)
                : Number(item.score).toFixed(2)
            }}
            分）</span
          >
          <ul v-if="item.children.length > 0">
            <li v-for="i in item.children" :key="i.bankId" :id="i.bankId">
              <timu :data="i" :type="1"></timu>
              <!-- <div class="timuBtn">
                  <el-button size="mini" @click="handleDel(i)">删除</el-button>
                  <el-button
                    size="mini"
                    @click="handleBottomMove(i, index, item.children)"
                    >下移</el-button
                  >
                  <el-button
                    size="mini"
                    @click="handleTopMove(i, index, item.children)"
                    >上移</el-button
                  >
                  <el-button
                    size="mini"
                    @click="handleChange(i)"
                    :loading="changeLoading"
                    >换题</el-button
                  >
                </div> -->
            </li>
          </ul>
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
  overflow: auto;
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
