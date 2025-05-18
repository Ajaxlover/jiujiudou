<template>
  <div class="cloudProgress">
    <div v-if="cls.cCourseUuid">
      <div class="container">
        <div class="aside">
          <div class="title">云课</div>
          <div style="width:200px;">
            <div class="summery">
              <span>整体进度：</span
              ><span class="number">{{
                info.singleTotalNum * info.stuNum > 0
                  ? Math.round(
                      (100 * info.totalDoneNum) /
                        (info.singleTotalNum * info.stuNum)
                    )
                  : 0
              }}</span
              ><span class="unit">%</span>
            </div>
            <div class="summery">
              <span>今日学习：</span
              ><span class="number">{{ info.todayStudyNum }}</span
              ><span class="unit">人</span>
            </div>
            <div class="summery">
              <span>结&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;课：</span
              ><span class="number">{{ info.finishNum }}</span
              ><span class="unit">人</span>
            </div>
          </div>
        </div>
        <img style="width:10px;" src="@/assets/images/img_line.png" />
        <div class="box">
          <div>
            <div style="display:flex;align-items:center;">
              优秀&nbsp;
              <el-tooltip
                effect="dark"
                content="云课进度排名前10%名次里的学生"
                placement="bottom"
              >
                <img style="width:15px;" src="@/assets/images/icon_help.png" />
              </el-tooltip>
            </div>
            <el-button
              :loading="praiseLoading"
              :disabled="good.length == 0"
              size="mini"
              type="primary"
              @click="handlePraise"
              >表扬</el-button
            >
          </div>
          <div class="stus" v-if="good.length">
            <span class="name" v-for="(stu, index) in good" :key="index">{{
              stu.userRealName
            }}</span>
          </div>
          <div
            v-else
            style="font-size:14px;color:#909399;text-align:center;height:40px;line-height:40px;"
          >
            暂无学生
          </div>
        </div>
        <div class="box">
          <div>
            <div style="display:flex;align-items:center;">
              预警&nbsp;
              <el-tooltip
                effect="dark"
                content="云课进度排名后10%名次里的学生"
                placement="bottom"
              >
                <img style="width:15px;" src="@/assets/images/icon_help.png" />
              </el-tooltip>
            </div>
            <el-button
              :loading="superviseLoading"
              :disabled="bad.length == 0"
              size="mini"
              type="primary"
              @click="handleSupervise"
              >督促</el-button
            >
          </div>
          <div class="stus" v-if="bad.length">
            <span class="name" v-for="(stu, index) in bad" :key="index">{{
              stu.userRealName
            }}</span>
          </div>
          <div
            v-else
            style="font-size:14px;color:#909399;text-align:center;height:40px;line-height:40px;"
          >
            暂无学生
          </div>
        </div>
      </div>
      <el-button
        size="small"
        type="primary"
        style="float:right;margin-bottom:10px;margin-right:36px;"
        @click="exportCourseDetail"
        :disabled="!stuList.length"
        >导出</el-button
      >
      <el-table
        :data="stuList"
        height="500"
        stripe
        border
        :default-sort="{ prop: 'doneNum', order: 'descending' }"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          ref="row"
          label="学号"
          align="center"
          prop="userNumber"
          sortable
          :sort-orders="['ascending', 'descending']"
          :sort-method="sortByNumber"
        ></el-table-column>
        <el-table-column
          label="姓名"
          align="center"
          prop="userRealName"
        ></el-table-column>
        <el-table-column
          label="进度"
          align="center"
          prop="doneNum"
          sortable
          :sort-orders="['ascending', 'descending']"
          :sort-method="sortByProgress"
        >
          <div slot-scope="scope">
            {{
              scope.row.totalNum > 0
                ? Math.round((100 * scope.row.doneNum) / scope.row.totalNum) +
                  "%"
                : 0 + "%"
            }}
          </div>
        </el-table-column>
        <el-table-column
          label="学习状态"
          align="center"
          prop="status"
        ></el-table-column>
        <el-table-column label="操作" align="center" prop="">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetail(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else style="text-align:center;height:470px;padding:180px;">
      <div style="color:#909399;font-size:14px;margin-bottom:15px;">
        暂未绑定云课
      </div>
      <el-button size="small" type="primary" @click="onClickBind"
        >选择云课</el-button
      >
    </div>
    <jdialog
      title="学习进度"
      :noFooter="true"
      :visible.sync="showDialog.studyDetail"
    >
      <template slot="body">
        <div class="processTkContent">
          <img
            v-if="currentRow.userPic"
            :src="currentRow.userPic"
            style="width:50px;height:50px;"
          />
          <img
            v-else
            src="@/assets/images/userPic.png"
            style="width:50px;height:50px;"
          />
          <span>{{ currentRow.userRealName }}</span>
          <span
            >已学：{{ currentRow.doneNum }}/{{ currentRow.totalNum }} 讲</span
          >
        </div>
        <div style="font-size:16px;margin:15px 0;margin-left:30px;"></div>
        <el-tree
          :data="catalogList"
          :props="defaultProps"
          :expand-on-click-node="false"
          node-key="catalogId"
          highlight-current
          ref="vueChapterTree"
          icon-class="el-icon-arrow-right"
        >
          <span
            class="custom-tree-node"
            ref="popover"
            slot-scope="{ node, data }"
          >
            <span :title="node.label">{{ node.label }}</span>
            <span v-if="data.isStudy == 1"
              ><i class="el-icon-circle-check" style="color:#2BA1F4;"></i
            ></span>
          </span>
        </el-tree>
      </template>
    </jdialog>
    <jdialog
      title="选择云课"
      :visible.sync="showDialog.selectCloudCourse"
      width="800px"
      @sure="ccSelectSure"
      :loading="submitLoading"
    >
      <template slot="body">
        <el-form size="small" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input
              placeholder="云课名称、ID、作者"
              v-model="keyword"
              @keyup.enter.native="loadCCourse"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="loadCCourse"
            ></el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="createCCourse">新建班级云课</el-button>
          </el-form-item>
        </el-form>
        <el-table
          class="ccTable"
          ref="ccTable"
          :data="ccList"
          stripe
          border
          v-loading="ccourseLoading"
          @selection-change="ccSelectChange"
          @current-change="ccCurrentChange"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column
            align="center"
            label="云课ID"
            prop="claCUUID"
          ></el-table-column>
          <el-table-column
            align="center"
            label="云课标题"
            prop="claCName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="老师"
            prop="claCTeacherName"
          ></el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="ccList.length" class="right-footer-first">
            从{{ (page - 1) * pageSize + 1 }}到{{
              (page - 1) * pageSize + ccList.length
            }}记录，共{{ total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="sizes, prev, pager, next, jumper"
            :page-sizes="[10, 30, 50]"
            :total="total"
            :page-size="pageSize"
            :current-page.sync="page"
            background
            @current-change="loadCCourse"
          ></el-pagination>
        </div>
      </template>
    </jdialog>
  </div>
</template>

<style lang="scss">
.cloudProgress {
  .container {
    height: 440px;
    border: 1px solid rgba(190, 203, 217, 1);
    padding: 32px 30px 35px 35px;
    margin-top: 17px;
    margin-bottom: 37px;
    display: flex;
    .aside {
      padding-top: 27px;
      color: #333;
      .title {
        color: #333;
        font-size: 18px;
        font-weight: bold;
      }
      .summery {
        margin-top: 30px;
        margin-bottom: 18px;
        color: #333;
        font-size: 16px;
        .number {
          color: #0d4376;
          font-size: 24px;
          font-weight: bold;
        }
        .unit {
          color: #0d4376;
          font-size: 16px;
        }
      }
    }
    .box {
      flex: 1;
      margin-left: 41px;
      border: 1px solid #becbd9;
      .stus {
        overflow-y: scroll;
        height: 329px;
        padding: 41px 22px 28px 39px;
        .name {
          margin-bottom: 16px;
          margin-right: 17px;
          font-size: 14px;
          color: #666;
          display: inline-block;
        }
      }
    }
    .box > div:first-child {
      height: 40px;
      background: rgba(43, 161, 244, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #333;
      font-size: 14px;
      padding-top: 10;
      padding-left: 41px;
      padding-right: 44px;
    }
  }
  .el-table {
    border: 1px solid rgba(190, 203, 217, 1);
  }
  .el-icon-question {
    cursor: pointer;
  }
  .processTkContent {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    img {
      float: left;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-left: 30px;
    }
    span {
      float: left;
      height: 50px;
      line-height: 50px;
      margin-right: 60px;
    }
    span:nth-child(2) {
      margin-left: 20px;
    }
  }
  .el-tree {
    font-size: 16px;
    border: 1px solid rgba(13, 67, 118, 0.2);
    padding: 21px;
    border-radius: 4px;
  }
  .el-tree
    > .el-tree-node
    > .el-tree-node__content
    > .custom-tree-node
    > span:first-child {
    display: inline-block;
    max-width: 420px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-tree
    > .el-tree-node
    > .el-tree-node__children
    > .el-tree-node
    > .el-tree-node__content
    > .custom-tree-node
    > span:first-child {
    display: inline-block;
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-tree
    > .el-tree-node
    > .el-tree-node__children
    > .el-tree-node
    > .el-tree-node__children
    > .el-tree-node
    > .el-tree-node__content
    > .custom-tree-node
    > span:first-child {
    display: inline-block;
    max-width: 380px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-tree-node__content {
    height: 46px;
    border-bottom: 1px solid #eaeaea;
    .el-tree-node__expand-icon {
      margin-left: 12px;
    }
    cursor: inherit;
  }
  .el-tree-node__children {
    .el-tree-node__content {
      border-bottom: none;
    }
  }
  .el-tree-node__content:hover {
    background-color: transparent;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: transparent;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .ccTable {
    thead {
      .el-table-column--selection {
        .cell {
          display: none;
        }
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import jdialog from "@/components/jdialog";
export default {
  name: "cloudProgress",
  components: {
    jdialog
  },
  data() {
    return {
      cls: {},
      page: 1,
      pageSize: 10,
      total: 0,
      ccList: [],
      ccourseLoading: false,
      submitLoading: false,
      keyword: "",
      info: {},
      stuList: [],
      good: [],
      bad: [],
      showDialog: {
        studyDetail: false,
        selectCloudCourse: false
      },
      currentRow: {},
      catalogList: [],
      defaultProps: {
        children: "catalog",
        label: "catalogName"
      },
      praiseLoading: false,
      superviseLoading: false,
      exportLoading: false
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    if (this.cls.cCourseUuid) {
      this.loadInfo();
      this.loadStuList();
    }
  },
  methods: {
    // 选择云课
    onClickBind() {
      this.page = 1;
      this.loadCCourse();
      this.submitLoading = false;
      this.showDialog.selectCloudCourse = true;
    },
    // 加载云课
    loadCCourse() {
      this.ccourseLoading = true;
      axios
        .request({
          method: "post",
          url: "v1/cCourse/selClaCList",
          data: {
            pageNum: this.page,
            pagesize: this.pageSize,
            searchWords: this.keyword
          }
        })
        .then(res => {
          this.ccourseLoading = false;
          let ret = res.data;
          if (ret.code == 200 && ret.data) {
            this.ccList = ret.data.data;
            this.total = ret.data.total;
            for (let i = 0; i < this.ccList.length; i++) {
              const cc = this.ccList[i];
              if (cc.claCUUID == this.cls.cCourseUuid) {
                this.$nextTick(() => {
                  this.$refs.ccTable.toggleRowSelection(cc);
                });
                break;
              }
            }
          } else {
            this.ccList = [];
            this.total = 0;
          }
        });
    },
    handleSizeChange(val) {
      this.page = 1;
      this.pageSize = val;
      this.loadCCourse();
    },
    ccSelectChange(val) {
      if (val.length > 1) {
        this.$refs.ccTable.clearSelection();
        this.$refs.ccTable.toggleRowSelection(val.pop());
      }
    },
    ccCurrentChange(val) {
      this.$refs.ccTable.toggleRowSelection(val);
    },
    // 绑定云课
    ccSelectSure() {
      let array = this.$refs.ccTable.selection;
      if (array.length) {
        let cc = array[array.length - 1];
        this.submitLoading = true;
        axios
          .request({
            method: "post",
            url: "v1/clazz/updInfo",
            data: {
              clazzId: this.cls.classId,
              cCourseUUID: cc.claCUUID
            }
          })
          .then(res => {
            this.submitLoading = false;
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.cls.cCourseUuid = cc.claCUUID;
              this.cls.cCourseName = cc.claCName;
              sessionStorage.setItem("currentClass", JSON.stringify(this.cls));
              this.showDialog.selectCloudCourse = false;
              this.bus.$emit("classInfoChanged");
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择"
        });
      }
    },
    // 新建班课
    createCCourse() {
      this.$router.push({
        name: "courseInfo",
        query: {
          newCourseType: 1
        }
      });
    },
    loadInfo() {
      axios
        .request({
          method: "post",
          url: "v1/bCourse/progress",
          data: {
            classId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.info = ret.data;
          }
        });
    },
    loadStuList() {
      axios
        .request({
          method: "post",
          url: "v1/bCourse/stuProgressList",
          data: {
            classId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.stuList = ret.data;
            this.good = [];
            this.bad = [];
            if (this.stuList.length > 0) {
              var levels = [];
              this.stuList.forEach(stu => {
                stu.status = "中等";
                if (
                  stu.userRealName === undefined ||
                  stu.userRealName.length == 0
                ) {
                  stu.userRealName = "姓名未设置";
                }
                if (levels.indexOf(stu.doneNum) == -1) {
                  levels.push(stu.doneNum);
                }
              });
              if (levels.length > 1) {
                levels.sort((a, b) => a - b);
                let i = Math.ceil(levels.length * 0.1);
                this.stuList.forEach(stu => {
                  if (stu.doneNum <= levels[i - 1]) {
                    stu.status = "预警";
                    this.bad.push(stu);
                  } else if (stu.doneNum >= levels[levels.length - i]) {
                    stu.status = "优秀";
                    this.good.push(stu);
                  }
                });
              }
            }
          }
        });
    },
    // 学号排序
    // :: 字符串数字在排序时不满足使用要求，所以需要自定义排序规则
    sortByNumber(a, b) {
      return a.userNumber - b.userNumber;
    },
    // 进度排序
    sortByProgress(a, b) {
      return a.doneNum - b.doneNum;
    },
    showDetail(row) {
      this.showDialog.studyDetail = true;
      this.currentRow = row;
      axios
        .request({
          method: "post",
          url: "v1/ccCat/catWithProgress",
          data: {
            cuserId: row.userId,
            cCUuid: this.cls.cCourseUuid
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.catalogList = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 表扬
    handlePraise() {
      this.praiseLoading = true;
      let array = [];
      this.good.forEach(element => {
        array.push(element.userId);
      });
      let content =
        "老师表扬了你在" +
        this.cls.classname +
        "的云课" +
        this.cls.cCourseName +
        "的学习，请继续努力哦。";
      let stuIds = array.join(",");
      this.handlePushService(stuIds, content);
    },
    // 督促
    handleSupervise() {
      this.superviseLoading = true;
      let array = [];
      this.bad.forEach(element => {
        array.push(element.userId);
      });
      let content =
        "老师提醒你快去学习" +
        this.cls.classname +
        "的云课" +
        this.cls.cCourseName +
        "。";
      let stuIds = array.join(",");
      this.handlePushService(stuIds, content);
    },
    handlePushService(stus, content) {
      axios
        .request({
          method: "post",
          url: "v1/bCourse/remind",
          data: {
            classId: this.cls.classId,
            sUids: stus,
            title: this.cls.cCourseName,
            content: content
          }
        })
        .then(res => {
          this.praiseLoading = false;
          this.superviseLoading = false;
          let ret = res.data;
          if (ret.code == 200) {
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
        })
        .catch(() => {
          this.praiseLoading = false;
          this.superviseLoading = false;
          this.$message({
            type: "warning",
            message: "操作失败"
          });
        });
    },
    // 导出
    exportCourseDetail() {
      let elemIF = window.document.createElement("iframe");
      elemIF.id = "down-file-iframe";
      let form = window.document.createElement("form");
      form.target = "down-file-iframe";
      form.setAttribute(
        "action",
        process.env.BASE_URL + "/v1/bCourse/exportProgress"
      );
      form.setAttribute("method", "post");
      let input1 = window.document.createElement("input");
      input1.type = "hidden";
      input1.name = "token";
      input1.value = this.$store.state.user.token;
      let input2 = window.document.createElement("input");
      input2.type = "hidden";
      input2.name = "progress";
      input2.value = JSON.stringify(this.stuList);
      let input3 = window.document.createElement("input");
      input3.type = "hidden";
      input3.name = "className";
      input3.value = JSON.stringify(this.cls.classname);
      form.appendChild(input1);
      form.appendChild(input2);
      form.appendChild(input3);
      window.document.body.appendChild(elemIF);
      elemIF.appendChild(form);
      form.submit();
      elemIF.remove();
    }
  }
};
</script>
