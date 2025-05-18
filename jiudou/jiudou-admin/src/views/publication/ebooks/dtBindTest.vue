<template>
  <el-container class="bookInfo">
    <el-main>
      <div>
        <el-form
          :inline="true"
          size="small"
          :model="resForm"
          style="margin-top:20px"
        >
          <el-form-item label="标题:" style="margin-left:15px;">
            <el-input
              v-model.trim="resForm.resName"
              style="width:300px;"
              placeholder="请输入交互练习名称"
            ></el-input>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button type="primary" size="small" @click="toBindSubject"
              >从题库选择</el-button
            >
            <el-button type="primary" size="small" @click="handleShowImport"
              >批量上传题目</el-button
            >
            <el-button type="primary" size="small" @click="toSingle"
              >单题录入</el-button
            >
            <el-button type="text" size="small" @click="toPreview"
              >预览</el-button
            >
            <!-- <el-button type="text" size="small" @click="toClear"
              >清空</el-button
            > -->
          </el-form-item>
        </el-form>
      </div>
      <!-- @selection-change="selectChange" -->

      <div class="resList">
        <el-table
          :data="subjects"
          height="400"
          v-loading="loading.subjectsList"
          ref="subjectsTable"
          stripe
          border
          row-key="id"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <!-- <el-table-column
            label="标签"
            prop="uniqueId"
            align="center"
            width="130px"
          >
            <template slot-scope="scope">
              {{ scope.row.subjectBankInfo.uniqueId }}
            </template>
          </el-table-column> -->
          <el-table-column
            label="题型"
            prop="tSubject"
            align="center"
            width="90px"
          >
            <template slot-scope="scope">
              {{ formatType(scope.row.subjectBankInfo) }}
            </template>
          </el-table-column>

          <el-table-column
            label="难度系数"
            prop="accuracyRate"
            align="center"
            width="100px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.subjectBankInfo.difficultyRate }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="知识点" align="center" width="150px">
          <template slot-scope="scope">
            <span v-html="scope.row.learnPort" v-if="scope.row.tipId"></span>
            <span
              v-html="scope.row.learnPort"
              style="color: red;font-weight:600"
              v-else
            ></span>
          </template>
        </el-table-column> -->
          <el-table-column label="题目" align="center">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-between;">
                <!-- <div class="subject-title">{{subjects[scope.$index].briefTitle}}</div> -->
                <div
                  class="subject-title"
                  v-html="scope.row.subjectBankInfo.briefTitle"
                ></div>
                <el-button
                  size="mini"
                  type="text"
                  @click="preview(scope.row.subjectBankInfo)"
                  >预览</el-button
                >
              </div>
            </template>
          </el-table-column>

          <el-table-column label="题序" align="center" width="80px">
            <template slot-scope="scope">
              <el-input
                size="small"
                type="text"
                v-model="scope.row.ordering"
                v-show="scope.row.isEdit"
                oninput="value=value.replace(/[^0-9]/g,'')"
              />
              <span v-show="!scope.row.isEdit">{{ scope.row.ordering }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100px"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.isEdit"
                @click="editRow(scope.row)"
                size="mini"
                type="text"
                >排序</el-button
              >
              <el-button
                v-if="scope.row.isEdit"
                @click="saveRow(scope.row)"
                size="mini"
                type="text"
                >保存</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="delTestSubject(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="subjects.length" class="right-footer-first">
            从{{ (page.currentPage - 1) * page.pagesize + 1 }}到{{
              (page.currentPage - 1) * page.pagesize + subjects.length
            }}记录，共{{ page.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :page-sizes="[10, 30, 50]"
            :total="page.total"
            :page-size="page.pagesize"
            @size-change="handleSizeChange"
            :current-page.sync="page.currentPage"
            background
            @current-change="loadSubjects"
          ></el-pagination>
        </div>
      </div>
      <div style="margin-top:30px">
        <div style="display:flex;justify-content:center;">
          <el-button type="primary" size="small" @click="setTestName"
            >确定</el-button
          >
          <el-button style="margin-left:30px" type="primary" size="small"
            >取消</el-button
          >
        </div>
      </div>
    </el-main>
    <jd-dialog
      title="题目预览"
      v-if="shwoPreviewDialog"
      :noFooter="true"
      :visible.sync="shwoPreviewDialog"
      width="800px"
    >
      <preview
        slot="body"
        :data="previewSubject"
        style="height:400px;overflow-y: auto"
      ></preview>
    </jd-dialog>
    <!-- 批量导入 -->
    <jd-dialog
      title="导入题目"
      top="15vh"
      :loading="loading.uploadFile"
      :visible.sync="showUploadSubjectsDialog"
      @sure="doImportSure"
    >
      <template slot="body">
        <div style="padding: 0 100px">
          <el-form label-width="70px">
            <el-form-item label="选择文件">
              <fileModal
                ref="subjectsFile"
                @fileChange="handleFileChange"
              ></fileModal>
              <div class="el-upload__tip" style="line-height:17px">
                1、当前仅支持后缀名为.docx的Word文档;
              </div>
              <div class="el-upload__tip" style="line-height:17px">
                2、Word文档大小不超过1M
              </div>
            </el-form-item>
          </el-form>
          <span>试题模板点击下载：</span
          ><el-button
            type="primary"
            size="mini"
            style="background:#11BCE4;border:none"
            @click="downloadFormwork"
            >试题要求与模板.docx</el-button
          >
        </div>
      </template>
    </jd-dialog>
    <!-- 预览资源 -->
    <el-dialog
      :visible.sync="isViewResShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleCloseViewDialog"
      width="800px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>资源预览</div>
        </div>
      </template>
      <viewRes
        :data="viewResObj"
        :style="viewResObj.resType == 2 ? 'height:350px' : ''"
      ></viewRes>
    </el-dialog>
    <!-- 预览练习 -->
    <el-dialog
      top="6vh"
      v-if="isViewPaperShow"
      :visible.sync="isViewPaperShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleCloseTestDialog"
      class="test-dialog"
      width="800px"
      center
    >
      <template slot="title">
        <div>
          <div></div>
          <div>预览练习(共{{ timuListData.length }}题)</div>
        </div>
      </template>

      <viewPaper :timuListData="timuListData"></viewPaper>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
// import axios1 from "axios";
import common from "@/utils/common";
// eslint-disable-next-line no-unused-vars
import { format, formatYMD } from "@/utils/datetime";
import viewRes from "@/components/viewRes";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
import COS from "cos-js-sdk-v5";
// import { formatYMD } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
import fileModal from "@/components/fileModal";
import math from "@/components/jmath";
// import ckeditorConfig from "@/config/ckeditor_config.js";
import preview from "../../tiku/previewSubject.vue";
import viewPaper from "./viewPaper.vue";

export default {
  components: {
    viewRes,
    ElTreeSelect,
    fileModal,
    preview,
    "jd-dialog": jdialog,
    "jd-math": math,
    viewPaper
  },
  data() {
    return {
      iconType: "", // 媒体类型
      editorRole: "", // 身份类型
      dtBookId: this.$route.query.dtBookId,
      chapterNodeId: this.$route.query.chapterNodeId,
      pointId: this.$route.query.pointId,
      versionCode: this.$route.query.versionCode,
      id: this.$route.query.id, //教材ID
      bookNum: this.$route.query.bookNum, // 书号
      catalogId: this.$route.query.catalogId, // 章节ID
      // 腾讯云
      cos: null,
      cosConfig: {
        topDomain: "",
        region: ""
      },
      stepActive: 0,
      comLibList: [],
      breadcrumb: [
        {
          name: "返回上一级",
          rlrNo: "0"
        }
      ],
      resTypes: common.resTypes,
      isShowBreadcrumb: false,
      isViewResShow: false, //预览资源show
      viewResObj: {}, //预览资源传入的数据
      selectedRes: [], //选中资源的原数组
      selectedResTag: [], //选中资源的tag
      stepTableData: [], //下一步中的table的数据
      loading: {
        resLoading: false,
        uploadFile: false
      },
      unUseQrcodeListAll: [], //未使用的二维码列表all
      unUseQrcodeList: [], //未使用的二维码列表
      matchPicList: [], //比对图片列表
      matchPicRadio: "", // 选择的对比图片
      matchPicIndex: "", // 当前AR资源属于列表的index 方便查找
      resForm: {
        libType: "0",
        orgLib: "",
        comLib: "",
        resType: "",
        resName: "",
        rlrParentNo: "0"
      },
      resListData: [],
      selResPage: {
        total: 0,
        page: 1,
        pagesize: 5
      },
      orgResTreeParams: {
        clickParent: true,
        filterable: true,
        "default-expand-all": true,
        "expand-on-click-node": false,
        data: [],
        props: {
          children: "sonResLib",
          label: "rlName",
          value: "rlId"
        }
      },
      orgResParams: {
        multiple: false,
        clearable: true,
        placeholder: "全部"
      },
      isShowMatchPic: false,
      uploadLoading: false,
      // ------------------------------
      showUploadSubjectsDialog: false, // 批量上传题目
      uploadFile: null,
      shwoPreviewDialog: false,
      subjects: [], // 练习题
      page: {
        currentPage: 1,
        pagesize: 10,
        total: 0
      },
      isViewPaperShow: false,
      timuListData: [],
      typeNum: 0,
      timuNum: 0,
      previewSubject: {}
    };
  },
  methods: {
    toClear() {
      // @todo  清空题目
    },
    editRow(row) {
      row.isEdit = true;
    },
    saveRow(row) {
      row.isEdit = false;

      let data = {};
      data.dtbookId = row.dtbookId;
      data.bankId = row.bankId;
      data.ordering = row.ordering;
      data.id = row.id;
      // data.type = 2;
      axios
        .request({
          method: "post",
          url: "/ebook/dTbookSubjectBank/update",
          data
        })
        .then(data => {
          let ret = data.data;
          if (ret.code === 200) {
            row.isEdit = false;
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.loadSubjects();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    delTestSubject(row) {
      this.$confirm("确定要删除该题目吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {};
          params.id = row.id;
          axios
            .request({
              method: "post",
              url: "/ebook/dTbookSubjectBank/delete",
              data: params
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                this.loadSubjects();
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
    toPreview() {
      axios
        .request({
          method: "post",
          url: "/ebook/dTbookSubjectBank/queryBankList",
          data: {
            // examId: 436
            dtbookId: this.$route.query.dtBookId,
            chapterId: this.$route.query.chapterNodeId,
            pointId: this.$route.query.pointId,
            versionCode: this.$route.query.versionCode
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isViewPaperShow = true;
            // this.timuListData = [];
            this.typeNum = 0;
            this.timuNum = 0;
            let bank = [];
            ret.data.bankList.forEach((item, idx) => {
              item.subjectBankInfo.timuNum = idx;
              item.subjectBankInfo.sonSubList.forEach((e, index) => {
                e.timuNum = index;
              });
              bank.push(item.subjectBankInfo);
            });
            // this.timuListData = ret.data.bankList;
            this.timuListData = bank;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    handleCloseTestDialog() {
      this.isViewPaperShow = false;
    },
    toSingle() {
      this.$router.push({
        path: "/epub-publication/dtSingleIn",
        query: {
          // libId: 1873,
          courseId: 78,
          dtBookId: this.$route.query.dtBookId,
          chapterNodeId: this.$route.query.chapterNodeId,
          pointId: this.$route.query.pointId,
          versionCode: this.$route.query.versionCode
        }
      });
    },
    setTestName() {
      if (this.resForm.resName.length == 0) {
        this.$message({
          message: "请设置交互练习名称",
          type: "warning"
        });
        return;
      }
      let data = {};
      data.dtbookId = this.dtBookId;
      data.chapterId = this.chapterNodeId;
      data.pointId = this.pointId;
      data.versionCode = this.versionCode;
      data.title = this.resForm.resName;
      axios
        .request({
          method: "post",
          url: "/ebook/dTbookSubjectBank/editTitle",
          data
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            // 设置名称成功,关闭弹窗@todo
          }
        });
    },
    // 类型
    formatType(row) {
      return common.typeFormat(row.tSubject);
    },
    // 加载练习题目
    loadSubjects() {
      let data = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pagesize
      };
      data.dtbookId = this.dtBookId;
      data.chapterId = this.chapterNodeId;
      data.pointId = this.pointId;
      data.versionCode = this.versionCode;
      axios
        .request({
          method: "post",
          url: "/ebook/dTbookSubjectBank/queryBankPage",
          data: data
        })
        .then(
          function(data) {
            this.loading.subjectsList = false;
            let res = data.data;
            if (res.code == 200) {
              res.data.records.forEach(item => {
                item.isEdit = false;
              });
              this.page.total = res.data.total;
              this.subjects = res.data.records;
            }
          }.bind(this)
        );
    },
    // 下载模板
    downloadFormwork() {
      this.cos.getObjectUrl(
        {
          Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
          Region: this.cosConfig.region,
          Key: "download/题库模板.docx",
          Sign: true
        },
        function(err, data) {
          if (!err) {
            var url =
              data.Url +
              (data.Url.indexOf("?") > -1 ? "&" : "?") +
              "response-content-disposition=attachment"; // 补充强制下载的参数
            // window.open(downloadUrl); // 这里是新窗口打开 url，如果需要在当前窗口打开，可以使用隐藏的 iframe 下载，或使用 a 标签 download 属性协助下载
            let elemIF = window.document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            window.document.body.appendChild(elemIF);
          }
        }
      );
    },
    // 上传文件发生变化
    handleFileChange(file) {
      this.uploadFile = file;
    },
    //批量上传事件
    handleShowImport() {
      this.loading.uploadFile = false;
      this.showUploadSubjectsDialog = true;
      this.$nextTick(function() {
        this.$refs.subjectsFile.clearFile();
      });
    },
    //确认导入
    doImportSure() {
      if (this.uploadFile) {
        this.loading.uploadFile = true;
        let fd = new FormData();
        fd.append("docxFile", this.uploadFile);
        fd.append("sblType", 0);
        axios
          .request({
            method: "post",
            url: "/v1/subjectBank/previewWord",
            data: fd
          })
          .then(
            function(data) {
              let res = data.data;
              this.loading.uploadFile = false;
              if (res.code == 200) {
                // 显示预览弹窗
                this.$store.commit("setSubjects", res.data);
                this.$router.push({
                  path: "/epub-publication/importPreTem",
                  query: {
                    belongType: 5,
                    dtBookId: this.$route.query.dtBookId,
                    chapterNodeId: this.$route.query.chapterNodeId,
                    pointId: this.$route.query.pointId,
                    versionCode: this.$route.query.versionCode
                  }
                });
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            }.bind(this)
          )
          .catch(() => {
            this.loading.uploadFile = false;
            this.$message({
              message: "服务器异常",
              type: "warning"
            });
          });
      } else {
        this.$message({
          message: "请选择文件",
          type: "warning"
        });
      }
    },
    // 上传资源
    uploadSectionFile(params) {
      console.log(params);
      const form = new FormData();
      // 文件对象
      form.append("file", params.file);
      form.append("dtbookId", 30);
      this.uploadLoading = true;
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/common/feign/upload/uploadDTbookRes`,
          data: form
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.uploadLoading = false;
            // let { sourceUrl } = res.data;
            // let data = {};
            // data.dtBookId = "";
            // data.chapterNodeId = "";
            // data.pointId = "";
            // data.versionCode = "";
            // data.resName = params.file.name;
            // data.resUrl = sourceUrl;
            // data.businessType = "";
            // axios
            //   .request({
            //     method: "post",
            //     url: `/ebook/dTbookMatchpic/addAndBingRes`
            //   })
            //   .then(res => {
            //     let ret = res.data;
            //     if (ret.code === 200) {
            //     } else {
            //       this.$message({
            //         type: "warning",
            //         message: "绑定资源失败"
            //       });
            //     }
            //   });
          } else {
            this.uploadLoading = false;
            this.$message({
              type: "warning",
              message: "上传失败"
            });
          }
        });
    },
    beforeAvatarUpload(file) {
      // let isPic = file.type.includes("image");
      // if (!isPic) {
      //   this.$message({
      //     type: "warning",
      //     message: "只支持上传图片"
      //   });
      //   return;
      // }
      // return isPic;
    },
    toBindSubject() {
      this.$router.push({
        path: "/epub-publication/dtSearchTest",
        query: {
          dtBookId: this.$route.query.dtBookId,
          chapterNodeId: this.$route.query.chapterNodeId,
          pointId: this.$route.query.pointId,
          versionCode: this.$route.query.versionCode
        }
      });
    },
    doBindResource() {
      // 数字教材绑定资源  todo
      let flag = true;
      this.stepTableData.forEach(element => {
        if (element.matchPicName == "") {
          flag = false;
        }
      });
      if (flag) {
        axios
          .request({
            method: "post",
            url: "/ebook/dTbookMatchpic/bingResource",
            data: {
              dtBookId: this.id,
              // resChapter: this.catalogId,
              matchPicInfoJson: JSON.stringify(this.stepTableData)
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              window.parent.postMessage(
                ret.data.map(function(item) {
                  return {
                    type: "resource",
                    resName: item.resName,
                    resType: item.businessType,
                    resUrl: item.resUrl
                  };
                })
              );
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
      } else {
      }
    },
    //查看资源
    handleViewRes(row) {
      this.viewResObj = row;
      this.isViewResShow = true;
    },
    //关闭预览资源弹框清空数据
    handleCloseViewDialog() {
      this.viewResObj = {};
      this.isViewResShow = false;
    },
    toBook() {
      this.$router.push({
        path: "/epub-publication/epubBookBindResource",
        query: {
          id: this.id
        }
      });
    },
    resStep1() {
      if (this.stepActive == 0) {
        return false;
      } else {
        this.stepPrev();
      }
    },
    resStep2() {
      if (this.stepActive == 1) {
        return false;
      } else {
        this.stepNext();
      }
    },
    //上一步
    stepPrev() {
      this.stepActive = 0;
      //返回上一步 记录上次的勾选
      this.selectedResTag.forEach(row => {
        this.$nextTick(() => {
          this.$refs.resListTable.toggleRowSelection(row);
        });
      });
    },
    //下一步
    stepNext() {
      this.stepTableData = [];
      if (this.selectedRes.length > 0) {
        this.stepActive = 1;
        this.loadUnusedQrcode();
        this.selectedResTag.forEach(element => {
          let obj = {};
          obj.resourceId = element.rlrResourceId;
          obj.resName = element.resName;
          obj.matchPicName = element.resName;
          obj.resPage = "";
          obj.businessType = element.resType;
          // AR资源 取resUrlWeb
          obj.resUrl =
            element.resType == 3 ? element.resUrlWeb : element.resUrl;
          // obj.qrCodeId = null
          obj.matchPicId = null;
          this.stepTableData.push(obj);
        });
      } else {
        this.$message({
          message: "请选择资源",
          type: "warning"
        });
      }
    },
    // 绑定资源确定事件
    doBindBookRes() {
      // 数字教材绑定资源  todo
      let flag = true;
      this.stepTableData.forEach(element => {
        if (element.matchPicName == "") {
          flag = false;
        }
        // if (element.resPage == "") {
        //   flag = false;
        // }
      });
      if (flag) {
        axios
          .request({
            method: "post",
            url: "/ebook/dTbookMatchpic/bingResource",
            data: {
              dtBookId: this.id,
              // resChapter: this.catalogId,
              matchPicInfoJson: JSON.stringify(this.stepTableData)
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              window.parent.postMessage(
                ret.data.map(function(item) {
                  return {
                    type: "resource",
                    resName: item.resName,
                    resType: item.businessType,
                    resUrl: item.resUrl
                  };
                })
              );
              this.doReturn();
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
      } else {
        this.$message({
          type: "warning",
          message: "资源展示名不能为空"
        });
      }
    },
    // 切换公共资源库和机构资源库事件
    resLibChange() {
      this.resForm.comLib = "";
      // this.resForm.orgLib = ''
      this.resForm.resName = "";
      this.resForm.resType = "";
      this.resSearch();
    },
    //资源查询按钮
    resSearch() {
      this.selResPage.page = 1;
      this.loadResList();
    },
    //选择资源每页显示数据条数切换事件
    handleSizeChange(val) {
      this.selResPage.pagesize = val;
      this.loadResList();
    },
    orgResSearch(value) {
      this.$refs.orgResSelect.filterFun(value);
    },
    // 资源列表选中事件
    changeSelect(selection) {
      this.selectedResTag = [];
      this.selectedRes = selection;
      this.selectedResTag = selection;
    },
    // 取消选中某一列资源
    handleCloseSelectedRes(row) {
      this.selectedResTag.splice(this.selectedResTag.indexOf(row), 1);
      this.$refs.resListTable.toggleRowSelection(row);
    },
    // 预览
    preview(row) {
      this.previewSubject = row;
      this.shwoPreviewDialog = true;
    },
    getRowKeys(row) {
      return row.rlrId;
    },
    // 如果是文件夹不能选中
    isSelectable(row) {
      if (row && row.resType == 11) {
        return false;
      }
      return true;
    },
    // 进入文件夹
    toFolder(row, index) {
      this.resForm.rlrParentNo = row.rlrNo;
      if (index === undefined) {
        let current = {
          name: row.resName,
          rlrNo: row.rlrNo
        };
        if (this.breadcrumb.length === 1) {
          this.isShowBreadcrumb = true;
        }
        this.breadcrumb.push(current);
      } else {
        this.breadcrumb.splice(index + 1);
        if (this.breadcrumb.length === 1) {
          this.isShowBreadcrumb = false;
        }
      }
      this.resForm.resName = "";
      this.resForm.resType = "";
      this.selResPage.page = 1;
      this.resSearch();
    },
    //table资源类型
    formatResType(resType) {
      return common.resTypeFormat(resType);
    },
    //table资源大小
    formatResSize(row) {
      if (row.resSize) {
        return (row.resSize / 1024).toFixed(1) + "KB";
      }
    },
    formatShowTip(tipsText) {
      if (tipsText) {
        if (tipsText.substring(tipsText.length - 1) == ",") {
          tipsText = tipsText.substring(0, tipsText.length - 1);
        }
        if (tipsText.substring(0, 1) == ",") {
          tipsText = tipsText.substring(1, tipsText.length);
        }
        if (tipsText) {
          return tipsText.split(",");
        } else {
          return [];
        }
      }
    },
    // 时间
    formatDate(row) {
      return format(row.rlrCreateTime);
    },
    // 点击取消返回教材bookinfo界面
    doReturn() {
      this.$router.push({
        path: "/epub-publication/epubBookBindResource",
        query: {
          id: this.id
          // returnType: 1, //1是返回扫码资源 2是返回自测习题 3是返回教材习题
          // returnCatalogId: this.catalogId
        }
      });
    },
    //加载未使用的二维码
    loadUnusedQrcode() {
      axios
        .request({
          method: "post",
          url: "/resource/tbMatchPic/getUnusedQrCode",
          data: {
            id: this.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.forEach(element => {
              element.qrcodeNickname = `${this.bookNum}-${element.qrcodeNickname}`;
            });
            this.unUseQrcodeList = ret.data;
            this.unUseQrcodeListAll = ret.data;
          }
        });
    },
    // 处理二维码绑定变化事件
    handleQrcodeChange(row) {
      let arr = [];
      let arr1 = [];
      this.stepTableData.forEach(element => {
        if (element.qrCodeId) {
          arr.push(element.qrCodeId);
        }
      });
      this.unUseQrcodeListAll.forEach(el1 => {
        let flag = true;
        arr.forEach(el2 => {
          if (el2 == el1.id) {
            flag = false;
          }
        });
        if (flag) {
          arr1.push(el1);
        }
      });
      this.unUseQrcodeList = arr1;
    },
    // 展示比对图片弹框
    handleShowMatchPic(row, index) {
      this.matchPicIndex = index;
      this.matchPicRadio = "";
      axios
        .request({
          method: "post",
          url: "/resource/tspMatchPic/listAll",
          data: {
            resourceId: row.resourceId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.matchPicList = ret.data;
            if (ret.data.length > 0) {
              this.isShowMatchPic = true;
            } else {
              this.$message({
                type: "success",
                message: "当前资源暂无可使用的资源码"
              });
            }
          }
        });
    },
    doSelectMatchPic() {
      this.stepTableData[this.matchPicIndex].matchPicId = this.matchPicRadio;
      this.isShowMatchPic = false;
    },
    //加载资源列表
    loadResList() {
      this.loading.resLoading = true;
      let url = "/resource/v4/commonRL/itemsWithCount";
      let data = {
        page: this.selResPage.page,
        pagesize: this.selResPage.pagesize,
        resName: this.resForm.resName,
        resType: this.resForm.resType
      };
      if (this.resForm.libType == 1) {
        url = "/v1/orgResourceLibrary/resource";
        data.rlrRlId = this.resForm.orgLib;
      } else {
        data.rlIsOfficial = 1;
        data.rlrRlId = this.resForm.comLib;
      }
      if (this.resForm.rlrParentNo) {
        data.rlrParentNo = this.resForm.rlrParentNo;
      } else {
        data.rlrParentNo = "0";
      }
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(
          function(data) {
            this.loading.resLoading = false;
            let res = data.data;
            if (res.code == 200) {
              this.resListData = res.data.data;
              this.selResPage.total = res.data.total;
            }
          }.bind(this)
        );
    },
    //加载公共资源库列表
    initComResLib() {
      axios
        .request({
          method: "post",
          url: "/resource/resourceLibrary/commonList",
          data: {
            rlIsOfficial: 1
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.comLibList = ret.data;
            this.comLibList.unshift({
              rlName: "全部",
              rlId: ""
            });
          }
        });
    },
    //加载机构资源库
    initOrgResLib() {
      axios
        .request({
          method: "post",
          url: process.env.BASE_URL + "/v1/orgResourceLibrary/resLibList",
          data: { uid: this.$store.state.user.userId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.orgResTreeParams.data = res.data;
              //默认选中第一个
              // this.resForm.orgLib = res.data[0].rlId
            }
          }.bind(this)
        );
    },
    initCOS() {
      // 初始化COS
      axios
        .request({
          method: "post",
          url: "/v1/upload/jsInitInfo"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            var info = ret.data;
            this.cosConfig.bucket = info.bucket;
            this.cosConfig.imgBucket = info.imgBucket;
            this.cosConfig.appId = info.appId;
            if (info.domain) {
              this.cosConfig.topDomain = info.domain;
            }
            if (info.region) {
              this.cosConfig.region = info.region;
            }
            this.cos = new COS({
              // 必选参数
              getAuthorization: function(options, callback) {
                axios
                  .request({
                    method: "post",
                    url: "/v1/upload/cosSignatureV5",
                    data: {
                      bucket: options.Bucket,
                      region: options.Region
                    }
                  })
                  .then(res => {
                    let ret = res.data;
                    if (ret.code === 200) {
                      let obj = {
                        TmpSecretId: ret.data.tmpSecretId,
                        TmpSecretKey: ret.data.tmpSecretKey,
                        XCosSecurityToken: ret.data.xCosSecurityToken,
                        ExpiredTime: ret.data.expiredTime
                      };
                      callback(obj);
                    }
                  });
              }
            });
          }
        });
    }
  },
  mounted() {
    this.loadSubjects();
  }
};
</script>

<style lang="scss">
.bookInfo {
  .test-dialog {
    // width: 90% !important;
    .el-dialog__body {
      height: 75vh;
      overflow: hidden;
      overflow-y: auto;
    }
  }
  .el-main {
    margin: 5px 20px 20px;
    padding: 0;
    .resList {
      .el-table td,
      .el-table th {
        padding: 0;
      }
      .info {
        overflow: hidden;
        padding: 0;
        .left {
          float: left;
          margin-top: 20px;
          margin-left: 24px;
          cursor: pointer;
          img {
            width: 100px;
            height: 60px;
          }
        }
        .middle {
          float: left;
          margin: 0;
          padding: 0;
          margin-top: 12px;
          margin-left: 20px;
          text-align: left;
          max-width: 58%;
          .name {
            font-size: 14px;
            color: #333333;
          }
          .resourceId {
            font-size: 14px;
            color: #666666;
            margin-top: 5px;
            margin-bottom: 5px;
          }
          .tipsText {
            span {
              display: inline-block;
              padding: 0 12px;
              background: #edf1f7;
              border-radius: 12px;
              color: #0d4376;
              font-size: 12px;
              opacity: 0.7;
              margin-right: 5px;
              margin-bottom: 5px;
            }
          }
        }
        .right {
          float: right;
          .resSize,
          .updateTime {
            float: right;
            font-size: 12px;
            color: #999999;
            height: 100%;
            line-height: 100px;
            margin-right: 20px;
          }
        }
      }
      .startRes {
        color: #666666;
        text-align: center;
        font-size: 14px;
      }
      .stopRes {
        background: #afc5d5;
        color: #ffffff;
        border-radius: 5px;
        padding: 5px 13px;
        text-align: center;
        font-size: 14px;
      }
    }
    .courseTag {
      .el-tag {
        margin-right: 10px;
        margin-bottom: 5px;
      }
      .el-tag + .el-tag {
        margin-right: 10px;
      }
      .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
        font-size: 20px;
        font-weight: 600;
        cursor: pointer;
      }
      .input-new-tag {
        width: 190px;
        margin-top: 5px;
        vertical-align: bottom;
      }
    }
  }
}
</style>
