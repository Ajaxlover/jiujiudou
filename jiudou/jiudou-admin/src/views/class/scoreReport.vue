<template>
  <div class="scoreReport">
    <el-header>
      <el-button id="v-step-0" size="small" type="primary" @click="setScore"
        >成绩规则</el-button
      >
      <!-- <el-dropdown id="v-step-1" trigger="click" @visible-change="showDropdown">
        <span class="el-dropdown-link">导入成绩</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="downloadExcel"
            >下载模板</el-dropdown-item
          >
          <el-dropdown-item @click.native="uploadExcel">导入</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <!-- <el-button
        size="small"
        type="primary"
        @click="resetScore"
        :disabled="!stuList.length"
        :loading="resetLoading"
        >重置总成绩</el-button
      > -->
      <el-button
        size="small"
        icon="el-icon-refresh"
        type="primary"
        @click="refreshScore"
        >刷新成绩</el-button
      >
      <el-button
        size="small"
        type="primary"
        @click="exportScore"
        :disabled="!stuList.length"
        >导出</el-button
      >
    </el-header>
    <el-table
      v-if="tableTitles1.length"
      :data="stuList"
      height="500px"
      stripe
      border
      :header-cell-style="{
        'background-image':
          'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
        color: '#333333',
        height: '40px',
        padding: '0'
      }"
    >
      <el-table-column
        label="学号"
        align="center"
        prop="sNumber"
      ></el-table-column>
      <el-table-column
        label="姓名"
        align="center"
        prop="sRealName"
      ></el-table-column>
      <!-- <el-table-column
        v-for="(item, index) in tableTitles"
        :label="item.name"
        :key="index"
        align="center"
      >
        <el-input
          slot-scope="scope"
          size="small"
          v-model="scope.row[item.name]"
          @blur="inputChange(item.name, scope.row)"
          @keyup.enter.native="$event.target.blur"
        ></el-input>
      </el-table-column> -->
      <el-table-column
        v-for="(item, index) in tableTitles1"
        :label="item.name"
        :key="index"
        align="center"
      >
        <el-table-column
          v-for="(k, idx) in item.children"
          :label="`${k.name}(${k.score}')`"
          :key="idx"
          :prop="`${k.label}`"
          align="center"
        >
        </el-table-column>
      </el-table-column>
      <el-table-column label="总成绩" align="center" prop="totalScore">
        <!-- <span slot-scope="scope">{{ totalScore(scope.row) }}</span> -->
        <!-- <span slot-scope="scope">{{ totalScore(scope.row) }}</span> -->
      </el-table-column>
      <!-- <template slot="append">
        <infinite-loading :identifier="infiniteId" ref="infinite" @infinite="loadScoreList" spinner="spiral" forceUseInfiniteWrapper=".el-table__body-wrapper">
          <loading></loading>
          <span slot="no-more"></span>
          <span slot="no-results"></span>
          <span slot="error"></span>
        </infinite-loading>
      </template> -->
    </el-table>
    <jdialog
      title="导入成绩"
      :visible.sync="uploadStuDialogShow"
      :loading="uploadFileLoading"
      @sure="uploadFileSure"
    >
      <template slot="body">
        <div style="padding: 0 100px">
          <el-form label-width="70px">
            <el-form-item label="选择文件">
              <jd-upload
                ref="uploadFile"
                @fileChange="uploadFileChange"
              ></jd-upload>
              <div class="el-upload__tip" style="line-height:17px">
                当前仅支持后缀名为.xlsx的Excel文档;
              </div>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </jdialog>
    <!-- <v-tour
      ref="myTour"
      name="myTour"
      :steps="steps"
      :options="tourOptions"
    ></v-tour> -->
  </div>
</template>

<style lang="scss">
.scoreReport {
  .el-header {
    padding-right: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .el-dropdown {
      margin: 0 10px;
      line-height: 32px;
    }
    .el-dropdown-link {
      font-size: 12px;
      border-radius: 3px;
      padding: 9px 15px;
      display: inline-block;
      line-height: 1;
      text-align: center;
      color: #fff;
      background-color: #409eff;
      border: 1px solid #409eff;
      cursor: pointer;
    }
    .el-dropdown-link:hover {
      background: #66b1ff;
      border-color: #66b1ff;
      color: #fff;
    }
  }
  input {
    text-align: center;
  }
  .v-step {
    // background: #E6A23C;
    background: #fff !important;
    color: #333 !important;
    font-size: 13px;
    .v-step__arrow {
      border-color: #fff;
    }
    .v-step__button {
      border-color: #2ba1f4;
      color: #2ba1f4;
      border-radius: 4px;
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import jdialog from "@/components/jdialog";
// import InfiniteLoading from "vue-infinite-loading";
import fileModal from "@/components/fileModal";
// import elTableInfiniteScroll from "el-table-infinite-scroll";
export default {
  name: "scoreReport",
  directives: {
    // "el-table-infinite-scroll": elTableInfiniteScroll
  },
  components: {
    jdialog,
    // "infinite-loading": InfiniteLoading,
    "jd-upload": fileModal
  },
  data() {
    return {
      cls: {},
      classId: "",
      stuList: [],
      tableTitles: [],
      tableTitles1: [
        // {
        //   name: "平时成绩",
        //   children: [
        //     { name: "签到", label: "sRealName", score: 10 },
        //     { name: "应答", label: "sRealName", score: 10 },
        //     { name: "作业", label: "sRealName", score: 10 },
        //     { name: "云课", label: "sRealName", score: 10 }
        //   ]
        // },
        // {
        //   name: "考试成绩",
        //   children: [
        //     { name: "第一次考试", label: "sRealName", score: 10 },
        //     { name: "第二次考试", label: "sRealName", score: 10 },
        //     { name: "第二次考试", label: "sRealName", score: 10 },
        //     { name: "第二次考试", label: "sRealName", score: 10 }
        //   ]
        // }
      ],
      page: 1,
      uploadFileLoading: false,
      uploadStuDialogShow: false,
      uploadFile: null,
      infiniteId: +new Date(),
      resetLoading: false,
      tourOptions: {
        useKeyboardNavigation: false,
        labels: {
          buttonSkip: "跳过",
          buttonPrevious: "上一步",
          buttonNext: "下一步",
          buttonStop: "结束"
        }
      },
      steps: [
        {
          target: "#v-step-0",
          content: `第1步：查看与设置成绩规则`,
          params: {
            enableScrolling: false
          }
        },
        {
          target: "#v-step-1",
          content: "第2步：按模板导入考试成绩",
          params: {
            enableScrolling: false
          }
        }
      ]
    };
  },
  mounted() {
    console.log("触发");
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.classId = this.cls.classId;
    this.loadScoreRule();
    this.loadScoreList();
  },
  beforeDestroy() {
    sessionStorage.removeItem("isSaveScore");
  },
  methods: {
    refreshScore() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/achievement/refreshAchievement",
          data: {
            classId: this.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadScoreList();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    setScore() {
      this.$router.push({
        path: "/class/scoreSetting"
      });
    },
    // 加载成绩规则
    loadScoreRule() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/achievement/queryRule",
          data: {
            classId: this.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.tableTitles1 = ret.data.tableHeaderList;
            // this.tableTitles = [];
            // let clsRule = JSON.parse(ret.data.carClassRule);
            // let obj = {
            //   sign: "签到",
            //   answer: "应答",
            //   exercise: "作业",
            //   ccourse: "云课"
            // };
            // for (const key in clsRule) {
            //   clsRule[key].name = obj[key];
            //   this.tableTitles.push(clsRule[key]);
            // }
            // this.tableTitles = this.tableTitles.concat(
            //   JSON.parse(ret.data.carPaperRule)
            // );
            // this.resetInfinite();
          }
        });
    },
    loadScoreList($state) {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/achievement/listAchievementByPageV2",
          data: {
            classId: this.classId,
            page: this.page,
            pageSize: 9999
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.dealData(ret.data);
            if (ret.data.length) {
              // this.page++;
              // this.stuList.push(...ret.data);
              // this.stuList.push(...ret.data);
              // this.stuList.push(...ret.data);
              this.stuList = ret.data;
              // this.stuList.push(...ret.data);
            } else {
            }
          } else {
            if (sessionStorage.getItem("isSaveScore")) {
              this.$tours["myTour"].currentStep = 1;
            } else {
              this.$tours["myTour"].start();
            }
          }
        })
        .catch(() => {});
    },
    dealData(data) {
      data.forEach(d => {
        for (let i = 0; i < this.tableTitles.length; i++) {
          const title = this.tableTitles[i];
          if (title.name == "签到") {
            d.签到 = d.achievementSign ? d.achievementSign : 0;
            continue;
          }
          if (title.name == "应答") {
            d.应答 = d.achievementAnswer ? d.achievementAnswer : 0;
            continue;
          }
          if (title.name == "作业") {
            d.作业 = d.achievementExercise ? d.achievementExercise : 0;
            continue;
          }
          if (title.name == "云课") {
            d.云课 = d.achievementCCourse ? d.achievementCCourse : 0;
            continue;
          }
          var flag = false;
          for (let j = 0; j < d.items.length; j++) {
            const item = d.items[j];
            if (title.name == item.caiName) {
              d[title.name] = item.caiFinalScore
                ? item.caiFinalScore.toFixed(1)
                : 0;
              flag = true;
              break;
            }
          }
          if (!flag) {
            d[title.name] = 0;
          }
        }
      });
    },
    // 显示总分
    totalScore(row) {
      var total = 0;
      this.tableTitles.forEach(element => {
        total += parseFloat(row[element.name]);
      });
      return total.toFixed(1);
    },
    // 修改成绩
    inputChange(title, row) {
      let obj = {
        签到: "sign",
        应答: "answer",
        作业: "exercise",
        云课: "cCourse"
      };
      if (!obj.title) {
        obj[title] = title;
      }
      axios
        .request({
          method: "post",
          url: "clazz/v4/achievement/changeSingleAchievement",
          data: {
            classId: this.classId,
            stuId: row.sUid,
            name: obj[title],
            score: row[title]
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code != 200) {
            this.$message({
              type: "warning",
              message: ret.msg
            });
            this.changeFail(title, row);
          }
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "修改失败"
          });
          this.changeFail(title, row);
        });
    },
    // 修改失败
    changeFail(title, row) {
      if (title == "签到") {
        row[title] = row.achievementSign ? row.achievementSign : 0;
      }
      if (title == "应答") {
        row[title] = row.achievementAnswer ? row.achievementAnswer : 0;
      }
      if (title == "作业") {
        row[title] = row.achievementExercise ? row.achievementExercise : 0;
      }
      if (title == "云课") {
        row[title] = row.achievementCCourse ? row.achievementCCourse : 0;
      }
      for (let index = 0; index < row.items.length; index++) {
        const item = row.items[index];
        if (title == item.caiName) {
          row[title] = item.caiFinalScore ? item.caiFinalScore : 0;
          break;
        }
      }
    },
    // 下载模板
    downloadExcel() {
      let url =
        process.env.BASE_URL +
        "/v1/achievement/download?classId=" +
        this.classId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 上传成绩
    uploadExcel() {
      this.uploadFileLoading = false;
      this.uploadStuDialogShow = true;
      if (this.$refs.uploadFile) {
        this.$refs.uploadFile.clearFile();
      }
    },
    uploadFileChange(file) {
      this.uploadFile = file;
    },
    uploadFileSure() {
      if (this.uploadFile) {
        this.uploadFileLoading = true;
        let fd = new FormData();
        fd.append("file", this.uploadFile);
        fd.append("classId", this.classId);
        axios
          .request({
            method: "post",
            url: "v1/achievement/importAchievement",
            data: fd
          })
          .then(res => {
            this.uploadFileLoading = false;
            this.uploadStuDialogShow = false;
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: ret.msg
              });
              // this.loadScoreRule();
              this.loadScoreList();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          })
          .catch(() => {
            this.uploadFileLoading = false;
            this.$message({
              type: "warning",
              message: "导入失败,请稍后重试"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要上传的文件"
        });
      }
    },
    // 重置
    resetScore() {
      this.resetLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/achievement/resetAchievement",
          data: {
            classId: this.classId
          }
        })
        .then(res => {
          this.resetLoading = false;
          if (res.data.code == 200) {
            this.resetInfinite();
          } else {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
        })
        .catch(() => {
          this.resetLoading = false;
          this.$message({
            type: "warning",
            message: "重置失败"
          });
        });
    },
    // 导出
    exportScore() {
      let url =
        process.env.BASE_URL +
        "/v1/achievement/exportAchievement?classId=" +
        this.classId +
        "&className=" +
        this.cls.classname +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 重置列表
    resetInfinite() {
      this.page = 1;
      this.stuList = [];
      this.infiniteId += 1;
    },
    showDropdown(isShow) {
      if (isShow) {
        if (this.$tours["myTour"] && this.$tours["myTour"].currentStep == 1) {
          this.$tours["myTour"].stop();
        }
      }
    }
  }
};
</script>
