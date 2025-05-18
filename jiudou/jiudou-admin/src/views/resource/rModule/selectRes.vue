<template>
  <el-container class="selectRes">
    <!-- 资源库列表 -->
    <el-aside width="182px">
      <div class="listHeader">资源商场</div>
      <div style="height:638px;overflow-y:auto">
        <el-menu
          :default-openeds="defaultOpen"
          :default-active="String(defaultActive)"
        >
          <el-submenu
            v-for="subject in resListData"
            :key="subject.subjectId"
            :index="String(subject.subjectId)"
          >
            <template slot="title">
              <div style="padding-left:15px;" :title="subject.rlName">
                {{ subject.rlName }}
              </div>
            </template>
            <el-menu-item
              v-for="rl in subject.children"
              :key="rl.rlId"
              :index="String(rl.rlId)"
              :title="rl.rlName"
              @click="selectRl(rl)"
              >{{ rl.rlName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </div>
    </el-aside>
    <!-- 资源列表 -->
    <el-main>
      <div class="tableContent">
        <div class="tabelHeader">
          <el-form
            :inline="true"
            :model="searchForm"
            class="demo-form-inline"
            size="small"
          >
            <el-form-item label="类型">
              <el-select
                v-model="searchForm.resType"
                placeholder="资源类型"
                size="small"
                style="width:100px;"
                @change="comResTypeChange"
              >
                <el-option
                  v-for="type in types"
                  :key="type.type"
                  :label="type.name"
                  :value="type.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-tree-select
                :styles="tipTreeStyle"
                v-model="searchForm.tips"
                :selectParams="selectParams"
                :disabled="tipDisabled"
                :treeParams="treeParams"
                @searchFun="tipSearch"
                ref="treeSelect"
                @input="tipChange"
              />
            </el-form-item>
            <el-form-item>
              <div class="allSearch">
                <el-input
                  v-model="allSearchResName"
                  placeholder="请输入资源名称"
                  size="small"
                  style="width:150px;"
                  @keyup.enter.native="onSubmit"
                ></el-input>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="onSubmit"
                  size="small"
                ></el-button>
              </div>
            </el-form-item>
          </el-form>
          <el-row class="operateBtn">
            <el-button
              size="small"
              style="border-color:#2BA1F4;color:#2BA1F4;"
              @click="handleGet()"
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
            v-loading="loading"
            :show-header="false"
            @selection-change="changeSelect"
          >
            <el-table-column type="selection" align="center"> </el-table-column>
            <el-table-column align="center" min-width="700">
              <div slot-scope="scope" class="info">
                <div class="left">
                  <img
                    v-if="scope.row.resType === 1"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/audio.png"
                    alt=""
                  />
                  <div
                    v-if="scope.row.resType === 2"
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
                    v-if="scope.row.resType === 3"
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
                    v-if="scope.row.resType === 4"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/excel.png"
                    alt=""
                  />
                  <img
                    v-if="scope.row.resType === 5"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/h5.png"
                    alt=""
                  />
                  <img
                    v-if="scope.row.resType === 6"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/ppt.png"
                    alt=""
                  />
                  <img
                    v-if="scope.row.resType === 7"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/word.png"
                    alt=""
                  />
                  <img
                    v-if="scope.row.resType === 9"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/pdf.png"
                    alt=""
                  />
                  <div
                    v-if="scope.row.resType === 10"
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
                    v-if="scope.row.resType === 11"
                    src="@/assets/images/fileFolder.png"
                    alt=""
                    @click="toFolder(scope.row)"
                  />
                  <img
                    v-if="scope.row.resType === 12"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/yypc.png"
                    alt=""
                  />
                  <img
                    v-if="scope.row.resType === 0"
                    src="@/assets/images/other.png"
                    alt=""
                    @click="handleViewRes(scope.row)"
                  />
                  <img
                    v-if="scope.row.resType === 15"
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
                  <div class="resSize">{{ formatResSize(scope.row.size) }}</div>
                  <div class="updateTime">
                    {{ formatDate(scope.row.updated) }}
                  </div>
                </div>
              </div>
            </el-table-column>
            <el-table-column align="center" width="120">
              <div slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  style="margin-left:0"
                  @click="handleGetOne(scope.row)"
                  >获取</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  style="margin-left:0"
                  @click="handleWrong(scope.row)"
                  >纠错</el-button
                >
              </div>
            </el-table-column>
          </el-table>
        </div>
        <div class="tabelFooter">
          <div v-if="resList.length" class="right-footer-first">
            从{{ (page.page - 1) * page.pagesize + 1 }}到{{
              (page.page - 1) * page.pagesize + resList.length
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
            :current-page.sync="page.page"
            background
            @current-change="loadResList"
          ></el-pagination>
        </div>
      </div>
    </el-main>
    <!-- 纠错与举报-->
    <jdialog title="纠错与举报" :visible.sync="isShowWrong" @sure="reportWrong">
      <div slot="body">
        <div style="margin:0 5%">
          <div style="margin-bottom:10px;color:#333;font-size:15px">
            你觉得这个资源有什么问题？
          </div>
          <el-radio-group
            v-model="reportType"
            style="margin-top:10px;margin-bottom:20px;color:#333;font-size:13px;"
          >
            <el-radio style="margin-bottom:10px" label="0">内容有误</el-radio>
            <el-radio style="margin-bottom:10px" label="1">违法违禁</el-radio>
            <el-radio style="margin-bottom:10px" label="2"
              >抄袭我的资源</el-radio
            >
            <el-radio style="margin-bottom:10px" label="3">有其他问题</el-radio>
          </el-radio-group>
          <div style="color:#2BA1F4;font-size:13px;">
            为了帮助审核人员更快处理，请详细描述问题*
          </div>
          <textarea
            placeholder=""
            v-model="reportDes"
            style="margin-top:10px;width:100%;border-radius:5px;border-color:#ccc;height:100px;padding:5px 15px;"
          ></textarea>
        </div>
      </div>
    </jdialog>
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
        <li
          style="display:flex;justify-content:center;align-items:center"
          v-else-if="meResListData.length === 0"
        >
          <span>您还没有资源库，请先去创建~</span>
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
        :style="viewResObj.resType == 2 ? 'height:350px' : ''"
      ></viewRes>
    </el-dialog>
  </el-container>
</template>
<script>
import axios from "@/libs/api.request";
import jdialog from "@/components/jdialog";
import { mapGetters } from "vuex";
import fileModal from "@/components/fileModal";
import { format } from "@/utils/datetime";
import common from "@/utils/common";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
import viewRes from "@/components/viewRes";
export default {
  name: "myRes",
  components: {
    fileModal,
    jdialog,
    ElTreeSelect,
    viewRes
  },
  data() {
    return {
      isFull: false,
      isOffice: this.$store.state.user.currentRole.roleType,
      types: common.resTypes,
      // 资源列表loading
      selectedRes: [],
      loading: false,
      resList: [],
      page: {
        total: 0,
        page: 1,
        pagesize: 10
      },
      // 资源库 tree
      defaultOpen: [],
      defaultActive: 0,
      currentResLib: {},
      resListData: [],
      defaultProps: {
        label: "rlName",
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
      allSearchResName: "",
      // 搜索表单
      searchForm: {
        tips: "",
        resType: ""
      },
      tipDisabled: false,
      selectParams: {
        multiple: true,
        clearable: true,
        placeholder: "请选择知识点"
      },
      treeParams: {
        clickParent: false,
        filterable: true,
        "default-expand-all": true,
        "expand-on-click-node": false,
        data: [],
        props: {
          children: "children",
          label: "name",
          value: "tipId"
        }
      },
      tipTreeStyle: {
        width: "200px"
      },
      // 资源路径
      isShowBreadcrumb: false,
      breadcrumb: [
        {
          name: "返回上一级",
          rlrNo: "0"
        }
      ],
      isViewResShow: false, //预览资源show
      viewResObj: {}, //预览资源传入的数据
      currentResRow: {},
      // 纠错与举报
      isShowWrong: false,
      reportDes: "",
      reportType: "",
      // 获取资源到库的库名
      moveToLib: "",
      // 获取
      isShowGet: false,
      isShowOneGet: false
      //详情
      // isShowDetail: false
    };
  },
  computed: {
    ...mapGetters(["hasButton"])
  },
  mounted() {
    this.loadCommonResLibrary();
  },
  methods: {
    //资源大小
    formatResSize(size) {
      if (size) {
        if (size < 1024 * 1024) {
          return (size / 1024).toFixed(1) + "KB";
        } else {
          return (size / (1024 * 1024)).toFixed(1) + "MB";
        }
      }
      return "";
    },
    // 时间
    formatTableDate(row, column, cellValue, index) {
      return format(cellValue);
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
    formatDate(time) {
      return format(time);
    },
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
    loadCommonResLibrary() {
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
            let resListData = [];
            let resMap = new Map();
            let subjectMap = new Map();
            if (ret.data.length > 0) {
              ret.data.forEach(element => {
                if (resMap.has(element.rlSubjectId)) {
                  resMap.get(element.rlSubjectId).push({
                    rlName: element.rlName,
                    rlId: element.rlId,
                    rlRow: element
                  });
                } else {
                  resMap.set(element.rlSubjectId, [
                    {
                      rlName: element.rlName,
                      rlId: element.rlId,
                      rlRow: element
                    }
                  ]);
                }
                if (!subjectMap.has(element.rlSubjectId)) {
                  subjectMap.set(element.rlSubjectId, {
                    rlName: element.rlSubjectName,
                    subjectId: element.rlSubjectId,
                    children: []
                  });
                }
              });
              subjectMap.forEach((value, key, map) => {
                value.children = resMap.get(key);
                resListData.push(value);
              });
              this.resListData = resListData;
              this.resListData.sort((a, b) => a.subjectId - b.subjectId);
              this.selectRl({
                rlId: ret.data[0].rlId,
                rlName: ret.data[0].rlName,
                rlRow: ret.data[0]
              });
            }
          }
        });
    },
    // 点击资源库item
    selectRl(bank) {
      this.$nextTick(() => {
        document.querySelector(".el-tabs__content").scrollTop = 0;
      });
      this.tipDisabled = false;
      if (
        this.allSearchResName.length ||
        bank.rlId !== this.currentResLib.rlId
      ) {
        this.allSearchResName = "";
        this.currentResLib = bank;
        this.page.currentPage = 1;
        this.searchForm.resType = "2";
        this.searchForm.resName = "";
        this.searchForm.tips = "";
        this.loadResList();
        this.loadTips();
      }
      this.defaultActive = this.currentResLib.rlId;
    },
    //查看资源
    handleViewRes(row) {
      let { rlrResourceId, resType } = row;
      if (resType === 9) {
        // 查看pdf资源
        axios
          .request({
            method: "post",
            responseType: "blob",
            url: `/resource/v4/commonRL/detailById`,
            data: {
              rlrResourceId
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
    // 获取资源列表
    loadResList() {
      let data = { page: this.page.page, pagesize: this.page.pagesize };
      data.resType = this.searchForm.resType;
      if (this.allSearchResName.length) {
        data.resName = this.allSearchResName;
      } else {
        data.rlrRlId = this.currentResLib.rlId;
        if (this.searchForm.tips.length) {
          data.tips = this.searchForm.tips.join(",");
        }
      }
      if (this.searchForm.rlrParentNo) {
        data.rlrParentNo = this.searchForm.rlrParentNo;
      } else {
        data.rlrParentNo = "0";
      }
      this.loading = true;
      axios
        .request({
          method: "post",
          url: "/resource/v4/commonRL/itemsWithCount",
          data: data
        })
        .then(data => {
          this.loading = false;
          let res = data.data;
          if (res.code == 200) {
            this.page.total = res.data.total;
            this.resList = res.data.data;
          }
        });
    },
    //获取知识点
    loadTips() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          data: { courseId: this.currentResLib.rlRow.rlCourseId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.treeParams.data = res.data;
              if (res.data.length >= 0) {
                if (this.$refs.treeSelect) {
                  this.$refs.treeSelect.treeDataUpdateFun(res.data);
                }
              }
            }
          }.bind(this)
        );
    },
    // 知识点搜索
    tipSearch(value) {
      if (this.$refs.treeSelect) {
        this.$refs.treeSelect.filterFun(value);
      }
    },
    //知识点查询资源
    tipChange(tips) {
      this.searchForm.tips = tips;
      this.loadResList();
    },
    //资源类型查询资源
    comResTypeChange() {
      this.page.currentPage = 1;
      this.loadResList();
    },
    // 查询
    onSubmit() {
      this.tipDisabled = true;
      this.defaultActive = 0;
      this.page.currentPage = 1;
      // this.searchForm.resType = ''
      this.defaultOpen = [];
      this.loading = true;
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
      this.searchForm.resType = "";
      this.page.page = 1;
      this.loadResList();
    },
    // 资源列表选择事件
    changeSelect(selection) {
      this.selectedRes = selection;
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
    //列表中获取按钮
    async handleGetOne(row) {
      this.currentResRow = row;
      this.moveToLib = "";
      if (this.$store.state.user.currentRole.roleType === 1) {
        this.loadOfficialResourceLibrary();
      } else {
        this.loadMyResourceLibrary();
      }
      this.isShowGet = true;
    },
    //获取资源到库的节点变化事件
    getSelected(row) {
      if (this.isOffice == 1) {
        this.moveToLib = row.rlName;
      } else {
        this.moveToLib = row.libName;
      }
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
          if (this.currentResRow.rlrResourceId) {
            resIds = this.currentResRow.rlrResourceId;
          } else {
            this.selectedRes.forEach(element => {
              resIds += `${element.rlrResourceId},`;
            });
          }
          axios
            .request({
              method: "post",
              url: "/resource/v4/resource/obtainResesToAimLib",
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
    // 点击 纠错 按钮
    handleWrong(row) {
      this.isShowWrong = true;
      this.reportType = "";
      this.reportDes = "";
      this.currentResRow.resourceId = row.rlrResourceId;
    },
    // 发送 纠错 请求
    reportWrong() {
      if (this.reportType) {
        axios
          .request({
            method: "post",
            url: "/v1/resource/feedback",
            data: {
              resourceId: this.currentResRow.resourceId,
              subType: this.reportType,
              content: `${this.reportDes}(${this.currentResRow.resourceId})`
            }
          })
          .then(data => {
            let res = data.data;
            this.isShowWrong = false;
            this.$message({
              type: "success",
              message: res.msg
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择纠错类型"
        });
      }
    }
  }
};
</script>
<style lang="scss">
.selectRes {
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
    max-height: 700px;
    .listHeader {
      height: 46px;
      line-height: 46px;
      background-color: #2ba1f4;
      color: #ffffff;
      font-size: 16px;
      padding-left: 20px;
      letter-spacing: 1px;
    }
    .el-submenu__title {
      height: 46px !important;
      line-height: 46px !important;
      padding-left: 40px;
      border-bottom: 1px solid #eaeaea !important;
      border-bottom-color: #eaeaea !important;
      .el-submenu__icon-arrow {
        left: 15px;
        right: 155px;
      }
      div {
        padding-right: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    /*菜单关闭*/
    .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
      -webkit-transform: rotateZ(-90deg);
      -ms-transform: rotate(-90deg);
      transform: rotateZ(-90deg);
      color: #c0c4cc;
    }
    /*菜单展开*/
    .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
      -webkit-transform: rotateZ(0deg);
      -ms-transform: rotate(0deg);
      transform: rotateZ(0deg);
    }
    .el-menu-item {
      height: 46px !important;
      line-height: 46px !important;
      border-bottom: 1px solid #eaeaea;
    }
    .el-submenu .el-menu-item {
      min-width: 160px;
    }
    .el-menu-item {
      padding: 0 20px 0 35px !important;
      overflow: hidden;
      text-overflow: ellipsis;
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
    min-height: 638px;
    padding: 0;
    .allSearch {
      margin-bottom: 13px;
    }
    .tableContent {
      border-radius: 4px;
      padding: 13px 13px;
      background: #ffffff;
      .tabelHeader {
        overflow: hidden;
        .el-form {
          float: left;
          .el-form-item {
            margin-bottom: 0;
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
  }
  // 获取弹框
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
  .currentChildrenResLib {
    .el-row {
      background-color: #edf1f7;
      margin-bottom: 5px;
      border: 1px solid #becbd9;
      height: 38px;
      .el-col {
        font-size: 14px;
        color: #333;
        padding: 0 20px;
        line-height: 38px;
        cursor: pointer;
        span {
          margin-left: 10px;
          font-size: 12px;
          color: #999999;
          float: right;
          margin-right: 10px;
        }
        i {
          float: right;
          margin-top: 12px;
          color: #aaaaaa;
        }
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
  }
}
// .el-tree-select-popper{
//   left: 550px !important;
// }
</style>
