<template>
  <el-container class="selectTimu">
    <div class="left-container">
      <div class="left-header">题目商场</div>
      <!-- <el-tree
        icon-class="el-icon-arrow-right"
        :data="classifyList"
        :expand-on-click-node="false"
        :props="defaultProps"
        accordion
        @node-click="handleNodeClick"
      >
      </el-tree> -->
      <div style="height:738px;overflow-y:auto">
        <el-menu
          :default-openeds="defaultOpen"
          :default-active="String(defaultActive)"
        >
          <el-submenu
            v-for="subject in banks"
            :key="subject.subjectId"
            :index="String(subject.subjectId)"
          >
            <template slot="title">
              <div :title="subject.name">{{ subject.name }}</div>
            </template>
            <el-menu-item
              v-for="sbl in subject.children"
              :key="sbl.sblId"
              :index="String(sbl.sblId)"
              @click="selectBank(sbl)"
              :title="sbl.name"
              >{{ sbl.name }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <el-main class="right-container">
      <!-- <div style="margin-bottom:13px;">
        <el-input
          size="small"
          placeholder="全库搜索题目"
          v-model="form.title"
          style="width: 200px;"
          @keyup.enter.native="onSearch"
        ></el-input>
        <el-button
          size="small"
          type="primary"
          @click="onSearch"
          class="el-icon-search"
        ></el-button>
      </div> -->
      <div style="background:white;padding:13px">
        <div class="right-header">
          <el-form v-model="form" :inline="true" size="small">
            <el-form-item>
              <el-tree-select
                :disabled="selectParams.disabled"
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
                  v-for="type in types"
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
                placeholder="难度"
                @change="paramChange"
              >
                <el-option
                  v-for="diff in diffs"
                  :key="diff.type"
                  :label="diff.name"
                  :value="diff.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <div style="margin-bottom:13px;">
                <el-input
                  size="small"
                  placeholder="全库搜索题目"
                  v-model="form.title"
                  style="width: 200px;"
                  @keyup.enter.native="onSearch"
                ></el-input>
                <el-button
                  size="small"
                  type="primary"
                  @click="onSearch"
                  class="el-icon-search"
                ></el-button>
              </div>
            </el-form-item>
          </el-form>
          <div>
            <el-button
              size="small"
              @click="handleGet()"
              style="border-radius:5px; border:solid 1px #2BA1F4;color:#2BA1F4"
              >获取</el-button
            >
          </div>
        </div>
        <el-table
          v-loading="loading.subjectsList"
          ref="subjectsTable"
          :data="subjects"
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
          <!-- <el-table-column label="标签" prop="uniqueId" align="center" width="130px"></el-table-column> -->
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
          <el-table-column
            label="日期"
            prop="createTime"
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
                @click="report(scope.$index, scope.row)"
                >纠错</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="subjects.length" class="right-footer-first">
            从{{ (page - 1) * pageSize + 1 }}到{{
              (page - 1) * pageSize + subjects.length
            }}记录，共{{ total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :page-sizes="[10, 30, 50]"
            :total="total"
            :page-size="pageSize"
            @size-change="handleSizeChange"
            :current-page.sync="page"
            background
            @current-change="loadSubjects"
          ></el-pagination>
        </div>
      </div>
    </el-main>
    <jd-dialog
      title="题目预览"
      :noFooter="true"
      :visible.sync="shwoPreviewDialog"
      width="800px"
    >
      <preview
        slot="body"
        :data="previewSubject"
        style="height:400px;overflow-y: auto"
      ></preview>
      <el-button
        slot="my-footer"
        size="small"
        type="primary"
        @click="getDirect(previewSubject)"
        >获取</el-button
      >
    </jd-dialog>
    <jd-dialog
      title="获取题目"
      :loading="loading.obtainSubjects"
      :visible.sync="showObtainSubjectsDialog"
      @sure="obtainSubjects"
      class="getModal"
    >
      <template slot="body">
        <ul>
          <li>
            获取到库:<span>{{ moveToLib }}</span>
          </li>
          <li v-if="isOffice == 1">
            <el-tree
              v-loading="loading.bankList"
              ref="getLibTree"
              :data="getLibDatas"
              :props="treeMap"
              highlight-current
              node-key="id"
              :expand-on-click-node="false"
              icon-class="el-icon-arrow-right"
              @node-click="selectDestinationItem"
            >
              <span slot-scope="{ node }">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </li>
          <li v-else>
            <el-tree
              v-loading="loading.bankList"
              ref="getLibTree"
              :data="getLibDatas"
              :props="treeMap"
              :expand-on-click-node="false"
              highlight-current
              node-key="id"
              icon-class="el-icon-arrow-right"
              @node-click="selectDestinationItem"
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <span :title="node.label">{{ node.label }}</span>
              </span>
            </el-tree>
          </li>
        </ul>
      </template>
    </jd-dialog>
    <jd-dialog
      title="纠错与举报"
      v-if="showReportDialog"
      :loading="loading.feedback"
      :visible.sync="showReportDialog"
      @sure="reportSure"
    >
      <template slot="body">
        <div style="margin:0 5%">
          <div style="margin-bottom:10px;color:#333;font-size:15px">
            你觉得这个资源有什么问题？
          </div>
          <el-radio-group
            v-model="reportType"
            style="margin-top:10px;margin-bottom:20px;color:#333;font-size:13px;"
          >
            <el-radio style="margin-bottom:10px" label="6">内容有误</el-radio>
            <el-radio style="margin-bottom:10px" label="7">违法违禁</el-radio>
            <el-radio style="margin-bottom:10px" label="8"
              >抄袭我的资源</el-radio
            >
            <el-radio style="margin-bottom:10px" label="5">有其他问题</el-radio>
          </el-radio-group>
          <div style="color:#2BA1F4;font-size:13px;">
            为了帮助审核人员更快处理，请详细描述问题*
          </div>
          <div class="jc-pic">
            <el-input
              :rows="6"
              resize="none"
              type="textarea"
              v-model="reportDes"
            ></el-input>
            <el-upload
              :multiple="false"
              :with-credentials="true"
              class="avatar-uploader"
              :auto-upload="false"
              :on-change="onChange"
              :http-request="uploadSectionFile1"
              action=""
              :show-file-list="false"
            >
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <!-- <textarea
              placeholder=""
              v-model="reportDes"
              style="margin-top:10px;width:100%;border-radius:5px;border-color:#ccc;height:100px;padding:5px 15px;"
            ></textarea> -->
          </div>
        </div>
      </template>
    </jd-dialog>
  </el-container>
</template>

<style lang="scss">
.selectTimu {
  margin: 22px 23px;
  .jc-pic {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    padding-left: 2px;
    margin-top: 10px;
    .el-textarea__inner {
      border: none;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .left-container {
    max-width: 182px;
    min-width: 250px;
    border-radius: 4px;
    max-height: 800px;
    background: #ffffff;
    overflow: hidden;
    .left-header {
      background: #2ba1f4;
      height: 46px;
      line-height: 46px;
      padding-left: 20px;
      padding-right: 28px;
      color: white;
      font-size: 16px;
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
      padding-right: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
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
  .right-container {
    padding: 0px;
    border-radius: 4px;
    overflow: hidden;
    margin-left: 15px;
  }
  .right-header {
    display: flex;
    justify-content: space-between;
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
  // 移动弹框
  .getModal {
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
import math from "@/components/jmath";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
import preview from "./previewSubject";
export default {
  name: "CommonTiku",
  components: {
    "jd-dialog": jdialog,
    "jd-math": math,
    ElTreeSelect,
    preview
  },
  data() {
    return {
      file: null,
      imgUrl: "",
      isOffice: this.$store.state.user.currentRole.roleType,
      banks: [],
      classifyList: [], // 左侧树状分类列表
      defaultProps: {
        children: "children",
        label: "sblName"
      },
      defaultOpen: [],
      defaultActive: 0,
      currentSbl: {},
      page: 1,
      pageSize: 10,
      // 题目总数
      total: 0,
      subjects: [],
      types: common.allTypes,
      diffs: common.allRateLevel,
      // 将要预览的题目
      previewSubject: {},
      shwoPreviewDialog: false,
      // 当前页选中的题目
      selectedSubjects: [],
      form: {
        tips: "",
        tSubject: "",
        difficultyLevel: "",
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
      showObtainSubjectsDialog: false,
      moveToLib: "",
      getLibDatas: [],
      treeMap: {
        children: "children",
        label: "sblName"
      },
      currentRow: {},
      // 题目报错
      showReportDialog: false,
      // 错误类型
      reportType: "",
      // 错误描述
      reportDes: "",
      // 报错题目
      reportSubject: {},
      // loading
      loading: {
        bankList: false,
        subjectsList: false,
        feedback: false,
        obtainSubjects: false
      }
    };
  },
  mounted() {
    this.loadBanks();
    // this.loadClassifyList();
  },
  methods: {
    onChange(file, fileList) {
      let isPic = file.raw.type.includes("image");
      if (!isPic) {
        this.$message({
          type: "warning",
          message: "只支持上传图片"
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = event => {
        console.log(event);
        this.imgUrl = event.target.result;
      };
      reader.readAsDataURL(file.raw);
      this.file = file.raw;
      console.log(file, fileList);
    },
    uploadSectionFile1(params) {
      this.teacherFile = params.file;
      const form = new FormData();
      // 文件对象
      form.append("file", params.file);
      axios
        .request({
          method: "post",
          url: "/openccourse/openDiscuss/uploadImage",
          data: form
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.imgUrl = ret.data;
          }
        });
    },
    // handleNodeClick(data) {
    //   console.log(data);
    //   if (data.labelId) {
    //     // 点击大分类
    //   } else {
    //     this.currentSbl = data;
    //     this.loadSubjects();
    //     this.loadTips();
    //   }
    // },
    // 获取机构题库
    loadOrgLibs() {
      axios
        .request({
          method: "post",
          url: "/v1/subjectBankLibrary/getTKSubjectList"
        })
        .then(
          function(data) {
            this.loading.bankList = false;
            let res = data.data;
            if (res.code == 200) {
              this.getLibDatas = res.data;
            }
          }.bind(this)
        )
        .catch(() => {
          this.loading.bankList = false;
        });
    },
    // 获取我的题库
    loadMyLibs() {
      axios
        .request({
          method: "post",
          url: "/subject/personalSubjectBankLibrary/list"
        })
        .then(
          function(data) {
            this.loading.bankList = false;
            let res = data.data;
            if (res.code == 200) {
              this.getLibDatas = res.data;
            }
          }.bind(this)
        )
        .catch(() => {
          this.loading.bankList = false;
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
                let first = this.banks[0].children[0];
                this.defaultOpen = [String(this.banks[0].subjectId)];
                if (first != undefined) {
                  this.currentSbl = first;
                  this.defaultActive = first.sblId;
                  this.loadSubjects();
                  this.loadTips();
                }
              }
            }
          }.bind(this)
        );
    },
    // 获取公共题库列表new
    // loadClassifyList() {
    //   axios
    //     .request({
    //       method: "post",
    //       url: "/subject/subjectBankLibrary/commonList"
    //     })
    //     .then(res => {
    //       let ret = res.data;
    //       if (ret.code === 200) {
    //         this.classifyList = this.getTargetArr(ret.data);
    //         console.log(this.getTargetArr(ret.data));
    //         this.loadSubjects();
    //       }
    //     });
    // },
    getTargetArr(arr) {
      let targetArr = [];
      arr.map(mapItem => {
        if (targetArr.length == 0) {
          targetArr.push({
            sblName: mapItem.sblSubjectName,
            children: [mapItem],
            labelId: mapItem.sblSubjectId
          });
        } else {
          let res = targetArr.some(item => {
            if (item.labelId == mapItem.sblSubjectId) {
              item.children.push(mapItem);
              return true;
            }
          });
          if (!res) {
            targetArr.push({
              sblName: mapItem.sblSubjectName,
              children: [mapItem],
              labelId: mapItem.sblSubjectId
            });
          }
        }
      });
      return targetArr;
    },
    // 获取知识点
    loadTips() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          // data: { courseId: this.currentSbl.sblCourseId }
          data: { courseId: this.currentSbl.bank.sblCourseId }
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
    // 点击题库条目
    selectBank(sbl) {
      this.$refs.subjectsTable.clearSelection();
      if (this.form.title.length || sbl.sblId != this.currentSbl.sblId) {
        this.form.title = "";
        this.form.tips = "";
        this.form.tSubject = "";
        this.form.difficultyLevel = "";
        this.currentSbl = sbl;
        this.page = 1;
        this.loadTips();
        this.loadSubjects();
      }
    },
    // 全库搜索
    onSearch() {
      this.paramChange();
    },
    //选择资源每页显示数据条数切换事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.loadSubjects();
    },
    paramChange() {
      this.page = 1;
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
      this.page = 1;
      this.loadSubjects();
    },
    // 题目列表
    loadSubjects() {
      let data = {};
      data.page = this.page;
      data.pagesize = this.pageSize;
      data.tSubject = this.form.tSubject;
      // data.difficultLevel = this.form.difficultyLevel;
      data.difficultRateLevel = this.form.difficultyLevel;
      data.libId = this.currentSbl.sblId;
      data.isShowStop = 1;
      if (this.form.title.length) {
        this.selectParams.disabled = true;
        data.keyWord = this.form.title;
      } else {
        this.selectParams.disabled = false;
        data.tip = this.form.tipsText;
      }
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
              this.total = res.data.total;
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
      return formatYMD(row.createTime);
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
      this.previewSubject = subject;
      this.shwoPreviewDialog = true;
    },
    // 题目选中状态发生变化
    selectChange(select) {
      this.selectedSubjects = select;
    },
    report(index, row) {
      this.reportSubject = row;
      this.reportType = "";
      this.reportDes = "";
      this.file = null;
      this.imgUrl = "";
      this.loading.feedback = false;
      this.showReportDialog = true;
    },
    // 题目纠错
    reportSure() {
      if (this.reportType.length == 0) {
        this.$message({
          message: "请选择错误类型",
          type: "warning"
        });
        return;
      }
      this.loading.feedback = true;
      let formData = new FormData();
      formData.append("type", 12);
      formData.append("content", `${this.reportDes}(${this.reportSubject.id})`);
      formData.append("sbId", this.reportSubject.id);
      formData.append("subTypes", this.reportType);
      if (this.file) {
        formData.append("file", this.file);
      }
      axios
        .request({
          method: "post",
          url: "/v1/subjectBank/feedbackTKExercise",
          data: formData
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.reportSubject.status = 1;
              this.showReportDialog = false;
            } else {
              this.loading.feedback = false;
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          }.bind(this)
        )
        .catch(() => {
          this.loading.feedback = false;
          this.$message({
            message: "服务器异常",
            type: "warning"
          });
        });
    },
    // 知识点搜索
    tipSearch(value) {
      if (this.$refs.treeSelect) {
        this.$refs.treeSelect.filterFun(value);
      }
    },
    // 目标题库 - 获取题目
    // 点击批量获取获取按钮
    handleGet() {
      if (this.selectedSubjects.length > 0) {
        this.currentRow = {};
        this.moveToLib = "";
        this.loading.obtainSubjects = false;
        this.loading.bankList = true;
        if (this.$store.state.user.currentRole.roleType === 1) {
          this.loadOrgLibs();
        } else {
          this.loadMyLibs();
        }
        this.showObtainSubjectsDialog = true;
      } else {
        this.$message({
          message: "请先勾选要获取的题目",
          type: "warning"
        });
      }
    },
    getDirect(data) {
      this.currentRow = data;
      this.moveToLib = "";
      this.loading.obtainSubjects = false;
      this.loading.bankList = true;
      if (this.$store.state.user.currentRole.roleType === 1) {
        this.loadOrgLibs();
      } else {
        this.loadMyLibs();
      }
      this.showObtainSubjectsDialog = true;
    },
    //列表中获取按钮
    handleGetOne(row) {
      this.currentRow = row;
      this.moveToLib = "";
      this.loading.obtainSubjects = false;
      this.loading.bankList = true;
      if (this.$store.state.user.currentRole.roleType === 1) {
        this.loadOrgLibs();
      } else {
        this.loadMyLibs();
      }
      this.showObtainSubjectsDialog = true;
    },
    selectDestinationItem(row) {
      this.moveToLib = row.sblName;
    },
    obtainSubjects() {
      let id = this.$refs.getLibTree.getCurrentKey();
      if (id) {
        if (this.isOffice == 1) {
          //获取到机构题库
          let sbsIds = "";
          if (this.currentRow.id) {
            sbsIds = this.currentRow.id;
          } else {
            this.selectedSubjects.forEach(element => {
              sbsIds += `${element.id},`;
            });
          }
          this.loading.obtainSubjects = true;
          axios
            .request({
              method: "post",
              url: "/v1/subjectBankLibrary/obtainExercisesToAimTK",
              data: { sbsIds: sbsIds, sblId: id }
            })
            .then(res => {
              this.loading.obtainSubjects = false;
              let ret = res.data;
              if (ret.code == 200) {
                this.showObtainSubjectsDialog = false;
                this.bus.$emit("botainSuccess", id);
                this.$message({
                  message: "获取成功，请到机构题库中查看",
                  type: "success"
                });
              } else {
                this.$message({
                  message: ret.msg,
                  type: "warning"
                });
              }
            });
        } else {
          //获取到我的题库
          let slsIds = "";
          if (this.currentRow.slsId) {
            slsIds = this.currentRow.slsId;
          } else {
            this.selectedSubjects.forEach(element => {
              slsIds += `${element.slsId},`;
            });
          }
          this.loading.obtainSubjects = true;
          axios
            .request({
              method: "post",
              url: "/subject/subjectBankLibrary/copyTo",
              data: {
                slsIds,
                libId: id,
                sourceLibId:
                  this.currentRow.slsSblId || this.selectedSubjects[0].slsSblId
              }
            })
            .then(res => {
              let ret = res.data;
              this.showObtainSubjectsDialog = false;
              this.bus.$emit("botainSuccess", id);
              this.$message({
                type: "success",
                message: ret.msg
              });
            });
        }
      } else {
        this.$message({
          message: "请选择目标题库",
          type: "warning"
        });
      }
    }
  }
};
</script>
