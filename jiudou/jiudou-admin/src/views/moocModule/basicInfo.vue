<template>
  <div class="basicInfo">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="基本信息" name="first">
        <el-form
          :model="basicForm"
          :rules="basicRules"
          ref="basicForm"
          label-width="120px"
        >
          <el-form-item label="慕课名称" prop="name">
            <el-input
              size="small"
              v-model="basicForm.name"
              autocomplete="off"
              style="width: 350px"
              maxlength="50"
              show-word-limit
            ></el-input>
            <div class="inputTips">与内容相关的名字，便于学生查找</div>
          </el-form-item>
          <el-form-item label="教师名称" prop="teacherName">
            <el-input
              size="small"
              v-model="basicForm.teacherName"
              autocomplete="off"
              style="width: 350px"
              maxlength="10"
              show-word-limit
            ></el-input>
            <div class="inputTips">
              此内容将展示在APP课程介绍里，可用真实姓名、笔名、网名等
            </div>
          </el-form-item>
          <el-form-item label="慕课封面">
            <img
              v-if="basicForm.coverPFile"
              :src="basicForm.coverPFile"
              alt=""
              class="userPic"
              style="width:130px;height:71px;cursor: pointer;"
              @click="cropperClick"
            />
            <img
              v-else
              src="@/assets/images/mukeCover.png"
              alt=""
              class="userPic"
              style="width:130px;height:71px;cursor: pointer;"
              @click="cropperClick"
            />
            <div class="inputTips">大小不超过1M</div>
          </el-form-item>
          <!-- <el-form-item label="慕课类型">
            <el-select v-model="basicForm.feeType" placeholder="慕课类型" size="small" style="width:200px;">
              <el-option v-for="type in cloudCourseType" :key="type.type" :label="type.name" :value="type.type"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="慕课标签" class="courseTag">
            <el-tag
              :key="index"
              v-for="(tag, index) in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              maxlength="4"
              show-word-limit
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <i
              v-else
              class="button-new-tag el-icon-plus"
              @click="showInput"
            ></i>
            <div class="inputTips">
              标签将展示在APP课程介绍里，便于学员搜索和推荐，最多3个
            </div>
          </el-form-item>
          <!-- <el-form-item label="总时长">
            <el-input size="small" v-model="basicForm.totalTime" autocomplete="off" style="width: 350px" maxlength="10" show-word-limit></el-input>
          </el-form-item> -->
          <el-form-item label="有效时间" prop="timeGroup">
            <el-date-picker
              v-model="basicForm.timeGroup"
              value-format="timestamp"
              style="width: 400px;"
              type="daterange"
              range-separator="至"
              start-placeholder="开课日期"
              end-placeholder="结课日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="课程介绍" prop="ccourseIntro">
            <!-- <textarea id="ccourseIntro"></textarea> -->
            <textarea
              name="ccourseIntro"
              id="ccourseIntro"
              v-model="basicForm.introText"
            ></textarea>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div class="saveBookInfo">
      <!-- <el-button type="primary" :loading="nextStepLoading" @click="saveBookInfo">{{newCourseType == 1 ? "保存" : "下一步"}}</el-button> -->
      <el-button
        type="primary"
        :loading="nextStepLoading"
        @click="saveBookInfo"
        >{{ currentCourseId ? "保存" : "下一步" }}</el-button
      >
    </div>
    <el-dialog
      :visible.sync="showCropper"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="700px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>封面裁图</div>
        </div>
      </template>
      <cropper
        :src="exampleImageSrc"
        ref="cropper"
        @on-crop="handleCroped"
        :aspectRatio="130 / 71"
      ></cropper>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          @click="toCropper"
          :loading="sureCropLoading"
          >确定</el-button
        >
        <el-button size="small" @click="showCropper = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import CKEDITOR from "CKEDITOR";
import ckeditorConfig from "@/config/ckeditor_config_editor.js";
import cropper from "@/components/cropper";
import common from "@/utils/common";
export default {
  components: {
    cropper
  },
  props: {
    ccourseId: "",
    nextStepSave: ""
  },
  data() {
    return {
      newCourseType: "", // 地址栏拿到是属于班课的新建还是云课的新建
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      cloudCourseType: common.cloudCourseType,
      exampleImageSrc: "",
      showCropper: false,
      activeName: "first",
      basicForm: {
        name: "",
        teacherName: "",
        feeType: "",
        totalTime: "",
        coverPFile: "",
        timeGroup: []
      },
      basicRules: {
        name: [{ required: true, message: "请输入慕课名称", trigger: "blur" }],
        teacherName: [
          { required: true, message: "请输入老师名称", trigger: "blur" }
        ],
        timeGroup: [
          { required: true, message: "请选择有效时间", trigger: "blur" }
        ]
      },
      basicMoreForm: {
        ccourseType: 3,
        ccourseFeeType: 0,
        ccoursePrice: ""
      },
      file: "",
      currentCourseId: "",
      sureCropLoading: false,
      nextStepLoading: false
    };
  },
  watch: {
    ccourseId(value) {
      if (value && value != this.currentCourseId) {
        this.currentCourseId = value;
        this.loadCourseDetail();
      }
    }
  },
  methods: {
    //课程标签的三个方法
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      if (this.dynamicTags.length < 3) {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      } else {
        this.$message({
          type: "warning",
          message: "标签最多3个"
        });
      }
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue.split(" ").join("").length == 0) {
        this.inputVisible = false;
        return;
      }
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    loadCourseDetail() {
      if (CKEDITOR.instances["ccourseIntro"]) {
        CKEDITOR.instances["ccourseIntro"].destroy();
      }
      axios
        .request({
          method: "post",
          url: "openccourse/openCcourse/detail",
          data: {
            id: this.currentCourseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // this.currentCourseId = ret.data.ccourseId
            this.basicForm.name = ret.data.name;
            this.basicForm.teacherName = ret.data.teacherName;
            this.basicForm.coverPFile = ret.data.cover;
            this.basicForm.totalTime = ret.data.totalTime;
            this.basicForm.feeType = ret.data.type;
            if (ret.data.startTime) {
              this.basicForm.timeGroup = [ret.data.startTime, ret.data.endTime];
            }
            if (ret.data.tags) {
              this.dynamicTags = ret.data.tags.split(",");
            }
            this.bus.$emit("coursename", this.basicForm.name);
            // if (CKEDITOR.instances['ccourseIntro']) {
            //   CKEDITOR.instances['ccourseIntro'].destroy()
            // }
            // CKEDITOR.replace('ccourseIntro', Object.assign(ckeditorConfig, {
            //   'height': '100%'
            // }))
            // CKEDITOR.instances['ccourseIntro'].setData(ret.data.introText ? ret.data.introText : '')
            if (ret.data.introText != undefined) {
              this.basicForm.introText = ret.data.introText;
            } else {
              this.basicForm.introText = "";
            }
            for (const name in window.CKEDITOR.instances) {
              window.CKEDITOR.instances[name].destroy();
            }
            var vm = this;
            // title
            this.$nextTick(function() {
              CKEDITOR.replace(
                "ccourseIntro",
                Object.assign(ckeditorConfig, {
                  height: 350
                })
              );
              CKEDITOR.instances["ccourseIntro"].setData(
                this.process2ckeditor(this.basicForm.introText)
              );
              CKEDITOR.instances["ccourseIntro"].on("change", function(event) {
                vm.basicForm.introText = this.getData();
              });
            });
          }
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
    saveBookInfo(el) {
      this.nextStepLoading = true;
      this.$refs["basicForm"].validate(valid => {
        if (valid) {
          if (this.basicForm.name.split(" ").join("").length == 0) {
            this.$message({
              type: "warning",
              message: "请输入课程名称"
            });
            this.nextStepLoading = false;
            return;
          }
          let fd = new FormData();
          let url = "";
          if (this.currentCourseId) {
            fd.append("id", this.currentCourseId);
            url = "/openccourse/openCcourse/update"; // 编辑
            fd.append("name", this.basicForm.name);
            fd.append("teacherName", this.basicForm.teacherName);
            // if(CKEDITOR.instances.ccourseIntro.getData()) {
            //   fd.append('introText', CKEDITOR.instances.ccourseIntro.getData())
            // }
            fd.append("introText", this.basicForm.introText);
            fd.append("tags", this.dynamicTags.join(","));
            if (
              this.basicForm.timeGroup &&
              this.basicForm.timeGroup.length > 0
            ) {
              console.log(this.basicForm.timeGroup);
              var nowdate = new Date();
              if (this.basicForm.timeGroup[1] > nowdate.valueOf()) {
                fd.append("startTime", this.basicForm.timeGroup[0]);
                fd.append("endTime", this.basicForm.timeGroup[1]);
              } else {
                this.$message({
                  type: "warning",
                  message: "有效时间的结束时间要大于当前时间"
                });
                this.nextStepLoading = false;
                return;
              }
            }
          } else {
            url = "openccourse/openCcourse/insert"; // 新建
            fd.append("feeType", this.basicForm.feeType);
            fd.append("tags", this.dynamicTags.join(","));
            fd.append("name", this.basicForm.name);
            // fd.append('totalTime', this.basicForm.totalTime)
            fd.append("teacherName", this.basicForm.teacherName);
            // if(CKEDITOR.instances.ccourseIntro.getData()) {
            //   fd.append('introText', CKEDITOR.instances.ccourseIntro.getData())
            // }
            fd.append("introText", this.basicForm.introText);
            if (
              this.basicForm.timeGroup &&
              this.basicForm.timeGroup.length > 0
            ) {
              console.log(this.basicForm.timeGroup);
              var nowdate1 = new Date();
              if (this.basicForm.timeGroup[1] > nowdate1.valueOf()) {
                fd.append("startTime", this.basicForm.timeGroup[0]);
                fd.append("endTime", this.basicForm.timeGroup[1]);
              } else {
                this.$message({
                  type: "warning",
                  message: "有效时间的结束时间要大于当前时间"
                });
                this.nextStepLoading = false;
                return;
              }
            }
          }
          console.log(this.file);
          if (this.file) {
            fd.append("file", this.file, this.file.name);
          }
          console.log(fd);
          axios
            .request({
              method: "post",
              url: url,
              data: fd
            })
            .then(res => {
              let ret = res.data;
              setTimeout(() => {
                this.nextStepLoading = false;
              }, 500);
              if (ret.code === 200) {
                this.bus.$emit("coursename", this.basicForm.name);
                if (!this.currentCourseId) {
                  this.currentCourseId = ret.data.id;
                  var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
                  var cEvent = new CountEvent("create_muke");
                  window.JAnalyticsInterface.onEvent(cEvent);
                  this.$emit("addSuccess", {
                    id: this.currentCourseId,
                    name: this.basicForm.name
                  });
                } else {
                  this.$emit("saveSuccess", this.currentCourseId);
                }
                if (el == 0) {
                  this.$message({
                    type: "success",
                    message: "保存成功"
                  });
                }
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            })
            .catch(() => {
              this.nextStepLoading = false;
              this.$message({
                type: "warning",
                message: "新建慕课服务不可用"
              });
            });
        } else {
          if (el == 0) {
            this.$message({
              type: "warning",
              message: "请在课程介绍输入课程名称并保存"
            });
          }
          this.nextStepLoading = false;
          this.activeName = "first";
        }
      });
    },
    cropperClick() {
      this.showCropper = true;
      this.$nextTick(() => {
        this.$refs.cropper.clear();
      });
    },
    //父组件调用子组件裁剪方法
    toCropper() {
      this.sureCropLoading = true;
      setTimeout(() => {
        this.$refs.cropper.crop();
      }, 100);
    },
    handleCroped(file) {
      if (file) {
        console.log(file);
        this.file = file;
        this.basicForm.coverPFile = URL.createObjectURL(this.file);
        this.sureCropLoading = false;
        this.showCropper = false;
      } else {
        this.sureCropLoading = false;
      }
    },
    checkPrice() {
      var price = "" + this.basicMoreForm.ccoursePrice;
      price = price
        .replace(/[^\d.]/g, "") // 清除“数字”和“.”以外的字符
        .replace(/\.{2,}/g, ".") // 只保留第一个. 清除多余的
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".")
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
      if (price.indexOf(".") < 0 && price != "") {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        price = parseFloat(price);
      }
      this.basicMoreForm.ccoursePrice = price;
    }
  },
  beforeDestroy() {
    this.bus.$off("canSave");
    CKEDITOR.instances["ccourseIntro"].destroy();
  },
  mounted() {
    if (this.$route.query.newCourseType) {
      this.newCourseType = this.$route.query.newCourseType;
    }
    // CKEDITOR.replace('ccourseIntro', Object.assign(ckeditorConfig, {
    //   'height': '100%'
    // }))
    for (const name in window.CKEDITOR.instances) {
      window.CKEDITOR.instances[name].destroy();
    }
    var vm = this;
    // title
    this.$nextTick(function() {
      CKEDITOR.replace(
        "ccourseIntro",
        Object.assign(ckeditorConfig, {
          height: 350
        })
      );
      CKEDITOR.instances["ccourseIntro"].setData(
        this.process2ckeditor(this.basicForm.introText)
      );
      CKEDITOR.instances["ccourseIntro"].on("change", function(event) {
        vm.basicForm.introText = this.getData();
      });
    });
    this.bus.$on(
      "canSave",
      function(el) {
        if (el) {
          this.saveBookInfo(el);
        }
      }.bind(this)
    );
  }
};
</script>
<style lang="scss">
.basicInfo {
  background: #ffffff;
  min-height: 680px;
  padding: 30px 80px;
  .sub-tabs {
    .el-tab-pane {
      padding-left: 100px;
      .el-form-item__content {
        padding-right: 180px;
      }
    }
  }
  .saveBookInfo {
    width: 100%;
    text-align: center;
    margin-top: 30px;
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
}
</style>
