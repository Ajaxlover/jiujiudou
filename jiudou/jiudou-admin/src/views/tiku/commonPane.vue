<template>
  <el-container class="commonPane">
    <div class="left-container">
      <div class="left-header">
        <span>公共题库列表</span>
        <img src="@/assets/images/plus.png" @click="addBank" />
      </div>
      <div style="height:580px;overflow-y:auto;overflow-x:hidden">
        <el-menu :default-active="String(defaultActive)">
          <el-submenu
            v-for="subject in banks"
            :key="subject.subjectId"
            :index="String(subject.subjectId)"
          >
            <template slot="title">
              <div :title="subject.name">{{ subject.name }}</div>
            </template>
            <el-menu-item
              class="customMenuItem"
              v-for="sbl in subject.children"
              :key="sbl.sblId"
              :index="String(sbl.sblId)"
              @click="selectBank(sbl)"
              :title="sbl.name"
            >
              <span class="customItemName">{{ sbl.name }}</span>
              <span
                ><edit-popover
                  v-on:onSelected="popoverClick"
                  :bank="sbl"
                ></edit-popover
              ></span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <el-main>
      <div class="tabelHeader">
        <el-form v-model="form" :inline="true" size="small">
          <el-form-item>
            <el-tree-select
              @input="tipSelectChange"
              :styles="tipTreeStyle"
              :value="form.tips"
              :selectParams="selectParams"
              :treeParams="treeParams"
              @searchFun="tipSearch"
              ref="treeSelect"
            />
          </el-form-item>
          <el-form-item label="题型">
            <el-select
              v-model="form.tSubject"
              style="width:100px"
              label="题型"
              @change="paramChange"
            >
              <el-option
                v-for="type in allTypes"
                :key="type.type"
                :label="type.name"
                :value="type.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难度系数">
            <el-select
              v-model="form.difficultyLevel"
              style="width:100px"
              placeholder="难度系数"
              @change="paramChange"
            >
              <el-option
                v-for="diff in allDiffs"
                :key="diff.type"
                :label="diff.name"
                :value="diff.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="form.status"
              style="width:100px"
              label="题型"
              @change="paramChange"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="停用" value="0"></el-option>
              <el-option label="纠错" value="1"></el-option>
              <el-option label="启用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="display:block">
            <el-input
              placeholder="搜索标签"
              v-model="form.uniqueId"
              @keyup.enter.native="paramChange"
              style="width:auto"
            ></el-input>
            <el-input
              v-model="form.title"
              @keyup.enter.native="paramChange"
              placeholder="搜索题目"
              style="width:auto;margin-left:15px;"
            ></el-input>
            <el-button
              type="primary"
              @click="onSearch"
              class="el-icon-search"
              style="margin-left:15px;"
            ></el-button>
          </el-form-item>
        </el-form>
        <el-row class="operateBtn">
          <el-button
            size="small"
            v-if="selectedSubjects.length"
            style="border-color:#2BA1F4;color:#2BA1F4;"
            @click="handleChangeStatus(1)"
            >启用</el-button
          >
          <el-button
            size="small"
            v-if="selectedSubjects.length"
            style="border-color:#2BA1F4;color:#2BA1F4;"
            @click="handleChangeStatus(2)"
            >停用</el-button
          >
          <el-button
            size="small"
            v-if="selectedSubjects.length"
            style="border-color:#2BA1F4;color:#2BA1F4;"
            @click="handleDel()"
            >批量删除</el-button
          >
          <!-- <el-popover
            placement="top"
            title=""
            width="300"
            trigger="click"
            content=""
          >
            <el-form ref="form" :model="uniqueSelectForm" label-width="80px">
              <el-form-item label="知识点">
                <el-tree-select
                  @input="tipSelectUniqueChange"
                  :styles="tipTreeStyle"
                  :value="uniqueSelectForm.tips"
                  :selectParams="selectParamsUnique"
                  :treeParams="treeParamsUnique"
                  @searchFun="tipSearchUnique"
                  ref="treeSelectUnique"
                />
               
              </el-form-item>
              <el-form-item label="题型">
                <el-select
                  style="width:130px;"
                  size="mini"
                  v-model="uniqueSelectForm.uniqueSelectTsubject"
                  clearable
                  @change="uniqueChange"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="type in allTypes"
                    :key="type.type"
                    :label="type.name"
                    :value="type.type"
                  ></el-option>
                </el-select>
              </el-form-item>
             
            </el-form>
            <el-button
              @click="toChaChong"
              slot="reference"
              type="primary"
              size="small"
              >题目查重</el-button
            >
          </el-popover> -->
          <span style="font-size:14px">查重模式</span>
          <el-switch
            @change="changeSearchType"
            v-model="isSearchType"
          ></el-switch>
          <el-button
            size="small"
            type="primary"
            style="border-radius:5px"
            @click="handleShowImport"
            >批量上传</el-button
          >
          <!-- <el-button
            size="small"
            type="primary"
            style="border-radius:5px"
            @click="handleAddSubject"
            >单题录入</el-button
          > -->
          <!-- 新单题录入 -->
          <el-button size="small" type="primary" @click="singleAdd"
            >单题录入</el-button
          >
        </el-row>
      </div>
      <el-table
        :data="subjects"
        v-loading="loading.subjectsList"
        ref="subjectsTable"
        stripe
        border
        row-key="id"
        @selection-change="selectChange"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          :reserve-selection="true"
          type="selection"
          align="center"
        ></el-table-column>
        <el-table-column
          label="ID"
          prop="id"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          label="标签"
          prop="uniqueId"
          align="center"
          width="130px"
        ></el-table-column>
        <el-table-column
          label="题型"
          prop="tSubject"
          align="center"
          width="90px"
          :formatter="formatType"
        ></el-table-column>
        <!-- <el-table-column
          label="难度"
          prop="difficultyLevel"
          align="center"
          width="60px"
          :formatter="formatDiff"
        ></el-table-column> -->
        <el-table-column
          label="难度系数"
          prop="accuracyRate"
          align="center"
          width="100px"
        ></el-table-column>
        <el-table-column label="知识点" align="center" width="150px">
          <template slot-scope="scope">
            <span v-html="scope.row.learnPort" v-if="scope.row.tipId"></span>
            <span
              v-html="scope.row.learnPort"
              style="color: red;font-weight:600"
              v-else
            ></span>
          </template>
        </el-table-column>
        <el-table-column label="题目内容" align="center">
          <template slot-scope="scope">
            <div style="display:flex;justify-content:space-between;">
              <!-- <div class="subject-title">{{subjects[scope.$index].briefTitle}}</div> -->
              <div class="subject-title" v-html="scope.row.briefTitle"></div>
              <el-button
                size="mini"
                type="text"
                @click="preview(subjects[scope.$index])"
                >预览</el-button
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="60px">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 2">启用</span>
            <span v-if="scope.row.status == 1">纠错</span>
            <span v-if="scope.row.status == 0">停用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="日期"
          prop="modifiedTime"
          align="center"
          width="100px"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="100px"
          fixed="right"
        >
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="text" @click="handleEdit(scope.row)"
              >编辑1</el-button
            > -->
            <el-button
              size="mini"
              type="text"
              @click="newEditSubject(scope.row)"
              >编辑</el-button
            >
            <el-dropdown trigger="click" :hide-on-click="true">
              <span
                class="el-dropdown-link"
                style="color:#409EFF;font-size:12px;cursor: pointer;"
              >
                更多
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  启用<el-switch
                    :value="scope.row.status == 2"
                    style="margin-left:30px;"
                    @change="handleStatus(scope.row)"
                  ></el-switch>
                </el-dropdown-item>
                <!-- <el-dropdown-item
                  v-if="scope.row.sonSubList && scope.row.sonSubList.length > 0"
                  @click.native="showSubList(scope.row)"
                >
                  附属题目</el-dropdown-item
                > -->
                <el-dropdown-item @click.native="handleDel(scope.row)"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
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
          v-if="pageShow"
          layout="prev, pager, next, jumper"
          :page-sizes="[10, 30, 50]"
          :total="page.total"
          :page-size="page.pageSize"
          @size-change="handleSizeChange"
          :current-page.sync="page.currentPage"
          background
          @current-change="loadSubjects"
        ></el-pagination>
      </div>
    </el-main>
    <jd-dialog
      :title="addBankForm.sblId > 0 ? '修改库' : '新建库'"
      :loading="loading.addBank"
      :visible.sync="showAddBankDialog"
      width="600px"
      @sure="addSureClick"
    >
      <el-form
        slot="body"
        ref="addBank"
        size="small"
        label-width="80px"
        :model="addBankForm"
        :rules="addBankFormRules"
        style="padding-right:40px;"
      >
        <el-form-item label="课程" prop="subject">
          <el-cascader
            ref="mycascader"
            v-model="addBankForm.subject"
            style="width:100%"
            :options="subjectList"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="库名" prop="sblName">
          <el-input
            type="text"
            v-model="addBankForm.sblName"
            maxlength="80"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="coverPic">
          <el-input type="text" v-model="addBankForm.sblCoverPic"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-input type="text" v-model="addBankForm.sblTagName"></el-input>
        </el-form-item>
      </el-form>
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
    <jd-dialog
      :title="subjectForm.slsId > 0 ? '编辑题目' : '添加题目'"
      width="800px"
      :loading="loading.addSubject"
      :visible.sync="showAddSubjectDialog"
      :close_on_click_modal="false"
      @sure="addSubjectSure"
    >
      <template slot="body">
        <el-form
          :model="subjectForm"
          size="small"
          label-width="70px"
          :inline="true"
          ref="addSubject"
          :rules="subjectFormRules"
          style="height:400px;overflow-y: auto"
        >
          <el-form-item
            label="标签"
            class="add-subject-form-item"
            prop="uniqueId"
          >
            <el-input
              placeholder="例:DXWL12345678"
              style="width:58%"
              v-model="subjectForm.uniqueId"
            ></el-input>
          </el-form-item>
          <el-form-item label="知识点" class="add-subject-form-item">
            <el-tree-select
              @input="tkTipSelectChange"
              :styles="tkTipTreeStyle"
              :value="subjectForm.tips"
              :selectParams="tkSelectParams"
              :treeParams="tkTreeParams"
              @searchFun="tkTipSearch"
              ref="tkTreeSelect"
            />
          </el-form-item>
          <el-form-item label="题型">
            <el-select
              v-model="subjectForm.tSubject"
              style="width:100px"
              @change="typeChange"
            >
              <el-option
                v-for="type in types"
                :key="type.type"
                :label="type.name"
                :value="type.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难度">
            <el-select
              v-model="subjectForm.difficultyLevel"
              style="width:100px"
            >
              <el-option
                v-for="diff in diffs"
                :key="diff.type"
                :label="diff.name"
                :value="diff.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题目" prop="title" class="add-subject-form-item">
            <textarea id="titleEditor"></textarea>
          </el-form-item>
          <div
            v-if="
              subjectForm.tSubject == 1 ||
                subjectForm.tSubject == 2 ||
                subjectForm.tSubject == 3
            "
          >
            <el-form-item prop="answerList">
              <div>
                选项与正确答案(在正确答案前打钩)<span
                  class="addOption"
                  @click="addOption"
                  >添加选项</span
                >
              </div>
            </el-form-item>
            <el-checkbox-group v-model="checked">
              <div
                class="add-subject-form-options"
                v-for="(option, index) in subjectForm.answerList"
                :key="index"
              >
                <el-row v-if="option.sDelFlag == 1">
                  <el-col :span="2">
                    <el-checkbox :label="option.aOption"></el-checkbox>
                  </el-col>
                  <el-col :span="20" style="font-size:14px">
                    <textarea :id="index + 'Editor'"></textarea>
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      class="option-button el-icon-delete"
                      @click="deleteOption(option)"
                    ></el-button>
                  </el-col>
                  <el-form-item
                    style="height:0px;margin-bottom:0px;"
                    :prop="'answerList.' + index + '.aText'"
                    :rules="{
                      required: true,
                      message: '选项内容不能为空',
                      trigger: 'blur'
                    }"
                  >
                    <el-input v-model="option.aText"></el-input>
                  </el-form-item>
                </el-row>
              </div>
            </el-checkbox-group>
          </div>
          <el-form-item v-else label="答案" class="add-subject-form-item">
            <textarea id="answer"></textarea>
          </el-form-item>
          <el-form-item label="解析" class="add-subject-form-item">
            <textarea id="analysisEditor"></textarea>
          </el-form-item>
        </el-form>
      </template>
    </jd-dialog>
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
  </el-container>
</template>

<style lang="scss">
.commonPane {
  margin: 22px 23px;
  .left-container {
    max-width: 182px;
    min-width: 182px;
    border-radius: 4px;
    min-height: 638px;
    background: #ffffff;
    overflow: hidden;
    .left-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #2ba1f4;
      height: 46px;
      line-height: 46px;
      padding-left: 20px;
      padding-right: 13px;
      color: white;
      font-size: 16px;
      img {
        width: 16px;
        cursor: pointer;
      }
    }
    .customMenuItem {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .customItemName {
        overflow: hidden;
        text-overflow: ellipsis;
      }
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
        padding: 0 15px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .el-submenu .el-menu-item {
      min-width: 100%;
      padding-right: 8px;
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
      height: 46px;
      line-height: 46px;
      border-bottom: 1px solid #eaeaea;
    }
  }
  .el-main {
    padding: 12px;
    background: white;
    border-radius: 4px;
    overflow: hidden;
    margin-left: 15px;
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
        margin-bottom: 5px;
      }
    }
  }
  .el-table .el-button {
    padding: 3px;
    margin: 0;
    color: #2d66a0;
  }
  .subject-title {
    text-align: left;
    padding-right: 15px;
    max-height: 23px;
    overflow: hidden;
  }
  .add-subject-form-item {
    width: 100%;
    margin-right: 0;
    .el-form-item__content {
      width: 87%;
    }
  }
  .add-subject-form-options {
    width: 100%;
    padding-right: 0;
    padding-left: 24px;
    .el-row {
      margin-bottom: 18px;
    }
    .el-form-item__content {
      width: 100%;
      line-height: 0px !important;
      .el-input--small .el-input__inner {
        height: 0px;
        line-height: 0px;
        border: none;
      }
    }
  }
  .cke_editable {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    p {
      margin: 0;
    }
  }
  .cke_editable:hover {
    border-color: #c0c4cc;
  }
  .cke_editable:focus {
    border-color: #409eff;
    outline: #fff auto 0;
  }
  div[contenteditable] {
    height: 120px;
    overflow-y: scroll;
    padding: 9px;
  }
  .el-checkbox-group div[contenteditable] {
    height: 60px;
    overflow-y: scroll;
    padding: 9px;
  }
  .option-button {
    border: none;
  }
  .option-button:hover {
    background: none;
  }
  .addOption {
    cursor: pointer;
    color: #2ba1f4;
    margin-left: 27px;
  }
}
// .el-tree-select-popper{
//   left: 400px !important;
// }
</style>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { formatYMD } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
import fileModal from "@/components/fileModal";
import math from "@/components/jmath";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
import ckeditorConfig from "@/config/ckeditor_config.js";
import preview from "./previewSubject";
import COS from "cos-js-sdk-v5";
import editPopover from "../publication/popver";
export default {
  name: "CommonPaneList",
  components: {
    "jd-dialog": jdialog,
    "jd-math": math,
    ElTreeSelect,
    preview,
    fileModal,
    editPopover
  },
  data() {
    var validateOptions = (rule, value, callback) => {
      if (
        !this.subjectForm.answerList ||
        this.subjectForm.answerList.length == 0
      ) {
        return callback(new Error("请添加选项"));
      } else {
        callback();
      }
    };
    return {
      isSearchType: false,
      pageShow: true,
      // 题目查重
      uniqueSelectForm: {
        uniqueSelectTip: "",
        uniqueSelectTsubject: "",
        tips: "",
        tipsText: ""
      },
      showAddBankDialog: false,
      addBankForm: {
        subject: [],
        sblName: "",
        sblCoverPic: "",
        sblTagName: ""
      },
      addBankFormRules: {
        subject: [
          { required: true, message: "请选择所属学科", trigger: "change" }
        ],
        sblName: [{ required: true, message: "请输入库名", trigger: "blur" }]
      },
      // 学科
      subjectList: [],
      returnSblId: this.$route.query.belongId, // 从导入预览页面返回Id
      banks: [],
      defaultActive: 0,
      currentSbl: {},
      loading: {
        subjectsList: false,
        uploadFile: false,
        addSubject: false,
        addBank: false
      },
      //page
      page: {
        total: 0,
        currentPage: 1,
        pagesize: 10
      },
      subjects: [],
      types: common.types,
      allTypes: common.allTypes,
      // 难点
      diffs: common.diffs,
      allDiffs: common.allRateLevel,
      showUploadSubjectsDialog: false, //导入弹框
      // 将要预览的题目
      previewSubject: {},
      shwoPreviewDialog: false,
      // 当前页选中的题目
      selectedSubjects: [],
      form: {
        tips: "",
        tSubject: "",
        status: "",
        difficultyLevel: "",
        uniqueId: "",
        title: "",
        tipsText: ""
      },
      tipTreeStyle: {
        width: "130px"
      },
      tipSelected: [],
      selectParams: {
        multiple: true,
        clearable: false,
        placeholder: "请选择知识点"
      },
      selectParamsUnique: {
        multiple: true,
        clearable: false,
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
      treeParamsUnique: {
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
      // 添加题目
      record: [], // 记录当前库的知识点数据
      showAddSubjectDialog: false,
      tkTipTreeStyle: {
        width: "200px"
      },
      tkSelectParams: {
        multiple: true,
        clearable: false,
        placeholder: "请选择知识点"
      },
      tkTreeParams: {
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
      subjectForm: {
        id: 0,
        tips: "",
        tipsText: "",
        slsId: 0,
        uniqueId: "",
        tSubject: "2",
        difficultyLevel: "2",
        title: "",
        answer: "",
        analyse: "",
        answerList: [
          { aOption: "A", aText: "", sDelFlag: 1 },
          { aOption: "B", aText: "", sDelFlag: 1 },
          { aOption: "C", aText: "", sDelFlag: 1 },
          { aOption: "D", aText: "", sDelFlag: 1 }
        ]
      },
      subjectFormRules: {
        // uniqueId: [
        //   { required: true, message: '请输入标签', trigger: 'click' }
        // ],
        answerList: [
          { validator: validateOptions, required: true, trigger: "blur" }
        ]
      },
      // 正确答案选项
      checked: [],
      // 腾讯云
      cos: null,
      cosConfig: {
        topDomain: "",
        region: ""
      },
      testLibTip: []
    };
  },
  mounted() {
    this.loadSubjectList();
    this.loadBanks();
    // 初始化COS
    this.initCOS();
  },
  methods: {
    toChaChong() {},
    // 加载当前题库知识点
    loadLibTip() {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/tips",
          data: { libId: this.currentSbl.sblId }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.form.tips = "";
            this.testLibTip = ret.data;
            this.loadSubjectList();
          }
        });
    },
    // 题目查重
    uniqueChange() {
      this.loading.subjectsList = true;
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/subjectdDuplicateCheck",
          data: {
            libId: this.currentSbl.sblId,
            tSubject: this.uniqueSelectForm.uniqueSelectTsubject,
            tip: this.uniqueSelectForm.uniqueSelectTip,
            page: 1,
            pagesize: 10
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loading.subjectsList = false;
            this.page.total = ret.data.total;
            this.subjects = ret.data.data;
          } else {
            this.loading.subjectsList = false;
            this.$message({
              type: "warning",
              message: "请求超时"
            });
          }
        });
    },
    singleAdd() {
      this.$router.push({
        path: "/tiku/commonSingleQuestionIn",
        query: {
          libId: this.currentSbl.sblId,
          courseId: this.currentSbl.bank.sblCourseId
        }
      });
    },
    // 加载学科分类
    loadSubjectList() {
      axios
        .request({
          method: "post",
          url: "/subject/subject/listWithCourse"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.subjectList = ret.data
              .sort((a, b) => a.subjectId - b.subjectId)
              .map(item => ({
                value: item.subjectId,
                label: item.sname,
                children: item.courses.map(item => ({
                  value: item.courseId,
                  label: item.courseName
                }))
              }));
          }
        });
    },
    // 新增库
    addBank() {
      this.loading.addBank = false;
      this.addBankForm.sblId = 0;
      this.addBankForm.subject = [];
      this.addBankForm.sblName = "";
      this.addBankForm.sblCoverPic = "";
      this.addBankForm.sblTagName = "";
      this.showAddBankDialog = true;
      if (this.$refs.addBank) {
        this.$refs.addBank.clearValidate();
      }
    },
    addSureClick() {
      this.$refs.addBank.validate(valid => {
        if (valid) {
          let node = this.$refs.mycascader.getCheckedNodes()[0];
          let data = {
            courseId: node.value,
            courseName: node.label,
            subjectId: node.parent.value,
            subjectName: node.parent.label,
            sblName: this.addBankForm.sblName,
            tag: this.addBankForm.sblTagName,
            coverPic: this.addBankForm.sblCoverPic
          };
          this.loading.addBank = true;
          var url = "/subject/subjectBankLibrary/create";
          if (this.addBankForm.sblId > 0) {
            url = "/subject/subjectBankLibrary/update";
            data.sblId = this.addBankForm.sblId;
          }
          axios
            .request({
              method: "post",
              url: url,
              data: data
            })
            .then(res => {
              this.loading.addBank = false;
              var ret = res.data;
              if (ret.code == 200) {
                this.showAddBankDialog = false;
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                if (!data.sblId) {
                  this.returnSblId = ret.data.sblId;
                } else {
                  this.returnSblId = data.sblId;
                }
                this.loadBanks();
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        }
      });
    },
    popoverClick(index, sbl) {
      if (index == "1") {
        console.log(sbl);
        this.addBankForm.sblId = sbl.sblId;
        this.addBankForm.subject = [
          parseInt(sbl.bank.sblSubjectId),
          parseInt(sbl.bank.sblCourseId)
        ];
        this.addBankForm.sblName = sbl.name;
        this.addBankForm.sblCoverPic = sbl.bank.coverPic
          ? sbl.bank.coverPic
          : "";
        this.addBankForm.sblTagName = sbl.bank.tag ? sbl.bank.tag : "";
        this.loading.addBank = false;
        this.showAddBankDialog = true;
        if (this.$refs.addBank) {
          this.$refs.addBank.clearValidate();
        }
      } else if (index == "2") {
        this.deleteBank(sbl);
      }
    },
    // 删库
    deleteBank(sbl) {
      this.$confirm(
        "<div>你确定要删除题库【" +
          sbl.name +
          "】吗？</div>删除后，题库中的题目将同时删除且不可恢复",
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
              url: "/subject/subjectBankLibrary/remove",
              data: { sblId: sbl.sblId }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  message: ret.msg,
                  type: "success"
                });
                this.returnSblId = "";
                this.loadBanks();
              } else {
                this.$message({
                  message: ret.msg,
                  type: "warning"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: "服务器异常",
                type: "warning"
              });
            });
        })
        .catch(() => {});
    },
    // 从导入预览页面返回当前页面 从哪个库导题返回选中一个库 - 循环设置
    setImporSelected(banks) {
      banks.forEach(element => {
        if (element.children.length > 0) {
          for (let index = 0; index < element.children.length; index++) {
            const el = element.children[index];
            if (el.sblId == this.returnSblId) {
              this.currentSbl = el;
              this.defaultActive = el.sblId;
              this.loadSubjects();
              this.loadTips();
              return;
            }
          }
        }
      });
    },
    // 获取公共题库列表
    loadBanks() {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/commonList"
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.banks = [];
              res.data.forEach(element => {
                let flag = 0;
                for (let i = 0; i < this.banks.length; i++) {
                  let temp = this.banks[i];
                  if (temp.subjectId == element.sblSubjectId) {
                    temp.children.push({
                      sblId: element.id,
                      name: element.sblName,
                      bank: element
                    });
                    flag = 1;
                    break;
                  }
                }
                if (flag == 0) {
                  this.banks.push({
                    subjectId: element.sblSubjectId,
                    name: element.sblSubjectName,
                    children: [
                      {
                        sblId: element.id,
                        name: element.sblName,
                        bank: element
                      }
                    ]
                  });
                }
              });
              this.banks.sort((a, b) => a.subjectId - b.subjectId);
              if (this.banks.length > 0) {
                if (this.returnSblId) {
                  this.setImporSelected(this.banks);
                } else {
                  if (this.$store.state.tiku.currentTiku) {
                    this.currentSbl = this.$store.state.tiku.currentTiku;
                    this.defaultActive = this.$store.state.tiku.currentTiku.sblId;
                    this.page.currentPage = this.$store.state.tiku.tikuPage;
                    this.pageShow = false;
                    this.$nextTick(() => {
                      this.pageShow = true;
                    });
                    this.loadSubjects();
                    this.loadTips();
                    // this.loadLibTip();
                  } else {
                    let first = this.banks[0].children[0];
                    if (first != undefined) {
                      this.currentSbl = first;
                      this.defaultActive = first.sblId;
                      this.loadSubjects();
                      this.loadTips();
                      // this.loadLibTip();
                    }
                  }
                }
              }
            }
          }.bind(this)
        );
    },
    // 获取知识点
    loadTips() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          data: { courseId: this.currentSbl.bank.sblCourseId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.treeParams.data = res.data;
              this.treeParamsUnique.data = res.data;
              this.record = res.data;
              if (res.data.length >= 0) {
                this.$refs.treeSelect.treeDataUpdateFun(res.data);
                this.$refs.treeSelectUnique.treeDataUpdateFun(res.data);
              }
            }
          }.bind(this)
        );
    },
    // 点击题库条目
    selectBank(sbl) {
      this.$refs.subjectsTable.clearSelection();
      if (this.form.title.length || sbl.sblId != this.currentSbl.sblId) {
        this.form.title = "";
        this.form.tips = "";
        this.form.tipsText = "";
        this.form.tSubject = "";
        this.form.difficultyLevel = "";
        this.currentSbl = sbl;
        this.page.currentPage = 1;
        this.loadTips();
        this.loadLibTip();
        this.loadSubjects();
      }
    },
    // 全库搜索
    onSearch() {
      this.paramChange();
    },
    //选择资源每页显示数据条数切换事件
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.page.currentPage = 1;
      this.loadSubjects();
    },
    paramChange() {
      this.page.currentPage = 1;
      this.loadSubjects();
    },
    // 知识点筛选发生变化
    tipSelectChange(ids, labels) {
      this.form.tips = ids;
      if (labels) {
        this.form.tipsText = labels.join(",");
      } else {
        this.form.tipsText = "";
      }
      this.page.currentPage = 1;
      this.loadSubjects();
    },
    // 查重知识点筛选发生变化
    tipSelectUniqueChange(ids, labels) {
      this.uniqueSelectForm.tips = ids;
      if (labels) {
        this.uniqueSelectForm.uniqueSelectTip = labels.join(",");
        this.uniqueSelectForm.tipsText = labels.join(",");
      } else {
        this.uniqueSelectForm.tipsText = "";
        this.uniqueSelectForm.uniqueSelectTip = "";
      }
      this.uniqueChange();
    },
    changeSearchType(val) {
      this.page.currentPage = 1;
      this.loadSubjects();
    },
    // 加载题目列表
    loadSubjects() {
      let data = {
        libId: this.currentSbl.sblId,
        page: this.page.currentPage,
        pagesize: this.page.pagesize,
        searchType: this.isSearchType ? "2" : "1"
      };
      data.tSubject = this.form.tSubject;
      // data.difficultLevel = this.form.difficultyLevel;
      data.difficultRateLevel = this.form.difficultyLevel;
      data.keyWord = this.form.title;
      data.tip = this.form.tipsText;
      data.status = this.form.status;
      data.uniqueId = this.form.uniqueId;
      this.loading.subjectsList = true;
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/itemsWithCount",
          data: data
        })
        .then(
          function(data) {
            this.loading.subjectsList = false;
            let res = data.data;
            if (res.code == 200) {
              this.page.total = res.data.total;
              this.subjects = res.data.data;
            }
          }.bind(this)
        );
    },
    // 类型
    formatType(row) {
      return common.typeFormat(row.tSubject);
    },
    // 难点
    formatDiff(row) {
      return common.diffFormat(row.difficultyLevel);
    },
    // 时间
    formatDate(row) {
      if (row.modifiedTime) {
        return formatYMD(row.modifiedTime);
      } else {
        return formatYMD(row.createTime);
      }
    },
    // 状态
    formatStatus(row) {
      if (row.status == 0) {
        return "已停用";
      } else if (row.status == 1) {
        return "纠错中";
      } else {
        return "启用中";
      }
    },
    // 预览
    preview(subject) {
      console.log(subject);
      this.previewSubject = subject;
      this.shwoPreviewDialog = true;
    },
    // 题目选中状态发生变化
    selectChange(select) {
      this.selectedSubjects = select;
    },
    // 知识点搜索
    tipSearch(value) {
      this.$refs.treeSelect.filterFun(value);
    },
    // 查重知识点搜索
    tipSearchUnique(value) {
      this.$refs.treeSelectUnique.filterFun(value);
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
        if (this.uploadFile.size > 1024 * 1024) {
          this.$message({
            message: "文件过大",
            type: "warning"
          });
          return;
        }
        this.loading.uploadFile = true;
        let fd = new FormData();
        fd.append("docxFile", this.uploadFile);
        fd.append("libId", this.currentSbl.sblId);
        fd.append("sblType", 1);
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
                this.$store.commit("setTestList", res.data);
                this.$router.push({
                  path: "/tiku/importPreTem",
                  query: {
                    belongId: this.currentSbl.sblId,
                    belongType: 5 //1题库 2教材题 3教材自测题
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
    //单题录入按钮点击事件
    handleAddSubject() {
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      this.tkTreeParams.data = this.record;
      this.subjectForm.tips = "";
      this.subjectForm.tipsText = "";
      this.subjectForm.id = 0;
      this.subjectForm.slsId = 0;
      this.subjectForm.uniqueId = "";
      this.subjectForm.tSubject = 2 + "";
      this.subjectForm.difficultyLevel = 2 + "";
      this.subjectForm.title = "";
      this.subjectForm.analyse = "";
      this.subjectForm.answer = "";
      this.subjectForm.answerList = [
        { aOption: "A", aText: "", sDelFlag: 1 },
        { aOption: "B", aText: "", sDelFlag: 1 },
        { aOption: "C", aText: "", sDelFlag: 1 },
        { aOption: "D", aText: "", sDelFlag: 1 }
      ];
      this.checked = [];
      this.loading.addSubject = false;
      this.showAddSubjectDialog = true;
      if (this.record.length >= 0) {
        this.$nextTick(() => {
          this.$refs.tkTreeSelect.treeDataUpdateFun(this.record);
        });
      }
      this.renderCKEditor();
    },
    // 添加弹框中知识点变化事件
    tkTipSelectChange(ids, labels) {
      this.subjectForm.tipsText = labels.join(",");
      this.subjectForm.tips = ids;
    },
    // 弹框中知识点搜索
    tkTipSearch(value) {
      this.$refs.tkTreeSelect.filterFun(value);
    },
    // 点击编辑题目
    handleEdit(row) {
      this.tkTreeParams.data = this.record;
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      //去掉tipId前后的逗号
      if (row.tipId) {
        if (row.tipId.substring(row.tipId.length - 1) == ",") {
          row.tipId = row.tipId.substring(0, row.tipId.length - 1);
        }
        if (row.tipId.substring(0, 1) == ",") {
          row.tipId = row.tipId.substring(1, row.tipId.length);
        }
        this.subjectForm.tips = row.tipId.split(",");
        this.subjectForm.tipsText = row.learnPort;
      } else {
        this.subjectForm.tips = [];
        this.subjectForm.tipsText = "";
      }
      this.subjectForm.id = row.id;
      this.subjectForm.slsId = row.slsId;
      // this.subjectForm.tipsText = row.tipsText
      this.subjectForm.uniqueId = row.uniqueId;
      this.subjectForm.tSubject = row.tSubject + "";
      this.subjectForm.difficultyLevel = row.difficultyLevel + "";
      this.subjectForm.title = row.title;
      this.subjectForm.answerList = row.answerList;
      this.subjectForm.analyse = row.analyse;
      this.subjectForm.answer = row.answer;
      this.checked = [];
      row.answerList.forEach(element => {
        if (element.isCorrect === 2) {
          this.checked.push(element.aOption);
        }
      });
      this.loading.addSubject = false;
      this.showAddSubjectDialog = true;
      if (this.record.length >= 0) {
        this.$nextTick(() => {
          this.$refs.tkTreeSelect.treeDataUpdateFun(this.record);
        });
      }
      this.renderCKEditor();
    },
    newEditSubject(row) {
      // 存储当前题库和当前页码
      this.$store.commit("setCurrentTiku", this.currentSbl);
      this.$store.commit("setTikuPage", this.page.currentPage);
      localStorage.setItem("rowData", JSON.stringify(row));
      this.$router.push({
        path: "/tiku/commonSingleQuestionIn",
        query: {
          courseId: this.currentSbl.bank.sblCourseId
        }
      });
    },
    // 添加/编辑题目
    addSubjectSure() {
      this.$refs["addSubject"].validate(valid => {
        if (valid) {
          if (window.CKEDITOR.instances["titleEditor"]) {
            // eslint-disable-next-line standard/computed-property-even-spacing
            this.subjectForm.title = window.CKEDITOR.instances[
              "titleEditor"
            ].getData();
          }
          if (window.CKEDITOR.instances["analysisEditor"]) {
            // eslint-disable-next-line standard/computed-property-even-spacing
            this.subjectForm.analyse = window.CKEDITOR.instances[
              "analysisEditor"
            ].getData();
          }
          if (!this.subjectForm.title) {
            this.$message({
              message: "请输入题目",
              type: "warning"
            });
            return;
          }
          let flag = 0;
          for (let i = 0; i < this.subjectForm.answerList.length; i++) {
            let option = this.subjectForm.answerList[i];
            let id = i + "Editor";
            if (option.sDelFlag == 1) {
              if (window.CKEDITOR.instances[id]) {
                option.aText = window.CKEDITOR.instances[id].getData();
              }
              if (!option.aText || option.aText.length == 0) {
                flag = 1;
                break;
              }
              if (this.checked.indexOf(option.aOption) >= 0) {
                option.isCorrect = 2;
              } else {
                option.isCorrect = 1;
              }
            }
          }
          if (flag == 1) {
            return;
          }
          console.log(this.subjectForm.answerList);
          console.log(this.checked);
          if (
            this.subjectForm.answerList.length &&
            this.checked.length == 0 &&
            (this.subjectForm.tSubject == 1 ||
              this.subjectForm.tSubject == 2 ||
              this.subjectForm.tSubject == 3)
          ) {
            this.$message({
              message: "请选择正确答案",
              type: "warning"
            });
            return;
          }
          let data = {};
          let jsonStr = {};
          jsonStr.title = this.subjectForm.title;
          jsonStr.analyse = this.subjectForm.analyse;
          jsonStr.answer = this.subjectForm.answer;
          jsonStr.courseId = this.currentSbl.bank.sblCourseId;
          jsonStr.courseName = this.currentSbl.bank.sblCourseName;
          jsonStr.subjectId = this.currentSbl.bank.sblSubjectId;
          jsonStr.belongCourse = this.currentSbl.bank.sblSubjectName;
          jsonStr.tipId =
            this.subjectForm.tips.length > 0
              ? this.subjectForm.tips.join(",")
              : "";
          jsonStr.tipsText = this.subjectForm.tipsText;
          jsonStr.learnPort = jsonStr.tipsText;
          jsonStr.uniqueId = this.subjectForm.uniqueId
            ? this.subjectForm.uniqueId
            : "";
          jsonStr.tSubject = this.subjectForm.tSubject;
          jsonStr.difficultyLevel = this.subjectForm.difficultyLevel;
          jsonStr.answerList = this.subjectForm.answerList;
          var url;
          if (this.subjectForm.id > 0) {
            jsonStr.id = this.subjectForm.id;
            url = "/subject/subjectBank/update";
          } else {
            data.libId = this.currentSbl.sblId;
            url = "/subject/subjectBankLibrary/saveItemBatch";
          }
          data.jsonStr = JSON.stringify([jsonStr]);
          this.loading.addSubject = true;
          axios
            .request({
              method: "post",
              url: url,
              data: data
            })
            .then(
              function(data) {
                let res = data.data;
                if (res.code == 200) {
                  this.$message({
                    message: res.msg,
                    type: "success"
                  });
                  this.showAddSubjectDialog = false;
                  if (data.id > 0) {
                    this.page = 1;
                  }
                  this.loadSubjects();
                } else {
                  this.loading.addSubject = false;
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
              }.bind(this)
            )
            .catch(() => {
              this.loading.addSubject = false;
              this.$message({
                message: "服务器异常",
                type: "warning"
              });
            });
        }
      });
    },
    // 添加题目 - 渲染CKEditor
    renderCKEditor() {
      for (const name in window.CKEDITOR.instances) {
        window.CKEDITOR.instances[name].destroy();
      }
      this.$nextTick(function() {
        var vm = this;
        // title
        window.CKEDITOR.inline(
          "titleEditor",
          Object.assign(ckeditorConfig, {
            height: "100%"
          })
        );
        window.CKEDITOR.instances["titleEditor"].setData(
          this.process2ckeditor(this.subjectForm.title)
        );
        window.CKEDITOR.instances["titleEditor"].on("change", function(event) {
          vm.subjectForm.title = this.getData();
        });
        // answer
        if (
          this.subjectForm.tSubject != 1 &&
          this.subjectForm.tSubject != 2 &&
          this.subjectForm.tSubject != 3
        ) {
          window.CKEDITOR.inline(
            "answer",
            Object.assign(ckeditorConfig, {
              height: "100%"
            })
          );
          window.CKEDITOR.instances["answer"].setData(
            this.process2ckeditor(this.subjectForm.answer)
          );
          window.CKEDITOR.instances["answer"].on("change", function(event) {
            vm.subjectForm.answer = this.getData();
          });
        }
        // analyse
        window.CKEDITOR.inline(
          "analysisEditor",
          Object.assign(ckeditorConfig, {
            height: "100%"
          })
        );
        window.CKEDITOR.instances["analysisEditor"].setData(
          this.process2ckeditor(this.subjectForm.analyse)
        );
        window.CKEDITOR.instances["analysisEditor"].on("change", function(
          event
        ) {
          vm.subjectForm.analyse = this.getData();
        });
        // options
        for (let i = 0; i < this.subjectForm.answerList.length; i++) {
          let id = i + "Editor";
          let option = this.subjectForm.answerList[i];
          if (option.sDelFlag == 1) {
            window.CKEDITOR.inline(
              id,
              Object.assign(ckeditorConfig, {
                height: "100%"
              })
            );
            window.CKEDITOR.instances[id].setData(
              this.process2ckeditor(option.aText)
            );
            window.CKEDITOR.instances[id].on("change", function(event) {
              option.aText = this.getData();
            });
          }
        }
      });
    },
    // 添加题目 - 类型切换
    typeChange(value) {
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      if (this.subjectForm.id == 0) {
        if (value == 1) {
          this.subjectForm.answerList = [
            { aOption: "A", aText: "", sDelFlag: 1 },
            { aOption: "B", aText: "", sDelFlag: 1 }
          ];
        } else if (value == 2 || value == 3) {
          this.subjectForm.answerList = [
            { aOption: "A", aText: "", sDelFlag: 1 },
            { aOption: "B", aText: "", sDelFlag: 1 },
            { aOption: "C", aText: "", sDelFlag: 1 },
            { aOption: "D", aText: "", sDelFlag: 1 }
          ];
        } else {
          this.subjectForm.answerList = [];
        }
        this.renderCKEditor();
      }
    },
    // 删除选项
    deleteOption(option) {
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      if (option.sbaId > 0) {
        option.sDelFlag = 2;
      } else {
        this.subjectForm.answerList.splice(
          this.subjectForm.answerList.indexOf(option),
          1
        );
      }
      let num = 65; // 'A'
      for (let i = 0; i < this.subjectForm.answerList.length; i++) {
        let option = this.subjectForm.answerList[i];
        if (option.sDelFlag === 1) {
          let op = String.fromCharCode(num++);
          option.aOption = op;
        }
      }
    },
    // 添加选项
    addOption() {
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      let num = 65;
      for (let i = 0; i < this.subjectForm.answerList.length; i++) {
        let option = this.subjectForm.answerList[i];
        if (option.sDelFlag === 1) {
          num++;
        }
      }
      let op = String.fromCharCode(num++);
      let option = {
        aOption: op,
        aText: "",
        sDelFlag: 1,
        isCorrect: 1
      };
      this.subjectForm.answerList.push(option);
      let id = this.subjectForm.answerList.length - 1 + "Editor";
      if (window.CKEDITOR.instances[id]) {
        window.CKEDITOR.instances[id].destroy();
      }
      this.$nextTick(() => {
        window.CKEDITOR.inline(
          id,
          Object.assign(ckeditorConfig, {
            height: "100%"
          })
        );
        window.CKEDITOR.instances[id].on("change", function(event) {
          option.aText = this.getData();
        });
      });
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
    //处理题目状态
    handleStatus(row) {
      let status = 0;
      if (row.status == 0 || row.status == 1) {
        status = 2;
      } else if (row.status == 2) {
        status = 0;
      }
      axios
        .request({
          method: "post",
          url: "/subject/subjectBank/updateStatus",
          data: {
            id: row.id,
            status: status
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            row.status = status;
            this.$message({
              message: "操作成功！",
              type: "success"
            });
          } else {
            this.$message({
              message: ret.msg,
              type: "warning"
            });
          }
        });
    },
    //批量处理题目状态
    handleChangeStatus(row) {
      let ids = "";
      let status = 2;
      this.selectedSubjects.forEach(element => {
        ids += `${element.id},`;
      });
      if (row == 1) {
        //启用
        status = 2;
      } else {
        //停用
        status = 0;
      }
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/updateStatus",
          data: {
            ids: ids,
            status: status
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadSubjects();
            this.$message({
              message: ret.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: ret.msg,
              type: "warning"
            });
          }
        });
    },
    //删除
    handleDel(row) {
      let slsIds = "";
      if (row) {
        slsIds = row.slsId;
      } else {
        this.selectedSubjects.forEach(element => {
          slsIds += `${element.slsId},`;
        });
      }
      this.$confirm("确认要删除所选题目吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/subject/subjectBankLibrary/deleteCommon",
              data: {
                slsIds: slsIds
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                if (
                  this.page.currentPage != 1 &&
                  (this.subjects.length == 1 ||
                    this.subjects.length == this.selectedSubjects.length)
                ) {
                  this.page.currentPage--;
                }
                this.$refs.subjectsTable.clearSelection();
                this.loadSubjects();
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
        })
        .catch(() => {});
    },
    // 查看附属题目
    showSubList(row) {
      const { href } = this.$router.resolve({
        path: "/tiku/sonList",
        query: {
          id: row.id
        }
      });
      window.open(href, "_blank");
    },
    process2ckeditor(content) {
      if (content === undefined) return "";
      var imgReg = /<img.*?class=('|")lazy('|").*?(?:>|\/>)/gi;
      var srcReg = /data-original=[\'\"]?([^\'\"]*)[\'\"]?/i;
      var arr = content.match(imgReg);
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          var src = arr[i].match(srcReg);
          if (src.length >= 2) {
            content = content.replace(arr[i], "<img src='" + src[1] + "' />");
          }
        }
      }
      content = content.replace("&/g", "&amp;");
      if (content.indexOf("math-tex") == -1) {
        content = content.replace(/(\$.*?\$)/g, function(match, p1) {
          return '<span class="math-tex">' + p1 + "</span>";
        });
      }
      return content;
    },
    process2save(content) {
      if (content === undefined) return "";
      var imgReg = /<img.*?(?:>|\/>)/gi;
      var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      var arr = content.match(imgReg);
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          var src = arr[i].match(srcReg);
          if (src.length >= 2) {
            content = content.replace(
              arr[i],
              "<img class='lazy' data-original='" + src[1] + "' />"
            );
          }
        }
      }
      return content;
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
  }
};
</script>
