<template>
  <el-container class="myRes">
    <!-- 教材资源库列表 -->
    <el-aside width="182px">
      <div class="listHeader">
        <span>
          教材列表
        </span>
        <i
          style="cursor:pointer"
          @click="isShowSearchInput = !isShowSearchInput"
          class="el-icon-search"
        ></i>
      </div>
      <div v-show="isShowSearchInput">
        <!-- <el-input
          size="small"
          v-model="searchForm.resType"
          placeholder="请输入教材名称"
        ></el-input> -->
        <el-input
          size="small"
          placeholder="教材名称"
          v-model="textBookName"
          class="input-with-select"
        >
          <el-button
            @click="searchBook"
            style="padding-left:10px;padding-right:10px"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </div>
      <div style="height:638px;overflow-y:auto">
        <el-tree
          :data="resListData"
          :props="defaultProps"
          v-loading="loading.resList"
          :expand-on-click-node="false"
          highlight-current
          node-key="textbookId"
          ref="vuetree"
          icon-class="el-icon-arrow-right"
          @node-click="handleNodeClick"
          :default-expanded-keys="expandTreeArr"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span :title="node.label">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
    </el-aside>
    <!-- 资源列表 -->
    <el-main>
      <div class="tabelHeader">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item>
            <el-tree-select
              @input="tipSelectChange"
              :styles="tipTreeStyle"
              :value="searchForm.chapterIds"
              :selectParams="selectParams"
              :treeParams="treeParams"
              @searchFun="tipSearch"
              ref="chapterTreeSelect"
            />
          </el-form-item>
          <el-form-item label="类型">
            <el-select
              v-model="searchForm.resType"
              placeholder="资源类型"
              size="small"
              style="width:100px;"
              @change="onSubmit"
            >
              <el-option
                v-for="type in types"
                :key="type.type"
                :label="type.name"
                :value="type.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width:200px;display: none;">
            <el-select
              v-model="searchForm.currentChapter"
              filterable
              clearable
              placeholder="请选择章节"
              size="small"
              @change="onSubmit"
            >
              <el-option
                v-for="item in chapterList"
                :key="item.catalogId"
                :label="item.catelogContent"
                :value="item.catalogId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="searchForm.resName"
              placeholder="请输入资源名称"
              size="small"
              style="width:150px;"
              @keyup.enter.native="onSubmit"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="onSubmit"
              size="small"
            ></el-button>
          </el-form-item>
        </el-form>
        <el-row class="operateBtn">
          <el-button
            size="small"
            @click="handleGet"
            style="border-color:#2BA1F4;color:#2BA1F4;"
            >获取</el-button
          >
        </el-row>
      </div>
      <div class="resPath">
        <el-breadcrumb
          separator-class="el-icon-arrow-right"
          v-if="isShowBreadcrumb"
        >
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumb"
            :key="`b-${item.rlrNo}`"
          >
            <span
              @click="toFolder(item, index)"
              :class="index === breadcrumb.length - 1 ? 'current' : 'path'"
              >{{ item.name }}</span
            >
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="resList">
        <el-table
          :data="resList"
          border
          :row-style="{ height: '100px' }"
          v-loading="loading.loadingRes"
          :show-header="false"
          @selection-change="changeSelect"
        >
          <el-table-column type="selection" align="center"> </el-table-column>
          <el-table-column align="center" min-width="850">
            <div slot-scope="scope" class="info">
              <div class="left">
                <img
                  v-if="scope.row.resType === 1"
                  src="@/assets/images/audio.png"
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
                    v-if="scope.row.resUrl"
                    :src="scope.row.resUrl"
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
                  alt=""
                  @click="handleViewRes(scope.row)"
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
                <div class="resourceId">资源ID: {{ scope.row.id }}</div>
                <!-- <div class="tipsText"><span>{{formatShowTip(scope.row.tipsText)}}</span></div> -->
                <div class="tipsText">
                  <span
                    v-for="(item, index) in formatShowTip(scope.row.tipsText)"
                    :key="index"
                    >{{ item }}</span
                  >
                </div>
              </div>
              <div class="right">
                <div class="updateTime">
                  {{ formatDate(scope.row.updated) }}
                </div>
                <div class="resSize">
                  {{ formatResSize(scope.row.resSize) }}
                </div>
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" width="150">
            <div slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="getTextBookRes(scope.row)"
                >获取</el-button
              >
            </div>
          </el-table-column>
        </el-table>
      </div>
      <div class="tabelFooter">
        <div v-if="resList.length" class="right-footer-first">
          从{{ (page.currentPage - 1) * page.pagesize + 1 }}到{{
            (page.currentPage - 1) * page.pagesize + resList.length
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
          @current-change="loadResList"
        ></el-pagination>
      </div>
    </el-main>
    <!-- 预览资源 -->
    <el-dialog
      top="6vh"
      :visible.sync="isViewResShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :lock-scroll="false"
      :fullscreen="isFull"
      :before-close="handleCloseViewDialog"
      width="800px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>资源预览</div>
          <button
            v-if="viewResObj.resType !== 3"
            @click="isFull = !isFull"
            class="fullBtn"
          >
            <i class="el-icon-full-screen"></i>
          </button>
        </div>
      </template>
      <viewRes
        :isFull="isFull"
        :data="viewResObj"
        :style="viewResObj.resType == 2 ? 'height:400px' : ''"
      ></viewRes>
    </el-dialog>
    <!-- 获取资源 -->
    <el-dialog
      :visible.sync="isShowGet"
      :modal-append-to-body="false"
      class="moveModal"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>获取资源</div>
        </div>
      </template>
      <ul>
        <li>
          获取到库:<span>{{ moveToLib }}</span>
        </li>
        <li v-if="isOffice == 1">
          <el-tree
            ref="meResLibTree"
            :data="meResListData"
            :props="meProps"
            :expand-on-click-node="false"
            highlight-current
            node-key="rlId"
            icon-class="el-icon-arrow-right"
            @current-change="getSelected"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </li>
        <li v-else>
          <el-tree
            ref="meResLibTree"
            :data="meResListData"
            :props="meProps2"
            :expand-on-click-node="false"
            highlight-current
            node-key="libId"
            icon-class="el-icon-arrow-right"
            @current-change="getSelected"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </li>
      </ul>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doGet">确定</el-button>
        <el-button size="small" @click="isShowGet = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 视频封面 -->
    <el-dialog
      :visible.sync="isShowSnapshot"
      :modal-append-to-body="false"
      width="900px"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>视频封面</div>
        </div>
      </template>
      <div class="move-main" style="height:400px;overflow-y: auto">
        <span>{{ snapshotForm.tsInfo }}</span>
        <el-row class="snapshot" :gutter="20">
          <el-col
            :span="6"
            v-for="(item, index) in snapshotShow"
            :label="item"
            :key="`img-${index}`"
          >
            <img :src="item" style="width:100%" />
            <el-radio :label="item" v-model="snapshotForm.selectedSnapshot"
              >&nbsp;</el-radio
            >
          </el-col>
        </el-row>
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="selectSnapshot"
          >确定</el-button
        >
        <el-button size="small" @click="isShowSnapshot = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<style lang="scss">
.myRes {
  width: 100%;
  .fullBtn {
    position: absolute;
    top: 20px;
    right: 60px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 16px;
  }
  .el-aside {
    background: #ffffff;
    border-radius: 4px;
    margin-right: 15px;
    width: 100%;
    .listHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 20px;
      height: 46px;
      line-height: 46px;
      background-color: #2ba1f4;
      color: #ffffff;
      font-size: 16px;
      padding-left: 20px;
      letter-spacing: 1px;
      // img {
      //   float: right;
      //   width: 16px;
      //   height: 16px;
      //   margin: 15px 20px 0 0;
      //   cursor: pointer;
      // }
    }
    .el-tree {
      font-size: 14px;
    }
    .el-tree
      > .el-tree-node
      > .el-tree-node__content
      > .custom-tree-node
      > span:first-child {
      display: inline-block;
      max-width: 110px;
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
      max-width: 90px;
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
      max-width: 70px;
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
    }
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      color: #2ba1f4;
      background-color: transparent;
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-main {
    background: #ffffff;
    border-radius: 4px;
    min-height: 638px;
    padding: 13px;
    .tabelHeader {
      overflow: hidden;
      .el-form {
        float: left;
        .el-form-item {
          margin-bottom: 13px;
          .el-form-item__content {
            line-height: 32px;
          }
        }
      }
      .operateBtn {
        float: right;
      }
    }
  }
  .resPath {
    margin-top: 15px;
    margin-bottom: 15px;
    .path {
      cursor: pointer;
      font-weight: bold;
    }
  }
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
  //上传弹框
  .uploadModal .el-dialog {
    width: 650px;
    .el-dialog__body {
      padding: 10px 20px 30px;
      .el-tabs__nav-wrap::after {
        height: 0;
      }
    }
    .btn {
      text-align: center;
    }
  }
  // 常规资源表单
  .common-res {
    .progress {
      margin-top: 5px;
      margin-bottom: 10px;
    }
  }
  // 移动弹框
  .moveModal {
    ul {
      list-style: none;
      padding: 0 80px;
      li:first-child {
        font-size: 16px;
        color: #333;
        span {
          color: #2ba1f4;
          margin-left: 5px;
        }
      }
      li:last-child {
        border: 1px solid #cccccc;
        border-radius: 5px;
        margin-top: 14px;
        height: 320px;
        padding: 0 26px;
        overflow: auto;
        .el-tree-node__content {
          height: 46px;
          border-bottom: 1px solid #eaeaea;
        }
        .el-tree--highlight-current
          .el-tree-node.is-current
          > .el-tree-node__content {
          background-color: transparent;
          color: #2ba1f4;
        }
        .el-tree-node .el-tree-node__children {
          font-size: 12px;
        }
      }
    }
  }
  // 视频封面
  .snapshot {
    .el-col {
      margin-bottom: 30px;
      text-align: center;
      box-shadow: 0px 15px 10px -15px #ccc;
      img {
        margin-bottom: 5px;
      }
      .el-radio {
        margin-bottom: 10px;
      }
    }
  }
  .tipTag {
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
      vertical-align: bottom;
    }
  }
}
.el-select-dropdown {
  max-width: 215px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<script>
import axios from "@/libs/api.request";
import editPopover from "../../publication/popver";
import fileModal from "@/components/fileModal";
import { format } from "@/utils/datetime";
import common from "@/utils/common";
import viewRes from "@/components/viewRes/viewTextBookRes";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";

export default {
  name: "officalTextBookRes",
  components: {
    editPopover,
    fileModal,
    viewRes,
    ElTreeSelect
  },
  data() {
    return {
      selectParams: {
        multiple: true,
        clearable: false,
        placeholder: "请选择章节"
      },
      treeParams: {
        clickParent: false,
        filterable: true,
        "default-expand-all": true,
        "expand-on-click-node": false,
        data: [],
        props: {
          children: "cataList",
          label: "catelogContent",
          value: "catalogId"
        }
      },
      isFull: false,
      textBookName: "",
      isShowSearchInput: false,
      isShowGet: false,
      highlightMoveLib: true,
      types: common.resTypes,
      resType: common.resType,
      uid: this.$store.state.user.userId,
      roleId: this.$store.state.user.currentRole.roleId, //用户的角色ID
      //章节列表
      chapterList: [],
      cpList: [],
      courseTip: [],
      tipTags: [],
      tagInputVisible: false,
      tagInputValue: "",
      //课程列表参数
      courseId: "",
      courseData: [],
      defaultTipProps: {
        label: "name",
        children: "children"
      },
      // 我的资源库
      meResListData: [],
      meProps: {
        label: "rlName",
        children: "sonResLib"
      },
      meProps2: {
        label: "libName",
        children: "children"
      },
      expandTipArr: [],
      // 是否显示批量按钮
      showButtons: false,
      // 新建资源库名称
      defaultProps: {
        label: "textbookName",
        children: ""
      },
      expandTreeArr: [],
      resList: [],
      currentResLib: {},
      searchForm: {
        resType: "",
        resName: "",
        currentChapter: "",
        chapterIds: [],
        labelsText: ""
      },
      tipTreeStyle: {
        width: "130px"
      },
      loading: {
        loadingRes: false,
        resList: false,
        loadingComResSure: false
      },
      isShowBreadcrumb: false,
      breadcrumb: [
        {
          name: "返回上一级",
          rlrNo: "0"
        }
      ],
      resListData: [],
      selectedRes: [],
      page: {
        total: 0,
        currentPage: 1,
        pagesize: 10
      },
      isViewResShow: false, //预览资源show
      viewResObj: {}, //预览资源传入的数据
      currentResRow: {},
      // 获取资源到库的库名
      moveToLib: "",
      // 视频封面
      isShowSnapshot: false,
      snapshotForm: {
        selectedSnapshot: "",
        resId: "",
        tsInfo: ""
      },
      snapshotShow: [],
      // 上传
      isUploadResShow: false,
      commonResForm: {
        showProgress: false,
        file: null,
        percentage: 0,
        resType: "",
        resName: "",
        resSize: ""
      },
      commonResRules: {
        resName: [
          { required: true, message: "请输入资源名称", trigger: "click" }
        ]
      },
      isShareShow: false, // 分享弹框
      shareModal2: false, // 是否展示分享弹框的第二部分
      currentShareBank: {},
      rsCode: "",
      taskList: [], // 常规资源任务列表,
      isOffice: this.$store.state.user.currentRole.roleType
    };
  },
  watch: {
    selectedRes() {
      if (this.selectedRes.length > 0) {
        this.showButtons = true;
      } else {
        this.showButtons = false;
      }
    }
  },
  mounted() {
    this.loadMyResLibrary();
    this.bus.$on(
      "refreshResList",
      function(id) {
        if (this.currentResLib.libId == id) {
          this.loadResList();
        }
      }.bind(this)
    );
  },
  beforeDestroy() {
    this.bus.$off("refreshResList");
  },
  computed: {
    pubId() {
      return this.$store.state.user.currentRole.pubId;
    }
  },
  methods: {
    // 根据教材获取章节
    getChapterByTextBook(id) {
      axios
        .request({
          method: "post",
          url: "book/catalog/catalogList",
          data: {
            textbookId: id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.cpList = ret.data;
            this.treeParams.data = ret.data;
            if (ret.data.length >= 0) {
              if (this.$refs.chapterTreeSelect) {
                this.$refs.chapterTreeSelect.treeDataUpdateFun(ret.data);
              }
            }
          }
        });
    },
    // 章节筛选发生变化
    tipSelectChange(ids, labels) {
      // this.form.tips = ids;
      this.searchForm.chapterIds = ids;
      if (labels) {
        this.searchForm.labelsText = labels.join(",");
      } else {
        this.searchForm.labelsText = "";
      }
      this.page.currentPage = 1;
      this.loadResList();
    },
    // 章节筛选
    tipSearch(value) {
      if (this.$refs.chapterTreeSelect) {
        this.$refs.chapterTreeSelect.filterFun(value);
      }
    },
    searchBook() {
      // 搜索教材
      this.loadMyResLibrary();
    },
    //确定获取事件
    doGet() {
      let id = this.$refs.meResLibTree.getCurrentKey();
      if (id) {
        if (this.isOffice == 1) {
          //获取到机构资源库
          let rlrIds = "";
          if (this.currentResRow.rlrId) {
            rlrIds = this.currentResRow.rlrId;
          } else {
            this.selectedRes.forEach(element => {
              rlrIds += `${element.rlrId},`;
            });
          }
          axios
            .request({
              method: "post",
              url: "/resource/resLibResource/get",
              data: {
                rlrIds: rlrIds,
                rlId: id
              }
            })
            .then(res => {
              let ret = res.data;
              this.isShowGet = false;
              this.bus.$emit("refreshResList", id);
              this.$message({
                type: "success",
                message: ret.msg
              });
            });
        } else {
          //获取到我的资源库
          let resIds = "";
          if (this.currentResRow.id) {
            resIds = this.currentResRow.id;
          } else {
            this.selectedRes.forEach(element => {
              resIds += `${element.id},`;
            });
          }
          axios
            .request({
              method: "post",
              url: "/resource/v4/resource/bookToResourceLib",
              data: {
                resIds: resIds,
                aimLibId: id
              }
            })
            .then(res => {
              let ret = res.data;
              this.isShowGet = false;
              this.bus.$emit("refreshResList", id);
              this.$message({
                type: "success",
                message: ret.msg
              });
            });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请先勾选目标库"
        });
      }
    },
    // 点击批量获取获取按钮
    handleGet() {
      if (this.selectedRes.length > 0) {
        this.currentResRow = {};
        this.moveToLib = "";
        if (this.$store.state.user.currentRole.roleType === 1) {
          this.loadOfficialResourceLibrary();
        } else {
          this.loadMyResourceLibrary();
        }
        this.isShowGet = true;
      } else {
        this.$message({
          type: "warning",
          message: "请先勾选要获取的资源"
        });
      }
    },
    getTextBookRes(row) {
      this.isShowGet = true;
      this.currentResRow = row;
      this.moveToLib = "";
      if (this.$store.state.user.currentRole.roleType === 1) {
        this.loadOfficialResourceLibrary();
      } else {
        this.loadMyResourceLibrary();
      }
    },
    //获取资源到库的节点变化事件
    getSelected(row) {
      if (this.isOffice == 1) {
        this.moveToLib = row.rlName;
      } else {
        this.moveToLib = row.libName;
      }
    },
    // 获取个人资源库列表
    loadMyResourceLibrary() {
      axios
        .request({
          method: "post",
          url: "/resource/v4/resource/selPersonalLibList"
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            this.meResListData = res.data;
          }
        });
    },
    // 获取机构资源库列表
    loadOfficialResourceLibrary() {
      axios
        .request({
          method: "post",
          url: "/v1/orgResourceLibrary/resLibList"
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            this.meResListData = res.data;
          }
        });
    },
    // 加载资源库列表
    loadMyResLibrary() {
      this.loading.resList = true;
      axios
        .request({
          method: "post",
          url: "/book/v4/textbook/verifiedSubjectList",
          data: {
            keyWord: this.textBookName.trim(),
            pubId: this.roleId === 25 && this.pubId ? this.pubId : "",
            isEditor: this.roleId === 26 ? 1 : ""
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.loading.resList = false;
            this.resListData = res.data.data;
            var first = this.resListData[0];
            this.currentResLib = first;
            this.$nextTick(() => {
              if (this.$refs.vuetree) {
                if (this.currentResLib) {
                  this.$refs.vuetree.setCurrentKey(
                    this.currentResLib.textbookId
                  );
                  this.getChapterByTextBook(this.currentResLib.textbookId);
                }
              }
            });
            if (this.resListData.length > 0) {
              this.loadResList();
            }
          }
        });
    },
    // 点击教材item
    handleNodeClick(bank) {
      this.currentResLib = bank;
      this.getChapterByTextBook(bank.textbookId);
      this.searchForm.chapterIds = [];
      this.searchForm.resName = "";
      this.page.currentPage = 1;
      this.$nextTick(() => {
        document.querySelector(".el-tabs__content").scrollTop = 0;
      });
      this.loadResList();
    },
    // 获取教材资源列表
    loadResList() {
      this.loading.loadingRes = true;
      axios
        .request({
          method: "post",
          url: `/resource/v4/tbMatchPic/pageResourceNormal`,
          data: {
            textbookId: this.currentResLib.textbookId,
            type: this.searchForm.resType,
            keyword: this.searchForm.resName,
            page: this.page.currentPage,
            pagesize: this.page.pagesize,
            chapterId: this.searchForm.chapterIds.join(",")
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loading.loadingRes = false;
            if (ret.data) {
              this.page.total = ret.data.total;
              this.resList = ret.data.data;
            } else {
              this.page.total = 0;
              this.resList = [];
            }
          }
        });
    },
    // 查询
    onSubmit() {
      this.page.currentPage = 1;
      this.loadResList();
    },
    //选择资源每页显示数据条数切换事件
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.loadResList();
    },
    // 进入文件夹
    toFolder(row, index) {
      this.searchForm.rlrParentNo = row.rlrNo;
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
      this.searchForm.resName = "";
      this.searchForm.resType = "";
      this.page.currentPage = 1;
      this.loadResList();
    },
    // 资源列表选择事件
    changeSelect(selection) {
      this.selectedRes = selection;
    },
    //查看资源
    handleViewRes(row) {
      let { resourceId, resType } = row;
      if (resType === 9) {
        // 查看pdf资源
        axios
          .request({
            method: "post",
            responseType: "blob",
            url: `/resource/v4/commonRL/detailById`,
            data: {
              rlrResourceId: resourceId
            }
          })
          .then(res => {
            console.log(res);
            let blob = new Blob([res.data]);
            let fileURL = window.URL.createObjectURL(blob); //创建下载的链接
            window.open("/static/pdf/web/viewer.html?file=" + fileURL);
          });
        return;
      }
      if (resType === 3) {
        // AR
        if (!row.resUrlWeb) {
          this.$message({
            type: "warning",
            message: "资源地址不存在，请检查"
          });
          return;
        }
      }
      this.viewResObj = row;
      this.isViewResShow = true;
    },
    //关闭预览资源弹框清空数据
    handleCloseViewDialog() {
      this.viewResObj = {};
      this.isViewResShow = false;
      this.isFull = false;
    },
    // 视频封面
    showSnapshot(row) {
      this.snapshotShow = [];
      this.isShowSnapshot = true;
      this.snapshotForm.resId = row.rlrResourceId;
      axios
        .request({
          method: "post",
          url: "/v1/upload/snapshotShow",
          data: {
            fileId: row.cloudId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.snapshotShow = ret.data;
            this.snapshotForm.tsInfo = "";
          } else {
            this.snapshotForm.tsInfo = "暂无封面信息，正在转码中，请稍后...";
          }
        });
    },
    selectSnapshot() {
      axios
        .request({
          method: "post",
          url: "/resource/v1/resource/updResPic",
          data: {
            resourceid: this.snapshotForm.resId,
            designPic: this.snapshotForm.selectedSnapshot
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.isShowSnapshot = false;
            this.loadResList();
          }
        });
    },
    // 时间
    formatTableDate(row, column, cellValue, index) {
      return format(cellValue);
    },
    formatDate(time) {
      return format(time);
    },
    formatResSize(size) {
      if (size) {
        if (size < 1024 * 1024) {
          return (size / 1024).toFixed(1) + "KB";
        } else {
          return (size / (1024 * 1024)).toFixed(1) + "MB";
        }
      }
      return "0KB";
    },
    formatResTypeName(resType) {
      if (resType) {
        return common.resTypeFormat(resType);
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
    /**
     * 根据文件类型 转换成 资源类型
     */
    toResType(fileType) {
      // file.name.endsWith(".flv") 判断字符串以什么结尾 true
      let type = 0;
      if (fileType.indexOf("image") === 0) {
        type = 10;
      } else if (fileType.indexOf("video") === 0) {
        type = 2;
      } else if (fileType.indexOf("audio") === 0) {
        type = 1;
      } else if (fileType.indexOf("application/pdf") === 0) {
        type = 9;
      } else if (
        fileType.indexOf("application/msword") === 0 ||
        fileType.indexOf(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) === 0
      ) {
        type = 7;
      } else if (
        fileType.indexOf("application/mssheet") === 0 ||
        fileType.indexOf(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) === 0
      ) {
        type = 4;
      } else if (fileType.indexOf("text/html") === 0) {
        type = 5;
      } else if (
        fileType.indexOf("application/vnd.ms-powerpoint") === 0 ||
        fileType.indexOf(
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ) === 0
      ) {
        type = 6;
      }
      return type;
    }
  }
};
</script>
