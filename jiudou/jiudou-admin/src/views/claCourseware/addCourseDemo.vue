<template>
  <div class="addTestTask-exercise">
    <div>
      <el-container>
        <el-main>
          <span>选择题目-已选{{ selectedTest.length }}题</span>

          <!-- <el-form v-if="selectedTest.length > 0">
            <el-form-item>
            </el-form-item>
          </el-form> -->
          <el-form :inline="true" v-model="testSelectForm" size="small">
            <el-form-item label="题库">
              <el-select
                v-model="testSelectForm.rlType"
                @change="slTypeChange"
                style="width:100px;margin-left:28px;"
              >
                <el-option label="公共" value="0"></el-option>
                <el-option label="我的" value="1"></el-option>
                <el-option label="使用记录" value="2"></el-option>
                <el-option label="教材" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="testSelectForm.rlType == 0"
              style="width:200px;"
            >
              <el-select
                v-model="testSelectForm.comLib"
                @change="testComTkSearch"
                size="small"
              >
                <el-option
                  v-for="item in comTKList"
                  :key="item.id"
                  :label="item.sblName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="testSelectForm.rlType == 1"
              style="width:200px;"
            >
              <el-cascader
                v-model="testSelectForm.myLib"
                :options="myTKList"
                @change="testMyTkSearch"
                :props="myTkProps"
              ></el-cascader>
            </el-form-item>
            <el-form-item v-if="testSelectForm.rlType == 0">
              <el-tree-select
                @input="tipSelectChange"
                :styles="tipTreeStyle"
                :value="testSelectForm.tips"
                :selectParams="selectParams"
                :treeParams="treeParams"
                @searchFun="tipSearch"
                ref="comTreeSelect"
              />
            </el-form-item>
            <el-form-item style="width:200px" v-if="testSelectForm.rlType == 1">
              <el-select
                v-model="testSelectForm.tipText"
                filterable
                clearable
                placeholder="请选择知识点"
                size="small"
                @change="slTypeChange"
              >
                <el-option
                  v-for="item in myLibTip"
                  :key="item.tipText"
                  :label="item.tipText"
                  :value="item.tipText"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width:200px" v-if="testSelectForm.rlType == 3">
              <el-select
                @change="selectBookChange"
                v-model="bookId"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in bookList"
                  :key="index"
                  :label="item.textbookName"
                  :value="item.textbookId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题型" style="margin-left:15px;">
              <el-select
                v-model="testSelectForm.type"
                style="width:100px"
                placeholder="题型"
                @change="testSearch"
              >
                <el-option
                  v-for="type in allTypes"
                  :key="type.type"
                  :label="type.name"
                  :value="type.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="难度系数" style="margin-left:15px;">
              <el-select
                v-model="testSelectForm.diff"
                style="width:100px"
                placeholder="难度系数"
                @change="testSearch"
              >
                <el-option
                  v-for="diff in allDiffs"
                  :key="diff.type"
                  :label="diff.name"
                  :value="diff.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题目内容" style="display:block">
              <el-input
                placeholder="搜索题目"
                v-model="testSelectForm.keywords"
                @keyup.enter.native="testSearch"
                style="width:auto"
              ></el-input>
              <el-button
                type="primary"
                @click="testSearch"
                class="el-icon-search"
                style="margin-left:15px;"
              ></el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="testSelectList"
            stripe
            border
            v-loading="loading.testSelectLoading"
            @selection-change="changeSelect"
            :row-key="getRowKeys"
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
            <el-table-column
              label="ID"
              align="center"
              prop="id"
              width="90px"
            ></el-table-column>
            <el-table-column
              label="标签"
              prop="uniqueId"
              align="center"
              width="150px"
              v-if="roleId != 24"
            ></el-table-column>

            <el-table-column
              label="难度系数"
              prop="accuracyRate"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column label="知识点" align="center" width="250px">
              <template slot-scope="scope">
                <span v-html="scope.row.learnPort"></span>
              </template>
            </el-table-column>
            <el-table-column
              label="题型"
              align="center"
              prop="tSubject"
              :formatter="formatType"
              width="90px"
            ></el-table-column>
            <el-table-column label="题目" align="center" prop="briefTitle">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between">
                  <div
                    class="subject-title"
                    v-html="scope.row.briefTitle"
                  ></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="testSelectForm.rlType == 2"
              label="使用次数"
              align="center"
              prop="answerCounts"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="70px"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="preview(scope.row)"
                  >预览</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="tabelFooter">
            <div v-if="testSelectList.length" class="right-footer-first">
              从{{
                (testSelectPage.page - 1) * testSelectPage.pagesize + 1
              }}到{{
                (testSelectPage.page - 1) * testSelectPage.pagesize +
                  testSelectList.length
              }}记录，共{{ testSelectPage.total }}条
            </div>
            <div v-else class="right-footer-first" ref="footerCount">
              从0到0条记录，共0条
            </div>
            <el-pagination
              v-if="testSelectForm.rlType == 3"
              layout="prev, pager, next, jumper"
              :page-sizes="[10, 30, 50]"
              :total="testSelectPage.total"
              @size-change="handleSizeChange"
              :page-size="testSelectPage.pagesize"
              :current-page.sync="testSelectPage.page"
              background
              @current-change="loadBookTestList"
            >
            </el-pagination>
            <el-pagination
              v-else
              layout="prev, pager, next, jumper"
              :page-sizes="[10, 30, 50]"
              :total="testSelectPage.total"
              @size-change="handleSizeChange"
              :page-size="testSelectPage.pagesize"
              :current-page.sync="testSelectPage.page"
              background
              @current-change="loadSubjects"
            >
            </el-pagination>
          </div>
          <!-- <div class="bottomBtnBox">
        <el-button size="small" @click="doReturn">取消</el-button>
        <el-button size="small" @click="doAddTimuSure" style="width:120px"
          >确定</el-button
        >
      </div> -->
        </el-main>
        <!-- 预览 -->
        <el-dialog
          :visible.sync="isPreviewShow"
          :modal-append-to-body="false"
          :close-on-click-modal="false"
          :modal="false"
          width="800px"
        >
          <template slot="title">
            <div>
              <div></div>
              <div>题目预览</div>
            </div>
          </template>
          <preview
            :data="previewSubject"
            style="height:400px;overflow-y: auto"
          ></preview>
        </el-dialog>
      </el-container>
    </div>

    <div class="bottomBtnBox">
      <el-button size="small" @click="doAddTimuSure">确定</el-button>
      <!-- <el-button size="small" @click="doReturn">取消</el-button> -->
      <span class="cancelBtn" @click="doReturn">取消</span>
    </div>
  </div>
</template>

<style lang="scss">
.addTestTask-exercise {
  padding-left: 20px;
  .el-tag {
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .el-tag + .el-tag {
    margin-right: 10px;
  }
  .subject-title {
    text-align: left;
    padding-right: 15px;
    max-height: 23px;
    overflow: hidden;
  }
  .bottomBtnBox {
    position: fixed;
    bottom: 0;
    right: 10%;
    left: 0;
    background: rgba(43, 161, 244, 1);
    box-shadow: 0px 2px 16px 0px rgba(13, 67, 118, 0.2);
    height: 75px;
    line-height: 75px;
    z-index: 11;
    padding-right: 50px;
    .el-button {
      width: 100px;
      float: right;
      height: 40px;
      margin-right: 15px;
      margin-top: 15px;
      border-radius: 30px;
    }
    .cancelBtn {
      width: 100px;
      float: right;
      height: 40px;
      line-height: 40px;
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
  .timuList {
    list-style: none;
    padding-left: 10px;
    padding-right: 10px;
    margin: 0;
    li {
      margin-top: 10px;
      position: relative;
      padding: 20px 10px;
      cursor: pointer;
      margin-bottom: 0;
      .timuBtn {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        padding: 20px;
        display: none;
        .el-button {
          float: right;
          margin-left: 5px;
          // border-color: #2BA1F4;
        }
      }
    }
    .mouseLi {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 5px;
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
import preview from "../tiku/previewSubject";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
// import { format } from "@/utils/datetime";
// import importPreview from "@/components/importPreview";
export default {
  name: "addCourseTes",
  components: {
    preview,
    // importPreview,
    ElTreeSelect
  },
  props: {},
  data() {
    return {
      myTkProps: {
        checkStrictly: true,
        value: "id",
        label: "sblName",
        emitPath: false,
        expandTrigger: "hover"
      },
      bookList: [],
      bookId: 0,
      roleId: this.$store.state.user.currentRole.roleId,
      paperId: this.$route.query.paperId, // 是自测习题还是教材习题
      loading: {
        resLoading: false
      },
      comTKList: [], // 公共库列表
      currentComTk: {}, //选中的当前库
      myTKList: [], // 我的库列表
      myLibTip: [], // 我的库知识点
      allTypes: common.allTypes,
      allDiffs: common.allRateLevel,
      // 题目列表
      testSelectList: [],
      testSelectForm: {
        rlType: "0",
        myLib: "",
        comLib: "",
        type: "",
        diff: "",
        keywords: "",
        tips: "",
        tipText: "",
        comTipText: ""
      },
      testSelectPage: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      //知识点查询参数
      selectParams: {
        multiple: true,
        clearable: false,
        placeholder: "请选择知识点"
      },
      tipTreeStyle: {
        width: "130px"
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
      // 选中添加的题目
      selectedTest: [],
      isPreviewShow: false,
      previewSubject: {}
    };
  },
  mounted() {
    this.initComTkLib();
    this.initMyTkLib();
    this.loadSubjects();
    this.loadVerifiedList();
  },
  methods: {
    doReturn() {
      this.$emit("toCloseDrawer");
    },
    // 数组去重
    unique(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.id) && res.set(arr.id, 1));
    },
    // 添加题目确定事件
    doAddTimuSure() {
      if (this.selectedTest.length == 0) {
        this.$message({
          message: "请选择题目",
          type: "warning"
        });
        return;
      }
      // let ids = [];
      // this.selectedTest.forEach(element => {
      //   let obj = {};
      //   obj.bankId = String(element.id);
      //   obj.sblId = String(element.slsSblId);
      //   ids.push(obj);
      //   if (element.sonSubList && element.sonSubList.length > 0) {
      //     element.sonSubList.forEach(item => {
      //       let objSon = {};
      //       objSon.bankId = String(item.id);
      //       objSon.parentId = String(element.id);
      //       ids.push(objSon);
      //     });
      //   }
      // });
      this.$emit("addSuccess", this.selectedTest);
      this.doReturn();
    },
    doSure() {},
    loadBookTestList() {
      axios
        .request({
          method: "post",
          url: "/v1/bookSbLib/listWithCountBook",
          data: {
            textbookId: this.bookId,
            tSubject: this.testSelectForm.type,
            keyWord: this.testSelectForm.keywords,
            page: this.testSelectPage.page,
            pagesize: 10
          }
        })
        .then(data => {
          let ret = data.data;
          if (ret.code === 200) {
            this.testSelectList = ret.data.data;
            this.testSelectPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    loadVerifiedList() {
      axios
        .request({
          method: "post",
          url: "/book/v4/textbook/verifiedSubjectList"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.forEach(element => {
              if (element) {
                this.bookList.push(element);
              }
            });
            this.bookId = this.bookList[0].textbookId;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    selectBookChange(val) {
      this.bookId = val;
      this.loadBookTestList();
    },
    // 加载题目列表
    loadSubjects() {
      this.loading.testSelectLoading = true;
      let url = "/subject/subjectBankLibrary/itemsWithCount";
      let data = {};
      if (this.testSelectForm.type) {
        data.tSubject = parseInt(this.testSelectForm.type);
      }
      if (this.testSelectForm.diff) {
        // data.difficultLevel = parseInt(this.testSelectForm.diff);
        data.difficultRateLevel = parseInt(this.testSelectForm.diff);
      }
      data.keyWord = this.testSelectForm.keywords;
      if (this.testSelectForm.rlType == 1) {
        url = "/subject/personalSubjectBankLibrary/itemsWithCount";
        data.libId = this.testSelectForm.myLib;
        data.tip = this.testSelectForm.tipText;
      } else if (this.testSelectForm.rlType == 2) {
        // 使用记录
        url = "/subject/subjectBankLibrary/getSlsInfoWithSb4";
      } else {
        data.libId = this.testSelectForm.comLib;
        data.tip = this.testSelectForm.comTipText;
      }
      data.page = this.testSelectPage.page;
      data.pagesize = this.testSelectPage.pagesize;
      data.isShowStop = 1;
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(
          function(data) {
            this.loading.testSelectLoading = false;
            let res = data.data;
            if (res.code == 200) {
              this.testSelectList = res.data.data;
              this.testSelectPage.total = res.data.total;
            }
          }.bind(this)
        );
    },
    // 题目列表选中事件
    changeSelect(select) {
      this.selectedTest = select;
    },
    //题目查询
    testSearch() {
      this.testSelectPage.page = 1;
      this.loadSubjects();
    },
    slTypeChange() {
      this.testSelectPage.page = 1;
      if (this.testSelectForm.rlType == 3) {
        this.loadBookTestList();
      } else {
        this.loadSubjects();
      }
    },
    //选择题目每页显示数据条数切换事件
    handleSizeChange(val) {
      this.testSelectPage.pagesize = val;
      this.loadSubjects();
    },
    // 预览
    preview(row) {
      this.previewSubject = row;
      this.isPreviewShow = true;
    },
    getRowKeys(row) {
      return row.id;
    },
    //点击公共库查询知识点
    testComTkSearch() {
      if (this.testSelectForm.comLib) {
        this.currentComTk = this.comTKList.filter((item, i) => {
          return item.id == this.testSelectForm.comLib;
        });
        this.loadTips();
      } else {
        this.treeParams.data = [];
        this.$refs.comTreeSelect.treeDataUpdateFun(this.treeParams.data);
      }
      this.testSelectPage.page = 1;
      this.loadSubjects();
    },
    // 获取公共库知识点
    loadTips() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          data: { courseId: this.currentComTk[0].sblCourseId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.treeParams.data = res.data;
              if (res.data.length >= 0) {
                this.$refs.comTreeSelect.treeDataUpdateFun(res.data);
              }
            }
          }.bind(this)
        );
    },
    //点击我的库查询知识点
    testMyTkSearch() {
      this.loadMyLibTip();
      this.testSelectPage.page = 1;
      this.loadSubjects();
    },
    // 加载我的库知识点
    loadMyLibTip() {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/tips",
          data: { libId: this.testSelectForm.myLib }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.myLibTip = ret.data;
          }
        });
    },
    // 知识点筛选发生变化
    tipSelectChange(ids, labels) {
      this.testSelectForm.tips = ids;
      if (labels) {
        this.testSelectForm.comTipText = labels.join(",");
      } else {
        this.testSelectForm.comTipText = "";
      }
      this.page = 1;
      this.loadSubjects();
    },
    // 知识点搜索
    tipSearch(value) {
      this.$refs.comTreeSelect.filterFun(value);
    },
    // 类型
    formatType(row) {
      return common.typeFormat(row.tSubject);
    },
    // 难度
    formatDiff(row) {
      return common.diffFormat(row.difficultyLevel);
    },
    // 加载公共题库列表
    initComTkLib() {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/commonList"
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.comTKList = res.data;
              this.comTKList.unshift({
                sblName: "全部",
                id: ""
              });
            }
          }.bind(this)
        );
    },
    // 加载我的题库
    initMyTkLib() {
      axios
        .request({
          method: "post",
          url: "/subject/personalSubjectBankLibrary/list"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.myTKList = this.removeEmptyChildren(ret.data);
            // this.myTKList.unshift({
            //   sblName: "全部",
            //   id: ""
            // });
          }
        });
    },
    removeEmptyChildren(data) {
      if (Array.isArray(data)) {
        // 判断是否是数组
        return data.map(item => {
          if (item.children && item.children.length > 0) {
            item.children = this.removeEmptyChildren(item.children); // 递归遍历
          } else {
            delete item.children; // 删除空的children字段
          }
          return item;
        });
      } else if (typeof data === "object") {
        // 判断是否是对象
        if (data.children && data.children.length > 0) {
          data.children = this.removeEmptyChildren(data.children); // 递归遍历
        } else {
          delete data.children; // 删除空的children字段
        }
        return data;
      }
    }
  }
};
</script>
