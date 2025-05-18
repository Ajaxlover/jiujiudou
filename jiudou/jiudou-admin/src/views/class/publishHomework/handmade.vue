<template>
  <el-container class="handmade">
    <el-header style="height: 50px">
      <span>发布作业</span>
    </el-header>
    <el-container>
      <el-aside width="310px">
        <el-button type="primary" @click="openPublish" class="loadWord"
          >发布作业</el-button
        >
        <div class="showResovle" style="padding-left:30px;margin-bottom:5px">
          <!-- <el-checkbox v-model="isShowResovle" @change="showResovle"
            >显示答案和解析</el-checkbox
          > -->
        </div>
        <div class="countTitle">
          试题统计
          <div>{{ timuNum }}题</div>
        </div>
        <div class="setScore">
          分数：{{
            Number.isInteger(currentTotal)
              ? Number(currentTotal)
              : Number(currentTotal).toFixed(2)
          }}
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
                :key="i.id"
                @click="toTimuPosition(i.id)"
              >
                {{ i.timuNum + 1 }}
              </li>
            </ul>
          </div>
        </div>
        <div class="paperBtn">
          <!-- <div>
            <i class="el-icon-question" style="color:#2BA1F4;font-size:16px"></i
            >鼠标悬浮于右侧的题目上可调整题目顺序
          </div> -->
          <el-button @click="handleEmptyTimu" v-if="timuListData.length > 0"
            >清空试题</el-button
          >
          <el-button type="primary" @click="handleAddTimu">添加题目</el-button>
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
          <div v-if="!paperNameVisible">
            {{ paperInfo.paperName }}
            <i class="el-icon-edit-outline" @click="handleEditPaperName"></i>
          </div>
          <div v-if="paperNameVisible">
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
          </div>
        </div>
        <div style="text-align:center;font-size:12px;color:#666666;">
          （满分{{
            Number.isInteger(currentTotal)
              ? Number(currentTotal)
              : Number(currentTotal).toFixed(2)
          }}分）
        </div>
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
                v-for="i in item.children"
                :key="i.id"
                :id="i.id"
                @mouseenter="handleTimuMouseenter($event)"
                @mouseleave="handleTimuMouseleave($event)"
              >
                <timu :data="i" :type="showResovleType"></timu>
                <div class="timuBtn">
                  <el-button size="mini" @click="handleDel(i)">删除</el-button>
                  <!-- <el-button
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
                  > -->
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <div
          class="paperEmpty"
          v-if="!(timuListData.length > 0)"
          v-loading="dataLaoding"
        >
          <img src="@/assets/images/empty.png" alt="" />
          <p>暂无题目，请点击“添加题目”进行选题</p>
          <el-button type="primary" @click="handleAddTimu">添加题目</el-button>
        </div>
        <el-backtop target=".timuBox"></el-backtop>
      </el-main>
    </el-container>
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
          <div>
            设置分值<span>({{ currentTotal }}/100)</span>
          </div>
        </div>
      </template>
      <div class="scoreList" style="height:400px;overflow-y: auto">
        <div v-for="item in scoreListData" :key="item.index">
          <span
            >{{ convert(item.index + 1) }}、{{ formatType(item.type) }} （{{
              Number.isInteger(item.score)
                ? Number(item.score)
                : Number(item.score).toFixed(2)
            }}
            分）
            <el-input
              size="mini"
              v-model="item.typeSetScoreInput"
              @input="handleScoreChangeAll(item)"
              style="width:100px;margin-left:20px"
            ></el-input>
          </span>
          <ul>
            <li v-for="i in item.children" :key="i.pitemId">
              <div class="tihao">{{ i.timuNum + 1 }}</div>
              <el-input
                size="mini"
                v-model="i.score"
                @input="handleScoreChange(item, i)"
              ></el-input>
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
    <!-- 换题 -->
    <el-dialog
      :visible.sync="isChangeTimuShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="700px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>替换试题 ———— 第{{ currentTimu.timuNum + 1 }}题</div>
        </div>
      </template>
      <el-tabs type="border-card" v-model="activeId">
        <el-tab-pane
          :label="String(index + 1)"
          v-for="(item, index) in changeTimuData"
          :key="item.pitemId"
          :name="String(item.id)"
        >
          <timu
            :data="item"
            :type="1"
            style="height:300px;overflow-y: auto"
          ></timu>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button size="mini" type="primary" @click="handleChange()"
          >换一批</el-button
        >
        <el-button size="small" type="primary" @click="doChangeTimuSure"
          >确定</el-button
        >
        <el-button size="small" @click="isChangeTimuShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
    <!-- 发布作业选择班级弹窗 -->
    <el-dialog
      :visible.sync="isSelectClassShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>
            发布作业
          </div>
        </div>
      </template>
      <div class="itemList" style="height:200px;overflow-y: auto">
        <div>
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in classList"
              :key="index"
              :label="item.classId"
              >{{ item.classname }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <!-- <div>开始时间：现在</div> -->
        <div class="startTimeContainer">
          <div style="margin-right:0px">开始时间：</div>
          <el-date-picker
            size="small"
            ref="datePicker"
            v-model="startTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            placeholder="请选择"
            :prefix-icon="
              datePickShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
            "
            :editable="false"
            :clearable="false"
            @focus="datePickShow = true"
            @blur="datePickShow = false"
          ></el-date-picker>
        </div>
        <div class="deadlineContainer">
          <div style="margin-right:0px">结束时间：</div>
          <el-date-picker
            size="small"
            ref="datePicker"
            v-model="deadline"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            placeholder="请选择"
            :prefix-icon="
              datePickShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
            "
            :editable="false"
            :clearable="false"
            @focus="datePickShow = true"
            @blur="datePickShow = false"
          ></el-date-picker>
        </div>
      </div>
      <span slot="footer">
        <el-button size="small" @click="publishSure" type="primary"
          >发布</el-button
        >
        <el-button size="small" @click="isSelectClassShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
  </el-container>
</template>

<style lang="scss">
.handmade {
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
        background-color: #e4e4e4;
        padding: 0 30px;
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
      .paperBtn {
        width: 305px;
        padding: 20px 0 20px 0;
        position: fixed;
        bottom: 20px;
        border-radius: 4px;
        background: #ffffff;
        border-top: 1px solid #e4e4e4;
        text-align: center;
        div {
          font-size: 12px;
          text-align: center;
          color: #999999;
        }
        .el-button {
          margin-top: 15px;
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
      background: rgba(43, 161, 244, 0.6);
    }
  }
  .itemList {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .startTimeContainer {
      display: flex;
      align-items: center;
    }
    .deadlineContainer {
      display: flex;
      align-items: center;
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
import timu from "./timu";
import { format } from "@/utils/datetime";

export default {
  components: {
    timu: timu
  },
  data() {
    return {
      datePickShow: false,
      startTime: "", // 作业开始时间
      deadline: "", // 作业结束时间
      classList: [],
      checkList: [],
      totalScore: 0,
      paperId: this.$route.query.paperId,
      paperInfo: {}, //试卷信息
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
      // 发布作业选择班级弹窗
      isSelectClassShow: false,
      //换题
      changeLoading: false,
      currentTimu: {},
      changeTimuData: [],
      activeId: "",
      isChangeTimuShow: false,
      dataLaoding: false,
      uploadLoding: false,
      homeList: this.$store.state.classRoom.homeList
    };
  },
  mounted() {
    this.loadTimu();
    this.loadClassList();
  },
  provide() {
    return {
      load: this.loadData
    };
  },
  computed: {
    currentTotal() {
      if (this.scoreListData.length > 0) {
        this.totalScore = 0;
        this.scoreListData.forEach(i => {
          this.totalScore += i.score;
        });
        return this.totalScore;
      } else {
        return this.totalScore;
      }
    }
  },
  methods: {
    openPublish() {
      if (this.currentTotal != 100) {
        this.$message({
          type: "warning",
          message: `作业总分不等于100,请检查`
        });
        return;
      }
      this.isSelectClassShow = true;
      this.startTime = new Date();
    },
    // 确定发布
    publishSure() {
      if (this.checkList.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择班级"
        });
        return;
      }
      let now = new Date();
      if (!this.startTime) {
        this.$message({
          type: "warning",
          message: "请选择开始时间"
        });
        return;
      }
      if (now.getTime() >= this.startTime.getTime()) {
        this.$message({
          type: "warning",
          message: "开始时间小于当前时间"
        });
        return;
      }
      if (!this.deadline) {
        this.$message({
          type: "warning",
          message: "请选择结束时间"
        });
        return;
      }
      if (now.getTime() >= this.deadline.getTime()) {
        this.$message({
          type: "warning",
          message: "结束时间小于当前时间"
        });
        return;
      }
      let arr = [];
      this.homeList.forEach(el => {
        if (el.sonSubList && el.sonSubList.length > 0) {
          // 组合题
          el.sonSubList.forEach(i => {
            let objSon = {};
            objSon.subjectId = i.id;
            objSon.parentId = el.id;
            objSon.score = i.score;
            arr.push(objSon);
          });
        } else {
          let obj = {};
          obj.subjectId = el.id;
          obj.parentId = el.parentId;
          obj.score = el.score;
          arr.push(obj);
        }
      });
      // 发布作业
      axios
        .request({
          method: "post",
          url: "/clazz/exercisesv3/publishExercisesBatch",
          data: {
            exercisesName: this.editPaperName ? this.editPaperName : "作业一",
            classIds: this.checkList.join(","),
            startTime: this.startTime.getTime(),
            endTime: this.deadline.getTime(),
            data: JSON.stringify(arr)
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: `${ret.msg}`
            });
            var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
            var cEvent = new CountEvent("publish_exercise");
            window.JAnalyticsInterface.onEvent(cEvent);
            this.isSelectClassShow = false;
            this.timuListData = [];
            this.$store.commit("setHomeList", []);
            this.$router.push({
              path: "/class/myClass"
            });
          } else {
            this.$message({
              type: "warning",
              message: `${ret.msg}`
            });
          }
        });
    },
    // 获取班级列表
    loadClassList() {
      axios
        .request({
          method: "post",
          // url: "/v1/calzz/mineClazz"
          url: "clazz/clazz/myAllClass",
          data: {
            isMasterhead: 0
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.classList = ret.data;
          }
        });
    },
    showResovle() {
      if (this.isShowResovle) {
        this.showResovleType = 1;
      } else {
        this.showResovleType = 0;
      }
    },
    //加载试题列表
    loadData() {
      this.dataLaoding = true;
      axios
        .request({
          method: "post",
          url: "/tiku/paperItem/listAllV4",
          data: {
            paperId: this.paperId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.dataLaoding = false;
            //请求成功进循环以前先清空数据
            this.timuListData = [];
            this.timuTotalScore = 0;
            this.typeNum = 0;
            this.timuNum = 0;
            ret.data.forEach(element => {
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
    loadTimu() {
      // this.timuListData = [];
      this.timuTotalScore = 0;
      this.typeNum = 0;
      this.timuNum = 0;
      this.homeList.forEach(element => {
        this.$set(element, "score", 0);
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
    },
    //跳转到指定题目位置
    toTimuPosition(pitemId) {
      document.getElementById(pitemId).scrollIntoView();
      let arr = document.getElementsByClassName("timuBtn");
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        element.style.display = "none";
      }
      document.getElementById(pitemId).lastElementChild.style.display = "block";
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
      if (this.currentTotal != 100) {
        this.$message({
          type: "warning",
          message: `作业总分不等于100,请检查`
        });
        return;
      }
      let arr = [];
      this.scoreListData.forEach(element => {
        // 如果是组合题  根据大题分数设置小题分数为平均值
        if (element.type == 11) {
          element.children.forEach(elc => {
            elc.sonSubList.forEach(item => {
              let objSon = {};
              objSon.pitemId = item.pitemId;
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
            obj.pitemId = el.pitemId;
            obj.score = el.score;
            arr.push(obj);
          });
        }
      });
      this.isSetScoreShow = false;
      this.timuListData.forEach(element => {
        this.timuTotalScore += element.score;
      });
      this.$store.commit("setHomeList", this.homeList);
    },
    //添加试题
    handleAddTimu() {
      this.$router.push({
        path: "/class/addTimu"
      });
    },
    //清空试题
    handleEmptyTimu() {
      this.$confirm("<div>确定清空试题吗？</div>", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          this.timuListData = [];
          this.$store.commit("setHomeList", []);
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
      this.paperNameVisible = !this.paperNameVisible;
      this.paperInfo.paperName = this.editPaperName;
    },
    //鼠标进入每一道题显示操作按钮
    handleTimuMouseenter(e) {
      e.target.lastChild.style.display = "block";
    },
    handleTimuMouseleave(e) {
      e.target.lastChild.style.display = "none";
    },
    //换题
    handleChange(i) {
      if (i) {
        this.changeLoading = true;
        this.currentTimu = i;
      }
      axios
        .request({
          method: "post",
          url: "/tiku/paperItem/similar",
          data: {
            pitemId: this.currentTimu.pitemId,
            paperId: this.paperId
          }
        })
        .then(res => {
          let ret = res.data;
          this.changeLoading = false;
          if (ret.code == 200) {
            if (ret.data.length > 0) {
              this.changeTimuData = ret.data;
              this.activeId = String(ret.data[0].id);
              if (i) {
                this.isChangeTimuShow = true;
              }
            } else {
              this.$message({
                type: "warning",
                message: "没有相似的题目"
              });
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //确定换题事件
    doChangeTimuSure() {
      axios
        .request({
          method: "post",
          url: "/tiku/paper/changeItem",
          data: {
            pitemId: this.currentTimu.pitemId,
            bankId: this.activeId,
            paperId: this.paperId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadData();
            this.isChangeTimuShow = false;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
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
            url: "/tiku/paper/exchange",
            data: {
              pitemId1: i.pitemId,
              pitemId2: children[index - 1].pitemId,
              paperId: this.paperId
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: ret.msg
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
            url: "/tiku/paper/exchange",
            data: {
              pitemId1: i.pitemId,
              pitemId2: children[index + 1].pitemId,
              paperId: this.paperId
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: ret.msg
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
          const homeListIndex = this.homeList.findIndex(
            item => item.id == i.id
          );
          this.homeList.splice(homeListIndex, 1);
          this.$store.commit("setHomeList", this.homeList);
          this.timuListData.forEach(v => {
            const vIndex = v.children.findIndex(item => item.id == i.id);
            v.children.splice(vIndex, 1);
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
