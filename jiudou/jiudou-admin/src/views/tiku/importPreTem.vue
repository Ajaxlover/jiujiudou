<template>
  <el-container class="importPreTem">
    <el-header height="50px">
      <span>批量导入确认</span>
      <span v-if="testList.length > 0">
        <span style="color:#999999;font-size:14px;margin-left:15px;"
          >共{{ testList.length }}道题</span
        >
        <span style="color:#999999;font-size:14px;"
          >（
          <span style="margin-left:5px" v-if="type1 > 0"
            >判断题{{ type1 }}道</span
          >
          <span style="margin-left:5px" v-if="type2 > 0"
            >单选题{{ type2 }}道</span
          >
          <span style="margin-left:5px" v-if="type3 > 0"
            >多选题{{ type3 }}道</span
          >
          <span style="margin-left:5px" v-if="type4 > 0"
            >填空题{{ type4 }}道</span
          >
          <span style="margin-left:5px" v-if="type5 > 0"
            >问答题{{ type5 }}道</span
          >
          <!-- <span style="margin-left:5px" v-if="type6 > 0"
            >实操题{{ type6 }}道</span
          >
          <span style="margin-left:5px" v-if="type10 > 0"
            >完形填空{{ type10 }}道</span
          > -->
          <span style="margin-left:5px" v-if="type11 > 0"
            >组合题{{ type11 }}道</span
          >
          <span style="margin-left:5px" v-if="type0 > 0"
            >其他{{ type0 }}道</span
          >
          ）</span
        >
      </span>
      <el-button @click="loadTest" type="primary" size="small"
        >下载Word</el-button
      >
      <el-button
        @click="aginUpload"
        type="primary"
        size="small"
        style="margin-right:15px"
        >重新上传</el-button
      >
    </el-header>
    <el-main>
      <div v-if="testList.length > 0">
        <importPreview
          v-for="(item, index) in testList"
          :key="index"
          :data="item"
          :index="index + 1"
        ></importPreview>
      </div>
      <div v-else style="text-align:center;color:#999999;margin-top:150px">
        <div>没有解析出习题，请核对导入习题文件是否正确后重试</div>
        <el-button
          @click="isImportShow = true"
          type="primary"
          round
          style="margin-top:30px"
          >重新批量导入</el-button
        >
      </div>
      <div class="bottomBtnBox">
        <span class="textTs"
          >请先核对页面习题显示是否正常，然后点击右上角“下载Word”再次核对，无误后点击“确认导入”</span
        >
        <el-button size="small" :loading="importLoading" @click="doImport"
          >确认导入</el-button
        >
        <el-button size="small" @click="doReturn">取消</el-button>
      </div>
    </el-main>
    <!-- 导入 -->
    <el-dialog
      :visible.sync="isImportShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>重新导入题目</div>
        </div>
      </template>
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
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          @click="doUploadWord"
          :loading="uploadWordLoading"
          >确定</el-button
        >
        <el-button size="small" @click="isImportShow = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import importPreview from "@/components/importPreview";
import fileModal from "@/components/fileModal";
import COS from "cos-js-sdk-v5";

export default {
  components: {
    importPreview,
    fileModal
  },
  data() {
    return {
      testList: this.$store.state.importPreTem.testList,
      belongId: this.$route.query.belongId, // 章节ID
      belongType: this.$route.query.belongType, // 1题库 2教材题 3教材自测题
      textbookId: this.$route.query.textbookId,
      isImportShow: false,
      // 待上传的文件
      uploadFile: null,
      uploadWordLoading: false,
      importLoading: false,
      type1: 0,
      type2: 0,
      type3: 0,
      type4: 0,
      type5: 0,
      type6: 0,
      type10: 0,
      type11: 0,
      type0: 0,
      cos: null,
      cosConfig: {
        topDomain: "",
        region: ""
      }
    };
  },
  computed: {
    pubId() {
      return this.$store.state.user.currentRole.pubId;
    }
  },
  methods: {
    // 重新上传
    aginUpload() {
      this.uploadFile = null;
      this.type0 = 0;
      this.type1 = 0;
      this.type2 = 0;
      this.type3 = 0;
      this.type4 = 0;
      this.type5 = 0;
      this.type6 = 0;
      this.type10 = 0;
      this.type11 = 0;
      this.testList = [];
      this.$nextTick(res => {
        if (this.$refs.subjectsFile) {
          this.$refs.subjectsFile.clearFile();
        }
      });
      this.isImportShow = true;
    },
    // 添加题目确定事件
    doImport() {
      if (this.testList.length == 0) {
        this.$message({
          message: "请先导入题目，确认无误后确认导入",
          type: "warning"
        });
        return;
      }
      this.importLoading = true;
      let data = {};
      let url = "";
      if (this.belongType == 4) {
        // 我的题库
        url = "/subject/subjectBankLibrary/saveItemBatch";
        data.libId = this.belongId;
        data.jsonStr = JSON.stringify(this.testList);
      } else if (this.belongType == 5) {
        // 公共题库
        url = "/subject/subjectBankLibrary/saveItemBatchCom";
        data.libId = this.belongId;
        data.jsonStr = JSON.stringify(this.testList);
      } else {
        data.sbJsonStr = JSON.stringify(this.testList);
        data.belongType = this.belongType;
        data.currentPub = this.pubId;
        data.currentUid = this.$store.state.user.userId;
        url = "/subject/subjectBankLibrary/saveItemBatchSbJson";
        if (this.belongType != 1) {
          // 如果是自测题或教材题
          data.belongId = this.textbookId;
          data.catId = this.belongId;
        } else {
          // 录入机构题库
          data.belongId = this.belongId;
        }
      }
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(res => {
          this.importLoading = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.doReturn();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 点击取消返回教材bookinfo界面
    doReturn() {
      this.$store.commit("setTestList", []);
      if (
        this.belongType == 1 ||
        this.belongType == 4 ||
        this.belongType == 5
      ) {
        this.$router.push({
          path: "/tiku/tiku",
          query: {
            belongId: this.belongId,
            belongType: 1 //1题库 2教材题 3教材自测题
          }
        });
      } else {
        this.$router.push({
          path: "/publication/bookInfo",
          query: {
            belongId: this.belongId,
            belongType: this.belongType, // 2教材习题 3自测题
            textbookId: this.textbookId
          }
        });
      }
    },
    doUploadWord() {
      if (this.uploadFile) {
        if (this.uploadFile.size > 1024 * 1024) {
          this.$message({
            message: "文件过大",
            type: "warning"
          });
          return;
        }
        this.uploadWordLoading = true;
        let fd = new FormData();
        let sblType = 1;
        fd.append("docxFile", this.uploadFile);
        fd.append("libId", this.belongId);
        this.belongType === 4 ? (sblType = 0) : (sblType = 1);
        fd.append("sblType", sblType);
        axios
          .request({
            method: "post",
            url: "/v1/subjectBank/previewWord",
            data: fd
          })
          .then(
            function(data) {
              this.uploadWordLoading = false;
              let res = data.data;
              if (res.code == 200) {
                this.testList = res.data;
                this.renderTypeNum();
                this.isImportShow = false;
              } else {
                this.uploadWordLoading = false;
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            }.bind(this)
          )
          .catch(() => {
            this.uploadWordLoading = false;
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
    // 上传文件发生变化
    handleFileChange(file) {
      this.uploadFile = file;
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
    loadTest() {
      if (this.testList.length > 0) {
        let elemIF = window.document.createElement("iframe");
        elemIF.id = "down-file-iframe";
        let form = window.document.createElement("form");
        form.target = "down-file-iframe";
        form.setAttribute(
          "action",
          process.env.BASE_URL + "/tiku/v4/subjectBank/word"
        );
        form.setAttribute("method", "post");
        let input1 = window.document.createElement("input");
        input1.type = "hidden";
        input1.name = "token";
        input1.value = this.$store.state.user.token;
        let input2 = window.document.createElement("input");
        input2.type = "hidden";
        input2.name = "jsonStr";
        input2.value = JSON.stringify(this.testList);
        form.appendChild(input1);
        form.appendChild(input2);
        window.document.body.appendChild(elemIF);
        elemIF.appendChild(form);
        form.submit();
        elemIF.remove();
      } else {
        this.$message({
          type: "warning",
          message: "请先导入题目,再下载核对"
        });
      }
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
    },
    renderTypeNum() {
      this.testList.forEach(element => {
        if (element.tSubject == 0) {
          this.type0++;
        } else if (element.tSubject == 1) {
          this.type1++;
        } else if (element.tSubject == 2) {
          this.type2++;
        } else if (element.tSubject == 3) {
          this.type3++;
        } else if (element.tSubject == 4) {
          this.type4++;
        } else if (element.tSubject == 5) {
          this.type5++;
        } else if (element.tSubject == 6) {
          this.type6++;
        } else if (element.tSubject == 10) {
          this.type10++;
        } else if (element.tSubject == 11) {
          this.type11++;
        }
      });
    }
  },
  mounted() {
    this.initCOS();
    this.renderTypeNum();
  }
};
</script>

<style lang="scss">
.importPreTem {
  height: 100%;
  overflow: auto;
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    position: fixed;
    left: 170px;
    right: 0;
    .el-button {
      float: right;
      margin-top: 9px;
    }
  }
  .el-main {
    margin: 72px 20px 22px;
    background: #ffffff;
    border-radius: 4px;
    padding: 12px 18px 70px;
    height: 100%;
    overflow-y: auto;
    .bottomBtnBox {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 170px;
      background: rgba(43, 161, 244, 1);
      box-shadow: 0px 2px 16px 0px rgba(13, 67, 118, 0.2);
      height: 50px;
      line-height: 50px;
      z-index: 11;
      padding-right: 30px;
      .textTs {
        color: #ffffff;
        font-size: 14px;
        margin-left: 20px;
      }
      .el-button {
        float: right;
        margin-right: 15px;
        margin-top: 9px;
      }
    }
  }
  .el-main::-webkit-scrollbar {
    width: 8px;
    height: 2px;
    // background:#ccc;
    border-radius: 5px;
  }
  .el-main::-webkit-scrollbar-thumb {
    display: block;
    width: 8px;
    margin: 0 auto;
    border-radius: 5px;
    background: rgba(43, 161, 244, 0.6);
  }
}
</style>
