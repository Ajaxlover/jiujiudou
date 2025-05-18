<template>
  <el-container class="classCourse">
    <el-header style="height: 50px">
      我的班级云课
    </el-header>
    <el-main>
      <div class="top">
        <el-input
          size="small"
          v-model="keyWord"
          placeholder="搜索班课"
          style="width: 200px"
          @keyup.enter.native="courseSerch"
        ></el-input>
        <el-button
          size="small"
          type="primary"
          @click="courseSerch"
          class="el-icon-search"
        ></el-button>
        <div class="operateBtn">
          <el-button size="small" type="primary" @click="importCourse"
            >导入云课</el-button
          >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="newCourse"
            >新建班级云课</el-button
          >
        </div>
      </div>
      <div class="main">
        <el-table
          :data="courseListData"
          border
          :row-style="{ height: '120px' }"
          :show-header="false"
          v-loading="loading.tableLoading"
        >
          <el-table-column
            prop="tname"
            label="书名"
            align="center"
            min-width="600"
          >
            <div slot-scope="scope" class="info">
              <div class="left">
                <img
                  style="cursor: pointer;"
                  v-if="scope.row.coverUrl"
                  :src="scope.row.coverUrl"
                  class="userPic"
                  @click="bigImg(scope.row)"
                />
                <img v-else src="@/assets/images/cloudCourseCover.png" />
              </div>
              <div class="middle">
                <div class="name" @click="courseDetail(scope.row)">
                  {{ scope.row.claCName }}
                </div>
                <div class="cloudId">班课ID: {{ scope.row.claCUUID }}</div>
                <div class="courseTime">
                  更新时间: {{ dateFormat(scope.row.modifyTime) }}
                </div>
              </div>
              <div class="right">
                <div v-if="!scope.row.claList || scope.row.claList.length == 0">
                  未绑定班级
                </div>
                <div v-else>
                  <el-dropdown
                    trigger="click"
                    :hide-on-click="false"
                    class="dropdownBtn"
                  >
                    <span
                      class="el-dropdown-link"
                      style="color:#409EFF;font-size:12px;cursor: pointer;"
                    >
                      学习进度
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" style="top:200px">
                      <el-dropdown-item
                        v-for="item in scope.row.claList"
                        :key="item.clId"
                        @click.native="lookLearnProcess(scope.row, item.clId)"
                        >{{ item.clName }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small" @click="bookDetail(scope.row)">详情</el-button> -->
              <el-button
                type="text"
                size="small"
                @click="editCourse(scope.row)"
                style="margin-left:0"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="bindCourse(scope.row)"
                style="margin-left:0"
                >绑定</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="shareCourse(scope.row)"
                style="margin-left:0"
                >分享</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="deleteCourse(scope.row)"
                style="margin-left:0"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从 {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
            {{
              (this.page.currentPage - 1) * this.page.pagesize +
                this.courseListData.length
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
    </el-main>
    <!-- 导入云课 -->
    <el-dialog
      :visible.sync="isImportShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="1000px"
      class="importModal"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>选择云课</div>
        </div>
      </template>
      <el-input
        size="small"
        v-model="importKeyWord"
        placeholder="云课ID、云课标题、老师"
        style="width: 200px"
        @keyup.enter.native="loadImportData"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="loadImportData"
      ></el-button>
      <el-table
        :data="dataList"
        v-loading="loading.importTableLoading"
        style="margin-top:15px;"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column label="选择" align="center" width="60px">
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.ccourseId"
              v-model="importResRadio"
              @change="importResRadioData(scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          label="云课ID"
          prop="ccourseUuid"
          align="center"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          label="云课标题"
          prop="ccourseName"
          align="center"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          label="老师"
          prop="ccourseTeacherName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="价格"
          prop="ccoursePrice"
          align="center"
          :formatter="formatPrice"
        ></el-table-column>
        <el-table-column
          label="云课分类"
          prop="ccourseType"
          align="center"
          :formatter="formatCourseType"
        ></el-table-column>
        <!-- <el-table-column label="开课用户" align="center" width="300">
          <div slot-scope="scope" class="info">{{scope.row.creatorName}}({{scope.row.mobile}})</div>
        </el-table-column> -->
      </el-table>
      <div class="tabelFooter">
        <div class="right-footer-first">
          从
          {{ (this.importPage.currentPage - 1) * this.importPage.pagesize + 1 }}
          到
          {{
            (this.importPage.currentPage - 1) * this.importPage.pagesize +
              this.dataList.length
          }}
          记录，共 {{ importPage.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :total="importPage.total"
          :current-page.sync="importPage.currentPage"
          :page-size="importPage.pagesize"
          @current-change="loadImportData"
        ></el-pagination>
      </div>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.importLoadingSure"
          @click="doImport"
          >确定</el-button
        >
        <el-button size="small" @click="isImportShow = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 绑定班级 -->
    <el-dialog
      :visible.sync="isBindShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="500px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>绑定班级</div>
        </div>
      </template>
      <!-- <el-transfer
        filterable
        filter-placeholder="请输入搜索内容"
        :titles="['我的班级', '已绑定班级']"
        v-model="bindValue"
        :data="classListData">
      </el-transfer> -->
      <el-checkbox-group v-model="bindValue" style="padding-left:90px;">
        <el-checkbox
          v-for="(item, index) in bindClassList"
          :key="index"
          :label="item.clId"
          style="display:block;margin-bottom:10px"
          :disabled="item.clCoUuid && currentCourse.claCUUID != item.clCoUuid"
          >{{ item.clName }}</el-checkbox
        >
      </el-checkbox-group>
      <div class="inputTips" style="text-align:center;margin-top:30px">
        每个班级限1个云课，当班级已绑定其他云课时需先解除绑定
      </div>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.bindSureLoading"
          @click="bindSure"
          >确定</el-button
        >
        <el-button size="small" @click="isBindShow = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 云课封面大图 -->
    <el-dialog
      :visible.sync="isBigImageShow"
      :modal-append-to-body="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>封面</div>
        </div>
      </template>
      <img :src="currentCourse.coverUrl" alt="" style="width:560px;" />
    </el-dialog>
    <!-- 班级云课分享 -->
    <el-dialog
      :visible.sync="isShareShow"
      :modal-append-to-body="false"
      width="800px"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>分享</div>
        </div>
      </template>
      <el-alert
        title="其他老师用电脑浏览器打开链接，即可获取分享内容，请谨慎操作。"
        type="warning"
        :closable="false"
      ></el-alert>
      <div style="font-size:18px;margin-top:30px;" v-if="!shareModal2">
        <span style="color:#999;margin-right:15px;">分享内容</span>
        <span>{{ currentShareContent.claCName }}</span>
      </div>
      <div style="font-size:18px;margin-top:30px;overflow:hidden;" v-else>
        <span style="color:#999;margin-right:15px;float:left;margin-top:5px;"
          >链接</span
        >
        <el-input v-model="shareLink" style="width:550px;float:left;">
          <el-button slot="append" @click="resetLink">重置</el-button>
        </el-input>
        <el-button
          type="primary"
          style="margin-left:20px;float:left;"
          @click="copyShareLink"
          >复制链接</el-button
        >
        <div
          style="color:#999999;float:left;width:100%;font-size:14px;margin-top:20px;"
        >
          点击重置后，原链接会失效。
        </div>
      </div>
      <span slot="footer">
        <el-button @click="isShareShow = false" v-if="!shareModal2"
          >取消</el-button
        >
        <el-button type="primary" @click="toCreateShareLink" v-if="!shareModal2"
          >创建分享链接</el-button
        >
        <!-- <el-button
          @click="isShareShow = false"
          v-if="shareModal2"
          style="margin-top:30px;"
          >关闭弹窗</el-button
        > -->
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { format } from "@/utils/datetime";

export default {
  data() {
    return {
      isShareShow: false, // 班级云课分享弹窗
      shareModal2: false, // 是否展示分享弹框的第二部分
      shareLink: "", // 班级云课分享链接
      currentShareContent: {},
      csCode: "",
      isBigImageShow: false,
      isBindShow: false,
      keyWord: "",
      courseListData: [],
      loading: {
        tableLoading: false,
        loadingChangePrice: false,
        bindSureLoading: false,
        importTableLoading: false,
        importLoadingSure: false
      },
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      currentCourse: {},
      bindValue: [],
      classListData: [],
      //导入云课参数
      isImportShow: false,
      importKeyWord: "",
      importResRadio: "",
      currentRowCourse: {},
      dataList: [],
      importPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      bindClassList: [],
      currentBindValue: []
    };
  },
  methods: {
    loadData() {
      this.loading.tableLoading = true;
      let data = {};
      data.pageNum = this.page.currentPage;
      data.pagesize = this.page.pagesize;
      if (this.keyWord) {
        data.searchWords = this.keyWord;
      }
      axios
        .request({
          method: "post",
          url: "/v1/cCourse/selClaCList",
          data: data
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            if (ret.data) {
              this.courseListData = ret.data.data;
              this.page.total = ret.data.total;
            } else {
              this.courseListData = [];
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //导入云课
    importCourse() {
      this.importResRadio = "";
      this.importKeyWord = "";
      this.loadImportData();
      this.isImportShow = true;
    },
    //加载添加分类列表data
    loadImportData() {
      this.loading.importTableLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/cCourse/freeList",
          data: {
            page: this.importPage.currentPage,
            pageSize: this.importPage.pagesize,
            keyword: this.importKeyWord
          }
        })
        .then(res => {
          this.loading.importTableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.dataList = ret.data.data;
            this.importPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //radio change选中行数据
    importResRadioData(row) {
      this.currentRowCourse = row;
    },
    //确定导入云课
    doImport() {
      if (!this.importResRadio) {
        this.$message({
          type: "warning",
          message: "请选择云课"
        });
        return;
      }
      this.loading.importLoadingSure = true;
      axios
        .request({
          method: "post",
          url: "/ccourse/v4/cCourse/copy2BCourse",
          data: {
            cCourseId: this.currentRowCourse.ccourseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.loading.importLoadingSure = false;
            this.$router.push({
              path: "/cloudCourse/courseInfo",
              query: {
                ccourseId: ret.data.cCourseId,
                newCourseType: 1
              }
            });
            this.isImportShow = false;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    courseSerch() {
      this.page.currentPage = 1;
      this.loadData();
    },
    cCourseHelp() {
      this.$router.push({
        path: "/cloudCourse/help"
      });
    },
    bigImg(row) {
      this.isBigImageShow = true;
      this.currentCourse = row;
    },
    // 云课类型
    formatCourseType(row) {
      return common.mathCourseType(row.ccourseType);
    },
    //云课价格类型
    formatPrice(row) {
      if (row) {
        if (row.ccoursePrice == 0) {
          return "免费";
        } else {
          return row.ccoursePrice / 100;
        }
      }
    },
    //新建班课
    newCourse(row) {
      this.$router.push({
        path: "/cloudCourse/courseInfo",
        query: {
          newCourseType: 1
        }
      });
    },
    //更新时间
    dateFormat: function(row) {
      return format(row);
    },
    //云课详情
    courseDetail(row) {
      this.$router.push({
        path: "/cloudCourse/courseDetail",
        query: {
          ccourseId: row.claCId,
          type: 4 // 查看班课详情
        }
      });
    },
    //编辑
    editCourse(row) {
      this.$router.push({
        path: "/cloudCourse/courseInfo",
        query: {
          ccourseId: row.claCId,
          newCourseType: 1
        }
      });
    },
    //绑定班级
    bindCourse(row) {
      this.bindValue = [];
      this.classListData = [];
      this.currentCourse = row;
      axios
        .request({
          method: "post",
          url: "v1/calzz/selClsByUid"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.bindClassList = ret.data;
            ret.data.forEach((e, i) => {
              if (e.clCoUuid && e.clCoUuid == row.claCUUID) {
                this.bindValue.push(e.clId);
              }
              // this.classListData.push({
              //   label: e.clName,
              //   key: e.clId,
              //   disabled: e.clCoUuid && e.clCoUuid != row.claCUUID
              // });
            });
          }
        });
      this.isBindShow = true;
    },
    //确定绑定班级
    bindSure() {
      this.loading.bindSureLoading = true;
      axios
        .request({
          method: "post",
          url: "v1/calzz/rebindClCAndCla",
          data: {
            clCUUId: this.currentCourse.claCUUID,
            clIds: this.bindValue.join(",")
          }
        })
        .then(res => {
          let ret = res.data;
          this.loading.bindSureLoading = false;
          if (ret.code == 200) {
            this.loadData();
            this.isBindShow = false;
          }
        });
    },
    shareCourse(row) {
      // console.log(row);
      this.currentShareContent = row;
      this.shareModal2 = false;
      this.isShareShow = true;
    },
    // 去创建分享链接
    toCreateShareLink() {
      this.csCode = "";
      axios
        .request({
          method: "post",
          url: `/ccourse/v4/courseShare/create`,
          data: {
            ccourseId: this.currentShareContent.claCId,
            uid: this.$store.state.user.userId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.shareModal2 = true;
            this.csCode = ret.data.code;
            this.shareLink =
              process.env.THIS_URI + "/index?type=4&shareCode=" + this.csCode;
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
    },
    // 重置链接
    resetLink() {
      axios
        .request({
          method: "post",
          url: "/ccourse/v4/courseShare/reset",
          data: {
            code: this.csCode
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.csCode = ret.data.code;
            this.shareLink =
              process.env.THIS_URI + "/index?type=4&shareCode=" + this.csCode;
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
    },
    //复制链接
    copyShareLink() {
      if (this.shareLink.split(" ").join("").length == 0) {
        return false;
      }
      //let Url2 = 'https://tfwww.jiudou123.com/index?type=2&shareCode=' + this.shareLink;  //每一行的某个值，如选中的当前行的url
      var oInput = document.createElement("input"); //创建一个隐藏input（重要！）
      oInput.value = this.shareLink; //赋值
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },
    //删除
    deleteCourse(row) {
      this.$confirm(
        "<div>是否确定删除班课：《" +
          row.claCName +
          "》？</div>删除后班课将无法恢复",
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "v1/cCourse/delClC",
              data: {
                clCId: row.claCId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                if (
                  this.page.currentPage != 1 &&
                  this.courseListData.length == 1
                ) {
                  this.page.currentPage--;
                }
                this.loadData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    //统计
    lookLearnProcess(row1, row2) {
      this.$router.push({
        path: "/class/countCourse",
        query: {
          classId: row2,
          ccourseId: row1.claCId,
          courseName: row1.claCName
        }
      });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style lang="scss">
.classCourse {
  .el-header {
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
    .class {
      cursor: pointer;
      color: #2ba1f4;
    }
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
    .top {
      overflow: hidden;
      .operateBtn {
        float: right;
      }
    }
    .main {
      margin-top: 13px;
      .info {
        padding: 0px 10px;
        overflow: hidden;
        text-align: left;
        .left {
          float: left;
          img {
            width: 130px;
            height: 72px;
            display: block;
            cursor: pointer;
          }
        }
        .middle {
          margin-left: 18px;
          float: left;
          .name {
            font-weight: bold;
            font-size: 14px;
            color: #333333;
            cursor: pointer;
          }
          .cloudId {
            margin-top: 3px;
            font-size: 14px;
            color: #666666;
          }
          .courseTime {
            margin-top: 3px;
            font-size: 12px;
            color: #999999;
          }
        }
        .right {
          float: right;
          height: 30px;
          line-height: 30px;
          margin-top: 28px;
          margin-right: 50px;
          color: #2ba1f4;
        }
      }
      tbody tr td:nth-child(3) {
        font-size: 12px;
        color: #999999;
      }
      tbody tr td:nth-child(2) {
        color: #666666;
      }
    }
  }
  .el-date-editor .el-range-separator {
    width: auto;
  }
  .importModal .el-table::before {
    height: 0;
  }
}
</style>
