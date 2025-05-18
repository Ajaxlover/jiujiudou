<template>
  <el-container class="searchRes">
    <el-header height="50px">
      <span class="book" @click="toBook">教材管理</span>
      <i class="el-icon-arrow-right"></i> <span>编辑教材</span>
    </el-header>
    <el-main>
      <div>
        <el-steps :active="stepActive" finish-status="success" align-center>
          <el-step
            title="1、选择资源"
            @click.native="resStep1"
            style="cursor:pointer"
          ></el-step>
          <el-step
            title="2、编辑绑定信息"
            @click.native="resStep2"
            style="cursor:pointer"
          ></el-step>
        </el-steps>
        <div class="selectRes" v-if="stepActive == 0">
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
                <el-option label="教材" value="2"></el-option>
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
                v-if="resForm.libType == 1"
                key="1"
                v-model="resForm.orgLib"
                :selectParams="orgResParams"
                size="small"
                :treeParams="orgResTreeParams"
                @searchFun="orgResSearch"
                ref="orgResSelect"
                @input="resSearch"
              />
            </el-form-item>
            <el-form-item v-if="resForm.libType == 2">
              <!-- <el-select
                v-model="resForm.textBookId"
                size="small"
                style="width:120px;"
                @change="resSearchByBook"
              >
                <el-option
                  v-for="item in textBookList"
                  :key="item.textbookId"
                  :label="item.textbookName"
                  :value="item.textbookId"
                ></el-option>
              </el-select> -->
              <el-tree-select
                key="2"
                v-if="resForm.libType == 2"
                v-model="resForm.textBookId"
                :selectParams="bookResParams"
                size="small"
                :treeParams="textBookResTreeParams"
                @searchFun="textBookResSearch"
                ref="textBookResSelect"
                @input="resSearch"
              />
            </el-form-item>
            <el-form-item v-if="resForm.comLib" label="知识点">
              <el-tree-select
                :styles="tipTreeStyle"
                v-model="resForm.tips"
                :selectParams="selectParams"
                :disabled="tipDisabled"
                :treeParams="treeParams"
                @searchFun="tipSearch"
                ref="treeSelect"
                @input="tipChange"
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
                style="width:140px;"
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
                        v-for="(item, index) in formatShowTip(
                          scope.row.tipsText
                        )"
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
                (selResPage.page - 1) * selResPage.pagesize +
                  resListData.length
              }}记录，共{{ selResPage.total }}条
            </div>
            <div v-else class="right-footer-first" ref="footerCount">
              从0到0条记录，共0条
            </div>
            <el-pagination
              layout="sizes, prev, pager, next, jumper"
              :page-sizes="[10, 30, 50]"
              :total="selResPage.total"
              @size-change="handleSizeChange"
              :page-size="selResPage.pagesize"
              :current-page.sync="selResPage.page"
              background
              @current-change="loadResList"
            ></el-pagination>
          </div>
        </div>
        <div class="editBindInfo" v-if="stepActive == 1">
          <el-table
            :data="stepTableData"
            stripe
            border
            style="margin-top:20px"
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
          >
            <el-table-column
              label="资源"
              align="center"
              prop="resName"
            ></el-table-column>
            <el-table-column label="资源展示名" align="center">
              <template slot-scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.resShowName"
                  maxlength="50"
                  show-word-limit
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="资源码" align="center">
              <template slot-scope="scope">
                <!-- <el-select v-model="scope.row.qrCodeId" style="display:block;" size="small" v-if="scope.row.resType != 3" clearable @change="handleQrcodeChange">
                  <el-option v-for="item in unUseQrcodeList" :key="item.id" :label="item.qrcodeNickname" :value="item.id"></el-option>
                </el-select>
                <el-input size="small" v-model="scope.row.matchPicId" v-else placeholder="请选择" @focus='handleShowMatchPic(scope.row, scope.$index)'></el-input> -->
                <el-button
                  v-if="scope.row.resType != 3"
                  :type="scope.row.qrCodeId == null ? 'danger' : 'success'"
                  size="small"
                  @click="resQrcode(scope.row)"
                  >{{
                    scope.row.qrCodeId == null
                      ? "选择资源码"
                      : scope.row.qrCodeIndex
                  }}</el-button
                >
                <el-input
                  size="small"
                  v-model="scope.row.matchPicId"
                  v-else
                  placeholder="请选择"
                  @focus="handleShowMatchPic(scope.row, scope.$index)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="图序" align="center" width="150px">
              <template slot-scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.resPicNum"
                  maxlength="8"
                  show-word-limit
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="页码" align="center" width="150px">
              <template slot-scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.resPageNum"
                  maxlength="8"
                  show-word-limit
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="bottomBtnBox">
        <el-button size="small" @click="doReturn" v-if="stepActive == 0"
          >取消</el-button
        >
        <el-button size="small" @click="stepPrev" v-if="stepActive == 1"
          >上一步</el-button
        >
        <el-button size="small" @click="stepNext" v-if="stepActive == 0"
          >下一步</el-button
        >
        <el-button size="small" @click="doBindBookRes" v-if="stepActive == 1"
          >确定</el-button
        >
      </div>
    </el-main>
    <!-- 比对图片 -->
    <el-dialog
      :visible.sync="isShowMatchPic"
      :modal-append-to-body="false"
      class="matchPic"
      width="700px"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>选择AR资源码</div>
        </div>
      </template>
      <el-row>
        <el-col :span="12" v-for="item in matchPicList" :key="item.matchPicId">
          <img :src="item.matchPicUrl" />
          <el-radio :label="item.matchPicId" v-model="matchPicRadio"
            >&nbsp;</el-radio
          >
          <div>{{ item.matchPicName }}</div>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doSelectMatchPic"
          >确定</el-button
        >
        <el-button size="small" @click="isShowMatchPic = false">取消</el-button>
      </span>
    </el-dialog>
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
    <!-- 资源码 -->
    <el-dialog
      :visible.sync="isResQrcodeShow"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="850px"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>资源码管理</div>
        </div>
      </template>
      <!-- <el-form :inline="true" :model="ruleResQrcodeForm" :rules="resQrcodeRules" ref="ruleResQrcodeForm" size="small" class="demo-ruleForm" @submit.native.prevent>
          <el-form-item label="数量" prop="num" label-width="60px">
            <el-input v-model.number="ruleResQrcodeForm.num"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="creatQrcode">生成</el-button>
          </el-form-item>
          <el-form-item style="float:right;margin-bottom:5px;">
             <el-button type="success" @click="handleExportQrcode" size="small" v-if="qrcodeData.length > 0">导出</el-button>
          </el-form-item>
        </el-form> -->
      <el-table
        :data="qrcodeData"
        v-loading="loading.qrcodeLoading"
        border
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column label="编号" align="center" width="200">
          <div slot-scope="scope" class="info">
            {{ bookNum + "-" + scope.row.qrcodeNickname }}
          </div>
        </el-table-column>
        <el-table-column
          prop="matchPicUrl"
          label="资源码"
          align="center"
          width="100"
        >
          <div slot-scope="scope">
            <el-popover placement="top-start" title="资源码" trigger="click">
              <div style="text-align:center;">
                {{ bookNum }}-{{ scope.row.qrcodeNickname }}
              </div>
              <qrcode
                :value="`${baseUrlV3}/resource/resource/r/${scope.row.qrcode}`"
                :options="{ width: 200 }"
              ></qrcode>
              <i
                slot="reference"
                class="el-icon-picture"
                style="font-size:30px; cursor: pointer;"
              ></i>
            </el-popover>
          </div>
        </el-table-column>
        <el-table-column
          label="所属资源"
          prop="resName"
          align="center"
          show-overflow-tooltip=""
        ></el-table-column>
        <el-table-column label="二维码类型" prop="resName" align="center">
          <template slot-scope="scope">
            {{
              scope.row.qrcode.substr(0, 9) === "NewQrCode"
                ? "可绑多资源"
                : "单资源"
            }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="
                scope.row.qrcode.substr(0, 9) === 'NewQrCode' ||
                  !scope.row.resName
              "
              @click="bandleQrcode(scope.row, scope.$index)"
              >绑定</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="qrcodeData.length" class="right-footer-first">
          从{{ (qrcodePage.page - 1) * qrcodePage.pagesize + 1 }}到{{
            (qrcodePage.page - 1) * qrcodePage.pagesize + qrcodeData.length
          }}记录，共{{ qrcodePage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="qrcodePage.total"
          :page-size="qrcodePage.pagesize"
          :current-page.sync="qrcodePage.page"
          background
          @current-change="loadQrCode"
        ></el-pagination>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
import { format } from "@/utils/datetime";
import viewRes from "@/components/viewRes/viewTextBookRes.vue";
export default {
  components: {
    ElTreeSelect,
    viewRes
  },
  computed: {
    baseUrlV3() {
      return process.env.BASE_URL_V3;
    },
    pubId() {
      return this.$store.state.user.currentRole.pubId;
    }
  },
  data() {
    return {
      roleId: this.$store.state.user.currentRole.roleId, //用户的角色ID
      textBookList: [], // 教材列表
      courseIdMap: new Map(),
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
        width: "160px"
      },
      textbookId: this.$route.query.textbookId, //教材ID
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
        resLoading: false,
        qrcodeLoading: false
      },
      unUseQrcodeListAll: [], //未使用的二维码列表all
      unUseQrcodeList: [], //未使用的二维码列表
      matchPicList: [], //比对图片列表
      matchPicRadio: "", // 选择的对比图片
      matchPicIndex: "", // 当前AR资源属于列表的index 方便查找
      resForm: {
        textBookId: "", // 教材id
        libType: "0",
        orgLib: "",
        comLib: "",
        resType: "",
        resName: "",
        rlrParentNo: "0",
        tips: "",
        courseId: ""
      },
      resListData: [],
      selResPage: {
        total: 0,
        page: 1,
        pagesize: 10
      },
      textBookResTreeParams: {
        clickParent: true,
        filterable: true,
        "default-expand-all": true,
        "expand-on-click-node": false,
        data: [],
        props: {
          children: "children",
          label: "textbookName",
          value: "textbookId"
        }
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
      bookResParams: {
        multiple: false,
        clearable: false,
        placeholder: "全部"
      },
      orgResParams: {
        multiple: false,
        clearable: true,
        placeholder: "全部"
      },
      isShowMatchPic: false,
      isResQrcodeShow: false,
      qrcodeData: [],
      qrcodePage: {
        total: 0,
        page: 1,
        pagesize: 10
      },
      qrcodeIndex: {}
    };
  },
  methods: {
    //获取知识点
    loadTips() {
      let courseId = this.courseIdMap.get(this.resForm.comLib);
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          data: { courseId }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            this.treeParams.data = res.data;
            if (res.data.length >= 0) {
              if (this.$refs.treeSelect) {
                this.$refs.treeSelect.treeDataUpdateFun(res.data);
              }
            }
          }
        });
    },
    // 知识点搜索
    tipSearch(value) {
      if (this.$refs.treeSelect) {
        this.$refs.treeSelect.filterFun(value);
      }
    },
    //知识点查询资源
    tipChange(tips) {
      this.resForm.tips = tips;
      this.loadResList();
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
        name: "book"
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
          obj.resId = element.rlrResourceId;
          obj.resName = element.resName;
          obj.resShowName = element.resName;
          obj.resPicNum = null;
          obj.resPageNum = null;
          obj.resType = element.resType;
          obj.qrCodeId = null;
          obj.qrCodeIndex = null;
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
      let flag = true;
      this.stepTableData.forEach(element => {
        if (element.resShowName == "") {
          flag = false;
        }
      });
      if (flag) {
        axios
          .request({
            method: "post",
            url: "/v1/tbMatchPic/textbookResesBindQRCodes",
            data: {
              textbookId: this.textbookId,
              catId: this.catalogId,
              bindJsonStr: JSON.stringify(this.stepTableData)
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              this.doReturn();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
              if (ret.data) {
                let arr = [];
                for (let i = 0; i < ret.data.length; i++) {
                  for (let j = 0; j < this.stepTableData.length; j++) {
                    if (ret.data[i] == this.stepTableData[j].qrCodeId) {
                      arr.push(this.stepTableData[j]);
                    }
                  }
                }
                this.stepTableData = arr;
              }
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
    async resLibChange(val) {
      this.resForm.textBookId = "";
      if (val == 2) {
        // 获取教材
        await this.getAllBooks();
      }
      this.resForm.comLib = "";
      // this.resForm.orgLib = ''
      this.resForm.resName = "";
      this.resForm.resType = "";
      this.resSearch();
    },
    getAllBooks() {
      axios
        .request({
          method: "post",
          url: "/book/v4/textbook/verifiedSubjectList",
          data: {
            pubId: this.roleId === 25 && this.pubId ? this.pubId : "",
            isEditor: this.roleId === 26 ? 1 : ""
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            this.textBookList = res.data;
            this.textBookList.forEach(item => {
              item.children = [];
            });
            this.textBookResTreeParams.data = this.textBookList;

            this.resForm.textBookId = res.data[0].textbookId
              ? res.data[0].textbookId
              : "";
            this.resSearch();
          }
        });
    },
    //资源查询按钮
    resSearch() {
      this.selResPage.page = 1;
      this.resForm.tips = "";
      // 获取当前选中资源库的知识点
      this.loadTips();
      this.loadResList();
    },
    resSearchByBook() {
      this.selResPage.page = 1;
      this.resForm.tips = "";
      this.loadResList(); // 按教材获取资源
    },
    //选择资源每页显示数据条数切换事件
    handleSizeChange(val) {
      this.selResPage.pagesize = val;
      this.loadResList();
    },
    orgResSearch(value) {
      this.$refs.orgResSelect.filterFun(value);
    },
    textBookResSearch(value) {
      this.$refs.textBookResSelect.filterFun(value);
    },
    // 资源列表选中事件
    changeSelect(selection) {
      console.log(selection);
      this.selectedResTag = [];
      this.selectedRes = selection;
      this.selectedResTag = selection;
    },
    // 取消选中某一列资源
    handleCloseSelectedRes(row) {
      console.log(row, this.selectedResTag.indexOf(row));
      let i = this.selectedResTag.indexOf(row);
      console.log(i);
      // this.selectedResTag.splice(this.selectedResTag.indexOf(row), 1);
      this.selectedResTag.splice(-1, 1);
      this.$refs.resListTable.toggleRowSelection(row, false);
    },
    getRowKeys(row) {
      return row.rlrId;
    },
    // 如果是文件夹不能选中
    isSelectable(row) {
      // if (row && row.resType == 11) {
      //   return false;
      // }
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
      return format(row.updated);
    },
    // 点击取消返回教材bookinfo界面
    doReturn() {
      this.$router.push({
        path: "/publication/bookInfo",
        query: {
          textbookId: this.textbookId,
          returnType: 1, //1是返回扫码资源 2是返回自测习题 3是返回教材习题
          returnCatalogId: this.catalogId
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
            textbookId: this.textbookId
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
      // let arr = []
      // let arr1 = []
      // this.stepTableData.forEach(element => {
      //   if(element.qrCodeId) {
      //     arr.push(element.qrCodeId)
      //   }
      // })
      // this.unUseQrcodeListAll.forEach(el1 => {
      //   let flag = true
      //   arr.forEach(el2 => {
      //     if(el2 == el1.id) {
      //       flag = false
      //     }
      //   })
      //   if(flag) {
      //     arr1.push(el1)
      //   }
      // })
      // this.unUseQrcodeList = arr1
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
            resourceId: row.resId
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
      if (this.resForm.libType == 1 || this.resForm.libType == 2) {
        url = "/v1/orgResourceLibrary/resource";
        data.rlrRlId = this.resForm.orgLib;
        data.textbookId = this.resForm.textBookId;
      } else {
        data.rlIsOfficial = 1;
        data.rlrRlId = this.resForm.comLib;
        data.tips = this.resForm.tips;
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
        .then(data => {
          this.loading.resLoading = false;
          let res = data.data;
          if (res.code == 200) {
            this.resListData = res.data.data;
            this.selResPage.total = res.data.total;
          }
        });
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
            ret.data.forEach(item => {
              this.courseIdMap.set(item.rlId, item.rlCourseId);
            });
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
    //资源码 按钮
    resQrcode(row) {
      this.qrcodePage.page = 1;
      this.qrcodeData = [];
      this.loadQrCode(row);
      this.isResQrcodeShow = true;
      this.qrcodeIndex = row;
      console.log(this.qrcodeIndex);
    },
    //加载二维码列表
    loadQrCode() {
      this.loading.qrcodeLoading = true;
      axios
        .request({
          method: "post",
          url: "/resource/tbMatchPic/qrCodeInfoListWithCount",
          data: {
            textbookId: this.textbookId,
            page: this.qrcodePage.page,
            pagesize: this.qrcodePage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          this.loading.qrcodeLoading = false;
          if (ret.code === 200) {
            this.qrcodeData = ret.data.data;
            this.qrcodePage.total = ret.data.total;
          }
        });
    },
    //绑定二维码
    bandleQrcode(row, index) {
      // this.qrCodeId
      for (let i = 0; i < this.stepTableData.length; i++) {
        if (this.stepTableData[i].resId === this.qrcodeIndex.resId) {
          this.stepTableData[i].qrCodeId = row.id;
          this.stepTableData[i].qrCodeIndex =
            this.bookNum + "-" + row.qrcodeNickname;
        }
      }
      this.isResQrcodeShow = false;
      // this.$message({
      //   type: 'success',
      //   message: '选择成功!'
      // });
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
.searchRes {
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .book {
      cursor: pointer;
      color: #2ba1f4;
    }
  }
  .el-main {
    margin: 22px 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding: 12px 18px 70px;
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
      .el-button {
        float: right;
        margin-right: 15px;
        margin-top: 9px;
      }
    }
  }
}
.matchPic {
  .el-row {
    .el-col {
      box-shadow: 0px 15px 10px -15px #ccc;
      margin-bottom: 15px;
      text-align: center;
      img {
        width: 100%;
      }
      .el-radio {
        margin-top: 5px;
      }
      div {
        text-align: center;
        font-size: 12px;
        margin: 10px 0 15px;
        line-height: 20px;
        // max-width: 190px;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }
    }
  }
}
</style>
