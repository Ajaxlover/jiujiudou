<template>
  <el-container v-if="isShow" class="editCourseTask">
    <el-header>
      <span class="returnBtn" @click="goBack"
        ><i class="el-icon-back" style="margin-right:5px"></i>返回</span
      >
      <div class="editTitle">新建作业</div>
    </el-header>
    <el-main>
      <div class="contentBox">
        <div class="leftList">
          <div class="countTitle">
            题目统计<span>{{ timuNum }}题</span>
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
          <div class="scoreTotleContent">
            <i class="el-icon-question"></i>作业总分100分
          </div>
          <div class="showResovle" style="padding-left:30px;margin-bottom:5px">
            <el-checkbox v-model="isShowResovle" @change="showResovle"
              >显示答案和解析</el-checkbox
            >
          </div>
          <div class="timuNumList" v-if="timuListData.length > 0">
            <div v-for="item in timuListData" :key="item.index">
              <span style="font-size:14px"
                >{{ convert(item.index + 1) }}、{{
                  formatType1(item.type)
                }}</span
              >
              <ul>
                <li
                  class="leftTihao"
                  @click="toTimuPosition(i.id)"
                  v-for="i in item.children"
                  :key="i.id"
                >
                  {{ i.timuNum + 1 }}
                </li>
              </ul>
            </div>
          </div>
          <div class="paperBtn">
            <!-- <div>
              <i
                class="el-icon-question"
                style="color:#2BA1F4;font-size:16px"
              ></i
              >鼠标悬浮于右侧的题目上可调整题目顺序
            </div> -->
            <el-button
              @click="handleEmptyTimu"
              size="small"
              v-if="timuListData.length > 0"
              >清空题目</el-button
            >
            <el-button type="primary" size="small" @click="addSelectTimu"
              >添加题目</el-button
            >
            <el-button type="primary" size="small" @click="doSave"
              >保存</el-button
            >
          </div>
        </div>
        <div class="rightList">
          <div class="exerciseName">
            <span v-if="exerciseNameShow" style="margin-left: 15px;"
              >{{ exerciseName }}
              <i
                @click="handleExerciseName"
                class="el-icon-edit-outline"
                style="margin-left: 5px;cursor:pointer"
              ></i>
            </span>
            <span v-if="!exerciseNameShow">
              <el-input
                v-model="editExerciseName"
                size="mini"
                @keyup.enter.native="doEditExerciseNameSure"
                style="width:150px;"
              ></el-input>
              <el-button
                type="primary"
                size="mini"
                @click="doEditExerciseNameSure"
                style="margin-left: 5px"
                >确定</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="exerciseNameShow = !exerciseNameShow"
                style="margin-left:0"
                >取消</el-button
              >
            </span>
          </div>
          <ul class="timuList">
            <li v-for="item in timuListData" :key="item.index">
              <span class="timuType"
                >{{ convert(item.index + 1) }}、{{
                  formatType1(item.type)
                }}
                （共{{ item.children.length }} 小题，共{{
                  item.score
                }}
                分）</span
              >
              <ul v-if="item.children.length > 0">
                <li
                  v-for="(i, index) in item.children"
                  :key="i.id"
                  :id="i.id"
                  @mouseenter="handleTimuMouseenter($event)"
                  @mouseleave="handleTimuMouseleave($event)"
                >
                  <timu :tNum="index" :data="i" :type="showResovleType"></timu>
                  <div class="timuBtn">
                    <el-button size="mini" @click="handleDel(i)"
                      >删除</el-button
                    >
                    <!--
                    <el-button
                      size="mini"
                      @click="handleBottomMove(i, index, timuListData)"
                      >下移</el-button
                    >
                    <el-button
                      size="mini"
                      @click="handleTopMove(i, index, timuListData)"
                      >上移</el-button
                    >
                    <el-button
                      size="mini"
                      @click="handleChange(i)"
                      :loading="changeLoading"
                      >换题</el-button
                    > -->
                    <!-- <el-input-number
                      v-if="i.sonSubList.length <= 0"
                      v-model="i.score"
                      :min="0"
                      size="mini"
                      :max="parseInt(100 - timuTotalScore + i.score)"
                      @change="itemScoreChange(i)"
                    ></el-input-number> -->
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <div class="emptyTs" v-if="timuListData.length <= 0">
            <div>作业题目为空，请点击下面的按钮</div>
            <el-button @click="addSelectTimu" size="small" type="primary"
              >添加题目</el-button
            >
          </div>
        </div>
      </div>
    </el-main>
    <!-- 添加题目 -->
    <el-drawer
      title="添加题目"
      :destroy-on-close="true"
      :visible.sync="drawer"
      direction="ltr"
      size="90%"
      :modal-append-to-body="false"
      :before-close="handleCloseDrawer"
    >
      <addTest
        v-if="drawer"
        :addType="1"
        v-on:toCloseDrawer="toCloseDrawer"
        @addSuccess="addSuccess"
      ></addTest>
    </el-drawer>
    <!-- 设置分值 -->
    <el-dialog
      :visible.sync="isSetScoreShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>
            设置分值<span>({{ setScoreTotal }}/100)</span>
          </div>
        </div>
      </template>
      <div class="scoreList" style="height:400px;overflow-y: auto">
        <div v-for="item in scoreListData" :key="item.index">
          <span
            >{{ convert(item.index + 1) }}、{{ formatType1(item.type) }} （{{
              item.score
            }}
            分）
            <el-input
              size="mini"
              v-model="item.typeSetScoreInput"
              @input="handleScoreChangeAll(item)"
              style="width:100px;margin-left:20px"
            ></el-input>
          </span>
          <!-- :class="i.sonSubList.length > 0 ? 'hasLittle' : 'noLittle'" -->
          <ul>
            <li v-for="i in item.children" :key="i.id">
              <div class="tihao">
                {{ i.timuNum + 1 }}
              </div>
              <el-input
                size="mini"
                v-model="i.score"
                @input="handleScoreChange(item, i)"
                class="noLittle"
              ></el-input>
              <ul>
                <li v-for="(u, mIndex) in i.sonList" :key="mIndex">
                  <div class="tihao">
                    {{ i.timuNum + 1 + "-" + (mIndex + 1) }}
                  </div>
                  <el-input
                    size="mini"
                    v-model="u.score"
                    @input="u.score = u.score.replace(/[^0-9]/g, '')"
                  ></el-input>
                </li>
              </ul>
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
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import math from "@/components/jmath";
import timu from "./task/timuNew";
import addTest from "./addCourseDemo";
// import addTest from "./addCourseTest";
export default {
  name: "editCourseTask",
  components: {
    "jd-math": math,
    timu,
    addTest
  },
  data() {
    return {
      isShow: true,
      exerciseContent: "", // 原来所有题目Json
      exerciseId: this.$route.query.exerciseId,
      paperId: 0,
      loading: {
        resLoading: false
      },
      isShowResovle: true, // 是否显示答案和解析
      showResovleType: 1,
      dataLaoding: false,
      updataScoreToast: true, //题目分值设置成功Toast
      isSetScoreShow: false, //设置分值弹窗
      remindDialogShow: false,
      exerciseNameShow: true, //作业名字编辑
      exerciseName: "作业一",
      classId: "",
      coursewareId: "",
      editExerciseName: "",
      coursewareExerciseId: 0,
      timuListData: [], //题目列表原数据
      scoreListData: [], //题目列表要修改分数的数据
      typeNum: 0, //总题型数
      timuNum: 0, //总题目数
      timuTotalScore: 0, //题目总分数
      // setScoreTotal: 0,
      setScoreArr: [],
      changeLoading: false, // 换题
      currentTimu: {},
      changeTimuData: [],
      activeId: "",
      isChangeTimuShow: false,
      drawer: false, // 添加题目抽屉
      questionList: [],
      // homeList: this.$store.state.classRoom.libHomeList
      homeList: []
    };
  },
  mounted() {
    if (this.exerciseId) {
      this.loadData();
    }
    // this.classId = this.$route.query.classId;
    // this.exerciseName = this.$route.query.exerciseName;
    // this.coursewareId = this.$route.query.coursewareId;
    // if (this.exerciseId) {
    //   this.loadData();
    // } else {
    //   this.loadTimu();
    // }
  },
  watch: {
    isShow() {
      // this.loadTimu();
    }
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
        return this.totalScore ? this.totalScore : 0;
      }
    },
    setScoreTotal() {
      if (this.scoreListData.length > 0) {
        let total = 0;
        this.scoreListData.forEach(i => {
          total += i.score;
        });
        return total;
      } else {
        return 0;
      }
    }
  },
  methods: {
    addSuccess(data) {
      // this.loadTimu();
      console.log("单次选择的题目", data);
      this.homeList = [...this.homeList, ...data];
      this.loadTimu();
      // this.isShow = false;
      // this.$nextTick(() => {
      //   this.isShow = true;
      // });
    },
    loadTimu() {
      console.log("题目", this.homeList);
      this.timuListData = [];
      // this.homeList = this.$store.state.classRoom.libHomeList;
      let arr = [];
      // 去重
      arr = Array.from(new Map(this.homeList.map(item => [item.id, item]))).map(
        ([id, item]) => item
      );
      let arr1 = arr.sort((a, b) => a.tSubject - b.tSubject);
      this.timuTotalScore = 0;
      this.typeNum = 0;
      this.timuNum = 0;
      arr1.forEach(element => {
        if (element.score) {
          this.$set(element, "score", element.score);
        } else {
          this.$set(element, "score", 0);
        }
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
    showResovle() {
      if (this.isShowResovle) {
        this.showResovleType = 1;
      } else {
        this.showResovleType = 0;
      }
    },
    //加载试题列表
    loadData(param) {
      this.dataLaoding = true;
      axios
        .request({
          method: "post",
          url: "/tiku/v4/exercise/findAll",
          data: {
            exercisesId: this.exerciseId ? this.exerciseId : param
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.dataLaoding = false;
            this.timuListData = [];
            this.typeNum = 0;
            this.timuNum = 0;
            this.exerciseContent = ret.data.exerciseContent
              ? ret.data.exerciseContent
              : "";
            this.questionList = ret.data.subjectBanks
              ? ret.data.subjectBanks
              : []; // 题目data
            // this.timuNum = this.timuListData.length; // 题目数
            if (this.questionList.length > 0) {
              ret.data.subjectBanks.forEach(element => {
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
              this.timuTotalScore = 0;
              this.timuListData.forEach(element => {
                this.timuTotalScore += element.score;
              });
            }
          } else {
            // this.$message({
            //   type: "warning",
            //   message: ret.msg
            // });
          }
        });
    },
    goBack() {
      this.$router.push({
        path: "/coursewareLib/myCoursewareLib"
      });
      // if (this.timuTotalScore != 100 && this.timuNum > 0) {
      //   this.$confirm("<div>作业总分不等于100,请前往设置</div>", "提示", {
      //     cancelButtonText: "取消",
      //     confirmButtonText: "确定",
      //     dangerouslyUseHTMLString: true,
      //     type: "warning"
      //   })
      //     .then(() => {
      //       this.handleSetScore();
      //     })
      //     .catch(() => {
      //       this.$router.push({
      //         path: "/coursewareLib/myCoursewareLib"
      //       });
      //     });
      // } else {
      //   this.$router.push({
      //     path: "/coursewareLib/myCoursewareLib"
      //   });
      // }
    },
    //编辑作业名字
    handleExerciseName() {
      this.exerciseNameShow = !this.exerciseNameShow;
      this.editExerciseName = this.exerciseName;
    },
    //修改作业名字
    doEditExerciseNameSure() {
      if (this.exerciseId) {
        axios
          .request({
            method: "post",
            url: "/tiku/v4/exercise/rename",
            data: {
              exerciseId: this.exerciseId,
              exerciseName: this.editExerciseName
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: ret.msg
              });
              this.exerciseNameShow = !this.exerciseNameShow;
              this.exerciseName = this.editExerciseName;
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      } else {
        this.exerciseNameShow = !this.exerciseNameShow;
        this.exerciseName = this.editExerciseName;
      }
    },
    // 添加题目
    addSelectTimu() {
      this.drawer = true;
    },
    doSave() {
      axios
        .request({
          method: "post",
          url: "/v1/ware/addExercise",
          data: {
            exerciseName: this.exerciseName,
            exerciseItemJson: []
            // exerciseId: this.exerciseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: "作业创建成功"
            });
            // 跳转作业库
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 关掉选题抽屉
    handleCloseDrawer() {
      this.drawer = false;
      // if (this.exerciseId) {
      //   this.loadData(); // 重新加载题目列表
      // } else {
      //   this.loadTimu();
      // }
    },
    toCloseDrawer() {
      this.handleCloseDrawer(); // 关闭抽屉
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
          if (this.exerciseId) {
          } else {
            this.$message({
              type: "success",
              message: "清空题目成功"
            });
            this.homeList = [];
            this.timuListData = [];
            this.scoreListData = [];
          }
        })
        .catch(() => {});
    },
    //跳转到指定题目位置
    toTimuPosition(pitemId) {
      // 选中点击的题号
      let arrLi = document.getElementsByClassName("leftTihao");
      for (let index = 0; index < arrLi.length; index++) {
        const element = arrLi[index];
        element.style.borderColor = "#e4e4e4";
      }
      // ev.target.style.borderColor = "#2BA1F4";
      // 点击题号 右侧指定题目选中
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
      // this.scoreListData = JSON.parse(JSON.stringify(this.timuListData)); // 把数据拷贝一份给修改分数保存原始数据
      this.scoreListData = this.timuListData; //把数据拷贝一份给修改分数 保存原始数据

      // this.setScoreCommon();
      this.isSetScoreShow = true;
      // this.updataScoreToast = true;
      this.remindDialogShow = true;
    },
    //修改单个题目分数
    itemScoreChange(row) {
      this.updataScoreToast = false;
      this.scoreListData = JSON.parse(JSON.stringify(this.timuListData));
      this.remindDialogShow = false;
      this.doSetScoreSure();
    },
    //修改每一题的分数
    handleScoreChange(row, i) {
      i.score = Number(i.score.replace(/[^0-9]/g, ""));
      let score = 0;
      row.children.forEach(element => {
        if (element.score == "") {
          element.score = 0;
        }
        score += parseInt(element.score);
      });
      row.typeSetScoreInput = "";
      row.score = score;
      this.setScoreCommon();
    },
    //修改每一题型的分数
    handleScoreChangeAll(row) {
      row.typeSetScoreInput = Number(
        row.typeSetScoreInput.replace(/[^0-9]/g, "")
      );
      row.score = 0;
      row.children.forEach(element => {
        element.score = row.typeSetScoreInput;
      });
      row.score = row.typeSetScoreInput * row.children.length;
      this.setScoreCommon();
    },
    // 设置分数的公共部分
    setScoreCommon() {
      this.setScoreArr = [];
      // this.setScoreTotal = 0;
      this.scoreListData.forEach(el => {
        el.children.forEach(element => {
          if (element.sonSubList.length > 0) {
            // 有组合题
            element.sonList.forEach(i => {
              let objSon = {};
              objSon.subjectId = i.subjectId;
              objSon.score = element.score / element.sonSubList.length;
              objSon.parentId = element.id;
              this.setScoreArr.push(objSon);
            });
            this.setScoreArr.push({
              subjectId: element.id,
              score: 0,
              parentId: 0
            });
          } else {
            let obj = {};
            obj.subjectId = element.id;
            obj.score = element.score;
            obj.parentId = 0;
            this.setScoreArr.push(obj);
          }
        });
      });
    },
    //确定设置分数
    doSetScoreSure() {
      this.setScoreCommon();

      if (this.setScoreTotal != 100 && this.remindDialogShow) {
        this.$confirm("<div>作业总分不等于100,请重新设置</div>", "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }).then(() => {
          // this.handleSetScore()
        });
      } else {
        // console.log(this.setScoreArr);
        this.isSetScoreShow = false;
      }
    },
    //鼠标进入每一道题显示操作按钮
    handleTimuMouseenter(e) {
      // let id = "leftTihao" + e.target.id;
      // document.getElementById(id).style.borderColor = "#2BA1F4";
      e.target.lastChild.style.display = "block";
    },
    handleTimuMouseleave(e) {
      // let id = "leftTihao" + e.target.id;
      // document.getElementById(id).style.borderColor = "#e4e4e4";
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
            pitemId: this.currentTimu.id,
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
    //删除
    handleDel(i) {
      this.$confirm("<div>确定删除吗？</div>", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          if (this.exerciseId) {
          } else {
            const homeListIndex = this.homeList.findIndex(
              item => item.id == i.id
            );
            this.homeList.splice(homeListIndex, 1);
            this.timuListData.forEach(v => {
              const vIndex = v.children.findIndex(item => item.id == i.id);
              v.children.splice(vIndex, 1);
            });
            this.loadTimu();
          }
        })
        .catch(() => {});
    },
    // 类型
    formatType(row) {
      return common.typeFormat(row.tSubject);
    },
    formatType1(type) {
      return common.typeFormat(type);
    },
    //小写转换为大写
    // convert(num) {
    //   var nums = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    //   var unit = [
    //     "",
    //     "十",
    //     "百",
    //     "千",
    //     "万",
    //     "十",
    //     "百",
    //     "千",
    //     "亿",
    //     "十",
    //     "百",
    //     "千",
    //     "万亿"
    //   ];
    //   var result = "";
    //   for (var i = 0; i < num.toString().length; i++) {
    //     var c = num.toString()[i];
    //     if (c != 0) {
    //       result += nums[c] + unit[num.toString().length - i - 1];
    //     } else {
    //       result += nums[c];
    //     }
    //   }
    //   return result;
    // },
    convert(textIndex) {
      let newString = "";
      let newTextIndex = textIndex + "";
      function sum(value, index) {
        var newValue = "";
        if (textIndex === 9) {
          return !index ? "十" : "";
        }
        let isSeat = ~~textIndex > 9 && ~~textIndex < 19;
        switch (~~value) {
          case 1:
            newValue = !index ? (isSeat ? "" : "一") : "十一";
            break;
          case 2:
            newValue = !index ? (isSeat ? "" : "二") : "十二";
            break;
          case 3:
            newValue = !index ? (isSeat ? "" : "三") : "十三";
            break;
          case 4:
            newValue = !index ? (isSeat ? "" : "四") : "十四";
            break;
          case 5:
            newValue = !index ? (isSeat ? "" : "五") : "十五";
            break;
          case 6:
            newValue = !index ? (isSeat ? "" : "六") : "十六";
            break;
          case 7:
            newValue = !index ? (isSeat ? "" : "七") : "十七";
            break;
          case 8:
            newValue = !index ? (isSeat ? "" : "八") : "十八";
            break;
          case 9:
            newValue = !index ? (isSeat ? "" : "九") : "九十";
            break;
          case 0:
            newValue = "十";
            break;
          default:
            break;
        }
        return newValue;
      }
      for (let i = 0; i < newTextIndex.length; i++) {
        newString += sum(newTextIndex.substring(i, i + 1), i);
      }
      return newString;
    }
  }
};
</script>

<style lang="scss">
.editCourseTask {
  height: 100%;
  .el-header {
    background: rgba(13, 67, 118, 1);
    text-align: center;
    color: #fff;
    overflow: hidden;
    font-size: 15px;
    line-height: 60px;
    padding: 0;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    .returnBtn {
      position: absolute;
      top: 13px;
      left: 0;
      z-index: 2;
      color: #fff;
      border: 1px solid #979797;
      width: 100px;
      height: 34px;
      line-height: 34px;
      font-size: 14px;
      border-radius: 17px;
      cursor: pointer;
      margin-left: 45px;
    }
    .editTitle {
      box-sizing: border-box;
      z-index: 1;
      position: absolute;
      font-size: 20px;
      width: 100%;
      text-align: center;
    }
  }
  .el-dialog {
    .subject-title {
      text-align: left;
      max-height: 23px;
      overflow: hidden;
    }
  }
  .el-main {
    background: #f0f1f5;
    margin-top: 80px;
    height: 100%;
    padding: 0;
    overflow-y: scroll;
    padding-bottom: 16px;
    .contentBox {
      width: 1034px;
      height: 100%;
      margin: 0 auto;
      .leftList {
        position: fixed;
        top: 0;
        bottom: 16px;
        transition: padding-top 0.3s;
        width: 283px;
        margin-top: 80px;
        padding-left: 0;
        background: #fff;
        z-index: 1;
        max-height: 100%;
        overflow-y: auto;
        padding-bottom: 180px;
        .countTitle {
          background-color: #e4e4e4;
          padding: 0 30px;
          height: 45px;
          line-height: 45px;
          color: #666666;
          font-size: 16px;
          span {
            float: right;
          }
        }
        .setScore {
          padding: 0 30px;
          font-size: 15px;
          height: 45px;
          line-height: 45px;
          color: #333333;
          .el-button {
            float: right;
          }
        }
        .scoreTotleContent {
          padding: 0 30px;
          font-size: 12px;
          color: #999999;
          margin-top: -5px;
          margin-bottom: 12px;
          i {
            color: #2ba1f4;
            font-size: 14px;
            margin-right: 2px;
          }
        }
        .timuNumList {
          padding: 25px 25px 15px;
          border-top: 1px solid #dddddd;
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
              margin-right: 13px;
              margin-bottom: 15px;
              border-radius: 5px;
              cursor: pointer;
            }
          }
        }
        .paperBtn {
          width: 283px;
          height: 150px;
          padding: 20px 0 20px 0;
          position: fixed;
          bottom: 16px;
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
      .rightList {
        width: 100%;
        padding-left: 324px;
        height: calc(100% - 66px);
        position: relative;
        .exerciseName {
          font-size: 24px;
          color: #000000;
          background: #fff;
          text-align: center;
          padding: 20px 0 15px;
          i {
            color: #2ba1f4;
            font-size: 16px;
            cursor: pointer;
          }
        }
        .timuList {
          list-style: none;
          margin: 0;
          background: #fff;
          min-height: 100%;
          padding: 20px 20px 40px;
          .timuContent {
            border: 1px solid #dddddd;
            padding: 22px;
            margin-top: 9px;
            word-wrap: break-word;
          }
          .delectButton {
            color: #2ba1f4;
            border: 1px solid #2ba1f4;
            padding-top: 7px;
            padding-bottom: 7px;
            padding-left: 13px;
            padding-right: 13px;
            font-size: 14px;
            border-radius: 5px;
            cursor: pointer;
            float: right;
          }
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
                background: rgba(245, 247, 250, 0);
                display: none;
                .el-input-number,
                .el-button {
                  float: right;
                  margin-left: 5px;
                  border-color: #2ba1f4;
                }
              }
            }
          }
        }
        .emptyTs {
          position: absolute;
          top: 300px;
          width: 710px;
          text-align: center;
          .el-button {
            margin-top: 15px;
          }
        }
      }
      .leftList::-webkit-scrollbar {
        width: 3px;
        height: 2px;
        // background:#ccc;
        border-radius: 5px;
      }
      .leftList::-webkit-scrollbar-thumb {
        display: block;
        width: 2px;
        margin: 0 auto;
        border-radius: 5px;
        background: rgba(43, 161, 244, 0.6);
      }
    }
  }
  .el-main::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background: rgba(240, 241, 245, 1);
    border-radius: 5px;
    border: 1px solid rgba(214, 220, 222, 1);
  }
  .el-main::-webkit-scrollbar-thumb {
    display: block;
    width: 7px;
    margin: 0 auto;
    border-radius: 5px;
    background: rgba(196, 201, 205, 1);
  }
  .scoreList {
    padding: 15px 25px;
    ul {
      list-style: none;
      overflow: hidden;
      padding-left: 0;
      margin: 0;
      margin-top: 14px;
      // background-color: red;
      display: flex;
      li {
        width: 36px;
        text-align: center;
        margin-right: 15px;
        margin-bottom: 15px;
        .tihao {
          width: 36px;
          height: 36px;
          line-height: 36px;
          border: 1px solid #e4e4e4;
          // border-radius: 5px;
          margin-bottom: 5px;
          text-align: center;
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
  :focus {
    outline: 0;
  }
  .el-drawer__header {
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 15px;
  }
  .el-drawer__body {
    overflow-y: scroll;
    padding-bottom: 150px;
  }
  .el-drawer__body::-webkit-scrollbar {
    width: 8px;
    height: 2px;
    // background:#ccc;
    border-radius: 5px;
  }
  .el-drawer__body::-webkit-scrollbar-thumb {
    display: block;
    width: 8px;
    margin: 0 auto;
    border-radius: 5px;
    background: rgba(43, 161, 244, 0.6);
  }
}
</style>
