<template
  ><div class="contest-upgrade">
    <el-container>
      <el-header style="height: 50px">
        <span @click="toExamManage" style="cursor:pointer;color:#2BA1F4;"
          >竞赛列表</span
        >
        <i class="el-icon-arrow-right"></i> <span>竞赛查看</span>
      </el-header>
      <el-main>
        <el-tabs
          class="parentTab"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane label="竞赛成绩" name="first">
            <el-form @submit.native.prevent size="small" :inline="true">
              <el-form-item label="分值区间">
                <el-input
                  v-model="searchForm.minScore"
                  placeholder="起始分值"
                  style="width: 100px;"
                ></el-input>
                -
                <el-input
                  placeholder="结束分值"
                  v-model="searchForm.maxScore"
                  style="width: 100px;"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="批阅状态">
                <el-select
                  :popper-append-to-body="false"
                  style="width: 90px"
                  v-model="searchForm.status"
                  placeholder="请选择"
                  @change="search"
                >
                  <el-option label="全部" value="0"></el-option>
                  <el-option label="未批阅" value="1"></el-option>
                  <el-option label="已批阅" value="2"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="">
                <el-input
                  v-model="searchForm.keyWord"
                  placeholder="请输入学生姓名/学校/手机号/学号"
                  @keyup.enter.native="search"
                  style="width: 240px;"
                ></el-input>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="search"
                  size="small"
                ></el-button>
              </el-form-item>
              <el-form-item label="" style="float:right">
                <el-button
                  :disabled="isAbleScoreExport"
                  @click="exportStuScore"
                  type="primary"
                  size="small"
                  >导出</el-button
                >
              </el-form-item>
              <el-form-item label="" style="float:right">
                <!-- :disabled="isAbleUpgrade" -->
                <el-button
                  type="primary"
                  :disabled="isAbleUpgrade"
                  @click="toUpgrade"
                  size="small"
                  >晋级</el-button
                >
              </el-form-item>
              <el-form-item label="" style="float:right">
                <!-- <el-button type="primary" size="small">全选</el-button> -->
              </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <div class="main">
              <el-table
                ref="stuTable"
                :data="stuList"
                border
                row-key="id"
                @selection-change="selectChange"
                :header-cell-style="{
                  'background-image':
                    'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                  color: '#333333',
                  height: '40px',
                  padding: '0'
                }"
                :row-style="{ height: '60px' }"
                v-loading="loading.tableLoading"
              >
                <el-table-column
                  :reserve-selection="true"
                  type="selection"
                  :selectable="checkSelectable"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="学生姓名"
                  align="center"
                  min-width="80"
                >
                </el-table-column>
                <el-table-column
                  prop="school"
                  label="学校"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="department"
                  label="学院"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="profession"
                  label="专业"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="number"
                  label="学号"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="email"
                  label="邮箱"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="appointTeacher"
                  label="指导老师"
                  align="center"
                  min-width="80"
                >
                </el-table-column>
                <el-table-column
                  prop="score"
                  label="成绩"
                  align="center"
                  min-width="50"
                >
                </el-table-column>
                <el-table-column
                  prop="status"
                  label="是否晋级"
                  align="center"
                  min-width="60"
                >
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status >= 5" type="success"
                      >已晋级</el-tag
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="tabelFooter">
                <div class="right-footer-first">
                  从
                  {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
                  {{
                    (this.page.currentPage - 1) * this.page.pagesize +
                      this.stuList.length
                  }}
                  记录，共 {{ page.total }} 条
                </div>
                <el-pagination
                  layout="prev, pager, next, jumper"
                  background
                  :total="page.total"
                  :current-page.sync="page.currentPage"
                  :page-size="page.pagesize"
                  @current-change="loadData"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="labelText" name="second">
            <el-form @submit.native.prevent size="small" :inline="true">
              <!-- <el-form-item label="分值区间">
                <el-input
                  v-model.trim="searchForm1.minScore"
                  placeholder="起始分值"
                  style="width: 100px;"
                ></el-input>
                -
                <el-input
                  placeholder="结束分值"
                  v-model.trim="searchForm1.maxScore"
                  style="width: 100px;"
                ></el-input>
              </el-form-item> -->
              <!-- <el-form-item label="批阅状态">
                <el-select
                  :popper-append-to-body="false"
                  style="width: 90px"
                  v-model="searchForm1.status"
                  placeholder="请选择"
                  @change="search"
                >
                  <el-option label="全部" value="0"></el-option>
                  <el-option label="未批阅" value="1"></el-option>
                  <el-option label="已批阅" value="2"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="">
                <el-input
                  v-model.trim="searchForm1.keyWord"
                  placeholder="请输入学生姓名/学校/手机号/学号"
                  style="width: 240px;"
                  @keyup.enter.native="searchGraded"
                ></el-input>
                <el-select
                  v-model="searchForm1.honor"
                  placeholder="请选择活动区域"
                  @change="searchGraded"
                >
                  <el-option
                    v-for="item in honorList1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="searchGraded"
                  size="small"
                ></el-button>
              </el-form-item>
              <el-form-item label="" style="float:right">
                <el-button
                  type="primary"
                  :disabled="isAbleExport"
                  @click="exportStu"
                  size="small"
                  >导出</el-button
                >
              </el-form-item>
              <el-form-item label="" style="float:right">
                <!-- <el-button
                  type="primary"
                  :disabled="isAbleSendMsg"
                  @click="sendMsgToStu"
                  size="small"
                  >发送通知</el-button
                > -->
                <el-button
                  type="primary"
                  :disabled="isAbleSendMsg"
                  @click="toSendNotice"
                  size="small"
                  >发送通知</el-button
                >
              </el-form-item>
              <el-form-item label="" style="float:right">
                <el-button
                  type="primary"
                  :disabled="isAbleSendMsg"
                  @click="repealStu"
                  size="small"
                  >撤销晋级</el-button
                >
                <!-- <el-button type="primary" size="small">全选</el-button> -->
              </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <div class="main">
              <el-table
                ref="upgradeTable"
                :data="stuList1"
                border
                row-key="id"
                @selection-change="upgradedSelectChange"
                :header-cell-style="{
                  'background-image':
                    'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                  color: '#333333',
                  height: '40px',
                  padding: '0'
                }"
                :row-style="{ height: '60px' }"
                v-loading="loading.tableLoading1"
              >
                <el-table-column
                  :reserve-selection="true"
                  :selectable="checkSendMsg"
                  type="selection"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="学生姓名"
                  align="center"
                  min-width="80"
                >
                </el-table-column>
                <el-table-column
                  prop="school"
                  label="学校"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="department"
                  label="学院"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="profession"
                  label="专业"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="number"
                  label="学号"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="email"
                  label="邮箱"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="appointTeacher"
                  label="指导老师"
                  align="center"
                  min-width="80"
                >
                </el-table-column>
                <el-table-column
                  prop="status"
                  label="是否通知"
                  align="center"
                  min-width="60"
                >
                  <template slot-scope="scope">
                    <!-- <el-tag v-if="scope.row.status == 5" type="success"
                      >已晋级</el-tag
                    > -->
                    <el-tag v-if="scope.row.status == 6" type="success"
                      >已通知</el-tag
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="awardName"
                  label="所获奖项"
                  align="center"
                  min-width="60"
                >
                </el-table-column>
                <el-table-column label="证书" align="center" min-width="60">
                  <template slot-scope="scope">
                    <el-image
                      v-if="scope.row.stuAwardUrl"
                      style="width: 50px; height: 50px"
                      :src="scope.row.stuAwardUrl"
                      :preview-src-list="arryWay(scope.row.stuAwardUrl)"
                    >
                    </el-image>
                    <span v-else>无</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="tabelFooter">
                <div class="right-footer-first">
                  从
                  {{ (this.page1.currentPage - 1) * this.page1.pagesize + 1 }}
                  到
                  {{
                    (this.page1.currentPage - 1) * this.page1.pagesize +
                      this.stuList1.length
                  }}
                  记录，共 {{ page1.total }} 条
                </div>
                <el-pagination
                  layout="prev, pager, next, jumper"
                  background
                  :total="page1.total"
                  :current-page.sync="page1.currentPage"
                  :page-size="page1.pagesize"
                  @current-change="getGradedStuList"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-main>

      <jd-dialog
        top="12vh"
        title="发送通知"
        v-if="isSendNoticeShow"
        :loading="loading.sendNoticeLoading"
        :visible.sync="isSendNoticeShow"
        :close_on_click_modal="false"
        @sure="sendNotice"
      >
        <template slot="body">
          <el-form
            :model="form"
            size="small"
            label-position="right"
            label-width="100px"
            ref="editBanner"
            style="padding-left:40px;padding-right:100px;"
          >
            <el-form-item label="奖项">
              <el-select v-model="form.honor" placeholder="请选择活动区域">
                <el-option
                  v-for="item in honorList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            按确认,发送奖项与邀请函，最后一轮只有发奖通知，没有邀请函。
          </el-form>
        </template>
      </jd-dialog>
    </el-container>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import { formatSS } from "@/utils/datetime";
import jdialog from "@/components/jdialog";

// import common from "@/utils/common";

export default {
  components: {
    "jd-dialog": jdialog
  },
  data() {
    return {
      labelText: "晋级名单",
      form: {
        honor: 0
      },
      isSendNoticeShow: false, // 发送通知
      honorList: [],
      honorList1: [],
      isLast: this.$route.query.isLast,
      masterheadId: this.$route.query.masterheadId,
      competeId: this.$route.query.competeId,
      activeName: "first",
      stuList: [],
      stuList1: [],
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      page1: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      searchForm: {
        minScore: "",
        maxScore: "",
        keyWord: "",
        status: "0"
      },
      searchForm1: {
        minScore: "",
        maxScore: "",
        keyWord: "",
        status: "0",
        honor: ""
      },
      selectedStu: [],
      selectedUpgradedStu: [],
      loading: {
        tableLoading: false,
        tableLoading1: false,
        sendNoticeLoading: false
      }
    };
  },
  computed: {
    isAbleScoreExport() {
      return this.stuList.length == 0;
    },
    isAbleUpgrade() {
      return this.selectedStu.length == 0;
    },
    isAbleSendMsg() {
      return this.selectedUpgradedStu.length == 0;
    },
    isAbleExport() {
      return this.stuList1.length == 0;
    }
  },
  methods: {
    // 证书预览
    arryWay(string) {
      let arry = [];
      arry.push(string);
      return arry;
    },
    toSendNotice() {
      this.getHonorList();
    },
    sendNotice() {
      let ids = [];
      this.selectedUpgradedStu.forEach(i => {
        ids.push(i.uid);
      });
      let data = {};
      data.ids = ids.join(",");
      data.competeId = this.competeId;
      if (this.form.honor > 0) {
        data.awardId = this.form.honor;
      }
      this.loading.sendNoticeLoading = true;
      axios
        .request({
          method: "post",
          url: "/exam/masterHeadCompeteStu/sendUpgrade",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.loading.sendNoticeLoading = false;
            this.$message({
              type: "success",
              message: "发送通知成功"
            });
            this.$refs.upgradeTable.clearSelection();
            this.isSendNoticeShow = false;
            this.getGradedStuList();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 获取全部奖项
    getHonorList1() {
      axios
        .request({
          method: "post",
          url: "/exam/masterHead/award/findAllOfMasterHead",
          data: {
            masterheadId: this.masterheadId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.honorList1 = [];
            ret.data.unshift({
              code: "",
              coverUrl: "",
              id: "",
              name: "全部"
            });
            this.honorList1 = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 获取全部奖项
    getHonorList() {
      axios
        .request({
          method: "post",
          url: "/exam/masterHead/award/findAllOfMasterHead",
          data: {
            masterheadId: this.masterheadId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.honorList = [];
            ret.data.push({
              code: "",
              coverUrl: "",
              id: "",
              name: "不发奖"
            });
            this.honorList = ret.data;
            this.isSendNoticeShow = true;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    checkSelectable(row, index) {
      let flag = true;
      for (let i = 0; i < this.stuList.length; i++) {
        if (row.status >= 5) {
          // status=5  已晋级
          flag = false;
          break;
        } else {
          flag = true;
        }
      }
      return flag;
    },
    checkSendMsg(row, index) {
      let flag = true;
      for (let i = 0; i < this.stuList.length; i++) {
        if (row.status == 6) {
          // status=6  已发送过通知
          flag = false;
          break;
        } else {
          flag = true;
        }
      }
      return flag;
    },
    // 撤销晋级
    repealStu() {
      this.$confirm("是否立即撤销当前选中的学生晋级?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = [];
          this.selectedUpgradedStu.forEach(i => {
            ids.push(i.uid);
          });
          axios
            .request({
              method: "post",
              url: "/exam/masterHeadCompeteStu/repeal",
              data: {
                ids: ids.join(","),
                competeId: this.competeId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: "撤销晋级成功"
                });
                this.$refs.upgradeTable.clearSelection();
                this.getGradedStuList();
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
    // 发送晋级通知给学生
    sendMsgToStu() {
      this.$confirm("是否立即给选中的晋级名单中的学生发送通知?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = [];
          this.selectedUpgradedStu.forEach(i => {
            ids.push(i.uid);
          });
          axios
            .request({
              method: "post",
              url: "/exam/masterHeadCompeteStu/sendUpgrade",
              data: {
                ids: ids.join(","),
                competeId: this.competeId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: "发送通知成功"
                });
                this.$refs.upgradeTable.clearSelection();

                this.getGradedStuList();
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
    toUpgrade() {
      this.$confirm("选中的学生将晋级通过本轮竞赛?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = [];
          this.selectedStu.forEach(i => {
            ids.push(i.uid);
          });
          axios
            .request({
              method: "post",
              url: "/exam/masterHeadCompeteStu/upgrade",
              data: {
                ids: ids.join(","),
                competeId: this.competeId,
                masterheadId: this.masterheadId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: "晋级成功，请前往晋级名单中查看并发送通知"
                });
                // this.selectedStu = [];
                this.$refs.stuTable.clearSelection();
                this.loadData();
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
    selectChange(select) {
      this.selectedStu = select;
    },
    upgradedSelectChange(select) {
      this.selectedUpgradedStu = select;
    },
    // 获取已晋级名单
    getGradedStuList() {
      this.loading.tableLoading1 = true;
      let data = {
        competeId: this.competeId,
        status: 5
      };
      // data.uid = 661605;
      data.pageNo = this.page1.currentPage;
      data.pageSize = this.page1.pagesize;
      // if (this.searchForm1.minScore) {
      //   data.startScore = this.searchForm1.minScore;
      // }
      // if (this.searchForm1.maxScore) {
      //   data.endScore = this.searchForm1.maxScore;
      // }
      if (this.searchForm1.keyWord) {
        data.keyWord = this.searchForm1.keyWord;
      }

      // 奖项
      data.awardId = this.searchForm1.honor;

      axios
        .request({
          method: "post",
          url: "/exam/masterHeadStu/competeList", // 已晋级名单
          data: data
        })
        .then(res => {
          this.loading.tableLoading1 = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.stuList1 = ret.data.records;
            this.page1.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    loadData() {
      this.loading.tableLoading = true;
      let data = {
        competeId: this.competeId
      };
      // data.uid = 661605;
      data.pageNo = this.page.currentPage;
      data.pageSize = this.page.pagesize;
      if (this.searchForm.minScore) {
        data.startScore = this.searchForm.minScore;
      }
      if (this.searchForm.maxScore) {
        data.endScore = this.searchForm.maxScore;
      }
      if (this.searchForm.keyWord) {
        data.keyWord = this.searchForm.keyWord;
      }

      axios
        .request({
          method: "post",
          url: "/exam/masterHeadStu/competeList",
          data: data
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.stuList = ret.data.records;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    search() {
      this.page.currentPage = 1;
      this.loadData();
    },
    searchGraded() {
      this.page1.currentPage = 1;
      this.getGradedStuList();
    },
    handleClick(tab, event) {
      if (tab.name == "first") {
        this.loadData();
      }
      if (tab.name == "second") {
        this.getHonorList1();
        this.getGradedStuList();
      }
    },

    toExamManage() {
      this.$router.push({
        path: "/operation/contestManage"
      });
    },
    // 导出竞赛成绩
    exportStuScore() {
      let url =
        process.env.BASE_URL +
        "/exam/masterHeadStu/exportCompeteListXls?competeId=" +
        this.competeId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 导出晋级学生名单
    exportStu() {
      let url =
        process.env.BASE_URL +
        "/exam/masterHeadCompeteStu/exportXls?competeId=" +
        this.competeId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    dateFormat(row) {
      return formatSS(row);
    }
  },
  mounted() {
    if (this.isLast == 1) {
      this.labelText = "获奖名单";
    }
    this.loadData();
  }
};
</script>

<style lang="scss" scoped>
.contest-upgrade {
  position: relative;

  .el-header {
    width: 100%;
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 720px;
    padding-top: 12px;
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 12px;
    .parentTab {
    }
  }
}
</style>
