<template>
  <el-container class="repeat-score">
    <el-header style="height: 50px">
      <span @click="toExamCheck" style="cursor:pointer;color:#2BA1F4;"
        >返回</span
      >
      <i class="el-icon-arrow-right"></i> <span>试题复批</span>
    </el-header>
    <el-container>
      <el-aside width="310px">
        <div class="countTitle">
          <span>答题卡</span>
          <!-- <div>{{ timuNum }}题</div> -->
        </div>
        <!-- <div class="setScore">
          分数：{{ timuTotalScore }}
          <el-button
            type="text"
            @click="handleSetScore"
            v-if="timuListData.length > 0"
            >设置分数</el-button
          >
        </div> -->
        <div class="timuNumList" v-if="timuListData.length > 0">
          <div v-for="item in timuListData" :key="item.index">
            <span
              >{{ convert(item.index + 1) }}、{{ formatType(item.type) }}</span
            >
            <ul>
              <li
                :class="[i.isRead == 1 ? 'bg-check' : 'bg-not-check']"
                v-for="i in item.children"
                :key="i.bankId"
                @click="toTimuPosition(i.bankId)"
              >
                {{ i.timuNum + 1 }}
              </li>
            </ul>
          </div>
        </div>
        <div class="paperBtn">
          <span style="border-left:17px solid #ffa340;padding-left:1px"
            >未批阅</span
          >
          <span
            style="border-left:17px solid rgb(57, 188, 249);padding-left:1px"
            >已批阅</span
          >
        </div>
      </el-aside>
      <el-main class="timuBox">
        <img
          src="@/assets/images/paperInfoImg.png"
          alt=""
          class="paperInfoImg"
          v-if="loadWordForm.radio3 == 1"
        />
        <div class="paperName">
          <div>
            {{ examInfo.examName }}
          </div>
        </div>
        <!-- <div style="text-align:center;font-size:12px;color:#666666;">
          （满分{{ timuTotalScore }}分）
        </div> -->
        <div class="paperNumTableBox" v-if="loadWordForm.radio3 == 1">
          <div class="paperNumTable">
            <div class="firstDiv">
              <div>题号</div>
              <div>得分</div>
            </div>
            <div
              class="firstDiv"
              v-for="item in timuListData"
              :key="item.index"
            >
              <div>{{ convert(item.index + 1) }}</div>
              <div></div>
            </div>
            <div class="firstDiv">
              <div>总分</div>
              <div></div>
            </div>
          </div>
        </div>
        <!-- <div class="papaerSimpleInfo" v-if="loadWordForm.radio3 == 0">
          班级：<span></span>姓名：<span></span>学号：<span></span>
        </div> -->
        <div class="caution" v-if="loadWordForm.radio3 == 1">
          注意事项：答题前填写好自己的姓名、班级、学号等信息。保持卷面整洁。
        </div>
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
              <li
                v-for="(i, index) in item.children"
                :key="index"
                :id="i.bankId"
                :ref="i.bankId"
                @mouseenter="handleTimuMouseenter($event)"
                @mouseleave="handleTimuMouseleave($event)"
              >
                <timu
                  @toCheck="toReview"
                  @reviewSuccess="onReviewSuccess"
                  :examResultId="Number(examInfo.examResultId)"
                  :data="i"
                  :type="showResovleType"
                ></timu>
                <div class="timuBtn">
                  <div v-if="i.tSubject == 11" class="option-box-t11">
                    <el-form>
                      <el-form-item label="得分">
                        <!-- <el-input
                          style="width:60px"
                          placeholder="人数"
                          size="small"
                          v-model="form.stuNum"
                          disabled
                        ></el-input> -->
                        <span>{{ i.stuScore }}</span>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div
                    v-else-if="i.tSubject == 4 || i.tSubject == 5"
                    class="option-box-t45"
                  >
                    <el-form>
                      <el-form-item label="">
                        <el-button
                          type="plain"
                          @click="toReview(i)"
                          size="small"
                          >批阅</el-button
                        >
                      </el-form-item>
                      <el-form-item label="得分">
                        <span>{{ i.stuScore }}</span>
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
                            size="small"
                            :class="[{ 'right-active': i.status == 2 }]"
                            @click="doRight(i, 1)"
                          ></el-button>
                          <el-button
                            type="plain"
                            :class="[{ 'wrong-active': i.status != 2 }]"
                            icon="el-icon-close"
                            @click="doRight(i, 0)"
                            size="small"
                          ></el-button>
                        </div>
                      </el-form-item>

                      <el-form-item label="得分">
                        <!-- <el-input
                          style="width:60px"
                          placeholder="得分"
                          size="small"
                          @input="handleInput"
                          v-model="i.settingScore"
                        ></el-input> -->
                        <span>{{ i.stuScore }}</span>
                      </el-form-item>
                      <el-form-item label="满分">
                        <!-- <el-input
                          style="width:60px"
                          placeholder="人数"
                          size="small"
                          v-model="form.stuNum"
                          disabled
                        ></el-input> -->
                        <span>{{ i.score }}</span>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>

        <el-backtop target=".timuBox"></el-backtop>
      </el-main>
      <div class="rightBox">
        <div class="rightBox-t">
          <div style="visibility:hidden">学生序号</div>
          <div style="visibility:hidden">
            {{ stuInfo.stuName ? stuInfo.stuName : "无" }}
          </div>
          <div>得分</div>
          <div>{{ stuInfo.userScore ? stuInfo.userScore : 0 }}</div>
        </div>
        <div class="rightBox-m">
          <el-button @click="preStu" icon="el-icon-arrow-up" type="plain"
            >上一人</el-button
          >
          <el-button @click="nextStu" icon="el-icon-arrow-down" type="plain"
            >下一人</el-button
          >
        </div>
      </div>
    </el-container>
    <!-- 下载word -->
    <el-dialog
      :visible.sync="isLoadWordShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>下载Word</div>
        </div>
      </template>
      <el-form
        :model="loadWordForm"
        ref="loadWordForm"
        label-width="90px"
        style="margin:20px 70px;"
        label-position="left"
      >
        <el-form-item label="试卷模板">
          <el-radio-group v-model="loadWordForm.radio1">
            <el-radio :label="0">简易版(A4)</el-radio>
            <el-radio :label="1" style="margin-left:38px">正式版(A3)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="试卷类型">
          <el-radio-group v-model="loadWordForm.radio2">
            <el-radio :label="0">学生用卷(无答案)</el-radio>
            <el-radio :label="1">老师用卷(有答案)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="打开方式" style="color:#333;">
          仅支持Word2010及以上版本打开
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          @click="doLoadWordSure"
          :loading="uploadLoding"
          >下载试卷</el-button
        >
      </span>
    </el-dialog>
    <!-- 设置分值 -->
    <el-dialog
      :visible.sync="isSetScoreShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>设置分值</div>
        </div>
      </template>
      <div class="scoreList" style="height:400px;overflow-y: auto">
        <div v-for="item in scoreListData" :key="item.index">
          <span
            >{{ convert(item.index + 1) }}、{{ formatType(item.type) }} （{{
              item.score
            }}
            分）
            <el-input
              size="mini"
              v-model="item.typeSetScoreInput"
              @input="handleScoreChangeAll(item)"
              style="width:100px;margin-left:20px"
            ></el-input>

            <!-- <el-input-number
              style="width:100px;margin-left:20px"
              :controls="false"
              size="mini"
              @input="handleScoreChangeAll(item)"
              v-model="item.typeSetScoreInput"
            ></el-input-number> -->
          </span>
          <ul>
            <li v-for="(i, idx) in item.children" :key="idx">
              <div class="tihao">{{ i.timuNum + 1 }}</div>
              <el-input
                size="mini"
                v-model="i.score"
                @input="handleScoreChange(item, i)"
              ></el-input>
              <!-- <el-input-number
                :controls="false"
                size="mini"
                @input="handleScoreChange(item, i)"
                v-model="i.score"
              ></el-input-number> -->
            </li>
          </ul>
        </div>
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doSetScoreSure"
          >确定</el-button
        >
        <el-button size="small" @click="isSetScoreShow = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 批阅 -->
    <el-dialog
      top="6vh"
      v-if="isReviewShow"
      :visible.sync="isReviewShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleCloseViewDialog"
      width="80%"
      center
    >
      <template slot="title">
        <div>
          <div></div>
          <div>批阅</div>
        </div>
      </template>
      <div style="display:flex;height:600px;">
        <div v-if="notPic" class="p-text">{{ pTimu.stuAnswer }}</div>

        <div v-else id="tui-image-editor"></div>

        <div
          class="p-right"
          style="
    width: 300px;
    margin-left: 20px;
"
        >
          <div class="form-box">
            <div class="main-right-score">本题总分{{ pTimu.score }}分</div>
            <el-form
              ref="scoreForm"
              :label-position="labelPosition"
              label-width="80px"
              :model="formLabelAlign"
              @submit.native.prevent
            >
              <el-form-item
                class="score-item"
                prop="score"
                :rules="[
                  { required: true, message: '分数不能为空' },
                  {
                    pattern: /^[0-9.]*$/,
                    message: '分数为整数或小数',
                    trigger: 'blur'
                  }
                ]"
                label=""
              >
                <div class="score-item-text">得分</div>
                <el-input
                  v-model="formLabelAlign.score"
                  placeholder="请输入分数"
                ></el-input>
              </el-form-item>
              <el-form-item class="score-item" label="">
                <div class="score-item-text">评语</div>
                <el-input
                  type="textarea"
                  v-model.trim="formLabelAlign.comment"
                  rows="3"
                  maxlength="140"
                  show-word-limit
                  placeholder="请输入评语"
                ></el-input>
              </el-form-item>
              <el-form-item class="answer-item" label="">
                <div class="answer-item-text">标准答案及解析</div>
                <div>
                  【答案】：<jd-math
                    style="font-size:14px"
                    :data="formLabelAlign.answer | getAnswer"
                  ></jd-math>
                </div>
                <div>
                  【解析】：<jd-math
                    style="font-size:14px"
                    :data="formLabelAlign.analyse"
                  ></jd-math>
                </div>

                <!-- <el-input
                  type="textarea"
                  v-model="formLabelAlign.comment"
                  rows="6"
                  maxlength="140"
                  show-word-limit
                  placeholder="请输入评语"
                ></el-input> -->
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="checkSure"
          :loading="btnLoading"
          type="primary"
          >确定</el-button
        >
        <el-button size="small" @click="handleCloseViewDialog">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<style lang="scss" scoped>
/deep/ .el-form-item__label {
  line-height: 32px;
}
.drawing-container {
  height: 900px;
}

.bg-not-check {
  background-color: #ffa340;
  color: #fff;
}

.bg-check {
  background-color: rgb(57, 188, 249);
  color: #fff;
}

.p-text {
  width: 1162px;
  height: 600px;
  text-align: center;
  line-height: 600px;
  border: 1px solid #000;
  background-color: #f7f7f7;
}
.form-box {
  width: 300px;
  height: 600px;
  overflow-y: auto;
  .main-right-score {
    font-size: 24px;
  }
  .score-item {
    margin-top: 20px;
    // margin-bottom: 100px;
    .score-item-text {
      font-size: 20px;
      margin-bottom: 5px;
    }
  }
  .answer-item {
    .answer-item-text {
      font-size: 20px;
      margin-bottom: 5px;
    }
  }
  // border: 1px solid red;
}
.repeat-score {
  height: 100%;
  overflow: auto;
  .el-header {
    width: 100%;
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
  }
  .el-container {
    padding: 20px 20px 0;
    height: 100%;
    overflow: auto;
    .el-aside {
      background: #ffffff;
      border-radius: 4px;
      margin-right: 15px;
      width: 100%;
      max-height: 100%;
      overflow-y: auto;
      padding-bottom: 167px;
      position: relative;
      .loadWord {
        width: 220px;
        margin-left: 45px;
        margin-top: 20px;
      }
      .paperSetTitle {
        background-color: #e4e4e4;
        padding-left: 30px;
        height: 45px;
        line-height: 45px;
        width: 100%;
        color: #666666;
        font-size: 16px;
        margin-top: 30px;
      }
      .paperSetBody {
        height: 62px;
        line-height: 62px;
        padding-left: 30px;
        .banshi {
          margin-right: 15px;
          font-size: 14px;
        }
      }
      .countTitle {
        // background-color: #e4e4e4;
        border-left: 6px solid rgb(57, 188, 249);
        background-color: #fff;
        padding: 0 15px;
        height: 45px;
        line-height: 45px;
        color: #666666;
        font-size: 16px;
        div {
          float: right;
        }
      }
      .setScore {
        padding: 0 30px;
        font-size: 15px;
        height: 52px;
        line-height: 52px;
        color: #393939;
        .el-button {
          float: right;
          height: 52px;
        }
      }
      .timuNumList {
        padding: 15px 25px;
        // max-height: 300px;
        // overflow-y: auto;
        // border-bottom: 1px solid #E4E4E4;
        border-top: 1px solid #e4e4e4;
        div {
          color: #666666;
          font-size: 14px;
          ul {
            list-style: none;
            overflow: hidden;
            padding-left: 0;
            margin: 0;
            margin-top: 14px;
            li {
              float: left;
              width: 36px;
              height: 36px;
              line-height: 36px;
              border: 1px solid #e4e4e4;
              text-align: center;
              margin-right: 15px;
              margin-bottom: 15px;
              border-radius: 5px;
              cursor: pointer;
            }
          }
        }
      }
      // .timuNumList::-webkit-scrollbar{
      //   width:3px;
      //   height:2px;
      //   background:#ccc;
      //   border-radius:5px;
      // }
      // .timuNumList::-webkit-scrollbar-thumb{
      //   display:block;
      //   width:2px;
      //   margin:0 auto;
      //   border-radius: 5px;
      //   background:rgba(43,161,244,0.6);
      // }
      .paperBtn {
        width: 305px;
        padding: 20px 0 20px 0;
        position: fixed;
        bottom: 20px;
        border-radius: 4px;
        background: #ffffff;
        border-top: 1px solid #e4e4e4;
        text-align: right;
        div {
          font-size: 12px;
          text-align: center;
          color: #999999;
        }
      }
    }
    .el-aside::-webkit-scrollbar {
      width: 3px;
      height: 2px;
      // background:#ccc;
      border-radius: 5px;
    }
    .el-aside::-webkit-scrollbar-thumb {
      display: block;
      width: 2px;
      margin: 0 auto;
      border-radius: 5px;
      background: rgba(43, 161, 244, 0.6);
    }
    .el-main {
      background: #ffffff;
      border-radius: 4px;
      height: 100%;
      overflow-y: auto;
      padding: 13px 13px 13px 50px;
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
        margin-top: 20px;
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
            // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding: 20px;
            cursor: pointer;
            margin-bottom: 0;
            .timuBtn {
              position: absolute;
              top: 0;
              right: 0;
              // width: 100%;
              // height: 100%;
              border-radius: 5px;
              padding: 20px 20px;
              display: block;
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
                    background-color: #8be25f;
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
        }
      }
      .paperEmpty {
        margin-top: 80px;
        text-align: center;
      }
    }
    .rightBox {
      text-align: center;
      padding: 20px 5px;
      margin-left: 10px;
      background-color: #fff;
      float: right;
      width: 120px;

      .rightBox-t {
        height: 160px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .r-active {
          color: #71ec33;
        }
        .w-active {
          color: red;
        }
      }
      .rightBox-m {
        margin-top: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .el-button {
          margin-left: 0;
          margin-bottom: 2px;
        }
      }
      .rightBox-b {
        margin-top: 100px;
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
      background: rgba(43, 161, 244, 0.6);
    }
  }
  .scoreList {
    padding: 15px 25px;
    div {
      color: #666666;
      font-size: 14px;
      ul {
        list-style: none;
        overflow: hidden;
        padding-left: 0;
        margin: 0;
        margin-top: 14px;
        li {
          float: left;
          width: 36px;
          text-align: center;
          margin-right: 15px;
          margin-bottom: 15px;
          .tihao {
            height: 36px;
            line-height: 36px;
            border: 1px solid #e4e4e4;
            // border-radius: 5px;
            margin-bottom: 5px;
          }
          .el-input-number {
            width: 36px;

            input {
              text-align: center;
              color: #2ba1f4;
              padding: 0;
              font-weight: 600;
            }
          }
          .el-input {
            input {
              text-align: center;
              color: #2ba1f4;
              padding: 0;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import timu from "./examScoreTimu.vue";
import { format } from "@/utils/datetime";
import math from "@/components/jmath";

import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import ImageEditor from "tui-image-editor";

export default {
  components: {
    timu,
    "jd-math": math
  },
  data() {
    return {
      btnLoading: false,
      currentCheckTimu: {},
      isReviewShow: false, // 批阅
      labelPosition: "top",
      formLabelAlign: {
        score: "",
        comment: "",
        answer: "",
        analyse: ""
      },
      type: 0,
      examId: this.$route.query.examId,
      examResultId: this.$route.query.examResultId,
      resultReadId: this.$route.query.resultReadId,
      bankId: this.$route.query.bankId,
      stuInfo: {},
      examInfo: {}, //试卷信息
      paperNameVisible: false, //修改试卷名字是先隐藏显示
      editPaperName: "",
      timuListData: [], //题目列表原数据
      scoreListData: [], //题目列表要修改分数的数据
      typeNum: 0, //总题型数
      timuNum: 0, //总题目数
      timuTotalScore: 0, //题目总分数
      //下载word
      isLoadWordShow: false,
      loadWordForm: {
        radio1: 0,
        radio2: 0,
        radio3: 0
      },
      isShowResovle: true, // 是否显示答案和解析
      showResovleType: 1,
      //设置分值
      isSetScoreShow: false,
      //换题
      changeLoading: false,
      currentTimu: {},
      changeTimuData: [],
      changeTimu: {}, // 要替换的新题目
      activeId: "",
      isChangeTimuShow: false,
      dataLaoding: false,
      uploadLoding: false,
      settingScore: "0",
      pTimu: {},
      instance: null,
      notPic: false
    };
  },
  mounted() {
    document.addEventListener("visibilitychange", function() {
      if (document.hidden) {
        console.log("切屏了");
      }
    });

    // this.loadData();
    this.getTimuDetail();
  },
  provide() {
    return {
      load: this.loadData
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
  methods: {
    isUrl(i) {
      return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(
        i.stuAnswer
      );
    },
    checkSure() {
      if (this.formLabelAlign.score > this.pTimu.score) {
        this.$message({
          type: "warning",
          message: "得分不能大于本题满分，请检查"
        });
        return;
      }
      this.$refs["scoreForm"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          let fileOfBlob = "";
          if (!this.notPic) {
            const base64String = this.instance.toDataURL(); // base64 文件
            const data = window.atob(base64String.split(",")[1]);
            const ia = new Uint8Array(data.length);
            for (let i = 0; i < data.length; i++) {
              ia[i] = data.charCodeAt(i);
            }
            const blob = new Blob([ia], { type: "image/png" }); // blob 文件
            fileOfBlob = new File([blob], new Date() + ".png"); // 命名图片名

            axios
              .request({
                method: "post",
                url: `/exam/exam/result/getUploadAnswerRemarkCosPath`
              })
              .then(res => {
                let ret = res.data;
                if (ret.code === 200) {
                  let { cosPath, dev } = ret.data;
                  const picForm = new FormData();
                  // 文件对象
                  picForm.append("file", fileOfBlob);
                  picForm.append("cosPath", cosPath);
                  picForm.append("dev", dev);
                  axios
                    .request({
                      method: "post",
                      url: `${process.env.BASE_URL_V3}/common/feign/upload/uploadImg`,
                      data: picForm
                    })
                    .then(res => {
                      console.log(res);
                      if (res.status == 200) {
                        let { accessUrl } = res.data;

                        const picData = new FormData();
                        picData.append("resultId", this.pTimu.resultId);
                        picData.append(
                          "resultReadId",
                          this.currentCheckTimu.resultReadId
                        );
                        if (this.pTimu.parentId > 0) {
                          picData.append(
                            "reviewResultReadId",
                            this.pTimu.resultReadId
                          );
                        } else {
                          picData.append(
                            "reviewResultReadId",
                            this.currentCheckTimu.resultReadId
                          );
                        }
                        picData.append("score", this.formLabelAlign.score);
                        if (this.formLabelAlign.comment) {
                          picData.append("remark", this.formLabelAlign.comment);
                        }
                        picData.append("answerRemark", accessUrl);

                        this.submitReview(picData);
                      } else {
                        this.$message({
                          type: "warning",
                          message: "图片上传失败"
                        });
                      }
                    });
                } else {
                  this.$message({
                    type: "warning",
                    message: "图片上传路径获取失败"
                  });
                }
              });
          } else {
            // 非图片学生答案批阅

            const data = new FormData();
            data.append("resultId", this.pTimu.resultId);
            data.append("resultReadId", this.currentCheckTimu.resultReadId);
            if (this.pTimu.parentId > 0) {
              data.append("reviewResultReadId", this.pTimu.resultReadId);
            } else {
              data.append(
                "reviewResultReadId",
                this.currentCheckTimu.resultReadId
              );
            }
            data.append("score", this.formLabelAlign.score);
            if (this.formLabelAlign.comment) {
              data.append("remark", this.formLabelAlign.comment);
            }
            this.submitReview(data);
          }
        } else {
          return false;
        }
      });
    },
    submitReview(data) {
      axios
        .request({
          method: "post",
          url: "/exam/exam/result/readOver/review",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.isReviewShow = false;
            this.btnLoading = false;
            this.notPic = false;
            if (this.currentCheckTimu.tSubject != 11) {
              this.type = 2;
              this.getTimuList();
            } else {
              this.type = 0;
              this.getTimuList();
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    init(url) {
      const localeZh = {
        ZoomIn: "放大",
        ZoomOut: "缩小",
        Hand: "手掌",
        History: "历史",
        Resize: "调整宽高",
        Crop: "裁剪",
        DeleteAll: "全部删除",
        Delete: "删除",
        Undo: "撤销",
        Redo: "反撤销",
        Reset: "重置",
        Flip: "镜像",
        Rotate: "旋转",
        Draw: "画",
        Shape: "形状标注",
        Icon: "图标标注",
        Text: "文字标注",
        Mask: "遮罩",
        Filter: "滤镜",
        Bold: "加粗",
        Italic: "斜体",
        Underline: "下划线",
        Left: "左对齐",
        Center: "居中",
        Right: "右对齐",
        Color: "颜色",
        "Text size": "字体大小",
        Custom: "自定义",
        Square: "正方形",
        Apply: "应用",
        Cancel: "取消",
        "Flip X": "X 轴",
        "Flip Y": "Y 轴",
        Range: "区间",
        Stroke: "描边",
        Fill: "填充",
        Circle: "圆",
        Triangle: "三角",
        Rectangle: "矩形",
        Free: "曲线",
        Straight: "直线",
        Arrow: "箭头",
        "Arrow-2": "箭头2",
        "Arrow-3": "箭头3",
        "Star-1": "星星1",
        "Star-2": "星星2",
        Polygon: "多边形",
        Location: "定位",
        Heart: "心形",
        Bubble: "气泡",
        "Custom icon": "自定义图标",
        "Load Mask Image": "加载蒙层图片",
        Grayscale: "灰度",
        Blur: "模糊",
        Sharpen: "锐化",
        Emboss: "浮雕",
        "Remove White": "除去白色",
        Distance: "距离",
        Brightness: "亮度",
        Noise: "噪音",
        "Color Filter": "彩色滤镜",
        Sepia: "棕色",
        Sepia2: "棕色2",
        Invert: "负片",
        Pixelate: "像素化",
        Threshold: "阈值",
        Tint: "色调",
        Multiply: "正片叠底",
        Blend: "混合色",
        Width: "宽度",
        Height: "高度",
        "Lock Aspect Ratio": "锁定宽高比例"
      };

      const customTheme = {
        "common.bi.image": "", // 左上角logo图片
        "common.bisize.width": "0px",
        "common.bisize.height": "0px",
        "common.backgroundImage": "none",
        "common.backgroundColor": "#f3f4f6",
        "common.border": "1px solid #333",

        // header
        "header.backgroundImage": "none",
        "header.backgroundColor": "#f3f4f6",
        "header.border": "0px",

        // load button
        "loadButton.backgroundColor": "#fff",
        "loadButton.border": "1px solid #ddd",
        "loadButton.color": "#222",
        "loadButton.fontFamily": "NotoSans, sans-serif",
        "loadButton.fontSize": "12px",
        "loadButton.display": "none", // 隐藏

        // download button
        "downloadButton.backgroundColor": "#fdba3b",
        "downloadButton.border": "1px solid #fdba3b",
        "downloadButton.color": "#fff",
        "downloadButton.fontFamily": "NotoSans, sans-serif",
        "downloadButton.fontSize": "12px",
        "downloadButton.display": "none", // 隐藏

        // icons default
        "menu.normalIcon.color": "#8a8a8a",
        "menu.activeIcon.color": "#555555",
        "menu.disabledIcon.color": "#ccc",
        "menu.hoverIcon.color": "#e9e9e9",
        "submenu.normalIcon.color": "#8a8a8a",
        "submenu.activeIcon.color": "#e9e9e9",

        "menu.iconSize.width": "24px",
        "menu.iconSize.height": "24px",
        "submenu.iconSize.width": "32px",
        "submenu.iconSize.height": "32px",

        // submenu primary color
        "submenu.backgroundColor": "#1e1e1e",
        "submenu.partition.color": "#858585",

        // submenu labels
        "submenu.normalLabel.color": "#858585",
        "submenu.normalLabel.fontWeight": "lighter",
        "submenu.activeLabel.color": "#fff",
        "submenu.activeLabel.fontWeight": "lighter",

        // checkbox style
        "checkbox.border": "1px solid #ccc",
        "checkbox.backgroundColor": "#fff",

        // rango style
        "range.pointer.color": "#fff",
        "range.bar.color": "#666",
        "range.subbar.color": "#d1d1d1",

        "range.disabledPointer.color": "#414141",
        "range.disabledBar.color": "#282828",
        "range.disabledSubbar.color": "#414141",

        "range.value.color": "#fff",
        "range.value.fontWeight": "lighter",
        "range.value.fontSize": "11px",
        "range.value.border": "1px solid #353535",
        "range.value.backgroundColor": "#151515",
        "range.title.color": "#fff",
        "range.title.fontWeight": "lighter",

        // colorpicker style
        "colorpicker.button.border": "1px solid #1e1e1e",
        "colorpicker.title.color": "#fff"
      };

      this.instance = new ImageEditor(
        document.querySelector("#tui-image-editor"),

        {
          includeUI: {
            loadImage: {
              path: url,
              name: "image"
            },
            menu: [
              "rotate", // 旋转
              "draw", // 添加绘画
              "text" // 添加文本
            ],
            initMenu: "draw", // 默认打开的菜单项
            menuBarPosition: "bottom", // 菜单所在的位置
            locale: localeZh, // 本地化语言为中文
            theme: customTheme // 自定义样式
          },

          cssMaxWidth: 800, // canvas 最大宽度

          cssMaxHeight: 600 // canvas 最大高度
        }
      );

      this.instance.ui.draw.color = "#ff0000";
      this.instance.ui.draw.width = 10;
      this.instance.ui.text._els.textColorpicker._color = "#ff0000";

      document.getElementsByClassName("tui-image-editor-main")[0].style.top =
        "45px"; // 图片距顶部工具栏的距离

      console.log(document.getElementsByClassName("tie-btn-draw")[0]);

      document
        .getElementsByClassName("tie-btn-draw")[0]
        .addEventListener("click", function(e) {
          document.getElementsByClassName(
            "tui-image-editor-submenu"
          )[0].style.display = "none";
        });

      document
        .getElementsByClassName("tie-btn-rotate")[0]
        .addEventListener("click", function(e) {
          document.getElementsByClassName(
            "tui-image-editor-submenu"
          )[0].style.display = "table";
        });

      // document.getElementsByClassName(
      //   "tui-image-editor-submenu"
      // )[0].style.display = "none";

      // document.getElementsByClassName(
      //   "color-picker-value"
      // )[0].style.backgroundColor = "#ff4040";
    },
    toReview(i) {
      this.pTimu = i;
      if (!this.isUrl(this.pTimu)) {
        this.notPic = true; // 学生答案不是图片
      }
      this.isReviewShow = true;
      this.$nextTick(() => {
        if (!this.notPic) {
          this.init(this.pTimu.stuAnswer);
        }
        this.formLabelAlign.score = this.pTimu.settingScore;
        this.formLabelAlign.comment = this.pTimu.remark;
        this.formLabelAlign.answer = this.pTimu.correctAnswer;
        this.formLabelAlign.analyse = this.pTimu.analyse;
      });
      // this.initDraw(i.stuAnswer);
    },
    initDraw(currentImg) {
      var image = new Image();
      image.setAttribute("crossOrigin", "Anonymous");
      image.src = currentImg + `?t=${Date.now()}`;
      image.onload = () => {
        this.context.drawImage(
          image,
          0,
          0,
          this.context.canvas.width,
          this.context.canvas.width
        );
      };
    },
    handleCloseViewDialog() {
      this.isReviewShow = false;
      this.notPic = false;
    },
    doRight(i, flag) {
      // flag=1 判对 flag=0 判错
      console.log(i);
      // if (this.settingScore > i.score) {
      //   this.$message({
      //     type: "warning",
      //     message: "得分不能大于本题满分，请检查"
      //   });
      //   return;
      // }

      let arr = [];
      arr = [
        {
          bankId: i.bankId,
          parentId: i.parentId,
          score: flag === 1 ? i.score : 0
        }
      ];

      // arr = [
      //   {
      //     bankId: i.bankId,
      //     parentId: i.parentId,
      //     score: this.settingScore
      //   }
      // ];

      // if (i.status == 2) {
      //   arr = [
      //     {
      //       bankId: i.bankId,
      //       parentId: i.parentId,
      //       score: i.score
      //     }
      //   ];
      // } else {
      //   arr = [
      //     {
      //       bankId: i.bankId,
      //       parentId: i.parentId,
      //       score: this.settingScore
      //     }
      //   ];
      // }

      axios
        .request({
          method: "post",
          url: "/exam/exam/result/review",
          data: {
            reviewListJson: JSON.stringify(arr),
            examResultId: this.examInfo.examResultId
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
            this.type = 0;
            this.getTimuList();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    handleInput(val) {
      console.log("input", val);
      this.settingScore = val || "0";
    },
    onDelete(data) {
      this.bus.$on(data);
    },
    showResovle() {
      if (this.isShowResovle) {
        this.showResovleType = 1;
      } else {
        this.showResovleType = 0;
      }
    },
    toPublishExam() {
      this.$router.push({
        path: "/exam/examPublish",
        query: {
          examId: this.examId
        }
      });
    },
    toExamCheck() {
      this.$router.back();
    },
    preStu() {
      this.type = 1;
      this.getTimuList();
    },
    nextStu() {
      this.type = 2;
      this.getTimuList();
    },
    onReviewSuccess() {
      this.type = 2;
      this.getTimuList();
    },
    getTimuDetail() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/result/readOver/findStuBankInfo",
          data: {
            resultReadId: this.resultReadId,
            examId: this.examId,
            bankId: this.bankId,
            type: this.type
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.timuListData = [];
            this.timuTotalScore = 0;
            this.typeNum = 0;
            this.timuNum = 0;
            this.stuInfo.userScore = ret.data.stuScore;
            this.currentCheckTimu = ret.data;
            let arr = [];
            arr.push(ret.data);
            arr.forEach(element => {
              let flag = 0;
              for (let i = 0; i < this.timuListData.length; i++) {
                let temp = this.timuListData[i];
                if (temp.type == element.tSubject) {
                  element.timuNum = this.timuNum++;
                  element.settingScore = element.stuScore;
                  if (element.sonSubList && element.sonSubList.length > 0) {
                    element.sonSubList.forEach(e => {
                      e.settingScore = e.stuScore;
                    });
                  }
                  temp.score += element.score;
                  temp.children.push(element);
                  flag = 1;
                  break;
                }
              }
              if (flag == 0) {
                element.timuNum = this.timuNum++;
                element.settingScore = element.stuScore;
                if (element.sonSubList && element.sonSubList.length > 0) {
                  element.sonSubList.forEach(e => {
                    e.settingScore = e.stuScore;
                  });
                }
                this.timuListData.push({
                  type: element.tSubject,
                  index: this.typeNum++,
                  score: element.score,
                  children: [element]
                });
              }
            });
            this.timuListData.forEach(element => {
              this.timuTotalScore += element.score;
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getTimuList() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/result/readOver/findStuBankInfo",
          data: {
            resultReadId: this.currentCheckTimu.resultReadId,
            examId: this.examId,
            bankId: this.bankId,
            type: this.type
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.timuListData = [];
            this.timuTotalScore = 0;
            this.typeNum = 0;
            this.timuNum = 0;
            this.stuInfo.userScore = ret.data.stuScore;
            this.currentCheckTimu = ret.data;
            let arr = [];
            arr.push(ret.data);
            arr.forEach(element => {
              let flag = 0;
              for (let i = 0; i < this.timuListData.length; i++) {
                let temp = this.timuListData[i];
                if (temp.type == element.tSubject) {
                  element.timuNum = this.timuNum++;
                  element.settingScore = element.stuScore;
                  if (element.sonSubList && element.sonSubList.length > 0) {
                    element.sonSubList.forEach(e => {
                      e.settingScore = e.stuScore;
                    });
                  }
                  temp.score += element.score;
                  temp.children.push(element);
                  flag = 1;
                  break;
                }
              }
              if (flag == 0) {
                element.timuNum = this.timuNum++;
                element.settingScore = element.stuScore;
                if (element.sonSubList && element.sonSubList.length > 0) {
                  element.sonSubList.forEach(e => {
                    e.settingScore = e.stuScore;
                  });
                }
                this.timuListData.push({
                  type: element.tSubject,
                  index: this.typeNum++,
                  score: element.score,
                  children: [element]
                });
              }
            });
            this.timuListData.forEach(element => {
              this.timuTotalScore += element.score;
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });

            this.timuListData = [];
            this.timuTotalScore = 0;
            this.typeNum = 0;
            this.timuNum = 0;

            let arr = [];
            arr.push(ret.data);
            arr.forEach(element => {
              let flag = 0;
              for (let i = 0; i < this.timuListData.length; i++) {
                let temp = this.timuListData[i];
                if (temp.type == element.tSubject) {
                  element.timuNum = this.timuNum++;
                  element.settingScore = element.stuScore;
                  if (element.sonSubList && element.sonSubList.length > 0) {
                    element.sonSubList.forEach(e => {
                      e.settingScore = e.stuScore;
                    });
                  }
                  temp.score += element.score;
                  temp.children.push(element);
                  flag = 1;
                  break;
                }
              }
              if (flag == 0) {
                element.timuNum = this.timuNum++;
                element.settingScore = element.stuScore;
                if (element.sonSubList && element.sonSubList.length > 0) {
                  element.sonSubList.forEach(e => {
                    e.settingScore = e.stuScore;
                  });
                }
                this.timuListData.push({
                  type: element.tSubject,
                  index: this.typeNum++,
                  score: element.score,
                  children: [element]
                });
              }
            });
            this.timuListData.forEach(element => {
              this.timuTotalScore += element.score;
            });
          }
        });
    },
    //加载试题列表
    loadData() {
      this.dataLaoding = true;
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/getPaperDetail",
          data: {
            examId: this.examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.dataLaoding = false;
            this.examInfo = {
              examId: ret.data.examId,
              examName: ret.data.examName,
              score: ret.data.score,
              subjectNum: ret.data.subjectNum
            };
            //请求成功进循环以前先清空数据
            this.timuListData = [];
            this.timuTotalScore = 0;
            this.typeNum = 0;
            this.timuNum = 0;
            ret.data.content.forEach(element => {
              let flag = 0;
              for (let i = 0; i < this.timuListData.length; i++) {
                let temp = this.timuListData[i];
                if (temp.type == element.tSubject) {
                  element.timuNum = this.timuNum++;
                  temp.score += element.score;
                  temp.children.push(element);
                  flag = 1;
                  break;
                }
              }
              if (flag == 0) {
                element.timuNum = this.timuNum++;
                this.timuListData.push({
                  type: element.tSubject,
                  index: this.typeNum++,
                  score: element.score,
                  children: [element]
                });
              }
            });
            this.timuListData.forEach(element => {
              this.timuTotalScore += element.score;
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    doLoadWordSure() {
      if (this.timuNum <= 50) {
        this.uploadLoding = true;
        if (this.loadWordForm.radio1 == 0) {
          //A4
          let url =
            process.env.BASE_URL +
            "/tiku/paper/exportWordxA4?paperId=" +
            this.paperId +
            "&isParseLatex=0&isTeacher=" +
            this.loadWordForm.radio2 +
            "&token=" +
            this.$store.state.user.token +
            "&uid=" +
            this.$store.state.user.userId;
          let elemIF = window.document.createElement("iframe");
          elemIF.src = url;
          elemIF.style.display = "none";
          window.document.body.appendChild(elemIF);
        } else {
          //A3
          let url =
            process.env.BASE_URL +
            "/tiku/paper/exportWordxA3?paperId=" +
            this.paperId +
            "&isParseLatex=0&isTeacher=" +
            this.loadWordForm.radio2 +
            "&token=" +
            this.$store.state.user.token +
            "&uid=" +
            this.$store.state.user.userId;
          let elemIF = window.document.createElement("iframe");
          elemIF.src = url;
          elemIF.style.display = "none";
          window.document.body.appendChild(elemIF);
        }
        setTimeout(() => {
          this.uploadLoding = false;
          this.isLoadWordShow = false;
        }, 5000);
      } else {
        this.$message({
          type: "warning",
          message: "下载试卷的题数不能超过50题"
        });
      }
    },
    //跳转到指定题目位置
    toTimuPosition(pitemId) {
      let dom = document.getElementById(pitemId);
      dom.style.boxShadow = "0 2px 12px 0 rgba(0, 0, 0, 0.1)";
      // let arr = document.getElementsByClassName("timuBtn");
      // for (let index = 0; index < arr.length; index++) {
      //   const element = arr[index];
      //   element.style.display = "none";
      // }
      // document.getElementById(pitemId).lastElementChild.style.display = "block";
      this.$nextTick(() => {
        document.getElementById(pitemId).scrollIntoView();
      });
    },
    //设置分数
    handleSetScore() {
      this.scoreListData = this.timuListData; //把数据拷贝一份给修改分数 保存原始数据
      this.isSetScoreShow = true;
    },
    //修改每一题的分数
    handleScoreChange(row, i) {
      i.score = i.score.replace(/[^0-9]/g, "");
      let score = 0;
      row.children.forEach(element => {
        if (element.score == "") {
          element.score = 0;
        }
        score += parseInt(element.score);
        // score += Number(element.score);
      });
      row.typeSetScoreInput = "";
      row.score = score;
    },
    //修改每一题型的分数
    handleScoreChangeAll(row) {
      row.typeSetScoreInput = row.typeSetScoreInput.replace(/[^0-9]/g, "");
      row.children.forEach(element => {
        element.score = row.typeSetScoreInput;
      });
      row.score = row.typeSetScoreInput * row.children.length;
    },
    //确定设置分数
    doSetScoreSure() {
      let arr = [];
      this.scoreListData.forEach(element => {
        // 如果是组合题  根据大题分数设置小题分数为平均值
        if (element.type == 11) {
          element.children.forEach(elc => {
            arr.push({
              bankId: elc.bankId,
              score: elc.score
            });
            elc.sonSubList.forEach(item => {
              let objSon = {};
              objSon.bankId = item.bankId;
              if (element.typeSetScoreInput) {
                objSon.score = Number.parseInt(
                  element.typeSetScoreInput / elc.sonSubList.length
                );
              } else {
                objSon.score = Number.parseInt(
                  elc.score / elc.sonSubList.length
                );
              }
              arr.push(objSon);
            });
          });
        } else {
          element.children.forEach(el => {
            let obj = {};
            obj.bankId = el.bankId;
            obj.score = el.score;
            arr.push(obj);
          });
        }
      });
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/setSubjectScore",
          data: {
            content: JSON.stringify(arr),
            examId: this.examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.isSetScoreShow = false;
            this.loadData();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //添加考试试题
    handleAddTimu() {
      this.$router.push({
        path: "/exam/addExamTimu",
        query: {
          examId: this.examId
        }
      });
    },
    //清空考试试题
    handleEmptyTimu() {
      this.$confirm("<div>确定清空试题吗？</div>", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/exam/exam/paper/cleanSubject",
              data: {
                examId: this.examId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    //修改试卷名字
    handleEditPaperName() {
      this.editPaperName = this.paperInfo.paperName;
      this.paperNameVisible = !this.paperNameVisible;
    },
    //确定修改试卷名字
    doEditPaperInfoSure() {
      axios
        .request({
          method: "post",
          url: "/tiku/paper/update",
          data: {
            paperId: this.paperId,
            paperName: this.editPaperName
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.paperNameVisible = !this.paperNameVisible;
            this.paperInfo.paperName = this.editPaperName;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //鼠标进入每一道题显示操作按钮
    handleTimuMouseenter(e) {
      e.target.lastChild.style.display = "block";
      // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      e.target.style.boxShadow = "0 2px 12px 0 rgba(0, 0, 0, 0.1)";
    },
    handleTimuMouseleave(e) {
      // e.target.lastChild.style.display = "none";
      e.target.style.boxShadow = "none";
      e.target.lastChild.style.display = "block";
    },
    //上移
    handleTopMove(i, index, children) {
      if (index == 0) {
        this.$message({
          type: "warning",
          message: "已经是当前题型下第一道题"
        });
      } else {
        axios
          .request({
            method: "post",
            url: "/exam/exam/paper/exchangeSubject",
            data: {
              examId: this.examId,
              bankId: i.bankId,
              exchangeBankId: children[index - 1].bankId
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: "上移成功"
              });
              this.loadData();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      }
    },
    //下移
    handleBottomMove(i, index, children) {
      if (index == children.length - 1) {
        this.$message({
          type: "warning",
          message: "已经是当前题型下最后一道题"
        });
      } else {
        axios
          .request({
            method: "post",
            url: "/exam/exam/paper/exchangeSubject",
            data: {
              examId: this.examId,
              bankId: i.bankId,
              exchangeBankId: children[index + 1].bankId
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: "下移成功"
              });
              this.loadData();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      }
    },
    //删除
    handleDel(i) {
      this.$confirm("<div>确定删除吗？</div>", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/exam/exam/paper/delSubject",
              data: {
                examId: this.examId,
                bankId: i.bankId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    //时间
    formatDate: function(row) {
      return format(row.createTime);
    },
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
