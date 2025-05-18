<template
  ><div class="create-exam">
    <el-container>
      <el-header style="height: 50px">
        <span @click="toExamManage" style="cursor:pointer;color:#2BA1F4;"
          >考试列表</span
        >
        <i class="el-icon-arrow-right"></i> <span>创建考试</span>
      </el-header>
      <el-main>
        <div class="top-part">
          <div class="top-part-l">
            <div class="content">
              <el-input
                v-model="examName"
                placeholder="设置考试名称"
              ></el-input>
              <el-button @click="toAddExamTimu" type="primary"
                >立即创建</el-button
              >
            </div>
          </div>
          <div class="top-part-r">
            <!-- <span>试卷导入</span> -->
            <el-button @click="toImportPaper" type="primary"
              >试卷导入</el-button
            >
          </div>
        </div>
        <div class="paper-list">
          <span class="copy-paper">复制试卷</span>
          <div class="list">
            <div class="paperEmpty" v-if="examList.length == 0">
              <img src="@/assets/images/empty.png" alt="" />
              <p>暂无试卷</p>
              <!-- <el-button type="primary" @click="handleAddTimu">添加试题</el-button> -->
            </div>
            <el-card
              v-for="(i, index) in examList"
              :key="index"
              class="box-card"
            >
              <div class="paper-content">
                <span class="paper-name" :title="i.examName">{{
                  i.examName
                }}</span>
                <div>
                  <span>共{{ i.subjectNum }}题</span>
                  <el-button type="text" @click="toViewPaper(i)"
                    >预览<i class="el-icon-view el-icon--right"></i>
                  </el-button>
                </div>
                <span>{{ i.score }}分</span>
              </div>
            </el-card>
          </div>
          <div class="pager">
            <el-pagination
              :hide-on-single-page="true"
              layout="prev, pager, next"
              background
              :total="page.total"
              :current-page.sync="page.currentPage"
              :page-size="page.pagesize"
              @current-change="getExamList"
            ></el-pagination>
          </div>
        </div>
      </el-main>
      <!-- 预览试卷 -->
      <el-dialog
        top="6vh"
        v-if="isViewPaperShow"
        :visible.sync="isViewPaperShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="handleCloseViewDialog"
        width="1200px"
        center
      >
        <template slot="title">
          <div>
            <div></div>
            <div>试卷预览</div>
          </div>
        </template>

        <viewPaper
          :examInfo="paperInfo"
          :timuListData="timuListData"
          :timuTotalScore="timuTotalScore"
        ></viewPaper>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="copyPaper" type="primary"
            >复制试卷</el-button
          >
          <el-button size="small" @click="isViewPaperShow = false"
            >取消</el-button
          >
        </span>
        <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
      </el-dialog>
      <!-- 试卷导入 -->
      <el-dialog
        top="6vh"
        v-if="isImportPaperShow"
        :visible.sync="isImportPaperShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="handleCloseImportPaper"
        width="1000px"
        center
      >
        <template slot="title">
          <div>
            <div></div>
            <div>试卷导入</div>
          </div>
        </template>

        <div class="top">
          <el-input
            size="small"
            v-model.trim="keyWord"
            placeholder="请输入试卷名称"
            style="width: 300px"
            @keyup.enter.native="searchPaper"
          ></el-input>
          <el-button
            type="primary"
            @click="searchPaper"
            class="el-icon-search"
            size="small"
          ></el-button>
        </div>
        <el-table
          @row-click="handleRowClick"
          v-loading="loading.tableLoading"
          :data="paperList"
          border
          style="margin-top:15px"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column align="center" label="" width="38">
            <template slot-scope="scope">
              <el-radio
                :label="scope.row.paperId"
                v-model="radioSelect"
                @change.native="getRow(scope.$index, scope.row)"
              >
                <span>&nbsp</span>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column label="试卷名称" prop="paperName">
            <template slot-scope="scope">
              <!-- style="color:#2BA1F4;" -->
              <span>{{ scope.row.paperName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="题目数量"
            prop="subjectNum"
            align="center"
            width="200px"
          >
          </el-table-column>
          <el-table-column
            label="总分"
            prop="totalScore"
            align="center"
            width="200px"
          >
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="createTime"
            align="center"
            width="200px"
          >
            <template slot-scope="scope">
              {{ dateFormat(scope.row.createTime) }}
            </template></el-table-column
          >
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从
            {{ (this.paperPage.currentPage - 1) * this.paperPage.pagesize + 1 }}
            到
            {{
              (this.paperPage.currentPage - 1) * this.paperPage.pagesize +
                this.paperList.length
            }}
            记录，共 {{ paperPage.total }} 条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            background
            :page-sizes="[10, 30, 50]"
            :total="paperPage.total"
            :current-page.sync="paperPage.currentPage"
            :page-size="paperPage.pagesize"
            @current-change="getPaperList"
          >
          </el-pagination>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button
            size="small"
            :disabled="isAbleImport"
            @click="doImportPaper"
            type="primary"
            >确定</el-button
          >

          <el-button size="small" @click="handleCloseImportPaper"
            >取消</el-button
          >
        </span>
        <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import { formatSS } from "@/utils/datetime";

import viewPaper from "./viewPaper.vue";

export default {
  components: {
    viewPaper
  },
  data() {
    return {
      radioSelect: "", // 试卷导入选中的试卷id
      radioCheck: {}, // 试卷导入选中的试卷id
      keyWord: "", // 试卷库试卷搜索关键字
      paperInfo: {},
      timuListData: [],
      timuTotalScore: 0,
      typeNum: 0,
      timuNum: 0,
      examName: "",
      isOn: false,
      className: "",
      stuNum: "",
      price: "",
      paperList: [],
      examList: [],
      loading: {
        tableLoading: false,
        loadingChangePrice: false
      },
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      paperPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      isViewPaperShow: false,
      isImportPaperShow: false // 试卷导入
    };
  },
  computed: {
    isAbleImport() {
      return !this.radioSelect;
    }
  },
  methods: {
    toAddExamTimu() {
      if (!this.examName) {
        this.$message({
          type: "warning",
          message: `请先设置考试名称`
        });
        return;
      }
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/create",
          data: {
            examName: this.examName
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            let { examId } = ret.data;
            this.$router.push({
              path: "/exam/examCreateNew",
              query: {
                examId
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    toExamManage() {
      this.$router.push({
        path: "/exam/examManage"
      });
    },
    copyPaper() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/copy",
          data: {
            examId: this.paperInfo.examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: `${ret.msg}`
            });

            let { examId } = ret.data;
            this.$router.push({
              path: "/exam/examCreateNew",
              query: {
                examId
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    toImportPaper() {
      this.getPaperList();
    },
    toViewPaper(i) {
      let { examId } = i;
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/getPaperDetail",
          data: {
            examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isViewPaperShow = true;
            let { examId, examName, score, subjectNum } = ret.data;
            this.paperInfo = { examId, examName, score, subjectNum };

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
    handleCloseViewDialog() {
      this.isViewPaperShow = false;
    },
    handleCloseImportPaper() {
      this.radioSelect = "";
      this.radioCheck = {};
      this.keyWord = "";
      this.paperPage.currentPage = 1;
      this.isImportPaperShow = false;
    },
    payChange(row) {
      console.log(row);
    },
    getExamList() {
      let data = {};
      // data.uid = 661605;
      data.pageNo = this.page.currentPage;
      data.pageSize = this.page.pagesize;
      // if (this.searchForm.examName) {
      //   data.searchWord = this.searchForm.examName;
      // }
      // if (this.searchForm.startTime) {
      //   data.startExamBeginTime = this.searchForm.startTime;
      // }
      // if (this.searchForm.endTime) {
      //   data.startExamEndTime = this.searchForm.endTime;
      // }
      // if (this.searchForm.status) {
      //   data.status = this.searchForm.status;
      // }
      axios
        .request({
          method: "post",
          // url: "/exam/exam/getExamList",
          url: "/exam/exam/paper/getHistoryPaperList",
          data: data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.examList = ret.data.records;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getPaperList() {
      let data = {};
      data.pageNo = this.paperPage.currentPage;
      data.pageSize = this.paperPage.pagesize;
      if (this.keyWord) {
        data.paperName = this.keyWord;
      }
      axios
        .request({
          method: "post",
          // url: "/tiku/paper/list",
          url: "/exam/exam/paper/getPaperList",
          data: data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isImportPaperShow = true;
            this.paperList = ret.data.data;
            this.paperPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    searchPaper() {
      this.paperPage.currentPage = 1;
      this.getPaperList();
    },
    // 试卷导入
    doImportPaper() {
      if (!this.radioSelect) {
        this.$message({
          type: "warning",
          message: "您还没有选择试卷"
        });
        return;
      }
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/importPaper",
          data: {
            paperId: this.radioSelect
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isImportPaperShow = false;
            let { examId } = ret.data;
            this.$router.push({
              path: "/exam/examCreateNew",
              query: {
                examId
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    handleRowClick(row, column, event) {
      this.radioSelect = row.paperId;
      this.radioCheck = row;
    },
    getRow(i, row) {
      this.radioCheck = row;
    },
    // 时间格式化
    dateFormat(row) {
      return formatSS(row);
    }
  },
  mounted() {
    this.getExamList();
  }
};
</script>

<style lang="scss" scoped>
.create-exam {
  position: relative;
  // /deep/.el-dialog {
  //     margin: 5vh auto !important;
  //   }

  /deep/ .el-dialog__body {
    height: 75vh;
    overflow: hidden;
    overflow-y: auto;
  }

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

    .top-part {
      width: 100%;
      height: 200px;
      // background-color: red;
      margin-bottom: 40px;
      display: flex;
      .top-part-l {
        width: 500px;
        margin-right: 80px;
        height: 100%;
        border: 1px solid #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
        .content {
          text-align: center;
          height: 130px;
          .el-button {
            margin-top: 10px;
          }
        }
      }
      .top-part-r {
        width: 500px;
        height: 100%;
        border: 1px solid #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .paper-list {
      // display: flex;
      // flex-direction: column;
      overflow: hidden;
      .copy-paper {
        display: block;
        margin-bottom: 20px;
      }
      .list {
        overflow: hidden;
        .paperEmpty {
          margin-top: 80px;
          text-align: center;
        }
        .box-card {
          width: 300px;
          height: 160px;
          float: left;
          margin-right: 20px;
          margin-bottom: 20px;
          .paper-content {
            width: 100%;
            height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .paper-name {
              font-weight: bold;
              font-size: 20px;
              word-break: break-all;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2; /* 这里是超出几行省略 */
              overflow: hidden;
            }
          }
        }
      }
      .pager {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
