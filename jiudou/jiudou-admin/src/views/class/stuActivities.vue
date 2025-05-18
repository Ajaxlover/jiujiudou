<template>
  <div>
    <el-container class="ebPressRecommend">
      <el-main>
        <el-input
          size="small"
          v-model="conditions"
          placeholder="手机号码或学号"
          style="width: 250px;margin-bottom:10px;"
          @keyup.enter.native="loadList"
        ></el-input>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="loadList"
        ></el-button>
        <el-table
          @selection-change="changeSelect"
          :data="list"
          v-loading="loading.list"
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
          <el-table-column
            label="手机号"
            align="center"
            prop="sMobile"
          ></el-table-column>
          <el-table-column
            :label="`签到(共${dataNum.signTotalNum}次)`"
            align="center"
            prop="signNum"
          ></el-table-column>
          <el-table-column
            :label="`应答提交(共${dataNum.answerTotalNum}次)`"
            align="center"
            prop="answerNum"
          ></el-table-column>
          <el-table-column
            label="应答正确率"
            align="center"
            prop="answerRate"
          ></el-table-column>
          <el-table-column
            :label="`作业提交(共${dataNum.exerciseTotalNum}次)`"
            align="center"
            prop="exerciseNum"
          ></el-table-column>
          <el-table-column
            label="作业正确率"
            align="center"
            prop="exerciseRate"
          ></el-table-column>
          <!-- <el-table-column label="加入时间" align="center" width="150">
            <template slot-scope="scope">{{
              formatTime(scope.row.addTime)
            }}</template>
          </el-table-column> -->
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="signRecord(scope.row)"
                >签到</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="answerRecord(scope.row)"
                >应答</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="homeworkRecord(scope.row)"
                >作业</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="list.length" class="right-footer-first">
            从{{ (listPage.page - 1) * listPage.pageSize + 1 }}到{{
              (listPage.page - 1) * listPage.pageSize + list.length
            }}记录，共{{ listPage.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="listPage.total"
            :page-size="listPage.pageSize"
            :current-page.sync="listPage.page"
            background
            @current-change="loadList"
          ></el-pagination>
        </div>
      </el-main>
    </el-container>
    <jdialog
      title="签到统计"
      :noFooter="true"
      :visible.sync="dialogVisible.isShow"
      width="800px"
    >
      <template slot="body">
        <div class="dialogHeader">
          <div>
            <span style="color:#333;font-size:16px;">
              姓名：{{ stuRealName }}</span
            >
            <span style="color:#666;font-size:16px;margin-left:17px;">
              学号：{{ stuNumber }}
            </span>
          </div>
          <el-button
            type="primary"
            :disabled="!signTableList.length"
            size="small"
            @click="exportSignRecords"
            >导出</el-button
          >
        </div>
        <div class="dialogSummery">
          <!-- <span class="summary">签到率：{{ signSummary.signedRate }}</span> -->
          <span>已签到：{{ stuSignInfo.hasSign }}</span>
          <span>迟到：{{ stuSignInfo.late }}</span>
          <span>病假：{{ stuSignInfo.sickLeave }}</span>
          <span>事假：{{ stuSignInfo.privateAffairLeave }}</span>
          <span>缺勤：{{ stuSignInfo.notSign }}</span>
        </div>
        <el-table
          class="dialogTable"
          :data="signTableList"
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
          <el-table-column label="签到" align="center">
            <template slot-scope="scope"
              >{{ formatTime(Number(scope.row.startTime)) }}签到</template
            >
          </el-table-column>
          <!-- <el-table-column
            label="姓名"
            align="center"
            prop="classname"
          ></el-table-column> -->
          <!-- <el-table-column label="签到时间" align="center">
            
          </el-table-column> -->
          <el-table-column label="签到状态" align="center">
            <div slot-scope="scope">{{ formatStatus(scope.row.status) }}</div>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="signTableList.length" class="right-footer-first">
            从{{ (signPage.page - 1) * signPage.pageSize + 1 }}到{{
              (signPage.page - 1) * signPage.pageSize + signTableList.length
            }}记录，共{{ signPage.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="signPage.total"
            :page-size="signPage.pageSize"
            :current-page.sync="signPage.page"
            background
            @current-change="loadSignRecords"
          ></el-pagination>
        </div>
      </template>
    </jdialog>

    <jdialog
      title="应答统计"
      :noFooter="true"
      :visible.sync="dialogVisible.answerShow"
      width="800px"
    >
      <template slot="body">
        <div class="dialogHeader">
          <div>
            <span style="color:#333;font-size:16px;">
              姓名：{{ stuRealName }}</span
            >
            <span style="color:#666;font-size:16px;margin-left:17px;">
              学号：{{ stuNumber }}
            </span>
          </div>
          <el-button
            type="primary"
            :disabled="!answerTableList.length"
            size="small"
            @click="exportAnswerRecords"
            >导出</el-button
          >
        </div>
        <div class="dialogSummery">
          <!-- <span class="summary">签到率：{{ signSummary.signedRate }}</span> -->
          <span>已答：{{ stuAnswerInfo.answer }}</span>
          <span>未答：{{ stuAnswerInfo.notAnswer }}</span>
        </div>
        <el-table
          class="dialogTable"
          :data="answerTableList"
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
          <el-table-column label="应答" align="center">
            <template slot-scope="scope"
              >{{ formatTime(Number(scope.row.startTime)) }}应答</template
            >
          </el-table-column>
          <!-- <el-table-column
            label="姓名"
            align="center"
            prop="classname"
          ></el-table-column> -->
          <!-- <el-table-column label="签到时间" align="center">
            
          </el-table-column> -->
          <el-table-column label="应答状态" align="center">
            <div slot-scope="scope">
              {{ formatAnswerStatus(scope.row.status) }}
            </div>
          </el-table-column>
          <el-table-column label="应答情况" align="center">
            <div slot-scope="scope">
              {{ formatRightStatus(scope.row.isRight) }}
            </div>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="answerTableList.length" class="right-footer-first">
            从{{ (answerPage.page - 1) * answerPage.pageSize + 1 }}到{{
              (answerPage.page - 1) * answerPage.pageSize +
                answerTableList.length
            }}记录，共{{ answerPage.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="answerPage.total"
            :page-size="answerPage.pageSize"
            :current-page.sync="answerPage.page"
            background
            @current-change="loadAnswerRecords"
          ></el-pagination>
        </div>
      </template>
    </jdialog>

    <jdialog
      title="作业统计"
      :noFooter="true"
      :visible.sync="dialogVisible.homeworkShow"
      width="800px"
    >
      <template slot="body">
        <div class="dialogHeader">
          <div>
            <span style="color:#333;font-size:16px;">
              姓名：{{ stuRealName }}</span
            >
            <span style="color:#666;font-size:16px;margin-left:17px;">
              学号：{{ stuNumber }}
            </span>
          </div>
          <el-button
            type="primary"
            :disabled="!homeworkTableList.length"
            size="small"
            @click="exportWorkRecords"
            >导出</el-button
          >
        </div>
        <div class="dialogSummery">
          <span>作业总次数：{{ stuHomeworkInfo.total }}</span>
          <span>已提交次数：{{ stuHomeworkInfo.fulfilTotal }}</span>
          <span>未提交次数：{{ stuHomeworkInfo.unfinishedTotal }}</span>
          <span>平均分：{{ avgScore }}</span>
        </div>
        <el-table
          class="dialogTable"
          :data="homeworkTableList"
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
            label="作业名"
            align="center"
            prop="exercises_name"
          ></el-table-column>
          <el-table-column
            label="总题数"
            align="center"
            prop="totalTitle"
          ></el-table-column>
          <el-table-column
            label="答对题数"
            align="center"
            prop="correctTitle"
          ></el-table-column>
          <el-table-column
            label="分数"
            align="center"
            prop="score"
          ></el-table-column>
          <!-- <el-table-column
            label="姓名"
            align="center"
            prop="classname"
          ></el-table-column> -->
          <!-- <el-table-column label="签到时间" align="center">
            
          </el-table-column> -->
          <el-table-column label="作业状态" align="center">
            <div slot-scope="scope">
              {{ formatHomeworkStatus(scope.row.status) }}
            </div>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="homeworkTableList.length" class="right-footer-first">
            从{{ (homeworkPage.page - 1) * homeworkPage.pageSize + 1 }}到{{
              (homeworkPage.page - 1) * homeworkPage.pageSize +
                homeworkTableList.length
            }}记录，共{{ homeworkPage.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="homeworkPage.total"
            :page-size="homeworkPage.pageSize"
            :current-page.sync="homeworkPage.page"
            background
            @current-change="loadHomeworkRecords"
          ></el-pagination>
        </div>
      </template>
    </jdialog>
  </div>
</template>

<style lang="scss">
.dialogHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dialogSummery {
  margin-top: 26px;
  background: #fbf8eb;
  color: #ac7427;
  font-size: 16px;
  border: 1px solid #e6d3b7;
  border-radius: 4px;
  .summary {
    background: #fbe265;
    padding-left: 31px;
    padding-right: 21px;
  }
}
.dialogSummery > span {
  padding: 13px 9px 18px 28px;
  display: inline-block;
}
.dialogTable {
  border-radius: 4px;
  border: 1px solid rgba(13, 67, 118, 0.2);
  margin-top: 22px;
}
.ebPressRecommend {
  .el-header {
    height: 50px;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
    background: #ffffff;
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding-top: 12px;
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 12px;
  }
  .cover {
    background: #f3f4f5;
    width: 224px;
    height: 350px;
    line-height: 350px;
    font-size: 30px;
    text-align: center;
    cursor: pointer;
    overflow: hidden;
    border: 1px solid #ccc;
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
import cropper from "@/components/cropper";
export default {
  components: {
    jdialog,
    cropper
  },
  props: {
    className: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      cls: {},
      conditions: "",
      selectedRecords: [],
      list: [], // 学生列表
      loading: {
        list: false,
        sureCropLoading: false,
        editSureLoading: false
      },
      listPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      signPage: {
        page: 1,
        pageSize: 5,
        total: 0
      },
      answerPage: {
        page: 1,
        pageSize: 5,
        total: 0
      },
      homeworkPage: {
        page: 1,
        pageSize: 5,
        total: 0
      },
      dialogVisible: {
        isShow: false,
        answerShow: false,
        homeworkShow: false
      },
      signTableList: [],
      stuSignInfo: {},
      answerTableList: [],
      stuAnswerInfo: {},
      homeworkTableList: [],
      stuHomeworkInfo: {},
      sid: 0,
      avgScore: 0,
      stuRealName: "", // 学生真实姓名
      stuNumber: "", // 学号
      dataNum: {
        exerciseTotalNum: 0,
        answerTotalNum: 0,
        signTotalNum: 0
      }
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.queryDataNum();
    this.loadList();
  },
  methods: {
    changeSelect(val) {
      // this.selectedRecords = val;
    },
    queryDataNum() {
      axios
        .request({
          method: "post",
          url: "/clazz/evaluate/queryDataNum",
          data: {
            classId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.dataNum.answerTotalNum = ret.data.answerTotalNum;
            this.dataNum.exerciseTotalNum = ret.data.exerciseTotalNum;
            this.dataNum.signTotalNum = ret.data.signTotalNum;
          }
        })
        .catch(() => {});
    },
    loadList() {
      this.loading.list = true;
      axios
        .request({
          method: "post",
          // url: "/clazz/evaluate/memberEvaluate",
          url: "/clazz/evaluate/queryStuDataList",
          data: {
            keyWord: this.conditions,
            page: this.listPage.page,
            pageSize: this.listPage.pageSize,
            classId: this.cls.classId
          }
        })
        .then(res => {
          this.loading.list = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.list = ret.data.data;
            this.listPage.total = ret.data.total;
          }
        })
        .catch(() => {
          this.loading.list = false;
        });
    },
    // 导出
    exportSignRecords() {
      let url =
        process.env.BASE_URL +
        "/v1/clazz/stuSignDetail?classId=" +
        this.cls.classId +
        "&uid=" +
        this.sid +
        "&className=" +
        this.className +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    exportWorkRecords() {
      let url =
        process.env.BASE_URL +
        "/clazz/v4/exercise/exercisesStuXlsx?classId=" +
        this.cls.classId +
        "&uid=" +
        this.sid +
        "&className=" +
        this.className +
        "&stuName=" +
        this.stuRealName +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    exportAnswerRecords() {
      let url =
        process.env.BASE_URL +
        "/clazz/f1/answer/answerStuXlsx?classId=" +
        this.cls.classId +
        "&uid=" +
        this.sid +
        "&className=" +
        this.className +
        "&stuName=" +
        this.stuRealName +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    async signRecord(row) {
      this.sid = row.sUid;
      this.stuRealName = row.sRealName;
      this.stuNumber = row.sNumber;
      this.loadSignRecords();
      this.dialogVisible.isShow = true;
    },
    loadSignRecords() {
      axios
        .request({
          method: "post",
          url: "clazz/signV2/studentSign",
          data: {
            sId: this.sid,
            page: this.signPage.page,
            pageSize: this.signPage.pageSize,
            classId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.signTableList = ret.data.ClazzSignStuWithSign;
            this.stuSignInfo = ret.data.signTotal;
            let {
              absenteeism,
              hasSign,
              late,
              notSign,
              sickLeave,
              privateAffairLeave
            } = ret.data.signTotal;
            this.signPage.total =
              absenteeism +
              hasSign +
              late +
              notSign +
              sickLeave +
              privateAffairLeave;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    answerRecord(row) {
      this.dialogVisible.answerShow = true;
      this.sid = row.sUid;
      this.stuRealName = row.sRealName;
      this.stuNumber = row.sNumber;
      this.loadAnswerRecords();
    },
    loadAnswerRecords() {
      axios
        .request({
          method: "post",
          url: "clazz/v1/answer/answersStuDetails",
          data: {
            sId: this.sid,
            page: this.answerPage.page,
            pageSize: this.answerPage.pageSize,
            classId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            ret.data.answerList.forEach(i => {
              if (i.status == 1) {
                if (i.answerName == i.answerRight) {
                  i.isRight = 1;
                } else {
                  i.isRight = 0;
                }
              } else {
                i.isRight = 2;
              }
            });
            this.answerTableList = ret.data.answerList;
            this.stuAnswerInfo = ret.data.answerMap;
            let { answer, notAnswer } = ret.data.answerMap;
            this.answerPage.total = answer + notAnswer;
          }
        });
    },
    homeworkRecord(row) {
      this.dialogVisible.homeworkShow = true;
      this.sid = row.sUid;
      this.stuRealName = row.sRealName;
      this.stuNumber = row.sNumber;
      this.loadHomeworkRecords();
    },
    loadHomeworkRecords() {
      axios
        .request({
          method: "post",
          url: "clazz/exercise/classAchievement",
          data: {
            sId: this.sid,
            page: this.homeworkPage.page,
            pageSize: this.homeworkPage.pageSize,
            classId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.homeworkTableList = ret.data.exercisesMapList;
            this.stuHomeworkInfo = ret.data.exercisesMap;
            this.avgScore = ret.data.avg;
            let { total } = ret.data.exercisesMap;
            this.homeworkPage.total = total;
          }
        });
    },
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    },
    formatStatus(val) {
      if (val == 0) {
        return "未签到";
      } else if (val == 1) {
        return "已签到";
      } else if (val == 2) {
        return "缺勤";
      } else if (val == 3) {
        return "病假";
      } else if (val == 4) {
        return "事假";
      } else if (val == 5) {
        return "迟到";
      }
    },
    formatHomeworkStatus(val) {
      if (val == 0) {
        return "未提交";
      } else if (val == 1) {
        return "待批阅";
      } else if (val == 2) {
        return "已批阅";
      }
    },
    formatAnswerStatus(val) {
      if (val == 0) {
        return "未答";
      } else if (val == 1) {
        return "已答";
      }
    },
    formatRightStatus(val) {
      if (val == 1) {
        return "正确";
      } else if (val == 0) {
        return "错误";
      } else if (val == 2) {
        return "";
      }
    }
  }
};
</script>
