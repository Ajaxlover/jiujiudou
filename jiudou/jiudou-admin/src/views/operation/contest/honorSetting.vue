<template>
  <el-container class="honor-setting">
    <el-header style="height: 50px">
      <span @click="toExamManage" style="cursor:pointer;color:#2BA1F4;"
        >竞赛列表</span
      >
      <i class="el-icon-arrow-right"></i>
      <span>竞赛设置</span>
    </el-header>
    <el-main>
      <el-tabs class="parentTab" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="奖项设置" name="first">
          <div class="top">
            <div class="left-form">
              <el-form
                :inline="true"
                class="demo-form-inline"
                @submit.native.prevent
              >
              </el-form>
            </div>

            <div class="operateBtn">
              <el-button size="small" @click="createHonor" type="primary"
                >新建</el-button
              >
            </div>
          </div>
          <div class="main">
            <el-table
              :data="examList"
              border
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
              <!-- <el-table-column align="center" label="" width="38">
            <template slot-scope="scope">
              <el-radio
                class="exam-radio"
                :label="scope.row.examId"
                v-model="radioSelect"
                @change.native="getRow(scope.$index, scope.row)"
              >
                <span>&nbsp</span>
              </el-radio>
            </template>
          </el-table-column> -->
              <el-table-column
                prop="coverUrl"
                label="证书图片"
                align="center"
                min-width="120"
              >
                <template slot-scope="scope">
                  <img
                    :src="scope.row.coverUrl"
                    style="width:120px;cursor:pointer"
                    @click="viewImg(scope.row.coverUrl)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="奖项名称"
                align="center"
                min-width="50"
              >
              </el-table-column>
              <el-table-column
                prop="code"
                label="奖项编号（证书编号前缀）"
                align="center"
                min-width="120"
              >
              </el-table-column>

              <el-table-column label="操作" align="center" min-width="60">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="editHonor(scope.row)"
                    style="margin-left:0"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    @click="deleteHonor(scope.row)"
                    size="small"
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
                    this.examList.length
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
        <el-tab-pane label="通知设置" name="second">
          <el-form
            :model="noticeForm"
            ref="richTextResForm"
            label-width="90px"
            size="small"
            style="margin:0 90px;width:800px"
          >
            <el-form-item label="标题" prop="contestReadingTitle">
              <el-input
                v-model.trim="noticeForm.noticeTitle"
                size="small"
                style="width:400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="contestReadingContent">
              <Ueditor
                v-model.trim="noticeForm.noticeContent"
                :initialFrameHeight="initialFrameHeight"
              />
            </el-form-item>
          </el-form>
          <div style="display:flex;justify-content:center;margin-top:50px">
            <el-button size="small" @click="toSaveNotice" type="primary"
              >保存</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <jd-dialog
      title="奖项设置"
      v-if="dialogVisible.addNew"
      :visible.sync="dialogVisible.addNew"
      :close_on_click_modal="false"
      @sure="editSure"
    >
      <template slot="body">
        <el-form
          :model="form"
          size="small"
          label-position="right"
          label-width="100px"
          ref="editBanner"
          :rules="formRules"
          style="padding-left:40px;padding-right:100px;"
        >
          <el-form-item label="奖项名称" prop="honorName">
            <el-input v-model="form.honorName"></el-input>
          </el-form-item>

          <el-form-item label="证书模板" prop="honorImg">
            <el-upload
              :multiple="false"
              :with-credentials="true"
              class="avatar-uploader"
              action=""
              :auto-upload="true"
              :http-request="uploadSectionFile"
              :before-upload="beforeAvatarUpload"
              :show-file-list="false"
            >
              <img v-if="form.honorImg" :src="form.honorImg" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button
              v-if="form.honorImg"
              @click="viewImg(form.honorImg)"
              type="text"
              size="small"
              >预览</el-button
            >
          </el-form-item>
        </el-form>
      </template>
    </jd-dialog>
    <el-image-viewer
      v-if="showViewer"
      :on-close="
        () => {
          showViewer = false;
        }
      "
      :url-list="imgList"
    />
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import { formatSS } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
import Ueditor from "@/components/ueditor";

export default {
  components: {
    // courseProtocol
    "el-image-viewer": () =>
      import("element-ui/packages/image/src/image-viewer"),
    "jd-dialog": jdialog,
    Ueditor
  },
  data() {
    return {
      initialFrameHeight: 200,
      activeName: "first",
      imgList: [], // 图片预览
      form: {
        honorName: "",
        honorImg: "",
        id: ""
      },
      noticeForm: {
        noticeTitle: "",
        noticeContent: ""
      },
      formRules: {
        honorName: [
          { required: true, message: "奖项名称不能为空", trigger: "blur" }
        ],
        honorImg: [{ required: true, message: "证书不能为空", trigger: "blur" }]
      },
      dialogVisible: {
        addNew: false
      },
      showViewer: false,
      id: this.$route.query.competeId,
      shareModal2: false,
      isShareShow: false,
      isTransPaperShow: false, // 转发
      shareLink: "",
      radioSelect: "",
      radioCheck: {},
      searchForm: {
        examName: "",
        startTime: null,
        endTime: null,
        status: ""
      },
      examList: [],
      isBigImageShow: false,
      isAgreeShow: false,
      lockBook: false,
      bookAdded: false,
      keyWord: "",
      loading: {
        tableLoading: false,
        loadingChangePrice: false
      },
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      isChangePriceShow: false,
      priceForm: {
        oldPrice: "",
        newPrice: ""
        // effectiveTime: '',
      },
      pickerOptions: {
        // 时间不让选择今天以前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      // historyPrice: [],
      currentCourse: {},
      classList: [],
      classPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      selectedClass: [],
      classKeyWord: "" // 班级名称
    };
  },
  computed: {
    isAbleTrans() {
      return this.selectedClass.length === 0;
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == "second") {
        this.getInfo();
      }
    },
    toSaveNotice() {
      axios
        .request({
          method: "post",
          url: `/exam/masterHead/notice/add`,
          data: {
            masterheadId: this.id,
            noticeTitle: this.noticeForm.noticeTitle,
            noticeContent: this.noticeForm.noticeContent
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: `保存成功`
            });
          } else {
            this.$message({
              type: "warning",
              message: `${ret.msg}`
            });
          }
        });
    },
    getInfo() {
      axios
        .request({
          method: "post",
          url: `/exam/masterHead/notice/getInfo`,
          data: {
            masterheadId: this.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.noticeForm.noticeTitle = ret.data.noticeTitle
              ? ret.data.noticeTitle
              : "";
            this.noticeForm.noticeContent = ret.data.noticeContent
              ? ret.data.noticeContent
              : "";
          } else {
            this.$message({
              type: "warning",
              message: `${ret.msg}`
            });
          }
        });
    },
    beforeAvatarUpload(file) {
      let isPic = file.type.includes("image");
      if (!isPic) {
        this.$message({
          type: "warning",
          message: "只支持上传图片"
        });
        return;
      }

      return isPic;
    },
    // 上传证书图片
    uploadSectionFile(params) {
      // this.form.honorPicFile = params;
      axios
        .request({
          method: "post",
          url: `/exam/masterHead/getUploadCosPath`
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let { cosPath, dev } = ret.data;
            const form = new FormData();
            // 文件对象
            form.append("file", params.file);
            form.append("cosPath", cosPath);
            form.append("dev", dev);
            axios
              .request({
                method: "post",
                url: `${process.env.BASE_URL_V3}/common/feign/upload/uploadImg`,
                data: form
              })
              .then(res => {
                if (res.status === 200) {
                  let { accessUrl } = res.data;
                  this.form.honorImg = accessUrl;
                } else {
                  this.$message({
                    type: "warning",
                    message: "证书上传失败"
                  });
                }
              });
          }
        });
    },
    viewImg(url) {
      this.imgList = [url];
      this.showViewer = true;
    },
    editSure() {
      this.$refs["editBanner"].validate(valid => {
        if (valid) {
          let url = "/exam/masterHead/award/addAward";
          let data = {};
          data.masterheadId = this.id;
          data.name = this.form.honorName;
          data.coverUrl = this.form.honorImg;
          if (this.form.id) {
            url = "/exam/masterHead/award/editAward";
            data.awardId = this.form.id;
          }
          axios
            .request({
              method: "post",
              url,
              data
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: `${ret.msg}`
                });
                this.dialogVisible.addNew = false;
                this.loadData();
              } else {
                this.$message({
                  type: "info",
                  message: ret.msg
                });
              }
            });
        }
      });
    },
    createHonor() {
      this.form.honorName = "";
      this.form.honorImg = "";
      this.form.id = "";
      this.dialogVisible.addNew = true;
    },
    editHonor(row) {
      let { name, coverUrl, id } = row;
      this.form.honorName = name;
      this.form.honorImg = coverUrl;
      this.form.id = id;
      this.dialogVisible.addNew = true;
    },
    deleteHonor(row) {
      let { id } = row;
      this.$confirm("是否删除此奖项?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          // 删除奖项
          axios
            .request({
              method: "post",
              url: "/exam/masterHead/award/delAward",
              data: {
                awardId: id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
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
    toExamManage() {
      this.$router.push({
        path: "/operation/contestManage"
      });
    },
    // 转发试卷
    handleCloseTransPaper() {
      this.classKeyWord = "";
      this.classPage.currentPage = 1;
      this.selectedClass = [];
      this.isTransPaperShow = false;
    },
    transExam() {
      if (!this.radioSelect) {
        this.$message({
          type: "warning",
          message: "请先选择考试"
        });
        return;
      }
      this.getClassList();
    },
    handleSelectionChange(val) {
      this.selectedClass = val;
    },
    // 单行点击
    // handleRowClick(row, column, event) {
    //   this.radioSelect = row.examId;
    //   this.radioCheck = row;
    // },
    getRow(i, row) {
      this.radioCheck = row;
    },

    loadData() {
      this.loading.tableLoading = true;
      let data = {
        masterheadId: this.id
      };
      // data.uid = 661605;
      data.pageNo = this.page.currentPage;
      data.pageSize = this.page.pagesize;
      axios
        .request({
          method: "post",
          url: "/exam/masterHead/award/findList",
          data: data
        })
        .then(res => {
          this.loading.tableLoading = false;
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
    getClassList() {
      let data = {};
      data.pageNo = this.classPage.currentPage;
      data.pageSize = this.classPage.pagesize;
      if (this.classKeyWord) {
        data.className = this.classKeyWord;
      }
      axios
        .request({
          method: "post",
          url: "/clazz/clazz/myAllClassPage",
          data: data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isTransPaperShow = true;
            this.classList = ret.data.data;
            this.classPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    searchExam() {
      this.page.currentPage = 1;
      this.loadData();
    },
    toCreateExam() {
      this.$router.push({
        path: "/operation/createContest"
      });
    },
    toExamAnalysis(row) {
      this.$router.push({
        path: "/exam/examAnalysis",
        query: {
          examId: row.examId,
          isAdmin: 1
        }
      });
    },
    dateFormat(row) {
      return formatSS(row);
    },
    dateFormat1(row) {
      let d = new Date(row);
      return formatSS(d.getTime());
    },
    //上下架显示
    isCourseOn(row) {
      if (row.ccourseIsOn == 1) {
        return "下架";
      } else {
        return "上架";
      }
    },
    //编辑
    editCourse(row) {
      this.$router.push({
        path: "/moocModule/moocInfo",
        query: {
          ccourseId: row.id
        }
      });
    },
    // 去发布考试
    toPublishExam(row) {
      this.$router.push({
        path: "/exam/examPublish",
        query: {
          examId: row.examId
        }
      });
    },
    toViewSetting(row) {
      this.$router.push({
        path: "/exam/viewExamSetting",
        query: {
          examId: row.examId,
          isAdmin: 1
        }
      });
    },
    // 去成绩批改
    toExamCheck(row) {
      this.$router.push({
        path: "/exam/examCheck",
        query: {
          examId: row.examId
        }
      });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style lang="scss" scoped>
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
/deep/ .avatar {
  width: 320px;
  height: 100%;
  display: block;
}
/deep/ .popper-select {
  position: absolute !important;
  top: 25px !important;
  left: 0px !important;
}
.honor-setting {
  .el-header {
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
    div {
      float: right;
      font-size: 14px;
      color: #666666;
      cursor: pointer;
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
      .left-form {
        float: left;
      }
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
            width: 157.4px;
            height: 86px;
            display: block;
          }
        }
        .middle {
          margin-left: 18px;
          float: left;
          .name {
            font-weight: bold;
            font-size: 14px;
            color: #333333;
            span:first-child {
              // border:1px solid #2BA1F4;
              // color:#2BA1F4;
              // font-weight:normal;
              // padding: 2px 5px;
              // font-size: 12px;
              // border-radius: 10px;
              // margin-right: 10px;
              cursor: pointer;
            }
            // span:nth-child(2){
            //   cursor: pointer;
            // }
          }
          .cloudId {
            margin-top: 5px;
            font-size: 14px;
            color: #666666;
          }
          .price {
            color: #ff783d;
            margin-top: 6px;
            font-weight: 600;
          }
        }
        .courseTime {
          float: right;
          font-size: 14px;
          margin-right: 20px;
          color: #999999;
          line-height: 86px;
        }
        .right {
          float: right;
          line-height: 86px;
          margin-right: 50px;
          color: #2ba1f4;
        }
      }
    }
  }
  .el-date-editor .el-range-separator {
    width: auto;
  }
}
</style>
