<template>
  <div class="classSetting">
    <el-header height="50px">
      <span class="myClass" @click="backMyClass">我的班级</span
      ><i class="el-icon-arrow-right"></i
      ><span>{{ form.classId ? "班级设置" : "创建班级" }}</span>
    </el-header>
    <el-main>
      <div
        style="color:#333;font-size:16px;margin-right:27px;margin-bottom:18px;"
      >
        班级信息
      </div>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        size="small"
        label-width="65px"
      >
        <el-form-item label="班级：" prop="classname">
          <el-input v-model="form.classname"></el-input>
        </el-form-item>
        <el-form-item label="课程：" prop="coursename">
          <el-input v-model="form.coursename"></el-input>
        </el-form-item>
        <el-form-item label="学科：" prop="classSubjectId">
          <el-select v-model="form.classSubjectId">
            <el-option
              v-for="s in subjects"
              :key="s.id"
              :label="s.sname"
              :value="s.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教材：" prop="bundBookIds">
          <el-select multiple v-model="form.bundBookIds">
            <el-option
              v-for="(item, idx) in bookList"
              :key="idx"
              :label="item.textbookName"
              :value="item.textbookId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="云课：" prop="cCourseName">
          <span>{{ form.cCourseName }}</span>
          <el-button type="primary" @click="changeCCourse">{{
            form.cCourseUuid ? "修改班课" : "选择班课"
          }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="submit" type="primary" @click="save"
            >保存</el-button
          >
          <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <jdialog
      title="选择云课"
      :visible.sync="showDialog.selectCloudCourse"
      width="800px"
      @sure="ccSelectSure"
    >
      <template slot="body">
        <el-form size="small" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input
              placeholder="云课名称、ID"
              v-model="keyword"
              @keyup.enter.native="loadCCourse"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="loadCCourse"
            ></el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="importCourse">导入云课</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="createCCourse">新建班级云课</el-button>
          </el-form-item>
        </el-form>
        <el-table
          class="ccTable"
          ref="ccTable"
          :data="ccList"
          stripe
          border
          @selection-change="ccSelectChange"
          @current-change="ccCurrentChange"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column
            align="center"
            label="云课ID"
            prop="claCUUID"
          ></el-table-column>
          <el-table-column
            align="center"
            label="云课标题"
            prop="claCName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="老师"
            prop="claCTeacherName"
          ></el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="ccList.length" class="right-footer-first">
            从{{ (page - 1) * pageSize + 1 }}到{{
              (page - 1) * pageSize + ccList.length
            }}记录，共{{ total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="sizes, prev, pager, next, jumper"
            :page-sizes="[10, 30, 50]"
            :total="total"
            :page-size="pageSize"
            @size-change="handleSizeChange"
            :current-page.sync="page"
            background
            @current-change="loadCCourse"
          ></el-pagination>
        </div>
      </template>
    </jdialog>
    <!-- 导入云课 -->
    <el-dialog
      :visible.sync="isImportShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="1000px"
      class="importModal"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>选择云课</div>
        </div>
      </template>
      <el-input
        size="small"
        v-model="importKeyWord"
        placeholder="云课ID、云课标题、老师"
        style="width: 200px"
        @keyup.enter.native="loadImportData"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="loadImportData"
      ></el-button>
      <el-table
        :data="dataList"
        v-loading="loading.importTableLoading"
        style="margin-top:15px;"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column label="选择" align="center" width="60px">
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.ccourseId"
              v-model="importResRadio"
              @change="importResRadioData(scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          label="云课ID"
          prop="ccourseUuid"
          align="center"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          label="云课标题"
          prop="ccourseName"
          align="center"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          label="老师"
          prop="ccourseTeacherName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="价格"
          prop="ccoursePrice"
          align="center"
          :formatter="formatPrice"
        ></el-table-column>
        <el-table-column
          label="云课分类"
          prop="ccourseType"
          align="center"
          :formatter="formatCourseType"
        ></el-table-column>
        <!-- <el-table-column label="开课用户" align="center" width="300">
          <div slot-scope="scope" class="info">{{scope.row.creatorName}}({{scope.row.mobile}})</div>
        </el-table-column> -->
      </el-table>
      <div class="tabelFooter">
        <div class="right-footer-first">
          从
          {{ (this.importPage.currentPage - 1) * this.importPage.pagesize + 1 }}
          到
          {{
            (this.importPage.currentPage - 1) * this.importPage.pagesize +
              this.dataList.length
          }}
          记录，共 {{ importPage.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :total="importPage.total"
          :current-page.sync="importPage.currentPage"
          :page-size="importPage.pagesize"
          @current-change="loadImportData"
        ></el-pagination>
      </div>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.importLoadingSure"
          @click="doImport"
          >确定</el-button
        >
        <el-button size="small" @click="isImportShow = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.classSetting {
  .el-header {
    background: #ffffff;
    height: 50px;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
    .myClass {
      cursor: pointer;
      color: #2d66a0;
    }
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    padding: 32px;
    .el-form {
      width: 400px;
    }
  }
  .ccTable {
    thead {
      .el-table-column--selection {
        .cell {
          display: none;
        }
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import jdialog from "@/components/jdialog";
import common from "@/utils/common";
export default {
  components: {
    jdialog
  },
  data() {
    return {
      bookList: [], // 已验证教材
      form: {
        bundBookIds: []
      },
      subjects: [],
      rules: {
        classname: [
          { required: true, message: "请输入班级名称", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur"
          }
        ],
        coursename: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur"
          }
        ],
        classSubjectId: [
          { required: true, message: "请选择学科", trigger: "change" }
        ]
      },
      page: 1,
      pageSize: 10,
      total: 0,
      ccList: [],
      submit: false,
      showDialog: {
        selectCloudCourse: false
      },
      keyword: "",
      //导入云课参数
      loading: {
        importTableLoading: false,
        importLoadingSure: false
      },
      isImportShow: false,
      importKeyWord: "",
      importResRadio: "",
      currentRowCourse: {},
      dataList: [],
      importPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      }
    };
  },
  mounted() {
    let cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.loadBooks();
    if (cls) {
      // cls.bundBookIds = cls.bundBookId.split(",");
      this.form = cls;

      // 临时删除属性，防止表单立即验证
      if (this.form.classSubjectId == 0) delete this.form.classSubjectId;
    }
    this.loadSubjects();
  },
  methods: {
    unique(arr, key) {
      let map = new Map();
      arr.forEach((item, index) => {
        if (!map.has(item[key])) {
          map.set(item[key], item);
        }
      });
      return [...map.values()];
    },
    // 获取已验证教材
    loadBooks() {
      axios
        .request({
          method: "post",
          url: "/book/v4/textbook/verifiedSubjectList",
          data: {
            keyWord: "",
            pubId: "",
            isEditor: ""
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            this.bookList = res.data;

            let cls = JSON.parse(sessionStorage.getItem("currentClass"));
            if (cls.bundBookId) {
              this.bookList.push({
                textbookId: cls.bundBookId,
                textbookName: cls.bundBook
              });
            }
            // 去重
            this.bookList = this.unique(this.bookList, "textbookId");
          }
        });
    },
    backMyClass() {
      this.$router.go(-1);
    },
    ccSelectChange(val) {
      if (val.length > 1) {
        this.$refs.ccTable.clearSelection();
        this.$refs.ccTable.toggleRowSelection(val.pop());
      }
    },
    ccCurrentChange(val) {
      this.$refs.ccTable.toggleRowSelection(val);
    },
    changeCCourse() {
      this.showDialog.selectCloudCourse = true;
      this.page = 1;
      this.loadCCourse();
    },
    // 加载学科分类
    loadSubjects() {
      axios
        .request({
          method: "post",
          url: "/subject/subject/listAll"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.subjects = ret.data.sort((a, b) => a.id - b.id);
          }
        });
    },
    // 绑定云课
    ccSelectSure() {
      let array = this.$refs.ccTable.selection;
      if (array.length) {
        let cc = array[array.length - 1];
        this.form.cCourseName = cc.claCName;
        this.form.cCourseUuid = cc.claCUUID;
      } else {
        this.form.cCourseName = "";
        this.form.cCourseUuid = "";
      }
      this.showDialog.selectCloudCourse = false;
    },
    handleSizeChange(val) {
      this.page = 1;
      this.pageSize = val;
      this.loadCCourse();
    },
    loadCCourse() {
      axios
        .request({
          method: "post",
          url: "/v1/cCourse/selClaCList",
          data: {
            pageNum: this.page,
            pagesize: this.pageSize,
            searchWords: this.keyword
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200 && ret.data) {
            this.ccList = ret.data.data;
            this.total = ret.data.total;
            for (let i = 0; i < this.ccList.length; i++) {
              const cc = this.ccList[i];
              if (cc.claCUUID == this.form.cCourseUuid) {
                this.$nextTick(() => {
                  this.$refs.ccTable.toggleRowSelection(cc);
                });
                break;
              }
            }
          } else {
            this.ccList = [];
            this.total = 0;
          }
        });
    },
    //radio change选中行数据
    importResRadioData(row) {
      this.currentRowCourse = row;
    },
    //加载添加分类列表data
    loadImportData() {
      this.loading.importTableLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/cCourse/freeList",
          data: {
            page: this.importPage.currentPage,
            pageSize: this.importPage.pagesize,
            keyword: this.importKeyWord
          }
        })
        .then(res => {
          this.loading.importTableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.dataList = ret.data.data;
            this.importPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //导入云课
    importCourse() {
      this.importResRadio = "";
      this.importKeyWord = "";
      this.loadImportData();
      this.isImportShow = true;
    },
    //确定导入云课
    doImport() {
      if (!this.importResRadio) {
        this.$message({
          type: "warning",
          message: "请选择云课"
        });
        return;
      }
      this.loading.importLoadingSure = true;
      axios
        .request({
          method: "post",
          url: "/ccourse/v4/cCourse/copy2BCourse",
          data: {
            cCourseId: this.currentRowCourse.ccourseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.page = 1;
            this.loadCCourse();
            this.loading.importLoadingSure = false;
            this.isImportShow = false;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 新建班课
    createCCourse() {
      this.$router.push({
        name: "courseInfo",
        query: {
          newCourseType: 1
        }
      });
    },
    // 保存
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit = true;
          let cls = JSON.parse(sessionStorage.getItem("currentClass"));
          if (cls) {
            this.eidtClassInfo(cls);
          } else {
            this.createClass();
          }
        } else {
          return false;
        }
      });
    },
    // 新建班级
    createClass() {
      let subjectName = "";
      for (let i = 0; i < this.subjects.length; i++) {
        let s = this.subjects[i];
        if (s.id == this.form.classSubjectId) {
          subjectName = s.sname;
          break;
        }
      }
      let data = {
        className: this.form.classname,
        courseName: this.form.coursename,
        subjectId: this.form.classSubjectId,
        subjectName: subjectName,
        bundBookId: this.form.bundBookIds.join(",")
      };
      if (this.form.cCourseUuid) {
        data.cCourseUuid = this.form.cCourseUuid;
        data.cCourseName = this.form.cCourseName;
      }
      axios
        .request({
          method: "post",
          url: "/clazz/v4/clazz/createClass",
          data: data
        })
        .then(res => {
          this.submit = false;
          let ret = res.data;
          if (ret.code == 200) {
            sessionStorage.setItem("currentClass", JSON.stringify(ret.data));
            var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
            var cEvent = new CountEvent("create_class");
            window.JAnalyticsInterface.onEvent(cEvent);
            this.$router.push({
              path: "/class/classInfo"
            });
            this.$message({
              type: "success",
              message: "创建成功"
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 修改班级信息
    eidtClassInfo(cls) {
      for (let i = 0; i < this.subjects.length; i++) {
        let s = this.subjects[i];
        if (s.id == this.form.classSubjectId) {
          this.form.classSubjectName = s.sname;
          break;
        }
      }
      let data = {
        clazzId: this.form.classId,
        clazzName: this.form.classname,
        courseName: this.form.coursename,
        subjectId: this.form.classSubjectId,
        subjectName: this.form.classSubjectName,
        bundBookId: this.form.bundBookIds ? this.form.bundBookIds.join(",") : ""
      };
      if (this.form.cCourseUuid && this.form.cCourseUuid != cls.cCourseUuid) {
        data.cCourseUUID = this.form.cCourseUuid;
        data.cCourseName = this.form.cCourseName;
      }
      axios
        .request({
          method: "post",
          url: "/v1/clazz/updInfo",
          data: data
        })
        .then(res => {
          this.submit = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            sessionStorage.setItem("currentClass", JSON.stringify(this.form));
            this.$router.back();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 取消
    cancel() {
      this.$router.back();
    },
    // 云课类型
    formatCourseType(row) {
      return common.mathCourseType(row.ccourseType);
    },
    //云课价格类型
    formatPrice(row) {
      if (row) {
        if (row.ccoursePrice == 0) {
          return "免费";
        } else {
          return row.ccoursePrice / 100;
        }
      }
    }
  }
};
</script>
