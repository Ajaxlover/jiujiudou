<template>
  <!-- 个人题库小题编辑 -->
  <div class="lessonClassify">
    <el-form
      :model="sonSubjectForm"
      size="small"
      label-width="70px"
      :inline="true"
      ref="addSubject"
    >
      <!-- <el-row>
        <el-form-item label="知识点">
          <el-tag
            :key="index"
            v-for="(tag, index) in tipTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <div v-if="tagInputVisible">
            <el-input
              class="input-new-tag"
              v-model="tagInputValue"
              style="width:320px;margin-bottom:5px"
              maxlength="16"
              show-word-limit
              ref="saveTagInput"
              size="mini"
              @blur="onTipBlur"
              @keyup.enter.native="handleInputConfirm"
            >
              <el-popover placement="bottom" trigger="click" slot="append">
                <el-select
                  v-model="courseId"
                  placeholder="请选择"
                  size="small"
                  @change="loadCourseTip()"
                  clearable
                >
                  <el-option
                    v-for="item in courseData"
                    :key="item.courseId"
                    :label="item.courseName"
                    :value="item.courseId"
                  ></el-option>
                </el-select>
                <el-tree
                  :data="courseTip"
                  :props="defaultTipProps"
                  node-key="tipId"
                  style="max-height:300px;overflow-y:auto;margin-top:12px;"
                  icon-class="el-icon-arrow-right"
                  @node-click="handleTipNodeClick"
                  :default-expanded-keys="expandTipArr"
                >
                  <span class="custom-tree-node" slot-scope="{ node }">
                    <span :title="node.label">{{ node.label }}</span>
                  </span>
                </el-tree>
                <el-button
                  slot="reference"
                  style="color:#2BA1F4;"
                  @click="selectCourse"
                  >选择</el-button
                >
              </el-popover>
            </el-input>
            <el-button
              v-if="tagInputVisible"
              size="mini"
              @click="handleInputConfirm"
              style="padding: 7px 6px;margin-bottom:5px"
              >确定</el-button
            >
          </div>
          <i
            v-else
            class="button-new-tag el-icon-plus"
            @click="handleShowTagInput"
          ></i>
        </el-form-item>
      </el-row> -->
      <el-row>
        <el-form-item label="题型">
          <el-select
            :disabled="isDisabled"
            v-model="sonSubjectForm.tSubject"
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
            v-model="sonSubjectForm.difficultyLevel"
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
      </el-row>
      <el-row>
        <el-form-item label="题目">
          <textarea
            v-if="!sonRow.id"
            name="titleEditor2"
            id="titleEditor2"
            v-model="sonSubjectForm.title"
          ></textarea>
          <textarea
            v-else
            name="titleEditor1"
            id="titleEditor1"
            v-model="sonSubjectForm.title"
          ></textarea>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item
          v-if="sonSubjectForm.tSubject != 11 && sonSubjectForm.tSubject != 5"
          :label="label"
        >
          <div v-if="sonSubjectForm.tSubject != 4">
            <span
              v-if="
                sonSubjectForm.tSubject == 1 ||
                  sonSubjectForm.tSubject == 2 ||
                  sonSubjectForm.tSubject == 3
              "
              style="margin-right:20px"
              >请添加选项或答案(选中正确答案)</span
            >
            <span v-if="sonSubjectForm.tSubject == 4" style="margin-right:20px"
              >请添加答案</span
            >
            <el-button
              v-if="
                sonSubjectForm.tSubject == 1 ||
                  sonSubjectForm.tSubject == 2 ||
                  sonSubjectForm.tSubject == 3 ||
                  sonSubjectForm.tSubject == 4
              "
              @click="addOption"
              type="text"
              >添加</el-button
            >
          </div>
          <!-- 单选题 || 判断题 -->
          <div
            v-if="sonSubjectForm.tSubject == 2 || sonSubjectForm.tSubject == 1"
          >
            <el-radio-group v-model="radioChecked">
              <div
                class="add-subject-form-options1"
                v-for="(option, index) in sonSubjectForm.answerList"
                :key="index"
              >
                <el-row v-if="option.sDelFlag == 1">
                  <el-col :span="2">
                    <el-radio :label="option.aOption"></el-radio>
                  </el-col>
                  <el-col :span="10" style="font-size:14px">
                    <textarea
                      v-if="!sonRow.id"
                      :id="index + 'Editor2'"
                    ></textarea>
                    <textarea v-else :id="index + 'Editor1'"></textarea>
                  </el-col>
                  <el-button
                    style="margin-left:30px;margin-top:5px"
                    @click="deleteOption(option)"
                    class="option-button el-icon-delete"
                  ></el-button>
                </el-row>
              </div>
            </el-radio-group>
          </div>
          <!-- 多选题 || 填空题 -->
          <div v-if="sonSubjectForm.tSubject == 3">
            <el-checkbox-group v-model="CheckedList">
              <div
                class="add-subject-form-options1"
                v-for="(option, index) in sonSubjectForm.answerList"
                :key="index"
              >
                <el-row v-if="option.sDelFlag == 1">
                  <el-col :span="2">
                    <el-checkbox
                      :label="
                        sonSubjectForm.tSubject == 4
                          ? index + 1
                          : option.aOption
                      "
                    ></el-checkbox>
                  </el-col>
                  <el-col :span="10" style="font-size:14px">
                    <textarea
                      v-if="!sonRow.id"
                      :id="index + 'Editor2'"
                    ></textarea>
                    <textarea v-else :id="index + 'Editor1'"></textarea>
                  </el-col>
                  <el-button
                    style="margin-left:30px;margin-top:5px"
                    @click="deleteOption(option)"
                    class="option-button el-icon-delete"
                  ></el-button>
                </el-row>
              </div>
            </el-checkbox-group>
          </div>
          <div v-if="sonSubjectForm.tSubject == 4">
            <textarea
              v-if="!sonRow.id"
              name="answer4"
              id="answer4"
              v-model="sonSubjectForm.answer"
            ></textarea>
            <textarea
              v-else
              name="answer3"
              id="answer3"
              v-model="sonSubjectForm.answer"
            ></textarea>
          </div>
          <!-- <div v-if="sonSubjectForm.tSubject == 4">
            <div
              class="add-subject-form-options1"
              v-for="(option, index) in sonSubjectForm.answerList"
              :key="index"
            >
              <el-row v-if="option.sDelFlag == 1">
                <el-col :span="2">
                  <span>({{ index + 1 }})</span>
                </el-col>
                <el-col :span="10" style="font-size:14px">
                  <textarea
                    v-if="!sonRow.id"
                    :id="index + 'Editor2'"
                  ></textarea>
                  <textarea v-else :id="index + 'Editor1'"></textarea>
                </el-col>
                <el-button
                  style="margin-left:30px;margin-top:5px"
                  @click="deleteOption(option)"
                  class="option-button el-icon-delete"
                ></el-button>
              </el-row>
            </div>
          </div> -->
          <div
            v-if="
              sonSubjectForm.tSubject != 1 &&
                sonSubjectForm.tSubject != 2 &&
                sonSubjectForm.tSubject != 3 &&
                sonSubjectForm.tSubject != 4 &&
                sonSubjectForm.tSubject != 11
            "
          >
            <textarea
              v-if="!sonRow.id"
              name="answer2"
              id="answer2"
              v-model="sonSubjectForm.answer"
            ></textarea>
            <textarea
              v-else
              name="answer1"
              id="answer1"
              v-model="sonSubjectForm.answer"
            ></textarea>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="解析">
          <textarea
            v-if="!sonRow.id"
            name="analysisEditor2"
            id="analysisEditor2"
            v-model="sonSubjectForm.analyse"
          ></textarea>
          <textarea
            v-else
            name="analysisEditor1"
            id="analysisEditor1"
            v-model="sonSubjectForm.analyse"
          ></textarea>
        </el-form-item>
      </el-row>
      <el-row style="text-align:center">
        <el-button size="small" @click="addSonSubjectSure" type="primary">{{
          libId ? "录入" : "确定"
        }}</el-button>
        <el-button size="small" @click="goBack" type="primary">取消</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import ckeditorConfig from "@/config/ckeditor_config_editor.js";
import ckeditorConfigN from "@/config/ckeditor_config.js";
import ckeditorConfigA from "@/config/ckeditor_config_analazy.js";

export default {
  props: {
    addSonFlag: Number,
    sonRow: Object,
    index: Number
  },
  data() {
    return {
      row: null,
      libId: this.$route.query.libId,
      sonSubjectForm: {
        id: "",
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
      courseId: "",
      courseData: [],
      defaultTipProps: {
        label: "name",
        children: "children"
      },
      expandTipArr: []
    };
  },
  computed: {
    isDisabled() {
      return !!this.sonRow;
    }
  },
  mounted() {
    if (!this.libId) {
      this.row = JSON.parse(localStorage.getItem("rowData"));
    }
    this.checkLebal(this.sonSubjectForm.tSubject);
    // this.loadCourse();
    if (!this.sonRow.id) {
      // 新增大题时编辑小题
      let {
        tSubject,
        difficultyLevel,
        title,
        answerList,
        analyse,
        answer,
        learnPort
      } = this.sonRow;
      this.sonSubjectForm.id = "";
      this.sonSubjectForm.tSubject = tSubject + "";
      this.sonSubjectForm.difficultyLevel = difficultyLevel + "";
      this.sonSubjectForm.title = title;
      this.sonSubjectForm.answerList = answerList;
      this.sonSubjectForm.analyse = analyse;
      this.sonSubjectForm.answer = answer;
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
      let vm = this;
      this.$nextTick(() => {
        // title
        window.CKEDITOR.replace(
          "titleEditor2",
          Object.assign(ckeditorConfig, {
            height: 100,
            width: 800
          })
        );
        window.CKEDITOR.instances["titleEditor2"].setData(
          this.process2ckeditor1(this.sonSubjectForm.title)
        );
        window.CKEDITOR.instances["titleEditor2"].on("change", function(event) {
          vm.sonSubjectForm.title = this.getData();
        });
        // answer
        // 编辑小题（小题未创建）
        if (this.sonSubjectForm.tSubject == 4) {
          window.CKEDITOR.replace(
            "answer4",
            Object.assign(ckeditorConfig, {
              width: 800,
              height: 100
            })
          );
          window.CKEDITOR.instances["answer4"].setData(
            this.process2ckeditor1(this.sonSubjectForm.answer)
          );
          window.CKEDITOR.instances["answer4"].on("change", function(event) {
            vm.sonSubjectForm.answer = this.getData();
          });
        }
        if (
          this.sonSubjectForm.tSubject != 1 &&
          this.sonSubjectForm.tSubject != 2 &&
          this.sonSubjectForm.tSubject != 3 &&
          this.sonSubjectForm.tSubject != 4 &&
          this.sonSubjectForm.tSubject != 5 &&
          this.sonSubjectForm.tSubject != 11
        ) {
          window.CKEDITOR.replace(
            "answer2",
            Object.assign(ckeditorConfig, {
              width: 800,
              height: 100
            })
          );
          window.CKEDITOR.instances["answer2"].setData(
            this.process2ckeditor1(this.sonSubjectForm.answer)
          );
          window.CKEDITOR.instances["answer2"].on("change", function(event) {
            vm.sonSubjectForm.answer = this.getData();
          });
        }
        // analyse
        window.CKEDITOR.replace(
          "analysisEditor2",
          Object.assign(ckeditorConfigA, {
            height: 100,
            width: 800
          })
        );
        window.CKEDITOR.instances["analysisEditor2"].setData(
          this.process2ckeditor1(this.sonSubjectForm.analyse)
        );
        window.CKEDITOR.instances["analysisEditor2"].on("change", function(
          event
        ) {
          vm.sonSubjectForm.analyse = this.getData();
        });
        // options
        if (
          this.sonSubjectForm.tSubject == 1 ||
          this.sonSubjectForm.tSubject == 2 ||
          this.sonSubjectForm.tSubject == 3 ||
          this.sonSubjectForm.tSubject == 4
        ) {
          for (let i = 0; i < this.sonSubjectForm.answerList.length; i++) {
            let id = i + "Editor2";
            let option = this.sonSubjectForm.answerList[i];
            if (option.sDelFlag == 1) {
              window.CKEDITOR.replace(
                id,
                Object.assign(ckeditorConfigN, {
                  height: 50,
                  width: 734
                })
              );
              window.CKEDITOR.instances[id].setData(
                this.process2ckeditor1(option.aText)
              );
              window.CKEDITOR.instances[id].on("change", function(event) {
                option.aText = this.getData();
              });
            }
          }
        }
      });
    }
    if (this.sonRow && this.sonRow.id) {
      this.init();
    }
  },
  methods: {
    init() {
      let {
        id,
        tSubject,
        difficultyLevel,
        title,
        answerList,
        analyse,
        answer,
        learnPort
      } = this.sonRow;
      this.sonSubjectForm.id = id;
      this.sonSubjectForm.tSubject = tSubject + "";
      this.sonSubjectForm.difficultyLevel = difficultyLevel + "";
      this.sonSubjectForm.title = title;
      this.sonSubjectForm.answerList = answerList;
      this.sonSubjectForm.analyse = analyse;
      this.sonSubjectForm.answer = answer;
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
      let vm = this;
      this.$nextTick(() => {
        // title
        window.CKEDITOR.replace(
          "titleEditor1",
          Object.assign(ckeditorConfig, {
            height: 100,
            width: 800
          })
        );
        window.CKEDITOR.instances["titleEditor1"].setData(
          this.process2ckeditor1(this.sonSubjectForm.title)
        );
        window.CKEDITOR.instances["titleEditor1"].on("change", function(event) {
          vm.sonSubjectForm.title = this.getData();
        });
        // answer
        // 编辑小题（小题已经创建）
        if (this.sonSubjectForm.tSubject == 4) {
          window.CKEDITOR.replace(
            "answer3",
            Object.assign(ckeditorConfig, {
              width: 800,
              height: 100
            })
          );
          window.CKEDITOR.instances["answer3"].setData(
            this.process2ckeditor1(this.sonSubjectForm.answer)
          );
          window.CKEDITOR.instances["answer3"].on("change", function(event) {
            vm.sonSubjectForm.answer = this.getData();
          });
        }
        if (
          this.sonSubjectForm.tSubject != 1 &&
          this.sonSubjectForm.tSubject != 2 &&
          this.sonSubjectForm.tSubject != 3 &&
          this.sonSubjectForm.tSubject != 4 &&
          this.sonSubjectForm.tSubject != 5 &&
          this.sonSubjectForm.tSubject != 11
        ) {
          window.CKEDITOR.replace(
            "answer1",
            Object.assign(ckeditorConfig, {
              width: 800,
              height: 100
            })
          );
          window.CKEDITOR.instances["answer1"].setData(
            this.process2ckeditor1(this.sonSubjectForm.answer)
          );
          window.CKEDITOR.instances["answer1"].on("change", function(event) {
            vm.sonSubjectForm.answer = this.getData();
          });
        }
        // analyse
        window.CKEDITOR.replace(
          "analysisEditor1",
          Object.assign(ckeditorConfigN, {
            height: 100,
            width: 800
          })
        );
        window.CKEDITOR.instances["analysisEditor1"].setData(
          this.process2ckeditor1(this.sonSubjectForm.analyse)
        );
        window.CKEDITOR.instances["analysisEditor1"].on("change", function(
          event
        ) {
          vm.sonSubjectForm.analyse = this.getData();
        });
        // options
        if (
          this.sonSubjectForm.tSubject == 1 ||
          this.sonSubjectForm.tSubject == 2 ||
          this.sonSubjectForm.tSubject == 3 ||
          this.sonSubjectForm.tSubject == 4
        ) {
          for (let i = 0; i < this.sonSubjectForm.answerList.length; i++) {
            let id = i + "Editor1";
            let option = this.sonSubjectForm.answerList[i];
            if (option.sDelFlag == 1) {
              window.CKEDITOR.replace(
                id,
                Object.assign(ckeditorConfigN, {
                  height: 50,
                  width: 734
                })
              );
              window.CKEDITOR.instances[id].setData(
                this.process2ckeditor1(option.aText)
              );
              window.CKEDITOR.instances[id].on("change", function(event) {
                option.aText = this.getData();
              });
            }
          }
        }
      });
    },
    goBack() {
      this.$nextTick(() => {
        this.sonSubjectForm = {
          id: "",
          difficultyLevel: "0",
          tSubject: "2",
          title: "",
          analyse: "",
          answer: "",
          answerList: [{ aOption: "A", aText: "", sDelFlag: 1 }]
        };
      });
      this.$emit("onEditCancel", false);
    },
    checkLebal(val) {
      if (!["1", "2", "3"].includes(val)) {
        this.label = "答案";
      } else if (!["4"].includes(val)) {
        this.label = "答案";
      } else {
        this.label = "选项";
      }
    },
    typeChange(value) {
      this.checkLebal(value);
      if (value == 1) {
        this.sonSubjectForm.answerList = [
          { aOption: "A", aText: "", sDelFlag: 1 }
        ];
      }
      this.renderCKEditor2();
    },
    renderCKEditor2() {
      for (const name in window.CKEDITOR.instances) {
        if (!["titleEditor", "analysisEditor"].includes(name)) {
          window.CKEDITOR.instances[name].destroy();
        }
      }
      let vm = this;
      this.$nextTick(() => {
        // title
        window.CKEDITOR.replace(
          "titleEditor1",
          Object.assign(ckeditorConfig, {
            height: 100,
            width: 800
          })
        );
        window.CKEDITOR.instances["titleEditor1"].setData(
          this.process2ckeditor1(this.sonSubjectForm.title)
        );
        window.CKEDITOR.instances["titleEditor1"].on("change", function(event) {
          vm.sonSubjectForm.title = this.getData();
        });
        // answer
        if (
          this.sonSubjectForm.tSubject != 1 &&
          this.sonSubjectForm.tSubject != 2 &&
          this.sonSubjectForm.tSubject != 3 &&
          this.sonSubjectForm.tSubject != 4 &&
          this.sonSubjectForm.tSubject != 5 &&
          this.sonSubjectForm.tSubject != 11
        ) {
          window.CKEDITOR.replace(
            "answer1",
            Object.assign(ckeditorConfig, {
              width: 800,
              height: 100
            })
          );
          window.CKEDITOR.instances["answer1"].setData(
            this.process2ckeditor1(this.sonSubjectForm.answer)
          );
          window.CKEDITOR.instances["answer1"].on("change", function(event) {
            vm.sonSubjectForm.answer = this.getData();
          });
        }
        // analyse
        window.CKEDITOR.replace(
          "analysisEditor1",
          Object.assign(ckeditorConfigN, {
            height: 100,
            width: 800
          })
        );
        window.CKEDITOR.instances["analysisEditor1"].setData(
          this.process2ckeditor1(this.sonSubjectForm.analyse)
        );
        window.CKEDITOR.instances["analysisEditor1"].on("change", function(
          event
        ) {
          vm.sonSubjectForm.analyse = this.getData();
        });
        // options
        if (
          this.sonSubjectForm.tSubject == 1 ||
          this.sonSubjectForm.tSubject == 2 ||
          this.sonSubjectForm.tSubject == 3 ||
          this.sonSubjectForm.tSubject == 4
        ) {
          for (let i = 0; i < this.sonSubjectForm.answerList.length; i++) {
            let id = i + "Editor1";
            let option = this.sonSubjectForm.answerList[i];
            if (option.sDelFlag == 1) {
              window.CKEDITOR.replace(
                id,
                Object.assign(ckeditorConfigN, {
                  height: 50,
                  width: 734
                })
              );
              window.CKEDITOR.instances[id].setData(
                this.process2ckeditor1(option.aText)
              );
              window.CKEDITOR.instances[id].on("change", function(event) {
                option.aText = this.getData();
              });
            }
          }
        }
      });
    },
    process2ckeditor1(content) {
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
        this.sonSubjectForm.answerList.splice(
          this.sonSubjectForm.answerList.indexOf(option),
          1
        );
      }
      let num = 65; // 'A'
      for (let i = 0; i < this.sonSubjectForm.answerList.length; i++) {
        let option = this.sonSubjectForm.answerList[i];
        if (option.sDelFlag === 1) {
          let op = String.fromCharCode(num++);
          option.aOption = op;
        }
      }
    },
    // 添加选项
    addOption() {
      let num = 65;
      for (let i = 0; i < this.sonSubjectForm.answerList.length; i++) {
        let option = this.sonSubjectForm.answerList[i];
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
      this.sonSubjectForm.answerList.push(option);
      let id = this.sonSubjectForm.answerList.length - 1 + "Editor1";
      if (window.CKEDITOR.instances[id]) {
        window.CKEDITOR.instances[id].destroy();
      }
      this.$nextTick(() => {
        window.CKEDITOR.replace(
          id,
          Object.assign(ckeditorConfigN, {
            height: 50,
            width: 734
          })
        );
        window.CKEDITOR.instances[id].on("change", function(event) {
          option.aText = this.getData();
        });
      });
    },
    // 保存小题
    addSonSubjectSure() {
      if (!this.sonSubjectForm.title) {
        this.$message({
          message: "请输入题目",
          type: "warning"
        });
        return;
      }
      // 校验单选，多选，判断题
      if (
        this.sonSubjectForm.tSubject == 1 ||
        this.sonSubjectForm.tSubject == 2 ||
        this.sonSubjectForm.tSubject == 3
      ) {
        for (var i = 0; i < this.sonSubjectForm.answerList.length; i++) {
          if (this.sonSubjectForm.answerList[i].aText.trim().length === 0) {
            this.$message({
              message: "选项内容不能为空",
              type: "warning"
            });
            return;
          }
          let option = this.sonSubjectForm.answerList[i];
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

      // 校验解答题,阅读理解
      if (
        this.sonSubjectForm.tSubject == 5 ||
        this.sonSubjectForm.tSubject == 11
      ) {
        this.sonSubjectForm.answerList = [];
      }

      // this.handleInputConfirm();

      // 校验完成  保存小题到store中
      let jsonStr = {};
      let data = {};
      jsonStr.title = this.sonSubjectForm.title;
      jsonStr.analyse = this.sonSubjectForm.analyse;
      jsonStr.answer = this.sonSubjectForm.answer;
      jsonStr.tipsText = this.tipTags.join(",");
      jsonStr.learnPort = this.tipTags.join(",");
      jsonStr.tSubject = this.sonSubjectForm.tSubject;
      jsonStr.difficultyLevel = this.sonSubjectForm.difficultyLevel;
      jsonStr.answerList = this.sonSubjectForm.answerList;
      // let url = "";
      if (this.sonSubjectForm.id > 0) {
        // 编辑
        jsonStr.id = this.sonSubjectForm.id;
        jsonStr.parentId = this.row.id;
        let arr = [];
        arr.push(jsonStr);
        data.jsonStr = JSON.stringify(arr);
        axios
          .request({
            method: "post",
            url: "/subject/subjectBank/update",
            data
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.$emit("onSonEdit", ret.data);
              this.$message({
                type: "success",
                message: "小题修改成功!"
              });
            } else {
              this.$message({
                type: "warning",
                message: `${ret.msg}`
              });
            }
          });
        // console.log("编辑大题时编辑小题");
      } else {
        if (this.addSonFlag === 1) {
          // console.log("---------大题编辑时新增小题---------");
          // 调用接口新增  接口返回小题数据  this.$emit("newData", jsonStr)
          jsonStr.parentId = this.row.id;
          let arr = [];
          arr.push(jsonStr);
          data.jsonStr = JSON.stringify(arr);
          data.libId = this.row.slsSblId;
          axios
            .request({
              method: "post",
              url: "/subject/subjectBankLibrary/saveItemBatchSubject",
              data
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$emit("newData", ret.data[0]);
                this.$message({
                  type: "success",
                  message: "添加成功!"
                });
              } else {
                this.$message({
                  type: "warning",
                  message: `${ret.msg}`
                });
              }
            });
          this.sonSubjectForm = {
            id: "",
            difficultyLevel: "0",
            tSubject: "2",
            title: "",
            analyse: "",
            answer: "",
            answerList: [{ aOption: "A", aText: "", sDelFlag: 1 }]
          };
          this.renderCKEditor2();
          return;
        }
        // console.log("---------大题新增时新增或编辑小题---------");
        jsonStr.status = 2;
        jsonStr.index = this.index;
        this.$emit("onSonEdit", jsonStr);
      }
    },
    formatType(type) {
      return common.typeFormat(type);
    },
    selectable() {
      let uid = this.$store.state.user.userId;
      let roleId = this.$store.state.user.currentRole.roleId;
      if (
        // this.sonSubjectForm.review != 1&&
        this.sonSubjectForm.uid === uid ||
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
  .headItems {
    display: flex;
    align-items: center;
  }
  .add-subject-form-options1 {
    width: 100%;
    padding-right: 0;
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
</style>
