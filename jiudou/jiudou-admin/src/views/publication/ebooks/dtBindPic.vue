<template>
  <el-container class="bookInfo">
    <el-main>
      <div>
        <el-button type="primary" size="small">资源库添加</el-button>
        <el-button type="primary" size="small">本地上传</el-button>
      </div>
      <div>
        <el-form
          label-width="70px"
          style="margin-top:20px"
          v-if="selectedResTag.length > 0"
        >
          <el-form-item label="已选资源" class="courseTag">
            <el-tag
              :key="item.rlrId"
              v-for="item in selectedResTag"
              closable
              :disable-transitions="false"
              @close="handleCloseSelectedRes(item)"
              >#{{ formatResType(item.resType) }}# {{ item.resName }}</el-tag
            >
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-form
          :inline="true"
          size="small"
          :model="resForm"
          style="margin-top:20px"
        >
          <el-form-item label="资源库">
            <el-select
              v-model="resForm.libType"
              size="small"
              style="width:80px;"
              @change="resLibChange"
            >
              <el-option label="公共" value="0"></el-option>
              <el-option label="机构" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="resForm.libType == 0">
            <el-select
              v-model="resForm.comLib"
              size="small"
              style="width:120px;"
              @change="resSearch"
            >
              <el-option
                v-for="item in comLibList"
                :key="item.rlId"
                :label="item.rlName"
                :value="item.rlId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="resForm.libType == 1">
            <el-tree-select
              v-model="resForm.orgLib"
              :selectParams="orgResParams"
              size="small"
              :treeParams="orgResTreeParams"
              @searchFun="orgResSearch"
              ref="orgResSelect"
              @input="resSearch"
            />
          </el-form-item>
          <el-form-item label="文件类型" style="margin-left:15px;">
            <el-select
              v-model="resForm.resType"
              placeholder="类型"
              size="small"
              style="width:100px;"
              @change="resSearch"
            >
              <el-option
                v-for="type in resTypes"
                :key="type.type"
                :label="type.name"
                :value="type.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left:15px;">
            <el-input
              v-model="resForm.resName"
              style="width:300px;"
              placeholder="搜索资源"
              @keyup.enter.native="resSearch"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="resSearch"
              class="el-icon-search"
            ></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="resList">
        <el-table
          :data="resListData"
          border
          :row-style="{ height: '100px' }"
          v-loading="loading.resLoading"
          :row-key="getRowKeys"
          :show-header="false"
          @selection-change="changeSelect"
          ref="resListTable"
        >
          <el-table-column
            type="selection"
            align="center"
            :reserve-selection="true"
            :selectable="isSelectable"
          ></el-table-column>
          <el-table-column align="center" min-width="700">
            <div slot-scope="scope" class="info">
              <div class="left">
                <img
                  v-if="scope.row.resType === 1"
                  src="@/assets/images/audio.png"
                  alt=""
                  @click="handleViewRes(scope.row)"
                />
                <div
                  v-else-if="scope.row.resType === 2"
                  @click="handleViewRes(scope.row)"
                  style="position:relative;width:100px;height:60px;"
                >
                  <div
                    v-if="scope.row.designPic"
                    style="position:relative;background:rgba(0,0,0,0.5);height:60px;border-radius: 4px;"
                  >
                    <img
                      :src="scope.row.designPic"
                      alt=""
                      style="height:60px;width:auto;max-width:100px;"
                    />
                    <img
                      src="@/assets/images/shipin.png"
                      alt=""
                      style="position:absolute;right:0;top:0;width:27px;height:17px;"
                    />
                  </div>
                  <img v-else src="@/assets/images/video.png" alt="" />
                </div>
                <div
                  v-else-if="scope.row.resType === 3"
                  @click="handleViewRes(scope.row)"
                  style="position:relative"
                >
                  <!-- <img :src="scope.row.designPic" alt="" style="border-radius: 4px;"> -->
                  <img
                    v-if="scope.row.designPic"
                    :src="scope.row.designPic"
                    alt=""
                    style="border-radius: 4px;"
                  />
                  <img
                    v-else
                    src="@/assets/images/other.png"
                    alt=""
                    style="border-radius: 4px;"
                  />
                  <img
                    src="@/assets/images/arIcon.png"
                    alt=""
                    style="position:absolute;right:0;top:0;width:27px;height:17px;"
                  />
                </div>
                <img
                  v-else-if="scope.row.resType === 4"
                  @click="handleViewRes(scope.row)"
                  src="@/assets/images/excel.png"
                  alt=""
                />
                <img
                  v-else-if="scope.row.resType === 5"
                  @click="handleViewRes(scope.row)"
                  src="@/assets/images/h5.png"
                  alt=""
                />
                <img
                  v-else-if="scope.row.resType === 6"
                  @click="handleViewRes(scope.row)"
                  src="@/assets/images/ppt.png"
                  alt=""
                />
                <img
                  v-else-if="scope.row.resType === 7"
                  @click="handleViewRes(scope.row)"
                  src="@/assets/images/word.png"
                  alt=""
                />
                <img
                  v-else-if="scope.row.resType === 9"
                  @click="handleViewRes(scope.row)"
                  src="@/assets/images/pdf.png"
                  alt=""
                />
                <div
                  v-else-if="scope.row.resType === 10"
                  @click="handleViewRes(scope.row)"
                  style="background:rgba(0,0,0,0.5);width:100px;height:60px;border-radius: 4px;"
                >
                  <img
                    v-if="scope.row.resUrlWeb"
                    :src="scope.row.resUrlWeb"
                    alt=""
                    style="height:60px;width:auto;max-width:100px;"
                  />
                  <img v-else src="@/assets/images/img.png" />
                </div>
                <img
                  v-else-if="scope.row.resType === 11"
                  style="cursor: pointer;"
                  src="@/assets/images/fileFolder.png"
                  alt=""
                  @click="toFolder(scope.row)"
                />
                <img
                  v-else-if="scope.row.resType === 12"
                  @click="handleViewRes(scope.row)"
                  src="@/assets/images/yypc.png"
                  alt=""
                />
                <img
                  v-else
                  src="@/assets/images/other.png"
                  @click="handleViewRes(scope.row)"
                  alt=""
                />
              </div>
              <div class="middle">
                <div
                  class="name"
                  style="cursor:pointer;"
                  @click="handleViewRes(scope.row)"
                >
                  {{ scope.row.resName }}
                </div>
                <div class="resourceId">
                  资源ID: {{ scope.row.rlrResourceId }}
                </div>
                <div class="tipsText">
                  <span
                    v-for="(item, index) in formatShowTip(scope.row.tipsText)"
                    :key="index"
                    >{{ item }}</span
                  >
                </div>
              </div>
              <div class="right">
                <div class="updateTime">{{ formatDate(scope.row) }}</div>
                <div class="resSize" v-if="scope.row.resModel === 1">
                  {{ formatResSize(scope.row) }}
                </div>
              </div>
            </div>
          </el-table-column>
        </el-table>
      </div>
      <div class="tabelFooter">
        <div v-if="resListData.length" class="right-footer-first">
          从{{ (selResPage.page - 1) * selResPage.pagesize + 1 }}到{{
            (selResPage.page - 1) * selResPage.pagesize + resListData.length
          }}记录，共{{ selResPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :page-sizes="[10, 30, 50]"
          :total="selResPage.total"
          @size-change="handleSizeChange"
          :page-size="selResPage.pagesize"
          :current-page.sync="selResPage.page"
          background
          @current-change="loadResList"
        ></el-pagination>
      </div>
    </el-main>

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
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { format } from "@/utils/datetime";
import viewRes from "@/components/viewRes";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";

export default {
  components: {
    viewRes,
    ElTreeSelect
  },
  data() {
    return {
      id: this.$route.query.id, //教材ID
      bookNum: this.$route.query.bookNum, // 书号
      catalogId: this.$route.query.catalogId, // 章节ID
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
        resLoading: false
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
      isShowMatchPic: false
    };
  },
  methods: {
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
    }
  },
  mounted() {
    this.initComResLib();
    this.initOrgResLib();
    this.loadResList();
  }
};
</script>

<style lang="scss">
.bookInfo {
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
