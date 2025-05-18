<template>
  <el-main class="sonList" v-loading="loading.subjectInfo">
    <div class="header">
      <!-- <el-form v-model="form" :inline="true" size="small">
        <el-form-item>
          <el-input placeholder="请输入题目内容" v-model="form.keywords"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" class="el-icon-search"></el-button>
        </el-form-item>
      </el-form> -->
      <div style="font-size: 16px; color: #333333;">
        {{ formatType(subject.tSubject) }}
      </div>
      <div>
        <el-button
          v-if="subjectsSelected.length > 0"
          size="small"
          type="primary"
          style="border-radius:5px"
          @click="deleteSubjects"
          >删除</el-button
        >
        <el-button
          v-if="selectable()"
          size="small"
          type="primary"
          style="border-radius:5px"
          @click="addSubject"
          >添加</el-button
        >
      </div>
    </div>
    <div class="tableContainer">
      <div class="title">
        <div style="font-size: 14px; color: #333333; font-weight: 600;">
          题目详情
        </div>
        <div class="detail">
          <jd-math :data="subject.title"></jd-math>
        </div>
      </div>
      <el-table
        ref="subjectsTable"
        :data="subject.sonSubList"
        stripe
        border
        @selection-change="selectChange"
      >
        <el-table-column
          type="selection"
          align="center"
          :selectable="selectable"
        ></el-table-column>
        <el-table-column
          label="题型"
          prop="tSubject"
          align="center"
          width="120px"
        >
          <template slot-scope="scope">
            {{ formatType(scope.row.tSubject) }}
          </template>
        </el-table-column>
        <el-table-column
          label="难度"
          prop="difficultyLevel"
          align="center"
          width="120px"
          :formatter="formatDiff"
        ></el-table-column>
        <el-table-column label="题目内容" align="center">
          <template slot-scope="scope">
            <div style="display:flex;justify-content:space-between">
              <div class="subject-title">
                {{ subject.sonSubList[scope.$index].briefTitle }}
              </div>
              <el-button
                size="mini"
                type="text"
                @click="preview(subject.sonSubList[scope.$index])"
                >预览</el-button
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="导入时间"
          prop="createTime"
          align="center"
          width="200px"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button
              v-if="selectable(scope.row)"
              size="mini"
              type="text"
              @click="editSubject(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="selectable(scope.row)"
              size="mini"
              type="text"
              @click="deleteSubject(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="subject.sonSubList.length > 0" class="right-footer-first">
          从{{ (page - 1) * pageSize + 1 }}到{{
            (page - 1) * pageSize + subject.sonSubList.length
          }}记录，共{{ total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page.sync="page"
          background
        ></el-pagination>
      </div>
    </div>
    <jd-dialog title="题目预览" :noFooter="true" :visible.sync="previewDialog">
      <preview slot="body" :data="previewSubject"></preview>
    </jd-dialog>
    <jd-dialog
      :loading="loading.addSubject"
      :title="subjectForm.slsId > 0 ? '编辑题目' : '添加题目'"
      :visible.sync="showAddSubjectDialog"
      :close_on_click_modal="false"
      @sure="addSubjectSure()"
    >
      <template slot="body">
        <el-form
          :model="subjectForm"
          size="small"
          label-width="70px"
          :inline="true"
          ref="addSubject"
          :rules="subjectFormRules"
        >
          <el-form-item label="标签" class="add-subject-form-item">
            <el-input
              placeholder="例:DXWL12345678"
              style="width:58%"
              v-model="subjectForm.uniqueId"
            ></el-input>
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
          <el-form-item label="解析" class="add-subject-form-item">
            <textarea id="analysisEditor"></textarea>
          </el-form-item>
        </el-form>
      </template>
    </jd-dialog>
  </el-main>
</template>

<style lang="scss">
.sonList {
  .header {
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
    padding: 14px 21px;
    border-radius: 5px;
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px;
    }
  }
  .tableContainer {
    background: white;
    padding: 14px 21px;
    border-radius: 5px;
    height: 630px;
    overflow-y: auto;
    .detail {
      padding: 8px;
      text-align: justify;
      word-break: break-all;
      margin-bottom: 30px;
      font-size: 14px;
      color: #333333;
    }
    .subject-title {
      text-align: left;
      padding-right: 15px;
      max-height: 23px;
      overflow: hidden;
    }
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
  .el-table .el-button {
    padding: 3px;
    margin: 0;
    color: #2d66a0;
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { format } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
import math from "@/components/jmath";
import ckeditorConfig from "@/config/ckeditor_config.js";
import preview from "./previewSubject";
export default {
  components: {
    "jd-dialog": jdialog,
    "jd-math": math,
    preview
  },
  data() {
    // var validateTitle = (rule, value, callback) => {
    //   if (!this.subjectForm.title) {
    //     return callback(new Error('题目内容不能为空'))
    //   } else {
    //     callback()
    //   }
    // };
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
      slsId: this.$route.query.id,
      sblId: "",
      form: {
        keywords: ""
      },
      subject: {
        title: "",
        sonSubList: []
      },
      // loading
      loading: {
        subjectInfo: false,
        addSubject: false
      },
      total: 0,
      pageSize: 10,
      page: 1,
      // 将要预览的题目
      previewSubject: "",
      // 是否显示题目预览弹窗
      previewDialog: false,
      // 题目表单
      subjectForm: {
        id: 0,
        slsId: 0,
        uniqueId: "",
        tSubject: "2",
        difficultyLevel: "2",
        title: "",
        analyse: "",
        answerList: [
          { aOption: "A", aText: "" },
          { aOption: "B", aText: "" },
          { aOption: "C", aText: "" },
          { aOption: "D", aText: "" }
        ]
      },
      // 题目表单验证规则
      subjectFormRules: {
        // title: [
        //   {validator: validateTitle, required: true, trigger: 'blur'},
        // ],
        answerList: [
          { validator: validateOptions, required: true, trigger: "blur" }
        ]
      },
      types: common.types,
      diffs: common.diffs,
      // 添加题目弹窗
      showAddSubjectDialog: false,
      checked: [],
      subjectsSelected: []
    };
  },
  mounted() {
    this.loadInfo();
  },
  methods: {
    // 加载题目详情
    loadInfo() {
      this.loading.subjectInfo = true;
      axios
        .request({
          method: "post",
          url: "/subject/subjectBank/queryInfoById",
          data: { id: this.slsId }
        })
        .then(
          function(res) {
            this.loading.subjectInfo = false;
            let data = res.data;
            if (data.code == 200) {
              this.subject = data.data;
              this.total = this.subject.sonSubList.length;
              this.pageSize = this.subject.sonSubList.length;
            }
          }.bind(this)
        );
    },
    // 预览
    preview(subject) {
      this.previewSubject = subject;
      this.previewDialog = true;
    },
    // 搜索
    onSearch() {},
    deleteSubjects() {
      let slsIds = [];
      this.subjectsSelected.forEach(element => {
        slsIds.push(element.id);
      });
      this.deleteSure(slsIds.join(","));
    },
    // 删除题目
    deleteSubject(row) {
      this.deleteSure(row.id);
    },
    deleteSure(ids) {
      this.$confirm("题目删除后不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios
          .request({
            method: "post",
            url: "/v1/subjectBank/delSbsByIds",
            data: { sbsIds: ids }
          })
          .then(
            function(data) {
              let res = data.data;
              if (res.code == 200) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                this.loadInfo();
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            }.bind(this)
          );
      });
    },
    selectChange(select) {
      this.subjectsSelected = select;
    },
    formatType(type) {
      return common.typeFormat(type);
    },
    formatDiff(row) {
      return common.diffFormat(row.difficultyLevel);
    },
    formatDate(row) {
      return format(row.createTime);
    },
    // 添加题目
    addSubject() {
      this.subjectForm.id = 0;
      this.subjectForm.slsId = 0;
      this.subjectForm.uniqueId = "";
      this.subjectForm.tSubject = 2 + "";
      this.subjectForm.difficultyLevel = 2 + "";
      this.subjectForm.title = "";
      this.subjectForm.analyse = "";
      this.subjectForm.answerList = [
        { aOption: "A", aText: "", sDelFlag: 1 },
        { aOption: "B", aText: "", sDelFlag: 1 },
        { aOption: "C", aText: "", sDelFlag: 1 },
        { aOption: "D", aText: "", sDelFlag: 1 }
      ];
      this.checked = [];
      this.loading.addSubject = false;
      this.showAddSubjectDialog = true;
      this.renderCKEditor();
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
    addSubjectSure() {
      this.$refs["addSubject"].validate(valid => {
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
        if (this.subjectForm.answerList.length && this.checked.length == 0) {
          this.$message({
            message: "请选择正确答案",
            type: "warning"
          });
          return;
        }
        let data = {};
        data.parentId = this.slsId;
        data.title = this.subjectForm.title;
        data.analyse = this.subjectForm.analyse;
        data.id = this.subjectForm.id;
        data.slsId = this.subjectForm.slsId;
        data.uniqueId = this.subjectForm.uniqueId;
        data.tSubject = this.subjectForm.tSubject;
        data.difficultyLevel = this.subjectForm.difficultyLevel;
        data.options = this.subjectForm.answerList;
        data.options = JSON.stringify(data.options);
        var url = "/v1/subjectBank/addTKExercises";
        if (data.id > 0) {
          url = "/v1/subjectBank/updateTKExercise";
        }
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
                this.loadInfo();
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
          });
      });
    },
    // 编辑题目
    editSubject(index, row) {
      this.subjectForm.id = row.id;
      this.subjectForm.slsId = row.slsId ? row.slsId : "";
      this.subjectForm.uniqueId = row.uniqueId ? row.uniqueId : "";
      this.subjectForm.tSubject = row.tSubject + "";
      this.subjectForm.difficultyLevel = row.difficultyLevel + "";
      this.subjectForm.title = row.title;
      this.subjectForm.answerList = row.answerList;
      this.subjectForm.analyse = row.analyse;
      this.checked = [];
      row.answerList.forEach(element => {
        if (element.isCorrect === 2) {
          this.checked.push(element.aOption);
        }
      });
      this.loading.addSubject = false;
      this.showAddSubjectDialog = true;
      this.renderCKEditor();
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
    selectable() {
      let uid = this.$store.state.user.userId;
      let roleId = this.$store.state.user.currentRole.roleId;
      if (
        (this.subject.review != 1 &&
          (this.subject.uid === uid || roleId == 25)) ||
        roleId == 19
      ) {
        return true;
      }
      return false;
    }
  }
};
</script>
