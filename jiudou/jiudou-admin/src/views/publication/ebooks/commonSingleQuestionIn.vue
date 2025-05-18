<template>
  <!-- 公共题库单题录入 -->
  <div v-loading="loading" class="lessonClassify">
    <!-- <el-header style="height:50px">{{
      libId ? "单题录入" : "题目编辑"
    }}</el-header> -->
    <el-card>
      <el-form
        :model="subjectForm"
        size="small"
        label-width="70px"
        :inline="true"
        ref="addSubject"
      >
        <!-- <el-row style="height:40px">
          <el-form-item
            label="标签"
            class="add-subject-form-item"
            prop="uniqueId"
          >
            <el-input
              size="small"
              placeholder="例:DXWL12345678"
              v-model="subjectForm.uniqueId"
            ></el-input>
          </el-form-item>
        </el-row> -->
        <!-- <el-row>
          <el-form-item label="知识点">
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
        </el-row> -->
        <el-row>
          <el-form-item label="题型">
            <el-select
              :disabled="isDisabled"
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
          <!-- <el-form-item label="难度">
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
          </el-form-item> -->
        </el-row>
        <el-row>
          <el-form-item label="题目">
            <textarea
              name="titleEditor"
              id="titleEditor"
              v-model="subjectForm.title"
            ></textarea>
          </el-form-item>
        </el-row>
        <el-row v-show="!(row && subjectForm.tSubject == 4)">
          <el-form-item
            v-if="subjectForm.tSubject != 11 && subjectForm.tSubject != 5"
            :label="label"
          >
            <div>
              <span
                v-if="
                  subjectForm.tSubject == 1 ||
                    subjectForm.tSubject == 2 ||
                    subjectForm.tSubject == 3
                "
                style="margin-right:20px"
                >请添加选项或答案(选中正确答案)</span
              >
              <span v-if="subjectForm.tSubject == 4" style="margin-right:20px"
                >请添加答案</span
              >
              <el-button
                v-if="
                  subjectForm.tSubject == 1 ||
                    subjectForm.tSubject == 2 ||
                    subjectForm.tSubject == 3
                "
                @click="addOption"
                type="text"
                >添加</el-button
              >
            </div>
            <!-- 单选题 || 判断题 -->
            <div v-if="subjectForm.tSubject == 2 || subjectForm.tSubject == 1">
              <el-radio-group v-model="radioChecked">
                <div
                  class="add-subject-form-options"
                  v-for="(option, index) in subjectForm.answerList"
                  :key="index"
                >
                  <el-row v-if="option.sDelFlag == 1">
                    <el-col :span="2">
                      <el-radio :label="option.aOption"></el-radio>
                    </el-col>
                    <el-col :span="10" style="font-size:14px">
                      <textarea :id="index + 'Editor'"></textarea>
                    </el-col>
                    <el-button
                      @click="deleteOption(option)"
                      class="option-button el-icon-delete"
                    ></el-button>
                  </el-row>
                </div>
              </el-radio-group>
            </div>
            <!-- 多选题 || 填空题 -->
            <div v-if="subjectForm.tSubject == 3">
              <el-checkbox-group v-model="CheckedList">
                <div
                  class="add-subject-form-options"
                  v-for="(option, index) in subjectForm.answerList"
                  :key="index"
                >
                  <el-row v-if="option.sDelFlag == 1">
                    <el-col :span="2">
                      <el-checkbox
                        :label="
                          subjectForm.tSubject == 4 ? index + 1 : option.aOption
                        "
                      ></el-checkbox>
                    </el-col>
                    <el-col :span="10" style="font-size:14px">
                      <textarea :id="index + 'Editor'"></textarea>
                    </el-col>
                    <el-button
                      @click="deleteOption(option)"
                      class="option-button el-icon-delete"
                    ></el-button>
                  </el-row>
                </div>
              </el-checkbox-group>
            </div>
            <div v-if="subjectForm.tSubject == 4">
              <div
                class="add-subject-form-options"
                v-for="(option, index) in subjectForm.answerList"
                :key="index"
              >
                <el-row v-if="option.sDelFlag == 1">
                  <el-col :span="2">
                    <span style="visibility:hidden">({{ index + 1 }})</span>
                  </el-col>
                  <el-col :span="10" style="font-size:14px">
                    <textarea
                      v-model="option.aText"
                      :id="index + 'Editor'"
                    ></textarea>
                  </el-col>
                  <el-button
                    v-if="
                      subjectForm.tSubject == 1 ||
                        subjectForm.tSubject == 2 ||
                        subjectForm.tSubject == 3
                    "
                    @click="deleteOption(option)"
                    class="option-button el-icon-delete"
                  ></el-button>
                </el-row>
              </div>
            </div>
            <!-- <div v-if="subjectForm.tSubject == 5">
              <textarea
                name="answer"
                id="answer"
                v-model="subjectForm.answer"
              ></textarea>
            </div> -->
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            v-if="subjectForm.tSubject == 5 || subjectForm.tSubject == 4"
            v-show="!(!row && subjectForm.tSubject == 4)"
            label="答案"
          >
            <textarea
              name="answer"
              id="answer"
              v-model="subjectForm.answer"
            ></textarea>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="解析">
            <textarea
              name="analysisEditor"
              id="analysisEditor"
              v-model="subjectForm.analyse"
            ></textarea>
          </el-form-item>
        </el-row>
        <!-- 阅读理解小题 -->
        <!-- 大题编辑时新增小题 -->
        <el-form-item
          v-if="subjectForm.tSubject == 11 && row && row.sonSubList.length > 0"
          label="全部小题"
        >
          <el-table ref="subjectsTable" :data="row.sonSubList" stripe border>
            <!-- <el-table-column
                type="selection"
                align="center"
              ></el-table-column> -->
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
            <!-- <el-table-column
                label="难度"
                prop="difficultyLevel"
                align="center"
                width="120px"
              ></el-table-column> -->
            <el-table-column label="题目内容" width="1000px">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between">
                  <div
                    v-html="scope.row.title || scope.row.briefTitle"
                    class="subject-title"
                  >
                    <!-- {{ scope.row.title || scope.row.briefTitle }} -->
                  </div>
                  <el-button size="mini" @click="preview(scope.row)" type="text"
                    >预览</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120px">
              <!-- slot-scope="scope" -->
              <template slot-scope="scope">
                <el-button
                  @click="editSonSubject(scope.$index, scope.row)"
                  size="mini"
                  type="text"
                  >编辑</el-button
                >
                <el-button
                  @click="deleteSonSubject(scope.$index, scope.row)"
                  size="mini"
                  type="text"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 大题新增时新增小题 -->
        <el-form-item
          v-if="subjectForm.tSubject == 11 && addSonList.length > 0"
          label="全部小题"
        >
          <el-table ref="subjectsTable" :data="addSonList" stripe border>
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
            <!-- <el-table-column
                label="难度"
                prop="difficultyLevel"
                align="center"
                width="120px"
              ></el-table-column> -->
            <el-table-column label="题目内容" width="1000px">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between">
                  <div
                    v-html="scope.row.title || scope.row.briefTitle"
                    class="subject-title"
                  >
                    <!-- {{ scope.row.title || scope.row.briefTitle }} -->
                  </div>
                  <el-button size="mini" type="text" @click="preview(scope.row)"
                    >预览</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120px">
              <!-- slot-scope="scope" -->
              <template slot-scope="scope">
                <el-button
                  @click="editSonSubject(scope.$index, scope.row)"
                  size="mini"
                  type="text"
                  >编辑</el-button
                >
                <el-button
                  @click="deleteTempSonSubject(scope.$index, addSonList)"
                  size="mini"
                  type="text"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-row>
          <el-form-item v-if="subjectForm.tSubject == 11" label="  ">
            <el-button @click="openDialog" type="primary">添加小题</el-button>
          </el-form-item>
        </el-row>
        <el-row style="text-align:center">
          <el-button size="mini" @click="addSubjectSure" type="primary">{{
            libId ? "录入" : "确定"
          }}</el-button>
          <el-button size="mini" @click="goBack" type="primary">返回</el-button>
        </el-row>
      </el-form>
    </el-card>
    <!-- 添加小题弹窗 -->
    <el-dialog
      title="添加小题"
      top="5vh"
      v-if="addDialogVisible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="addDialogVisible"
      width="70%"
      :before-close="handleAddClose"
    >
      <commonAddChildren
        :addSonFlag="addSonFlag"
        @cancel="onCancel"
        @newData="childValue"
      ></commonAddChildren>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false"
          >确 定</el-button
        >
      </span> -->
    </el-dialog>
    <!-- 编辑小题弹窗 -->
    <el-dialog
      title="编辑小题"
      top="5vh"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="editDialogVisible"
      v-if="editDialogVisible"
      width="70%"
      :before-close="handleEditClose"
    >
      <commonEditChildren
        @onEditCancel="onEditCancel"
        @onSonEdit="onSonEdit"
        :sonRow="sonRow"
        :index="index"
      ></commonEditChildren>
    </el-dialog>
    <jd-dialog
      title="小题预览"
      width="800px"
      :noFooter="true"
      :visible.sync="showPreviewDialog"
    >
      <preview
        slot="body"
        :data="previewSubject"
        style="height:400px;overflow-y: auto"
      ></preview>
    </jd-dialog>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import jdialog from "@/components/jdialog";
import ckeditorConfig from "@/config/ckeditor_config_editor.js";
import ckeditorConfigN from "@/config/ckeditor_config.js";
import ckeditorConfigA from "@/config/ckeditor_config_analazy.js";
import commonAddChildren from "./commonAddChildren";
import commonEditChildren from "./commonEditChildren";
import preview from "./previewSubject";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";

export default {
  name: "CommonQuestionIn",
  components: {
    commonAddChildren,
    commonEditChildren,
    "jd-dialog": jdialog,
    preview,
    ElTreeSelect
  },
  data() {
    return {
      dtBookId: this.$route.query.dtBookId,
      chapterNodeId: this.$route.query.chapterNodeId,
      pointId: this.$route.query.pointId,
      versionCode: this.$route.query.versionCode,
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
      sonRow: null,
      addSonList: [], // 大题新增时新增的小题列表
      addDialogVisible: false, // 对话框显示
      editDialogVisible: false, // 对话框显示
      showPreviewDialog: false, // 预览弹窗
      previewSubject: null,
      loading: false,
      row: null,
      libId: this.$route.query.libId,
      courseId: this.$route.query.courseId,
      subjectForm: {
        tips: "",
        tipsText: "",
        id: "",
        uniqueId: "",
        difficultyLevel: "0",
        tSubject: "2",
        title: "",
        analyse: "",
        answer: "",
        answerList: [{ aOption: "A", aText: "", sDelFlag: 1 }]
      },
      radioChecked: "",
      CheckedList: [],
      types: common.types,
      allTypes: common.allTypes,
      // 难点
      diffs: common.diffs,
      label: "选项",
      //知识点
      testLibTip: [],
      courseTip: [],
      tipTags: [],
      tagInputVisible: false,
      tagInputValue: "",
      //课程列表参数
      // courseId: "",
      courseData: [],
      defaultTipProps: {
        label: "name",
        children: "children"
      },
      expandTipArr: [],
      addSonFlag: 0,
      index: 0
    };
  },
  computed: {
    isDisabled() {
      return !!this.row;
    },
    dataList() {
      return this.$store.state.tiku.dataList;
    }
  },
  mounted() {
    if (!this.libId) {
      this.row = JSON.parse(localStorage.getItem("rowData"));
      // this.$store.commit("addDataList", this.row.sonSubList);
    }
    this.checkLebal(this.subjectForm.tSubject);
    // this.loadCourse();
    // this.loadTips();
    if (this.row && this.row.id) {
      let {
        id,
        tSubject,
        difficultyLevel,
        title,
        answerList,
        analyse,
        answer,
        learnPort,
        uniqueId,
        tipId
      } = this.row;
      this.subjectForm.id = id;
      //去掉tipId前后的逗号
      if (tipId) {
        if (tipId.substring(tipId.length - 1) == ",") {
          tipId = tipId.substring(0, tipId.length - 1);
        }
        if (tipId.substring(0, 1) == ",") {
          tipId = tipId.substring(1, tipId.length);
        }
        this.subjectForm.tips = tipId.split(",");
        this.subjectForm.tipsText = learnPort;
      } else {
        this.subjectForm.tips = [];
        this.subjectForm.tipsText = "";
      }
      this.subjectForm.uniqueId = uniqueId;
      this.subjectForm.tSubject = tSubject + "";
      this.subjectForm.difficultyLevel = difficultyLevel + "";
      this.subjectForm.title = title;
      this.subjectForm.answerList = answerList;
      this.subjectForm.analyse = analyse;
      this.subjectForm.answer = answer;
      this.tipTags = learnPort ? learnPort.split(",") : [];
      // 单选和判断
      if (tSubject == 1 || tSubject == 2) {
        answerList.forEach(item => {
          if (item.isCorrect === 2) {
            this.radioChecked = item.aOption;
          }
        });
      }
      // 多选题
      if (tSubject == 3) {
        answerList.forEach(item => {
          if (item.isCorrect === 2) {
            this.CheckedList.push(item.aOption);
          }
        });
      }
    }
    this.renderCKEditor();
  },
  methods: {
    // 获取知识点
    loadTips() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          data: { courseId: this.courseId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.tkTreeParams.data = res.data;
              this.record = res.data;
              if (res.data.length >= 0) {
                this.$refs.tkTreeSelect.treeDataUpdateFun(res.data);
              }
            }
          }.bind(this)
        );
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
    childValue(jsonStr) {
      // 添加小题
      if (this.row) {
        // 大题编辑时新增小题
        this.row.sonSubList.push(jsonStr);
        localStorage.setItem("rowData", JSON.stringify(this.row));
      } else {
        // 大题新增时新增小题
        this.addSonList.push(jsonStr);
      }
      this.addDialogVisible = false;
    },
    onSonEdit(data) {
      if (this.row && this.row.id) {
        let newSonSubList = [];
        for (let i = 0; i < this.row.sonSubList.length; i++) {
          let sonSub = this.row.sonSubList[i];
          if (sonSub.id === data.id) {
            newSonSubList.push(data);
          } else {
            newSonSubList.push(sonSub);
          }
        }
        this.row.sonSubList = newSonSubList;
        localStorage.setItem("rowData", JSON.stringify(this.row));
      } else {
        // 新增大题时编辑
        this.addSonList.splice(data.index, 1);
        // this.addSonList.push(data);
        this.addSonList.splice(data.index, 0, data); // 保证编辑之后不改变数组元素顺序，而不是追加(删除该位置元素，并在该位置插入新元素)
      }
      this.editDialogVisible = false;
    },
    onEditCancel(data) {
      this.editDialogVisible = data;
    },
    onCancel(data) {
      this.addDialogVisible = data;
    },
    // 编辑大题时编辑小题
    editSonSubject(index, row) {
      this.index = index;
      this.sonRow = JSON.parse(JSON.stringify(row));
      this.editDialogVisible = true;
    },
    // 编辑时删除小题（调用接口删除）
    deleteSonSubject(index, row) {
      // 删除小题
      this.$confirm("此操作将永久删除该小题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/subject/subjectBank/deleteBank",
              data: {
                id: row.id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.row.sonSubList.splice(index, 1);
                localStorage.setItem("rowData", JSON.stringify(this.row));
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    // 新增大题时删除小题(前端层面删除)
    deleteTempSonSubject(index, rows) {
      // 删除小题
      this.$confirm("此操作将永久删除该小题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.addSonList.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    goBack() {
      this.$router.push({
        path: "/epub-publication/dtBindTest",
        query: {
          dtBookId: this.dtBookId,
          chapterNodeId: this.chapterNodeId,
          pointId: this.pointId,
          versionCode: this.versionCode
        }
      });
    },
    openDialog() {
      this.addDialogVisible = true;
      if (this.row) {
        // 编辑时新增小题的标志 addSonFlag
        this.addSonFlag = 1;
      }
    },
    handleAddClose(done) {
      done();
    },
    handleEditClose(done) {
      done();
    },
    checkLebal(val) {
      if (!["1", "2", "3"].includes(val)) {
        this.label = "答案";
      } else {
        this.label = "选项";
      }
    },
    typeChange(value) {
      this.checkLebal(value);
      this.subjectForm.answerList = [{ aOption: "A", aText: "", sDelFlag: 1 }];
      // if (value == 1) {
      //   this.subjectForm.answerList = [
      //     { aOption: "A", aText: "", sDelFlag: 1 }
      //   ];
      // } else {
      //   this.subjectForm.answerList = [
      //     { aOption: "A", aText: "", sDelFlag: 1 }
      //   ];
      // }
      this.renderCKEditor();
    },
    renderCKEditor() {
      for (const name in window.CKEDITOR.instances) {
        window.CKEDITOR.instances[name].destroy();
      }
      let vm = this;
      this.$nextTick(() => {
        this.loading = true;
        // title
        window.CKEDITOR.replace(
          "titleEditor",
          Object.assign(ckeditorConfig, {
            height: 100,
            width: 900
          })
        );
        window.CKEDITOR.instances["titleEditor"].setData(
          this.process2ckeditor(this.subjectForm.title)
        );
        window.CKEDITOR.instances["titleEditor"].on("change", function(event) {
          vm.subjectForm.title = this.getData();
        });
        // this.subjectForm.tSubject != 1 &&
        //   this.subjectForm.tSubject != 2 &&
        //   this.subjectForm.tSubject != 3 &&
        //   this.subjectForm.tSubject != 4 &&
        // answer
        if (this.subjectForm.tSubject == 5 || this.subjectForm.tSubject == 4) {
          window.CKEDITOR.replace(
            "answer",
            Object.assign(ckeditorConfig, {
              width: 900,
              height: 60
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
        window.CKEDITOR.replace(
          "analysisEditor",
          Object.assign(ckeditorConfigA, {
            height: 100,
            width: 900
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
        if (
          this.subjectForm.tSubject == 1 ||
          this.subjectForm.tSubject == 2 ||
          this.subjectForm.tSubject == 3 ||
          this.subjectForm.tSubject == 4
        ) {
          for (let i = 0; i < this.subjectForm.answerList.length; i++) {
            let id = i + "Editor";
            let option = this.subjectForm.answerList[i];
            if (option.sDelFlag == 1) {
              window.CKEDITOR.replace(
                id,
                Object.assign(ckeditorConfigN, {
                  height: 50,
                  width: 800
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
        }
        setTimeout(() => {
          this.loading = false;
        }, 800);
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
    //点击知识点tree  item
    handleTipNodeClick(row) {
      if (row.parentId != 0) {
        this.tagInputValue = row.name;
        this.handleInputConfirm();
      }
    },
    // 加载原有课程体系
    loadCourse() {
      axios
        .request({
          method: "post",
          url: "/subject/course/listAll"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.courseData = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 选择课程 本地存储上次使用知识点
    selectCourse() {
      if (localStorage.getItem("selectedTkCourseId")) {
        this.courseId = parseInt(localStorage.getItem("selectedTkCourseId"));
        this.loadCourseTip();
      }
    },
    loadCourseTip() {
      if (this.courseId) {
        localStorage.setItem("selectedTkCourseId", this.courseId);
        axios
          .request({
            method: "post",
            url: "/subject/chapterTip/treeList",
            data: { courseId: this.courseId }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.courseTip = ret.data;
              if (ret.data.length > 0) {
                this.expandTipArr = [ret.data[0].tipId];
              }
            }
          });
      } else {
        this.courseTip = [];
        this.expandTipArr = [];
      }
    },
    //课程标签的三个方法
    handleClose(tag) {
      this.tipTags.splice(this.tipTags.indexOf(tag), 1);
    },
    handleShowTagInput() {
      this.tagInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let tagInputValue = this.tagInputValue;
      if (tagInputValue.split(" ").join("").length == 0) {
        this.tagInputVisible = false;
        return;
      }
      if (tagInputValue) {
        let flag = false;
        for (let i = 0; i < this.tipTags.length; i++) {
          if (this.tipTags[i] == tagInputValue) {
            flag = true;
            this.tagInputVisible = false;
            this.tagInputValue = "";
            return;
          }
        }
        if (!flag) {
          this.tipTags.push(tagInputValue);
        }
      }
      this.tagInputVisible = false;
      this.tagInputValue = "";
    },
    onTipBlur() {
      if (this.tagInputValue.trim().length == 0) {
        // this.tagInputVisible = false;
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
      // if (this.$refs.addSubject) {
      //   this.$refs.addSubject.clearValidate();
      // }
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
        window.CKEDITOR.replace(
          id,
          Object.assign(ckeditorConfigN, {
            height: 50,
            width: 800
          })
        );
        window.CKEDITOR.instances[id].on("change", function(event) {
          option.aText = this.getData();
        });
      });
    },
    // 点击预览题目
    preview(subject) {
      let newSubject = Object.assign(subject, { parentId: 0 });
      this.previewSubject = newSubject;
      this.showPreviewDialog = true;
    },
    // 录入题目
    addSubjectSure() {
      if (!this.subjectForm.title) {
        this.$message({
          message: "请输入题目",
          type: "warning"
        });
        return;
      }
      // 校验单选，多选，判断题
      if (
        this.subjectForm.tSubject == 1 ||
        this.subjectForm.tSubject == 2 ||
        this.subjectForm.tSubject == 3
      ) {
        for (let i = 0; i < this.subjectForm.answerList.length; i++) {
          if (this.subjectForm.answerList[i].aText.trim().length === 0) {
            this.$message({
              message: "选项内容不能为空",
              type: "warning"
            });
            return;
          }
          let option = this.subjectForm.answerList[i];
          if (option.sDelFlag == 1) {
            if (
              this.radioChecked.indexOf(option.aOption) >= 0 ||
              this.CheckedList.indexOf(option.aOption) >= 0
            ) {
              option.isCorrect = 2;
            } else {
              option.isCorrect = 1;
            }
          }
        }
        if (this.radioChecked.length === 0 && this.CheckedList.length === 0) {
          this.$message({
            message: "请选择正确答案",
            type: "warning"
          });
          return;
        }
      }

      // 校验填空题
      if (this.subjectForm.tSubject == 4) {
        for (let i = 0; i < this.subjectForm.answerList.length; i++) {
          if (this.subjectForm.answerList[i].aText.trim().length === 0) {
            this.$message({
              message: "选项内容不能为空",
              type: "warning"
            });
            return;
          }
          let option = this.subjectForm.answerList[i];
          if (option.sDelFlag == 1) {
            option.isCorrect = 2;
          }
        }
      }

      // 校验解答题,阅读理解
      if (this.subjectForm.tSubject == 5 || this.subjectForm.tSubject == 11) {
        this.subjectForm.answerList = [];
        // if (this.subjectForm.analyse.trim().length === 0) {
        //   this.$message({
        //     message: "请输入解析",
        //     type: "warning"
        //   });
        //   return;
        // }
      }

      this.handleInputConfirm();
      let jsonStr = {};
      let data = {};
      jsonStr.title = this.subjectForm.title;
      jsonStr.uniqueId = this.subjectForm.uniqueId;
      jsonStr.analyse = this.subjectForm.analyse;
      jsonStr.learnPort = this.tipTags.join(",");
      jsonStr.tSubject = this.subjectForm.tSubject;
      jsonStr.difficultyLevel = this.subjectForm.difficultyLevel;
      jsonStr.answerList = this.subjectForm.answerList;
      jsonStr.tipId =
        this.subjectForm.tips.length > 0 ? this.subjectForm.tips.join(",") : "";
      jsonStr.tipsText = this.subjectForm.tipsText;
      jsonStr.learnPort = this.subjectForm.tipsText;
      if (this.subjectForm.tSubject == 4) {
        let aTextArr = [];
        this.subjectForm.answerList.forEach(item => {
          aTextArr.push(item.aText);
        });
        jsonStr.answerList = [];
        jsonStr.answer = aTextArr.join("|*");
        if (this.row) {
          jsonStr.answer = this.subjectForm.answer;
        }
        // if (this.row && this.subjectForm.answer != this.row.answer) {
        //   jsonStr.answer = this.subjectForm.answer;
        // }
        // if (this.row && this.subjectForm.answer == this.row.answer) {
        //   jsonStr.answer = this.subjectForm.answer;
        // }
      } else {
        jsonStr.answer = this.subjectForm.answer;
      }
      let url = "";
      if (this.subjectForm.id > 0) {
        // 编辑
        jsonStr.id = this.subjectForm.id;
        url = "/subject/subjectBank/update";
        let arr = [];
        arr.push(jsonStr);
        data.jsonStr = JSON.stringify(arr);
        axios
          .request({
            method: "post",
            url: url,
            data: data
          })
          .then(data => {
            let res = data.data;
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.bus.$emit("sendLid", this.libId);
              this.goBack();
            } else {
              this.$message({
                type: "warning",
                message: `${res.msg}`
              });
            }
          })
          .catch(() => {});
      } else {
        // 新增
        // data.libId = this.libId; // 公共题库id
        url = "/subject/subjectBankLibrary/saveItemBatch";
        // 拼接Json  请求
        let addArr = [];
        jsonStr.belongList = [...this.addSonList];
        addArr.push(jsonStr);
        data.jsonStr = JSON.stringify(addArr);
        axios
          .request({
            method: "post",
            url: url,
            data: data
          })
          .then(data => {
            let res = data.data;
            if (res.code == 200) {
              let ids = [];
              res.data.forEach(element => {
                ids.push({
                  bankId: element.id,
                  type: 2,
                  commitUid: this.$store.state.user.userId
                });
              });
              axios
                .request({
                  method: "post",
                  url: "/ebook/dTbookSubjectBank/bingSubject",
                  data: {
                    subjectJson: JSON.stringify(ids),
                    dtbookId: this.$route.query.dtBookId,
                    chapterId: this.$route.query.chapterNodeId,
                    pointId: this.$route.query.pointId,
                    versionCode: this.$route.query.versionCode
                  }
                })
                .then(res => {
                  let ret = res.data;
                  if (ret.code == 200) {
                    // 返回页面
                    this.$router.push({
                      path: "/epub-publication/dtBindTest",
                      query: {
                        dtBookId: this.dtBookId,
                        chapterNodeId: this.chapterNodeId,
                        pointId: this.pointId,
                        versionCode: this.versionCode
                      }
                    });
                  } else {
                    this.$message({
                      type: "warning",
                      message: ret.msg
                    });
                  }
                });
              // this.$message({
              //   message: res.msg,
              //   type: "success"
              // });
              // this.bus.$emit("sendLid", this.libId);
              // this.goBack();
            } else {
              this.$message({
                type: "warning",
                message: `${res.msg}`
              });
            }
          })
          .catch(() => {});
      }
    },
    formatType(type) {
      return common.typeFormat(type);
    },
    selectable() {
      let uid = this.$store.state.user.userId;
      let roleId = this.$store.state.user.currentRole.roleId;
      if (
        // this.subjectForm.review != 1&&
        this.subjectForm.uid === uid ||
        roleId == 25 ||
        roleId == 19
      ) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style lang="scss">
.lessonClassify {
  width: 100%;
  .el-header {
    padding-left: 52px;
    display: flex;
    align-items: center;
    background-color: #fff;
    margin-bottom: 10px;
  }
  .el-card {
    min-height: 800px;
    .headItems {
      display: flex;
      align-items: center;
    }
    .add-subject-form-options {
      width: 100%;
      padding-right: 0;
      padding-left: 24px;
      .el-row {
        margin-bottom: 10px;
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
      .option-button {
        margin-top: 5px;
        border: none;
      }
    }
  }
}
</style>
