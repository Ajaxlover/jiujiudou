<template>
  <div class="batchAdd">
    <div v-show="stepActive == 0">
      <div style="margin-bottom:40px">
        <span style="margin-right:15px">内容来源</span>
        <el-radio-group @change="onRadioChange" v-model="importRadio">
          <el-radio label="1" border>本地上传</el-radio>
          <el-radio label="2" border>资源库获取</el-radio>
          <el-radio label="4" border>教材资源导入</el-radio>
          <el-radio label="3" border>云课导入</el-radio>
        </el-radio-group>
        <el-popover
          placement="bottom-start"
          trigger="hover"
          title="内容来源"
          width="400"
          content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
        >
          <div class="batchAdd-ts">
            本地上传：<span>可上传不超过500M的音频、视频或PDF文件</span>
          </div>
          <div class="batchAdd-ts">
            资源库获取：<span>从个人库或公共库获取内容到当前云课</span>
          </div>
          <div class="batchAdd-ts">
            教材资源导入：<span>从已验证的教材中导入内容到当前云课</span>
          </div>
          <div class="batchAdd-ts">
            其他云课导入：<span
              >从公共云课、班级云课或其他老师共享云课导入内容到当前云课</span
            >
          </div>
          <i
            class="el-icon-question"
            slot="reference"
            style="color:#2BA1F4;cursor:pointer;font-size:20px;margin-left:20px;"
          ></i>
        </el-popover>
      </div>
      <div style="overflow:hidden;">
        <span style="margin-right:15px;float:left;">已添内容</span>
        <div style="float:left;width:90%">
          <span
            v-if="
              !(
                this.uploadTag.length > 0 ||
                this.resTag.length > 0 ||
                this.cloudResTag.length > 0 ||
                this.bookResTag.length > 0
              )
            "
            >无</span
          >
          <el-tag
            v-for="(item, index) in uploadTag"
            @close="handleCloseUploadTag(item)"
            :key="'uploadTag-' + index"
            closable
          >
            {{ item.catalogName }}
          </el-tag>
          <el-tag
            v-for="(item, index) in resTag"
            @close="handleCloseResTag(item)"
            :key="'resTag-' + index"
            closable
          >
            {{ item.catalogName }}
          </el-tag>
          <el-tag
            v-for="(item, index) in cloudResTag"
            @close="handleCloseCloudResTag(item)"
            :key="'cloudResTag-' + index"
            closable
          >
            {{ item.catalogName }}
          </el-tag>
          <el-tag
            v-for="(item, index) in bookResTag"
            @close="handleCloseBookResTag(item)"
            :key="'bookResTag-' + index"
            closable
          >
            {{ item.catalogName }}
          </el-tag>
        </div>
      </div>
      <!-- 本地上传： -->
      <div v-show="importRadio == 1">
        <div style="margin-top:20px;padding-left:80px">
          <el-upload
            :before-upload="fileChange"
            :show-file-list="false"
            action="#"
            multiple
          >
            <el-button size="small" type="primary">{{
              uploadTag.length > 0 ? "继续上传" : "上传文件"
            }}</el-button>
          </el-upload>
          <div class="inputTips" style="margin-top:10px;">
            大小不能超过500M，支持文件类型：视频、音频和PDF
          </div>
          <div v-if="showProgress" style="margin-top: 19px;width:600px">
            <div v-for="(value, index) in dataList" :key="index">
              <div style="margin-top:10px">
                <span
                  class="el-icon-folder"
                  style="font-size:20px;font-weight:600;"
                ></span>
                {{ value.originName }}
                <span
                  v-if="value.percentage != 100"
                  class="el-icon-loading"
                  style="color: #2BA1F4;font-size:20px;font-weight:600;margin-left:20px"
                ></span>
                <span
                  v-else
                  class="el-icon-circle-check"
                  style="color: #2BA1F4;font-size:20px;font-weight:600;margin-left:20px"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 资源库获取： -->
      <div v-show="importRadio == 2">
        <div style="margin-top:20px;padding-left:80px;padding-right:80px;">
          <el-form :inline="true" size="small" :model="resForm">
            <el-form-item>
              <el-cascader
                v-model="resForm.resLib"
                :options="resLibOptions"
                :props="resProps"
                @change="resCascaderChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item style="margin-left:15px;">
              <el-select
                v-model="resForm.resType"
                placeholder="类型"
                size="small"
                style="width:100px;"
                @change="resSearch"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="音频" :value="1"></el-option>
                <el-option label="视频" :value="2"></el-option>
                <el-option label="PDF" :value="9"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left:15px;">
              <el-input
                v-model="resForm.resName"
                style="width:200px;"
                placeholder="请输入资源名称"
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
          <el-table
            :data="resForm.resData"
            stripe
            border
            v-loading="loading.resLoading"
            key="table1"
            @selection-change="changeSelect"
            :row-key="getRowKeys"
            ref="resListTable"
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
          >
            <el-table-column
              type="selection"
              :reserve-selection="true"
              align="center"
            ></el-table-column>
            <el-table-column label="资源名称" prop="resName" align="center">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between">
                  <div
                    style="text-align: left;padding-right: 15px;cursor:pointer;"
                    @click="handleViewRes2(scope.row)"
                  >
                    {{ scope.row.resName }}
                  </div>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleViewRes2(scope.row)"
                    >预览</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              prop="resType"
              align="center"
              :formatter="formatResType"
              width="150"
            ></el-table-column>
            <el-table-column
              label="资源大小"
              prop="resSize"
              align="center"
              :formatter="formatResSize"
              width="200"
            ></el-table-column>
            <el-table-column
              label="更新时间"
              prop="updated"
              align="center"
              :formatter="formatDate"
              width="200"
            ></el-table-column>
          </el-table>
          <div class="tabelFooter">
            <div v-if="resForm.resData.length" class="right-footer-first">
              从{{ (resPage.page - 1) * resPage.pagesize + 1 }}到{{
                (resPage.page - 1) * resPage.pagesize + resForm.resData.length
              }}记录，共{{ resPage.total }}条
            </div>
            <div v-else class="right-footer-first" ref="footerCount">
              从0到0条记录，共0条
            </div>
            <el-pagination
              layout="prev, pager, next, jumper"
              :total="resPage.total"
              :page-size="resPage.pagesize"
              :current-page.sync="resPage.page"
              :page-sizes="[5, 10, 20]"
              @size-change="handleSizeChange1"
              background
              @current-change="loadResList"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!-- 其他云课导入： -->
      <div v-show="importRadio == 3">
        <div style="margin-top:20px;padding-left:80px;padding-right:80px;">
          <el-form :inline="true" size="small" :model="cloudForm">
            <el-form-item>
              <el-cascader
                v-model="cloudForm.cloudRes"
                :options="cloudResOptions"
                :props="cloudProps"
                @change="cloudResCascaderChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item style="margin-left:15px;">
              <el-select
                v-model="cloudForm.resType"
                placeholder="类型"
                size="small"
                style="width:100px;"
                @change="cloudResSearch"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="音频" :value="1"></el-option>
                <el-option label="视频" :value="2"></el-option>
                <el-option label="PDF" :value="9"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left:15px;">
              <el-input
                v-model="cloudForm.keyWord"
                style="width:200px;"
                placeholder="请输入资源名称"
                @keyup.enter.native="cloudResSearch"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="cloudResSearch"
                class="el-icon-search"
              ></el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="cloudForm.resData"
            stripe
            border
            v-loading="loading.cloudResLoading"
            key="table3"
            @selection-change="changeSelect3"
            :row-key="getRowKeys3"
            ref="cloudResListTable"
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
          >
            <el-table-column
              type="selection"
              :reserve-selection="true"
              align="center"
            ></el-table-column>
            <el-table-column label="资源名称" prop="catalogName" align="center">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between">
                  <div
                    style="text-align: left;padding-right: 15px;cursor:pointer;"
                    @click="handleViewRes(scope.row)"
                  >
                    {{ scope.row.catalogName }}
                  </div>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleViewRes(scope.row)"
                    >预览</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="所在章节" align="center">
              <template slot-scope="scope">
                {{ scope.row.catalogParentsPath }} / {{ scope.row.catalogName }}
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              prop="catalogSubType"
              align="center"
              :formatter="formatResType"
              width="100"
            ></el-table-column>
            <!-- <el-table-column label="资源大小" prop="resSize" align="center" :formatter="formatResSize" width="120"></el-table-column> -->
            <el-table-column
              label="更新时间"
              prop="catalogCreateTime"
              align="center"
              :formatter="formatDate"
              width="160"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 教材资源导入： -->
      <div v-show="importRadio == 4">
        <div
          style="margin-top:20px;padding-left:80px;padding-right:80px;"
          v-if="bookList.length > 0"
        >
          <el-form :inline="true" size="small" :model="bookForm">
            <!-- <el-form-item>
              <el-cascader
                v-model="bookForm.bookRes"
                :options="bookResOptions"
                :props="bookProps"
                @change="bookResCascaderChange"
              ></el-cascader>
            </el-form-item> -->
            <el-form-item>
              <el-select
                @change="selectBookChange"
                v-model="bookForm.value"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in bookList"
                  :key="item.textbookId"
                  :label="item.tname"
                  :value="item.textbookId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left:15px;">
              <el-select
                v-model="bookForm.resType"
                placeholder="类型"
                size="small"
                style="width:100px;"
                @change="bookResSearch"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="音频" :value="1"></el-option>
                <el-option label="视频" :value="2"></el-option>
                <el-option label="PDF" :value="9"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left:15px;">
              <el-input
                v-model="bookForm.keyWord"
                style="width:200px;"
                placeholder="请输入资源名称"
                @keyup.enter.native="bookResSearch"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="bookResSearch"
                class="el-icon-search"
              ></el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="bookForm.resData"
            stripe
            border
            v-loading="loading.bookResLoading"
            key="table4"
            @selection-change="changeSelect4"
            :row-key="getRowKeys4"
            ref="bookResListTable"
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
          >
            <el-table-column
              type="selection"
              :reserve-selection="true"
              align="center"
            ></el-table-column>
            <el-table-column label="资源名称" prop="resName" align="center">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between">
                  <div
                    style="text-align: left;padding-right: 15px;cursor:pointer;"
                    @click="handleViewRes3(scope.row)"
                  >
                    {{ scope.row.resName }}
                  </div>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleViewRes3(scope.row)"
                    >预览</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="所在章节" align="center">
              <template slot-scope="scope">
                {{ scope.row.chapterName }}
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              prop="resType"
              align="center"
              :formatter="formatResType"
              width="100"
            ></el-table-column>
            <el-table-column
              label="资源大小"
              prop="resSize"
              align="center"
              :formatter="formatResSize"
              width="120"
            ></el-table-column>
            <el-table-column
              label="更新时间"
              prop="updated"
              align="center"
              :formatter="formatDate"
              width="160"
            ></el-table-column>
          </el-table>
          <div class="tabelFooter">
            <div v-if="bookForm.resData.length" class="right-footer-first">
              从{{ (bookResPage.page - 1) * bookResPage.pagesize + 1 }}到{{
                (bookResPage.page - 1) * bookResPage.pagesize +
                  bookForm.resData.length
              }}记录，共{{ bookResPage.total }}条
            </div>
            <div v-else class="right-footer-first" ref="footerCount">
              从0到0条记录，共0条
            </div>
            <el-pagination
              layout="prev, pager, next, jumper"
              :total="bookResPage.total"
              :page-size="bookResPage.pagesize"
              :current-page.sync="bookResPage.page"
              :page-sizes="[5, 10, 20]"
              @size-change="handleSizeChange4"
              background
              @current-change="loadBookResList"
            ></el-pagination>
          </div>
        </div>
        <div
          style="margin-top:20px;padding-left:0px;padding-right:80px;text-align: center"
          v-else
        >
          <img src="@/assets/images/empty1.png" alt="" />
          <div style="font-size:14px;color:#666666;margin-bottom:15px;">
            暂无可用的已验证教材
          </div>
          <div>
            <el-button
              size="small"
              type="primary"
              @click="loadVerifiedList"
              round
              style="width:80px;margin-bottom:10px"
              >刷新</el-button
            >
          </div>
          <el-popover
            placement="bottom-start"
            trigger="hover"
            title="验证教材"
            width="400"
            content="刮开教材封底防伪码涂层，使用‘九斗’APP扫描防伪二维码或输入防伪码数字，通过验证后，点击当前页面刷新按钮即可"
          >
            <span
              slot="reference"
              style="color:#2BA1F4;cursor:pointer;font-size:14px;"
              >如何验证教材</span
            >
          </el-popover>
        </div>
      </div>
    </div>
    <div v-show="stepActive == 1" style="padding: 20px 80px;">
      <el-table
        :data="contentList"
        stripe
        border
        key="table5"
        ref="setResListTable"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column label="内容标题" prop="catalogName" align="center">
          <template slot-scope="scope">
            <div style="display:flex;justify-content:space-between">
              <div
                style="text-align: left;padding-right: 15px;cursor:pointer;"
                v-if="scope.row.isShowInput"
              >
                {{
                  scope.row.catalogName.length > 50
                    ? (scope.row.catalogName = scope.row.catalogName.substring(
                        0,
                        50
                      ))
                    : scope.row.catalogName
                }}
              </div>
              <el-input
                v-model="scope.row.catalogName"
                v-else
                show-word-limit
                @blur="editTitleBlur(scope.row)"
                @keyup.enter.native="$event.target.blur"
              ></el-input>
              <el-button
                size="mini"
                type="text"
                @click="scope.row.isShowInput = !scope.row.isShowInput"
                >修改</el-button
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="资源名称"
          prop="resName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="类型"
          prop="resType"
          align="center"
          :formatter="formatResType"
          width="100"
        ></el-table-column>
        <el-table-column
          label="资源大小"
          prop="catalogLeafSize"
          align="center"
          :formatter="formatResSize"
          width="120"
        ></el-table-column>
        <el-table-column align="center" width="120">
          <div slot-scope="scope">
            <el-button
              class="el-icon-delete"
              type="text"
              @click="handleDel(scope.row, scope.$index)"
              style="font-size:20px;padding:0"
            ></el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottomBtnBox">
      <el-button size="small" @click="stepNext" v-if="stepActive == 0"
        >下一步</el-button
      >
      <!-- <el-button size="small" @click="doReturn" v-if="stepActive == 0">取消</el-button> -->
      <span class="cancelBtn" @click="doReturn" v-if="stepActive == 0"
        >取消</span
      >
      <el-button
        size="small"
        @click="doSure"
        v-if="stepActive == 1"
        :loading="loading.doSureLoading"
        >完成</el-button
      >
      <!-- <el-button size="small" @click="stepPrev" v-if="stepActive == 1">上一步</el-button> -->
      <span class="cancelBtn" @click="stepPrev" v-if="stepActive == 1"
        >上一步</span
      >
    </div>
    <!-- 预览资源 -->
    <el-dialog
      :visible.sync="isViewResShow"
      :modal="false"
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
        :style="viewResObj.resType == 2 ? 'height:400px' : ''"
      ></viewRes>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.batchAdd {
  padding-left: 40px;
  .el-tag {
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .el-tag + .el-tag {
    margin-right: 10px;
  }
  .bottomBtnBox {
    position: fixed;
    bottom: 0;
    right: 10%;
    left: 0;
    background: rgba(43, 161, 244, 1);
    box-shadow: 0px 2px 16px 0px rgba(13, 67, 118, 0.2);
    height: 56px;
    line-height: 56px;
    z-index: 11;
    padding-right: 20px;
    .el-button {
      width: 100px;
      float: right;
      height: 36px;
      margin-right: 15px;
      margin-top: 15px;
      border-radius: 30px;
    }
    .cancelBtn {
      width: 100px;
      float: right;
      height: 36px;
      line-height: 36px;
      margin-right: 15px;
      margin-top: 15px;
      border-radius: 30px;
      border: 1px solid #fff;
      color: #fff;
      text-align: center;
      cursor: pointer;
      font-size: 12px;
    }
  }
}
.batchAdd-ts {
  font-size: 14px;
  color: #333;
  line-height: 28px;
  span {
    color: #999;
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { format, dateStr } from "@/utils/datetime";
import viewRes from "@/components/viewRes";
import COS from "cos-js-sdk-v5";
import Vod from "vod-js-sdk-v6";
export default {
  name: "batchAdd",
  components: {
    viewRes
  },
  props: {
    catalogCourseId: "",
    catalogParentId: ""
  },
  data() {
    return {
      bookList: [],
      stepActive: 0,
      importRadio: "1",
      dataList: [],
      contentList: [],
      uploadTag: [], //上传资源生成的数组
      resTag: [], //资源库选择生成的数组
      cloudResTag: [], //云课资源选择生成的数组
      bookResTag: [], //教材资源选择生成的数组
      showProgress: false,
      total: 0,
      done: 0,
      loading: {
        resLoading: false,
        cloudResLoading: false,
        bookResLoading: false,
        doSureLoading: false
      },
      // 资源库列表参数
      resForm: {
        resType: "",
        resName: "",
        resLib: [],
        resData: []
      },
      resLibOptions: [
        {
          rlId: "1",
          rlName: "公共库",
          children: []
        },
        {
          rlId: "0",
          rlName: "个人库",
          children: []
        }
      ],
      resProps: {
        expandTrigger: "hover",
        value: "rlId",
        label: "rlName"
      },
      resPage: {
        total: 10,
        page: 1,
        pagesize: 5
      },
      // 云课资源列表参数
      cloudForm: {
        resType: "",
        cloudRes: [],
        resData: [],
        keyWord: ""
      },
      cloudResOptions: [
        {
          ccourseId: "0",
          ccourseName: "公共云课",
          children: []
        },
        {
          ccourseId: "1",
          ccourseName: "个人云课",
          children: []
        }
      ],
      cloudProps: {
        expandTrigger: "hover",
        value: "ccourseId",
        label: "ccourseName"
      },
      // 教材资源列表参数
      bookForm: {
        resType: "",
        bookRes: [],
        resData: [],
        keyWord: "",
        value: "" // 教材id
      },
      bookResOptions: [],
      bookProps: {
        expandTrigger: "hover",
        value: "textbookId",
        label: "textbookName"
      },
      bookResPage: {
        total: 10,
        page: 1,
        pagesize: 5
      },
      isViewResShow: false, //预览资源show
      viewResObj: {}, //预览资源传入的数据
      // 腾讯云 上传
      vod: null,
      cos: null,
      taskList: [], // 常规资源任务列表
      uploader: null, // 视频音频上传存储对象
      cosConfig: {
        topDomain: "",
        region: ""
      }
    };
  },
  mounted() {
    this.initCosV5();
    this.initVod();
  },
  methods: {
    onRadioChange(val) {
      if (val == 2) {
        this.initMyResLib();
        this.initComResLib();
      }
      if (val == 3) {
        this.loadMyCloudList();
        this.loadCloudList();
      }
      if (val == 4) {
        this.bookList = [];
        this.loadVerifiedList();
      }
    },
    //删除已选上传内容
    handleCloseUploadTag(item) {
      this.$nextTick(() => {
        this.uploadTag.splice(this.uploadTag.indexOf(item), 1);
      });
    },
    //删除资源库选择内容
    handleCloseResTag(item) {
      this.resTag.splice(this.resTag.indexOf(item), 1);
      this.$nextTick(() => {
        this.$refs.resListTable.toggleRowSelection(item);
      });
    },
    handleCloseCloudResTag(item) {
      this.cloudResTag.splice(this.cloudResTag.indexOf(item), 1);
      this.$nextTick(() => {
        this.$refs.cloudResListTable.toggleRowSelection(item);
      });
    },
    handleCloseBookResTag(item) {
      this.bookResTag.splice(this.bookResTag.indexOf(item), 1);
      this.$nextTick(() => {
        this.$refs.bookResListTable.toggleRowSelection(item);
      });
    },
    // 文件变换事件
    fileChange(file) {
      if (file) {
        if (this.toResType(file.type) != 0) {
          this.showProgress = true;
          file.resType = `${this.toResType(file.type)}`;
          file.percentage = 0;
          file.originName = file.name;
          file.file = file;
          this.dataList.push(file);
          this.total = this.dataList.length;
          this.upload(file);
        } else {
          this.$message({
            type: "warning",
            message: "支持文件类型：视频、音频和PDF"
          });
        }
      }
      return false;
    },
    //上传文件到腾讯云
    upload(value) {
      value.cloudId = "";
      if (value.resType == 1 || value.resType == 2) {
        let url = URL.createObjectURL(value);
        let audioElement = new Audio(url);
        let duration;
        audioElement.addEventListener("loadedmetadata", function(_event) {
          duration = audioElement.duration; //时长为秒，小数，182.36
          value.totalTime = Math.round(duration);
        });
        // 音频和视频 用VOD上传
        let uploader = this.vod.upload({
          mediaFile: value.file // file是js的文件引用
        });
        uploader.on("media_progress", info => {
          let p = Number(info.percent) * 100;
          value.percentage = parseFloat(p.toFixed(2));
        });
        uploader.done().then(info => {
          value.url = info.video.url;
          value.cloudId = info.fileId;
          this.doneUpload(value);
        });
      } else {
        // 其他的 用COS上传
        // let path = `${dateStr("YYYYMM")}`;
        let path =
          dateStr("YYYYMM") +
          "/" +
          this.$store.state.user.userId +
          new Date().valueOf() +
          common.getFileType(value.name);
        this.cos.putObject(
          {
            Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
            Region: this.cosConfig.region,
            Key: path,
            StorageClass: "STANDARD",
            Body: value.file,
            onProgress: curr => {
              let p = Number(curr.percent) * 100;
              value.percentage = parseFloat(p.toFixed(2));
            }
          },
          (err, result) => {
            if (!err) {
              value.url = encodeURI(
                `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
              );
              this.doneUpload(value);
            } else {
              console.log(err);
            }
          }
        );
      }
    },
    //上传完成
    doneUpload(value) {
      this.done++;
      let obj = {};
      obj.catalogName = this.getFileName(value.name);
      obj.resName = value.name;
      obj.catalogLeafSize = value.size;
      obj.catalogType = 1;
      obj.catalogSubType = value.resType;
      obj.cloudId = value.cloudId;
      obj.catalogLeafSourceType = 1;
      obj.isShowInput = true;
      obj.catalogLeafObj = value.url;
      obj.totalTime = value.totalTime;
      this.uploadTag.push(obj);
      if (this.done == this.total && value.percentage == 100) {
        this.dataList = [];
        this.done = 0;
        this.showProgress = false;
      }
    },
    //加载资源列表
    loadResList() {
      this.loading.resLoading = true;
      let url = "v1/resource/selectResFromPCRlPage";
      let data = {
        page: this.resPage.page,
        pagesize: this.resPage.pagesize,
        keywords: this.resForm.resName,
        resType: this.resForm.resType
      };
      data.resLibType = this.resForm.resLib[0] ? this.resForm.resLib[0] : "1";
      data.resLib = this.resForm.resLib[1] ? this.resForm.resLib[1] : "";
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
              res.data.data.forEach(element => {
                element.catalogName = this.getFileName(element.resName);
                element.catalogType = 1;
                element.catalogSubType = element.resType;
                element.cloudId = element.cloudId;
                element.catalogLeafSourceType = 2;
                element.catalogLeafSize = element.resSize;
                element.catalogLeafObj = element.resUrlWeb;
                element.isShowInput = true;
              });
              this.resForm.resData = res.data.data;
              this.resPage.total = res.data.total;
            }
          }.bind(this)
        );
    },
    handleSizeChange1(val) {
      this.resPage.pagesize = val;
      this.loadResList();
    },
    resSearch() {
      this.resPage.page = 1;
      this.loadResList();
    },
    resCascaderChange(arr) {
      sessionStorage.setItem("reportResCascader", JSON.stringify(arr));
      this.resSearch();
    },
    //内容列表中查看资源
    handleViewRes(row) {
      let arr = {};
      arr.resUrlWeb = row.catalogLeafObj;
      arr.resType = row.catalogSubType;
      arr.resName = row.catalogName;
      this.viewResObj = arr;
      this.isViewResShow = true;
    },
    //添加资源中预览资源
    handleViewRes2(row) {
      this.viewResObj = row;
      this.isViewResShow = true;
    },
    handleViewRes3(row) {
      row.resUrlWeb = row.resUrl;
      this.viewResObj = row;
      this.isViewResShow = true;
    },
    //关闭预览资源弹框清空数据
    handleCloseViewDialog() {
      this.viewResObj = {};
      this.isViewResShow = false;
    },
    // 资源列表选中事件
    changeSelect(selection) {
      // this.resTag = []
      this.resTag = selection;
    },
    getRowKeys(row) {
      return row.resourceid;
    },
    cloudResSearch() {
      this.loadCloudResList();
    },
    cloudResCascaderChange(arr) {
      sessionStorage.setItem("reportCloudResCascader", JSON.stringify(arr));
      this.cloudResSearch();
    },
    changeSelect3(selection) {
      this.cloudResTag = [];
      // this.selectedRes = selection
      this.cloudResTag = selection;
    },
    //加载云课内容列表
    loadCloudResList() {
      axios
        .request({
          method: "post",
          url: "ccourse/v4/cCourseCatalog/leafList",
          data: {
            cCourseId: this.cloudForm.cloudRes[1]
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.forEach(element => {
              element.catalogLeafSourceType = 3;
              element.resName = element.catalogName;
              element.isShowInput = true;
            });
            if (this.cloudForm.resType == "" && this.cloudForm.keyWord == "") {
              this.cloudForm.resData = ret.data;
            } else if (
              this.cloudForm.resType == "" &&
              this.cloudForm.keyWord != ""
            ) {
              this.cloudForm.resData = ret.data.filter((item, i) => {
                return item.catalogName.indexOf(this.cloudForm.keyWord) > -1;
              });
            } else if (
              this.cloudForm.resType != "" &&
              this.cloudForm.keyWord == ""
            ) {
              this.cloudForm.resData = ret.data.filter((item, i) => {
                return item.catalogSubType == this.cloudForm.resType;
              });
            } else {
              this.cloudForm.resData = ret.data.filter((item, i) => {
                return (
                  item.catalogSubType == this.cloudForm.resType &&
                  item.catalogName.indexOf(this.cloudForm.keyWord) > -1
                );
              });
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getRowKeys3(row) {
      return row.catalogId;
    },
    // 选中教材
    selectBookChange(val) {
      this.bookForm.value = val;
      this.bookResPage.page = 1;
      this.loadBookResList();
    },
    //加载教材资源列表
    loadBookResList() {
      this.loading.bookResLoading = true;
      let url = "/resource/v4/tbMatchPic/pageResourceNormal";
      let data = {
        page: this.bookResPage.page,
        pageSize: this.bookResPage.pagesize,
        textbookId: this.bookForm.value,
        keyword: this.bookForm.keyWord,
        type: this.bookForm.resType
      };
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(
          function(data) {
            this.loading.bookResLoading = false;
            let res = data.data;
            if (res.code == 200) {
              res.data.data.forEach(element => {
                element.catalogName = this.getFileName(element.resName);
                element.catalogType = 1;
                element.catalogLeafSize = element.resSize;
                element.catalogSubType = element.resType;
                element.catalogLeafSourceType = 4;
                element.catalogLeafObj = element.resUrl;
                element.isShowInput = true;
              });
              this.bookForm.resData = res.data.data;
              this.bookResPage.total = res.data.total;
            }
          }.bind(this)
        );
    },
    bookResCascaderChange(arr) {
      sessionStorage.setItem("reportBookResCascader", JSON.stringify(arr));
      this.bookResSearch();
    },
    bookResSearch() {
      this.bookResPage.page = 1;
      this.loadBookResList();
    },
    handleSizeChange4(val) {
      this.bookResPage.pagesize = val;
      this.loadBookResList();
    },
    getRowKeys4(row) {
      return row.id;
    },
    changeSelect4(selection) {
      this.bookResTag = [];
      // this.selectedRes = selection
      this.bookResTag = selection;
    },
    doReturn() {
      this.$emit("toCloseDrawer1");
    },
    //上一步
    stepPrev() {
      this.stepActive = 0;
      this.contentList = [];
    },
    //下一步
    stepNext() {
      if (this.dataList.length <= 0) {
        this.contentList = this.contentList.concat(
          this.uploadTag,
          this.resTag,
          this.cloudResTag,
          this.bookResTag
        );
        if (this.contentList.length > 0) {
          this.stepActive = 1;
        } else {
          this.$message({
            type: "warning",
            message: "请选择导入资源"
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "有正在上传的文件，请稍后"
        });
      }
    },
    editTitleBlur(row) {
      if (row.catalogName.split(" ").join("").length == 0) {
        row.catalogName = this.getFileName(row.resName);
      }
      row.isShowInput = !row.isShowInput;
    },
    //下一步中删除内容
    handleDel(row, index) {
      this.$confirm("确定删除该内容吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        modal: false
      })
        .then(() => {
          this.contentList.splice(index, 1);
          if (row.catalogLeafSourceType == 1) {
            this.handleCloseUploadTag(row);
          } else if (row.catalogLeafSourceType == 2) {
            this.handleCloseResTag(row);
          } else if (row.catalogLeafSourceType == 3) {
            this.handleCloseCloudResTag(row);
          } else {
            this.handleCloseBookResTag(row);
          }
          if (this.contentList.length == 0) {
            this.stepActive = 0;
          }
        })
        .catch(() => {});
    },
    doSure() {
      console.log(this.contentList);
      var cataList = [];
      for (let data of this.contentList) {
        let json = {};
        json.name = data.catalogName;
        json.cloudId = data.cloudId;
        json.leafObj = data.catalogLeafObj;
        json.subType = data.catalogSubType;
        json.sourceType = data.catalogLeafSourceType;
        json.leafSize = 0;
        json.type = 1;
        json.totalTime = data.totalTime;
        cataList.push(json);
      }
      this.loading.doSureLoading = true;
      axios
        .request({
          method: "post",
          url: "/openccourse/ccourseCatalog/addResources",
          data: {
            courseId: this.catalogCourseId,
            parentId: this.catalogParentId,
            resources: JSON.stringify(cataList)
          }
        })
        .then(
          function(data) {
            this.loading.doSureLoading = false;
            let res = data.data;
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: res.msg
              });
              this.$emit("toCloseDrawer1LoadContent");
            }
          }.bind(this)
        );
    },
    // 时间
    formatDate(row) {
      if (row.updated) {
        return format(row.updated);
      }
      if (row.updateTime) {
        return format(row.updateTime);
      }
      if (row.catalogCreateTime) {
        return format(row.catalogCreateTime);
      }
    },
    //table资源类型
    formatResType(row) {
      if (row.resType) {
        return common.resTypeFormat(row.resType);
      }
      if (row.catalogSubType) {
        return common.resTypeFormat(row.catalogSubType);
      }
    },
    //table资源大小
    formatResSize(row) {
      if (row.resSize) {
        if (row.resSize < 1024 * 1024) {
          return (row.resSize / 1024).toFixed(1) + "KB";
        } else {
          return (row.resSize / (1024 * 1024)).toFixed(1) + "MB";
        }
      }
      if (row.catalogLeafSize) {
        if (row.catalogLeafSize < 1024 * 1024) {
          return (row.catalogLeafSize / 1024).toFixed(1) + "KB";
        } else {
          return (row.catalogLeafSize / (1024 * 1024)).toFixed(1) + "MB";
        }
      }
      return "0KB";
    },
    //根据文件类型 转换成 资源类型
    toResType(fileType) {
      let type = 0;
      if (fileType.indexOf("video") === 0) {
        type = 2;
      } else if (fileType.indexOf("audio") === 0) {
        type = 1;
      } else if (fileType.indexOf("application/pdf") === 0) {
        type = 9;
      }
      return type;
    },
    //加载公共资源库列表
    initComResLib() {
      axios
        .request({
          method: "post",
          url: "/v1/resourceLibrary/selectPCSblList",
          data: {
            resLibType: 1
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.resLibOptions[0].children = ret.data;
            let arr = JSON.parse(sessionStorage.getItem("reportResCascader"));
            if (arr && arr.length > 0) {
              this.resForm.resLib[0] = arr[0];
              this.resForm.resLib[1] = arr[1];
            } else {
              this.resForm.resLib[0] = "1";
              this.resForm.resLib[1] = this.resLibOptions[0].children[0].rlId;
            }
            this.loadResList();
          }
        });
    },
    //加载个人资源库列表
    initMyResLib() {
      axios
        .request({
          method: "post",
          url: "/resource/v4/resource/selPersonalLibList"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.forEach(element => {
              element.rlId = element.libId;
              element.rlName = element.libName;
            });
            this.resLibOptions[1].children = ret.data;
          }
        });
    },
    //加载公共云课列表
    loadCloudList() {
      axios
        .request({
          method: "post",
          url: "v1/cCourse/selCCListNotInThisReco",
          data: {
            recoType: 3
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.cloudResOptions[0].children = ret.data;
            let arr = JSON.parse(
              sessionStorage.getItem("reportCloudResCascader")
            );
            if (arr && arr.length > 0) {
              this.cloudForm.cloudRes[0] = arr[0];
              this.cloudForm.cloudRes[1] = arr[1];
            } else {
              this.cloudForm.cloudRes[0] = "0";
              this.cloudForm.cloudRes[1] = this.cloudResOptions[0].children[0].ccourseId;
            }
            this.loadCloudResList();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //加载我的云课列表
    loadMyCloudList() {
      axios
        .request({
          method: "post",
          url: "v1/cCourse/selClaCList",
          data: {
            pageNum: 1,
            pagesize: 200
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.data.forEach(element => {
              element.ccourseId = element.claCId;
              element.ccourseName = element.claCName;
            });
            this.cloudResOptions[1].children = ret.data.data.filter(
              (item, i) => {
                return item.claCId != this.catalogCourseId;
              }
            );
            // this.cloudForm.mcourseId = this.cloudForm.myCloudList[0].claCId
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //加载已验证的教材列表
    loadVerifiedList() {
      axios
        .request({
          method: "post",
          url: "/book/v1/textbook/updateBookShelf",
          data: {
            updated: "0"
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.bookUpdate.forEach(element => {
              if (element) {
                this.bookList.push(element);
              }
            });
            this.bookForm.value = this.bookList[0].textbookId;
            this.loadBookResList();
            // if (ret.code === 200) {
            //   ret.data.forEach(element => {
            //     if (element) {
            //       let flag = 0;
            //       for (let i = 0; i < this.bookResOptions.length; i++) {
            //         let temp = this.bookResOptions[i];
            //         if (temp.textbookId == element.sid) {
            //           temp.children.push({
            //             textbookId: element.textbookId,
            //             textbookName: element.textbookName
            //           });
            //           flag = 1;
            //           break;
            //         }
            //       }
            //       if (flag == 0) {
            //         this.$store.state.subjectType.subjectType.forEach(item => {
            //           if (element.sid == item.subjectId) {
            //             this.bookResOptions.push({
            //               textbookId: item.subjectId,
            //               textbookName: item.sname,
            //               children: [
            //                 {
            //                   textbookId: element.textbookId,
            //                   textbookName: element.textbookName
            //                 }
            //               ]
            //             });
            //           }
            //         });
            //       }
            //     }
            //   });
            //   let arr = JSON.parse(
            //     sessionStorage.getItem("reportBookResCascader")
            //   );
            //   if (arr && arr.length > 0) {
            //     this.bookForm.bookRes[0] = arr[0];
            //     this.bookForm.bookRes[1] = arr[1];
            //   } else {
            //     this.bookForm.bookRes[0] = this.bookResOptions[0].textbookId;
            //     this.bookForm.bookRes[1] = this.bookResOptions[0].children[0].textbookId;
            //   }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 初始化COS
    initCosV5() {
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
    // 初始化VOD
    initVod() {
      axios
        .request({
          method: "post",
          url: "/v1/upload/vodSignature"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.vod = new Vod({
              getSignature: () => ret.data.signature
            });
          }
        });
    },
    getFileName(data) {
      if (data.indexOf(".") != -1) {
        return data.substring(0, data.lastIndexOf("."));
      } else {
        return data;
      }
    }
  }
};
</script>
