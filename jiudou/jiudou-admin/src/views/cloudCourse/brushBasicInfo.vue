<template>
  <div class="basicInfo-brush">
    <el-form
      :model="basicForm"
      :rules="basicRules"
      ref="basicForm"
      label-width="120px"
      @submit.native.prevent
    >
      <el-form-item label="练习名称" prop="ccourseName">
        <el-input
          size="small"
          v-model="basicForm.ccourseName"
          autocomplete="off"
          style="width: 350px"
        ></el-input>
        <div class="inputTips">与内容相关的名字，便于学生查找</div>
      </el-form-item>
      <el-form-item label="分类" prop="ccourseSort">
        <el-select
          size="small"
          v-model="basicForm.ccourseSort"
          placeholder="请选择分类"
        >
          <el-option label="期末考" value="1"></el-option>
          <el-option label="四六级" value="2"></el-option>
          <el-option label="考研类" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师">
        <el-input
          size="small"
          v-model="basicForm.ccourseTeacherName"
          autocomplete="off"
          style="width: 350px"
        ></el-input>
        <div class="inputTips">
          此内容将展示在APP课程介绍里，可用真实姓名、笔名、网名等
        </div>
      </el-form-item>
      <el-form-item label="封面">
        <el-upload
          :multiple="false"
          :with-credentials="true"
          class="avatar-uploader"
          action=""
          :auto-upload="true"
          :http-request="uploadSectionFile"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false"
        >
          <img
            v-if="basicForm.coverPFile"
            :src="basicForm.coverPFile"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!-- <el-button
                    @click="viewImg(basicForm.coverPFile)"
                    v-if="basicForm.coverPFile"
                    type="text"
                    size="small"
                    >预览</el-button
                  > -->
        <!-- <img
          v-if="basicForm.coverPFile"
          :src="basicForm.coverPFile"
          alt=""
          class="userPic"
          style="width:130px;height:71px;cursor: pointer;"
          @click="cropperClick"
        />
        <img
          v-else
          src="@/assets/images/cloudCourseCover.png"
          alt=""
          class="userPic"
          style="width:130px;height:71px;cursor: pointer;"
          @click="cropperClick"
        />
        <div class="inputTips">大小不超过1M</div> -->
      </el-form-item>
      <el-form-item label="介绍" prop="ccourseIntro">
        <textarea id="ccourseIntro"></textarea>
      </el-form-item>
    </el-form>

    <el-form
      :model="basicMoreForm"
      ref="basicMoreForm"
      label-width="120px"
      @submit.native.prevent
    >
      <!-- <el-form-item label="云课分类">
        <el-select
          v-model="basicMoreForm.ccourseType"
          placeholder="云课类型"
          size="small"
          style="width:200px;"
        >
          <el-option
            v-for="type in cloudCourseType"
            :key="type.type"
            :label="type.name"
            :value="type.type"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="标签" class="courseTag">
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
          maxlength="10"
          show-word-limit
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <i v-else class="button-new-tag el-icon-plus" @click="showInput"></i>
        <div class="inputTips">
          标签将展示在APP课程介绍里，便于学员搜索和推荐，最多5个
        </div>
      </el-form-item>
      <el-form-item label="是否收费">
        <el-radio-group v-model="basicMoreForm.ccourseFeeType">
          <el-radio :label="0">免费</el-radio>
          <el-radio :label="1">收费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="价格" v-if="basicMoreForm.ccourseFeeType == 1">
        ￥<el-input
          size="small"
          v-model="basicMoreForm.ccoursePrice"
          :change="checkPrice()"
          maxlength="8"
          show-word-limit
          autocomplete="off"
          style="width: 200px"
        ></el-input>
        <div class="inputTips">
          平台当前只提供人民币交易，价格单位为：元
        </div>
      </el-form-item>
    </el-form>
    <!-- <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="基本信息" name="first">
        <el-form
          :model="basicForm"
          :rules="basicRules"
          ref="basicForm"
          label-width="120px"
        >
          <el-form-item label="课程名称" prop="ccourseName">
            <el-input
              size="small"
              v-model="basicForm.ccourseName"
              autocomplete="off"
              style="width: 350px"
              maxlength="26"
              show-word-limit
            ></el-input>
            <div class="inputTips">与内容相关的名字，便于学生查找</div>
          </el-form-item>
          <el-form-item label="课程类型" prop="ccourseSort">
            <el-select
              size="small"
              v-model="basicForm.ccourseSort"
              placeholder="请选择类型"
            >
              <el-option label="云课" value="1"></el-option>
              <el-option label="习题全解" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="老师">
            <el-input
              size="small"
              v-model="basicForm.ccourseTeacherName"
              autocomplete="off"
              style="width: 350px"
              maxlength="10"
              show-word-limit
            ></el-input>
            <div class="inputTips">
              此内容将展示在APP课程介绍里，可用真实姓名、笔名、网名等
            </div>
          </el-form-item>
          <el-form-item label="课程封面">
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
              src="@/assets/images/cloudCourseCover.png"
              alt=""
              class="userPic"
              style="width:130px;height:71px;cursor: pointer;"
              @click="cropperClick"
            />
            <div class="inputTips">大小不超过1M</div>
          </el-form-item>
          <el-form-item label="课程介绍" prop="ccourseIntro">
            <textarea id="ccourseIntro"></textarea>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item
        v-if="newCourseType != 1"
        title="更多信息"
        name="second"
      >
        <el-form :model="basicMoreForm" ref="basicMoreForm" label-width="120px">
          <el-form-item label="云课分类">
            <el-select
              v-model="basicMoreForm.ccourseType"
              placeholder="云课类型"
              size="small"
              style="width:200px;"
            >
              <el-option
                v-for="type in cloudCourseType"
                :key="type.type"
                :label="type.name"
                :value="type.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程标签" class="courseTag">
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
              maxlength="10"
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
              标签将展示在APP课程介绍里，便于学员搜索和推荐，最多5个
            </div>
          </el-form-item>
          <el-form-item label="课程类型">
            <el-radio-group v-model="basicMoreForm.ccourseFeeType">
              <el-radio :label="0">免费</el-radio>
              <el-radio :label="1">收费</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="价格" v-if="basicMoreForm.ccourseFeeType == 1">
            ￥<el-input
              size="small"
              v-model="basicMoreForm.ccoursePrice"
              :change="checkPrice()"
              maxlength="8"
              show-word-limit
              autocomplete="off"
              style="width: 200px"
            ></el-input>
            <div class="inputTips">
              平台当前只提供人民币交易，价格单位为：元
            </div>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse> -->
    <div class="saveBookInfo">
      <!-- <el-button type="primary" :loading="nextStepLoading" @click="saveBookInfo">{{newCourseType == 1 ? "保存" : "下一步"}}</el-button> -->
      <el-button
        type="primary"
        :loading="nextStepLoading"
        @click="saveBookInfo"
        >{{ currentCourseId ? "下一步" : "下一步" }}</el-button
      >
    </div>
    <!-- 绑定题库 -->
    <el-dialog
      :visible.sync="isBindTikuShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>绑定题库</div>
        </div>
      </template>
      <!-- <span style="padding-left:75px">选择题库：</span> -->
      <div style="margin-top: 20px;text-align: center;">
        <!-- <el-radio v-model="tikuType" label="0">公共题库</el-radio> -->
        <!-- <el-radio v-model="tikuType" label="1">机构题库</el-radio> -->
        <!-- <el-select size="small" v-model="tikuType" @change="tikuTypeChange">
            <el-option label="公共题库" value="0"></el-option>
            <el-option label="机构题库" value="1"></el-option>
          </el-select> -->
      </div>
      <div style="margin-top: 20px;text-align: center;">
        <!-- @change="officialTikuChange" -->
        <el-cascader
          style="width:215px"
          size="small"
          v-if="tikuType == 1"
          placeholder="请选择机构题库"
          :key="isResourceShow"
          :options="officialTikuList"
          :props="officialProps"
          v-model="selectedOfficialTiku"
          clearable
        ></el-cascader>
        <el-cascader
          v-else
          style="width:215px"
          size="small"
          :clearable="true"
          placeholder="请选择公共题库"
          v-model="selectedTiku"
          :props="props"
          :options="tikuList"
          @change="handleChange"
        ></el-cascader>
      </div>
      <!-- <div
          v-if="tikuBindCode"
          style="margin-top: 20px;display:flex;justify-content:center"
        >
          <vue-qr
            :text="tikuBindCode"
            colorDark="#000"
            colorLight="#fff"
            :margin="0"
            :size="120"
          ></vue-qr>
        </div> -->
      <span slot="footer">
        <el-button
          :disabled="isDisabled"
          size="small"
          type="primary"
          @click="saveBrush"
          >确定</el-button
        >
        <el-button size="small" @click="isBindTikuShow = false">取消</el-button>
      </span>
    </el-dialog>

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
import ckeditorConfig from "@/config/ckeditor_config.js";
import cropper from "@/components/cropper";
import common from "@/utils/common";
export default {
  components: {
    cropper
  },
  props: {
    ccourseId: "",
    nextStepSave: "",
    libId: ""
  },
  data() {
    return {
      isDisabled: false,
      tikuType: "0",
      selectedTiku: [],
      selectedOfficialTiku: 0,
      isBindTikuShow: false,
      commonList: [],
      tikuList: [],
      officialTikuList: [],
      // libId: 0,
      sblCourseId: 0,
      props: {
        value: "sblId",
        label: "name"
      },
      officialProps: {
        value: "id",
        label: "sblName",
        checkStrictly: true,
        emitPath: false
      },
      newCourseType: "", // 地址栏拿到是属于班课的新建还是云课的新建
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      cloudCourseType: common.cloudCourseType,
      exampleImageSrc: "",
      showCropper: false,
      activeName: "first",
      basicForm: {
        ccourseName: "",
        ccourseTeacherName: "",
        coverPFile: "",
        ccourseIntro: "",
        ccourseSort: "1"
      },
      basicRules: {
        ccourseName: [
          { required: true, message: "请输入刷题练习名称", trigger: "click" }
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
        // this.libId = this.$route.query.libId;
        this.loadCourseDetail();
      }
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      let isPic = file.type.includes("image");
      if (!isPic) {
        this.$message({
          type: "warning",
          message: "只支持上传图片"
        });
        return;
      }

      return isPic;
    },
    // 上传图片
    uploadSectionFile(params) {
      this.basicForm.coverPFile = params;
      axios
        .request({
          method: "post",
          url: `/exam/masterHead/getUploadCosPath`
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let { cosPath, dev } = ret.data;
            const form = new FormData();
            // 文件对象
            form.append("file", params.file);
            form.append("cosPath", cosPath);
            form.append("dev", dev);
            axios
              .request({
                method: "post",
                url: `${process.env.BASE_URL_V3}/common/feign/upload/uploadImg`,
                data: form
              })
              .then(res => {
                if (res.status === 200) {
                  let { accessUrl } = res.data;
                  this.basicForm.coverPFile = accessUrl;
                } else {
                  this.$message({
                    type: "warning",
                    message: "图片上传失败"
                  });
                }
              });
          }
        });
    },
    getOfficialTikuList() {
      axios
        .request({
          method: "post",
          url: "/v1/subjectBankLibrary/getTKSubjectList"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.officialTikuList = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getTikuList() {
      this.tikuList = [];
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/commonList"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.commonList = ret.data;
            let banks = [];
            ret.data.forEach(element => {
              let flag = 0;
              for (let i = 0; i < banks.length; i++) {
                let temp = banks[i];
                if (temp.subjectId == element.sblSubjectId) {
                  temp.children.push({
                    sblId: element.id,
                    name: element.sblName
                  });
                  flag = 1;
                  break;
                }
              }
              if (flag == 0) {
                banks.push({
                  subjectId: element.sblSubjectId,
                  name: element.sblSubjectName,
                  children: [
                    {
                      sblId: element.id,
                      name: element.sblName
                    }
                  ]
                });
              }
            });
            banks.sort((a, b) => a.subjectId - b.subjectId);
            this.tikuList = banks;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //课程标签的三个方法
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      if (this.dynamicTags.length < 5) {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      } else {
        this.$message({
          type: "warning",
          message: "标签最多5个"
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
          url: "/subject/exerciseSubject/queryById",
          data: {
            libId: this.libId,
            exerciseId: this.currentCourseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // this.currentCourseId = ret.data.ccourseId
            this.basicForm.ccourseName = ret.data.name;
            this.basicForm.ccourseTeacherName = ret.data.teacherName;
            this.basicForm.coverPFile = ret.data.cover;
            this.basicForm.ccourseSort = String(ret.data.type);
            this.sblCourseId = ret.data.sblCourseId;
            this.selectedTiku = [undefined, ret.data.sblIdId];

            if (ret.data.tags) {
              this.dynamicTags = ret.data.tags.split(",");
            }
            this.basicMoreForm.ccourseFeeType = ret.data.feeType;
            this.basicMoreForm.ccoursePrice = ret.data.price / 100;
            if (ret.data.isOn == 1) {
              this.isDisabled = true;
            }

            // if (CKEDITOR.instances['ccourseIntro']) {
            //   CKEDITOR.instances['ccourseIntro'].destroy()
            // }
            CKEDITOR.replace(
              "ccourseIntro",
              Object.assign(ckeditorConfig, {
                height: "100%"
              })
            );
            CKEDITOR.instances["ccourseIntro"].setData(
              ret.data.intro ? ret.data.intro : ""
            );
          }
        });
    },
    saveBookInfo(el) {
      // this.nextStepLoading = true;
      this.$refs["basicForm"].validate(valid => {
        if (valid) {
          if (this.basicForm.ccourseName.split(" ").join("").length == 0) {
            this.$message({
              type: "warning",
              message: "请输入课程名称"
            });
            this.nextStepLoading = false;
            return;
          }
          // let fd = new FormData();
          // let url = "";
          if (
            this.basicMoreForm.ccourseFeeType == 1 &&
            this.basicMoreForm.ccoursePrice == 0
          ) {
            this.$message({
              type: "warning",
              message: "当选择收费时，价格不能为0"
            });
            this.nextStepLoading = false;
            return;
          }
          // this.nextStepLoading = false;
          this.isBindTikuShow = true;
          //   if (this.currentCourseId) {
          //     fd.append("cCId", this.currentCourseId);
          //     url = "v1/cCourse/updateCC/cCIntro"; // 编辑
          //     fd.append("cCourseName", this.basicForm.ccourseName);
          //     fd.append("ccourseSort", this.basicForm.ccourseSort);
          //     if (this.basicForm.ccourseTeacherName) {
          //       fd.append("teacherCName", this.basicForm.ccourseTeacherName);
          //     }
          //     if (CKEDITOR.instances.ccourseIntro.getData()) {
          //       fd.append(
          //         "cCourseIntro",
          //         CKEDITOR.instances.ccourseIntro.getData()
          //       );
          //     }
          //     if (this.newCourseType != 1) {
          //       fd.append("cCourseType", this.basicMoreForm.ccourseType);
          //       fd.append("cCFeeType", this.basicMoreForm.ccourseFeeType);
          //       fd.append("cCourseTags", this.dynamicTags.join(","));
          //     }
          //     if (this.basicMoreForm.ccourseFeeType === 1) {
          //       fd.append(
          //         "cCoursePrice",
          //         Math.round(this.basicMoreForm.ccoursePrice * 100)
          //       );
          //     }
          //   } else {
          //     url = "v1/cCourse/addCCourse/baseInfo"; // 新建
          //     if (this.newCourseType == 1) {
          //       // 新建班课
          //       fd.append("cmainIsClass", 1);
          //     } else {
          //       // 新建云课
          //       fd.append("cmainIsClass", 0);
          //       fd.append("ccourseType", this.basicMoreForm.ccourseType);
          //       fd.append("ccourseFeeType", this.basicMoreForm.ccourseFeeType);
          //       fd.append("ccourseTags", this.dynamicTags.join(","));
          //     }
          //     fd.append("ccourseName", this.basicForm.ccourseName);
          //     fd.append("ccourseSort", this.basicForm.ccourseSort);
          //     if (this.basicForm.ccourseTeacherName) {
          //       fd.append(
          //         "ccourseTeacherName",
          //         this.basicForm.ccourseTeacherName
          //       );
          //     }
          //     if (CKEDITOR.instances.ccourseIntro.getData()) {
          //       fd.append(
          //         "ccourseIntro",
          //         CKEDITOR.instances.ccourseIntro.getData()
          //       );
          //     }
          //     if (this.basicMoreForm.ccourseFeeType === 1) {
          //       fd.append(
          //         "ccoursePrice",
          //         Math.round(this.basicMoreForm.ccoursePrice * 100)
          //       );
          //     }
          //   }
          //   if (this.file) {
          //     fd.append("coverPFile", this.file, this.file.name);
          //   }
          //   axios
          //     .request({
          //       method: "post",
          //       url: url,
          //       data: fd
          //     })
          //     .then(res => {
          //       let ret = res.data;
          //       setTimeout(() => {
          //         this.nextStepLoading = false;
          //       }, 500);
          //       if (ret.code === 200) {
          //         if (!this.currentCourseId) {
          //           this.currentCourseId = ret.data;
          //           var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
          //           var cEvent = new CountEvent("create_class_course");
          //           window.JAnalyticsInterface.onEvent(cEvent);
          //           this.$emit("addSuccess", this.currentCourseId);
          //         } else {
          //           this.$emit("saveSuccess", this.currentCourseId);
          //         }
          //         this.bus.$emit("coursename", this.basicForm.ccourseName);
          //         if (el == 0) {
          //           this.$message({
          //             type: "success",
          //             message: "保存成功"
          //           });
          //         }
          //       } else {
          //         this.$message({
          //           type: "warning",
          //           message: ret.msg
          //         });
          //       }
          //     })
          //     .catch(() => {
          //       this.nextStepLoading = false;
          //       this.$message({
          //         type: "warning",
          //         message: "新建云课服务不可用"
          //       });
          //     });
          // } else {
          //   if (el == 0) {
          //     this.$message({
          //       type: "warning",
          //       message: "请在课程介绍输入课程名称并保存"
          //     });
          //   }
          //   this.nextStepLoading = false;
          //   this.activeName = "first";
        }
      });
    },
    handleChange(value) {
      this.sblCourseId = this.getSblSubjectId(value[1]);
    },
    getSblSubjectId(sblId) {
      for (let i = 0; i < this.commonList.length; i++) {
        let item = this.commonList[i];
        console.log(this.selectedTiku[1]);
        if (item.id == sblId) {
          return item.sblCourseId;
        }
      }
      return undefined;
    },
    // 创建或更新刷题练习
    saveBrush() {
      let uid = this.$store.state.user.userId;
      let url = "/subject/exerciseSubject/create";
      let data = {
        name: this.basicForm.ccourseName,
        cover: this.basicForm.coverPFile,
        teacherName: this.basicForm.ccourseTeacherName,
        intro: this.basicForm.ccourseIntro,
        type: this.basicForm.ccourseSort,
        feeType: this.basicMoreForm.ccourseFeeType,
        status: 2,
        memberId: uid
      };
      if (this.basicMoreForm.ccoursePrice) {
        data.price = this.basicMoreForm.ccoursePrice * 100;
      }
      if (this.dynamicTags.length > 0) {
        data.tags = this.dynamicTags.join(",");
      }
      if (CKEDITOR.instances.ccourseIntro.getData()) {
        data.intro = CKEDITOR.instances.ccourseIntro.getData();
      }
      if (this.selectedTiku[1]) {
        data.sblIdId = this.selectedTiku[1];
        data.sblCourseId = this.sblCourseId;
      } else {
        this.$message({
          type: "warning",
          message: "请选择公共题库"
        });
        return;
      }
      if (this.currentCourseId) {
        // 更新
        url = "/subject/exerciseSubject/updateById";
        data.id = this.currentCourseId;
      }
      axios
        .request({
          method: "post",
          url,
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // this.officialTikuList = ret.data;
            this.isBindTikuShow = false;
            this.$router.push({
              path: "/cloudCourse/brush"
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
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
    this.getTikuList();
    this.getOfficialTikuList();
    if (this.$route.query.newCourseType) {
      this.newCourseType = this.$route.query.newCourseType;
    }
    CKEDITOR.replace(
      "ccourseIntro",
      Object.assign(ckeditorConfig, {
        height: "100%"
      })
    );
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
<style lang="scss" scoped>
.basicInfo-brush {
  background: #ffffff;
  min-height: 680px;
  padding: 30px 80px;
  /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/ .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  /deep/ .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  /deep/ .avatar {
    width: 240px;
    height: 100%;
    display: block;
  }
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
