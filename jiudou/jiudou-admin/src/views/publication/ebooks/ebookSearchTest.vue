<template>
  <el-container class="searchRes">
    <el-header height="50px">
      <span class="book" @click="toBook">电子书管理</span>
      <i class="el-icon-arrow-right"></i> <span>编辑电子书</span>
    </el-header>
    <el-main>
      <el-form style="margin-top:20px" v-if="selectedTest.length > 0">
        <el-form-item>
          <span>选择题目-已选{{ selectedTest.length }}题</span>
        </el-form-item>
      </el-form>
      <el-form :inline="true" v-model="testSelectForm" size="small">
        <el-form-item label="题库">
          <el-select
            v-model="testSelectForm.rlType"
            @change="slTypeChange"
            style="width:100px;margin-left:28px;"
          >
            <el-option label="公共" value="0"></el-option>
            <el-option label="机构" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="testSelectForm.rlType == 0" style="width:200px;">
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
        <el-form-item v-show="testSelectForm.rlType == 0">
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
        <el-form-item v-show="testSelectForm.rlType == 1" style="width:200px;">
          <el-tree-select
            ref="orgTestSelect"
            size="small"
            :value="testSelectForm.orgLib"
            :selectParams="orgTKParams"
            :treeParams="orgTKTreeParams"
            @node-click="orgTKSelected"
            @searchFun="orgTkSearch"
          />
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
        <el-form-item label="难度" style="margin-left:15px;">
          <el-select
            v-model="testSelectForm.diff"
            style="width:100px"
            placeholder="难度"
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
        ></el-table-column>
        <el-table-column
          label="难度"
          prop="difficultyLevel"
          align="center"
          width="60px"
          :formatter="formatDiff"
        ></el-table-column>
        <el-table-column
          label="知识点"
          align="center"
          width="150px"
          v-if="testSelectForm.rlType == 0"
        >
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
              <div class="subject-title" v-html="scope.row.briefTitle"></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="70px" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="preview(scope.row)"
              >预览</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="testSelectList.length" class="right-footer-first">
          从{{ (testSelectPage.page - 1) * testSelectPage.pagesize + 1 }}到{{
            (testSelectPage.page - 1) * testSelectPage.pagesize +
              testSelectList.length
          }}记录，共{{ testSelectPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="sizes, prev, pager, next, jumper"
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
      <div class="bottomBtnBox">
        <el-button size="small" @click="doReturn">取消</el-button>
        <el-button size="small" @click="pageSetShowWay">确定</el-button>
      </div>
    </el-main>
    <!-- 预览 -->
    <el-dialog
      :visible.sync="isPreviewShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>题目预览</div>
        </div>
      </template>
      <preview :data="previewSubject"></preview>
    </el-dialog>
    <!-- 确定提交 -->
    <el-dialog
      :visible.sync="pageSetShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="800px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>绑定页码</div>
        </div>
      </template>
      <el-table
        :data="selectedTest"
        stripe
        border
        max-height="450"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          label="ID"
          align="center"
          prop="id"
          width="80px"
        ></el-table-column>
        <!-- <el-table-column label="标签" prop="uniqueId" align="center" width="150px"></el-table-column> -->
        <el-table-column
          label="难度"
          prop="difficultyLevel"
          align="center"
          width="60px"
          :formatter="formatDiff"
        ></el-table-column>
        <el-table-column
          label="知识点"
          align="center"
          width="130px"
          v-if="testSelectForm.rlType == 0"
          show-overflow-tooltip
        >
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
        <el-table-column
          label="资源"
          align="center"
          prop="briefTitle"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="页码" align="center" width="100px">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.resPage"
              maxlength="5"
              show-word-limit
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doBindBookTest"
          >确定</el-button
        >
        <el-button size="small" @click="pageSetShow = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
import preview from "@/views/tiku/previewSubject";
export default {
  components: {
    ElTreeSelect,
    preview
  },
  data() {
    return {
      id: this.$route.query.id, //教材ID
      catalogId: this.$route.query.catalogid, // 章节ID
      turnType: this.$route.query.turnType, // 是自测习题还是教材习题
      loading: {
        resLoading: false
      },
      comTKList: [],
      currentComTk: {}, //选中的当前库
      // allTypes: common.allTypes,
      allTypes: [],
      allDiffs: common.allDiffs,
      // 题目列表
      testSelectList: [],
      testSelectForm: {
        rlType: "0",
        orgLib: "",
        comLib: "",
        type: "",
        diff: "",
        keywords: "",
        tips: "",
        tipsText: ""
      },
      testSelectPage: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      orgTKTreeParams: {
        clickParent: true,
        filterable: true,
        "default-expand-all": true,
        "expand-on-click-node": false,
        data: [],
        props: {
          children: "children",
          label: "sblName",
          value: "id"
        }
      },
      orgTKParams: {
        multiple: false,
        clearable: true,
        placeholder: "请选择题库"
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
      previewSubject: {},
      pageSetShow: false
    };
  },
  methods: {
    toBook() {
      this.$router.push({
        name: "ebooks"
      });
    },
    // 加载题目列表
    loadSubjects() {
      this.loading.testSelectLoading = true;
      let url = "/subject/subjectBankLibrary/itemsWithCount";
      let data = {
        tSubject: this.testSelectForm.type,
        page: this.testSelectPage.page,
        pagesize: this.testSelectPage.pagesize
      };
      if (this.testSelectForm.rlType == 1) {
        url = "/v1/subjectBank/getTKExercisesByPage";
        data.difficultyLevel = this.testSelectForm.diff;
        data.title = this.testSelectForm.keywords;
        data.sblId = this.testSelectForm.orgLib;
      } else {
        data.keyWord = this.testSelectForm.keywords;
        data.libId = this.testSelectForm.comLib;
        data.tip = this.testSelectForm.tipsText;
        data.difficultLevel = this.testSelectForm.diff;
        data.isShowStop = 1;
      }
      if (this.turnType == 2) {
        // data.needObjective = 2
      }
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
      this.selectedTest = [];
      select.forEach(element => {
        let obj = {};
        obj.id = element.id;
        obj.difficultyLevel = element.difficultyLevel;
        obj.learnPort = element.learnPort;
        obj.tSubject = element.tSubject;
        obj.briefTitle = element.briefTitle;
        obj.resPage = "";
        this.selectedTest.push(obj);
      });
    },
    //题目查询
    testSearch() {
      this.testSelectPage.page = 1;
      this.loadSubjects();
    },
    orgTKSelected(data) {
      this.testSelectForm.orgLib = data.id;
      this.testSelectPage.page = 1;
      this.loadSubjects();
    },
    slTypeChange(row) {
      if (row == 1) {
        this.initOrgTkLib();
      } else {
        this.testSelectForm.comLib = "";
        this.treeParams.data = [];
        this.$nextTick(() => {
          this.$refs.comTreeSelect.treeDataUpdateFun([]);
        });
        this.testSelectForm.tips = "";
      }
      this.testSelectPage.page = 1;
      this.loadSubjects();
    },
    //树状下拉机构资源查找按钮
    orgTkSearch(value) {
      this.$refs.orgTestSelect.filterFun(value);
    },
    pageSetShowWay() {
      this.pageSetShow = true;
    },
    // 添加题目确定事件
    doBindBookTest() {
      if (this.selectedTest.length == 0) {
        this.$message({
          message: "请选择题目",
          type: "warning"
        });
        return;
      }
      let ids = [];
      let flag = true;
      this.selectedTest.forEach(element => {
        if (element.resPage === "") {
          flag = false;
        }
        ids.push({ sbid: element.id, type: 1, page: element.resPage });
      });
      if (!flag) {
        this.$message({
          type: "warning",
          message: "页码不能为空"
        });
        return;
      }
      let url = "/ebook/ebCatSb/ebookBingSubject";
      if (this.turnType == 3) {
        url = "/v1/bookSbLib/addSbFromLibrary";
      }
      console.log(ids);
      axios
        .request({
          method: "post",
          url: url,
          data: {
            subjectJson: JSON.stringify(ids),
            bookid: this.id,
            catalogid: this.catalogId
          }
        })
        .then(res => {
          let ret = res.data;
          this.$message({
            type: "warning",
            message: ret.msg
          });
          if (ret.code == 200) {
            this.doReturn();
          }
        });
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
    // 获取知识点
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
    // 知识点筛选发生变化
    tipSelectChange(ids, labels) {
      this.testSelectForm.tips = ids;
      if (labels) {
        this.testSelectForm.tipsText = labels.join(",");
      } else {
        this.testSelectForm.tipsText = "";
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
    // 点击取消返回教材bookinfo界面
    doReturn() {
      this.$router.push({
        path: "/publication/ebookInfo",
        query: {
          id: this.id,
          returnType: 2, //1是返回扫码资源 2是返回自测习题 3是返回教材习题
          returnCatalogId: this.catalogId
        }
      });
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
                sblId: ""
              });
            }
          }.bind(this)
        );
    },
    // 加载机构题库
    initOrgTkLib() {
      axios
        .request({
          method: "post",
          url: "/v1/subjectBankLibrary/getTKSubjectList"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.orgTKTreeParams.data = ret.data;
            if (this.$refs.orgTestSelect) {
              this.$refs.orgTestSelect.treeDataUpdateFun(ret.data);
            }
          }
        });
    }
  },
  mounted() {
    this.initComTkLib();
    // this.initOrgTkLib()
    this.loadSubjects();
    this.allTypes = common.allTypes;
    // if(this.turnType == 2) {
    //   this.allTypes = [{type: '', name: '全部'}, {type: '2', name: '单选题'}, {type: '1', name: '判断题'}, {type: '3', name: '多选题'}]
    // }else{
    //   this.allTypes = common.allTypes
    // }
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
    .subject-title {
      text-align: left;
      max-height: 23px;
      overflow: hidden;
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
</style>
