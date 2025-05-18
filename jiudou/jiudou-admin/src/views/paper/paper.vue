<template>
  <el-container class="paper">
    <el-header style="height: 50px">
      我的试卷管理
    </el-header>
    <el-main>
      <div class="top">
        <el-input
          size="small"
          v-model="keyWord"
          placeholder="请输入试卷名称"
          style="width: 300px"
          @keyup.enter.native="handleSearch"
        ></el-input>
        <el-button
          type="primary"
          @click="handleSearch"
          class="el-icon-search"
          size="small"
        ></el-button>
        <div class="operateBtn">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="handleNewPaper"
            >新建试卷</el-button
          >
        </div>
      </div>
      <el-table
        v-loading="loading.tableLoading"
        :data="datalist"
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
        <el-table-column label="试卷名称" prop="paperName">
          <template slot-scope="scope">
            <span
              style="color:#2BA1F4;cursor:pointer"
              @click="handleEdit(scope.row)"
              >{{ scope.row.paperName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="修改时间"
          prop="createTime"
          align="center"
          width="200px"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)"
              >重新编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleLoadWord(scope.row)"
              >下载Word</el-button
            >
            <el-button size="mini" type="text" @click="handleDel(scope.row)"
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
              this.datalist.length
          }}
          记录，共 {{ page.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :page-sizes="[10, 30, 50]"
          :total="page.total"
          :current-page.sync="page.currentPage"
          :page-size="page.pagesize"
          @size-change="handleSizeChange"
          @current-change="loadData"
        >
        </el-pagination>
      </div>
    </el-main>
    <!-- 新建试卷 -->
    <el-dialog
      :visible.sync="isNewPaperShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新建试卷</div>
        </div>
      </template>
      <el-form
        :model="newPaperForm"
        :rules="newPaperRules"
        ref="newPaperForm"
        label-width="90px"
        style="margin:20px 70px;"
        @submit.native.prevent
      >
        <el-form-item label="试卷名称" prop="paperName">
          <el-input
            v-model.trim="newPaperForm.paperName"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.handmadeLoading"
          @click="toHandmade"
          >手工组卷</el-button
        >
        <el-button
          size="small"
          type="primary"
          :loading="loading.voluntarilyLoading"
          @click="toVoluntarily"
          >自动组卷</el-button
        >
      </span>
    </el-dialog>
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
          :loading="loading.uploadLoding"
          >下载试卷</el-button
        >
      </span>
    </el-dialog>
  </el-container>
</template>

<style lang="scss">
.paper {
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
  }
  .el-date-editor .el-range-separator {
    width: auto;
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";

export default {
  data() {
    return {
      keyWord: "",
      datalist: [],
      loading: {
        tableLoading: false,
        handmadeLoading: false,
        voluntarilyLoading: false,
        uploadLoding: false
      },
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      isNewPaperShow: false,
      newPaperForm: {
        paperName: ""
      },
      newPaperRules: {
        paperName: [
          { required: true, message: "请输入试卷名称", trigger: "click" }
        ]
      },
      isLoadWordShow: false,
      loadWordForm: {
        radio1: 0,
        radio2: 0
      },
      currentPaperInfo: {
        timuNum: 0, // 选中列数据的试题数
        paperId: ""
      }
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading.tableLoading = true;
      let data = {};
      data.page = this.page.currentPage;
      data.pagesize = this.page.pagesize;
      if (this.keyWord) {
        data.paperName = this.keyWord;
      }
      axios
        .request({
          method: "post",
          url: "/tiku/paper/list",
          data: data
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            if (ret.data) {
              this.datalist = ret.data.data;
              this.page.total = ret.data.total;
            } else {
              this.datalist = [];
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //查询试卷
    handleSearch() {
      this.page.currentPage = 1;
      this.loadData();
    },
    //选择每页显示数据条数切换事件
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
    },
    //新建试卷
    handleNewPaper() {
      this.isNewPaperShow = true;
      this.newPaperForm.paperName = "";
      this.$nextTick(() => {
        this.$refs.newPaperForm.clearValidate();
      });
    },
    //手工组卷
    toHandmade() {
      this.$refs["newPaperForm"].validate(valid => {
        if (valid) {
          this.loading.handmadeLoading = true;
          axios
            .request({
              method: "post",
              url: "/tiku/paper/create",
              data: {
                paperName: this.newPaperForm.paperName,
                paperWay: 0
              }
            })
            .then(res => {
              this.loading.handmadeLoading = false;
              let ret = res.data;
              if (ret.code == 200) {
                this.isNewPaperShow = false;
                var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
                var cEvent = new CountEvent("handmade_paper");
                window.JAnalyticsInterface.onEvent(cEvent);
                this.loadData();
                this.$router.push({
                  path: "/paper/addTimu",
                  query: {
                    paperId: ret.data.paperId
                  }
                });
              }
            });
        }
      });
    },
    //自动组卷
    toVoluntarily() {
      this.$refs["newPaperForm"].validate(valid => {
        if (valid) {
          this.loading.voluntarilyLoading = true;
          axios
            .request({
              method: "post",
              url: "/tiku/paper/create",
              data: {
                paperName: this.newPaperForm.paperName,
                paperWay: 1
              }
            })
            .then(res => {
              this.loading.voluntarilyLoading = false;
              let ret = res.data;
              if (ret.code == 200) {
                this.isNewPaperShow = false;
                this.loadData();
                this.$router.push({
                  path: "/paper/voluntaril",
                  query: {
                    paperId: ret.data.paperId
                  }
                });
              }
            });
        }
      });
    },
    //重新编辑
    handleEdit(row) {
      if (row.paperWay == 1 && row.paperIsGenerate == 0) {
        //如果是自动组卷并且题目数为0 则跳到自动组卷页面
        this.$router.push({
          path: "/paper/voluntaril",
          query: {
            paperId: row.paperId
          }
        });
      } else {
        this.$router.push({
          path: "/paper/handmade",
          query: {
            paperId: row.paperId
          }
        });
      }
    },
    //下载word
    handleLoadWord(row) {
      this.loadWordForm.radio1 = 0;
      this.loadWordForm.radio2 = 0;
      this.currentPaperInfo.paperId = row.paperId;
      axios
        .request({
          method: "post",
          url: "/tiku/paperItem/listAll",
          data: {
            paperId: row.paperId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.currentPaperInfo.timuNum = ret.data.length;
            this.isLoadWordShow = true;
          }
        });
    },
    doLoadWordSure() {
      if (this.currentPaperInfo.timuNum <= 50) {
        this.loading.uploadLoding = true;
        if (this.loadWordForm.radio1 == 0) {
          //A4
          let url =
            process.env.BASE_URL +
            "/tiku/paper/exportWordxA4?paperId=" +
            this.currentPaperInfo.paperId +
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
            this.currentPaperInfo.paperId +
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
          this.loading.uploadLoding = false;
          this.isLoadWordShow = false;
        }, 5000);
      } else {
        this.$message({
          type: "warning",
          message: "下载试卷的题数不能超过50题"
        });
      }
    },
    //删除试卷
    handleDel(row) {
      this.$confirm(
        "<div>确定删除试卷：《" + row.paperName + "》？</div>",
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
              url: "/tiku/paper/delete",
              data: {
                paperId: row.paperId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                if (this.page.currentPage != 1 && this.datalist.length == 1) {
                  this.page.currentPage--;
                }
                this.loadData();
                this.$message({
                  type: "success",
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
    }
  }
};
</script>
